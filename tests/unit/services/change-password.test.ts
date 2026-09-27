import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { POST } from '@/app/api/admin/change-password/route';
import { ChangePasswordSchema } from '@/app/admin/account/_lib/change-password.schema';
import { AuthService } from '@/lib/services/auth.service';

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }));

const input = { currentPassword: 'original-password', newPassword: 'replacement-password', confirmPassword: 'replacement-password' };
const user = { id: 'admin-a', email: 'admin-a@example.test' };
function client(id = user.id) {
  const single = vi.fn().mockResolvedValue({ data: { role: 'admin' }, error: null });
  const eq = vi.fn().mockReturnValue({ single });
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { ...user, id } }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { ...user, id }, session: { access_token: 'temporary' } }, error: null }),
      updateUser: vi.fn().mockResolvedValue({ data: { user: { ...user, id } }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq }) }),
    single, eq,
  };
}
function request(body: unknown = input, token = 'valid-token', headers: Record<string, string> = {}) {
  return new Request('https://example.test/api/admin/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    body: JSON.stringify(body),
  });
}

let verifier: ReturnType<typeof client>;
let account: ReturnType<typeof client>;
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-test-key');
  verifier = client();
  account = client();
  vi.mocked(createClient).mockReset().mockReturnValueOnce(verifier as unknown as ReturnType<typeof createClient>).mockReturnValueOnce(account as unknown as ReturnType<typeof createClient>);
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('ChangePasswordSchema', () => {
  it.each([
    { ...input, currentPassword: '' },
    { ...input, newPassword: 'short' },
    { ...input, confirmPassword: 'different' },
    { ...input, newPassword: input.currentPassword, confirmPassword: input.currentPassword },
    { ...input, userId: 'admin-b' },
    { ...input, email: 'admin-b@example.test' },
    { ...input, role: 'admin' },
  ])('rejects invalid or extra input %#', (body) => {
    expect(ChangePasswordSchema.safeParse(body).success).toBe(false);
  });
  it('does not trim passwords', () => {
    const body = { ...input, newPassword: '  password with spaces  ', confirmPassword: '  password with spaces  ' };
    expect(ChangePasswordSchema.parse(body)).toEqual(body);
  });
});

describe('POST change-password', () => {
  it('updates only the verified account, cleans temporary session and disables caching', async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(verifier.auth.getUser).toHaveBeenCalledWith('valid-token');
    expect(verifier.eq).toHaveBeenCalledWith('id', user.id);
    expect(account.auth.signInWithPassword).toHaveBeenCalledWith({ email: user.email, password: input.currentPassword });
    expect(account.auth.updateUser).toHaveBeenCalledWith({ password: input.newPassword });
    expect(account.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(createClient).toHaveBeenNthCalledWith(2, 'https://example.supabase.co', 'public-test-key', {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  });
  it('rejects missing tokens before contacting Supabase', async () => {
    expect((await POST(request(input, ''))).status).toBe(401);
    expect(createClient).not.toHaveBeenCalled();
  });
  it('rejects invalid sessions', async () => {
    verifier.auth.getUser.mockResolvedValue({ data: { user }, error: { message: 'invalid' } } as never);
    expect((await POST(request())).status).toBe(401);
    expect(account.auth.updateUser).not.toHaveBeenCalled();
  });
  it.each(['staff', 'user'])('rejects %s roles', async (role) => {
    verifier.single.mockResolvedValue({ data: { role }, error: null });
    expect((await POST(request())).status).toBe(403);
    expect(account.auth.signInWithPassword).not.toHaveBeenCalled();
  });
  it('fails closed when profile lookup fails', async () => {
    verifier.single.mockResolvedValue({ data: null, error: { message: 'offline' } } as never);
    expect((await POST(request())).status).toBe(403);
    expect(account.auth.updateUser).not.toHaveBeenCalled();
  });
  it('rejects a revoked admin role after reauthentication', async () => {
    account.single.mockResolvedValue({ data: { role: 'user' }, error: null });
    expect((await POST(request())).status).toBe(403);
    expect(account.auth.updateUser).not.toHaveBeenCalled();
    expect(account.auth.signOut).toHaveBeenCalled();
  });
  it.each([{ userId: 'admin-b' }, { email: 'admin-b@example.test' }, { role: 'admin' }])('rejects target injection %j', async (extra) => {
    expect((await POST(request({ ...input, ...extra }))).status).toBe(400);
    expect(account.auth.signInWithPassword).not.toHaveBeenCalled();
  });
  it('rejects a mismatched account ID after reauthentication', async () => {
    account.auth.signInWithPassword.mockResolvedValue({ data: { user: { ...user, id: 'admin-b' }, session: { access_token: 'temporary' } }, error: null });
    expect((await POST(request())).status).toBe(403);
    expect(account.auth.updateUser).not.toHaveBeenCalled();
    expect(account.auth.signOut).toHaveBeenCalled();
  });
  it('rejects an incorrect current password', async () => {
    account.auth.signInWithPassword.mockResolvedValue({ data: { user: null, session: null }, error: { status: 400 } } as never);
    expect((await POST(request())).status).toBe(400);
    expect(account.auth.updateUser).not.toHaveBeenCalled();
  });
  it('reports provider throttling', async () => {
    account.auth.signInWithPassword.mockResolvedValue({ data: { user: null }, error: { status: 429 } } as never);
    expect((await POST(request())).status).toBe(429);
    expect(account.auth.updateUser).not.toHaveBeenCalled();
  });
  it('handles update failure without leaking provider details', async () => {
    account.auth.updateUser.mockResolvedValue({ data: { user: null }, error: { status: 500, message: 'private-details' } } as never);
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('private-details');
    expect(account.auth.signOut).toHaveBeenCalled();
  });
  it('does not report failed password change when temporary signout fails', async () => {
    account.auth.signOut.mockRejectedValue(new Error('network'));
    expect((await POST(request())).status).toBe(200);
  });
  it('rejects cross-origin requests', async () => {
    expect((await POST(request(input, 'valid', { Origin: 'https://elsewhere.test' }))).status).toBe(403);
    expect(createClient).not.toHaveBeenCalled();
  });
  it('rejects malformed JSON', async () => {
    const req = new Request('https://example.test/api/admin/change-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer valid-token' }, body: '{',
    });
    expect((await POST(req)).status).toBe(400);
    expect(account.auth.updateUser).not.toHaveBeenCalled();
  });
  it('rejects oversized bodies without a content-length header', async () => {
    expect((await POST(request({ ...input, currentPassword: 'x'.repeat(17000) }))).status).toBe(413);
    expect(account.auth.signInWithPassword).not.toHaveBeenCalled();
    expect(account.auth.updateUser).not.toHaveBeenCalled();
  });
  it('isolates overlapping requests by creating separate clients', async () => {
    const secondVerifier = client('admin-b');
    const secondAccount = client('admin-b');
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => { release = resolve; });
    verifier.auth.getUser.mockImplementation(async () => { await gate; return { data: { user }, error: null }; });
    vi.mocked(createClient).mockReset()
      .mockReturnValueOnce(verifier as unknown as ReturnType<typeof createClient>)
      .mockReturnValueOnce(secondVerifier as unknown as ReturnType<typeof createClient>)
      .mockReturnValueOnce(secondAccount as unknown as ReturnType<typeof createClient>)
      .mockReturnValueOnce(account as unknown as ReturnType<typeof createClient>);
    const first = POST(request());
    const secondInput = { ...input, newPassword: 'second-admin-password', confirmPassword: 'second-admin-password' };
    expect((await POST(request(secondInput, 'second-token'))).status).toBe(200);
    release();
    expect((await first).status).toBe(200);
    expect(account.auth.updateUser).toHaveBeenCalledWith({ password: input.newPassword });
    expect(secondAccount.auth.updateUser).toHaveBeenCalledWith({ password: secondInput.newPassword });
  });
});

describe('AuthService.changeOwnPassword', () => {
  it('sends only validated fields and the current bearer token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ message: 'ok' }));
    vi.stubGlobal('fetch', fetchMock);
    const service = new AuthService({ auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'current' } }, error: null }) } } as unknown as SupabaseClient);
    await service.changeOwnPassword(input);
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/change-password', expect.objectContaining({
      method: 'POST', body: JSON.stringify(input), headers: { 'Content-Type': 'application/json', Authorization: 'Bearer current' },
    }));
  });
  it('rejects a missing session without sending passwords', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const service = new AuthService({ auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }) } } as unknown as SupabaseClient);
    await expect(service.changeOwnPassword(input)).rejects.toThrow('Sign in again');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

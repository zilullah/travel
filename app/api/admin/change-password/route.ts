import { createClient, type AuthError } from '@supabase/supabase-js';
import { ChangePasswordSchema } from '@/app/admin/account/_lib/change-password.schema';

function reply(status: number, message: string) {
  return Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

function authFailure(error: AuthError, fallback: string) {
  if (error.status === 429) return reply(429, 'Too many attempts. Wait a moment before trying again.');
  if (error.status && error.status >= 500) return reply(503, 'Authentication service unavailable. Try again later.');
  if (error.code === 'weak_password') return reply(400, 'Choose a stronger password that meets your account password policy.');
  if (error.code === 'same_password') return reply(400, 'Choose a different password from your current one.');
  if (error.code === 'reauthentication_needed' || error.code === 'reauthentication_not_valid') {
    return reply(400, 'Sign in again before changing your password.');
  }
  return reply(400, fallback);
}

export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/i)?.[1];
  if (!token) return reply(401, 'Your session has expired. Sign in again.');
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return reply(403, 'Request origin is not allowed.');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return reply(415, 'Send the password form as JSON.');
  }
  if (Number(request.headers.get('content-length')) > 16384) return reply(413, 'Password form is too large.');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return reply(503, 'Authentication service is not configured.');

  try {
    // Request-local clients prevent one admin's session from leaking into another request.
    const auth = { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false };
    const verifier = createClient(url, key, { auth, global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: { user }, error } = await verifier.auth.getUser(token);
    if (error || !user) return reply(401, 'Your session has expired. Sign in again.');
    const { data: profile, error: profileError } = await verifier.from('profiles').select('role').eq('id', user.id).single();
    if (profileError || profile?.role !== 'admin') return reply(403, 'Only administrators can change their password here.');
    if (!user.email) return reply(400, 'This account does not support password sign-in.');

    const reader = request.body?.getReader();
    if (!reader) return reply(400, 'Invalid password form.');
    const decoder = new TextDecoder();
    let text = '';
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        return reply(413, 'Password form is too large.');
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    let body: unknown;
    try { body = JSON.parse(text); } catch { return reply(400, 'Invalid password form.'); }
    const parsed = ChangePasswordSchema.safeParse(body);
    if (!parsed.success) return reply(400, parsed.error.issues[0]?.message || 'Invalid password form.');

    const account = createClient(url, key, { auth });
    const { data: signedIn, error: signInError } = await account.auth.signInWithPassword({
      email: user.email,
      password: parsed.data.currentPassword,
    });
    if (signInError) return authFailure(signInError, 'Current password is incorrect.');

    try {
      if (!signedIn.session || signedIn.user?.id !== user.id) return reply(403, 'Account verification failed. Sign in again.');
      const { data: currentProfile, error: roleError } = await account.from('profiles').select('role').eq('id', user.id).single();
      if (roleError || currentProfile?.role !== 'admin') return reply(403, 'Administrator access is no longer available.');
      const { error: updateError } = await account.auth.updateUser({ password: parsed.data.newPassword });
      if (updateError) return authFailure(updateError, 'Password could not be changed. Try again.');
      return reply(200, 'Password changed. Sign in with your new password.');
    } finally {
      // Revoke the temporary verification session, not sessions on other devices.
      await account.auth.signOut({ scope: 'local' }).catch(() => undefined);
    }
  } catch {
    return reply(503, 'Password change could not be confirmed. Try signing in before submitting again.');
  }
}

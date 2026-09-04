import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '@/lib/services/auth.service';

describe('Service: AuthService & RBAC Role Validation', () => {
  it('should return true for admin role verification', async () => {
    const mockSupabase: any = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'admin-1', email: 'admin@lomboktravel.com' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'admin', full_name: 'Super Admin' },
              error: null,
            }),
          }),
        }),
      }),
    };

    const authService = new AuthService(mockSupabase);
    const isAdmin = await authService.verifyAdminRole();
    expect(isAdmin).toBe(true);
  });

  it('should return false for regular user role', async () => {
    const mockSupabase: any = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-2', email: 'traveler@gmail.com' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'user', full_name: 'John Traveler' },
              error: null,
            }),
          }),
        }),
      }),
    };

    const authService = new AuthService(mockSupabase);
    const isAdmin = await authService.verifyAdminRole();
    expect(isAdmin).toBe(false);
  });

  it('should return null current user when not signed in', async () => {
    const mockSupabase: any = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error('Session missing'),
        }),
      },
    };

    const authService = new AuthService(mockSupabase);
    const user = await authService.getCurrentUser();
    expect(user).toBeNull();
  });
});

import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../domain/package.types';
import { ChangePasswordSchema, type ChangePasswordInput } from '@/app/admin/account/_lib/change-password.schema';

export class AuthService {
  constructor(private supabase: SupabaseClient) {}

  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    if (authError || !user) {
      return null;
    }

    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email || '',
      fullName: profile?.full_name || user.user_metadata?.full_name,
      role: (profile?.role as UserRole) || 'user',
      createdAt: profile?.created_at,
    };
  }

  async verifyAdminRole(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'admin';
  }

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async changeOwnPassword(input: ChangePasswordInput): Promise<void> {
    const parsed = ChangePasswordSchema.safeParse(input);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || 'Invalid password form.');
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error || !session) throw new Error('Your session has expired. Sign in again.');

    const response = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(typeof result?.message === 'string' ? result.message : 'Password change could not be confirmed. Try signing in again.');
    }
  }

  async signOut(scope: 'local' | 'global' = 'global'): Promise<void> {
    const { error } = await this.supabase.auth.signOut({ scope });
    if (error) {
      throw new Error(error.message);
    }
  }
}

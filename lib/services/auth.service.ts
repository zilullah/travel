import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../domain/package.types';

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

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }
}

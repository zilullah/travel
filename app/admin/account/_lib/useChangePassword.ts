'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AuthService } from '@/lib/services/auth.service';
import { supabaseClient } from '@/lib/supabase/client';
import { useAdminAuth } from '../../_context/AdminAuthContext';
import { ChangePasswordSchema, type ChangePasswordInput } from './change-password.schema';

export function useChangePassword() {
  const { user, logout } = useAdminAuth();
  const router = useRouter();
  const submitting = useRef(false);
  const [changed, setChanged] = useState(false);
  const [message, setMessage] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const form = useForm<ChangePasswordInput>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const signOut = async () => {
    setSigningOut(true);
    try {
      await logout('local');
      router.replace('/admin/login?passwordChanged=1');
    } catch {
      setMessage('Password changed, but sign-out failed. Try signing out again.');
    } finally {
      setSigningOut(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => form.handleSubmit(async (values) => {
    if (submitting.current || changed) return;
    form.clearErrors();
    const parsed = ChangePasswordSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        form.setError(issue.path[0] as keyof ChangePasswordInput, { message: issue.message });
      }
      form.setFocus(parsed.error.issues[0].path[0] as keyof ChangePasswordInput);
      return;
    }

    submitting.current = true;
    try {
      await new AuthService(supabaseClient).changeOwnPassword(parsed.data);
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Password change could not be confirmed. Try signing in again.',
      });
      submitting.current = false;
      return;
    }

    form.reset();
    setChanged(true);
    setMessage('Password changed. Signing out...');
    await signOut();
    submitting.current = false;
  })(event);

  return { ...form, submit, signOut, signingOut, user, changed, message };
}

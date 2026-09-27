'use client';

import Link from 'next/link';
import { Button } from '@/app/_components/ui/Button';
import { useChangePassword } from '../_lib/useChangePassword';

const fields = [
  { name: 'currentPassword', label: 'Current password', autoComplete: 'current-password' },
  { name: 'newPassword', label: 'New password', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Confirm new password', autoComplete: 'new-password' },
] as const;

export function ChangePasswordForm() {
  const { register, submit, signOut, signingOut, user, changed, message, formState: { errors, isSubmitting } } = useChangePassword();

  return (
    <section className="mx-auto w-full max-w-xl space-y-6 pb-12">
      <div className="space-y-2">
        <h1 className="break-words text-2xl font-extrabold text-[#082F49] sm:text-3xl">Change Password</h1>
        <p className="text-sm text-[#486581]">Change the password for your own admin account.</p>
        <p className="break-all text-sm font-semibold text-[#082F49]">{user?.email}</p>
      </div>
      {changed ? (
        <div className="space-y-4 rounded-[23px] border border-[#7DD3FC] bg-white p-5 sm:p-6">
          <p role="status" className="text-sm text-[#082F49]">{message}</p>
          <Button type="button" variant="secondary" onClick={signOut} disabled={isSubmitting || signingOut} className="min-h-11 max-w-full whitespace-normal focus-visible:ring-2 focus-visible:ring-[#075985] focus-visible:ring-offset-2">
            Sign out and sign in again
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate aria-busy={isSubmitting} className="space-y-5 rounded-[23px] border border-[#7DD3FC] bg-white p-5 sm:p-6">
          <p id="password-help" className="text-sm text-[#486581]">
            Use at least 12 characters and a different password from your current one. You will sign in again after saving.
          </p>
          {fields.map(({ name, label, autoComplete }) => (
            <div key={name} className="space-y-2">
              <label htmlFor={name} className="block text-sm font-semibold text-[#082F49]">{label}</label>
              <input
                {...register(name)}
                id={name}
                type="password"
                autoComplete={autoComplete}
                required
                maxLength={1024}
                readOnly={isSubmitting}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={`${name === 'newPassword' ? 'password-help ' : ''}${errors[name] ? `${name}-error` : ''}`.trim() || undefined}
                className="min-h-11 w-full rounded-xl border border-[#5B7C93] bg-[#F0F9FF] px-3 py-2 text-base text-[#082F49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075985]"
              />
              {errors[name] && <p id={`${name}-error`} className="text-sm text-rose-700">{errors[name]?.message}</p>}
            </div>
          ))}
          {errors.root && <p role="alert" className="text-sm text-rose-700">{errors.root.message}</p>}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button type="submit" variant="secondary" disabled={isSubmitting} className="min-h-11 max-w-full whitespace-normal focus-visible:ring-2 focus-visible:ring-[#075985] focus-visible:ring-offset-2">
              {isSubmitting ? 'Changing password...' : 'Change Password'}
            </Button>
            <Link href="/admin/packages" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#075985] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075985]">
              Back to dashboard
            </Link>
          </div>
          <p role="status" className="sr-only">{isSubmitting ? 'Changing password. Please wait.' : ''}</p>
        </form>
      )}
    </section>
  );
}

import { z } from 'zod';

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password.').max(1024, 'Password is too long.'),
  newPassword: z.string().min(12, 'Use at least 12 characters.').max(1024, 'Password is too long.'),
  confirmPassword: z.string().min(1, 'Confirm your new password.').max(1024, 'Password is too long.'),
}).strict().superRefine((values, context) => {
  if (values.newPassword === values.currentPassword) {
    context.addIssue({ code: 'custom', path: ['newPassword'], message: 'Choose a different password from your current one.' });
  }
  if (values.newPassword !== values.confirmPassword) {
    context.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match.' });
  }
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

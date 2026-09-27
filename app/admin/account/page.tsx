import type { Metadata } from 'next';
import { ChangePasswordForm } from './_components/ChangePasswordForm';

export const metadata: Metadata = {
  title: 'Account | Lombok Admin',
  description: 'Change the password for your own administrator account.',
  robots: { index: false, follow: false },
  openGraph: { title: 'Account | Lombok Admin', description: 'Administrator account settings.' },
};

export default function AccountPage() {
  return <ChangePasswordForm />;
}

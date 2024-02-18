import Logo from '@/components/ui/logo';
import { Typography } from '@/components/ui/typography';
import ForgotPasswordForm from '../components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto w-full max-w-sm space-y-8 lg:w-96">
      <header className="mb-8 flex flex-col items-center">
        <Logo size={48} variant="isotype" />
        <Typography as="h1" variant="title3" className="mt-4">
          Passwort zurücksetzen
        </Typography>
      </header>

      <ForgotPasswordForm />
    </section>
  );
}

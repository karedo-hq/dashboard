import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import Logo from '@/components/ui/logo';
import { Typography, typographyVariants } from '@/components/ui/typography';
import ForgotPasswordForm from '../components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto w-full max-w-sm space-y-8 lg:w-96">
      <header className="mb-8 flex flex-col items-center">
        <Logo size={48} variant="isotype" />
        <Typography as="h1" variant="title3" className="mt-4">
          Reset password
        </Typography>
      </header>

      <ForgotPasswordForm />

      <footer className="flex flex-col items-center">
        <Link
          href="/auth/login"
          className={cn(typographyVariants({ variant: 'small' }), 'font-medium text-blue-600')}
        >
          Back to login
        </Link>
      </footer>
    </section>
  );
}

import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import Logo from '@/components/ui/logo';
import RegisterForm from '../components/register-form';

export default function RegisterPage() {
  return (
    <section className="mx-auto w-full max-w-sm space-y-8 lg:w-96">
      <header className="flex flex-col items-center">
        <Logo size={48} variant="isotype" />
        <Typography as="h1" variant="title3" className="mt-4">
          Register to Karedo
        </Typography>
      </header>

      <RegisterForm />

      <Typography variant="small" className="flex flex-1 justify-center">
        Already registered?{' '}
        <Link href="/auth/login" className="ml-1 font-medium text-blue-600">
          Login here
        </Link>
      </Typography>
    </section>
  );
}

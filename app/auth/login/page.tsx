import Link from 'next/link';
import LoginForm from '@/auth/components/login-form';
import { Typography } from '@/components/ui/typography';
import Logo from '@/components/ui/logo';

type LoginPageProps = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default function LoginPage(props: LoginPageProps) {
  return (
    <section className="mx-auto w-full max-w-sm space-y-8 lg:w-96">
      <header className="mb-8 flex flex-col items-center">
        <Logo size={48} variant="isotype" />
        <Typography as="h1" variant="title3" className="mt-4">
          Anmelden bei Karedo
        </Typography>
      </header>

      <LoginForm callbackUrl={props.searchParams.callbackUrl} />

      <Typography variant="small" className="flex flex-1 justify-center">
        Du hast noch kein Konto?{' '}
        <Link href="/auth/register" className="ml-1 font-medium text-blue-600">
          Hier registrieren
        </Link>
      </Typography>
    </section>
  );
}

import Link from 'next/link';
import Image from 'next/image';

import LoginForm from '@/auth/components/login-form';
import { Typography } from '@/components/ui/typography';
import Logo from '@/components/ui/logo';
import authBgImg from '../../../public/auth-bg-img.png';

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
          Login to Karedo
        </Typography>
      </header>

      {/* <OAuthForm />

          <AuthMethodSeparator />

          <MagicLinkAuthForm /> */}

      <LoginForm callbackUrl={props.searchParams.callbackUrl} />

      <Typography variant="small" className="flex flex-1 justify-center">
        You do not have an account yet?{' '}
        <Link href="/auth/register" className="ml-1 font-medium text-blue-500">
          Register here
        </Link>
      </Typography>
    </section>
  );
}

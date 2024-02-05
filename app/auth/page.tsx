import Image from 'next/image';

import { Typography } from '@/components/ui/typography';
import MagicLinkAuthForm from '@/auth/components/magic-link-auth-form';
import OAuthForm from '@/auth/components/oauth-form';
import AuthMethodSeparator from '@/auth/components/auth-method-separator';
import Logo from '@/components/ui/logo';
import authBgImg from '../../public/auth-bg-img.png';

export default function AuthPage() {
  return (
    <section className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center px-8 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8 flex flex-col items-center">
            <Logo size={48} variant="isotype" />

            <Typography as="h1" variant="title3" className="mt-4">
              Login to Karedo
            </Typography>
          </div>

          <OAuthForm />

          <AuthMethodSeparator />

          <MagicLinkAuthForm />
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          src={authBgImg}
          alt="Login to Karedo"
          width={1236}
          height={718}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
}

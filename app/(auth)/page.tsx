import { Typography } from '@/components/ui/typography';
import OPTAuthForm from '@/(auth)/components/opt-auth-form';
import { OAuthForm } from './components/oauth-form';

export default function AuthPage() {
  return (
    <section className="mx-auto max-w-lg space-y-4 p-16">
      <Typography as="h1" variant="title3">
        Login to Karedo
      </Typography>

      <OAuthForm />

      <div className="my-4 flex items-center justify-center space-x-2">
        <div className="h-px flex-grow bg-gray-200" />
        <Typography variant="small" className="text-gray-400">
          oder
        </Typography>
        <div className="h-px flex-grow bg-gray-200" />
      </div>

      <OPTAuthForm />
    </section>
  );
}

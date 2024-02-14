import Link from 'next/link';
import { activateAccountAction } from '@/auth/lib/actions/activate-account';
import { buttonVariants } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import CheckCircledIcon from '@/components/icons/check-circled-icon';

type ActivationPageProps = {
  params: {
    code: string;
  };
};

export default async function ActivationPage(props: ActivationPageProps) {
  const { code } = props.params;

  const { isError, error } = await activateAccountAction(code);

  if (isError) {
    return (
      <section className="flex flex-col justify-center space-y-4">
        <Typography as="h1" variant="title3" className="text-center">
          Something went wrong!
        </Typography>

        <Typography variant="paragraph" className="text-center">
          {error!.message}
        </Typography>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center space-y-4">
      <header className="flex flex-col items-center space-y-2">
        <CheckCircledIcon className="text-blue-600" size={32} />
        <Typography as="h1" variant="title3" className="text-center">
          Account activated
        </Typography>
      </header>

      <Typography variant="paragraph" className="text-center">
        Your account has been successfully activated.
      </Typography>

      <Link href="/auth/login" className={buttonVariants({ variant: 'default' })}>
        Login to your account
      </Link>
    </section>
  );
}

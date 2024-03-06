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

  const { isError, errorMessage } = await activateAccountAction(code);

  if (isError) {
    return (
      <section className="flex flex-col justify-center space-y-4">
        <Typography as="h1" variant="title3" className="text-center">
          Etwas ist schiefgelaufen!
        </Typography>

        <Typography variant="paragraph" className="text-center">
          {errorMessage}
        </Typography>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center space-y-4">
      <header className="flex flex-col items-center space-y-2">
        <CheckCircledIcon className="text-blue-600" size={32} />
        <Typography as="h1" variant="title3" className="text-center">
          Geschafft
        </Typography>
      </header>

      <Typography variant="paragraph" className="text-center">
        Dein Konto wurde erfolgreich aktiviert.
      </Typography>

      <Link href="/auth/login" className={buttonVariants({ variant: 'default' })}>
        Jetzt einloggen
      </Link>
    </section>
  );
}

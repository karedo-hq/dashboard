import { Typography } from '@/components/ui/typography';
import ResetPasswordForm from '@/auth/components/reset-password-form';
import { verifyResetPasswordCode } from '@/auth/lib/utils/verify-reset-password-code';
import Logo from '@/components/ui/logo';

type ResetPasswordPageProps = {
  params: {
    code: string;
  };
};

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const { code } = props.params;

  const decodedCode = verifyResetPasswordCode(code);

  if (!decodedCode) {
    return (
      <section className="mx-auto w-full max-w-sm space-y-8 lg:w-96">
        <Typography as="h1" variant="title3" className="text-center">
          Invalid reset password link
        </Typography>

        <Typography variant="paragraph" className="text-center">
          We where unable to verify your reset password link. Please try again or request a new one.
        </Typography>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-sm space-y-8 lg:w-96">
      <header className="mb-8 flex flex-col items-center">
        <Logo size={48} variant="isotype" />
        <Typography as="h1" variant="title3" className="mt-4">
          Reset password
        </Typography>
      </header>

      <ResetPasswordForm userId={decodedCode._id} userEmail={decodedCode.email} />
    </section>
  );
}

'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils/cn';
import { getErrorMessage } from '@/lib/utils/get-error-message';
import { Typography, typographyVariants } from '@/components/ui/typography';
import EnvelopeBadgeIcon from '@/components/icons/envelope-badge-icon';
import { requestResetPasswordAction } from '../lib/actions/request-password-reset';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein'),
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit: SubmitHandler<ForgotPasswordFormValues> = async (values) => {
    try {
      const res = await requestResetPasswordAction(values.email);

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      setIsSuccess(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler bei der Anforderung der Passwortzurücksetzung',
        description: getErrorMessage(error),
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <EnvelopeBadgeIcon className="text-blue-600" size={32} />
        <Typography as="p" variant="paragraph" className="text-center">
          E-Mail gesendet. Bitte überprüfe deine E-Mails und klicke auf den Link zur
          Passwortänderung.
        </Typography>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-4">
        <Typography variant="paragraph">
          Gib deine E-Mail-Adresse ein, und wir senden dir einen Link zum Zurücksetzen deines
          Passworts.
        </Typography>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Gib deine E-Mail-Adresse ein..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
          Passwortzurücksetzung anfordern
        </Button>

        <Link
          href="/auth/login"
          className={cn(
            typographyVariants({ variant: 'small' }),
            'w-full text-center font-medium text-blue-600',
          )}
        >
          Zurück zur Anmeldung
        </Link>
      </form>
    </Form>
  );
}

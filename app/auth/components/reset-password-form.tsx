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
import { getErrorMessage } from '@/lib/utils/get-error-message';
import { Typography, typographyVariants } from '@/components/ui/typography';
import { resetPasswordAction } from '../lib/actions/reset-password';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import CheckCircledIcon from '@/components/icons/check-circled-icon';

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein ')
      .max(50, 'Das Passwort muss weniger als 50 Zeichen lang sein'),
    confirmNewPassword: z
      .string()
      .min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein ')
      .max(50, 'Das Passwort muss weniger als 50 Zeichen lang sein'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwort und Passwortbestätigung stimmen nicht überein!',
    path: ['confirmPassword'],
  });

type ResetPasswordFormProps = {
  userId: string;
  userEmail: string;
};
type ResetPasswordFormValues = z.infer<typeof formSchema>;

export default function ResetPasswordForm({ userId, userEmail }: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const { toast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const handleSubmit: SubmitHandler<ResetPasswordFormValues> = async (values) => {
    const { newPassword } = values;

    try {
      const res = await resetPasswordAction(userId, newPassword);

      if (!res.isSuccess) {
        throw res.error;
      }

      setIsSuccess(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler beim Zurücksetzen des Passworts',
        description: getErrorMessage(error),
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <CheckCircledIcon className="text-blue-600" size={32} />
        <Typography as="p" variant="paragraph" className="text-center">
          Dein Passwort wurde zurückgesetzt. Du kannst dich jetzt mit deinen neuen Zugangsdaten
          anmelden.
        </Typography>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Neues Passwort</FormLabel>

                <Button type="button" variant="ghost" size="sm" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? 'Verbergen' : 'Anzeigen'}
                </Button>
              </div>
              <FormControl>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Gib dein neues Passwort ein..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bestätige dein neues Passwort</FormLabel>

              <FormControl>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Gib dein neues Passwort erneut ein..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Lädt...' : 'Passwort zurücksetzen'}
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

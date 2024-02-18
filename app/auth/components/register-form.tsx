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
import { registerAction } from '../lib/actions/register';
import { useToast } from '@/lib/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils/get-error-message';
import { Typography, typographyVariants } from '@/components/ui/typography';
import EnvelopeBadgeIcon from '@/components/icons/envelope-badge-icon';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const formSchema = z
  .object({
    firstname: z
      .string()
      .min(2, 'Der Vorname muss mindestens 2 Zeichen lang sein')
      .max(45, 'Der Vorname muss weniger als 45 Zeichen lang sein')
      .regex(new RegExp('^[a-zA-Z]+$'), 'Keine Sonderzeichen erlaubt!'),
    lastname: z
      .string()
      .min(2, 'Der Nachname muss mindestens 2 Zeichen lang sein')
      .max(45, 'Der Nachname muss weniger als 45 Zeichen lang sein')
      .regex(new RegExp('^[a-zA-Z]+$'), 'Keine Sonderzeichen erlaubt!'),
    email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein'),
    password: z
      .string()
      .min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein ')
      .max(50, 'Das Passwort muss weniger als 50 Zeichen lang sein'),
    confirmPassword: z
      .string()
      .min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein ')
      .max(50, 'Das Passwort muss weniger als 50 Zeichen lang sein'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwort und Passwortbestätigung stimmen nicht überein!',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { toast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const handleSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    const { confirmPassword, ...dto } = values;

    try {
      await registerAction(dto);

      setIsSuccess(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler bei der Registrierung',
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

        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vorname</FormLabel>
              <FormControl>
                <Input placeholder="Gib deinen Vornamen ein..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nachname</FormLabel>
              <FormControl>
                <Input placeholder="Gib deinen Nachnamen ein..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Passwort</FormLabel>

                <Button type="button" variant="ghost" size="sm" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? 'Verbergen' : 'Anzeigen'}
                </Button>
              </div>
              <FormControl>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Gib dein Passwort ein..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort bestätigen</FormLabel>

              <FormControl>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Gib dein Passwort erneut ein..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Lädt...' : 'Registrieren'}
        </Button>

        <Typography as="p" variant="small">
          Durch Anmeldung erklären Sie sich mit unseren{' '}
          <Link
            href="https://www.karedo.io/terms"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(typographyVariants({ variant: 'small' }), 'font-medium text-blue-600')}
          >
            Nutzungsbedingungen
          </Link>{' '}
          und{' '}
          <Link
            href="https://www.karedo.io/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(typographyVariants({ variant: 'small' }), 'font-medium text-blue-600')}
          >
            Datenschutzerklärung
          </Link>{' '}
          einverstanden.
        </Typography>
      </form>
    </Form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { typographyVariants } from '@/components/ui/typography';

const formSchema = z.object({
  email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein'),
  password: z
    .string()
    .min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein')
    .max(50, 'Das Passwort muss weniger als 50 Zeichen lang sein'),
});

type LoginFormProps = {
  callbackUrl?: string;
};

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginForm(props: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();
  const { toast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const handleSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    const response = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (!response?.ok) {
      toast({
        variant: 'destructive',
        title: 'Fehler beim Einloggen',
        description: response?.error,
      });
      return;
    }

    router.push(props.callbackUrl || '/dashboard');
  };

  const isSubmitting = form.formState.isSubmitting;

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
              <div className="flex flex-col items-end">
                <Link
                  href="/auth/forgot-password"
                  className={cn(
                    typographyVariants({ variant: 'small' }),
                    'font-medium text-blue-600',
                  )}
                >
                  Passwort vergessen?
                </Link>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
          Anmelden
        </Button>
      </form>
    </Form>
  );
}

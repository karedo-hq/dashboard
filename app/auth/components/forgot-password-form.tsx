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
  email: z.string().email('Please enter a valid email address'),
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
      await requestResetPasswordAction(values.email);

      setIsSuccess(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error requesting password reset',
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
          Email sent. Please check your email and click on the password change link.
        </Typography>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-4">
        <Typography variant="paragraph">
          Enter your email address and we will send you a link to reset your password.
        </Typography>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email address..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Request password reset'}
        </Button>

        <Link
          href="/auth/login"
          className={cn(
            typographyVariants({ variant: 'small' }),
            'w-full text-center font-medium text-blue-600',
          )}
        >
          Back to login
        </Link>
      </form>
    </Form>
  );
}

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
import { Typography } from '@/components/ui/typography';
import EnvelopeBadgeIcon from '@/components/icons/envelope-badge-icon';
import { resetPasswordAction } from '../lib/actions/reset-password';

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters ')
      .max(50, 'Password must be less than 50 characters'),
    confirmNewPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters ')
      .max(50, 'Password must be less than 50 characters'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password and confirm password doesn't match!",
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
        title: 'Error registering',
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
          Your password has been reset. You can now login with your new credentials.
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
                <FormLabel>New password</FormLabel>

                <Button type="button" variant="ghost" size="sm" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? 'Hide' : 'Show'}
                </Button>
              </div>
              <FormControl>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Enter your new password..."
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
              <FormLabel>Confirm new password</FormLabel>

              <FormControl>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Type again your new password..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Reset password'}
        </Button>
      </form>
    </Form>
  );
}

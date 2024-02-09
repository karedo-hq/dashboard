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

type LoginFormProps = {
  callbackUrl?: string;
};

type LoginFormValues = {
  email: string;
  password: string;
};

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters ')
    .max(50, 'Password must be less than 50 characters'),
});

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
        title: 'Error logging in',
        description: response?.error,
      });
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
                <Input placeholder="Enter your email address..." {...field} />
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
                <FormLabel>Password</FormLabel>

                <Button type="button" variant="ghost" size="sm" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? 'Hide' : 'Show'}
                </Button>
              </div>
              <FormControl>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Enter your password..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
}

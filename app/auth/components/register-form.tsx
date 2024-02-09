'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
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
import { RegisterDto } from '@/auth/lib/types/register.types';
import { register } from '../lib/actions/register.action';
import { useToast } from '@/lib/hooks/use-toast';

type RegisterFormValues = RegisterDto & {
  confirmPassword: string;
};

const formSchema = z
  .object({
    firstname: z
      .string()
      .min(2, 'First name must be atleast 2 characters')
      .max(45, 'First name must be less than 45 characters')
      .regex(new RegExp('^[a-zA-Z]+$'), 'No special character allowed!'),
    lastname: z
      .string()
      .min(2, 'Last name must be atleast 2 characters')
      .max(45, 'Last name must be less than 45 characters')
      .regex(new RegExp('^[a-zA-Z]+$'), 'No special character allowed!'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters ')
      .max(50, 'Password must be less than 50 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters ')
      .max(50, 'Password must be less than 50 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password doesn't match!",
    path: ['confirmPassword'],
  });

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
  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const handleSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    const { confirmPassword, ...dto } = values;

    try {
      await register(dto);

      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: true,
        callbackUrl: '/dashboard',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error registering',
        description: error?.message,
      });
    }
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
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="Enter your firstname..." {...field} />
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
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input placeholder="Enter your lastname..." {...field} />
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>

              <FormControl>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Type again your password..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Register'}
        </Button>
      </form>
    </Form>
  );
}

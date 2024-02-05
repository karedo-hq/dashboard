'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Database } from '@/lib/database.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@/components/ui/typography';
import { useToast } from '@/lib/hooks/use-toast';

type MagicLinkAuthFormValues = { email: string };

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export default function MagicLinkAuthForm() {
  const supabase = createClientComponentClient<Database>();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<boolean | undefined>();

  const form = useForm<MagicLinkAuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const { toast } = useToast();

  const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/auth/callback`;

  const handleMagicLinkSubmit = async (values: MagicLinkAuthFormValues) => {
    if (isSubmitSuccessful) setIsSubmitSuccessful(undefined);

    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error sending magic link',
        description: error.message,
      });
      return false;
    }

    setIsSubmitSuccessful(true);
    return true;
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleMagicLinkSubmit)} className="flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your email address..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Continue with Email'}
        </Button>

        {isSubmitSuccessful && (
          <aside className="flex items-center justify-center rounded-md border border-green-400 bg-green-50 p-4">
            <Typography as="p" variant="small" className="text-green-500">
              We sent you a magic link to your email address. Please check it to enter to Karedo.
            </Typography>
          </aside>
        )}
      </form>
    </Form>
  );
}

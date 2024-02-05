'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from '@/components/ui/button';
import { Database } from '@/lib/database.types';
import GoogleIcon from '@/components/icons/google-icon';
import { useToast } from '@/lib/hooks/use-toast';

export default function OAuthForm() {
  const supabase = createClientComponentClient<Database>();

  const { toast } = useToast();

  const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/auth/callback`;

  const handleLoginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error signing in with Google',
        description: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col">
      <Button variant="outline" onClick={handleLoginWithGoogle}>
        <GoogleIcon size={16} className="mr-2" /> Continue with Google
      </Button>
    </div>
  );
}

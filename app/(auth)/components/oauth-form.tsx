'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from '@/components/ui/button';
import { Database } from '@/lib/database.types';
import GoogleIcon from '@/components/icons/google-icon';

export default function OAuthForm() {
  const supabase = createClientComponentClient<Database>();

  const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/auth/callback`;

  console.log({ redirectUrl });

  const handleLoginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    console.log({ data, error });
  };

  return (
    <div className="flex flex-col">
      <Button variant="outline" onClick={handleLoginWithGoogle}>
        <GoogleIcon size={16} className="mr-2" /> Continue with Google
      </Button>
    </div>
  );
}

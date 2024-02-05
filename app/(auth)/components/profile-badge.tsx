import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Database } from '@/lib/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function ProfileBadge() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error, status } = await supabase
    .from('users')
    .select(`full_name, username, website, avatar_url`)
    .eq('id', user?.id)
    .single();

  if (error && status !== 406) {
    throw error;
  }

  console.log({ user, data });

  return (
    <div className="flex space-x-4">
      <Avatar>
        <AvatarImage src="https://github.com/you.png" alt="User avatar" />
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
      <form action="/auth/logout" method="post">
        <Button type="submit" variant="outline">
          Logout
        </Button>
      </form>
    </div>
  );
}

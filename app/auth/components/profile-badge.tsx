'use client';

import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export default function ProfileBadge() {
  const { data: session } = useSession();

  const handleLogout = () => signOut({ callbackUrl: '/auth/login' });

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <Typography as="p" variant="small">
        {session.user.firstname}
      </Typography>
      <Avatar>
        <AvatarImage src="https://github.com/you.png" alt="User avatar" />
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
      <Button onClick={handleLogout} variant="outline" size="sm">
        Logout
      </Button>
    </div>
  );
}

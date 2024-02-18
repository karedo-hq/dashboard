'use client';
// @todo - make this a RSC on next-auth v5 and handle better server logout API call.
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/auth/lib/actions/logout';

export default function LogoutButton() {
  const handleClick = () => {
    logoutAction();

    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <Button onClick={handleClick} variant="outline" size="sm">
      Abmelden
    </Button>
  );
}

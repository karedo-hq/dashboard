'use client';
// @todo - make this a RSC on next-auth v5 and handle better server logout API call.
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/auth/lib/actions/logout';

export default function LogoutButton() {
  const handleLogout = () => {
    logoutAction();

    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <Button onClick={handleLogout} variant="outline" size="sm">
      Logout
    </Button>
  );
}

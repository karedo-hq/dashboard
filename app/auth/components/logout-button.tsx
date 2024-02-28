'use client';
// @todo - make this a RSC on next-auth v5 and handle better server logout API call.
import { signOut } from 'next-auth/react';
import { logoutAction } from '@/auth/lib/actions/logout';
import { LogOutIcon } from 'lucide-react';

export default function LogoutButton() {
  const handleClick = () => {
    logoutAction();

    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <button onClick={handleClick} className="flex items-center">
      <LogOutIcon size={16} className="mr-2" /> Abmelden
    </button>
  );
}

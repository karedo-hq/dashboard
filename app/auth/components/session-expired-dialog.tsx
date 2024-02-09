'use client';

import { signOut } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function SessionExpiredDialog() {
  const handleClose = () => signOut({ callbackUrl: '/auth/login' });

  return (
    <Dialog defaultOpen onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your session has expired</DialogTitle>
          <DialogDescription>Please authenticate again to continue using Karedo.</DialogDescription>
        </DialogHeader>
        <Button variant="outline" onClick={handleClose}>
          Authenticate
        </Button>
      </DialogContent>
    </Dialog>
  );
}

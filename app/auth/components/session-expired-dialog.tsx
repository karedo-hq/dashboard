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
          <DialogTitle>Deine Sitzung ist abgelaufen</DialogTitle>
          <DialogDescription>
            Bitte authentifiziere dich erneut, um Karedo weiter zu nutzen.
          </DialogDescription>
        </DialogHeader>
        <Button variant="outline" onClick={handleClose}>
          Erneut anmelden
        </Button>
      </DialogContent>
    </Dialog>
  );
}

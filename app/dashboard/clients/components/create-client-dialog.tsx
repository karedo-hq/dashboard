'use client';

import React, { useState } from 'react';
import { UserRoundPlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreateClientForm from './create-client-form';

export default function CreateClientDialog() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <UserRoundPlusIcon size={16} className="mr-2" /> Neue Betreuung
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Neue Betreuung</DialogTitle>
          <DialogDescription>Felder mit (*) sind Pflichtfelder.</DialogDescription>
        </DialogHeader>

        <CreateClientForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

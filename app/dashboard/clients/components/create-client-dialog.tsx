'use client';

import React, { useState } from 'react';
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
        <Button variant="default">+ Create client</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create client</DialogTitle>
          <DialogDescription>Fields with (*) are required.</DialogDescription>
        </DialogHeader>

        <CreateClientForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

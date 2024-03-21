'use client';

import { useOptimistic, startTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Client } from '../lib/types/client.type';
import { CLIENT_STATUS_LABELS } from '../lib/consts/client-status-labels';
import { cn } from '@/lib/utils/cn';
import { badgeVariants } from '@/components/ui/badge';
import { updateClient } from '../lib/actions/update-client';
import { ClientStatus } from '../lib/types/client-status.type';
import { useToast } from '@/lib/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils/get-error-message';

type ClientStatusInputProps = {
  client: Client;
};

export default function ClientStatusInput({ client }: ClientStatusInputProps) {
  const { toast } = useToast();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic<ClientStatus, ClientStatus>(
    client.status,
    (_, newStatus) => newStatus,
  );

  let variant: 'success' | 'slate' | 'error' | null = null;

  switch (optimisticStatus) {
    case 'active':
      variant = 'success';
      break;

    case 'inactive':
      variant = 'slate';
      break;

    case 'deleted':
      variant = 'error';
      break;

    default:
      break;
  }

  const handleChange = async (value: string) => {
    startTransition(() => setOptimisticStatus(value as ClientStatus));
    try {
      const res = await updateClient(client._id, { status: value as ClientStatus });

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Kunde aktualisiert',
          description: 'Die Status des Kunden wurden aktualisiert.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler beim Aktualisieren des Kunden Status',
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <Select value={optimisticStatus} onValueChange={handleChange}>
      <SelectTrigger className={cn('h-fit w-fit gap-2', badgeVariants({ variant }))}>
        <SelectValue>{CLIENT_STATUS_LABELS[optimisticStatus]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CLIENT_STATUS_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

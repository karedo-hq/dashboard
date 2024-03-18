import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Typography } from '@/components/ui/typography';
import { buttonVariants } from '@/components/ui/button';
import { Client } from '@/dashboard/clients/lib/types/client.type';
import ClientStatusBadge from './client-status-bagde';
import { ClientAvatarInput } from './client-avatar-input';

export default function ClientDetailsHeader({ client }: { client: Client }) {
  return (
    <header className="relative flex flex-col items-center justify-center space-y-2 p-4">
      <Link
        href="/dashboard/clients"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'absolute left-4 top-4 text-slate-950',
        )}
      >
        <ArrowLeftIcon size={20} />
      </Link>

      <ClientAvatarInput client={client} />

      <Typography as="h1" variant="title4">
        {client.firstname} {client.lastname}
      </Typography>

      <ClientStatusBadge status={client.status} />
    </header>
  );
}

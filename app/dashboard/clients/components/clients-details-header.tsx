import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Typography } from '@/components/ui/typography';
import { Client } from '@/dashboard/clients/lib/types/client.type';
import ClientStatusBadge from './client-status-bagde';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { buttonVariants } from '@/components/ui/button';

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

      <Avatar className="h-16 w-16">
        <AvatarImage src={client.avatar} alt={client.firstname} className="h-16 w-16" />
        <AvatarFallback>{client.firstname[0]}</AvatarFallback>
      </Avatar>

      <Typography as="h1" variant="title4">
        {client.firstname} {client.lastname}
      </Typography>

      <ClientStatusBadge status={client.status} />
    </header>
  );
}

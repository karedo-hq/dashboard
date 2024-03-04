import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Typography } from '@/components/ui/typography';
import { Client } from '@/dashboard/clients/lib/types/client.type';
import ClientStatusBadge from './client-status-bagde';

export default function ClientDetailsHeader({ client }: { client: Client }) {
  return (
    <header className="flex flex-col items-center justify-center space-y-2 p-8">
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

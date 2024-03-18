import { Badge } from '@/components/ui/badge';
import { ClientStatus } from '../lib/types/client-status.type';

export default function ClientStatusBadge({ status }: { status: ClientStatus }) {
  let variant: 'success' | 'slate' | 'error' | null = null;
  let label: string | null = null;

  switch (status) {
    case 'active':
      variant = 'success';
      label = 'Aktiv';
      break;

    case 'inactive':
      variant = 'slate';
      label = 'Inaktiv';
      break;

    case 'deleted':
      variant = 'error';
      label = 'Gelöscht';
      break;

    default:
      break;
  }

  if (!variant) {
    return null;
  }

  return <Badge variant={variant}>{label}</Badge>;
}

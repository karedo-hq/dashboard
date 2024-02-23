'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Client } from '../lib/types/client.type';
import { LIVING_ARRANGEMENTS_LABELS } from '../lib/consts/living-arrangements-labels';
import { WEALTH_STATUS_LABELS } from '../lib/consts/wealth-status-labels';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';

export const clientsCols: ColumnDef<Client>[] = [
  {
    accessorKey: 'mainInfo',
    header: 'Betreute Person',
    cell: ({ row }) => {
      const { firstname, lastname, birthday } = row.original;
      return (
        <div className="flex flex-col">
          <Typography variant="paragraph">
            {firstname} {lastname}
          </Typography>

          <Typography variant="small" color="slate-400">
            {new Date(birthday).toLocaleDateString('de-DE')}
          </Typography>
        </div>
      );
    },
  },
  {
    accessorKey: 'guardianshipStartedAt',
    header: 'Betreuungsbeginn',
    cell: ({ row }) => {
      const { guardianshipStartedAt } = row.original;
      return new Date(guardianshipStartedAt).toLocaleDateString('de-DE');
    },
  },
  {
    accessorKey: 'guardianshipEndedAt',
    header: 'Betreuungsende',
    cell: ({ row }) => {
      const { guardianshipEndedAt } = row.original;
      return guardianshipEndedAt ? new Date(guardianshipEndedAt).toLocaleDateString('de-DE') : '-';
    },
  },
  {
    accessorKey: 'livingArrangement',
    header: 'Aufenthalt',
    cell: ({ row }) => {
      const { livingArrangement } = row.original;
      return livingArrangement ? LIVING_ARRANGEMENTS_LABELS[livingArrangement] : '-';
    },
  },
  {
    accessorKey: 'wealthStatus',
    header: 'Vermögensstatus',
    cell: ({ row }) => {
      const { wealthStatus } = row.original;
      return wealthStatus ? WEALTH_STATUS_LABELS[wealthStatus] : '-';
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { status } = row.original;
      return status === 'active' ? (
        <Badge variant="success">Aktiv</Badge>
      ) : status === 'inactive' ? (
        <Badge variant="slate">Inaktiv</Badge>
      ) : (
        <Badge variant="error">Gelöscht</Badge>
      );
    },
  },
];

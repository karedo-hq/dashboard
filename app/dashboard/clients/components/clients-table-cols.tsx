'use client';

import { ColumnDef } from '@tanstack/react-table';
import { LIVING_ARRANGEMENTS_LABELS } from '../lib/consts/living-arrangements-labels';
import { WEALTH_STATUS_LABELS } from '../lib/consts/wealth-status-labels';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CLIENTS_TABLE_COL_LABELS } from '../lib/consts/clients-table-col-labels';
import { ParsedClientForTable } from '../lib/utils/parse-clients-for-table';

export const clientsCols: ColumnDef<ParsedClientForTable>[] = [
  {
    accessorKey: 'fullname',
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-1">
          <Typography variant="paragraph" color="slate-500">
            {CLIENTS_TABLE_COL_LABELS.fullname}
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const { fullname, birthday } = row.original;

      return (
        <div className="flex flex-col">
          <Typography variant="paragraph">{fullname}</Typography>

          <Typography variant="small" color="slate-400">
            {new Date(birthday).toLocaleDateString('de-DE')}
          </Typography>
        </div>
      );
    },
  },
  {
    accessorKey: 'guardianshipStartedAt',
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-1">
          <Typography variant="paragraph" color="slate-500">
            {CLIENTS_TABLE_COL_LABELS.guardianshipStartedAt}
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const { guardianshipStartedAt } = row.original;
      return new Date(guardianshipStartedAt).toLocaleDateString('de-DE');
    },
  },
  {
    accessorKey: 'guardianshipEndedAt',
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-1">
          <Typography variant="paragraph" color="slate-500">
            {CLIENTS_TABLE_COL_LABELS.guardianshipEndedAt}
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const { guardianshipEndedAt } = row.original;
      return guardianshipEndedAt ? new Date(guardianshipEndedAt).toLocaleDateString('de-DE') : '-';
    },
  },
  {
    accessorKey: 'livingArrangement',
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-1">
          <Typography variant="paragraph" color="slate-500">
            {CLIENTS_TABLE_COL_LABELS.livingArrangement}
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const { livingArrangement } = row.original;
      return livingArrangement ? LIVING_ARRANGEMENTS_LABELS[livingArrangement] : '-';
    },
  },
  {
    accessorKey: 'wealthStatus',
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-1">
          <Typography variant="paragraph" color="slate-500">
            {CLIENTS_TABLE_COL_LABELS.wealthStatus}
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const { wealthStatus } = row.original;
      return wealthStatus ? WEALTH_STATUS_LABELS[wealthStatus] : '-';
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-1">
          <Typography variant="paragraph" color="slate-500">
            {CLIENTS_TABLE_COL_LABELS.status}
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
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

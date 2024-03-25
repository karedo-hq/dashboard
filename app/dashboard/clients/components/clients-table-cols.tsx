'use client';

import { ColumnDef } from '@tanstack/react-table';
import { LIVING_ARRANGEMENTS_LABELS } from '../lib/consts/living-arrangements-labels';
import { WEALTH_STATUS_LABELS } from '../lib/consts/wealth-status-labels';
import { Typography, typographyVariants } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CLIENTS_TABLE_COL_LABELS } from '../lib/consts/clients-table-col-labels';
import { ParsedClientForTable } from '../lib/utils/parse-clients-for-table';
import { TableColumnHeader } from '@/components/ui/table';
import { formatDate } from '@/lib/utils/format-date';
import ClientStatusBadge from './client-status-bagde';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const clientsCols: ColumnDef<ParsedClientForTable>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullname',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={CLIENTS_TABLE_COL_LABELS.fullname} />
    ),
    cell: ({ row }) => {
      const { _id, fullname, birthday, avatar, firstname } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatar} alt={fullname} className="object-cover" />
            <AvatarFallback>{firstname[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link
              href={`/dashboard/clients/${_id}`}
              className={cn(typographyVariants({ variant: 'paragraph' }), 'hover:underline')}
            >
              {fullname}
            </Link>

            <Typography variant="small" color="slate-400">
              {formatDate(birthday)}
            </Typography>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'guardianshipStartedAt',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={CLIENTS_TABLE_COL_LABELS.guardianshipStartedAt} />
    ),
    cell: ({ row }) => {
      const { guardianshipStartedAt } = row.original;
      return formatDate(guardianshipStartedAt);
    },
  },
  {
    accessorKey: 'guardianshipEndedAt',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={CLIENTS_TABLE_COL_LABELS.guardianshipEndedAt} />
    ),
    cell: ({ row }) => {
      const { guardianshipEndedAt } = row.original;
      return guardianshipEndedAt ? formatDate(guardianshipEndedAt) : '-';
    },
  },
  {
    accessorKey: 'livingArrangements',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={CLIENTS_TABLE_COL_LABELS.livingArrangements} />
    ),
    cell: ({ row }) => {
      const { livingArrangements } = row.original;
      return LIVING_ARRANGEMENTS_LABELS[livingArrangements[0].type];
    },
  },
  {
    accessorKey: 'wealthStatus',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={CLIENTS_TABLE_COL_LABELS.wealthStatus} />
    ),
    cell: ({ row }) => {
      const { wealthStatus } = row.original;
      return wealthStatus ? WEALTH_STATUS_LABELS[wealthStatus] : '-';
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <TableColumnHeader column={column} title={CLIENTS_TABLE_COL_LABELS.status} />
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      return <ClientStatusBadge status={status} />;
    },
  },
];

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Client } from '../lib/types/client.type';

export const clientsCols: ColumnDef<Client>[] = [
  {
    accessorKey: 'fullname',
    header: 'Fullname',
    cell: ({ row }) => {
      const { firstname, lastname } = row.original;
      return `${firstname} ${lastname}`;
    },
  },
  {
    accessorKey: 'birthday',
    header: 'Birthday',
    cell: ({ row }) => {
      const { birthday } = row.original;
      return new Date(birthday).toLocaleDateString();
    },
  },
  {
    accessorKey: 'guardianshipStartedAt',
    header: 'Starting date',
    cell: ({ row }) => {
      const { guardianshipStartedAt } = row.original;
      return new Date(guardianshipStartedAt).toLocaleDateString();
    },
  },
  {
    accessorKey: 'isGuardianshipTakenOver',
    header: 'Taken over',
    cell: ({ row }) => {
      const { isGuardianshipTakenOver } = row.original;
      return isGuardianshipTakenOver ? 'Yes' : 'No';
    },
  },
  {
    accessorKey: 'livingArrangement',
    header: 'Living arrangement',
  },
  {
    accessorKey: 'wealthStatus',
    header: 'Wealth status',
  },
];

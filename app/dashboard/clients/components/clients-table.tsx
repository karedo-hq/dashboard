'use client';

import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  VisibilityState,
  getSortedRowModel,
  Row,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { UsersIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CreateClientDialog from './create-client-dialog';
import { TablePagination } from '@/components/ui/pagination';
import { Typography } from '@/components/ui/typography';
import { ClientsTableHeader } from './clients-table-header';
import { ParsedClientForTable } from '../lib/utils/parse-clients-for-table';

type ClientsTableProps = {
  columns: ColumnDef<ParsedClientForTable>[];
  data: ParsedClientForTable[];
};

export function ClientsTable<TData, TValue>({ columns, data }: ClientsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (data.length === 0) {
    return (
      <div className="flex h-96 w-full flex-col justify-center gap-4">
        <header className="mx-auto">
          <div className="flex items-center justify-center rounded-2xl bg-blue-600/10 p-4">
            <UsersIcon size={48} className="text-blue-600" />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center">
          <Typography variant="title5" className="text-center">
            Betreuungen
          </Typography>
          <Typography
            variant="paragraph"
            className="mb-4 max-w-sm text-center [&:not(:first-child)]:mt-2"
            color="slate-500"
          >
            Leg los und füge Deinen ersten Klienten hinzu, um alle Belange rund um Deine Betreuung
            zu organisieren.
          </Typography>

          <CreateClientDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ClientsTableHeader table={table} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Keine Ergebnisse.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />
    </div>
  );
}

'use client';

import { Table } from '@tanstack/react-table';
import { Columns3Icon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CLIENTS_TABLE_COL_LABELS } from '../lib/consts/clients-table-col-labels';
import { ClientTableColKey } from '../lib/types/clients-table-col-keys';
import CreateClientDialog from './create-client-dialog';

type TablePaginationProps<TData> = {
  table: Table<TData>;
};

export function ClientsTableHeader<TData>({ table }: TablePaginationProps<TData>) {
  return (
    <header className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <Input
        placeholder="Namen..."
        value={(table.getColumn('fullname')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('fullname')?.setFilterValue(event.target.value)}
        className="max-w-xs"
        startAdornment={<SearchIcon size={16} />}
      />
      <div className="flex w-full items-center gap-2 sm:w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Columns3Icon className="mr-2 h-4 w-4" /> Spalten
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {CLIENTS_TABLE_COL_LABELS[column.id as ClientTableColKey]}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateClientDialog />
      </div>
    </header>
  );
}

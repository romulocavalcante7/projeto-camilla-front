'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { Checkbox } from '@/components/ui/checkbox';
import { Subniche } from '@/services/subnicheService';
import { format } from 'date-fns';

export const columns: ColumnDef<Subniche>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false
  // },
  {
    accessorKey: 'name',
    header: 'Nome'
  },
  {
    accessorKey: 'category',
    header: 'Nicho',
    cell: ({ row }) => {
      return <p>{row.original.category.name}</p>;
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Data de criação',
    cell: ({ row }) => {
      return (
        <p>{format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm:ss')}</p>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

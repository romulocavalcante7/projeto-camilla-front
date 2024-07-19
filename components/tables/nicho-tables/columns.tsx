'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { Checkbox } from '@/components/ui/checkbox';
import { Category } from '@/services/categoryService';
import { format } from 'date-fns';
import Image from 'next/image';
import { DataTableColumnHeader } from '../data-header';
import { Star, StarOff } from 'lucide-react';

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: 'isImportant',
    header: '',
    cell: ({ row }) =>
      row.original.isImportant ? (
        <Star fill="yellow" stroke="#e2d40ed1" size={20} />
      ) : (
        <StarOff size={20} />
      )
  },
  {
    accessorKey: 'attachment',
    header: 'Imagem',
    cell: ({ row }) =>
      row.original?.attachment?.url ? (
        <Image
          className="aspect-square h-14 w-32 rounded-lg object-cover object-left-bottom"
          src={row.original.attachment.url}
          width={300}
          height={200}
          alt={row.original.attachment.filename}
        />
      ) : (
        <div className="aspect-square h-14 w-32 rounded-lg bg-gray-300 object-cover" />
      )
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} order="A" title="Nome" />
    )
  },
  {
    accessorKey: 'subniches',
    header: 'Subnichos',
    cell: ({ row }) => {
      return <p>{row.original.subniches.length}</p>;
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de criação" />
    ),
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

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Tutorial } from '@/services/tutorialServices';
import { format } from 'date-fns';
import Image from 'next/image';
import { DataTableColumnHeader } from '../data-header';
import { Star, StarOff } from 'lucide-react';

export const columns: ColumnDef<Tutorial>[] = [
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

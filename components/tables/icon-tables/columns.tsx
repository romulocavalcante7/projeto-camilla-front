/* eslint-disable react-hooks/rules-of-hooks */

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Icon } from '@/services/iconService';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '../data-header';
import { Star, StarOff } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export const columns: ColumnDef<Icon>[] = [
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
    header: 'Prévia do Ícone',
    cell: ({ row }) => {
      const attachmentUrl = row.original.attachment?.url;

      return attachmentUrl ? (
        <Image
          src={attachmentUrl}
          alt={row.original.name}
          width={80}
          height={80}
          className="aspect-square rounded-lg object-cover"
        />
      ) : (
        <div className="aspect-square h-14 w-32 rounded-lg bg-gray-300 object-cover" />
      );
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} order="A" title="Nome do Ícone" />
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

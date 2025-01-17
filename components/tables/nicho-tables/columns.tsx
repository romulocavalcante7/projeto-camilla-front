'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Category } from '@/services/categoryService';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '../data-header';
import { Star, StarOff } from 'lucide-react';

export const columns: ColumnDef<Category>[] = [
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

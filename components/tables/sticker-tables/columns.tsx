'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import Image from 'next/image';
import { Sticker } from '@/services/stickerService';
import { DataTableColumnHeader } from '../data-header';

export const columns: ColumnDef<Sticker>[] = [
  {
    accessorKey: 'attachment',
    header: 'Imagem',
    cell: ({ row }) =>
      row.original?.attachment?.url ? (
        <div className="relative w-full rounded-md ">
          <Image
            className="aspect-square h-20 w-full rounded-lg object-contain dark:bg-white"
            src={row.original.attachment.url}
            width={300}
            height={200}
            alt={row.original.attachment.filename}
          />
        </div>
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
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} order="A" title="Categoria" />
    ),
    cell: ({ row }) => {
      return <p>{row.original.category.name}</p>;
    }
  },
  {
    accessorKey: 'createdAt',
    // header: 'Data de criação',
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

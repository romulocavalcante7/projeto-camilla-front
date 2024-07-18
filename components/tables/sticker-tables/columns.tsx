'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import Image from 'next/image';
import { Sticker } from '@/services/stickerService';
import { DataTableColumnHeader } from '../data-header';

export const columns: ColumnDef<Sticker>[] = [
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
    accessorKey: 'attachment',
    header: 'Imagem',
    cell: ({ row }) =>
      row.original?.attachment?.url ? (
        <div className="relative w-fit rounded-md bg-[#3F3F3F]">
          <Image
            className="aspect-square h-20 w-20 rounded-lg object-cover"
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
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} order="A" title="Nicho" />
    ),
    cell: ({ row }) => {
      return <p>{row.original.subniche.category.name}</p>;
    }
  },
  {
    accessorKey: 'subniche',
    // header: 'Subnicho',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} order="A" title="Subnicho" />
    ),
    cell: ({ row }) => {
      return <p>{row.original.subniche.name}</p>;
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

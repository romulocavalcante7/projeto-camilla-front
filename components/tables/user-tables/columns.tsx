'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '../data-header';
import { Attachment } from '@/services/types/entities';
import { Subscription } from '@/services/userService';
import { OrderStatus } from '@/utils/orderStatus';
import Link from 'next/link';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  firstAccess: boolean;
  avatar: Attachment;
  subscription?: Subscription;
  orderStatus?: string;
  status: boolean;
}

type OrderStatusKey = keyof typeof OrderStatus;

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} order="Active" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center justify-center gap-2">
          {status ? (
            <div className="h-2 w-2 rounded-full bg-green-500" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-red-500" />
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} order="A" title="Nome" />
    ),
    cell: ({ row }) => {
      return (
        <Link
          href={`./usuarios/${row.original.id}`}
          className="flex items-center gap-2"
        >
          {row.original.name}
        </Link>
      );
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} order="A" title="Email" />
    )
  },
  {
    accessorKey: 'subscription',
    header: 'Assinatura',
    cell: ({ row }) =>
      row.original.subscription ? (
        <div>
          <div className="flex gap-3">
            <p>Status: </p>
            <div className="flex items-center gap-2">
              {row.original.subscription.status === 'active' ? (
                <div className="h-2 w-2 rounded-full bg-green-500" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-red-500" />
              )}

              <p>
                {row.original.subscription.status === 'active'
                  ? 'Ativo'
                  : 'Inativo'}
              </p>
            </div>
          </div>
          <div>Plano: {row.original.subscription.planName}</div>
        </div>
      ) : (
        'Sem Assinatura'
      ),
    enableSorting: false
  },
  {
    accessorKey: 'orderStatus',
    header: 'Pagamento',
    cell: ({ row }) => {
      const status = row.original.orderStatus as OrderStatusKey;
      return (
        <div className="flex items-center gap-2">
          {OrderStatus[status] === 'Pago' ? (
            <div className="h-2 w-2 rounded-full bg-green-500" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-red-500" />
          )}
          <p>{OrderStatus[status] || 'Sem Pedidos'}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'role',
    header: 'Acesso',
    cell: ({ row }) => {
      return <p>{row.original.role === 'USER' ? 'Usuário' : 'Admin'}</p>;
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

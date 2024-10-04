import React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon
} from '@radix-ui/react-icons';
import { type Column } from '@tanstack/react-table';
import { useRouter, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title?: string;
  order?: string;
}

const createQueryString = (params: Record<string, string | number>) => {
  const searchParams = new URLSearchParams(window.location.search);
  Object.keys(params).forEach((key) => {
    searchParams.set(key, String(params[key]));
  });
  return searchParams.toString();
};

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  order
}: DataTableColumnHeaderProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSort = (direction: 'asc' | 'desc') => {
    column.toggleSorting(direction === 'desc');
    router.push(
      `${pathname}?${createQueryString({
        sortField: column.id,
        sortOrder: direction
      })}`,
      {
        scroll: false
      }
    );
  };

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === 'desc'
                ? 'Sorted descending. Click to sort ascending.'
                : column.getIsSorted() === 'asc'
                ? 'Sorted ascending. Click to sort descending.'
                : 'Not sorted. Click to sort ascending.'
            }
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            {title && <span className="text-sm">{title}</span>}
            {column.getCanSort() && column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                aria-label="Sort ascending"
                onClick={() => handleSort('asc')}
              >
                <ArrowUpIcon
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                {order === 'A'
                  ? 'Abc'
                  : order === 'Active'
                  ? 'Inativo'
                  : 'Antigo'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                aria-label="Sort descending"
                onClick={() => handleSort('desc')}
              >
                <ArrowDownIcon
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                {order === 'A'
                  ? 'Zxy'
                  : order === 'Active'
                  ? 'Ativo'
                  : 'Recente'}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

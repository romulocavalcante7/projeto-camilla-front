'use client';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from 'lucide-react';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter
} from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sticker } from '@/services/stickerService';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  loading: boolean;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (value: string) => void;
  pageSizeOptions?: number[];
  pageCount: number;
  pageSize: number;
  page: number;
  searchParams?: ReadonlyURLSearchParams;
}

export function StickerTable<TData, TValue>({
  columns,
  data,
  searchKey,
  loading,
  pageCount,
  pageSize,
  page,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 30, 50],
  searchParams
}: DataTableProps<Sticker, TValue>) {
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = (
    params: Record<string, string | number | null>
  ) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());

    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    }

    return newSearchParams.toString();
  };

  const [pageIndex, setPageIndex] = useState(page - 1);

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        pageSize
      })}`,
      {
        scroll: false
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, pathname]);

  const table = useReactTable({
    columns,
    data,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: { pageIndex, pageSize }
    },
    //@ts-ignore
    onPaginationChange: setPageIndex,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  const searchValue = table.getColumn(searchKey)?.getFilterValue() as string;

  useEffect(() => {
    if (searchValue?.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          page: null,
          pageSize: null,
          search: searchValue
        })}`,
        {
          scroll: false
        }
      );
    }
    if (searchValue?.length === 0 || searchValue === undefined) {
      router.push(
        `${pathname}?${createQueryString({
          page: null,
          pageSize: null,
          search: null
        })}`,
        {
          scroll: false
        }
      );
    }

    setPageIndex(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pathname]);

  return (
    <>
      <Input
        placeholder={`Pesquise por nicho ou subnicho`}
        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn(searchKey)?.setFilterValue(event.target.value)
        }
        className="w-full md:max-w-sm"
      />
      <ScrollArea className="relative h-full rounded-md border sm:h-[calc(80vh-200px)]">
        {loading ? (
          <div className="absolute left-0 top-0 flex h-full w-full flex-1 items-center justify-center">
            <Loader2 className="my-4 h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table className="relative">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sem resultados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col items-center justify-end gap-6 space-x-2 py-4 sm:flex-row sm:gap-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Itens por página
              </p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageIndex(0);
                  onPageSizeChange(Number(value));
                  router.push(
                    `${pathname}?${createQueryString({
                      page: 1,
                      pageSize: Number(value),
                      search: searchValue || null
                    })}`,
                    {
                      scroll: false
                    }
                  );
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={`${pageSize}`} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
          <div className="w-[100px]sm:items-center flex text-sm font-medium sm:justify-center">
            Página {pageIndex + 1} de {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Ir para a primeira página"
              variant="outline"
              className={`h-8 w-8 p-0 lg:flex ${
                !table.getCanPreviousPage()
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
              onClick={() => {
                setPageIndex(0);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Ir para a página anterior"
              variant="outline"
              className={`h-8 w-8 p-0 ${
                !table.getCanPreviousPage()
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
              onClick={() => {
                const prevPage = pageIndex - 1;
                setPageIndex(prevPage >= 0 ? prevPage : 0);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Ir para a próxima página"
              variant="outline"
              className={`h-8 w-8 p-0 ${
                !table.getCanNextPage() ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onClick={() => {
                const nextPage = pageIndex + 1;
                setPageIndex(nextPage);
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>

            <Button
              aria-label="Ir para a última página"
              variant="outline"
              className={`h-8 w-8 p-0 lg:flex ${
                !table.getCanNextPage() ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onClick={() => {
                const lastPage = table.getPageCount() - 1;
                setPageIndex(lastPage);
              }}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { Icon, getAllIcons } from '@/services/iconService';
import { DataTableComponent } from '../data-table';

const createQueryString = (
  params: Record<string, string | number | undefined>
) => {
  const searchParams = new URLSearchParams(window.location.search);
  Object.keys(params).forEach((key) => {
    searchParams.set(key, String(params[key]));
  });
  return searchParams.toString();
};

export const IconClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [icons, setIcons] = useState<Icon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page')) || 1
  );
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );
  const [sortField, setSortField] = useState<string>(
    searchParams.get('sortField') || 'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<string>(
    searchParams.get('sortOrder') || 'desc'
  );
  const [totalIcons, setTotalIcons] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchIcons = async (
    pageNum: number,
    pageSize: number,
    search?: string,
    sortField?: string,
    sortOrder?: string
  ) => {
    setLoading(true);
    try {
      const data = await getAllIcons(
        pageNum,
        pageSize,
        search,
        sortField,
        sortOrder
      );
      setIcons(data.icons);
      setTotalIcons(data.total);
      setPageCount(data.totalPages);
    } catch (error) {
      console.error('Error fetching icons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIcons(page, pageSize, search, sortField, sortOrder);
  }, [page, search, pageSize, sortField, sortOrder]);

  useEffect(() => {
    setPage(Number(searchParams.get('page')) || 1);
    setSearch(searchParams.get('search') || undefined);
    setSortField(searchParams.get('sortField') || 'createdAt');
    setSortOrder(searchParams.get('sortOrder') || 'desc');
  }, [searchParams]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    router.push(
      `${window.location.pathname}?${createQueryString({
        page: 1,
        pageSize: size,
        search,
        sortField,
        sortOrder
      })}`,
      { scroll: false }
    );
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    router.push(
      `${window.location.pathname}?${createQueryString({
        page: 1,
        pageSize,
        search: value,
        sortField,
        sortOrder
      })}`,
      { scroll: false }
    );
  };

  return (
    <div className="flex-1 space-y-4 overflow-auto">
      <div className="flex flex-wrap items-start justify-between gap-5 sm:gap-0">
        <Heading
          title={`Ícones (${totalIcons})`}
          description="Gerencie os ícones"
        />
        <div className="flex flex-wrap items-center gap-5">
          <Button
            className="items-center gap-5 text-lg dark:text-black"
            onClick={() => router.push(`/dashboard/icones/important`)}
          >
            <Star fill="yellow" stroke="#e2d40ed1" size={20} />
            Mais Usados
          </Button>
          <Button
            className="text-lg dark:text-black"
            onClick={() => router.push(`/dashboard/icones/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Criar
          </Button>
        </div>
      </div>
      <Separator />
      <DataTableComponent
        columns={columns}
        data={icons}
        searchKey="name"
        placeholderInput="Pesquise por ícone"
        pageCount={pageCount}
        pageSize={pageSize}
        page={page}
        loading={loading}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
        searchParams={searchParams}
      />
    </div>
  );
};

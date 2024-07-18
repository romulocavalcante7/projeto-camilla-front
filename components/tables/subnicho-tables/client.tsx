'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { getAllSubniches, Subniche } from '@/services/subnicheService';
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

export const SubnichoClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subniches, setSubniches] = useState<Subniche[]>([]);
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
  const [totalSubniches, setTotalSubniches] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchSubniches = async (
    pageNum: number,
    pageSize: number,
    search?: string,
    sortField?: string,
    sortOrder?: string
  ) => {
    setLoading(true);
    try {
      const data = await getAllSubniches(
        pageNum,
        pageSize,
        search,
        sortField,
        sortOrder
      );
      setSubniches(data.subniches);
      setTotalSubniches(data.total);
      setPageCount(data.totalPages);
    } catch (error) {
      console.error('Error fetching subnichos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubniches(page, pageSize, search, sortField, sortOrder);
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
    <div className="flex-1 space-y-4 overflow-auto p-4 pt-6 md:p-8">
      <div className="flex items-start justify-between">
        <Heading
          title={`Subnichos (${totalSubniches})`}
          description="Gerencie os subnichos"
        />
        <Button
          className="text-lg dark:text-black"
          onClick={() => router.push(`/dashboard/subnicho/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Criar
        </Button>
      </div>
      <Separator />
      <DataTableComponent
        columns={columns}
        data={subniches}
        placeholderInput="Pesquise por subnicho ou nicho"
        searchKey="name"
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

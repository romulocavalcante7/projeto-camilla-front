'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTableComponent } from '../data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { columns } from './columns';
import { getUsers, UsersResponse } from '@/services/userService';

export const UserClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<UsersResponse['users']>([]);
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
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const createQueryString = (
    params: Record<string, string | number | undefined>
  ) => {
    const searchParamsObj = new URLSearchParams(window.location.search);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParamsObj.set(key, String(params[key]));
      } else {
        searchParamsObj.delete(key);
      }
    });
    return searchParamsObj.toString();
  };

  const fetchUsers = async (
    pageNum: number,
    pageSize: number,
    search?: string,
    sortField?: string,
    sortOrder?: string
  ) => {
    setLoading(true);
    try {
      const data: UsersResponse = await getUsers(
        pageNum,
        pageSize,
        search,
        sortField,
        sortOrder
      );
      setUsers(data.users);
      setTotalUsers(data.total);
      setPageCount(data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, pageSize, search, sortField, sortOrder);
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
      <div className="flex items-start justify-between">
        <Heading
          title={`Usuários (${totalUsers})`}
          description="Gerenciar usuários"
        />
        <Button
          className="text-lg dark:text-black"
          onClick={() => {
            router.push(`/dashboard/usuarios/new`);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Criar
        </Button>
      </div>
      <Separator />
      <DataTableComponent
        //@ts-ignore
        columns={columns}
        data={users}
        searchKey="name"
        placeholderInput="Pesquise por usuários"
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

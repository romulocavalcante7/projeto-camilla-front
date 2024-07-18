'use client';

import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/sticker-tables/columns';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StickerTable } from './sticker-table';
import { getAllStickers, Sticker } from '@/services/stickerService';

const breadcrumbItems = [{ title: 'Figurinhas', link: '/dashboard/figurinha' }];

export const StickerClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page')) || 1
  );
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );
  const [totalStickers, setTotalStickers] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchStickers = async (pageNum: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllStickers(pageNum, pageSize, search);
      setStickers(data.stickers);
      setTotalStickers(data.total);
      setPageCount(data.totalPages);
    } catch (error) {
      console.error('Error fetching stickers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStickers(page, search);
  }, [page, search, pageSize]);

  useEffect(() => {
    setPage(Number(searchParams.get('page')) || 1);
    setSearch(searchParams.get('search') || undefined);
  }, [searchParams]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="flex-1 space-y-4 overflow-auto p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title={`Figurinhas (${totalStickers})`}
          description="Gerencie as figurinhas"
        />
        <Button
          onClick={() => router.push(`/dashboard/figurinha/new`)}
          className="text-lg dark:text-black"
        >
          <Plus className="mr-2 h-4 w-4" /> Criar
        </Button>
      </div>
      <Separator />
      <StickerTable
        columns={columns}
        data={stickers}
        searchKey="subniche"
        pageCount={pageCount}
        pageSize={pageSize}
        page={page}
        loading={loading}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
};

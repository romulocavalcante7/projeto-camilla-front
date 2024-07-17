'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { getAllStickers, Sticker } from '@/services/stickerService';

export const StickerClient = () => {
  const router = useRouter();
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );

  const fetchStickers = async (pageNum: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllStickers(pageNum, 100, search);
      setStickers(data.stickers);
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Error fetching subnichos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStickers(page, search);
  }, [page, search]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Figurinhas (${stickers?.length})`}
          description="Gerencie as figurinhas"
        />
        <Button
          className="dark:text-black"
          onClick={() => router.push(`/dashboard/figurinha/new`)}
        >
          <Plus className="mr-2 h-6 w-6" /> Criar
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={stickers} />
    </>
  );
};

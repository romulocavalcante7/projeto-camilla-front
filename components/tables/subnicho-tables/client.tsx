'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { getAllSubniches, Subniche } from '@/services/subnicheService';

export const SubnichoClient = () => {
  const router = useRouter();
  const [subniches, setSubniches] = useState<Subniche[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );

  const fetchSubniches = async (pageNum: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllSubniches(pageNum, 100, search);
      console.log('data', data);
      setSubniches(data.subniches);
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Error fetching subnichos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubniches(page, search);
  }, [page, search]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Subnichos (${subniches?.length})`}
          description="Gerencie os subnichos"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/subnicho/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Criar
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={subniches} />
    </>
  );
};

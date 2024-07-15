'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { Category, getAllCategories } from '@/services/categoryService';

export const NichoClient = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );

  const fetchCategories = async (pageNum: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllCategories(pageNum, 100, search);
      setCategories(data.categories);
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page, search);
  }, [page, search]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Nichos (${categories?.length})`}
          description="Gerencie os nichos"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/nichos/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Criar
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={categories} />
    </>
  );
};

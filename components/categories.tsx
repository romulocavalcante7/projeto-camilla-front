'use client';
import { useEffect, useState } from 'react';
import { getAllCategories, Category } from '@/services/categoryService';
import Link from 'next/link';
import Image from 'next/image';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import { Loader2 } from 'lucide-react';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchCategories = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await getAllCategories(pageNum, 12);
      console.log('data', data);

      // Update categories list, avoiding duplicates
      setCategories((prevCategories) => {
        const newCategories = data.categories.filter(
          (category) => !prevCategories.some((prev) => prev.id === category.id)
        );
        return [...prevCategories, ...newCategories];
      });

      // Check if there are more pages to load
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  const loadMore = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Initial loading state
  if (loading && page === 1) return <div>Loading...</div>;

  return (
    <div className="max-h-full w-full overflow-y-auto">
      <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categorias/${category.id}?name=${encodeURIComponent(
              category.name
            )}`}
          >
            <div className="relative flex h-48 cursor-pointer items-center justify-center rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white">
              {category?.attachment?.url && (
                <Image
                  className="absolute left-0 top-0 h-full w-full rounded-2xl object-cover"
                  src={category?.attachment?.url}
                  width={1200}
                  height={800}
                  quality={100}
                  alt="image"
                />
              )}
              <p className="text-white">{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
      <InfiniteScroll
        hasMore={hasMore}
        isLoading={loading}
        next={loadMore}
        threshold={1}
      >
        {loading && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
      </InfiniteScroll>
    </div>
  );
};

export default CategoryList;

'use client';
import { useEffect, useState } from 'react';
import { getAllCategories, Category } from '@/services/categoryService';
import Link from 'next/link';
import Image from 'next/image';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Search from './search';
import { motion } from 'framer-motion';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(0);
  const searchParams = useSearchParams();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );

  const fetchCategories = async (pageNum: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllCategories(
        pageNum,
        10,
        search,
        undefined,
        undefined,
        'true'
      );

      setCategories((prevCategories) => {
        const newCategories = data.categories.filter(
          (category) => !prevCategories.some((prev) => prev.id === category.id)
        );
        return [...prevCategories, ...newCategories];
      });
      setTotalPage(data.totalPages);
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

  const loadMore = () => {
    if (!loading && page < totalPage) {
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1);
      }, 1000);
    }
  };

  const handleSearch = (newSearch: string) => {
    if (!newSearch) {
      setSearch(newSearch);
      setPage(1);
      setCategories([]);
      return;
    }
    setSearch(newSearch);
    setPage(1);
    setCategories([]);
  };

  return (
    <div className="flex max-h-full w-full flex-col items-center gap-8 px-5">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Search
          className="w-full"
          onSearch={handleSearch}
          placeholder="Busque um nicho"
          defaultValues={{ search }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categorias/${category.id}?name=${encodeURIComponent(
              category.name
            )}`}
          >
            <div className="md:bg-fill relative flex h-52 cursor-pointer items-center justify-center rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white sm:h-64">
              {category?.attachment?.url && (
                <Image
                  className="absolute left-0 top-0 h-full w-full rounded-2xl object-cover object-left-bottom"
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
      </motion.div>
      <InfiniteScroll
        page={page}
        totalPage={totalPage}
        hasMore={hasMore}
        isLoading={loading}
        next={loadMore}
        threshold={1}
      >
        {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
      </InfiniteScroll>
      {!hasMore && categories.length === 0 && (
        <p className="text-center text-xl text-gray-500">
          Não foi encontrado nichos
        </p>
      )}
    </div>
  );
};

export default CategoryList;

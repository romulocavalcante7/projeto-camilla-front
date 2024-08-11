'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useScroll } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Search from '@/components/search';
import { Category } from '@/services/categoryService';
import { Subniche } from '@/services/subnicheService';
import { searchCategoriesAndSubniches } from '@/services/searchService';
import InfiniteScroll from '@/components/ui/InfiniteScroll';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { scrollY } = useScroll();

  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subniches, setSubniches] = useState<Subniche[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get('page') || '1')
  );
  const [totalPage, setTotalPage] = useState<number>(0);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || ''
  );
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollAbove10(latest > 10);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

  const fetchResults = async (pageNum: number, searchQuery?: string) => {
    setLoading(true);
    try {
      const data = await searchCategoriesAndSubniches(
        pageNum,
        10,
        searchQuery,
        'createdAt',
        'desc',
        'true'
      );
      setCategories((prevCategories) => {
        const newCategories = data.categories.filter(
          (category) => !prevCategories.some((prev) => prev.id === category.id)
        );
        return [...prevCategories, ...newCategories];
      });

      setSubniches((prevSubniches) => {
        const newSubniches = data.subniches.filter(
          (subniche) => !prevSubniches.some((prev) => prev.id === subniche.id)
        );
        return [...prevSubniches, ...newSubniches];
      });

      setTotalPage(data.totalPages);
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      fetchResults(page, search ? search : undefined);
    }
  }, [page, search]);

  const loadMore = () => {
    if (!loading && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
      router.replace(`?search=${search}`);
    }
  };

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
    setCategories([]);
    setSubniches([]);
    router.replace(`?search=${newSearch}`);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'tween',
          duration: 0.4,
          ease: [0.25, 0.25, 0.25, 0.75]
        }}
        className={cn(
          'sticky left-0 top-0 z-[2] flex w-full flex-col gap-5 bg-white px-5 py-5 transition-all dark:bg-transparent',
          scrollAbove10 && 'dark:bg-[#1a101b]/80 dark:backdrop-blur-md'
        )}
      >
        <div className="relative flex flex-col gap-2">
          <Link className="w-fit" href="/">
            <Image
              src="/logo-v2.png"
              width={160}
              height={40}
              alt="icone logo"
            />
          </Link>
          <div className="flex items-center gap-5">
            <ArrowLeft
              className="cursor-pointer"
              size={30}
              onClick={() => router.back()}
            />
            <p className="text-2xl font-bold">Pesquisa</p>
          </div>
        </div>
      </motion.div>
      <div className="flex w-full flex-col items-center justify-center gap-4 px-5">
        <div className="w-full">
          <Search
            onSearch={handleSearch}
            placeholder="Faça sua pesquisa"
            defaultValues={{ search: '' }}
          />
        </div>

        <InfiniteScroll
          page={page}
          totalPage={totalPage}
          hasMore={hasMore}
          isLoading={loading}
          next={loadMore}
          threshold={1}
        >
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.id}?name=${encodeURIComponent(
                  category.name
                )}`}
              >
                <div className="relative flex h-40 cursor-pointer items-center justify-center rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white sm:h-64">
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
            {subniches.map((subniche) => (
              <Link
                key={subniche.id}
                href={`/figurinha/${subniche.id}?name=${encodeURIComponent(
                  subniche.name
                )}`}
              >
                <div className="relative flex h-40 cursor-pointer items-center justify-center rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white sm:h-64">
                  {subniche?.attachment?.url && (
                    <Image
                      className="absolute left-0 top-0 h-full w-full rounded-2xl object-cover"
                      src={subniche?.attachment?.url}
                      width={1200}
                      height={800}
                      quality={100}
                      alt="image"
                    />
                  )}
                  <p className="text-white">{subniche.name}</p>
                </div>
              </Link>
            ))}
          </div>
          {hasMore ||
            (loading && <Loader2 className="my-4 h-8 w-8 animate-spin" />)}
        </InfiniteScroll>

        {!hasMore &&
          search &&
          categories.length === 0 &&
          subniches.length === 0 &&
          !loading && (
            <p className="text-center text-lg text-gray-500 sm:text-xl">
              Não foi encontrado nichos ou subnichos
            </p>
          )}

        {!hasMore &&
          !search &&
          categories.length === 0 &&
          subniches.length === 0 &&
          !loading && (
            <p className="text-center text-lg text-gray-500 sm:text-xl">
              Faça uma pesquisa para encontrar nichos e subnichos.
            </p>
          )}
      </div>
    </div>
  );
};

export default Page;

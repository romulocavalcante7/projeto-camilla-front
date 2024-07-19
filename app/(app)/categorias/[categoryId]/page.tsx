'use client';

import { useEffect, useState } from 'react';
import { getSubnichesByCategoryId, Subniche } from '@/services/subnicheService';
import Link from 'next/link';
import { useScroll, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import Search from '@/components/search';
import { cn } from '@/lib/utils';

interface SubnicheProps {
  params: {
    categoryId: string;
  };
}

const SubnicheList = ({ params }: SubnicheProps) => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const { categoryId } = params;
  const { scrollY } = useScroll();
  const router = useRouter();
  const [subniches, setSubniches] = useState<Subniche[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );

  const fetchSubniches = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getSubnichesByCategoryId(
        categoryId as string,
        page,
        10,
        search,
        'true'
      );
      //@ts-ignore
      setSubniches((prev) => {
        const newSubniches = data.subniches.map((subniche) => ({
          id: subniche.id,
          name: subniche.name,
          attachment: subniche.attachment
        }));
        return [...prev, ...newSubniches];
      });
      setTotalPage(data.totalPages);
      setHasMore(page < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubniches(page, search);
  }, [page, search]);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollAbove10(latest > 10);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

  const loadMore = () => {
    if (!loading && page < totalPage) {
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1);
      }, 1000);
    }
  };

  const handleSearch = (newSearch: string) => {
    if (!newSearch) {
      return setSearch(newSearch);
    }
    setSearch(newSearch);
    setPage(1);
    setSubniches([]);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
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
            <p className="text-2xl font-bold">{name}</p>
          </div>
        </div>
        <Search
          onSearch={handleSearch}
          placeholder="Busque por um subnicho"
          defaultValues={{ search }}
        />
      </motion.div>
      <ul className="grid h-full w-full grid-cols-1 items-center justify-items-center gap-10 overflow-y-auto px-5 lg:grid-cols-2">
        {subniches.map((subniche) => (
          <Link
            className="w-full"
            key={subniche.id}
            href={`/figurinha/${subniche.id}?name=${encodeURIComponent(
              subniche.name
            )}`}
          >
            <li className="relative flex h-40 w-full items-center justify-center rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white">
              {subniche?.attachment?.url && (
                <Image
                  className="absolute left-0 top-0 h-full w-full rounded-2xl object-cover object-bottom"
                  src={subniche?.attachment?.url}
                  width={1200}
                  height={800}
                  quality={100}
                  alt="image"
                />
              )}
              <p>{subniche.name}</p>
            </li>
          </Link>
        ))}
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
        {!hasMore && subniches.length === 0 && (
          <p className="text-xl text-gray-500">Não foi encontrado subnichos</p>
        )}
      </ul>
    </div>
  );
};

export default SubnicheList;

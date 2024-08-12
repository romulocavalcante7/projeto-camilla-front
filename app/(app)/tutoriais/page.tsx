'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useScroll, motion } from 'framer-motion';
import { getAllTutorials, Tutorial } from '@/services/tutorialServices';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Search from '@/components/search';

const Page = () => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const searchParams = useSearchParams();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );
  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollAbove10(latest > 10);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

  const fetchTutorials = async (pageNum: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllTutorials(
        pageNum,
        10,
        search,
        undefined,
        undefined,
        true
      );
      setTutorials((prevTutorials) => {
        const newTutorials = data.tutorials.filter(
          (tutorial) => !prevTutorials.some((prev) => prev.id === tutorial.id)
        );
        return [...prevTutorials, ...newTutorials];
      });
      setTotalPage(data.totalPages);
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials(page, search ? search : undefined);
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
      setSearch('');
      setPage(1);
      setTutorials([]);
      return;
    }
    setSearch(newSearch);
    setPage(1);
    setTutorials([]);
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
            <p className="text-2xl font-bold">Tutoriais</p>
          </div>
        </div>
        <Search
          className="w-full"
          onSearch={handleSearch}
          placeholder="Busque um tutorial"
          defaultValues={{ search }}
        />
      </motion.div>
      <div className="flex max-h-full w-full flex-col items-center gap-8 px-5">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2"
        >
          {tutorials.map((tutorial) => (
            <Link key={tutorial.id} href={`/tutoriais/${tutorial.id}`}>
              <div className="md:bg-fill relative flex h-52 cursor-pointer items-center justify-center rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white sm:h-64">
                {tutorial?.attachment?.url && (
                  <Image
                    className="absolute left-0 top-0 h-full w-full rounded-2xl object-cover"
                    src={tutorial?.attachment?.url}
                    width={1200}
                    height={800}
                    quality={100}
                    alt="image"
                  />
                )}
                <p className="text-white">{tutorial.name}</p>
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
        {!hasMore && tutorials.length === 0 && !loading && (
          <p className="text-center text-xl text-gray-500">
            Não foi encontrado tutoriais
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;

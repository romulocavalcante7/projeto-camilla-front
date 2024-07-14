'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Search from '@/components/search';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useScroll, motion } from 'framer-motion';
import {
  getAllStickers,
  Sticker,
  StickerResponse
} from '@/services/stickerService';
import Clipboard from '@/components/clipboard';
import InfiniteScroll from '@/components/ui/InfiniteScroll';

const RecentStickerList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );
  const { scrollY } = useScroll();
  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollAbove10(latest > 10);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

  useEffect(() => {
    fetchStickers(page, search);
  }, [page, search]);

  const fetchStickers = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const data: StickerResponse = await getAllStickers(page, 10, search);
      setStickers((prev) => {
        const newStickers = data.stickers.filter(
          (sticker) =>
            !prev.some((prevSticker) => prevSticker.id === sticker.id)
        );
        return [...prev, ...newStickers];
      });
      setTotalPage(data.totalPages);
      setHasMore(page < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

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
    setStickers([]);
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
            <p className="text-2xl font-bold">Recentes</p>
          </div>
        </div>
        <Search
          onSearch={handleSearch}
          placeholder="Busque uma figurinha"
          defaultValues={{ search }}
        />
      </motion.div>
      <div className="max-h-full w-full px-5">
        <div className="flex w-full flex-col items-center gap-3">
          <Clipboard stickers={stickers} />
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
          {!hasMore && stickers.length === 0 && (
            <p className="text-xl text-gray-500">
              Não possui figurinhas nesse subnicho
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentStickerList;

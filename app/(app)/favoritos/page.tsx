'use client';

import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import {
  getAllFavoriteStickers,
  FavoriteSticker
} from '@/services/favoriteSticker';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import Clipboard from '@/components/clipboard';
import Link from 'next/link';
import { useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Favorites = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [stickersFavorites, setStickersFavorites] = useState<FavoriteSticker[]>(
    []
  );
  const { scrollY } = useScroll();
  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);

  const fetchFavorites = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllFavoriteStickers(page, 10, search);
      setStickersFavorites((prev) => {
        const newFavorites = data.favorites.filter(
          (favorite) =>
            !prev.some((prevFavorite) => prevFavorite.id === favorite.id)
        );
        return [...prev, ...newFavorites];
      });
      setTotalPage(data.totalPages);
      setHasMore(page < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollAbove10(latest > 10);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

  useEffect(() => {
    fetchFavorites(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && page < totalPage) {
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1);
      }, 1000);
    }
  };
  const handleFavoriteRemoved = (stickerId: string) => {
    setStickersFavorites((prev) =>
      prev.filter((favorite) => favorite.sticker.id !== stickerId)
    );
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
            <p className="text-2xl font-bold">Favoritos</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={'hidden'}
        whileInView={'show'}
        viewport={{ once: true }}
        className="max-h-full w-full px-5"
      >
        <div className="flex w-full flex-col items-center gap-3">
          <Clipboard
            isFavorite={true}
            stickers={stickersFavorites.map((Favorites) => Favorites.sticker)}
            onFavoriteRemoved={handleFavoriteRemoved}
          />
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
          {!hasMore && stickersFavorites.length === 0 && (
            <p className="text-xl text-gray-500">
              Não possui figurinhas favoritadas
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Favorites;

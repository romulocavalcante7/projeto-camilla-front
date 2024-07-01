'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import {
  getAllFavoriteStickers,
  FavoriteSticker
} from '@/services/favoriteSticker';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import Clipboard from '@/components/clipboard';

const Favorites = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [stickersFavorites, setStickersFavorites] = useState<FavoriteSticker[]>(
    []
  );

  const fetchFavorites = async (page: number) => {
    setLoading(true);
    try {
      const data = await getAllFavoriteStickers(page, 2);
      console.log('data', data);
      setStickersFavorites((prev) => {
        const newFavorites = data.favorites.filter(
          (favorite) =>
            !prev.some((prevFavorite) => prevFavorite.id === favorite.id)
        );
        return [...prev, ...newFavorites];
      });
      setHasMore(page < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(page);
  }, [page]);

  const loadMore = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && page === 1) return <></>;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="sticky left-0 top-0 z-10 flex w-full flex-col gap-2 bg-white py-5 transition-all">
        <Image src="/logo-v2.png" width={160} height={40} alt="icone logo" />
        <Image
          className="absolute right-0 top-5 cursor-pointer"
          src="/icons/menu-home.svg"
          width={40}
          height={40}
          alt="menu icone home"
        />
        <div className="flex items-center gap-5">
          <ArrowLeft
            className="cursor-pointer"
            size={30}
            onClick={() => router.back()}
          />
          <p className="text-2xl font-bold">Favoritos</p>
        </div>
      </div>
      <div className="max-h-full w-full overflow-y-auto">
        <div className="flex w-full flex-col items-center gap-3">
          <Clipboard
            isFavorite={true}
            stickers={stickersFavorites.map((Favorites) => Favorites.sticker)}
          />
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            next={loadMore}
            threshold={1}
          >
            {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Favorites;

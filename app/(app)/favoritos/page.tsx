'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import {
  getAllFavoriteStickers,
  FavoriteSticker
} from '@/services/favoriteSticker';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import Clipboard from '@/components/clipboard';
import Link from 'next/link';
import Search from '@/components/search';

const Favorites = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [stickersFavorites, setStickersFavorites] = useState<FavoriteSticker[]>(
    []
  );
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );

  const fetchFavorites = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllFavoriteStickers(page, 10, search);
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
    fetchFavorites(page, search);
  }, [page, search]);

  const loadMore = () => {
    if (!loading) {
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
    setStickersFavorites([]);
  };

  const handleFavoriteRemoved = (stickerId: string) => {
    setStickersFavorites((prev) =>
      prev.filter((favorite) => favorite.sticker.id !== stickerId)
    );
  };

  if (loading && page === 1) return <></>;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="sticky left-0 top-0 z-10 flex w-full flex-col gap-5 bg-white py-5 transition-all dark:bg-background">
        <div className="flex flex-col gap-2">
          <Link className="w-fit" href="/">
            <Image
              src="/logo-v2.png"
              width={160}
              height={40}
              alt="icone logo"
            />
          </Link>
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
        <Search
          onSearch={handleSearch}
          placeholder="Busque uma figurinha"
          defaultValues={{ search }}
        />
      </div>
      <div className="max-h-full w-full overflow-y-auto">
        <div className="flex w-full flex-col items-center gap-3">
          <Clipboard
            isFavorite={true}
            stickers={stickersFavorites.map((Favorites) => Favorites.sticker)}
            onFavoriteRemoved={handleFavoriteRemoved}
          />
          <InfiniteScroll
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
      </div>
    </div>
  );
};

export default Favorites;

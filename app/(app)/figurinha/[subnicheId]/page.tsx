'use client';

import { useEffect, useState } from 'react';
import {
  getStickersBySubnicheId,
  Sticker,
  StickerResponse
} from '@/services/stickerService';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Clipboard from '@/components/clipboard';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import Search from '@/components/search';
import Link from 'next/link';

interface SubnicheProps {
  params: {
    subnicheId: string;
  };
}

const FavoriteStickerList = ({ params }: SubnicheProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name');
  const { subnicheId } = params;

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );

  const fetchStickers = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const data: StickerResponse = await getStickersBySubnicheId(
        subnicheId,
        page,
        10,
        search
      );
      setStickers((prev) => {
        const newStickers = data.stickers.filter(
          (sticker) =>
            !prev.some((prevSticker) => prevSticker.id === sticker.id)
        );
        return [...prev, ...newStickers];
      });
      setHasMore(page < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStickers(page, search);
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
    setStickers([]);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="sticky left-0 top-0 z-10 flex w-full flex-col gap-5 bg-white py-5 transition-all">
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
            <p className="text-2xl font-bold">{name}</p>
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
          <Clipboard stickers={stickers} />
          <InfiniteScroll
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

export default FavoriteStickerList;

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import Link from 'next/link';
import { useScroll, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  getUserStickers,
  StickerResponse,
  Sticker
} from '@/services/userStickerService';
import UserClipboard from '@/components/userStickercCipboard';
import { Button } from '@/components/ui/button';

const UserStickerList = () => {
  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [totalStickers, setTotalStickers] = useState(0);
  const { scrollY } = useScroll();
  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);

  const fetchStickers = async (page: number) => {
    setLoading(true);
    try {
      const data: StickerResponse = await getUserStickers(page, 10);
      setStickers((prev) => {
        const newStickers = data.stickers.filter(
          (sticker) =>
            !prev.some((prevSticker) => prevSticker.id === sticker.id)
        );
        return [...prev, ...newStickers];
      });
      setTotalStickers(data.total);
      setTotalPage(data.totalPages);
      setHasMore(page < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStickers(page);
  }, [page]);

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
            <p className="text-2xl font-bold">Minhas figurinhas</p>
          </div>
        </div>
      </motion.div>
      <div className="max-h-full w-full overflow-y-auto px-5">
        <div className="flex w-full flex-col items-center gap-3">
          <UserClipboard stickers={stickers} />
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
            <div className="flex flex-col items-center gap-5">
              <p className="max-w-[200px] text-center text-xl text-gray-500 dark:text-white/90">
                Você ainda não criou nenhuma figurinha
              </p>

              <Button
                asChild
                className="w-full max-w-[200px] bg-[#B743D0] hover:bg-[#b351c9]"
              >
                <Link href="/criar">Criar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStickerList;

'use client';

import { useEffect, useState } from 'react';
import { getStickersBySubnicheId, Sticker } from '@/services/stickerService';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Clipboard from '@/components/clipboard';

interface SubnicheProps {
  params: {
    subnicheId: string;
  };
}

const StickerList = ({ params }: SubnicheProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name');
  console.log('params', name);
  const { subnicheId } = params;

  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log('stickers', stickers);
  useEffect(() => {
    if (subnicheId) {
      const fetchStickers = async () => {
        try {
          const data = await getStickersBySubnicheId(subnicheId as string);
          setStickers(data);
        } finally {
          setLoading(false);
        }
      };

      fetchStickers();
    }
  }, [subnicheId]);

  if (loading) return <></>;

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
          <p className="text-2xl font-bold">{name}</p>
        </div>
      </div>
      <Clipboard stickers={stickers} />
    </div>
  );
};

export default StickerList;

'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import Search from '@/components/search';
import Link from 'next/link';

const RecentStickerList = () => {
  const router = useRouter();
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
            <p className="text-2xl font-bold">Recentes</p>
          </div>
        </div>
        <Search
          onSearch={() => {}}
          placeholder="Busque uma figurinha"
          defaultValues={{ search: '' }}
        />
      </div>
      <p>Recentes ...</p>
    </div>
  );
};

export default RecentStickerList;

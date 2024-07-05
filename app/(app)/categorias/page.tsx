'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import CategoryList from '@/components/categories';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const Category = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  return (
    <div className="flex flex-col gap-2">
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
            <p className="text-2xl font-bold">Nichos</p>
          </div>
        </div>
      </div>
      <CategoryList />
    </div>
  );
};

export default Category;

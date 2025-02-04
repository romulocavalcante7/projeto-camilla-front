'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import CategoryList from '@/components/categories';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, useScroll, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Category = () => {
  const router = useRouter();
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

  return (
    <div className="flex flex-col gap-2">
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
            <p className="text-2xl font-bold">Categorias</p>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        <CategoryList />
      </AnimatePresence>
    </div>
  );
};

export default Category;

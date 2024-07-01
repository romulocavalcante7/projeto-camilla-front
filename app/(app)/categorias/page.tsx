'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getAllCategories, Category } from '@/services/categoryService';
import Link from 'next/link';
import Image from 'next/image';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <></>;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-5">
        <Link href="/">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">Nichos</h1>
      </div>

      <ul className="flex h-full flex-col items-center justify-center gap-5 overflow-y-auto">
        {categories.map((category) => (
          <li
            className="relative flex h-40 w-full items-center justify-center rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white"
            key={category.id}
          >
            <Image
              className="absolute left-0 top-0 h-full w-full rounded-2xl object-cover"
              src={category?.attachment?.url}
              width={1200}
              height={800}
              quality={100}
              alt="image"
            />
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;

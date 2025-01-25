import { Compare } from '@/components/ui/compare';
import React from 'react';
import Antes from '@/app/assets/antes.png';
import Depois from '@/app/assets/depois.png';
const page = () => {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-neutral-100 p-4  px-4 dark:border-neutral-800 dark:bg-neutral-900">
      <Compare
        firstImage={Antes}
        secondImage={Depois}
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="w-full md:h-[500px] md:w-[500px]"
        slideMode="hover"
      />
    </div>
  );
};

export default page;

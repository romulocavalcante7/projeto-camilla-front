import BreadCrumb from '@/components/breadcrumb';
import { StickerClient } from '@/components/tables/sticker-tables/client';
import { Suspense } from 'react';

const breadcrumbItems = [{ title: 'Figurinhas', link: '/dashboard/figurinha' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense>
          <StickerClient />
        </Suspense>
      </div>
    </>
  );
}

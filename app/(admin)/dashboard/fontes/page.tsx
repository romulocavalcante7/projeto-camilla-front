import BreadCrumb from '@/components/breadcrumb';
import { FontClient } from '@/components/tables/font-tables/client';
import { Suspense } from 'react';

const breadcrumbItems = [{ title: 'Fontes', link: '/dashboard/fontes' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense>
          <FontClient />
        </Suspense>
      </div>
    </>
  );
}

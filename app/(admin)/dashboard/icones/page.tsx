import BreadCrumb from '@/components/breadcrumb';
import { IconClient } from '@/components/tables/icon-tables/client';
import { Suspense } from 'react';

const breadcrumbItems = [{ title: 'Ícones', link: '/dashboard/icones' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense>
          <IconClient />
        </Suspense>
      </div>
    </>
  );
}

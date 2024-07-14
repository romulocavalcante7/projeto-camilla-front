import BreadCrumb from '@/components/breadcrumb';
import { SubnichoClient } from '@/components/tables/subnicho-tables/client';
import { Suspense } from 'react';

const breadcrumbItems = [{ title: 'Subnicho', link: '/dashboard/subnicho' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense>
          <SubnichoClient />
        </Suspense>
      </div>
    </>
  );
}

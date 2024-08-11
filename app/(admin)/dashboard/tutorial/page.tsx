import BreadCrumb from '@/components/breadcrumb';
import { TutorialClient } from '@/components/tables/tutorial-tables/client';
import { Suspense } from 'react';

const breadcrumbItems = [{ title: 'Tutorial', link: '/dashboard/tutorial' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense>
          <TutorialClient />
        </Suspense>
      </div>
    </>
  );
}

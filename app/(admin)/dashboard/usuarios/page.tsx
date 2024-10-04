import React, { Suspense } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { UserClient } from '@/components/tables/user-tables/client';

const breadcrumbItems = [{ title: 'Usuários', link: '/dashboard/user' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Suspense>
          <UserClient />
        </Suspense>
      </div>
    </>
  );
}

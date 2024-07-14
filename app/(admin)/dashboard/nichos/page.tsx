import BreadCrumb from '@/components/breadcrumb';
import { NichoClient } from '@/components/tables/nicho-tables/client';

const breadcrumbItems = [{ title: 'Nichos', link: '/dashboard/nichos' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <NichoClient />
      </div>
    </>
  );
}

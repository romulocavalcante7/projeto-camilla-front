'use client';
import BreadCrumb from '@/components/breadcrumb';
import { SubnichoForm } from '@/components/forms/subnicho-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Subnichos', link: '/dashboard/subnicho' },
    { title: 'Criar', link: '/dashboard/nichos/create' }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <SubnichoForm />
      </div>
    </ScrollArea>
  );
}

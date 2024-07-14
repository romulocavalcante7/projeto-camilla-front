'use client';
import BreadCrumb from '@/components/breadcrumb';
import { NichosForm } from '@/components/forms/nichos-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Nichos', link: '/dashboard/nichos' },
    { title: 'Criar', link: '/dashboard/nichos/create' }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <NichosForm />
      </div>
    </ScrollArea>
  );
}

'use client';
import BreadCrumb from '@/components/breadcrumb';
import { FontsForm } from '@/components/forms/font-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Fontes', link: '/dashboard/fontes' },
    { title: 'Criar', link: '/dashboard/fontes/create' }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <FontsForm />
      </div>
    </ScrollArea>
  );
}

'use client';
import BreadCrumb from '@/components/breadcrumb';
import { IconsForm } from '@/components/forms/icon-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Icones', link: '/dashboard/icones' },
    { title: 'Criar', link: '/dashboard/icones/create' }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <IconsForm />
      </div>
    </ScrollArea>
  );
}

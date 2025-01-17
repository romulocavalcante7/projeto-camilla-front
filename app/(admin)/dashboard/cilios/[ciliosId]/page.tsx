'use client';
import BreadCrumb from '@/components/breadcrumb';
import { StickerForm } from '@/components/forms/sticker-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Cílios', link: '/dashboard/cilios' },
    { title: 'Criar', link: '/dashboard/cilios/create' }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <StickerForm />
      </div>
    </ScrollArea>
  );
}

'use client';
import BreadCrumb from '@/components/breadcrumb';
import { StickerForm } from '@/components/forms/sticker-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Figurinhas', link: '/dashboard/figurinha' },
    { title: 'Criar', link: '/dashboard/figurinha/create' }
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

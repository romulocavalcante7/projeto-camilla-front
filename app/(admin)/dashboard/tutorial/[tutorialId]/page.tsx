'use client';
import BreadCrumb from '@/components/breadcrumb';
import { TutorialsForm } from '@/components/forms/tutorials-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Tutorial', link: '/dashboard/tutorial' },
    { title: 'Criar', link: '/dashboard/tutorial/create' }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <TutorialsForm />
      </div>
    </ScrollArea>
  );
}

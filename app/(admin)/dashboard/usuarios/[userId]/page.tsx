import React from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Usuário', link: '/dashboard/usuarios' },
    { title: 'Detalhes', link: '/dashboard/user/create' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <UserForm />
      </div>
    </ScrollArea>
  );
}

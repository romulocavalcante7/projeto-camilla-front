import React from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { UserCreateForm } from '@/components/forms/userCreate-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Usuario', link: '/dashboard/usuarios' },
    { title: 'Criar', link: '/dashboard/user/create' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <BreadCrumb items={breadcrumbItems} />
        <UserCreateForm />
      </div>
    </ScrollArea>
  );
}

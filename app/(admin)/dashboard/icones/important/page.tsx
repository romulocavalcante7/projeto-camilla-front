'use client';
import BreadCrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import {
  Icon,
  getAllImportantIcons,
  removeIconImportant,
  setIconDisplayOrder
} from '@/services/iconService';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Image from 'next/image';

export default function Page() {
  const [icons, setIcons] = useState<Icon[]>([]);

  useEffect(() => {
    fetchAllImportantIcons();
  }, []);

  const fetchAllImportantIcons = async () => {
    const data = await getAllImportantIcons();
    setIcons(data);
  };

  const handleOnDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(icons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setIcons(items);

    try {
      await Promise.all(
        items.map((item, index) => setIconDisplayOrder(item.id, index))
      );
      toast.success('Ordem atualizada');
    } catch (error) {
      console.error('Erro ao atualizar a ordem dos ícones:', error);
    }
  };

  const handleRemoveImportant = async (id: string) => {
    try {
      await removeIconImportant(id);
      setIcons((prevIcons) => prevIcons.filter((icon) => icon.id !== id));
      toast.success('Ícone removido dos mais usados');
    } catch (error) {
      console.error('Erro ao remover status importante do ícone:', error);
    }
  };

  const breadcrumbItems = [
    { title: 'Ícones', link: '/dashboard/icones' },
    { title: 'Mais Usados', link: '/dashboard/icones/important' }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Mais Usados" description="Ordene os ícones mais usados" />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="icons">
          {(provided) => (
            <div
              className="flex flex-col gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {icons.map((icon, index) => (
                <Draggable key={icon.id} draggableId={icon.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between gap-5 rounded-lg bg-gray-200 p-4 dark:bg-[#202020b2]"
                    >
                      <div className="flex items-center gap-4">
                        {icon.attachment?.url ? (
                          <Image
                            src={icon.attachment.url}
                            alt={icon.name}
                            width={60}
                            height={60}
                            className="rounded-lg"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-lg bg-gray-300" />
                        )}
                        <p>{icon.name}</p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveImportant(icon.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

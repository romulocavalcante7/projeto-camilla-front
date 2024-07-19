'use client';
import BreadCrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import {
  Category,
  getAllImportantCategories,
  removeCategoryImportant,
  setCategoryDisplayOrder
} from '@/services/categoryService';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchAllImportantCategories();
  }, []);

  const fetchAllImportantCategories = async () => {
    const data = await getAllImportantCategories();
    console.log('data', data);
    setCategories(data);
  };

  const handleOnDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items);

    try {
      await Promise.all(
        items.map((item, index) => setCategoryDisplayOrder(item.id, index))
      );
      toast.success('Atualizado');
    } catch (error) {
      console.error('Erro ao atualizar a ordem das categorias:', error);
    }
  };

  const handleRemoveImportant = async (id: string) => {
    try {
      await removeCategoryImportant(id);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
      toast.success('Removido');
    } catch (error) {
      console.error('Erro ao remover status importante da categoria:', error);
    }
  };
  const breadcrumbItems = [
    { title: 'Nichos', link: '/dashboard/nichos' },
    { title: 'Mais Usados', link: '/dashboard/nichos/important' }
  ];
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Mais Usados" description="Ordene os mais usados" />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div
              className="flex flex-col gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {categories.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex flex-wrap items-center justify-between gap-5 rounded-lg bg-gray-200 p-4 dark:bg-[#202020b2]"
                    >
                      <div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-10">
                        <Image
                          className="rounded-lg"
                          src={category.attachment.url}
                          width={180}
                          height={40}
                          alt={category.attachment.filename}
                        />
                        <p> {category.name}</p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveImportant(category.id)}
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

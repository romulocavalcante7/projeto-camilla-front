'use client';
import BreadCrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import {
  Tutorial,
  getAllImportantTutorials,
  removeTutorialImportant,
  setTutorialDisplayOrder
} from '@/services/tutorialServices';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Page() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);

  useEffect(() => {
    fetchAllImportantTutorials();
  }, []);

  const fetchAllImportantTutorials = async () => {
    const data = await getAllImportantTutorials();
    setTutorials(data);
  };

  const handleOnDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tutorials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTutorials(items);

    try {
      await Promise.all(
        items.map((item, index) => setTutorialDisplayOrder(item.id, index))
      );
      toast.success('Ordem atualizada');
    } catch (error) {
      console.error('Erro ao atualizar a ordem dos tutoriais:', error);
    }
  };

  const handleRemoveImportant = async (id: string) => {
    try {
      await removeTutorialImportant(id);
      setTutorials((prevTutorials) =>
        prevTutorials.filter((tutorial) => tutorial.id !== id)
      );
      toast.success('Removido dos importantes');
    } catch (error) {
      console.error('Erro ao remover status importante do tutorial:', error);
    }
  };

  const breadcrumbItems = [
    { title: 'Tutoriais', link: '/dashboard/tutorial' },
    { title: 'Mais Usados', link: '/dashboard/tutorial/important' }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <Heading
        title="Mais Usados"
        description="Ordene os tutoriais mais usados"
      />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tutorials">
          {(provided) => (
            <div
              className="flex flex-col gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tutorials.map((tutorial, index) => (
                <Draggable
                  key={tutorial.id}
                  draggableId={tutorial.id}
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
                        {tutorial.attachment?.url ? (
                          <Image
                            className="rounded-lg"
                            src={tutorial.attachment?.url}
                            width={180}
                            height={40}
                            alt={tutorial.attachment.filename}
                          />
                        ) : (
                          <div className="w-full rounded-lg bg-gray-400"></div>
                        )}
                        <p> {tutorial.name}</p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveImportant(tutorial.id)}
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

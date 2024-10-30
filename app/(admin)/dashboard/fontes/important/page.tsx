'use client';
import BreadCrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import {
  Font,
  getAllImportantFonts,
  removeFontImportant,
  setFontDisplayOrder
} from '@/services/fontService';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Page() {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loadedFonts, setLoadedFonts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchAllImportantFonts();
  }, []);

  const fetchAllImportantFonts = async () => {
    const data = await getAllImportantFonts();
    setFonts(data);
    loadFonts(data);
  };

  const loadFonts = (fonts: Font[]) => {
    fonts.forEach(async (font) => {
      if (font.attachment?.url) {
        const fontName = font.name.split('.')[0];
        const fontFace = new FontFace(fontName, `url(${font.attachment.url})`);

        await fontFace.load();
        document.fonts.add(fontFace);

        setLoadedFonts((prev) => ({
          ...prev,
          [font.id]: fontName
        }));
      }
    });
  };

  const handleOnDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(fonts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFonts(items);

    try {
      await Promise.all(
        items.map((item, index) => setFontDisplayOrder(item.id, index))
      );
      toast.success('Atualizado');
    } catch (error) {
      console.error('Erro ao atualizar a ordem das fontes:', error);
    }
  };

  const handleRemoveImportant = async (id: string) => {
    try {
      await removeFontImportant(id);
      setFonts((prevFonts) => prevFonts.filter((font) => font.id !== id));
      toast.success('Removido');
    } catch (error) {
      console.error('Erro ao remover status importante da fonte:', error);
    }
  };

  const breadcrumbItems = [
    { title: 'Fontes', link: '/dashboard/fontes' },
    { title: 'Mais Usadas', link: '/dashboard/fontes/important' }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Mais Usadas" description="Ordene as fontes mais usadas" />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="fonts">
          {(provided) => (
            <div
              className="flex flex-col gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {fonts.map((font, index) => (
                <Draggable key={font.id} draggableId={font.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex flex-wrap items-center justify-between gap-5 rounded-lg bg-gray-200 p-4 dark:bg-[#202020b2]"
                    >
                      <div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-10">
                        {loadedFonts[font.id] ? (
                          <p
                            style={{
                              fontFamily: loadedFonts[font.id],
                              fontSize: '24px'
                            }}
                          >
                            {font.name}
                          </p>
                        ) : (
                          <div className="h-14 w-32 rounded-lg bg-gray-300 object-cover" />
                        )}
                        <p>{font.name}</p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveImportant(font.id)}
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

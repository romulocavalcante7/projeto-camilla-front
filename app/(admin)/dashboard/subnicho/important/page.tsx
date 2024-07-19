'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import BreadCrumb from '@/components/breadcrumb';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  getImportantSubnichesByCategoryId,
  removeSubnicheImportant,
  setSubnicheDisplayOrder,
  Subniche
} from '@/services/subnicheService';
import { Category, getAllCategories } from '@/services/categoryService';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { AutoComplete } from '@/components/autocomplete';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  category: z.string().min(1, { message: 'Selecione uma categoria' })
});

type SubnicheForm = z.infer<typeof formSchema>;

export default function Page() {
  const [subniches, setSubniches] = useState<Subniche[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories(1);
  }, []);

  const fetchCategories = async (pageNum: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllCategories(pageNum, 9000, search);
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImportantSubniches = async (categoryId: string) => {
    setLoading(true);
    try {
      const data = await getImportantSubnichesByCategoryId(categoryId);
      setSubniches(data);
      setCategorySelected(categoryId);
    } catch (error) {
      console.error('Error fetching important subniches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(subniches);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSubniches(items);

    try {
      await Promise.all(
        items.map((item, index) => setSubnicheDisplayOrder(item.id, index))
      );
      toast.success('Atualizado');
    } catch (error) {
      console.error('Erro ao atualizar a ordem dos subnichos:', error);
    }
  };

  const handleRemoveImportant = async (id: string) => {
    try {
      await removeSubnicheImportant(id);
      setSubniches((prevSubniches) =>
        prevSubniches.filter((subniche) => subniche.id !== id)
      );
      toast.success('Removido');
    } catch (error) {
      console.error('Erro ao remover status importante do subnicho:', error);
    }
  };

  const breadcrumbItems = [
    { title: 'Subnichos', link: '/dashboard/subnicho' },
    { title: 'Mais Usados', link: '/dashboard/subnicho/important' }
  ];

  const form = useForm<SubnicheForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: ''
    }
  });

  const onSubmit = async (data: SubnicheForm) => {
    if (data.category) {
      await fetchImportantSubniches(data.category);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Mais Usados" description="Ordene os mais usados" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Nicho</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={categories.map((item) => ({
                        label: item.name,
                        value: item.id
                      }))}
                      emptyMessage="Sem resultados"
                      placeholder="Pesquise por nicho"
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button className="dark:text-black" type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Buscar'}
          </Button>
        </form>
      </Form>

      {categorySelected && (
        <div>
          {subniches.length > 0 ? (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="subniches">
                {(provided) => (
                  <div
                    className="flex flex-col gap-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {subniches.map((subniche, index) => (
                      <Draggable
                        key={subniche.id}
                        draggableId={subniche.id}
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
                              {subniche.attachment && (
                                <Image
                                  className="rounded-lg"
                                  src={subniche.attachment.url}
                                  width={180}
                                  height={40}
                                  alt={subniche.attachment.filename}
                                />
                              )}
                              <p>{subniche.name}</p>
                            </div>
                            <Button
                              variant="destructive"
                              onClick={() => handleRemoveImportant(subniche.id)}
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
          ) : (
            <p className="text-center text-gray-500">
              Nenhum subnicho importante encontrado.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

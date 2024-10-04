'use client';
import React from 'react';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { toast } from 'react-hot-toast';
import { FileUploader } from '../file-uploader';
import {
  Category,
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory
} from '@/services/categoryService';
import { deleteFile, uploadMultipleFiles } from '@/services/uploadService';
import { AlertModal } from '../modal/alert-modal';
import Image from 'next/image';

export const IMG_MAX_LIMIT = 1;

const formSchema = z.object({
  name: z.string().min(1, { message: 'O campo nome é obrigatório.' }),
  images: z
    .array(z.instanceof(File))
    .max(IMG_MAX_LIMIT, { message: 'Você pode adicionar até 1 imagem' })
    .optional()
});

type NichosFormValues = z.infer<typeof formSchema>;

export const NichosForm = () => {
  const params = useParams();
  const { nichoId } = params;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  const fetchCategoryById = async (nichoId: string) => {
    setLoading(true);
    try {
      const data = await getCategoryById(nichoId);
      setCategory(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryById(nichoId.toString());
  }, []);

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        images: []
      });
    }
  }, [category]);

  const title = category?.id ? 'Editar Nicho' : 'Criar Nicho';
  const description = category?.id
    ? 'Edite um nicho'
    : 'Adicione um novo nicho';
  const toastMessage = category?.id ? 'Nicho atualizado' : 'Nicho criado';
  const action = category?.id ? 'Salvar alterações' : 'Criar';

  const form = useForm<NichosFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name,
      images: []
    }
  });

  const onSubmit = async (data: NichosFormValues) => {
    try {
      setLoading(true);
      let attachmentId;

      if (data.images && data.images.length > 0) {
        setImgLoading(true);
        const uploadedImages = await uploadMultipleFiles({
          files: data.images
        });
        setImgLoading(false);
        attachmentId = uploadedImages.files.map((img) => img.id)[0];
      }

      if (category) {
        const updateData: {
          name: string;
          attachmentId?: string;
        } = { name: data.name };
        if (attachmentId) {
          updateData.attachmentId = attachmentId;
        }
        await updateCategory(category.id, updateData);
      } else {
        await createCategory({
          name: data.name,
          attachmentId: attachmentId!
        });
      }

      router.refresh();
      router.push(`/dashboard/nichos`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Ops, algo deu errado.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (category) {
        if (category?.attachment?.id) {
          await deleteFile(category.attachment.id);
        }
        await deleteCategory(category.id);
      }
      router.refresh();
      router.push(`/dashboard/nichos`);
      toast.success('Nicho removido');
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onDeleteImg = async () => {
    try {
      setLoading(true);
      if (category) {
        await deleteFile(category.attachment.id);
        fetchCategoryById(category.id);
        toast.success('Imagem removida');
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpenImg(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <AlertModal
        isOpen={openImg}
        onClose={() => setOpenImg(false)}
        onConfirm={onDeleteImg}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {category?.id && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem</FormLabel>
                <FormControl>
                  {category?.attachment?.id ? (
                    <div className="relative">
                      <Image
                        loading="lazy"
                        className="h-64 w-full shrink-0 rounded-md bg-cover object-cover"
                        src={category?.attachment.url}
                        width={600}
                        height={800}
                        alt="image"
                      />
                      <Button
                        type="button"
                        className="absolute right-2 top-2"
                        disabled={loading || imgLoading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpenImg(true)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <FileUploader
                      value={field.value || []}
                      onValueChange={field.onChange}
                      maxFiles={IMG_MAX_LIMIT}
                      maxSize={4 * 1024 * 1024}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nome do nicho"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            disabled={loading}
            className="ml-auto w-full text-lg sm:w-fit sm:px-10 dark:text-black"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

'use client';

import React, { useEffect, useState } from 'react';
import * as z from 'zod';
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
  Icon,
  createIcon,
  deleteIcon,
  getIconById,
  updateIcon
} from '@/services/iconService';
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

type IconsFormValues = z.infer<typeof formSchema>;

export const IconsForm = () => {
  const params = useParams();
  const { iconId } = params;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [icon, setIcon] = useState<Icon | null>(null);

  const fetchIconById = async (iconId: string) => {
    setLoading(true);
    try {
      const data = await getIconById(iconId);
      setIcon(data);
    } catch (error) {
      console.error('Error fetching icons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIconById(iconId.toString());
  }, []);

  useEffect(() => {
    if (icon) {
      form.reset({
        name: icon.name,
        images: []
      });
    }
  }, [icon]);

  const title = icon?.id ? 'Editar Ícone' : 'Criar Ícone';
  const description = icon?.id ? 'Edite um ícone' : 'Adicione um novo ícone';
  const toastMessage = icon?.id ? 'Ícone atualizado' : 'Ícone criado';
  const action = icon?.id ? 'Salvar alterações' : 'Criar';

  const form = useForm<IconsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: icon?.name,
      images: []
    }
  });

  const onSubmit = async (data: IconsFormValues) => {
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

      if (icon) {
        const updateData: {
          name: string;
          attachmentId?: string;
        } = { name: data.name };
        if (attachmentId) {
          updateData.attachmentId = attachmentId;
        }
        await updateIcon(icon.id, updateData);
      } else {
        await createIcon({
          name: data.name,
          attachmentId: attachmentId!
        });
      }

      router.refresh();
      router.push(`/dashboard/icones`);
      toast.success(toastMessage);
    } catch (error: any) {
      console.log('error', error);
      toast.error('Ops, algo deu errado.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (icon) {
        if (icon?.attachment?.id) {
          await deleteFile(icon.attachment.id);
        }
        await deleteIcon(icon.id);
      }
      router.refresh();
      router.push(`/dashboard/icones`);
      toast.success('Ícone removido');
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onDeleteImg = async () => {
    try {
      setLoading(true);
      if (icon) {
        await deleteFile(icon.attachment.id);
        fetchIconById(icon.id);
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
        {icon?.id && (
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
                <FormLabel>Imagem do Ícone</FormLabel>
                <FormControl>
                  {icon?.attachment?.url ? (
                    <div className="relative w-fit rounded-md bg-[#3F3F3F]">
                      <Image
                        className="h-64 w-64 shrink-0 rounded-md bg-cover object-cover"
                        src={icon.attachment.url}
                        width={600}
                        height={800}
                        alt="Icon preview"
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
                      sticker
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
                        placeholder="Nome do ícone"
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

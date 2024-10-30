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
  Font,
  createFont,
  deleteFont,
  getFontById,
  updateFont
} from '@/services/fontService';
import { deleteFile, uploadMultipleFiles } from '@/services/uploadService';
import { AlertModal } from '../modal/alert-modal';

export const IMG_MAX_LIMIT = 1;

const formSchema = z.object({
  name: z.string().min(1, { message: 'O campo nome é obrigatório.' }),
  images: z
    .array(z.instanceof(File))
    .max(IMG_MAX_LIMIT, { message: 'Você pode adicionar até 1 imagem' })
    .optional()
});

type FontsFormValues = z.infer<typeof formSchema>;

export const FontsForm = () => {
  const params = useParams();
  const { fonteId } = params;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [font, setFont] = useState<Font | null>(null);
  const [fontName, setFontName] = useState<string | null>(null);

  const fetchFontById = async (fonteId: string) => {
    setLoading(true);
    try {
      const data = await getFontById(fonteId);
      setFont(data);
    } catch (error) {
      console.error('Error fetching fontes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFontById(fonteId.toString());
  }, []);

  useEffect(() => {
    if (font?.attachment?.url) {
      const fontName = font.name.split('.')[0];
      const fontFace = new FontFace(fontName, `url(${font.attachment.url})`);

      fontFace
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
          setFontName(fontName);
        })
        .catch((error) => {
          console.error('Erro ao carregar a fonte:', error);
        });
    }
  }, [font]);

  useEffect(() => {
    if (font) {
      form.reset({
        name: font.name,
        images: []
      });
    }
  }, [font]);

  const title = font?.id ? 'Editar Fonte' : 'Criar Fonte';
  const description = font?.id ? 'Edite uma fonte' : 'Adicione uma nova fonte';
  const toastMessage = font?.id ? 'Fonte atualizada' : 'Fonte criada';
  const action = font?.id ? 'Salvar alterações' : 'Criar';

  const form = useForm<FontsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: font?.name,
      images: []
    }
  });

  const onSubmit = async (data: FontsFormValues) => {
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

      if (font) {
        const updateData: {
          name: string;
          attachmentId?: string;
        } = { name: data.name };
        if (attachmentId) {
          updateData.attachmentId = attachmentId;
        }
        await updateFont(font.id, updateData);
      } else {
        await createFont({
          name: data.name,
          attachmentId: attachmentId!
        });
      }

      router.refresh();
      router.push(`/dashboard/fontes`);
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
      if (font) {
        if (font?.attachment?.id) {
          await deleteFile(font.attachment.id);
        }
        await deleteFont(font.id);
      }
      router.refresh();
      router.push(`/dashboard/fontes`);
      toast.success('Fonte removida');
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onDeleteImg = async () => {
    try {
      setLoading(true);
      if (font) {
        await deleteFile(font.attachment.id);
        fetchFontById(font.id);
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
        {font?.id && (
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
                <FormLabel>Prévia da Fonte</FormLabel>
                <FormControl>
                  {font?.attachment?.url ? (
                    <div className="relative">
                      <div className="flex h-64 w-full items-center justify-center rounded-md border">
                        {fontName && (
                          <p
                            style={{
                              fontFamily: fontName,
                              fontSize: '32px',
                              textAlign: 'center'
                            }}
                          >
                            {fontName}
                          </p>
                        )}
                      </div>
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
                        placeholder="Nome da fonte"
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

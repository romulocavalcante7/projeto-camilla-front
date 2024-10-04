'use client';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Trash } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
import { deleteFile, uploadMultipleFiles } from '@/services/uploadService';
import { AlertModal } from '../modal/alert-modal';
import Image from 'next/image';
import { Subniche, getAllSubniches } from '@/services/subnicheService';
import { AutoComplete } from '../autocomplete';
import {
  createSticker,
  getStickerById,
  Sticker,
  updateSticker
} from '@/services/stickerService';

export const IMG_MAX_LIMIT = 50;

const formSchema = z.object({
  subniche: z.string().min(1, { message: 'Selecione um subnicho' }),
  images: z
    .array(z.instanceof(File))
    .max(IMG_MAX_LIMIT, { message: 'Você pode adicionar até 20 imagens' })
    .optional()
});

type FigurinhaFormValues = z.infer<typeof formSchema>;

export const StickerForm = () => {
  const params = useParams();
  const { figurinhaId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get('search') || undefined
  );

  const [stickers, setStickers] = useState<Sticker | null>(null);
  const [subniches, setSubniches] = useState<Subniche[]>([]);
  const fetchStickersById = async (stickerId: string) => {
    setLoading(true);
    try {
      const data = await getStickerById(stickerId);
      console.log('data', data);
      setStickers(data);
    } catch (error) {
      console.error('Error fetching subnicho:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStickersById(figurinhaId.toString());
  }, []);

  useEffect(() => {
    if (stickers) {
      form.reset({
        subniche: stickers.subnicheId!,
        images: []
      });
    }
  }, [stickers]);

  const fetchSubniches = async (pageNum: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllSubniches(pageNum, 9000, search);
      setSubniches(data.subniches);
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Error fetching subniches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubniches(page, search);
  }, [page, search]);

  const title = stickers?.id ? 'Editar Figuirinha' : 'Criar Figurinha';
  const description = stickers?.id
    ? 'Edite uma Figurinha'
    : 'Adicione uma nova Figurinha';
  const toastMessage = stickers?.id
    ? 'Figurinha atualizada'
    : 'Figurinha criada';
  const action = stickers?.id ? 'Salvar alterações' : 'Criar';

  const form = useForm<FigurinhaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subniche: stickers?.subnicheId!,
      images: []
    }
  });

  const onSubmit = async (data: FigurinhaFormValues) => {
    try {
      setLoading(true);
      let attachmentIds: string[] = [];

      if (data.images && data.images.length > 0) {
        setImgLoading(true);
        const uploadedImages = await uploadMultipleFiles({
          files: data.images
        });
        setImgLoading(false);
        attachmentIds = uploadedImages.files.map((img) => img.id);
      }

      const subniche = subniches.find(
        (subniche) => subniche.id === data.subniche
      );

      if (stickers) {
        for (let attachmentId of attachmentIds) {
          await updateSticker(stickers.id, {
            subnicheId: data.subniche,
            categoryId: subniche?.categoryId!,
            attachmentId
          });
        }
      } else {
        for (let attachmentId of attachmentIds) {
          await createSticker({
            subnicheId: data.subniche,
            categoryId: subniche?.categoryId!,
            attachmentId
          });
        }
      }

      router.refresh();
      router.push(`/dashboard/figurinha`);
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
      if (stickers?.id) {
        if (stickers?.attachment?.id) {
          await deleteFile(stickers.attachment.id);
        }
      }
      router.refresh();
      router.push(`/dashboard/figurinha`);
      toast.success('Figurinha removida');
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onDeleteImg = async () => {
    try {
      setLoading(true);
      if (stickers) {
        await deleteFile(stickers.attachment.id);
        fetchStickersById(stickers.id);
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
        {stickers?.id && (
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
                  {stickers?.attachment?.id ? (
                    <div className="relative w-fit rounded-md bg-[#3F3F3F]">
                      <Image
                        loading="lazy"
                        className="h-64 w-64 shrink-0 rounded-md bg-cover object-cover"
                        src={stickers?.attachment.url}
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
              name="subniche"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Subnicho</FormLabel>
                    <FormControl>
                      <AutoComplete
                        options={subniches.map((item) => ({
                          label: item.name,
                          value: item.id
                        }))}
                        emptyMessage="Sem resultados"
                        placeholder="Pesquise por subnicho"
                        onValueChange={field.onChange}
                        value={field.value}
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
            {loading ? (
              <Loader2 className="my-4 h-4 w-4 animate-spin" />
            ) : (
              action
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

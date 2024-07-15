'use client';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { toast } from 'react-hot-toast';
import { FileUploader } from '../file-uploader';
import { deleteFile, uploadMultipleFiles } from '@/services/uploadService';
import { AlertModal } from '../modal/alert-modal';
import Image from 'next/image';
import {
  Subniche,
  getSubnicheById,
  createSubniche,
  deleteSubniche,
  updateSubniche
} from '@/services/subnicheService';
import { Category, getAllCategories } from '@/services/categoryService';
import { AutoComplete } from '../autocomplete';

export const IMG_MAX_LIMIT = 1;

const formSchema = z.object({
  name: z.string().min(1, { message: 'O campo nome é obrigatório.' }),
  category: z.string().min(1, { message: 'Selecione uma categoria' }),
  images: z
    .array(z.instanceof(File))
    .max(IMG_MAX_LIMIT, { message: 'Você pode adicionar até 1 imagem' })
    .optional()
});

type NichosFormValues = z.infer<typeof formSchema>;

export const SubnichoForm = () => {
  const params = useParams();
  const { subnichoId } = params;
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

  const [subniche, setSubniche] = useState<Subniche | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchSubnicheById = async (subnichoId: string) => {
    setLoading(true);
    try {
      const data = await getSubnicheById(subnichoId);
      setSubniche(data);
    } catch (error) {
      console.error('Error fetching subnicho:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubnicheById(subnichoId.toString());
  }, []);

  useEffect(() => {
    if (subniche) {
      form.reset({
        name: subniche.name,
        category: subniche.categoryId,
        images: []
      });
    }
  }, [subniche]);

  const fetchCategories = async (pageNum: number, search?: string) => {
    setLoading(true);
    try {
      const data = await getAllCategories(pageNum, 9000, search);
      setCategories(data.categories);
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page, search);
  }, [page, search]);

  const title = subniche?.id ? 'Editar Subnicho' : 'Criar Subnicho';
  const description = subniche?.id
    ? 'Edite um nicho'
    : 'Adicione um novo subnicho';
  const toastMessage = subniche?.id ? 'Subnicho atualizado' : 'Subnicho criado';
  const action = subniche?.id ? 'Salvar alterações' : 'Criar';

  const form = useForm<NichosFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subniche?.name,
      category: subniche?.categoryId,
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

      if (subniche) {
        const updateData: {
          name: string;
          categoryId: string;
          attachmentId?: string;
        } = { name: data.name, categoryId: data.category };
        if (attachmentId) {
          updateData.attachmentId = attachmentId;
        }
        await updateSubniche(subniche.id, updateData);
      } else {
        await createSubniche({
          name: data.name,
          categoryId: data.category,
          attachmentId: attachmentId!
        });
      }

      router.refresh();
      router.push(`/dashboard/subnicho`);
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
      if (subniche?.id) {
        if (subniche?.attachment?.id) {
          await deleteFile(subniche.attachment.id);
        }
        await deleteSubniche(subniche.id);
      }
      router.refresh();
      router.push(`/dashboard/subnicho`);
      toast.success('Subnicho removido');
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onDeleteImg = async () => {
    try {
      setLoading(true);
      if (subniche) {
        await deleteFile(subniche.attachment.id);
        fetchSubnicheById(subniche.id);
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
        {subniche?.id && (
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
                  {subniche?.attachment?.id ? (
                    <div className="relative">
                      <Image
                        loading="lazy"
                        className="h-64 w-full shrink-0 rounded-md bg-cover object-cover"
                        src={subniche?.attachment.url}
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
            {/* <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                console.log('field', field);
                return (
                  <FormItem>
                    <FormLabel>Nicho</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecione um nicho"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            /> */}
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

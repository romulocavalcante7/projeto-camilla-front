'use client';
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
  Tutorial,
  createTutorial,
  deleteTutorial,
  getTutorialById,
  updateTutorial
} from '@/services/tutorialServices';
import { deleteFile, uploadMultipleFiles } from '@/services/uploadService';
import { AlertModal } from '../modal/alert-modal';
import Image from 'next/image';

export const IMG_MAX_LIMIT = 1;

const formSchema = z.object({
  name: z.string().min(1, { message: 'O campo nome é obrigatório.' }),
  youtubeLink: z.string().url({ message: 'Insira um link válido do YouTube.' }),
  images: z
    .array(z.instanceof(File))
    .max(IMG_MAX_LIMIT, { message: 'Você pode adicionar até 1 imagem' })
    .optional()
});

type TutorialsFormValues = z.infer<typeof formSchema>;

export const TutorialsForm = () => {
  const params = useParams();
  const { tutorialId } = params;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);

  const fetchTutorialById = async (tutorialId: string) => {
    setLoading(true);
    try {
      const data = await getTutorialById(tutorialId);
      setTutorial(data);
    } catch (error) {
      console.error('Error fetching tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorialById(tutorialId.toString());
  }, []);

  useEffect(() => {
    if (tutorial) {
      form.reset({
        name: tutorial.name,
        youtubeLink: tutorial.youtubeLink,
        images: []
      });
    }
  }, [tutorial]);

  const title = tutorial?.id ? 'Editar Tutorial' : 'Criar Tutorial';
  const description = tutorial?.id
    ? 'Edite um tutorial'
    : 'Adicione um novo tutorial';
  const toastMessage = tutorial?.id ? 'Tutorial atualizado' : 'Tutorial criado';
  const action = tutorial?.id ? 'Salvar alterações' : 'Criar';

  const form = useForm<TutorialsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tutorial?.name,
      youtubeLink: tutorial?.youtubeLink,
      images: []
    }
  });

  const onSubmit = async (data: TutorialsFormValues) => {
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

      if (tutorial) {
        const updateData: {
          name: string;
          youtubeLink: string;
          attachmentId?: string;
        } = { name: data.name, youtubeLink: data.youtubeLink };
        if (attachmentId) {
          updateData.attachmentId = attachmentId;
        }
        await updateTutorial(tutorial.id, updateData);
      } else {
        await createTutorial({
          name: data.name,
          youtubeLink: data.youtubeLink,
          attachmentId: attachmentId!
        });
      }

      router.refresh();
      router.push(`/dashboard/tutorial`);
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
      if (tutorial) {
        if (tutorial?.attachment?.id) {
          await deleteFile(tutorial.attachment.id);
        }
        await deleteTutorial(tutorial.id);
      }
      router.refresh();
      router.push(`/dashboard/tutorial`);
      toast.success('Tutorial removido');
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onDeleteImg = async () => {
    try {
      setLoading(true);
      if (tutorial) {
        await deleteFile(tutorial.attachment.id);
        fetchTutorialById(tutorial.id);
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
        {tutorial?.id && (
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
                  {tutorial?.attachment?.id ? (
                    <div className="relative">
                      <Image
                        loading="lazy"
                        className="h-64 w-full shrink-0 rounded-md bg-cover object-cover"
                        src={tutorial?.attachment.url}
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
                        placeholder="Nome do tutorial"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="youtubeLink"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Link do YouTube</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="https://www.youtube.com/watch?v=example"
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

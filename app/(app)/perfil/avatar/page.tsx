'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteFile, uploadMultipleFiles } from '@/services/uploadService';
import AuthContext from '@/contexts/auth-context';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

const registrationSchema = z.object({
  image: z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, 'A imagem é obrigatória.')
});

type AvatarFormValues = z.infer<typeof registrationSchema>;

export default function RegisterForm() {
  const { user, getSession } = useContext(AuthContext);
  const router = useRouter();
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.avatar?.url) {
      setPreview(user.avatar.url);
    }
  }, [user]);

  const form = useForm<AvatarFormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(registrationSchema)
  });

  const onSubmit = async (data: AvatarFormValues) => {
    try {
      setLoading(true);
      if (data.image && data.image.length > 0) {
        if (user?.avatar?.id) {
          await deleteFile(user?.avatar.id);
        }

        await uploadMultipleFiles({
          files: data.image,
          userId: user?.id
        });
        getSession();
      }
      toast.success('Imagem alterada', {
        duration: 4000
      });
      router.push('/perfil');
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const files = Array.from(fileList);
      const displayUrl = URL.createObjectURL(files[0]);
      setPreview(displayUrl);
      form.setValue('image', files);
    }
  }

  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <div className="flex gap-5 self-start px-5">
        <ArrowLeft
          className="cursor-pointer"
          size={30}
          onClick={() => router.push('/perfil')}
        />
      </div>
      <Form {...form}>
        <form
          className="flex flex-col space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Avatar className="h-28 w-28 self-center">
            <AvatarImage src={preview} className="object-cover" />
            <AvatarFallback className="bg-gray-400" />
          </Avatar>
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, ...rest } }) => (
              <FormItem>
                <FormLabel>Imagem de perfil</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    {...rest}
                    disabled={loading}
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="dark:text-black" disabled={loading} type="submit">
            {loading ? (
              <Loader2 className="my-4 h-4 w-4 animate-spin" />
            ) : (
              'Alterar'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

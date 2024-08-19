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
import Image from 'next/image';
import Link from 'next/link';
import { useScroll, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const registrationSchema = z.object({
  image: z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, 'A imagem é obrigatória.')
});

type AvatarFormValues = z.infer<typeof registrationSchema>;

export default function RegisterForm() {
  const { user, getSession } = useContext(AuthContext);
  const router = useRouter();
  const { scrollY } = useScroll();
  const [preview, setPreview] = useState('');
  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.avatar?.url) {
      setPreview(user.avatar.url);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollAbove10(latest > 10);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

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
    <div className="flex flex-col items-center justify-center gap-2">
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'tween',
          duration: 0.4,
          ease: [0.25, 0.25, 0.25, 0.75]
        }}
        className={cn(
          'sticky left-0 top-0 z-[2] flex w-full flex-col gap-5 bg-white px-5 py-5 transition-all dark:bg-transparent',
          scrollAbove10 && 'dark:bg-[#1a101b]/80 dark:backdrop-blur-md'
        )}
      >
        <div className="relative flex flex-col gap-2">
          <Link className="w-fit" href="/">
            <Image
              src="/logo-v2.png"
              width={160}
              height={40}
              alt="icone logo"
            />
          </Link>
          <div className="flex items-center gap-5">
            <ArrowLeft
              className="cursor-pointer"
              size={30}
              onClick={() => router.back()}
            />
          </div>
        </div>
      </motion.div>
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

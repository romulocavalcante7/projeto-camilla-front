'use client';

import { ArrowLeft, Loader2, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScroll, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPassword } from '@/services/authService';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
  email: z.string().email('Email inválido').nonempty('Email é obrigatório')
});

const Password = () => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      email: ''
    }
  });

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollAbove10(latest > 10);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await forgotPassword({ email: data.email });
      toast.success('Email enviado!', {
        duration: 8000
      });
      router.push('/');
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-center gap-2 backdrop-blur-[12px]">
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'tween',
          duration: 0.4,
          ease: [0.25, 0.25, 0.25, 0.75]
        }}
        className={cn(
          'sticky left-0 top-0 z-[2] flex w-full flex-col gap-5 px-5 py-5 transition-all dark:bg-transparent',
          scrollAbove10 && 'dark:backdrop-blur-md'
        )}
      >
        <div className="relative flex flex-col gap-2">
          <div className="flex items-center gap-5">
            <ArrowLeft
              className="cursor-pointer text-white"
              size={30}
              onClick={() => router.back()}
            />
          </div>
        </div>
      </motion.div>
      <div className="flex h-full items-center px-5">
        <Card className="mx-auto w-full max-w-lg border-none bg-[#313131]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              Alterar senha
            </CardTitle>
            <CardDescription className="text-white">
              Digite seu e-mail para receber um link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  startIcon={User}
                  className="rounded-lg border border-neutral-200 bg-zinc-100 py-6 backdrop-blur-[12.16px] disabled:cursor-not-allowed disabled:opacity-50"
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-400 dark:bg-black/80 dark:text-white"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="my-4 h-4 w-4 animate-spin" />
                ) : (
                  'Enviar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Password;

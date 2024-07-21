'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScroll, motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthContext from '@/contexts/auth-context';
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
  const { user } = useContext(AuthContext);
  const email = user?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
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

  useEffect(() => {
    if (email) {
      reset({ email });
    }
  }, [email, reset]);

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await forgotPassword({ email: data.email });
      toast.success('Email enviado!', {
        duration: 8000
      });
      router.push('/perfil');
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
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
      <div className="px-5">
        <Card className="mx-auto w-full max-w-lg bg-[#89898938] ">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Alterar senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  className="rounded-lg border border-neutral-200 bg-zinc-100 py-6 backdrop-blur-[12.16px] disabled:cursor-not-allowed disabled:opacity-50"
                  type="email"
                  placeholder="m@example.com"
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
                className="w-full dark:text-black"
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

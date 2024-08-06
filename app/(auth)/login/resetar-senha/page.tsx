/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { resetPassword } from '@/services/authService';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';

const passwordResetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .max(100, 'A senha deve ter no máximo 100 caracteres')
      .regex(/[a-zA-Z]/, 'A senha deve conter pelo menos uma letra')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
    confirmPassword: z
      .string()
      .min(8, 'A confirmação da senha deve ter pelo menos 8 caracteres')
      .max(100, 'A confirmação da senha deve ter no máximo 100 caracteres')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  });

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const token = searchParams.get('token');

  if (!token) {
    toast.error('Token inválido ou ausente.');
    router.push('/');
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: { newPassword: string }) => {
    try {
      setLoading(true);
      await resetPassword({ token, password: data.newPassword });
      toast.success('Senha redefinida com sucesso!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log('Erro ao redefinir a senha:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center gap-4 px-5">
      <div
        onClick={() => router.push('/')}
        className="mx-auto flex w-full max-w-lg  cursor-pointer  items-center gap-5"
      >
        <ArrowLeft className="cursor-pointer" size={30} />
        <p className="text-xl">Voltar</p>
      </div>
      <Card className="mx-auto w-full  max-w-lg bg-[#89898938]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                className="rounded-lg border border-neutral-200 bg-zinc-100 py-6 backdrop-blur-[12.16px] disabled:cursor-not-allowed disabled:opacity-50"
                type="password"
                placeholder="Nova Senha"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-red-500 dark:text-red-400">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                className="rounded-lg border border-neutral-200 bg-zinc-100 py-6 backdrop-blur-[12.16px] disabled:cursor-not-allowed disabled:opacity-50"
                type="password"
                placeholder="Confirmar Senha"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full dark:text-black">
              {loading ? (
                <Loader2 className="my-4 h-4 w-4 animate-spin" />
              ) : (
                ' Redefinir Senha'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;

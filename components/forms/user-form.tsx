'use client';

import * as z from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import {
  getUserDetail,
  updateUser,
  InactiveUser,
  UpdateUserPayload
} from '@/services/userService';
import Image from 'next/image';
import OrdersTable from '../orders-table';
import React from 'react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  role: z.enum(['USER', 'ADMIN'], { required_error: 'Função é obrigatória' }),
  expirationDate: z.string().optional()
});

type UserFormValues = z.infer<typeof formSchema>;

export const UserForm = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUserInactive, setIsUserInactive] = useState<boolean>(false);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: 'USER',
      expirationDate: ''
    }
  });

  const fetchUserDetail = async (userId: string) => {
    setLoading(true);
    try {
      const data = await getUserDetail(userId);
      setUser(data);
      setIsUserInactive(!data.status);
      form.reset({
        email: data.email,
        role: data.role as 'USER' | 'ADMIN',
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate).toISOString().split('T')[0]
          : ''
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      toast.error('Erro ao buscar detalhes do usuário.');
      router.push('/dashboard/usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetail(userId);
    }
  }, [userId]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      const payload: UpdateUserPayload = {
        email: data.email !== user?.email ? data.email : undefined,
        role: data.role,
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate).toISOString()
          : undefined
      };

      if (data.email !== user?.email) {
        payload.email = data.email;
      }

      await updateUser(userId, payload);
      toast.success('Usuário atualizado com sucesso!');
      router.push('/dashboard/usuarios');
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleInactiveUser = async () => {
    try {
      setLoading(true);
      await InactiveUser(userId, isUserInactive);
      toast.success(
        `Usuário ${isUserInactive ? 'ativado' : 'inativado'} com sucesso!`
      );
      setIsUserInactive(!isUserInactive);
    } catch (error) {
      toast.error('Erro ao inativar usuário.');
      console.error('Erro ao inativar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="absolute flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 pb-8"
        >
          <div className="flex items-center justify-between">
            <Heading
              title="Detalhes do Usuário"
              description="Edite as informações do usuário"
            />
            <Button
              onClick={handleInactiveUser}
              className={cn(
                'w-full sm:w-fit sm:px-10',
                isUserInactive
                  ? 'bg-green-600 hover:bg-green-500'
                  : 'bg-red-500 hover:bg-red-400'
              )}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isUserInactive ? (
                'Ativar Usuário'
              ) : (
                'Desativar Usuário'
              )}
            </Button>
          </div>
          <Separator />
          <div className="flex w-full items-center gap-10">
            {user.avatar?.url && (
              <div className="rounded-full">
                <Image
                  loading="lazy"
                  className="h-[100px] w-[113px]  rounded-full object-cover"
                  src={user.avatar.url}
                  width={600}
                  height={600}
                  alt="avatar"
                />
              </div>
            )}

            <div className="grid w-full gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <FormLabel>Nome</FormLabel>
                <div className="mt-1 rounded-md bg-gray-100 px-3 py-2 dark:border dark:bg-transparent">
                  {user.name}
                </div>
              </div>
              <div className="flex w-full items-center gap-5">
                <div className="flex flex-col gap-2">
                  <FormLabel>Data de Criação</FormLabel>
                  <div className="mt-1 max-w-fit rounded-md bg-gray-100 px-3 py-2 dark:border dark:bg-transparent">
                    {formatDate(user.createdAt)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <FormLabel>Favoritos</FormLabel>
                  <div className="mt-1 rounded-md bg-gray-100 px-3 py-2 dark:border dark:bg-transparent">
                    {user.favorites.length}
                  </div>
                </div>

                {user.isManuallyCreated && user.expirationDate && (
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Data de Expiração</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder="Selecione a data de expiração"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}
              </div>

              {user.orders[0]?.subscription && (
                <div>
                  Plano:{' '}
                  {user.orders[0].subscription.plan.frequency === 'annually'
                    ? 'Anual'
                    : 'Mensal'}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <FormControl>
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
                            placeholder="Selecione"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">Usuário</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            className=" ml-auto w-full text-lg sm:w-fit sm:px-10 dark:border dark:bg-transparent dark:hover:bg-gray-800"
            type="submit"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </form>
      </Form>

      <OrdersTable orders={user.orders || []} />
    </>
  );
};

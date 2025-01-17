//@ts-nocheck
'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Lock, User } from 'lucide-react';
import * as z from 'zod';
import AuthContext from '@/contexts/auth-context';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Insira um email válido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white dark:text-white">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      startIcon={User}
                      className="rounded-lg border border-neutral-200 bg-zinc-100 py-6 backdrop-blur-[12.16px] disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="Coloque seu email"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white dark:text-white">
                    Senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      startIcon={Lock}
                      className="rounded-lg border border-neutral-200 bg-zinc-100 py-6 backdrop-blur-[12.16px] disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder="Coloque sua senha"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Link
              href="/login/esquecer-senha"
              className="cursor-pointer self-end text-sm font-semibold text-[#fff]"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400">{error}</div>
          )}

          <Button
            disabled={loading}
            className="ml-auto w-full rounded-lg bg-gradient-to-r from-white to-white py-6 text-lg font-semibold uppercase text-black"
            type="submit"
          >
            {loading ? (
              <Loader2 className="my-4 h-4 w-4 animate-spin" />
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
        <Link
          href="/"
          target="_blank"
          className="mt-8 flex cursor-pointer items-center justify-center text-center font-semibold text-[#fff] sm:text-lg"
        >
          Cadastre-se
        </Link>
      </Form>
    </>
  );
}

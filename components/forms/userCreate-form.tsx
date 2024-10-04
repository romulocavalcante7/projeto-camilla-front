'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../ui/select';
import { createUser } from '@/services/userService';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, { message: 'O campo nome é obrigatório.' }),
  email: z.string().email({ message: 'Email inválido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  isManuallyCreated: z.boolean().default(false),
  expirationDate: z.object({
    unit: z.enum(['days', 'months', 'years', 'lifetime']),
    quantity: z
      .number()
      .min(1, { message: 'A quantidade deve ser maior que 0.' })
      .optional(),
    isLifetime: z.boolean().optional()
  })
});

type FormValues = z.infer<typeof formSchema>;

export const UserCreateForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      isManuallyCreated: true,
      expirationDate: {
        unit: 'days',
        quantity: 1,
        isLifetime: false
      }
    }
  });

  const router = useRouter();

  const calculateExpirationDate = (unit: string, quantity: number) => {
    const currentDate = new Date();

    switch (unit) {
      case 'days':
        currentDate.setDate(currentDate.getDate() + quantity);
        break;
      case 'months':
        currentDate.setMonth(currentDate.getMonth() + quantity);
        break;
      case 'years':
        currentDate.setFullYear(currentDate.getFullYear() + quantity);
        break;
      case 'lifetime':
        return null;
      default:
        break;
    }

    return currentDate.toISOString();
  };

  const onSubmit = async (data: FormValues) => {
    const { email, password, name, expirationDate } = data;

    const expirationDateValue =
      expirationDate.unit === 'lifetime'
        ? null
        : //@ts-ignore
          calculateExpirationDate(expirationDate.unit, expirationDate.quantity);

    try {
      await createUser({
        email,
        password,
        name,
        isManuallyCreated: true,
        expirationDate: expirationDateValue,
        role: 'USER'
      });

      // Exibe toast de sucesso
      toast.success('Usuário criado com sucesso!');

      // Redireciona para a página de usuários
      router.push('/dashboard/usuarios');
    } catch (error) {
      // Exibe toast de erro
      //@ts-ignore
      toast.error(`Erro ao criar o usuário: ${error.response.data.message}`);
      console.log('Erro ao criar usuário:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-lg space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} placeholder="Senha" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Data de Expiração</FormLabel>
          <FormControl>
            <Select
              onValueChange={(
                value: 'days' | 'months' | 'years' | 'lifetime'
              ) => {
                form.setValue('expirationDate.unit', value);
                if (value === 'lifetime') {
                  form.setValue('expirationDate.quantity', undefined);
                }
              }}
              defaultValue={form.watch('expirationDate.unit')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lifetime">Vitalício</SelectItem>
                <SelectItem value="days">Dias</SelectItem>
                <SelectItem value="months">Meses</SelectItem>
                <SelectItem value="years">Anos</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>

        {form.watch('expirationDate.unit') !== 'lifetime' && (
          <FormField
            control={form.control}
            name="expirationDate.quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Quantidade"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Criar Usuário</Button>
      </form>
    </Form>
  );
};

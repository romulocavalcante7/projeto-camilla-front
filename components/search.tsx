'use client';

import { SearchIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  search: z.string().trim().optional()
});

interface SearchProps {
  defaultValues?: z.infer<typeof formSchema>;
  className?: string;
  placeholder?: string;
  onSearch: (search: string) => void;
}

const Search = ({
  defaultValues,
  className,
  placeholder,
  onSearch
}: SearchProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSearch(data.search || '');
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Form {...form}>
        <form
          className="relative flex h-full w-full"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="flex h-10 w-full rounded-2xl border border-gray-400/10 bg-white px-5 py-6 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-100 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="absolute right-0 rounded-2xl bg-black px-5 py-6 hover:bg-[#4b4b4b]"
            variant="default"
            type="submit"
          >
            <SearchIcon size={26} />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Search;

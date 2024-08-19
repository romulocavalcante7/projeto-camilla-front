'use client';

import { ArrowLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '@/contexts/auth-context';

import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

const Perfil = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const { setTheme, theme } = useTheme();

  const ChangeToogle = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
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
          'sticky left-0 top-0 z-[2] flex w-full flex-col gap-5 bg-white px-5 py-5 transition-all dark:bg-transparent'
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
              onClick={() => router.push('/')}
            />
          </div>
        </div>
      </motion.div>
      <div className="flex flex-col items-center justify-center gap-8 px-5">
        <div className="flex w-full max-w-lg flex-col items-center gap-4">
          <div className="flex w-full items-center gap-10">
            <Avatar className="h-20 w-20 sm:h-28 sm:w-28">
              <AvatarImage src={user?.avatar?.url} className="object-cover" />
              <AvatarFallback className="bg-gray-400" />
            </Avatar>
            <div className="flex flex-col">
              <p className="text-xl font-semibold sm:text-2xl">{user?.name}</p>
              <p className="sm:text-lg dark:text-gray-300">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-col gap-2">
          <p className="text-xl">Informações</p>
          <div className="flex flex-col gap-4">
            <Link
              href="/perfil/assinatura"
              className="flex w-full flex-1 cursor-pointer items-center justify-between rounded-xl bg-[#89898938] px-5 py-3"
            >
              <p>Minha assinatura</p>
              <ChevronRight />
            </Link>
            <Link
              href="/perfil/esquecer-senha"
              className="flex w-full flex-1 cursor-pointer items-center justify-between rounded-xl bg-[#89898938] px-5 py-3"
            >
              <p>Trocar de senha</p>
              <ChevronRight />
            </Link>
            <Link
              href="/perfil/avatar"
              className="flex w-full flex-1 cursor-pointer items-center justify-between rounded-xl bg-[#89898938] px-5 py-3"
            >
              <p>Alterar foto de perfil</p>
              <ChevronRight />
            </Link>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          <p className="text-xl">Modo de cor</p>
          <div className="flex items-center gap-3">
            Escuro
            <Switch
              checked={theme === 'light'}
              onCheckedChange={ChangeToogle}
            />
            Claro
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

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
import { Badge } from '@/components/ui/badge';
import { getUserPaymentStatus, PaymentStatus } from '@/services/paymentService';
import { PaymentStatusEnum } from '@/services/types/entities';

const Perfil = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.id && user.subscription?.status) {
      fetchPaymentStatus(user.id);
    }
  }, [user?.id, user?.subscription?.status]);

  const fetchPaymentStatus = async (id: string) => {
    try {
      const data = await getUserPaymentStatus(id);
      setPaymentStatus(data[0]);
    } catch (err) {
      console.log('Failed to fetch payment status');
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
      <div className="flex flex-col items-center justify-center gap-10 px-5">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-28 w-28">
            <AvatarImage src={user?.avatar?.url} className="object-cover" />
            <AvatarFallback className="bg-gray-400" />
          </Avatar>
          <p className="text-xl font-semibold">{user?.name}</p>
          <div className="flex items-center gap-5">
            {paymentStatus && user?.orderStatus === PaymentStatusEnum.Paid && (
              <>
                <Badge className="py-1" variant="default">
                  Status: {paymentStatus.status && 'Ativo'}
                </Badge>
                <Badge className="py-1" variant="outline">
                  Plano: {paymentStatus.planType && 'Mensal'}
                </Badge>
              </>
            )}
            {!paymentStatus && (
              <>
                <Badge className="py-1" variant="default">
                  Status: Ativo
                </Badge>
                <Badge className="py-1" variant="outline">
                  Plano: Unico
                </Badge>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-col gap-5 rounded-lg bg-[#89898938] p-5">
          <Link
            href="/perfil/esquecer-senha"
            className="flex w-full flex-1 cursor-pointer items-center justify-between"
          >
            <p>Trocar de senha</p>
            <ChevronRight />
          </Link>
          <Link
            href="/perfil/avatar"
            className="flex w-full  flex-1 cursor-pointer items-center justify-between"
          >
            <p>Alterar foto de perfil</p>
            <ChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

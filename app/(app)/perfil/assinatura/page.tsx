'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScroll, motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import AuthContext from '@/contexts/auth-context';
import { PaymentStatusEnum } from '@/services/types/entities';
import { getUserPaymentStatus, PaymentStatus } from '@/services/paymentService';
import { Badge } from '@/components/ui/badge';
import React from 'react';

const Signature = () => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.id && user.subscription?.status) {
      fetchPaymentStatus(user.id);
    }
  }, [user?.id, user?.subscription?.status]);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollAbove10(latest > 10);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

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

      <div className="flex w-full max-w-lg flex-col  gap-3 px-5">
        <p className="text-xl">Minha assinatura</p>
        <div className="flex w-fit gap-5">
          {paymentStatus && user?.orderStatus === PaymentStatusEnum.Paid && (
            <>
              <Badge className="py-1 text-base" variant="default">
                Status: {paymentStatus.status && 'Ativo'}
              </Badge>
              <Badge className="py-1 text-base" variant="secondary">
                Plano:{' '}
                {paymentStatus.planType === 'monthly' ? 'Mensal' : 'Anual'}
              </Badge>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signature;

'use client';
import Image from 'next/image';
import Logo from '@/app/assets/logo.png';
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 sm:gap-10">
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'tween',
          duration: 1.2,
          ease: [0.25, 0.25, 0.25, 0.75]
        }}
        className="flex flex-col items-center gap-5"
      >
        {/* <div>
          <Image
            className="w-36"
            src={Logo}
            width={200}
            height={120}
            alt="logo versão 2"
          />
        </div> */}
      </motion.div>
    </div>
  );
}

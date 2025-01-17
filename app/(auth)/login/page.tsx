import { Metadata } from 'next';
// import Link from 'next/link';
import UserAuthForm from '@/components/forms/user-auth-form';
// import { buttonVariants } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
import Image from 'next/image';
import Logo from '@/app/assets/logo.png';
export const metadata: Metadata = {
  title: 'Login',
  description: 'Faça seu login em nossa plataforma'
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center backdrop-blur-[12px] lg:px-0 dark:bg-dark-gradient">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center gap-5 text-center">
            <Image
              className="w-48"
              src={Logo}
              width={1200}
              height={800}
              quality={100}
              alt="logo"
            />
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                VISALASH PRO
              </h1>
              <p className="text-lg text-white">Entre com seu email e senha</p>
            </div>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}

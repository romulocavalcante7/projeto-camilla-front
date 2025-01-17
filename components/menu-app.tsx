import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import AuthContext from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { LogOut, User2 } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import ThemeToggle from './layout/ThemeToggle/theme-toggle';
import useSocketStore from '@/store/useSocketStore';

export const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useContext(AuthContext);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);

  const handleLogout = async () => {
    logout();
    disconnectSocket();
    router.replace('/login');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          className={cn(
            'fixed right-5 top-5 z-10 cursor-pointer',
            pathname === '/' && 'absolute'
          )}
          src="/icons/menu-home.svg"
          width={40}
          height={40}
          alt="menu icone home"
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">VISALASH PRO</SheetTitle>
          <div className="flex w-full flex-col gap-5 pt-5">
            <div className="flex items-center gap-3">
              <Avatar className="bg-gray-300">
                <AvatarImage src={user?.avatar?.url} className="object-cover" />
                <AvatarFallback className="bg-gray-400" />
              </Avatar>
              <div className="flex flex-col items-start">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm">
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                </p>
              </div>
            </div>
            {user?.role === 'ADMIN' && (
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-fit gap-5 text-xl"
                variant="outline"
              >
                <User2 />
                Administrador
              </Button>
            )}

            <Button
              onClick={handleLogout}
              className="w-fit gap-5 text-xl"
              variant="outline"
            >
              <LogOut />
              Sair
            </Button>
          </div>
        </SheetHeader>
        <div className="absolute bottom-5 right-5">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
};

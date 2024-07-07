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
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';

export const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    logout();
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
          <SheetTitle className="text-2xl">Story Plus</SheetTitle>
          <div className="flex w-full pt-5">
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
      </SheetContent>
    </Sheet>
  );
};

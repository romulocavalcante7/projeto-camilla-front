'use client';
import { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navItems } from '@/constants/data';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/logo-dark.png';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="cursor-pointer" asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="">
            <div className="px-3 py-2">
              <Link className="mb-3 flex" href="/">
                <Image
                  className="w-36 px-3"
                  src={Logo}
                  width={800}
                  height={600}
                  quality={100}
                  alt="logo"
                />
              </Link>

              <div className="space-y-1">
                <DashboardNav
                  items={navItems}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

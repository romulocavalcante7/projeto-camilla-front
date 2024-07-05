'use client';
import CategoryList from '@/components/categories';
import Image from 'next/image';
import Link from 'next/link';

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-5">
        <div>
          <Image
            className="w-48"
            src="/logo.png"
            width={200}
            height={120}
            alt="logo versão 2"
          />
          <Image
            className="absolute right-5 top-5 cursor-pointer"
            src="/icons/menu-home.svg"
            width={40}
            height={40}
            alt="menu icone home"
          />
        </div>
        <div className="flex w-full max-w-[380px] items-center gap-6 overflow-x-auto px-5 sm:max-w-full [&::-webkit-scrollbar]:hidden">
          <Link href="/categorias" className="flex flex-col items-center gap-1">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-purple-500 p-1">
              <div className="h-full w-full rounded-full bg-white p-[4px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300">
                  <Image
                    src="/icons/nicho.svg"
                    width={30}
                    height={30}
                    alt="icone nichos"
                  />
                </div>
              </div>
            </div>
            <p className="font-semibold">Nichos</p>
          </Link>
          <Link href="/favoritos" className="flex flex-col items-center gap-1">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-purple-500 p-1">
              <div className="h-full w-full rounded-full bg-white p-[4px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300">
                  <Image
                    src="/icons/favorite.svg"
                    width={40}
                    height={40}
                    alt="icone favoritos"
                  />
                </div>
              </div>
            </div>
            <p className="font-semibold">Favoritos</p>
          </Link>
          <Link href="/recentes" className="flex flex-col items-center gap-1">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-purple-500 p-1">
              <div className="h-full w-full rounded-full bg-white p-[3px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300">
                  <Image
                    src="/icons/recent.svg"
                    width={40}
                    height={40}
                    alt="icone recentes"
                  />
                </div>
              </div>
            </div>
            <p className="font-semibold">Recentes</p>
          </Link>
          <Link href="/tutoriais" className="flex flex-col items-center gap-1">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-purple-500 p-1">
              <div className="h-full w-full rounded-full bg-white p-[4px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300">
                  <Image
                    src="/icons/tutorial.svg"
                    width={40}
                    height={40}
                    alt="icone tutoriais"
                  />
                </div>
              </div>
            </div>
            <p className="font-semibold">Tutoriais</p>
          </Link>
          <Link href="/fonts" className="flex flex-col items-center gap-1">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-purple-500 p-1">
              <div className="h-full w-full rounded-full bg-white p-[4px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300">
                  <Image
                    src="/icons/fonts.svg"
                    width={40}
                    height={40}
                    alt="icone fontes"
                  />
                </div>
              </div>
            </div>
            <p className="font-semibold">Fontes</p>
          </Link>
        </div>
      </div>
      <CategoryList />
    </div>
  );
}

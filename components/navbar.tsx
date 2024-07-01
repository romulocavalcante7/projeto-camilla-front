import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <div className="border-stone-300/opacity-40 fixed bottom-5 left-1/2 mx-auto flex  w-full max-w-md -translate-x-1/2 transform items-center justify-between gap-0 rounded-[18px] border bg-white px-5 py-3 backdrop-blur-[14px]">
      <Link href="/">
        <Image
          className="cursor-pointer"
          src="/icons/home.svg"
          width={30}
          height={30}
          alt="icone home"
        />
      </Link>
      <Image
        className="cursor-pointer"
        src="/icons/search.svg"
        width={30}
        height={30}
        alt="icone search"
      />
      <Link href="/favoritos">
        <Image
          className="cursor-pointer"
          src="/icons/heart.svg"
          width={35}
          height={35}
          alt="icone heart"
        />
      </Link>
      <Image
        className="cursor-pointer"
        src="/icons/reels.svg"
        width={30}
        height={30}
        alt="icone reels"
      />
      <div className="h-8 w-8 cursor-pointer rounded-full bg-slate-300" />
    </div>
  );
}

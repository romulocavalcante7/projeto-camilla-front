import Link from 'next/link';

export function Navbar() {
  return (
    <Link
      href="/ficha"
      className="fixed bottom-5 left-1/2 mx-auto flex w-full max-w-[360px] -translate-x-1/2 transform items-center justify-center gap-12 rounded-[18px] border border-stone-300/90 bg-white px-5 py-3 backdrop-blur-[14px] sm:max-w-md sm:px-10 dark:border-stone-300/20 dark:bg-neutral-900/70"
      passHref
    >
      Iniciar
    </Link>
  );
}

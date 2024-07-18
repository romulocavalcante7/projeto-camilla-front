import { StickerClient } from '@/components/tables/sticker-tables/client';
import { Suspense } from 'react';

export default function page() {
  return (
    <>
      <Suspense>
        <StickerClient />
      </Suspense>
    </>
  );
}

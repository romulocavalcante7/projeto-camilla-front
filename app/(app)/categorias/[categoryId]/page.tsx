'use client';
import { useEffect, useState } from 'react';
import { getSubnichesByCategoryId, Subniche } from '@/services/subnicheService';
import Link from 'next/link';
import { useScroll } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import InfiniteScroll from '@/components/ui/InfiniteScroll';

interface SubnicheProps {
  params: {
    categoryId: string;
  };
}

const SubnicheList = ({ params }: SubnicheProps) => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const { categoryId } = params;
  const { scrollY } = useScroll();
  const [subniches, setSubniches] = useState<Subniche[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchSubniches = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await getSubnichesByCategoryId(
        categoryId as string,
        pageNum,
        10
      );
      console.log('data', data);

      setSubniches((prev) => {
        const newSubniches = data.subniches.map((subniche) => ({
          id: subniche.id,
          name: subniche.name,
          attachment: subniche.attachment
        }));
        return pageNum === 1 ? newSubniches : [...prev, ...newSubniches];
      });

      setHasMore(pageNum < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubniches(page);
  }, [page]);

  useEffect(() => {
    return scrollY.onChange((latest) => {});
  }, [scrollY]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && page === 1) return <div>Loading...</div>;

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        className={cn(
          'sticky left-0 top-0 z-10 flex w-full items-center gap-5 bg-white py-5 pr-10 transition-all'
        )}
      >
        <Link href="/">
          <ArrowLeft size={30} />
        </Link>
        <p className="text-2xl font-bold">{name}</p>
      </div>
      <ul className="flex h-full w-full flex-col items-center justify-center gap-5 overflow-y-auto">
        {subniches.map((subniche) => (
          <Link
            className="w-full"
            key={subniche.id}
            href={`/figurinha/${subniche.id}?name=${encodeURIComponent(
              subniche.name
            )}`}
          >
            <li className="relative flex h-40 w-full items-center justify-center rounded-2xl bg-[#3F3F3F] text-2xl font-bold text-white">
              <Image
                className="absolute left-0 top-0 h-full w-full rounded-2xl object-cover"
                src={subniche?.attachment?.url}
                width={1200}
                height={800}
                quality={100}
                alt="image"
              />
              <p>{subniche.name}</p>
            </li>
          </Link>
        ))}
        <InfiniteScroll
          hasMore={hasMore}
          isLoading={loading}
          next={loadMore}
          threshold={1}
        >
          {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
        </InfiniteScroll>
      </ul>
    </div>
  );
};

export default SubnicheList;

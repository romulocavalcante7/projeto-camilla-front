'use client';

import { useEffect, useState } from 'react';
import { getTutorialById, Tutorial } from '@/services/tutorialServices';
import Link from 'next/link';
import { useScroll, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import YouTube from 'react-youtube';

interface TutorialProps {
  params: {
    tutorialId: string;
  };
}

const TutorialDetail = ({ params }: TutorialProps) => {
  const { tutorialId } = params;
  const { scrollY } = useScroll();
  const router = useRouter();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scrollAbove10, setScrollAbove10] = useState<boolean>(false);

  const fetchTutorial = async () => {
    setLoading(true);
    try {
      const data = await getTutorialById(tutorialId as string);
      setTutorial(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorial();
  }, [tutorialId]);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrollAbove10(latest > 10);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'tween',
          duration: 0.4,
          ease: [0.25, 0.25, 0.25, 0.75]
        }}
        className={cn(
          'sticky left-0 top-0 z-[2] flex w-full flex-col gap-5 bg-white px-5 py-5 transition-all dark:bg-transparent',
          scrollAbove10 && 'dark:bg-[#1a101b]/80 dark:backdrop-blur-md'
        )}
      >
        <div className="relative flex flex-col gap-2">
          <Link className="w-fit" href="/">
            <Image
              src="/logo-v2.png"
              width={160}
              height={40}
              alt="icone logo"
            />
          </Link>
          <div className="flex items-center gap-5">
            <ArrowLeft
              className="cursor-pointer"
              size={30}
              onClick={() => router.back()}
            />
            <p className="text-2xl font-bold">{tutorial?.name}</p>
          </div>
        </div>
      </motion.div>
      {loading ? (
        <Loader2 className="my-4 h-8 w-8 animate-spin" />
      ) : tutorial ? (
        <div className="flex w-full flex-col items-center gap-4 px-5">
          <div className="w-full max-w-4xl rounded-2xl bg-gray-900">
            {tutorial.youtubeLink && (
              <div className="w-full">
                <YouTube
                  videoId={tutorial.youtubeLink.split('v=')[1]}
                  className="aspect-video h-full w-full"
                  iframeClassName="aspect-video h-full w-full rounded-2xl"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xl text-gray-500">Tutorial não encontrado</p>
      )}
    </div>
  );
};

export default TutorialDetail;

'use client';
import { Loader2, Sticker } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState } from 'react';
import { getTotalStickers } from '@/services/stickerService';

export const FigurinhasCard = () => {
  const [totalStikcers, setTotalStickers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalStickers();
  }, []);

  const fetchTotalStickers = async () => {
    try {
      setLoading(true);
      const { total } = (await getTotalStickers()) || 0;
      setTotalStickers(total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Cílios</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="24"
          viewBox="0 0 25 25"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ml-3`}
        >
          <path d="m15 18-.722-3.25" />
          <path d="M2 8a10.645 10.645 0 0 0 20 0" />
          <path d="m20 15-1.726-2.05" />
          <path d="m4 15 1.726-2.05" />
          <path d="m9 18 .722-3.25" />
        </svg>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="my-4 h-8 w-8 animate-spin" />
        ) : (
          <p className="text-3xl font-bold">{totalStikcers}</p>
        )}
      </CardContent>
    </Card>
  );
};

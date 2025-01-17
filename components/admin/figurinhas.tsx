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
        <Sticker />
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

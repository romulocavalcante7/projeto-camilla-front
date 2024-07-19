'use client';
import { GalleryVertical, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState } from 'react';
import { getTotalCategories } from '@/services/categoryService';

export const NichosCard = () => {
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalCategories();
  }, []);

  const fetchTotalCategories = async () => {
    try {
      setLoading(true);
      const { total } = (await getTotalCategories()) || 0;
      setTotalCategories(total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Nichos</CardTitle>
        <GalleryVertical />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="my-4 h-8 w-8 animate-spin" />
        ) : (
          <p className="text-3xl font-bold">{totalCategories}</p>
        )}
      </CardContent>
    </Card>
  );
};

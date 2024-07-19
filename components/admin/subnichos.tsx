'use client';
import { GalleryVerticalEnd, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState } from 'react';
import { getTotalSubniches } from '@/services/subnicheService';

export const SubnichosCard = () => {
  const [totalSubniche, setTotalSubniche] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalSubniches();
  }, []);

  const fetchTotalSubniches = async () => {
    try {
      setLoading(true);
      const { total } = (await getTotalSubniches()) || 0;
      setTotalSubniche(total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Subnichos</CardTitle>
        <GalleryVerticalEnd />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="my-4 h-8 w-8 animate-spin" />
        ) : (
          <p className="text-3xl font-bold">{totalSubniche}</p>
        )}
      </CardContent>
    </Card>
  );
};

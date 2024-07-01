'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/nextUtils';

const useAuthentication = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getCookie('accessToken');
      if (!token) {
        if (typeof window !== 'undefined') {
          router.push('/login');
        }
      }
    };

    checkAuthentication();
  }, []);

  return null;
};

export default useAuthentication;

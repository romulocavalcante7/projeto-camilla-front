//@ts-nocheck
'use client';

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react';
import { getCookie, setCookie, deleteCookie } from '@/utils/nextUtils';
import {
  login as loginService,
  logout as logoutService,
  User
} from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  setUser: () => {},
  setIsAuthenticated: () => {},
  isAuthenticated: false,
  isLoading: true
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { tokens, user } = await loginService({ email, password });
      setCookie('accessToken', tokens.access.token);
      setCookie('refreshToken', tokens.refresh.token);
      setUser(user);
      setIsAuthenticated(true);
      router.replace('/');
    } catch (error) {
      const messageError = error.response.data.message;
      toast({
        position: 'top-center',
        title: 'Ops! Ocorreu algum erro',
        variant: 'destructive',
        description: messageError
      });
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const token = await getCookie('refreshToken');
      console.log('token', token);
      await logoutService({ refreshToken: token?.value || '' });
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getSession = async () => {
    setIsLoading(true);
    try {
      const accessToken = await getCookie('accessToken');
      if (accessToken) {
        // Here you can add logic to fetch user data using accessToken
        setIsAuthenticated(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

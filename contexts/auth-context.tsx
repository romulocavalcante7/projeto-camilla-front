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
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import { getCookie, setCookie, deleteCookie } from '@/utils/nextUtils';
import {
  login as loginService,
  logout as logoutService,
  User
} from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { getUser } from '@/services/userService';
import { PaymentStatusEnum } from '@/services/types/entities';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  getSession: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  setUser: () => {},
  getSession: () => {},
  setIsAuthenticated: () => {},
  isAuthenticated: false,
  isLoading: true
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUser = async (id: string) => {
    const user = await getUser(id);
    return user;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { tokens, user } = await loginService({ email, password });

      if (user.orderStatus !== PaymentStatusEnum.Paid) {
        return setOpenModal(true);
      }
      const tokenExpiry = tokens.access.expires;
      const authToken = `${tokens.access.token}|${tokenExpiry}`;
      await setCookie('accessToken', authToken);
      await setCookie('refreshToken', tokens.refresh.token);
      await setCookie('userData', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      router.replace('/');
    } catch (error) {
      const messageError = error?.response?.data?.message;
      toast({
        position: 'top-center',
        title: 'Ops! Ocorreu algum erro',
        variant: 'destructive',
        description: messageError
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const refreshToken = await getCookie('refreshToken');
    try {
      await logoutService({ refreshToken: refreshToken?.value || '' });
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      deleteCookie('userData');
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
      const userData = await getCookie('userData');
      if (accessToken) {
        setIsAuthenticated(true);
        if (userData) {
          const parsedUserData = JSON.parse(userData.value);
          const user = await fetchUser(parsedUserData.id);
          setUser(user);
        }
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
        getSession,
        isAuthenticated,
        setIsAuthenticated,
        isLoading
      }}
    >
      {children}
      <Credenza onOpenChange={setOpenModal} open={openModal}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle className="text-center text-2xl">
              Acesso negado
            </CredenzaTitle>
            <CredenzaBody className="mb-5 text-center text-lg">
              Você não possui acesso a plataforma!
            </CredenzaBody>
          </CredenzaHeader>
          <CredenzaFooter className="sm:w-full sm:justify-center">
            <CredenzaClose asChild>
              <Button className="w-full">Fechar</Button>
            </CredenzaClose>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </AuthContext.Provider>
  );
};

export default AuthContext;

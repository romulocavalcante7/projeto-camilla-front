//@ts-nocheck
'use client';

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  useCallback
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
import { isExpired } from '@/utils/dataExpired';

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
  const [modalMessage, setModalMessage] = useState('');
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

      if (!user.status) {
        setModalMessage(
          'Seu usuário está inativo. Por favor, entre em contato com o suporte.'
        );
        setOpenModal(true);
        return;
      }

      // Usuários manuais: Verifica expiração
      if (user.isManuallyCreated) {
        if (isExpired(user.expirationDate)) {
          setModalMessage(
            'Você não possui acesso à plataforma. Tempo expirado.'
          );
          setOpenModal(true);
          return;
        }
      } else {
        // Usuários normais: Verifica status do pagamento
        if (user.orderStatus !== PaymentStatusEnum.Paid) {
          let message = '';
          switch (user.orderStatus) {
            case PaymentStatusEnum.WaitingPayment:
              message =
                'Seu pagamento está pendente. Por favor, efetue o pagamento para continuar.';
              break;
            case PaymentStatusEnum.Refused:
              message =
                'Seu pagamento foi recusado. Por favor, entre em contato com o suporte.';
              break;
            case PaymentStatusEnum.Refunded:
              message =
                'Seu pagamento foi reembolsado. Verifique sua conta ou entre em contato.';
              break;
            case PaymentStatusEnum.Chargeback:
              message =
                'Houve um estorno no seu pagamento. Acesso negado até que o problema seja resolvido.';
              break;
            default:
              message =
                'Você não possui acesso à plataforma. Verifique seu status de pagamento.';
          }

          setModalMessage(message);
          setOpenModal(true);
          return;
        }
      }

      // Caso esteja tudo certo, salva os tokens e dados do usuário
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

  const getSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = await getCookie('accessToken');
      const userData = await getCookie('userData');

      if (accessToken) {
        setIsAuthenticated(true);

        if (userData) {
          const parsedUserData = JSON.parse(userData.value);

          // Verifica se o usuário foi criado manualmente
          if (parsedUserData.isManuallyCreated) {
            // Verifica se a data de expiração já passou
            const hasExpired = isExpired(parsedUserData.expirationDate);
            if (hasExpired) {
              setModalMessage(
                'Você não possui acesso à plataforma. Tempo expirado'
              );
              setOpenModal(true);
              setIsAuthenticated(false);
              await logout();
              router.replace('/login');
              return;
            }

            // Se não expirou, busca o usuário
            const user = await fetchUser(parsedUserData.id);
            setUser(user);
          } else {
            // Verifica o status do pedido para usuários que NÃO foram criados manualmente
            if (parsedUserData.orderStatus !== PaymentStatusEnum.Paid) {
              let message = '';

              switch (parsedUserData.orderStatus) {
                case PaymentStatusEnum.WaitingPayment:
                  message =
                    'Seu pagamento está pendente. Por favor, efetue o pagamento para continuar.';
                  break;
                case PaymentStatusEnum.Refused:
                  message =
                    'Seu pagamento foi recusado. Por favor, entre em contato com o suporte.';
                  break;
                case PaymentStatusEnum.Refunded:
                  message =
                    'Seu pagamento foi reembolsado. Verifique sua conta ou entre em contato.';
                  break;
                case PaymentStatusEnum.Chargeback:
                  message =
                    'Houve um estorno no seu pagamento. Acesso negado até que o problema seja resolvido.';
                  break;
                default:
                  message =
                    'Você não possui acesso à plataforma. Verifique seu status de pagamento.';
              }

              // Exibe mensagem e desloga o usuário
              setModalMessage(message);
              setOpenModal(true);
              setIsAuthenticated(false);
              await logout();
              router.replace('/login');
              return;
            }

            // Caso o status do pedido esteja pago, busca o usuário
            const user = await fetchUser(parsedUserData.id);
            setUser(user);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    getSession();
  }, [getSession]);

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
              {modalMessage}
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

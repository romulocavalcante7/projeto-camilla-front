import Api from './api';
import { Attachment } from './types/entities';
import { Subscription } from './userService';

const prefix = 'v1/auth';

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenPayload {
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  firstAccess: boolean;
  avatar: Attachment;
  subscription?: Subscription;
  orderStatus?: string;
}

export interface AuthTokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

export interface LoginResponse {
  user: User;
}
// export const register = async (payload: RegisterPayload): Promise<User> => {
//   const response = await Api.post<User>(`${prefix}/register`, payload);
//   return response.data;
// };

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await Api.post<LoginResponse>(`${prefix}/login`, payload);
  return response.data;
};

export const logout = async (payload: TokenPayload): Promise<void> => {
  await Api.post(`${prefix}/logout`, payload);
};

export const refreshTokens = async (
  payload: TokenPayload
): Promise<AuthTokens> => {
  const response = await Api.post<AuthTokens>(
    `${prefix}/refresh-tokens`,
    payload
  );
  return response.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<void> => {
  await Api.post(`${prefix}/forgot-password`, payload);
};

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<void> => {
  await Api.post(`${prefix}/reset-password`, payload);
};

export const sendVerificationEmail = async (): Promise<void> => {
  await Api.post(`${prefix}/send-verification-email`);
};

export const verifyEmail = async (token: string): Promise<void> => {
  await Api.post(`${prefix}/verify-email`, { token });
};

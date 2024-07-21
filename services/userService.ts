import Api from './api';
import { Attachment } from './types/entities';

const prefix = 'v1/users';

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

export const getUser = async (userId: string): Promise<LoginResponse> => {
  const response = await Api.post<LoginResponse>(`${prefix}/user`, { userId });
  return response.data;
};

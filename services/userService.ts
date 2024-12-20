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

export interface Subscription {
  id: string;
  status: string;
  frequency: string;
  nextPayment: string;
  planName: string;
  plan: {
    id: string;
    name: string;
    frequency: string;
    qtyCharges: number;
    createdAt: string;
    updatedAt: string;
  };
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
  status: boolean;
  isManuallyCreated: boolean;
  expirationDate?: string;
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

export interface UsersResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  users: {
    id: string;
    email: string;
    name: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    status: boolean;
  }[];
}

export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  role?: string;
  isManuallyCreated: boolean;
  expirationDate: string | null;
}

export interface UpdateUserPayload {
  email?: string;
  role?: string;
  expirationDate?: string | undefined;
}

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const response = await Api.post<User>(`${prefix}/create`, payload);
  return response.data;
};

export const getUser = async (userId: string): Promise<LoginResponse> => {
  const response = await Api.post<LoginResponse>(`${prefix}/user`, { userId });
  return response.data;
};

export const getUserDetail = async (userId: string): Promise<any> => {
  const response = await Api.post<any>(`${prefix}/userDetail`, { userId });
  return response.data;
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<User> => {
  const response = await Api.patch<User>(`${prefix}/${userId}`, payload);
  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await Api.delete(`${prefix}/${userId}`);
};

export const InactiveUser = async (
  userId: string,
  status: boolean
): Promise<void> => {
  await Api.post(`${prefix}/${userId}`, { status });
};

export const getUsers = async (
  page: number,
  pageSize: number,
  search?: string,
  sortField?: string,
  sortOrder?: string
): Promise<UsersResponse> => {
  const params = {
    page,
    pageSize,
    search,
    sortField,
    sortOrder
  };
  const response = await Api.get<UsersResponse>(`${prefix}/`, { params });
  return response.data;
};

import Api from './api';
import { Attachment } from './types/entities';

export interface Subniche {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  attachment: Attachment;
}

export interface CreateSubnichePayload {
  name: string;
  categoryId: string;
}

export interface UpdateSubnichePayload {
  name?: string;
  categoryId?: string;
}

export interface SubnicheByCategoryIdResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  subniches: Subniche[];
}

const prefix = 'v1/subniches';

export const getAllSubniches = async (): Promise<Subniche[]> => {
  const response = await Api.get<Subniche[]>(`${prefix}/all`);
  return response.data;
};

export const createSubniche = async (
  payload: CreateSubnichePayload
): Promise<Subniche> => {
  const response = await Api.post<Subniche>(`${prefix}/create`, payload);
  return response.data;
};

export const getSubnicheById = async (
  subnicheId: string
): Promise<Subniche> => {
  const response = await Api.get<Subniche>(`${prefix}/${subnicheId}`);
  return response.data;
};

export const updateSubniche = async (
  subnicheId: string,
  payload: UpdateSubnichePayload
): Promise<Subniche> => {
  const response = await Api.patch<Subniche>(
    `${prefix}/${subnicheId}`,
    payload
  );
  return response.data;
};

export const deleteSubniche = async (subnicheId: string): Promise<void> => {
  await Api.delete(`${prefix}/${subnicheId}`);
};

export const getSubnichesByCategoryId = async (
  categoryId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SubnicheByCategoryIdResponse> => {
  const response = await Api.get<SubnicheByCategoryIdResponse>(
    `${prefix}/category/${categoryId}?page=${page}&pageSize=${pageSize}`
  );
  return response.data;
};

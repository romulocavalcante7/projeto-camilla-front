import Api from './api';
import { Category } from './categoryService';
import { Attachment } from './types/entities';

export interface Subniche {
  id: string;
  name: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  attachment: Attachment;
}

export interface SubnichesAllResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  subniches: Subniche[];
}

export interface CreateSubnichePayload {
  name: string;
  categoryId: string;
  attachmentId?: string;
}

export interface UpdateSubnichePayload {
  name?: string;
  categoryId?: string;
  attachmentId?: string;
}

export interface SubnicheByCategoryIdResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  subniches: Subniche[];
}

const prefix = 'v1/subniches';

export const getAllSubniches = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortField?: string,
  sortOrder?: string
): Promise<SubnichesAllResponse> => {
  const response = await Api.get<SubnichesAllResponse>(`${prefix}/all`, {
    params: {
      page,
      pageSize,
      search,
      sortField,
      sortOrder
    }
  });
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
  pageSize: number = 10,
  search?: string
): Promise<SubnicheByCategoryIdResponse> => {
  const response = await Api.get<SubnicheByCategoryIdResponse>(
    `${prefix}/category/${categoryId}`,
    {
      params: {
        page,
        pageSize,
        search
      }
    }
  );
  return response.data;
};

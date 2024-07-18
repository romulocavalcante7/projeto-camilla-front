import Api from './api';
import { Subniche } from './subnicheService';
import { Attachment } from './types/entities';

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  attachment: Attachment;
  subniches: Subniche[];
}

export interface CategoryAllResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  categories: Category[];
}

const prefix = 'v1/categories';

export const getAllCategories = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortField?: string,
  sortOrder?: string
): Promise<CategoryAllResponse> => {
  const response = await Api.get<CategoryAllResponse>(`${prefix}/all`, {
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

export const createCategory = async (payload: {
  name: string;
  attachmentId: string;
}): Promise<Category> => {
  const response = await Api.post<Category>(`${prefix}/create`, payload);
  return response.data;
};

export const getCategoryById = async (
  categoryId: string
): Promise<Category> => {
  const response = await Api.get<Category>(`${prefix}/${categoryId}`);
  return response.data;
};

export const updateCategory = async (
  categoryId: string,
  payload: { name: string; attachmentId?: string }
): Promise<Category> => {
  const response = await Api.patch<Category>(
    `${prefix}/${categoryId}`,
    payload
  );
  return response.data;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await Api.delete(`${prefix}/${categoryId}`);
};

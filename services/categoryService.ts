import Api from './api';
import { Subniche } from './subnicheService';
import { Attachment } from './types/entities';

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  attachment: Attachment;
  isImportant: boolean;
  displayOrder: number;
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
  sortOrder?: string,
  importantFirst?: string
): Promise<CategoryAllResponse> => {
  const response = await Api.get<CategoryAllResponse>(`${prefix}/all`, {
    params: {
      page,
      pageSize,
      search,
      sortField,
      sortOrder,
      importantFirst
    }
  });
  return response.data;
};

export const getTotalCategories = async () => {
  const response = await Api.get<{ total: number }>(`${prefix}/total`);
  return response.data;
};

export const getAllImportantCategories = async () => {
  const response = await Api.get(`${prefix}/important`);
  return response.data;
};

export const markImportantCategory = async (id: string) => {
  return await Api.post(`${prefix}/markImportant`, { id });
};

export const setCategoryDisplayOrder = async (
  id: string,
  displayOrder: number
) => {
  const response = await Api.post(`${prefix}/setOrder`, { id, displayOrder });
  return response.data;
};

export const removeCategoryImportant = async (id: string) => {
  return await Api.post(`${prefix}/removeImportant`, { id });
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

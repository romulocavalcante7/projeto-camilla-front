import Api from './api';
import { Attachment } from './types/entities';

export interface Icon {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  attachment: Attachment;
  isImportant: boolean;
  displayOrder: number;
}

export interface IconAllResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  icons: Icon[];
}

const prefix = 'v1/icons';

export const getAllIcons = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortField?: string,
  sortOrder?: string,
  importantFirst?: string
): Promise<IconAllResponse> => {
  const response = await Api.get<IconAllResponse>(`${prefix}/all`, {
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

export const getTotalIcons = async () => {
  const response = await Api.get<{ total: number }>(`${prefix}/total`);
  return response.data;
};

export const getAllImportantIcons = async () => {
  const response = await Api.get(`${prefix}/important`);
  return response.data;
};

export const markImportantIcon = async (id: string) => {
  return await Api.post(`${prefix}/markImportant`, { id });
};

export const setIconDisplayOrder = async (id: string, displayOrder: number) => {
  const response = await Api.post(`${prefix}/setOrder`, { id, displayOrder });
  return response.data;
};

export const removeIconImportant = async (id: string) => {
  return await Api.post(`${prefix}/removeImportant`, { id });
};

export const createIcon = async (payload: {
  name: string;
  attachmentId: string;
}): Promise<Icon> => {
  const response = await Api.post<Icon>(`${prefix}/create`, payload);
  return response.data;
};

export const getIconById = async (iconId: string): Promise<Icon> => {
  const response = await Api.get<Icon>(`${prefix}/${iconId}`);
  return response.data;
};

export const updateIcon = async (
  iconId: string,
  payload: { name: string; attachmentId?: string }
): Promise<Icon> => {
  const response = await Api.patch<Icon>(`${prefix}/${iconId}`, payload);
  return response.data;
};

export const deleteIcon = async (iconId: string): Promise<void> => {
  await Api.delete(`${prefix}/${iconId}`);
};

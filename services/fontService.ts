import Api from './api';
import { Attachment } from './types/entities';

export interface Font {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  attachment: Attachment;
  isImportant: boolean;
  displayOrder: number;
}

export interface FontAllResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  fonts: Font[];
}

const prefix = 'v1/fonts';

export const getAllFonts = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortField?: string,
  sortOrder?: string,
  importantFirst?: string
): Promise<FontAllResponse> => {
  const response = await Api.get<FontAllResponse>(`${prefix}/all`, {
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

export const getTotalFonts = async () => {
  const response = await Api.get<{ total: number }>(`${prefix}/total`);
  return response.data;
};

export const getAllImportantFonts = async () => {
  const response = await Api.get(`${prefix}/important`);
  return response.data;
};

export const markImportantFont = async (id: string) => {
  return await Api.post(`${prefix}/markImportant`, { id });
};

export const setFontDisplayOrder = async (id: string, displayOrder: number) => {
  const response = await Api.post(`${prefix}/setOrder`, { id, displayOrder });
  return response.data;
};

export const removeFontImportant = async (id: string) => {
  return await Api.post(`${prefix}/removeImportant`, { id });
};

export const createFont = async (payload: {
  name: string;
  attachmentId: string;
}): Promise<Font> => {
  const response = await Api.post<Font>(`${prefix}/create`, payload);
  return response.data;
};

export const getFontById = async (fontId: string): Promise<Font> => {
  const response = await Api.get<Font>(`${prefix}/${fontId}`);
  return response.data;
};

export const updateFont = async (
  fontId: string,
  payload: { name: string; attachmentId?: string }
): Promise<Font> => {
  const response = await Api.patch<Font>(`${prefix}/${fontId}`, payload);
  return response.data;
};

export const deleteFont = async (fontId: string): Promise<void> => {
  await Api.delete(`${prefix}/${fontId}`);
};

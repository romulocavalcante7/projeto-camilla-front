import Api from './api';
import { Category } from './categoryService';
import { Attachment } from './types/entities';

export interface Sticker {
  isFavorite: boolean;
  id: string;
  name: string;
  attachmentId: string;
  categoryId: string;
  category: Category;
  subniche: {
    id: string;
    name: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    attachmentId: string;
    category: Category;
  };
  subnicheId: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  attachment: Attachment;
  translations: Translation[];
}

export interface Translation {
  id: string;
  language: string;
  name: string;
  stickerId: string;
}

export interface CreateStickerPayload {
  name?: string;
  attachmentId: string;
  categoryId: string;
  subnicheId?: string | null;
  userId?: string | null;
  translations?: {
    language: string;
    name: string;
  }[];
}

export interface UpdateStickerPayload {
  name?: string;
  attachmentId?: string;
  categoryId?: string;
  subnicheId?: string | null;
  userId?: string | null;
  translations?: {
    language: string;
    name: string;
  }[];
}

export interface StickerResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  stickers: Sticker[];
}

const prefix = 'v1/stickers';

export const getAllStickers = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortField?: string,
  sortOrder?: string
): Promise<StickerResponse> => {
  const response = await Api.get<StickerResponse>(`${prefix}/all`, {
    params: { page, pageSize, search, sortField, sortOrder }
  });
  return response.data;
};

export const createSticker = async (
  payload: CreateStickerPayload
): Promise<Sticker> => {
  const response = await Api.post<Sticker>(`${prefix}/create`, payload);
  return response.data;
};

export const getStickerById = async (stickerId: string): Promise<Sticker> => {
  const response = await Api.get<Sticker>(`${prefix}/${stickerId}`);
  return response.data;
};

export const updateSticker = async (
  stickerId: string,
  payload: UpdateStickerPayload
): Promise<Sticker> => {
  const response = await Api.patch<Sticker>(`${prefix}/${stickerId}`, payload);
  return response.data;
};

export const deleteSticker = async (stickerId: string): Promise<void> => {
  await Api.delete(`${prefix}/${stickerId}`);
};

export const getStickersBySubnicheId = async (
  subnicheId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<StickerResponse> => {
  const response = await Api.get<StickerResponse>(
    `${prefix}/subniche/${subnicheId}`,
    {
      params: { page, pageSize, search }
    }
  );
  return response.data;
};

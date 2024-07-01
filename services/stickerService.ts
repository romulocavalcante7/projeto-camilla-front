import Api from './api';
import { Attachment } from './types/entities';

export interface Sticker {
  isFavorite: any;
  id: string;
  name: string;
  attachmentId: string;
  categoryId: string;
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

const prefix = 'v1/stickers';

export const getAllStickers = async (): Promise<Sticker[]> => {
  const response = await Api.get<Sticker[]>(`${prefix}/all`);
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
  subnicheId: string
): Promise<Sticker[]> => {
  const response = await Api.get<Sticker[]>(`${prefix}/subniche/${subnicheId}`);
  return response.data;
};

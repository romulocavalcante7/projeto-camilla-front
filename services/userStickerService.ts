import Api from './api';
import { Attachment } from './types/entities';

export interface Sticker {
  id: string;
  name: string;
  attachmentId: string;
  subnicheId: string | null;
  userId: string | null;
  isUserCreated: boolean;
  createdAt: string;
  updatedAt: string;
  attachment: Attachment;
  translations: Translation[];
}

interface Translation {
  id: string;
  language: string;
  name: string;
  stickerId: string;
}

export interface CreateStickerPayload {
  name?: string;
  attachmentId: string;
  translations?: {
    language: string;
    name: string;
  }[];
}

export interface UpdateStickerPayload {
  name?: string;
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

const prefix = 'v1/userStickers';

export const createUserSticker = async (
  payload: CreateStickerPayload
): Promise<Sticker> => {
  const response = await Api.post<Sticker>(`${prefix}`, payload);
  return response.data;
};

export const getUserStickers = async (
  page: number = 1,
  pageSize: number = 10
): Promise<StickerResponse> => {
  const response = await Api.get<StickerResponse>(`${prefix}/user`, {
    params: { page, pageSize }
  });
  return response.data;
};

export const getStickerById = async (stickerId: string): Promise<Sticker> => {
  const response = await Api.get<Sticker>(`${prefix}/${stickerId}`);
  return response.data;
};

export const updateUserSticker = async (
  stickerId: string,
  payload: UpdateStickerPayload
): Promise<Sticker> => {
  const response = await Api.patch<Sticker>(`${prefix}/${stickerId}`, payload);
  return response.data;
};

export const deleteUserSticker = async (stickerId: string): Promise<void> => {
  await Api.delete(`${prefix}/${stickerId}`);
};

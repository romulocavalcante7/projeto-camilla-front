import Api from './api';
import { Sticker } from './stickerService';

export interface FavoriteSticker {
  id: string;
  stickerId: string;
  createdAt: string;
  updatedAt: string;
  sticker: Sticker;
}

export interface FavoriteStickerResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  favorites: FavoriteSticker[];
}

export interface AddFavoriteStickerPayload {
  stickerId: string;
}

const prefix = 'v1/favoriteSticker';

export const getAllFavoriteStickers = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<FavoriteStickerResponse> => {
  const response = await Api.get<FavoriteStickerResponse>(`${prefix}/all`, {
    params: { page, pageSize, search }
  });
  return response.data;
};

export const addFavoriteSticker = async (
  payload: AddFavoriteStickerPayload
): Promise<FavoriteSticker> => {
  const response = await Api.post<FavoriteSticker>(`${prefix}/create`, payload);
  return response.data;
};

export const removeFavoriteSticker = async (
  stickerId: string
): Promise<void> => {
  await Api.delete(`${prefix}/${stickerId}`);
};

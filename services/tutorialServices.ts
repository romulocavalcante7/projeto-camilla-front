import Api from './api';
import { Attachment } from './types/entities';

export interface Tutorial {
  id: string;
  name: string;
  youtubeLink: string;
  attachment: Attachment;
  isImportant: boolean;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TutorialAllResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  tutorials: Tutorial[];
}

const prefix = 'v1/tutorials';

export const getAllTutorials = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortField?: string,
  sortOrder?: string,
  importantFirst?: boolean
): Promise<TutorialAllResponse> => {
  const response = await Api.get<TutorialAllResponse>(`${prefix}/all`, {
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

export const getTotalTutorials = async () => {
  const response = await Api.get<{ total: number }>(`${prefix}/total`);
  return response.data;
};

export const getTutorialById = async (
  tutorialId: string
): Promise<Tutorial> => {
  const response = await Api.get<Tutorial>(`${prefix}/${tutorialId}`);
  return response.data;
};

export const createTutorial = async (payload: {
  name: string;
  youtubeLink: string;
  attachmentId: string;
  isImportant?: boolean;
  displayOrder?: number;
}): Promise<Tutorial> => {
  const response = await Api.post<Tutorial>(`${prefix}/create`, payload);
  return response.data;
};

export const updateTutorial = async (
  tutorialId: string,
  payload: {
    name?: string;
    youtubeLink?: string;
    attachmentId?: string;
    isImportant?: boolean;
    displayOrder?: number;
  }
): Promise<Tutorial> => {
  const response = await Api.patch<Tutorial>(
    `${prefix}/${tutorialId}`,
    payload
  );
  return response.data;
};

export const deleteTutorial = async (tutorialId: string): Promise<void> => {
  await Api.delete(`${prefix}/${tutorialId}`);
};

export const getAllImportantTutorials = async () => {
  const response = await Api.get(`${prefix}/important`);
  return response.data;
};

export const markTutorialAsImportant = async (id: string) => {
  return await Api.post(`${prefix}/markImportant`, { id });
};

export const removeTutorialImportant = async (id: string) => {
  return await Api.post(`${prefix}/removeImportant`, {
    id
  });
};

export const setTutorialDisplayOrder = async (
  id: string,
  displayOrder: number
) => {
  const response = await Api.post<Tutorial>(`${prefix}/setOrder`, {
    id,
    displayOrder
  });
  return response.data;
};

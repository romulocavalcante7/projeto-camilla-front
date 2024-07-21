import Api from './api';
import { Attachment } from './types/entities';

export interface UploadFilePayload {
  file: File;
}

export interface UploadMultipleFilesPayload {
  files: File[];
  userId?: string;
}

export interface UploadResponse {
  id: string;
  filename: string;
  filetype: string;
  filesize: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface MultiUploadResponse {
  files: Attachment[];
}

const prefix = 'v1/files';

export const uploadFile = async (
  payload: UploadFilePayload
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', payload.file);

  const response = await Api.post<UploadResponse>(
    `${prefix}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};

export const uploadMultipleFiles = async (
  payload: UploadMultipleFilesPayload
): Promise<MultiUploadResponse> => {
  const formData = new FormData();
  payload.files.forEach((file) => {
    formData.append('files', file);
  });
  if (payload.userId) {
    formData.append('userId', payload.userId);
  }
  const response = await Api.post<MultiUploadResponse>(
    `${prefix}/multi-upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};

export const deleteFile = async (fileId: string): Promise<void> => {
  await Api.delete(`${prefix}/${fileId}`);
};

export const listAllFiles = async (): Promise<UploadResponse[]> => {
  const response = await Api.get<UploadResponse[]>(`${prefix}`);
  return response.data;
};

export const getFileById = async (fileId: string): Promise<UploadResponse> => {
  const response = await Api.get<UploadResponse>(`${prefix}/${fileId}`);
  return response.data;
};

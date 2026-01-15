import apiClient from './getApi';

export interface UploadResponse {
  url: string;
}

/**
 * Upload une image d'activité vers le backend
 * @param file - Le fichier image à uploader
 * @returns L'URL relative de l'image uploadée
 */
export const uploadActivityImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload une image d'attraction vers le backend
 * @param file - Le fichier image à uploader
 * @returns L'URL relative de l'image uploadée
 */
export const uploadAttractionImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

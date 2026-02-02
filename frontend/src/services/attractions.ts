import axios from 'axios';
import axiosInstance from './getApi.ts';
import type { Attraction } from '../@types/attraction';

export interface AttractionFilters {
  search?: string;
  categoryId?: number;
}

export interface CreateAttractionDto {
  name: string;
  description: string;
  name_en?: string | null;
  description_en?: string | null;
  category_id: number;
  image_url?: string | null;
  thrill_level?: number | null;
  duration?: number | null;
  is_published?: boolean;
  related_attraction_ids?: number[];
}

export interface UpdateAttractionDto {
  name?: string;
  description?: string;
  name_en?: string | null;
  description_en?: string | null;
  category_id?: number;
  image_url?: string | null;
  thrill_level?: number | null;
  duration?: number | null;
  is_published?: boolean;
  related_attraction_ids?: number[];
}

// Fonctions qui gèrent les attractions
export const getAttractions = async (filters?: AttractionFilters): Promise<Attraction[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());

    const url = `/attractions${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await axiosInstance.get(url);
    const payload = res.data;

    if (Array.isArray(payload)) return payload;

    if (payload?.data && Array.isArray(payload.data)) return payload.data;

    throw new Error("Réponse inattendue du serveur pour les attractions.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer les attractions.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les attractions.");
  }
};

export const getAttractionById = async (id: number): Promise<Attraction | undefined> => {
  try {
    const res = await axiosInstance.get(`/attractions/${id}`);
    const payload = res.data;

    if (payload) return payload;

    throw new Error("Réponse inattendue du serveur pour l'attraction.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer l'attraction.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant l'attraction.");
  }
};

export const createAttraction = async (dto: CreateAttractionDto): Promise<Attraction> => {
  try {
    const res = await axiosInstance.post<Attraction>('/attractions', dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de créer l'attraction.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue lors de la création de l'attraction.");
  }
};

export const updateAttraction = async (id: number, dto: UpdateAttractionDto): Promise<Attraction> => {
  try {
    const res = await axiosInstance.patch<Attraction>(`/attractions/${id}`, dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de mettre à jour l'attraction.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en mettant à jour l'attraction.");
  }
};

export const deleteAttraction = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/attractions/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de supprimer l'attraction.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en supprimant l'attraction.");
  }
};

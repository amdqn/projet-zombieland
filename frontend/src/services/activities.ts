import axios from 'axios';
import axiosInstance from './getApi.ts';
import type { Activity } from '../@types/activity';

export interface ActivityFilters {
  search?: string;
  categoryId?: number;
  attractionId?: number;
}

export interface CreateActivityDto {
  name: string;
  description: string;
  name_en?: string | null;
  description_en?: string | null;
  category_id: number;
  attraction_id?: number | null;
  image_url?: string | null;
  thrill_level?: number | null;
  duration?: number | null;
  min_age?: number | null;
  accessibility?: string | null;
  is_published?: boolean;
  related_activity_ids?: number[];
}

export interface UpdateActivityDto {
  name?: string;
  description?: string;
  name_en?: string | null;
  description_en?: string | null;
  category_id?: number;
  attraction_id?: number | null;
  image_url?: string | null;
  thrill_level?: number | null;
  duration?: number | null;
  min_age?: number | null;
  accessibility?: string | null;
  is_published?: boolean;
  related_activity_ids?: number[];
}

// Fonctions qui gèrent les activités
export const getActivities = async (filters?: ActivityFilters): Promise<Activity[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.attractionId) params.append('attractionId', filters.attractionId.toString());

    const url = `/activities${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await axiosInstance.get(url);
    const payload = res.data;

    if (Array.isArray(payload)) return payload;

    if (payload?.data && Array.isArray(payload.data)) return payload.data;

    throw new Error("Réponse inattendue du serveur pour les activités.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer les activités.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les activités.");
  }
};

export const getActivityById = async (id: number): Promise<Activity | undefined> => {
  try {
    const res = await axiosInstance.get(`/activities/${id}`);
    const payload = res.data;

    if (payload) return payload;

    throw new Error("Réponse inattendue du serveur pour l'activité.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer l'activité.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant l'activité.");
  }
};

export const createActivity = async (dto: CreateActivityDto): Promise<Activity> => {
  try {
    const res = await axiosInstance.post<Activity>('/activities', dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de créer l'activité.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue lors de la création de l'activité.");
  }
};

export const updateActivity = async (id: number, dto: UpdateActivityDto): Promise<Activity> => {
  try {
    const res = await axiosInstance.patch<Activity>(`/activities/${id}`, dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de mettre à jour l'activité.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en mettant à jour l'activité.");
  }
};

export const deleteActivity = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/activities/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de supprimer l'activité.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en supprimant l'activité.");
  }
};

import axios from 'axios';
import axiosInstance from './getApi.ts';
import type { Category } from '../@types/categorie';

export interface CreateCategoryDto {
  name: string;
  description: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await axiosInstance.get('/categories');
    const payload = res.data;

    if (Array.isArray(payload)) return payload;

    if (payload?.data && Array.isArray(payload.data)) return payload.data;

    throw new Error("Réponse inattendue du serveur pour les catégories.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer les catégories.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les catégories.");
  }
};

export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const res = await axiosInstance.get(`/categories/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Catégorie introuvable.");
      }
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer la catégorie.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant la catégorie.");
  }
};

export const createCategory = async (dto: CreateCategoryDto): Promise<Category> => {
  try {
    const res = await axiosInstance.post<Category>('/categories', dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error("Une catégorie avec ce nom existe déjà.");
      }
      throw new Error(
        error.response?.data?.message ?? "Impossible de créer la catégorie.",
      );
    }
    throw new Error("Une erreur inattendue est survenue lors de la création de la catégorie.");
  }
};

export const updateCategory = async (id: number, dto: UpdateCategoryDto): Promise<Category> => {
  try {
    const res = await axiosInstance.patch<Category>(`/categories/${id}`, dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Catégorie introuvable.");
      }
      if (error.response?.status === 409) {
        throw new Error("Une catégorie avec ce nom existe déjà.");
      }
      throw new Error(
        error.response?.data?.message ?? "Impossible de modifier la catégorie.",
      );
    }
    throw new Error("Une erreur inattendue est survenue lors de la modification de la catégorie.");
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/categories/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Catégorie introuvable.");
      }
      if (error.response?.status === 400) {
        throw new Error("Impossible de supprimer cette catégorie car elle est utilisée par des activités ou attractions.");
      }
      throw new Error(
        error.response?.data?.message ?? "Impossible de supprimer la catégorie.",
      );
    }
    throw new Error("Une erreur inattendue est survenue lors de la suppression de la catégorie.");
  }
};

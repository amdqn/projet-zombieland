import axios from 'axios';
import axiosInstance from './getApi.ts';
import type { Category } from '../@types/categorie';

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

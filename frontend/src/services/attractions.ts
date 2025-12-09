import axios from 'axios';
import axiosInstance from './getApi.ts';
import type { Attraction } from '../@types/attraction';

// Fonctions qui gèrent les attractions
export const getAttractions = async (): Promise<Attraction[]> => {
  try {
    const res = await axiosInstance.get('/attractions');
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



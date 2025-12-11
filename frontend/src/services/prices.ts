import axios from 'axios';
import axiosInstance from './getApi.ts';
import type { Price } from '../@types/price';

export const getPrices = async (): Promise<Price[]> => {
  try {
    const res = await axiosInstance.get('/prices');
    const payload = res.data;

    if (Array.isArray(payload)) return payload;

    if (payload?.data && Array.isArray(payload.data)) return payload.data;

    throw new Error("Réponse inattendue du serveur pour les tarifs.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer les tarifs.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les tarifs.");
  }
};



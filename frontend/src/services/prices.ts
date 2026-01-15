import axiosInstance from './getApi.ts';
import type {CreatePriceDto, PaginedPrices, Price, PricesFilters, UpdatePriceDto} from '../@types/price';
import axios from "axios";

// Surcharge de la fonction pour gérer les deux cas : avec ou sans pagination
export async function getPrices(filters: PricesFilters): Promise<PaginedPrices>;
export async function getPrices(): Promise<Price[]>;
export async function getPrices(filters?: PricesFilters): Promise<Price[] | PaginedPrices> {
  try {
    const params = new URLSearchParams();

    if (filters?.priceType) params.append('priceType', filters.priceType);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.amount) params.append('amount', filters.amount.toString());

    const url = `/prices${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await axiosInstance.get(url);

    const payload = res.data;

    // Si pas de filtres → retourne tableau simple
    if (!filters) {
      return Array.isArray(payload) ? payload : payload.data || [];
    }

    // Avec filtres → retourne format paginé
    if (Array.isArray(payload)) {
      // Transformer tableau en format paginé
      return {
        data: payload,
        pagination :
            {
              total: payload.length,
              page: filters.page || 1,
              limit: filters.limit || payload.length,
              totalPages: 1
          }
      };
    }

    // Déjà au format paginé
    return payload;

  } catch (error) {
    console.error('Erreur lors de la récupération des prix:', error);
    throw error;
  }
}

export const deletePrice = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/prices/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de supprimer le prix.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en supprimant le prix.");
  }
};

export const updatePrice = async (id: number, dto: UpdatePriceDto): Promise<Price> => {
  try {
    const res = await axiosInstance.patch(`/prices/${id}`, dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de mettre à jour le prix.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en mettant à jour le prix.");
  }
}

export const createPrice = async (dto: CreatePriceDto): Promise<Price> => {
  try {
    return await axiosInstance.post('/prices', dto);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de créer le tarif.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue lors de la création du tarif.");
  }
}
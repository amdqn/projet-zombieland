import axiosInstance from './getApi.ts';
import type {PaginedPrices, Price, PricesFilters} from '../@types/price';

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
        total: payload.length,
        page: filters.page || 1,
        limit: filters.limit || payload.length,
      };
    }

    // Déjà au format paginé
    return payload;

  } catch (error) {
    console.error('Erreur lors de la récupération des prix:', error);
    throw error;
  }
}



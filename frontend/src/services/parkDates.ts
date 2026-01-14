import axiosInstance from './getApi.ts';
import type {ParkDate} from "../@types/parkDate.ts";

export const getParkDates = async (from?: string, to?: string): Promise<ParkDate[]> => {
  try {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    const queryString = params.toString();
    const url = `/park-dates${queryString ? `?${queryString}` : ''}`;
    
    const res = await axiosInstance.get<ParkDate[]>(url);
    const payload = res.data as ParkDate[] | { data: ParkDate[] };

    if (Array.isArray(payload)) return payload;

    if ('data' in payload && Array.isArray(payload.data)) return payload.data;

    throw new Error("Réponse inattendue du serveur pour les dates du parc.");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "Impossible de récupérer les dates du parc.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les dates du parc.");
  }
};

import axios from 'axios';
import axiosInstance from './getApi.ts';
import type { MapData, MapBounds, MapPoint } from '../@types/map';

/**
 * Récupère tous les points de la carte (attractions, activités, POI)
 */
export const getAllMapPoints = async (): Promise<MapData> => {
  try {
    const res = await axiosInstance.get('/map/points');
    const payload = res.data;

    if (payload && payload.attractions && payload.activities && payload.pois) {
      return payload;
    }

    throw new Error("Réponse inattendue du serveur pour les points de la carte.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer les points de la carte.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les points de la carte.");
  }
};

/**
 * Récupère les bornes géographiques du parc
 */
export const getMapBounds = async (): Promise<MapBounds | null> => {
  try {
    const res = await axiosInstance.get('/map/bounds');
    const payload = res.data;

    if (payload) return payload;

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer les bornes de la carte.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les bornes de la carte.");
  }
};

/**
 * Récupère un point spécifique par ID et type
 */
export const getMapPointById = async (
  id: number,
  type: 'attraction' | 'activity' | 'poi'
): Promise<MapPoint | null> => {
  try {
    const res = await axiosInstance.get(`/map/point/${id}?type=${type}`);
    const payload = res.data;

    if (payload) return payload;

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer le point de la carte.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant le point de la carte.");
  }
};

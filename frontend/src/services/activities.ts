import axios from 'axios';
import axiosInstance from "./getApi.ts";
import type {Activity} from "../@types/activity";


// Fonctions qui gèrent les activités
export const getActivities = async(): Promise<Activity[]> => {
  try {
    const res = await axiosInstance.get('/activities');
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

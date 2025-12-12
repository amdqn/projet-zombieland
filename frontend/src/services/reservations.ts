import axios from 'axios';
import axiosInstance from './getApi.ts';
import type { Reservation, ReservationStatus } from '../@types/reservation';

// Interface pour créer une réservation (données à envoyer au backend)
// Cette interface correspond au CreateReservationDto du backend
// On la définit côté frontend pour avoir le typage TypeScript
export interface CreateReservationDto {
  date_id: number;
  tickets: Array<{
    price_id: number;
    quantity: number;
  }>;
}

export interface UpdateReservationDto {
  status: ReservationStatus;
}

// Fonction pour créer une réservation
export const createReservation = async (dto: CreateReservationDto): Promise<Reservation> => {
  try {
    const res = await axiosInstance.post<Reservation>('/reservations', dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de créer la réservation.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue lors de la création de la réservation.");
  }
};

// Récupérer les réservations de l'utilisateur connecté
export const getMyReservations = async (): Promise<Reservation[]> => {
  try {
    const res = await axiosInstance.get<Reservation[]>('/reservations/my');
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de récupérer vos réservations.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en récupérant vos réservations.");
  }
};

// Récupérer toutes les réservations
export const getAllReservations = async (): Promise<Reservation[]> => {
  try {
    const res = await axiosInstance.get<Reservation[]>('/reservations');
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de récupérer les réservations.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les réservations.");
  }
};


export const getReservationById = async (id: number): Promise<Reservation> => {
  try {
    const res = await axiosInstance.get<Reservation>(`/reservations/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de récupérer la réservation.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en récupérant la réservation.");
  }
};

export const updateReservation = async (id: number, dto: UpdateReservationDto): Promise<Reservation> => {
  try {
    const res = await axiosInstance.patch<Reservation>(`/reservations/${id}/status`, dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de mettre à jour la réservation.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en mettant à jour la réservation.");
  }
};

export const deleteReservation = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/reservations/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de supprimer la réservation.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en supprimant la réservation.");
  }
};


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

// Interface pour les paramètres de recherche et filtres
export interface ReservationFilters {
  page?: number;
  limit?: number;
  search?: string;
  userId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  ticketType?: string;
  sortBy?: string;
}

export interface PaginatedReservations {
  data: Reservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getAllReservations = async (filters?: ReservationFilters): Promise<PaginatedReservations> => {
  try {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.userId) params.append('userId', filters.userId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.ticketType) params.append('ticketType', filters.ticketType);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const url = `/reservations${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await axiosInstance.get<PaginatedReservations>(url);
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



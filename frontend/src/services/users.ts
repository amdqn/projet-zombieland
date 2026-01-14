import axios from 'axios';
import axiosInstance from './getApi.ts';
import type { User } from '../@types/users';

export interface UserFilters {
  search?: string;
  role?: 'ADMIN' | 'CLIENT';
  email?: string;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateUserDto {
  pseudo?: string;
  email?: string;
  role?: 'ADMIN' | 'CLIENT';
  is_active?: boolean;
}

export const getUsers = async (filters?: UserFilters, page: number = 1, limit: number = 20): Promise<PaginatedUsers> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.email) params.append('email', filters.email);

    const res = await axiosInstance.get(`/users?${params.toString()}`);
    const payload = res.data;

    if (payload?.data && Array.isArray(payload.data)) {
      return {
        data: payload.data,
        total: payload.total || payload.data.length,
        page: payload.page || page,
        limit: payload.limit || limit,
      };
    }

    // Fallback si pas de pagination
    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: payload.length,
        page: 1,
        limit: payload.length,
      };
    }

    throw new Error("Réponse inattendue du serveur pour les utilisateurs.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer les utilisateurs.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les utilisateurs.");
  }
};

export const getUserById = async (id: number): Promise<User> => {
  try {
    const res = await axiosInstance.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Utilisateur introuvable.");
      }
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer l'utilisateur.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant l'utilisateur.");
  }
};

export const getUserReservations = async (id: number) => {
  try {
    const res = await axiosInstance.get(`/users/${id}/reservations`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer les réservations de l'utilisateur.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les réservations.");
  }
};

export const updateUser = async (id: number, dto: UpdateUserDto): Promise<User> => {
  try {
    const res = await axiosInstance.patch<User>(`/users/${id}`, dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de mettre à jour l'utilisateur.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en mettant à jour l'utilisateur.");
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Impossible de supprimer l'utilisateur.";
      throw new Error(errorMessage);
    }
    throw new Error("Une erreur inattendue est survenue en supprimant l'utilisateur.");
  }
};

export interface UserAuditLog {
  id: number;
  user_id: number;
  modified_by_id: number;
  action: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  modified_by: {
    id: number;
    pseudo: string;
    email: string;
  };
}

export const getUserAuditLogs = async (id: number): Promise<UserAuditLog[]> => {
  try {
    const res = await axiosInstance.get(`/users/${id}/audit-logs`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? "Impossible de récupérer les logs d'audit.",
      );
    }
    throw new Error("Une erreur inattendue est survenue en récupérant les logs d'audit.");
  }
};

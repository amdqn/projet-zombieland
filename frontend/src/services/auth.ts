// fonction de connexion login et register

import axiosInstance from "./getApi.ts";
import type {User} from "../@types/users";

interface LoginResponse {
    user: User;
    access_token: string;
}


// connexion
export const login = async (email: string, password: string): Promise<LoginResponse> => {

    const response = await axiosInstance.post<LoginResponse>('auth/login', {
        email,
        password
    });
    return response.data;
};

// creation compte
export const register = async (
    email: string,
    pseudo: string,
    password: string,
    confirmPassword: string
): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('auth/register', {
        email,
        pseudo,
        password,
        confirmPassword
    });
    return response.data;
}

// récupérer le profil
export const getProfile = async (): Promise<User> => {
    const response = await axiosInstance.get<LoginResponse>('auth/me');
    return response.data.user;
}


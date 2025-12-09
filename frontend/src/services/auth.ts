// fonction de connexion login et register

import axiosInstance from "./getApi.ts";
import type {User} from "../@types/users";

interface LoginResponse {
    user: User;
    token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    console.log(email, password);
    console.log('Base URL:', axiosInstance.defaults.baseURL); // ✅ Voir le baseURL
    console.log('URL complète:', axiosInstance.defaults.baseURL + 'login'); // ✅ Voir l'URL finale

    const response = await axiosInstance.post<LoginResponse>('login', {
        email,
        password
    });
    return response.data;
};
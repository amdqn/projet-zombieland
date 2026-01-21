import axiosInstance from "./getApi.ts";
import type {Conversation} from "../@types/messaging";

// récupérer toutes les conversations
export const getAllConvesations = async () => {
    const response = await axiosInstance.get('/conversations');
    return response.data.data;
};

// Récupérer une conversation via l'id
export const getOneConversation = async (id: number) => {
    const response = await axiosInstance.get(`/conversations/${id}`)
    return response.data.data;
}

// Gérer le status d'une conversation
export const updateConversationStatus = async (id: number, status: string): Promise<Conversation> => {
    const response = await axiosInstance.patch<Conversation>(`/conversations/${id}`, {status})
    // On affichera le message du backend
    return response.data;
}
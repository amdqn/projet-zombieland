import axiosInstance from "./getApi.ts";
import type {CreateMessageParams} from "../@types/messaging";

export const createMessage = async ({
                                        conversationId,
                                        content,
                                        object
                                    }: CreateMessageParams) => {
    // Validation
    if (!content.trim()) {
        throw new Error('Le contenu du message ne peut pas être vide');
    }

    // Construction du payload selon les paramètres fournis
    const payload: any = {
        content: content.trim(),
    };

    // Si c'est un message dans une conversation existante
    if (conversationId) {
        payload.conversationId = conversationId;
    }

    if (object) {
        payload.object = object;
    }

    console.log('Données envoyées:', payload);

    try {
        const response = await axiosInstance.post('/messages', payload);
        return response.data;
    } catch (error: any) {
        console.error('Erreur lors de la création du message:', error.response?.data);
        throw error;
    }
};

export const markMessageAsRead = async (messageId: number) => {
    await axiosInstance.patch(`/messages/${messageId}/read`);
}

export const deleteMessage = async (messageId: number) => {
    const response = await axiosInstance.delete(`/messages/${messageId}`);
    return response.data;
}
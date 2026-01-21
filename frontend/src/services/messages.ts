import axiosInstance from "./getApi.ts";

export const createMessage = async (conversationId: number, content: string) => {
    console.log('Données envoyées:', { conversationId, content });
    const response = await axiosInstance.post('/messages', {
        conversationId: conversationId,
        content: content
    });
    return response.data;
};
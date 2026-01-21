import type {Role} from "./users";

export interface Message {
    id: number;
    conversation_id: number;
    sender: {
        id: number;
        pseudo: string;
        role: Role;
        email: string;
    };
    content: string;
    is_read: boolean;
    created_at: string;
}

export interface Conversation {
    id: number;
    object: string;
    user_id: number;
    admin_id: number;
    status: ConversationStatus;
    created_at: string;
    updated_at: string;
    messages: Message[];
}

export interface CreateMessageParams {
    conversationId?: number;
    content: string;
    object?: string;
}

export type ConversationStatus = 'OPEN' | 'CLOSED';
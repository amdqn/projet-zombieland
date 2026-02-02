import type {User} from "./users";

export interface Message {
    id: number;
    conversation_id: number;
    sender: User;
    content: string;
    is_read: boolean;
    created_at: string;
    is_deleted: boolean;
}

export interface Conversation {
    id: number
    object: string
    user_id: number
    admin_id: number
    status: string
    user: User
    admin: User
    messages: Message[]
    created_at: string
    updated_at: string
}

export interface CreateMessageParams {
    conversationId?: number;
    content: string;
    object?: string;
}

export type ConversationStatus = 'OPEN' | 'CLOSED';
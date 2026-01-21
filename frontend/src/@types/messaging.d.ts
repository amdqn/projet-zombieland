
export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
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

export type ConversationStatus = 'OPEN' | 'CLOSED';
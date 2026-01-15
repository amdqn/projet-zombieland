export interface User {
    id: number;
    pseudo: string;
    email: string;
    passwordHash: string;
    role: Role;
    is_active?: boolean;
    created_at: Date;
    updated_at: Date;
    _count?: {
        reservations: number;
    };
}

export type Role = 'ADMIN' | 'CLIENT';
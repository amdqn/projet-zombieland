export interface User {
    id: number;
    pseudo: string;
    email: string;
    passwordHash: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
}

export type Role = 'ADMIN' | 'CLIENT';
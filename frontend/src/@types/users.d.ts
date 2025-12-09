export interface User {
    id: number;
    email: string;
    passwordHash: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export type Role = 'ADMIN' | 'CLIENT';
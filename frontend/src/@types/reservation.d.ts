export interface ReservationTicket {
    price_id: number;
    label: string;
    type: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface Reservation{
    id: number;
    reservation_number: string;
    user_id: number;
    date_id: number;
    price_id?: number;
    tickets_count?: number;
    tickets?: ReservationTicket[];
    total_amount: number;
    status: ReservationStatus;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        email: string;
        pseudo: string;
        role: string;
    };
    date?: {
        id: number;
        jour: string;
        is_open: boolean;
        notes?: string;
    };
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
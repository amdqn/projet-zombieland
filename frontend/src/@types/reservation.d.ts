export interface Reservation{
    id: number;
    reservation_number: string;
    user_id: number;
    date_id: number;
    price_id: number;
    tickets_count: number;
    total_amount: number;
    status: ReservationStatus;
    created_at: string;
    updated_at: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';
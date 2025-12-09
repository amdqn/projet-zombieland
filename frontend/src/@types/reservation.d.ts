export interface Reservation{
    id: number;
    reservationNumber: number;
    userId: number;
    dateId: number;
    priceId: number;
    ticketsCount: number;
    totalAmount: number;
    status: ReservationStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';
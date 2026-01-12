import {getMyReservations} from "../services/reservations.ts";
import {useCallback, useState} from "react";
import type {Reservation} from "../@types/reservation";

export const useReservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reservationNumbers, setReservationNumbers] = useState<string[]>([]);

    const fetchReservations = useCallback(async () => {
        if (reservations.length > 0) return; // Changez la condition

        try {
            const myReservations = await getMyReservations();
            const sortedReservations = myReservations
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            // Stocke les réservations complètes
            setReservations(sortedReservations);

            // ET extrait les numéros si vous en avez encore besoin
            const numbers = sortedReservations.map(r => r.reservation_number);
            setReservationNumbers(numbers);
        } catch (error) {
            console.error("Impossible de récupérer vos réservations:", error);
        }
    }, [reservations.length]);

    return {
        reservations,           // ← Réservations complètes
        reservationNumbers,     // ← Juste les numéros
        setReservations,
        setReservationNumbers,
        fetchReservations
    };
};
import { ReservationMapper } from './reservation.mapper';
import { Reservation, ReservationStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('ReservationMapper', () => {
  const mockReservation: Reservation = {
    id: 1,
    reservation_number: 'RES-2024-001',
    user_id: 1,
    date_id: 5,
    tickets: { adult: 2, child: 1 },
    total_amount: new Decimal('115.00'),
    status: ReservationStatus.PENDING,
    created_at: new Date('2024-01-01T10:00:00Z'),
    updated_at: new Date('2024-01-02T12:00:00Z'),
  };

  describe('toDto', () => {
    it('devrait convertir une Reservation en ReservationDto', () => {
      const result = ReservationMapper.toDto(mockReservation);

      expect(result.id).toBe(1);
      expect(result.reservation_number).toBe('RES-2024-001');
      expect(result.user_id).toBe(1);
      expect(result.date_id).toBe(5);
      expect(result.total_amount).toBe(115);
      expect(result.status).toBe(ReservationStatus.PENDING);
      expect(result.created_at).toBe('2024-01-01T10:00:00.000Z');
      expect(result.updated_at).toBe('2024-01-02T12:00:00.000Z');
    });

    it('devrait gérer différents statuts', () => {
      const reservationConfirmed: Reservation = {
        ...mockReservation,
        status: ReservationStatus.CONFIRMED,
      };

      const result = ReservationMapper.toDto(reservationConfirmed);

      expect(result.status).toBe(ReservationStatus.CONFIRMED);
    });
  });

  describe('toDtoArray', () => {
    it('devrait convertir un tableau de réservations', () => {
      const reservations: Reservation[] = [
        mockReservation,
        { ...mockReservation, id: 2, status: ReservationStatus.CONFIRMED },
        { ...mockReservation, id: 3, status: ReservationStatus.CANCELLED },
      ];

      const result = ReservationMapper.toDtoArray(reservations);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(1);
      expect(result[0].status).toBe(ReservationStatus.PENDING);
      expect(result[1].id).toBe(2);
      expect(result[1].status).toBe(ReservationStatus.CONFIRMED);
      expect(result[2].id).toBe(3);
      expect(result[2].status).toBe(ReservationStatus.CANCELLED);
    });

    it('devrait retourner un tableau vide si aucune réservation', () => {
      const result = ReservationMapper.toDtoArray([]);

      expect(result).toEqual([]);
    });
  });
});

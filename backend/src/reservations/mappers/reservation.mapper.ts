import { Reservation } from '@prisma/client';
import { ReservationDto } from '../../generated/model/reservationDto';

/**
 * Mapper Reservation : Entité Prisma → DTO OpenAPI
 *
 * Transforme les entités Reservation de Prisma en DTOs sécurisés
 * pour l'exposition via l'API.
 *
 * ⚠️ Gère la conversion Decimal → number pour total_amount
 */
export class ReservationMapper {
  /**
   * Transforme une Reservation Prisma en DTO
   *
   * @param reservation - Entité Reservation de Prisma
   * @returns ReservationDto pour l'API
   */
  static toDto(reservation: Reservation): ReservationDto {
    return {
      id: reservation.id,
      reservation_number: reservation.reservation_number,
      user_id: reservation.user_id,
      date_id: reservation.date_id,
      // Conversion Decimal → number pour total_amount
      total_amount: parseFloat(reservation.total_amount.toString()),
      status: reservation.status,
      created_at: reservation.created_at.toISOString(),
      updated_at: reservation.updated_at.toISOString(),
    };
  }

  /**
   * Transforme une liste de réservations
   *
   * @param reservations - Tableau d'entités Reservation
   * @returns Tableau de ReservationDto
   */
  static toDtoArray(reservations: Reservation[]): ReservationDto[] {
    return reservations.map((reservation) => this.toDto(reservation));
  }
}

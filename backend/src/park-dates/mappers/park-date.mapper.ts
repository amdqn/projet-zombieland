import { ParkDate } from '@prisma/client';
import { ParkDateDto } from '../../generated/model/parkDateDto';

/**
 * Mapper ParkDate : Entité Prisma → DTO OpenAPI
 *
 * Transforme les entités ParkDate de Prisma en DTOs sécurisés
 * pour l'exposition via l'API.
 *
 * ⚠️ Gère la conversion des dates et heures au format string
 */
export class ParkDateMapper {
  /**
   * Transforme une ParkDate Prisma en DTO
   *
   * @param parkDate - Entité ParkDate de Prisma
   * @returns ParkDateDto pour l'API
   */
  static toDto(parkDate: ParkDate): ParkDateDto {
    return {
      id: parkDate.id,
      jour: parkDate.jour.toISOString().split('T')[0],
      is_open: parkDate.is_open,
      open_hour: parkDate.open_hour
        ? parkDate.open_hour.toISOString().split('T')[1].split('.')[0]
        : null,
      close_hour: parkDate.close_hour
        ? parkDate.close_hour.toISOString().split('T')[1].split('.')[0]
        : null,
      notes: parkDate.notes,
      created_at: parkDate.created_at.toISOString(),
    };
  }

  /**
   * Transforme une liste de dates de parc
   *
   * @param parkDates - Tableau d'entités ParkDate
   * @returns Tableau de ParkDateDto
   */
  static toDtoArray(parkDates: ParkDate[]): ParkDateDto[] {
    return parkDates.map((parkDate) => this.toDto(parkDate));
  }
}

import { Attraction } from '@prisma/client';
import { AttractionDto } from '../../generated/model/attractionDto';

/**
 * Mapper Attraction : Entité Prisma → DTO OpenAPI
 *
 * Transforme les entités Attraction de Prisma en DTOs sécurisés
 * pour l'exposition via l'API.
 *
 * ⚠️ Gère la conversion Decimal → string pour latitude/longitude
 */
export class AttractionMapper {
  /**
   * Transforme une Attraction Prisma en DTO
   *
   * @param attraction - Entité Attraction de Prisma
   * @returns AttractionDto pour l'API
   */
  static toDto(attraction: Attraction): AttractionDto {
    return {
      id: attraction.id,
      name: attraction.name,
      description: attraction.description,
      thrill_level: attraction.thrill_level,
      duration: attraction.duration,
      category_id: attraction.category_id,
      created_at: attraction.created_at.toISOString(),
      updated_at: attraction.updated_at.toISOString(),
    };
  }

  /**
   * Transforme une liste d'attractions
   *
   * @param attractions - Tableau d'entités Attraction
   * @returns Tableau de AttractionDto
   */
  static toDtoArray(attractions: Attraction[]): AttractionDto[] {
    return attractions.map((attraction) => this.toDto(attraction));
  }
}

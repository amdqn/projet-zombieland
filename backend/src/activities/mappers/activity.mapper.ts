import { Activity } from '@prisma/client';
import { ActivityDto } from '../../generated/model/activityDto';

/**
 * Mapper Activity : Entité Prisma → DTO OpenAPI
 * 
 * Transforme les entités Activity de Prisma en DTOs sécurisés
 * pour l'exposition via l'API.
 * 
 * ⚠️ Gère la conversion Decimal → string pour latitude/longitude
 */
export class ActivityMapper {
  /**
   * Transforme une Activity Prisma en DTO
   * 
   * @param activity - Entité Activity de Prisma
   * @returns ActivityDto pour l'API
   */
  static toDto(activity: Activity): ActivityDto {
    return {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      image_url: activity.image_url,
      thrill_level: activity.thrill_level,
      duration: activity.duration,
      latitude: activity.latitude?.toString() ?? null,
      longitude: activity.longitude?.toString() ?? null,
      category_id: activity.category_id,
      attraction_id: activity.attraction_id,
      created_at: activity.created_at.toISOString(),
      updated_at: activity.updated_at.toISOString(),
    };
  }

  /**
   * Transforme une liste d'activités
   * 
   * @param activities - Tableau d'entités Activity
   * @returns Tableau de ActivityDto
   */
  static toDtoArray(activities: Activity[]): ActivityDto[] {
    return activities.map((activity) => this.toDto(activity));
  }
}

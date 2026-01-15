import { Category } from '@prisma/client';
import { CategoryDto } from '../../generated/model/categoryDto';

/**
 * Mapper Category : Entité Prisma → DTO OpenAPI
 * 
 * Transforme les entités Category de Prisma en DTOs sécurisés
 * pour l'exposition via l'API.
 */
export class CategoryMapper {
  /**
   * Transforme une Category Prisma en DTO
   * 
   * @param category - Entité Category de Prisma
   * @returns CategoryDto pour l'API
   */
  static toDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    };
  }

  /**
   * Transforme une liste de catégories
   * 
   * @param categories - Tableau d'entités Category
   * @returns Tableau de CategoryDto
   */
  static toDtoArray(categories: Category[]): CategoryDto[] {
    return categories.map((category) => this.toDto(category));
  }
}

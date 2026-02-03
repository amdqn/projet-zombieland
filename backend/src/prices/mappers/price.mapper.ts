import { Price } from '@prisma/client';
import { PriceDto } from '../../generated/model/priceDto';

/**
 * Mapper Price : Entité Prisma → DTO OpenAPI
 *
 * Transforme les entités Price de Prisma en DTOs sécurisés
 * pour l'exposition via l'API.
 *
 * ⚠️ Gère la conversion Decimal → number pour le montant
 */
export class PriceMapper {
  /**
   * Transforme un Price Prisma en DTO
   *
   * @param price - Entité Price de Prisma
   * @returns PriceDto pour l'API
   */
  static toDto(price: Price): PriceDto {
    return {
      id: price.id,
      label: price.label,
      type: price.type,
      // Conversion Decimal → number pour amount
      amount: parseFloat(price.amount.toString()),
      duration_days: price.duration_days,
      created_at: price.created_at.toISOString(),
      updated_at: price.updated_at.toISOString(),
    };
  }

  /**
   * Transforme une liste de tarifs
   *
   * @param prices - Tableau d'entités Price
   * @returns Tableau de PriceDto
   */
  static toDtoArray(prices: Price[]): PriceDto[] {
    return prices.map((price) => this.toDto(price));
  }
}

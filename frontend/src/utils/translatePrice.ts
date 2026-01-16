import type { TFunction } from 'i18next';
import type { PriceType } from '../@types/price';

/**
 * Traduit le type de prix en fonction de la langue actuelle
 * @param priceType - Le type de prix à traduire
 * @param t - La fonction de traduction i18next
 * @returns Le nom traduit du type de prix
 */
export const translatePriceType = (priceType: PriceType, t: TFunction): string => {
  const key = `priceTypes.${priceType}`;
  return t(key);
};

/**
 * Formate le nom complet d'un prix avec la durée
 * @param priceType - Le type de prix
 * @param durationDays - La durée en jours
 * @param t - La fonction de traduction i18next
 * @returns Le nom formaté du prix
 */
export const formatPriceName = (
  priceType: PriceType,
  durationDays: number,
  t: TFunction
): string => {
  const translatedType = translatePriceType(priceType, t);

  // Si c'est un pass 2 jours, on retourne juste le nom traduit
  if (priceType === 'PASS_2J') {
    return translatedType;
  }

  // Sinon on ajoute la durée
  const dayLabel = durationDays > 1 ? t('reservation.step1.days') : t('reservation.step1.day');
  return `${translatedType} - ${durationDays} ${dayLabel}`;
};

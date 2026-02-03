/**
 * Utility functions for handling multilingual content
 */

export type Language = 'fr' | 'en';

/**
 * Extracts language from request headers or query params
 * Defaults to 'fr' if not specified
 */
export function getLanguageFromRequest(
  acceptLanguage?: string,
  lang?: string,
): Language {
  // Priority: query param > header
  if (lang === 'en' || lang === 'fr') {
    return lang;
  }

  if (acceptLanguage) {
    const langCode = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    if (langCode === 'en') return 'en';
  }

  return 'fr'; // Default
}

/**
 * Gets the translated name field based on language
 */
export function getTranslatedName(entity: any, lang: Language): string {
  if (lang === 'en' && entity.name_en) {
    return entity.name_en;
  }
  return entity.name || '';
}

/**
 * Gets the translated description field based on language
 */
export function getTranslatedDescription(entity: any, lang: Language): string {
  if (lang === 'en' && entity.description_en) {
    return entity.description_en;
  }
  return entity.description || '';
}

/**
 * Gets the translated label field based on language (for prices)
 */
export function getTranslatedLabel(entity: any, lang: Language): string {
  if (lang === 'en' && entity.label_en) {
    return entity.label_en;
  }
  return entity.label || '';
}

/**
 * Gets the translated alt_text field based on language (for images)
 */
export function getTranslatedAltText(
  entity: any,
  lang: Language,
): string | null {
  if (lang === 'en' && entity.alt_text_en) {
    return entity.alt_text_en;
  }
  return entity.alt_text || null;
}

/**
 * Transforms an activity/attraction/category to use translated fields
 */
export function transformTranslatableFields<T extends Record<string, any>>(
  entity: T,
  lang: Language,
): T {
  const transformed: Record<string, any> = { ...entity };

  // Transform name and description
  if ('name' in entity || 'name_en' in entity) {
    transformed.name = getTranslatedName(entity, lang);
    // Remove _en fields from output
    delete transformed.name_en;
  }

  if ('description' in entity || 'description_en' in entity) {
    transformed.description = getTranslatedDescription(entity, lang);
    delete transformed.description_en;
  }

  // Transform label (for prices)
  if ('label' in entity || 'label_en' in entity) {
    transformed.label = getTranslatedLabel(entity, lang);
    delete transformed.label_en;
  }

  // Transform alt_text (for images)
  if ('alt_text' in entity || 'alt_text_en' in entity) {
    transformed.alt_text = getTranslatedAltText(entity, lang);
    delete transformed.alt_text_en;
  }

  return transformed as T;
}

/**
 * Transforms an array of translatable entities
 */
export function transformTranslatableArray<T extends Record<string, any>>(
  entities: T[],
  lang: Language,
): T[] {
  return entities.map((entity) => transformTranslatableFields(entity, lang));
}

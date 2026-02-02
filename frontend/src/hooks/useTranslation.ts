import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Hook personnalisé étendu pour les traductions
 * Facilite l'utilisation des traductions dans l'application avec des helpers supplémentaires
 * 
 * @example
 * const { t, changeLanguage, currentLanguage, isFrench } = useAppTranslation();
 * 
 * // Utilisation simple
 * <Typography>{t('common.welcome')}</Typography>
 * 
 * // Avec interpolation
 * <Typography>{t('home.hero.parkStatus', { status: 'ouvert' })}</Typography>
 * 
 * // Changer la langue
 * changeLanguage('en');
 */
export const useAppTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lang: 'fr' | 'en') => {
    i18n.changeLanguage(lang);
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18n.language as 'fr' | 'en',
    isFrench: i18n.language === 'fr',
    isEnglish: i18n.language === 'en',
  };
};

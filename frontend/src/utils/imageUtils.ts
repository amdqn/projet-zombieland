/**
 * Utilitaire pour gérer les URLs d'images
 * Gère à la fois les images du frontend (public/) et du backend (uploadées)
 */

const getBackendBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || undefined;
  return apiUrl.replace(/\/api\/v1$/, '');
};

const BACKEND_URL = getBackendBaseUrl();

// Images par défaut (chemins relatifs uniquement)
export const DEFAULT_ACTIVITY_IMAGE = '/activities-images/zombie.webp';
export const DEFAULT_ATTRACTION_IMAGE = '/activities-images/zombie.webp';
export const DEFAULT_RESTAURANT_IMAGE = '/attractions-images/restaurant-default.webp';

/**
 * Résout l'URL d'une image en gérant les deux cas :
 * - Images existantes dans backend/public/ 
 * - Images uploadées dans backend/public/ 
 *
 *
 * @param imageUrl - URL de l'image (peut être relative ou absolue)
 * @param defaultImage - Image par défaut si aucune URL fournie
 * @returns URL complète de l'image
 */
export function resolveImageUrl(
  imageUrl: string | null | undefined,
  defaultImage: string = '/activities-images/zombie.webp'
): string {
  const trimmedUrl = imageUrl?.trim();

  // Si pas d'URL, retourner l'image par défaut depuis le backend
  if (!trimmedUrl) {
    return `${BACKEND_URL}${defaultImage}`;
  }

  // Si c'est déjà une URL complète HTTP/HTTPS, la retourner telle quelle
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // Si c'est un chemin relatif commençant par /
  // Toutes les images (anciennes et nouvelles) sont servies depuis le backend
  if (trimmedUrl.startsWith('/')) {
    return `${BACKEND_URL}${trimmedUrl}`;
  }

  // Fallback : retourner l'image par défaut depuis le backend
  return `${BACKEND_URL}${defaultImage}`;
}

/**
 * Retourne un objet avec l'URL de l'image et un callback onError pour fallback
 *
 * Maintenant que toutes les images sont servies depuis le backend,
 * cette fonction utilise resolveImageUrl et fournit juste un fallback vers l'image par défaut
 */
export function getImageWithFallback(
  imageUrl: string | null | undefined,
  defaultImage: string = '/activities-images/zombie.webp'
): {
  src: string;
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
} {
  const resolvedUrl = resolveImageUrl(imageUrl, defaultImage);
  const defaultUrl = `${BACKEND_URL}${defaultImage}`;

  return {
    src: resolvedUrl,
    onError: (e) => {
      // Si le chargement échoue, basculer sur l'image par défaut
      const target = e.currentTarget;
      if (target.src !== defaultUrl) {
        target.src = defaultUrl;
      }
    },
  };
}

import { ResolutionClassification, ThumbnailItem } from '../types';

/**
 * Clasifica una miniatura según sus dimensiones reales verificadas.
 * Garantiza que nunca se clasifique una imagen como 4K a menos que tenga
 * al menos 3840 píxeles de ancho y 2160 de alto.
 */
export function classifyThumbnail(item: ThumbnailItem): ResolutionClassification {
  if (item.status !== 'available' || item.width === 0) {
    return {
      label: 'No disponible',
      badgeClass: 'badge--unavailable',
      is4K: false,
      category: 'na',
    };
  }

  const { width: w, height: h } = item;

  // 4K nativo real
  if (w >= 3840 && h >= 2160) {
    return {
      label: '4K Ultra HD',
      badgeClass: 'badge--4k',
      is4K: true,
      category: '4k',
    };
  }

  // Full HD
  if (w >= 1920) {
    return {
      label: 'FHD 1080p',
      badgeClass: 'badge--fhd',
      is4K: false,
      category: 'fhd',
    };
  }

  // High Definition (Estándar maxresdefault de YouTube 1280×720)
  if (w >= 1280) {
    return {
      label: 'HD 720p',
      badgeClass: 'badge--hd',
      is4K: false,
      category: 'hd',
    };
  }

  // Standard Definition (640×480)
  if (w >= 640) {
    return {
      label: 'SD 480p',
      badgeClass: 'badge--sd',
      is4K: false,
      category: 'sd',
    };
  }

  // Media calidad (320×180)
  if (w >= 320) {
    return {
      label: 'Media (HQ)',
      badgeClass: 'badge--md',
      is4K: false,
      category: 'md',
    };
  }

  // Baja resolución (120×90)
  return {
    label: 'Baja (Default)',
    badgeClass: 'badge--ld',
    is4K: false,
    category: 'ld',
  };
}

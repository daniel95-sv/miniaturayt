import { ThumbnailItem, ThumbnailVariantDef } from '../types';
import { THUMB_HOST, THUMBNAIL_VARIANTS, PLACEHOLDER_SIZE } from '../config/constants';

export function buildThumbnailUrl(videoId: string, variantKey: string): string {
  return `${THUMB_HOST}/${encodeURIComponent(videoId)}/${variantKey}.jpg`;
}

export interface LoadedImageInfo {
  ok: boolean;
  url: string;
  width: number;
  height: number;
}

/**
 * Carga una imagen de forma asíncrona para obtener sus dimensiones naturales.
 * Implementa un timeout para evitar operaciones bloqueadas.
 */
export function checkImageDimensions(
  url: string,
  timeoutMs = 8000
): Promise<LoadedImageInfo> {
  return new Promise((resolve) => {
    let resolved = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        img.src = '';
        resolve({ ok: false, url, width: 0, height: 0 });
      }
    }, timeoutMs);

    img.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve({
          ok: true,
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      }
    };

    img.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve({ ok: false, url, width: 0, height: 0 });
      }
    };

    img.src = url;
  });
}

/**
 * Consulta y verifica en paralelo las variantes de miniaturas disponibles para un ID de video.
 * Si YouTube devuelve el placeholder de 120×90 para variantes de mayor resolución,
 * la imagen se marca como no disponible.
 */
export async function resolveVideoThumbnails(
  videoId: string,
  imageChecker: (url: string) => Promise<LoadedImageInfo> = checkImageDimensions
): Promise<ThumbnailItem[]> {
  const promises = THUMBNAIL_VARIANTS.map(async (variant: ThumbnailVariantDef): Promise<ThumbnailItem> => {
    const url = buildThumbnailUrl(videoId, variant.key);
    const loaded = await imageChecker(url);

    if (!loaded.ok) {
      return {
        variant,
        url,
        status: 'unavailable',
        width: 0,
        height: 0,
      };
    }

    // Detectar si YouTube devolvió la imagen de sustitución/error de 120×90 px
    const isPlaceholder =
      variant.expected[0] > 120 &&
      loaded.width === PLACEHOLDER_SIZE[0] &&
      loaded.height === PLACEHOLDER_SIZE[1];

    if (isPlaceholder) {
      return {
        variant,
        url,
        status: 'unavailable',
        width: 0,
        height: 0,
        isPlaceholder: true,
      };
    }

    return {
      variant,
      url,
      status: 'available',
      width: loaded.width,
      height: loaded.height,
    };
  });

  return Promise.all(promises);
}

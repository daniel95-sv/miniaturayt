import { copyToClipboard } from './clipboard';

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

export interface ShareResult {
  shared: boolean;
  copied: boolean;
}

/**
 * Comparte el enlace de la aplicación utilizando la Web Share API si está disponible,
 * o copia el enlace al portapapeles como fallback inmediato.
 */
export async function sharePage(options: ShareOptions = {}): Promise<ShareResult> {
  const shareData: ShareData = {
    title: options.title || document.title,
    text: options.text || 'Descargador de Miniaturas de YouTube en HD — MiniaturaYT',
    url: options.url || window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { shared: true, copied: false };
    } catch (err: unknown) {
      // AbortError ocurre si el usuario cancela la ventana de compartir
      if (err instanceof Error && err.name === 'AbortError') {
        return { shared: false, copied: false };
      }
    }
  }

  // Fallback: copiar la URL al portapapeles
  const copied = await copyToClipboard(shareData.url || window.location.href);
  return { shared: false, copied };
}

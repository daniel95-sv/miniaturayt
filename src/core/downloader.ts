export interface DownloadResult {
  success: boolean;
  method: 'direct' | 'fallback';
  filename: string;
  message: string;
}

/**
 * Genera el nombre de archivo estandarizado según las especificaciones del proyecto:
 * youtube-thumbnail_VIDEOID_WIDTHxHEIGHT.jpg
 */
export function generateThumbnailFilename(
  videoId: string,
  width: number,
  height: number
): string {
  const safeId = videoId.replace(/[^A-Za-z0-9_-]/g, '');
  return `youtube-thumbnail_${safeId}_${width}x${height}.jpg`;
}

/**
 * Ejecuta la descarga de la imagen intentando primero una obtención directa mediante Blob (CORS).
 * Si las políticas de seguridad del navegador impiden el acceso a los bytes de la imagen,
 * activa de forma segura la apertura en pestaña nueva informando al usuario del procedimiento estándar.
 */
export async function downloadThumbnail(
  url: string,
  videoId: string,
  width: number,
  height: number
): Promise<DownloadResult> {
  const filename = generateThumbnailFilename(videoId, width, height);

  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    // Revocar URL del objeto tras la descarga para liberar memoria
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 2000);

    return {
      success: true,
      method: 'direct',
      filename,
      message: 'Descarga iniciada con éxito.',
    };
  } catch {
    let popupOpened = false;
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (win) popupOpened = true;
    } catch {
      popupOpened = false;
    }

    return {
      success: false,
      method: 'fallback',
      filename,
      message: popupOpened
        ? 'Restricción de origen del navegador (CORS): se ha abierto la imagen original en una nueva pestaña para que puedas guardarla.'
        : 'Restricción CORS del navegador: pulsa el botón "Abrir original" para visualizar la imagen y guardarla con clic derecho.',
    };
  }
}

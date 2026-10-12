import { ThumbnailVariantDef, ParseErrorReason } from '../types';

export const THUMB_HOST = 'https://i.ytimg.com/vi';

export const PLACEHOLDER_SIZE: [number, number] = [120, 90];

export const YT_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'music.youtube.com',
]);

export const THUMBNAIL_VARIANTS: readonly ThumbnailVariantDef[] = [
  {
    key: 'maxresdefault',
    label: 'Máxima resolución (HD)',
    expected: [1280, 720],
    aspectRatio: '16:9',
    description: 'Resolución óptima de 1280×720 píxeles. Presente en videos subidos en alta definición.',
  },
  {
    key: 'sddefault',
    label: 'Resolución estándar (SD)',
    expected: [640, 480],
    aspectRatio: '4:3',
    description: 'Resolución de 640×480 píxeles. Compatible con la mayoría de reproductores estándar.',
  },
  {
    key: 'hqdefault',
    label: 'Alta calidad (HQ)',
    expected: [480, 360],
    aspectRatio: '4:3',
    description: 'Resolución de 480×360 píxeles. Disponible de forma prácticamente universal en todo video.',
  },
  {
    key: 'mqdefault',
    label: 'Calidad media (MQ)',
    expected: [320, 180],
    aspectRatio: '16:9',
    description: 'Resolución de 320×180 píxeles. Diseñada para vistas previas compactas y móviles.',
  },
  {
    key: 'default',
    label: 'Baja resolución (Thumbnail)',
    expected: [120, 90],
    aspectRatio: '4:3',
    description: 'Miniatura básica de 120×90 píxeles. Empleada en listas de reproducción e historiales.',
  },
];

export const PARSE_ERROR_MESSAGES: Record<ParseErrorReason, string> = {
  empty: 'Por favor, introduce una URL de YouTube en el campo de texto.',
  invalid: 'La URL proporcionada no tiene un formato web válido.',
  protocol: 'Solo se admiten enlaces seguros mediante protocolo HTTP o HTTPS.',
  host: 'El dominio introducido no pertenece a YouTube. Verifica el enlace.',
  videoId: 'No se pudo identificar un ID de video de YouTube válido (debe tener exactamente 11 caracteres).',
};

export const THEME_STORAGE_KEY = 'miniaturayt-theme-v1';

import { ParseUrlResult } from '../types';
import { YT_HOSTS } from '../config/constants';

/**
 * Valida de forma estricta una URL de YouTube y extrae el identificador del video (11 caracteres).
 * Rechaza dominios falsos, protocolos no permitidos, parámetros maliciosos y formatos inválidos.
 */
export function parseYouTubeUrl(raw: unknown): ParseUrlResult {
  if (typeof raw !== 'string') {
    return { ok: false, reason: 'invalid' };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, reason: 'empty' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, reason: 'invalid' };
  }

  // Rechazar protocolos distintos a HTTP/HTTPS
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { ok: false, reason: 'protocol' };
  }

  // Validar hostname exacto frente a la lista blanca
  const host = parsed.hostname.toLowerCase();
  if (!YT_HOSTS.has(host)) {
    return { ok: false, reason: 'host' };
  }

  const path = parsed.pathname.replace(/\/+$/, '');
  const params = parsed.searchParams;
  let id: string | null = null;

  // Extraer el identificador según la estructura admitida
  if (host === 'youtu.be' || host === 'www.youtu.be') {
    const firstSegment = path.slice(1).split('/')[0];
    id = firstSegment || null;
  } else if (path === '/watch') {
    id = params.get('v');
  } else if (path.startsWith('/shorts/')) {
    id = path.slice('/shorts/'.length).split('/')[0] || null;
  } else if (path.startsWith('/embed/')) {
    id = path.slice('/embed/'.length).split('/')[0] || null;
  } else if (path.startsWith('/live/')) {
    id = path.slice('/live/'.length).split('/')[0] || null;
  } else if (path.startsWith('/v/')) {
    id = path.slice('/v/'.length).split('/')[0] || null;
  }

  // Validación estricta del ID de YouTube (11 caracteres alfanuméricos, guiones o barras bajas)
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) {
    return { ok: false, reason: 'videoId' };
  }

  return { ok: true, id };
}

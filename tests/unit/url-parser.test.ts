import { describe, it, expect } from 'vitest';
import { parseYouTubeUrl } from '../../src/core/url-parser';

describe('Extractor y Validador de URLs de YouTube (url-parser)', () => {
  it('extrae el ID correctamente de un enlace estándar watch?v=', () => {
    const res = parseYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(res).toEqual({ ok: true, id: 'dQw4w9WgXcQ' });
  });

  it('extrae el ID de una URL acortada youtu.be/', () => {
    const res = parseYouTubeUrl('https://youtu.be/dQw4w9WgXcQ');
    expect(res).toEqual({ ok: true, id: 'dQw4w9WgXcQ' });
  });

  it('extrae el ID de un enlace de YouTube Shorts', () => {
    const res = parseYouTubeUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ');
    expect(res).toEqual({ ok: true, id: 'dQw4w9WgXcQ' });
  });

  it('extrae el ID de un enlace embebido /embed/', () => {
    const res = parseYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(res).toEqual({ ok: true, id: 'dQw4w9WgXcQ' });
  });

  it('extrae el ID de una transmisión en vivo /live/', () => {
    const res = parseYouTubeUrl('https://www.youtube.com/live/dQw4w9WgXcQ');
    expect(res).toEqual({ ok: true, id: 'dQw4w9WgXcQ' });
  });

  it('soporta subdominios oficiales m.youtube.com y music.youtube.com', () => {
    const mobile = parseYouTubeUrl('https://m.youtube.com/watch?v=dQw4w9WgXcQ');
    const music = parseYouTubeUrl('https://music.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(mobile).toEqual({ ok: true, id: 'dQw4w9WgXcQ' });
    expect(music).toEqual({ ok: true, id: 'dQw4w9WgXcQ' });
  });

  it('maneja y limpia parámetros de consulta adicionales (?t=, &si=, &list=)', () => {
    const res = parseYouTubeUrl(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&feature=share&si=abc123xyz'
    );
    expect(res).toEqual({ ok: true, id: 'dQw4w9WgXcQ' });
  });

  it('rechaza dominios lookalike o fraudulentos', () => {
    const fake1 = parseYouTubeUrl('https://youtube.com.attacker.org/watch?v=dQw4w9WgXcQ');
    const fake2 = parseYouTubeUrl('https://notyoutube.com/watch?v=dQw4w9WgXcQ');
    const fake3 = parseYouTubeUrl('https://attacker.com/?url=youtube.com');

    expect(fake1).toEqual({ ok: false, reason: 'host' });
    expect(fake2).toEqual({ ok: false, reason: 'host' });
    expect(fake3).toEqual({ ok: false, reason: 'host' });
  });

  it('rechaza protocolos no permitidos (javascript:, data:, ftp:)', () => {
    expect(parseYouTubeUrl('javascript:alert(1)')).toEqual({ ok: false, reason: 'protocol' });
    expect(parseYouTubeUrl('data:text/html,<h1>test</h1>')).toEqual({ ok: false, reason: 'protocol' });
    expect(parseYouTubeUrl('ftp://youtube.com/watch?v=dQw4w9WgXcQ')).toEqual({ ok: false, reason: 'protocol' });
  });

  it('rechaza IDs malformados o con longitud diferente a 11 caracteres', () => {
    expect(parseYouTubeUrl('https://www.youtube.com/watch?v=short')).toEqual({ ok: false, reason: 'videoId' });
    expect(parseYouTubeUrl('https://www.youtube.com/watch?v=toolong123456789')).toEqual({ ok: false, reason: 'videoId' });
    expect(parseYouTubeUrl('https://www.youtube.com/watch?v=invalid$char!')).toEqual({ ok: false, reason: 'videoId' });
  });

  it('rechaza entradas vacías o no válidas', () => {
    expect(parseYouTubeUrl('')).toEqual({ ok: false, reason: 'empty' });
    expect(parseYouTubeUrl('   ')).toEqual({ ok: false, reason: 'empty' });
    expect(parseYouTubeUrl(null)).toEqual({ ok: false, reason: 'invalid' });
    expect(parseYouTubeUrl(12345)).toEqual({ ok: false, reason: 'invalid' });
  });
});

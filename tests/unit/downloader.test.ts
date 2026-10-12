import { describe, it, expect } from 'vitest';
import { generateThumbnailFilename } from '../../src/core/downloader';

describe('Generador de nombres de archivo de descarga (downloader)', () => {
  it('genera nombres descriptivos con el formato youtube-thumbnail_VIDEOID_WIDTHxHEIGHT.jpg', () => {
    const filename = generateThumbnailFilename('dQw4w9WgXcQ', 1280, 720);
    expect(filename).toBe('youtube-thumbnail_dQw4w9WgXcQ_1280x720.jpg');
  });

  it('sanitiza caracteres no permitidos en el videoId', () => {
    const filename = generateThumbnailFilename('../etc/passwd/dQw4w9WgXcQ', 640, 480);
    expect(filename).toBe('youtube-thumbnail_etcpasswddQw4w9WgXcQ_640x480.jpg');
  });
});

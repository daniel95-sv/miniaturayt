import { describe, it, expect } from 'vitest';
import { resolveVideoThumbnails, LoadedImageInfo } from '../../src/core/thumbnail-resolver';

describe('Servicio de Resolución de Miniaturas (thumbnail-resolver)', () => {
  it('detecta y descarta el placeholder 120×90 devuelto por YouTube cuando no existe maxresdefault', async () => {
    // Mock image checker que simula que maxresdefault devuelve 120x90 pero sddefault y hqdefault existen reales
    const mockChecker = async (url: string): Promise<LoadedImageInfo> => {
      if (url.includes('maxresdefault.jpg')) {
        return { ok: true, url, width: 120, height: 90 }; // placeholder falso de YouTube!
      }
      if (url.includes('sddefault.jpg')) {
        return { ok: true, url, width: 640, height: 480 };
      }
      if (url.includes('hqdefault.jpg')) {
        return { ok: true, url, width: 480, height: 360 };
      }
      return { ok: true, url, width: 120, height: 90 };
    };

    const results = await resolveVideoThumbnails('dQw4w9WgXcQ', mockChecker);
    const maxres = results.find((r) => r.variant.key === 'maxresdefault');
    const sd = results.find((r) => r.variant.key === 'sddefault');

    expect(maxres).toBeDefined();
    expect(maxres?.status).toBe('unavailable');
    expect(maxres?.isPlaceholder).toBe(true);

    expect(sd).toBeDefined();
    expect(sd?.status).toBe('available');
    expect(sd?.width).toBe(640);
  });

  it('marca como available cuando maxresdefault existe con dimensiones reales 1280×720', async () => {
    const mockChecker = async (url: string): Promise<LoadedImageInfo> => {
      if (url.includes('maxresdefault.jpg')) {
        return { ok: true, url, width: 1280, height: 720 };
      }
      return { ok: true, url, width: 480, height: 360 };
    };

    const results = await resolveVideoThumbnails('dQw4w9WgXcQ', mockChecker);
    const maxres = results.find((r) => r.variant.key === 'maxresdefault');

    expect(maxres?.status).toBe('available');
    expect(maxres?.width).toBe(1280);
    expect(maxres?.height).toBe(720);
  });

  it('marca como unavailable si la imagen falla al cargar (error 404 o timeout)', async () => {
    const mockChecker = async (url: string): Promise<LoadedImageInfo> => {
      return { ok: false, url, width: 0, height: 0 };
    };

    const results = await resolveVideoThumbnails('dQw4w9WgXcQ', mockChecker);
    expect(results.every((r) => r.status === 'unavailable')).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { classifyThumbnail } from '../../src/core/classifier';
import { ThumbnailItem } from '../../src/types';

describe('Clasificador de Resoluciones (classifier)', () => {
  const dummyVariant = {
    key: 'test',
    label: 'Test',
    expected: [1280, 720] as [number, number],
    aspectRatio: '16:9',
    description: 'test',
  };

  it('clasifica como 4K Ultra HD únicamente si el ancho >= 3840 y alto >= 2160', () => {
    const item4k: ThumbnailItem = {
      variant: dummyVariant,
      url: 'https://example.com/4k.jpg',
      status: 'available',
      width: 3840,
      height: 2160,
    };
    const res = classifyThumbnail(item4k);
    expect(res.category).toBe('4k');
    expect(res.is4K).toBe(true);
    expect(res.label).toBe('4K Ultra HD');
  });

  it('nunca clasifica una imagen de 1280×720 como 4K, sino como HD 720p', () => {
    const itemHd: ThumbnailItem = {
      variant: dummyVariant,
      url: 'https://example.com/hd.jpg',
      status: 'available',
      width: 1280,
      height: 720,
    };
    const res = classifyThumbnail(itemHd);
    expect(res.category).toBe('hd');
    expect(res.is4K).toBe(false);
    expect(res.label).toBe('HD 720p');
  });

  it('clasifica FHD 1080p cuando el ancho >= 1920 pero menor a 3840', () => {
    const itemFhd: ThumbnailItem = {
      variant: dummyVariant,
      url: 'https://example.com/fhd.jpg',
      status: 'available',
      width: 1920,
      height: 1080,
    };
    const res = classifyThumbnail(itemFhd);
    expect(res.category).toBe('fhd');
    expect(res.is4K).toBe(false);
  });

  it('clasifica SD 480p para dimensiones 640×480', () => {
    const itemSd: ThumbnailItem = {
      variant: dummyVariant,
      url: 'https://example.com/sd.jpg',
      status: 'available',
      width: 640,
      height: 480,
    };
    const res = classifyThumbnail(itemSd);
    expect(res.category).toBe('sd');
  });

  it('clasifica correctamente imágenes de resolución media y baja', () => {
    const itemMd: ThumbnailItem = {
      variant: dummyVariant,
      url: 'https://example.com/md.jpg',
      status: 'available',
      width: 320,
      height: 180,
    };
    const itemLd: ThumbnailItem = {
      variant: dummyVariant,
      url: 'https://example.com/ld.jpg',
      status: 'available',
      width: 120,
      height: 90,
    };

    expect(classifyThumbnail(itemMd).category).toBe('md');
    expect(classifyThumbnail(itemLd).category).toBe('ld');
  });

  it('clasifica como no disponible si el estado no es available o las dimensiones son 0', () => {
    const itemUnavail: ThumbnailItem = {
      variant: dummyVariant,
      url: 'https://example.com/none.jpg',
      status: 'unavailable',
      width: 0,
      height: 0,
    };
    const res = classifyThumbnail(itemUnavail);
    expect(res.category).toBe('na');
    expect(res.label).toBe('No disponible');
  });
});

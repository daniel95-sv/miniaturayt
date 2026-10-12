export type ParseErrorReason = 'empty' | 'invalid' | 'protocol' | 'host' | 'videoId';

export type ParseUrlResult =
  | { ok: true; id: string }
  | { ok: false; reason: ParseErrorReason };

export interface ThumbnailVariantDef {
  key: string;
  label: string;
  expected: [number, number];
  aspectRatio: string;
  description: string;
}

export type ThumbnailStatus = 'loading' | 'available' | 'unavailable' | 'error';

export interface ThumbnailItem {
  variant: ThumbnailVariantDef;
  url: string;
  status: ThumbnailStatus;
  width: number;
  height: number;
  isPlaceholder?: boolean;
}

export interface ResolutionClassification {
  label: string;
  badgeClass: string;
  is4K: boolean;
  category: '4k' | 'fhd' | 'hd' | 'sd' | 'md' | 'ld' | 'na';
}

export type ThemeMode = 'light' | 'dark';

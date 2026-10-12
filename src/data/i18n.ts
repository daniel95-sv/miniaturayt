export type SupportedLocale = 'es' | 'en' | 'pt' | 'fr';

export interface TranslationDictionary {
  appName: string;
  heroTitle: string;
  heroSubtitle: string;
  pasteBtn: string;
  clearBtn: string;
  submitBtn: string;
  copyIdBtn: string;
  resetBtn: string;
  formatsHelp: string;
  notice4k: string;
  downloadBtn: string;
  openOriginalBtn: string;
  copyUrlBtn: string;
  statusAvailable: string;
  statusUnavailable: string;
  errors: {
    empty: string;
    invalid: string;
    protocol: string;
    host: string;
    videoId: string;
    noThumbnails: string;
    network: string;
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  es: {
    appName: 'MiniaturaYT',
    heroTitle: 'Descargador de Miniaturas de YouTube en HD',
    heroSubtitle:
      'Pega el enlace de cualquier video, consulta sus miniaturas disponibles con sus dimensiones reales verificadas y descarga la imagen original sin pérdida de calidad.',
    pasteBtn: 'Pegar',
    clearBtn: 'Limpiar',
    submitBtn: 'Obtener miniaturas',
    copyIdBtn: 'Copiar ID',
    resetBtn: 'Volver a empezar',
    formatsHelp: 'Formatos compatibles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID, youtube.com/live/ID',
    notice4k:
      'Aviso de resolución: No se encontró una miniatura 4K nativa disponible para este video. La CDN pública de YouTube almacena miniaturas con una resolución máxima estándar de 1280×720 píxeles. Esta herramienta te proporciona el archivo original sin escalados artificiales.',
    downloadBtn: 'Descargar',
    openOriginalBtn: 'Abrir original',
    copyUrlBtn: 'Copiar enlace',
    statusAvailable: 'Disponible',
    statusUnavailable: 'No disponible',
    errors: {
      empty: 'Por favor, introduce una URL de YouTube en el campo de texto.',
      invalid: 'La URL proporcionada no tiene un formato web válido.',
      protocol: 'Solo se admiten enlaces seguros mediante protocolo HTTP o HTTPS.',
      host: 'El dominio introducido no pertenece a YouTube. Verifica el enlace.',
      videoId: 'No se pudo identificar un ID de video de YouTube válido (debe tener exactamente 11 caracteres).',
      noThumbnails: 'No se encontraron miniaturas públicas accesibles para este video.',
      network: 'Ocurrió un error temporal al conectar con los servidores de YouTube.',
    },
  },
  en: {
    appName: 'MiniaturaYT',
    heroTitle: 'YouTube Thumbnail Downloader in HD',
    heroSubtitle:
      'Paste any YouTube video URL, check available thumbnails with verified real dimensions, and download the original image with zero quality loss.',
    pasteBtn: 'Paste',
    clearBtn: 'Clear',
    submitBtn: 'Get Thumbnails',
    copyIdBtn: 'Copy ID',
    resetBtn: 'Start Over',
    formatsHelp: 'Supported formats: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID, youtube.com/live/ID',
    notice4k:
      'Resolution notice: No native 4K thumbnail was found for this video. YouTube public CDN serves thumbnails up to standard 1280×720 pixels.',
    downloadBtn: 'Download',
    openOriginalBtn: 'Open Original',
    copyUrlBtn: 'Copy Link',
    statusAvailable: 'Available',
    statusUnavailable: 'Unavailable',
    errors: {
      empty: 'Please enter a YouTube video URL.',
      invalid: 'The provided URL does not have a valid format.',
      protocol: 'Only HTTP or HTTPS links are supported.',
      host: 'The domain does not belong to YouTube.',
      videoId: 'Could not identify a valid 11-character YouTube video ID.',
      noThumbnails: 'No public verifiable thumbnails found for this video.',
      network: 'A temporary network error occurred. Please try again.',
    },
  },
  pt: {
    appName: 'MiniaturaYT',
    heroTitle: 'Baixar Miniaturas do YouTube em HD',
    heroSubtitle: 'Insira o link de qualquer vídeo do YouTube e baixe miniaturas oficiais em alta resolução.',
    pasteBtn: 'Colar',
    clearBtn: 'Limpar',
    submitBtn: 'Obter Miniaturas',
    copyIdBtn: 'Copiar ID',
    resetBtn: 'Começar de novo',
    formatsHelp: 'Formatos suportados: youtube.com, youtu.be, shorts, embed, live.',
    notice4k: 'Aviso: Não há miniatura 4K nativa disponível para este vídeo.',
    downloadBtn: 'Baixar',
    openOriginalBtn: 'Abrir Original',
    copyUrlBtn: 'Copiar Link',
    statusAvailable: 'Disponível',
    statusUnavailable: 'Indisponível',
    errors: {
      empty: 'Por favor, insira uma URL do YouTube.',
      invalid: 'Formato de URL inválido.',
      protocol: 'Apenas links HTTP ou HTTPS são permitidos.',
      host: 'O domínio não pertence ao YouTube.',
      videoId: 'ID do YouTube inválido.',
      noThumbnails: 'Nenhuma miniatura encontrada.',
      network: 'Erro de rede temporário.',
    },
  },
  fr: {
    appName: 'MiniaturaYT',
    heroTitle: 'Téléchargeur de Miniatures YouTube en HD',
    heroSubtitle: 'Téléchargez les miniatures officielles YouTube en résolutions HD vérifiées.',
    pasteBtn: 'Coller',
    clearBtn: 'Effacer',
    submitBtn: 'Obtenir',
    copyIdBtn: 'Copier ID',
    resetBtn: 'Recommencer',
    formatsHelp: 'Formats compatibles: youtube.com, youtu.be, shorts, embed, live.',
    notice4k: 'Avis: Aucune miniature 4K native disponible pour cette vidéo.',
    downloadBtn: 'Télécharger',
    openOriginalBtn: 'Ouvrir',
    copyUrlBtn: 'Copier',
    statusAvailable: 'Disponible',
    statusUnavailable: 'Indisponible',
    errors: {
      empty: 'Veuillez saisir une URL YouTube.',
      invalid: 'Format URL non valide.',
      protocol: 'Seuls les liens HTTP ou HTTPS sont autorisés.',
      host: 'Le domaine n’appartient pas à YouTube.',
      videoId: 'Identifiant YouTube non valide.',
      noThumbnails: 'Aucune miniature trouvée.',
      network: 'Erreur réseau temporaire.',
    },
  },
};

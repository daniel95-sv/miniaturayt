import { parseYouTubeUrl } from './core/url-parser';
import { resolveVideoThumbnails } from './core/thumbnail-resolver';
import { classifyThumbnail } from './core/classifier';
import { downloadThumbnail } from './core/downloader';
import { copyToClipboard, readFromClipboard } from './utils/clipboard';
import { sharePage } from './utils/share';
import { analytics } from './services/analytics';
import { PARSE_ERROR_MESSAGES, THEME_STORAGE_KEY } from './config/constants';
import { ThumbnailItem, ThemeMode } from './types';

export class MiniaturaYTApp {
  private currentVideoId: string | null = null;
  private currentRequestId = 0;
  private toastTimer: number | null = null;

  // Elementos DOM
  private els!: {
    urlForm: HTMLFormElement;
    urlInput: HTMLInputElement;
    pasteBtn: HTMLButtonElement;
    clearBtn: HTMLButtonElement;
    submitBtn: HTMLButtonElement;
    statusBanner: HTMLElement;
    resultsSection: HTMLElement;
    galleryGrid: HTMLElement;
    videoIdDisplay: HTMLElement;
    copyIdBtn: HTMLButtonElement;
    resetBtn?: HTMLButtonElement;
    shareBtn: HTMLButtonElement;
    notice4k: HTMLElement;
    themeToggle: HTMLButtonElement;
    toast: HTMLElement;
    toastText: HTMLElement;
    modalBackdrop: HTMLElement;
    modalTitle: HTMLElement;
    modalBody: HTMLElement;
    modalCloseBtn: HTMLButtonElement;
  };

  public init(): void {
    this.cacheDomElements();
    this.bindEvents();
    this.initTheme();
    this.updateYear();
    this.registerServiceWorker();
  }

  private registerServiceWorker(): void {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Registro opcional en entornos compatibles
        });
      });
    }
  }

  private cacheDomElements(): void {
    this.els = {
      urlForm: document.getElementById('urlForm') as HTMLFormElement,
      urlInput: document.getElementById('urlInput') as HTMLInputElement,
      pasteBtn: document.getElementById('pasteBtn') as HTMLButtonElement,
      clearBtn: document.getElementById('clearBtn') as HTMLButtonElement,
      submitBtn: document.getElementById('submitBtn') as HTMLButtonElement,
      statusBanner: document.getElementById('statusBanner') as HTMLElement,
      resultsSection: document.getElementById('resultsSection') as HTMLElement,
      galleryGrid: document.getElementById('galleryGrid') as HTMLElement,
      videoIdDisplay: document.getElementById('videoIdDisplay') as HTMLElement,
      copyIdBtn: document.getElementById('copyIdBtn') as HTMLButtonElement,
      resetBtn: (document.getElementById('resetBtn') as HTMLButtonElement) || undefined,
      shareBtn: document.getElementById('shareBtn') as HTMLButtonElement,
      notice4k: document.getElementById('notice4k') as HTMLElement,
      themeToggle: document.getElementById('themeToggle') as HTMLButtonElement,
      toast: document.getElementById('toast') as HTMLElement,
      toastText: document.getElementById('toastText') as HTMLElement,
      modalBackdrop: document.getElementById('legalModal') as HTMLElement,
      modalTitle: document.getElementById('modalTitle') as HTMLElement,
      modalBody: document.getElementById('modalBody') as HTMLElement,
      modalCloseBtn: document.getElementById('modalCloseBtn') as HTMLButtonElement,
    };
  }

  private bindEvents(): void {
    // Formulario de URL
    this.els.urlForm.addEventListener('submit', (e) => this.handleSubmit(e));

    // Botón Pegar
    this.els.pasteBtn.addEventListener('click', async () => {
      const text = await readFromClipboard();
      if (text) {
        this.els.urlInput.value = text;
        this.els.urlInput.focus();
        this.showToast('Enlace pegado desde el portapapeles.');
      } else {
        this.showToast('No se pudo acceder al portapapeles o está vacío.');
      }
    });

    // Botón Limpiar
    this.els.clearBtn.addEventListener('click', () => {
      this.resetApp();
    });

    // Botón Volver a empezar
    this.els.resetBtn?.addEventListener('click', () => {
      this.resetApp();
      const hero = document.getElementById('herramienta');
      hero?.scrollIntoView({ behavior: 'smooth' });
    });

    // Copiar ID del video
    this.els.copyIdBtn.addEventListener('click', async () => {
      if (!this.currentVideoId) return;
      const ok = await copyToClipboard(this.currentVideoId);
      if (ok) {
        analytics.trackEvent({ eventName: 'id_copied' });
        this.showToast('ID del video copiado.');
      } else {
        this.showToast('No se pudo copiar el ID.');
      }
    });

    // Compartir herramienta
    this.els.shareBtn?.addEventListener('click', async () => {
      const res = await sharePage({
        title: 'MiniaturaYT — Descargador de Miniaturas de YouTube',
        text: 'Descarga miniaturas de YouTube en HD verificadas y consulta sus dimensiones reales.',
        url: window.location.href,
      });
      if (res.copied) {
        this.showToast('Enlace de la herramienta copiado al portapapeles.');
      }
    });

    // Tema claro / oscuro
    this.els.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Modales legales e informativos
    document.querySelectorAll('[data-open-modal]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const type = (e.currentTarget as HTMLElement).getAttribute('data-open-modal');
        if (type) this.openInfoModal(type);
      });
    });

    this.els.modalCloseBtn?.addEventListener('click', () => this.closeInfoModal());
    this.els.modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === this.els.modalBackdrop) this.closeInfoModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.els.modalBackdrop?.getAttribute('data-open') === 'true') {
        this.closeInfoModal();
      }
    });
  }

  private resetApp(): void {
    this.els.urlInput.value = '';
    this.els.urlInput.focus();
    this.hideResults();
    this.hideStatus();
    this.currentVideoId = null;
  }

  private async handleSubmit(e?: Event): Promise<void> {
    if (e) e.preventDefault();
    const rawUrl = this.els.urlInput.value;
    const parsed = parseYouTubeUrl(rawUrl);

    if (!parsed.ok) {
      this.hideResults();
      const message = PARSE_ERROR_MESSAGES[parsed.reason] || 'La URL ingresada no es válida.';
      this.showStatus('error', message);
      return;
    }

    this.currentVideoId = parsed.id;
    const requestId = ++this.currentRequestId;
    analytics.trackEvent({ eventName: 'search_submitted' });

    this.els.submitBtn.disabled = true;
    this.hideResults();
    this.showStatus('loading', 'Consultando y verificando miniaturas en los servidores de YouTube...');

    try {
      const results = await resolveVideoThumbnails(parsed.id);

      // Si el usuario introdujo otra URL mientras cargaba, ignorar respuesta obsoleta
      if (requestId !== this.currentRequestId) return;

      const availableItems = results.filter((r) => r.status === 'available');

      if (availableItems.length === 0) {
        this.showStatus(
          'error',
          'No se encontraron miniaturas públicas accesibles para este video. Verifica que el ID sea correcto y que el video no sea privado o haya sido eliminado.'
        );
        this.els.submitBtn.disabled = false;
        return;
      }

      analytics.trackEvent({ eventName: 'thumbnails_resolved' });
      this.renderResults(parsed.id, results);
      this.hideStatus();
    } catch {
      if (requestId === this.currentRequestId) {
        this.showStatus(
          'error',
          'Ocurrió un error temporal al conectar con los servidores de YouTube. Inténtalo nuevamente.'
        );
      }
    } finally {
      if (requestId === this.currentRequestId) {
        this.els.submitBtn.disabled = false;
      }
    }
  }

  private renderResults(videoId: string, items: ThumbnailItem[]): void {
    this.els.videoIdDisplay.textContent = videoId;
    this.els.galleryGrid.innerHTML = '';

    // Encontrar la miniatura de mayor resolución disponible para destacarla
    const available = items.filter((i) => i.status === 'available');
    available.sort((a, b) => b.width - a.width);
    const maxItem = available[0] || null;

    // Verificar si existe alguna variante 4K nativa
    const has4K = items.some((i) => i.status === 'available' && i.width >= 3840);
    this.els.notice4k.style.display = has4K ? 'none' : 'flex';

    // Generar las tarjetas
    items.forEach((item) => {
      const isFeatured = maxItem !== null && item.variant.key === maxItem.variant.key && item.status === 'available';
      const card = this.createThumbnailCard(videoId, item, isFeatured);
      this.els.galleryGrid.appendChild(card);
    });

    this.els.resultsSection.hidden = false;

    // Scroll suave en pantallas pequeñas
    if (window.matchMedia('(max-width: 768px)').matches) {
      this.els.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private createThumbnailCard(videoId: string, item: ThumbnailItem, isFeatured: boolean): HTMLElement {
    const card = document.createElement('article');
    card.className = 'thumb-card';
    if (isFeatured) card.setAttribute('data-featured', 'true');
    card.setAttribute('data-status', item.status);

    const classification = classifyThumbnail(item);

    // Contenedor de previsualización
    const preview = document.createElement('div');
    preview.className = 'thumb-preview';

    if (item.status === 'available') {
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = `Miniatura ${item.variant.label} del video ${videoId}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = item.width;
      img.height = item.height;
      preview.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder-box';
      placeholder.innerHTML = `
        <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
        </svg>
        <span>Resolución no disponible en este video.</span>
      `;
      preview.appendChild(placeholder);
    }

    // Contenido e información
    const content = document.createElement('div');
    content.className = 'thumb-content';

    const header = document.createElement('div');
    header.className = 'thumb-header';

    const titleBox = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'thumb-title';
    title.textContent = item.variant.label;

    const dims = document.createElement('div');
    dims.className = 'thumb-dimensions';
    dims.textContent =
      item.status === 'available'
        ? `${item.width} × ${item.height} px · JPG · ${item.variant.key}.jpg`
        : `${item.variant.key}.jpg · Formato no disponible`;

    // Estado explícito de disponibilidad
    const statusTag = document.createElement('div');
    statusTag.className = 'thumb-status-indicator';
    statusTag.innerHTML =
      item.status === 'available'
        ? `<span class="status-dot status-dot--ok"></span> <span class="status-label">Disponible</span>`
        : `<span class="status-dot status-dot--no"></span> <span class="status-label">No disponible</span>`;

    titleBox.append(title, dims, statusTag);

    const badgesContainer = document.createElement('div');
    badgesContainer.className = 'badge-group';

    if (isFeatured) {
      const featuredBadge = document.createElement('span');
      featuredBadge.className = 'badge badge--max';
      featuredBadge.textContent = 'Máxima disponible';
      badgesContainer.appendChild(featuredBadge);
    }

    const badge = document.createElement('span');
    badge.className = `badge ${classification.badgeClass}`;
    badge.textContent = classification.label;
    badgesContainer.appendChild(badge);

    header.append(titleBox, badgesContainer);

    // Botones de acción
    const actions = document.createElement('div');
    actions.className = 'thumb-actions';

    if (item.status === 'available') {
      const dlBtn = document.createElement('button');
      dlBtn.type = 'button';
      dlBtn.className = 'btn btn--primary';
      dlBtn.innerHTML = `
        <svg aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Descargar
      `;
      dlBtn.addEventListener('click', async () => {
        analytics.trackEvent({ eventName: 'download_clicked', resolution: `${item.width}x${item.height}` });
        const res = await downloadThumbnail(item.url, videoId, item.width, item.height);
        this.showToast(res.message);
      });
      actions.appendChild(dlBtn);
    }

    const openLink = document.createElement('a');
    openLink.className = 'btn';
    openLink.href = item.url;
    openLink.target = '_blank';
    openLink.rel = 'noopener noreferrer';
    openLink.innerHTML = `
      <svg aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      Abrir original
    `;
    openLink.addEventListener('click', () => {
      analytics.trackEvent({ eventName: 'open_original_clicked' });
    });
    actions.appendChild(openLink);

    if (item.status === 'available') {
      const copyUrlBtn = document.createElement('button');
      copyUrlBtn.type = 'button';
      copyUrlBtn.className = 'btn';
      copyUrlBtn.innerHTML = `
        <svg aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copiar enlace
      `;
      copyUrlBtn.addEventListener('click', async () => {
        const ok = await copyToClipboard(item.url);
        this.showToast(ok ? 'Enlace de la miniatura copiado.' : 'No se pudo copiar el enlace.');
      });
      actions.appendChild(copyUrlBtn);
    }

    content.append(header, actions);
    card.append(preview, content);
    return card;
  }

  private showStatus(type: 'loading' | 'error', message: string): void {
    this.els.statusBanner.setAttribute('data-visible', 'true');
    this.els.statusBanner.className = `status-banner status-banner--${type}`;
    this.els.statusBanner.innerHTML = '';

    if (type === 'loading') {
      const spinner = document.createElement('span');
      spinner.className = 'spinner';
      spinner.setAttribute('aria-hidden', 'true');
      this.els.statusBanner.appendChild(spinner);
    } else {
      const icon = document.createElement('span');
      icon.innerHTML = `
        <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `;
      this.els.statusBanner.appendChild(icon);
    }

    const text = document.createElement('span');
    text.textContent = message;
    this.els.statusBanner.appendChild(text);
  }

  private hideStatus(): void {
    this.els.statusBanner.removeAttribute('data-visible');
    this.els.statusBanner.innerHTML = '';
  }

  private hideResults(): void {
    this.els.resultsSection.hidden = true;
    this.els.galleryGrid.innerHTML = '';
  }

  private showToast(msg: string): void {
    this.els.toastText.textContent = msg;
    this.els.toast.setAttribute('data-visible', 'true');
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.els.toast.removeAttribute('data-visible');
    }, 2800);
  }

  // Tema
  private initTheme(): void {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme: ThemeMode = saved || (systemPrefersDark ? 'dark' : 'light');
    this.applyTheme(theme);
  }

  private toggleTheme(): void {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }

  private applyTheme(theme: ThemeMode): void {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0c0d10' : '#f8f9fa');
    }
    if (this.els.themeToggle) {
      const labelText = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
      this.els.themeToggle.setAttribute('aria-label', labelText);
      this.els.themeToggle.setAttribute('title', labelText);
      this.els.themeToggle.innerHTML =
        theme === 'dark'
          ? `<svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg><span class="sr-only">${labelText}</span>`
          : `<svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span class="sr-only">${labelText}</span>`;
    }
  }

  // Modales legales e informativos
  private openInfoModal(type: string): void {
    if (type === 'privacy') {
      this.els.modalTitle.textContent = 'Política de Privacidad';
      this.els.modalBody.innerHTML = `
        <p><strong>1. Procesamiento local y sin registro</strong><br>
        MiniaturaYT funciona de forma 100% estática en el navegador del usuario. No recopilamos, transmitimos, almacenamos ni compartimos las URLs de YouTube que introduces ni tu historial de navegación.</p>
        <p><strong>2. Almacenamiento local</strong><br>
        Únicamente utilizamos <code>localStorage</code> para recordar tu preferencia estética (Modo Oscuro o Modo Claro). No se emplean cookies de rastreo ni tecnologías de seguimiento de terceros.</p>
        <p><strong>3. Conexiones a servidores de YouTube</strong><br>
        Las imágenes de miniaturas son solicitadas directamente por tu navegador a los servidores oficiales de imágenes públicas de YouTube (<code>i.ytimg.com</code>).</p>
      `;
    } else if (type === 'terms') {
      this.els.modalTitle.textContent = 'Términos de Uso y Descargo de Responsabilidad';
      this.els.modalBody.innerHTML = `
        <p><strong>1. Propiedad Intelectual y Marca</strong><br>
        YouTube es una marca registrada de Google LLC. MiniaturaYT es un proyecto independiente con fines educativos y de utilidad técnica, no afiliado ni respaldado por YouTube o Google LLC.</p>
        <p><strong>2. Derechos de Autor de los Contenidos</strong><br>
        Las imágenes de miniatura son propiedad exclusiva de sus respectivos creadores y titulares de derechos. Es responsabilidad exclusiva del usuario obtener los permisos correspondientes antes de utilizarlas en proyectos comerciales o de terceros.</p>
        <p><strong>3. Sin garantías de disponibilidad</strong><br>
        La disponibilidad de resoluciones específicas (como 1280×720) depende de si el creador subió el video en alta definición original.</p>
      `;
    } else if (type === 'about') {
      this.els.modalTitle.textContent = 'Sobre MiniaturaYT';
      this.els.modalBody.innerHTML = `
        <p><strong>MiniaturaYT</strong> es una utilidad web de código abierto y alto rendimiento concebida para simplificar el acceso a las imágenes de miniatura públicas de YouTube.</p>
        <p>Diseñada bajo principios de bajo consumo, alta velocidad, privacidad estricta y respeto por las dimensiones reales de cada archivo sin falsas promesas.</p>
      `;
    } else if (type === 'contact') {
      this.els.modalTitle.textContent = 'Contacto';
      this.els.modalBody.innerHTML = `
        <p>Para consultas técnicas, sugerencias o reportes sobre la herramienta, puedes abrir un issue o contribuir en el repositorio oficial de GitHub del proyecto.</p>
      `;
    }
    this.els.modalBackdrop.setAttribute('data-open', 'true');
  }

  private closeInfoModal(): void {
    this.els.modalBackdrop.removeAttribute('data-open');
  }

  private updateYear(): void {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
  }
}

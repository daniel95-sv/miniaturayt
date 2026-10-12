/**
 * Capa de analítica desacoplada y respetuosa con la privacidad (Privacy-First).
 * Solo mide eventos agregados sin transmitir URLs completas, tokens ni datos personales.
 */

export interface AnalyticsEvent {
  eventName: 'search_submitted' | 'thumbnails_resolved' | 'download_clicked' | 'open_original_clicked' | 'id_copied';
  category?: string;
  resolution?: string;
}

export interface AnalyticsProvider {
  trackEvent(event: AnalyticsEvent): void;
}

class PrivacyFirstAnalytics implements AnalyticsProvider {
  private enabled: boolean;

  constructor() {
    // Desactivado por defecto. Solo se activará si se configura explícitamente un proveedor conforme al RGPD/LODP
    this.enabled = false;
  }

  public trackEvent(event: AnalyticsEvent): void {
    if (!this.enabled) return;

    // Si en el futuro se añade Cloudflare Web Analytics, Plausible o Umami:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (typeof win.plausible === 'function') {
      win.plausible(event.eventName, { props: { resolution: event.resolution } });
    }
  }
}

export const analytics = new PrivacyFirstAnalytics();

# Registro de Cambios (Changelog) — MiniaturaYT

Todas las modificaciones notables de este proyecto se documentarán en este archivo siguiendo los lineamientos de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y versionado semántico [SemVer](https://semver.org/).

## [1.0.0] - 2026-10-12

### Añadido
- Arquitectura modular completa con TypeScript y Vite.
- Módulo `url-parser` para validación estricta de dominios de YouTube (`youtube.com`, `youtu.be`, Shorts, Embed, Live, Mobile).
- Módulo `thumbnail-resolver` con detección y filtrado de placeholders de error (120×90 px) en resoluciones superiores.
- Clasificador de resoluciones con protección contra falsos 4K y detección de HD 720p, SD 480p, HQ 360p.
- Módulo `downloader` con soporte para nombres de archivo estandarizados y gestión de limitaciones CORS.
- Interfaz moderna, accesible (WCAG 2.2 AA) y con soporte para tema claro/oscuro persistente.
- Sección educativa con tabla comparativa de resoluciones y preguntas frecuentes (FAQ) exhaustiva.
- Suite de pruebas unitarias e integración con Vitest (22 tests pasando).
- Archivos para despliegue en producción: Dockerfile multi-stage, `docker-compose.yml`, `nginx.conf`, y cabeceras de seguridad para Cloudflare Pages (`_headers`).
- Pipeline de integración continua con GitHub Actions (`ci.yml`).

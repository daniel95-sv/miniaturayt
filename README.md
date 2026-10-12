# MiniaturaYT — Descargador de Miniaturas de YouTube en HD

Aplicación web moderna, accesible, rápida y lista para producción diseñada para consultar, verificar y descargar miniaturas oficiales de YouTube en sus resoluciones originales disponibles (HD 720p, SD 480p, HQ 360p, MQ y Default).

---

## 🚀 Características Principales

- **Validación Estricta de Enlaces:** Acepta todos los formatos oficiales de YouTube (`watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`, `/live/`, `m.youtube.com`, `music.youtube.com`) y rechaza de forma tajante dominios lookalike o URLs fraudulentas.
- **Resoluciones Reales Verificadas:** Comprueba de forma asíncrona las dimensiones naturales de cada archivo. Si YouTube devuelve una imagen de marcador de posición (120×90 px) para variantes de alta resolución que no existen, la descarta automáticamente.
- **Sin Promesas Falsas de 4K:** Informa con total transparencia al usuario de que la CDN pública de YouTube almacena miniaturas con una resolución máxima estándar de 1280×720 (HD). No reescala ni inventa resoluciones inexistentes.
- **Descarga Directa y Fallback Seguro:** Genera nombres descriptivos estandarizados (`youtube-thumbnail_ID_WIDTHxHEIGHT.jpg`) y maneja con elegancia las restricciones de origen (CORS) permitiendo abrir la imagen original al instante.
- **Diseño Responsive y Accesible (WCAG 2.2 AA):** Experiencia mobile-first, foco de teclado visible, navegación por teclado completa, contrastes revisados y respeto por la preferencia del sistema de movimiento reducido (`prefers-reduced-motion`).
- **Tema Claro / Oscuro Dinámico:** Detección automática de preferencia del sistema y alternancia manual con persistencia en `localStorage`.
- **SEO y Datos Estructurados:** Metaetiquetas completas (Open Graph, Twitter Cards), `robots.txt`, `sitemap.xml`, y marcado JSON-LD para `WebApplication` y `FAQPage`.
- **100% Privado y Sin Costes Operativos:** Todo el procesamiento ocurre en el navegador del usuario. No requiere bases de datos, no requiere registros de usuario ni envía datos a servidores externos.

---

## 🛠️ Stack Tecnológico

- **Frontend Core:** TypeScript 5 (estricto), HTML5 semántico, CSS3 modular (CSS Grid, Flexbox, variables nativas).
- **Herramienta de Construcción:** Vite 6 (empaquetado ultrarrápido y ES Modules).
- **Pruebas Automatizadas:** Vitest 3 con entorno Happy-DOM.
- **Calidad de Código:** ESLint 9 (Flat Config).
- **Contenedores:** Docker (Dockerfile multi-stage con Nginx Alpine) y Docker Compose.
- **Hosting Objetivo:** Cloudflare Pages (incluye `_headers` con políticas de seguridad CSP y compresión).

---

## 📁 Arquitectura del Proyecto

```text
MiniaturasYT/
├── public/
│   ├── favicon.svg              # Favicon SVG escalable
│   ├── manifest.webmanifest     # Manifiesto PWA para instalación web
│   ├── og-image.svg             # Imagen para tarjetas en redes sociales
│   ├── robots.txt               # Directivas para rastreadores de búsqueda
│   ├── sitemap.xml              # Mapa del sitio canónico
│   ├── _headers                 # Políticas de seguridad (CSP) y caché para Cloudflare
│   └── _routes.json             # Reglas de enrutamiento estático
├── src/
│   ├── config/
│   │   └── constants.ts         # Lista blanca de dominios, variantes de imágenes y mensajes
│   ├── core/
│   │   ├── classifier.ts        # Clasificación estricta por dimensiones reales
│   │   ├── downloader.ts        # Gestor de descargas y nombres de archivo
│   │   ├── thumbnail-resolver.ts# Consulta en paralelo y descarte de placeholders
│   │   └── url-parser.ts        # Validador y extractor estricto de IDs de YouTube
│   ├── styles/
│   │   ├── base.css             # Variables de diseño, reset y accesibilidad
│   │   └── components.css       # Estilos modulares de la interfaz
│   ├── types/
│   │   └── index.ts             # Definición de tipos TypeScript compartidos
│   ├── utils/
│   │   ├── clipboard.ts         # Operaciones seguras con el portapapeles
│   │   └── share.ts             # Soporte para Web Share API
│   ├── app.ts                   # Controlador principal de la experiencia
│   └── main.ts                  # Punto de entrada de la aplicación
├── tests/
│   ├── integration/
│   │   └── thumbnail-resolver.test.ts # Pruebas de integración con mocks de imágenes
│   └── unit/
│       ├── classifier.test.ts   # Pruebas de clasificación de calidad
│       ├── downloader.test.ts   # Pruebas de nomenclatura y sanitización
│       └── url-parser.test.ts   # Pruebas exhaustivas de formatos y seguridad
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline de integración continua de GitHub Actions
├── Dockerfile                   # Construcción multi-stage (Node -> Nginx Alpine)
├── docker-compose.yml           # Despliegue local con un solo comando
├── nginx.conf                   # Configuración del servidor con cabeceras CSP y gzip
├── index.html                   # Documento principal semántico y con SEO JSON-LD
├── package.json                 # Dependencias y scripts de ejecución
├── tsconfig.json                # Configuración de TypeScript en modo estricto
├── vite.config.ts               # Configuración de compilación de Vite
└── vitest.config.ts             # Configuración de la suite de pruebas
```

---

## 📋 Requisitos Previos

- **Node.js:** Versión 18.x, 20.x, 22.x o superior.
- **NPM:** Versión 9.x o superior.
- *(Opcional)* **Docker y Docker Compose:** Si se desea ejecutar en contenedores.

---

## ⚡ Instalación y Uso Local

1. **Clonar o ingresar al directorio del proyecto:**
   ```bash
   cd MiniaturasYT
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:3000`.

---

## 🧪 Pruebas y Control de Calidad

Ejecuta los siguientes comandos para auditar el proyecto:

```bash
# Ejecutar suite de pruebas unitarias e integración con Vitest
npm run test

# Verificar tipos de TypeScript en modo estricto
npm run typecheck

# Ejecutar el linter de código
npm run lint

# Compilar para producción (genera la carpeta dist/)
npm run build

# Previsualizar el bundle de producción localmente
npm run preview
```

---

## 🐳 Despliegue con Docker

El proyecto incluye un `Dockerfile` multi-stage optimizado que compila la aplicación y la sirve con Nginx Alpine en una imagen de menos de 25 MB.

### Ejecutar con Docker Compose:
```bash
docker compose up --build -d
```
Accede a la aplicación en `http://localhost:8080`.

### O compilar y ejecutar manualmente con Docker CLI:
```bash
docker build -t miniaturayt:latest .
docker run -d -p 8080:80 --name miniaturayt-container miniaturayt:latest
```

---

## ☁️ Despliegue en Cloudflare Pages

1. Conecta tu repositorio de GitHub a Cloudflare Pages.
2. Configura los parámetros de compilación:
   - **Framework preset:** `None` o `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. El archivo `public/_headers` se copiará automáticamente a la raíz de producción garantizando las cabeceras HTTP de seguridad (Content Security Policy, X-Frame-Options, X-Content-Type-Options y Referrer-Policy).

---

## 📐 Resoluciones Oficiales y Variantes

| Nombre del archivo | Dimensiones estándar | Proporción | Descripción |
| ------------------ | -------------------- | ---------- | ----------- |
| `maxresdefault.jpg`| 1280 × 720 px        | 16:9       | Máxima resolución HD. Solo existe si el video original se subió en 720p o superior. |
| `sddefault.jpg`    | 640 × 480 px         | 4:3        | Calidad estándar (SD). |
| `hqdefault.jpg`    | 480 × 360 px         | 4:3        | Alta calidad básica. Disponible de forma universal en casi el 100% de videos. |
| `mqdefault.jpg`    | 320 × 180 px         | 16:9       | Calidad media panorámica para vistas móviles y recomendaciones. |
| `default.jpg`      | 120 × 90 px          | 4:3        | Miniatura básica pequeña para listados e historiales. |

---

## ⚠️ Limitaciones Técnicas Conocidas

1. **Inexistencia de 4K Nativo:** Los servidores públicos de imágenes de YouTube (`i.ytimg.com`) no generan archivos en 3840×2160. MiniaturaYT no inventa resoluciones falsas.
2. **Placeholder 120×90:** Cuando un creador sube un video de baja resolución, la petición a `maxresdefault.jpg` devuelve una imagen gris de 120×90 px. MiniaturaYT comprueba las dimensiones y marca la tarjeta como no disponible para evitar confusiones.
3. **Políticas CORS del Navegador:** Los servidores de imágenes de YouTube pueden no admitir solicitudes cruzadas de `fetch(..., { mode: 'cors' })` en ciertos entornos de navegador. MiniaturaYT maneja esta contingencia abriendo automáticamente la imagen original en una pestaña nueva con un clic para que el usuario pueda guardarla directamente.

---

## 🔒 Privacidad y Seguridad

- **Sin Rastreo:** No se cargan scripts analíticos de terceros ni herramientas de telemetría invasiva.
- **Sin Base de Datos:** Las URLs introducidas nunca se transmiten a servidores propios ni quedan registradas en bases de datos.
- **Content Security Policy (CSP):** Se restringen las conexiones salientes exclusivamente al origen local y a los servidores de imágenes oficiales de YouTube (`i.ytimg.com`).

---

## ⚖️ Descargo de Responsabilidad y Derechos de Autor

YouTube es una marca comercial registrada propiedad de Google LLC. **MiniaturaYT es una herramienta independiente y no cuenta con afiliación, patrocinio ni respaldo por parte de YouTube o Google LLC.**

Las imágenes de miniatura están protegidas por las leyes de propiedad intelectual y derechos de autor vigentes, y pertenecen a los creadores de los videos correspondientes. El usuario es responsable de contar con las licencias o permisos necesarios para su reutilización.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE).

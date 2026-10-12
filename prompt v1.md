# PROMPT MAESTRO DE IMPLEMENTACIÓN
## Descargador de Miniaturas de YouTube — Aplicación web lista para producción

## 1. Rol y objetivo

Actúa como un equipo multidisciplinario de desarrollo de software de nivel senior, integrado por:

- Arquitecto de software.
- Desarrollador frontend experto en JavaScript y TypeScript.
- Especialista en HTML5 y CSS3.
- Ingeniero de rendimiento web.
- Especialista SEO técnico y de contenidos.
- Especialista en accesibilidad WCAG.
- Ingeniero de seguridad.
- Especialista en infraestructura cloud y DevOps.
- Ingeniero de calidad y testing.
- Diseñador UX/UI especializado en herramientas web.
- Especialista en derechos de autor, privacidad y uso responsable de contenidos.

Tu misión es diseñar, implementar, probar y documentar una aplicación web completa denominada provisionalmente:

**YouTube Thumbnail Downloader**

Nombre alternativo configurable: **MiniaturaYT**.

La aplicación permitirá introducir la URL de un video de YouTube, identificar el video cuando sea compatible, consultar sus miniaturas disponibles, mostrarlas en una interfaz visual y permitir descargar las imágenes en sus resoluciones originales accesibles.

La aplicación debe estar preparada para producción real, no ser una demostración visual.

Debe cumplir estos objetivos:

- Interfaz atractiva y moderna.
- Excelente experiencia móvil y de escritorio.
- SEO técnico y semántico.
- Carga rápida.
- Seguridad.
- Accesibilidad.
- Código mantenible.
- Arquitectura escalable.
- Compatibilidad con GitHub y Cloudflare.
- Soporte opcional para Docker.
- Costes operativos mínimos.
- Sin base de datos en la primera versión.
- Sin cuentas de usuario obligatorias.
- Sin backend si no es necesario.

No inventes funcionalidades, resultados ni resoluciones disponibles.

---

# 2. Concepto del producto

El usuario introduce una URL de YouTube, por ejemplo:

https://www.youtube.com/watch?v=VIDEO_ID

También debe admitir formatos compatibles como:

- https://youtu.be/VIDEO_ID
- https://www.youtube.com/shorts/VIDEO_ID
- https://www.youtube.com/embed/VIDEO_ID
- https://www.youtube.com/live/VIDEO_ID

La aplicación debe validar la URL, extraer el identificador del video, determinar qué miniaturas están disponibles y mostrarlas en una galería.

El usuario podrá:

1. Pegar una URL.
2. Procesar el enlace.
3. Ver una vista previa de la miniatura.
4. Consultar las resoluciones disponibles.
5. Ver las dimensiones reales de cada imagen.
6. Descargar la miniatura elegida.
7. Copiar la URL directa de una miniatura cuando corresponda.
8. Abrir la imagen original en una pestaña nueva.
9. Copiar el identificador del video.
10. Introducir otra URL sin recargar la página.
11. Utilizar la herramienta desde dispositivos móviles.
12. Compartir la página de la herramienta.

La experiencia debe ser sencilla, clara y rápida.

---

# 3. Stack tecnológico

Utiliza tecnologías modernas, maduras y mantenibles.

## Frontend

Preferencia:

- HTML5 semántico.
- CSS3.
- TypeScript.
- Vite.
- JavaScript moderno.
- ES Modules.
- CSS Grid y Flexbox.
- Responsive Design.
- APIs nativas del navegador.

Utilizar TypeScript con configuración estricta cuando resulte conveniente.

No incorporar frameworks pesados sin una justificación técnica clara.

Para la primera versión, Vite + TypeScript + HTML semántico + CSS modular es una opción preferente.

Si se elige React, Vue u otro framework, justificar su necesidad y mantener una arquitectura sencilla.

## Librerías opcionales

Utilizar únicamente dependencias que aporten valor real.

- Zod para validación de datos, si resulta conveniente.
- Lucide para iconografía.
- Vitest para pruebas unitarias.
- Playwright para pruebas de extremo a extremo.
- ESLint y Prettier para calidad del código.

No incorporar librerías de descarga o manipulación de imágenes innecesarias.

No utilizar paquetes abandonados o con vulnerabilidades conocidas.

---

# 4. Arquitectura del proyecto

Organizar el código por responsabilidades.

Estructura sugerida:

```text
youtube-thumbnail-downloader/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── manifest.webmanifest
│   ├── og-image.png
│   └── icons/
│
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── UrlForm/
│   │   ├── ThumbnailGallery/
│   │   ├── ThumbnailCard/
│   │   ├── DownloadButton/
│   │   ├── FAQ/
│   │   ├── Toast/
│   │   └── UI/
│   │
│   ├── core/
│   │   ├── url-parser/
│   │   ├── thumbnail-resolver/
│   │   ├── image-validation/
│   │   └── download/
│   │
│   ├── services/
│   │   └── youtube-thumbnails/
│   │
│   ├── utils/
│   │   ├── clipboard.ts
│   │   ├── formatting.ts
│   │   └── errors.ts
│   │
│   ├── config/
│   ├── data/
│   ├── styles/
│   ├── types/
│   ├── app.ts
│   └── main.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│
├── .github/
│   └── workflows/
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── .dockerignore
├── .env.example
├── README.md
├── SECURITY.md
├── CONTRIBUTING.md
└── LICENSE
```

La estructura puede modificarse si una alternativa es técnicamente superior.

Evita la sobreingeniería. Una aplicación pequeña debe continuar siendo fácil de mantener.

---

# 5. Funcionamiento del extractor de URL

Implementar un módulo independiente que procese las URL de YouTube.

Debe:

- Aceptar los formatos oficialmente reconocidos que se decida soportar.
- Extraer el ID del video.
- Validar el dominio.
- Validar la estructura de la URL.
- Rechazar protocolos distintos de HTTPS.
- Rechazar dominios que solamente imiten a YouTube.
- Rechazar IDs vacíos o malformados.
- Gestionar parámetros adicionales.
- Mostrar mensajes de error comprensibles.
- Evitar falsos positivos.

No aceptar indiscriminadamente cualquier URL que contenga la palabra `youtube.com`.

La validación debe comprobar el hostname exacto y los patrones admitidos.

Ejemplos que deben rechazarse:

```text
https://youtube.com.example.org/watch?v=123
https://example.com/?url=youtube.com
javascript:alert(1)
data:text/html,...
```

Los ejemplos anteriores son entradas de prueba, no URLs que deban procesarse.

No permitir que el usuario proporcione un hostname arbitrario para buscar imágenes.

---

# 6. Resolución de miniaturas

Implementar un servicio independiente que construya las posibles URL de miniaturas a partir del ID validado.

Evaluar las variantes conocidas de YouTube, incluyendo:

- `maxresdefault.jpg`
- `sddefault.jpg`
- `hqdefault.jpg`
- `mqdefault.jpg`
- `default.jpg`

También se pueden evaluar variantes adicionales, como miniaturas de mayor resolución disponibles para determinados videos, siempre que exista una forma fiable de comprobarlas.

Importante:

**No asumir que todas las resoluciones existen para todos los videos.**

No considerar una respuesta HTTP aparentemente exitosa como prueba suficiente de que la imagen es válida.

Una miniatura puede no existir, devolver una imagen de sustitución o no estar disponible por restricciones del servicio.

El servicio debe comprobar la carga real de cada imagen.

Cuando resulte técnicamente posible, verificar:

- que la respuesta sea válida;
- que el recurso sea una imagen;
- sus dimensiones naturales;
- que no sea una imagen de error conocida;
- que la imagen pueda visualizarse correctamente.

Si no se puede determinar con certeza una condición, indicar que no se pudo verificar en lugar de inventar un resultado.

---

# 7. Resoluciones y etiquetas

Mostrar las miniaturas en tarjetas independientes.

Las etiquetas iniciales pueden incluir:

| Etiqueta | Comportamiento |
|---|---|
| Máxima disponible | Mostrar la mayor variante válida encontrada |
| HD | Identificar imágenes de alta resolución según sus dimensiones |
| Estándar | Mostrar una imagen de resolución estándar |
| Baja resolución | Mostrar variantes pequeñas |
| Original disponible | Indicar que se muestra el recurso original obtenido |

No etiquetar automáticamente una imagen como 4K.

Una imagen de 1280 × 720 no es 4K nativa.

Cuando corresponda, identificar 4K como una imagen de al menos 3840 píxeles de ancho y aproximadamente 2160 píxeles de alto.

La etiqueta HD debe basarse en dimensiones verificadas y no únicamente en el nombre del archivo.

Si no existe una miniatura 4K, mostrar:

> No se encontró una miniatura 4K nativa disponible para este video.

Si existe una imagen de mayor resolución que las demás, seleccionarla como recomendada sin exagerar su calidad.

---

# 8. Vista previa y galería

Crear una galería moderna de miniaturas.

Cada tarjeta debe mostrar:

- Imagen.
- Etiqueta de resolución.
- Dimensiones reales.
- Formato de imagen cuando se pueda comprobar.
- Estado de disponibilidad.
- Botón de descarga.
- Botón para abrir la imagen original.
- Botón para copiar el enlace directo.

La imagen recomendada debe tener mayor protagonismo visual.

Incluir estados de carga, error y éxito.

No mostrar tarjetas de imágenes inexistentes como si estuvieran disponibles.

La interfaz debe distinguir claramente entre:

- Comprobando disponibilidad.
- Disponible.
- No disponible.
- Error temporal.
- No se pudo verificar.

---

# 9. Descarga de imágenes

Implementar una descarga funcional de las imágenes disponibles.

Requisitos:

- Utilizar la URL original validada.
- Respetar las restricciones técnicas del navegador.
- No asumir que el atributo `download` funcionará en todos los dominios externos.
- Gestionar las limitaciones CORS.
- Evitar descargas de archivos que no sean imágenes válidas.
- Evitar crear objetos Blob innecesarios.
- Revocar las URL de objetos cuando corresponda.
- Mostrar mensajes claros cuando una descarga no pueda realizarse directamente.
- Ofrecer abrir la imagen original como alternativa.

Si el navegador no permite descargar directamente un recurso de otro dominio, no simular una descarga exitosa.

No utilizar un proxy de imágenes como solución automática sin analizar su seguridad, los términos aplicables y el coste operativo.

Los nombres de archivo deben ser descriptivos.

Ejemplo:

```text
youtube-thumbnail_VIDEO_ID_1280x720.jpg
```

Usar las dimensiones reales cuando estén verificadas.

No prometer una resolución superior a la original.

---

# 10. API y fuentes de datos

La primera versión debe priorizar la obtención de miniaturas mediante los recursos públicos accesibles del servicio, siempre que su uso sea compatible con los términos aplicables.

No utilizar scraping de páginas completas si no es necesario.

No descargar videos.

No extraer audio.

No utilizar mecanismos destinados a eludir controles de acceso.

Si se decide incorporar YouTube Data API v3 para obtener metadatos o mejorar la identificación del video, hacerlo de manera opcional y documentada.

En ese caso:

- Configurar las credenciales de forma segura.
- No exponer claves privadas en el frontend.
- Utilizar un backend o función serverless cuando corresponda.
- Respetar cuotas y límites.
- Gestionar errores de API.
- No solicitar permisos innecesarios.
- Documentar los requisitos de configuración.

No hacer que la herramienta dependa de una API de pago o de una base de datos sin una necesidad real.

---

# 11. Restricciones y compatibilidad con YouTube

La implementación debe respetar los términos de servicio aplicables y los derechos de terceros.

No afirmar que la aplicación está afiliada a YouTube ni que es un producto oficial.

No descargar videos completos ni extraer contenido audiovisual.

La función principal se limita a mostrar y facilitar el acceso a las imágenes de miniatura disponibles.

Añadir una nota informativa:

> YouTube es una marca de Google LLC. Esta herramienta es independiente y no está afiliada, patrocinada ni respaldada por YouTube o Google. Las miniaturas pueden estar protegidas por derechos de autor. El usuario es responsable de contar con los permisos necesarios para su reutilización.

No presentar esta nota como sustituto de una revisión jurídica cuando el proyecto se comercialice.

---

# 12. Interfaz principal

Crear una página principal con las siguientes secciones.

## Header

Debe incluir:

- Logo.
- Nombre del producto.
- Enlace a la herramienta.
- Cómo funciona.
- Preguntas frecuentes.
- Contacto o información del proyecto, si corresponde.

En móviles, utilizar un menú accesible y sencillo.

## Hero

Título principal sugerido:

**Descargador de Miniaturas de YouTube en HD**

Subtítulo:

> Obtén las miniaturas disponibles de un video de YouTube, consulta sus dimensiones y descarga la imagen que necesitas en unos pocos pasos.

Campo principal:

- Entrada de URL.
- Botón Pegar.
- Botón Obtener miniaturas.
- Botón Limpiar.

Incluir un ejemplo de URL y una explicación breve.

Evitar publicidad invasiva, ventanas emergentes innecesarias y diseños que dificulten el uso de la herramienta.

---

# 13. Flujo de usuario

El flujo principal debe ser:

```text
Abrir la herramienta
        ↓
Pegar la URL de YouTube
        ↓
Validar la URL
        ↓
Extraer el ID del video
        ↓
Consultar variantes de miniatura
        ↓
Comprobar las imágenes
        ↓
Mostrar las resoluciones disponibles
        ↓
Seleccionar una miniatura
        ↓
Descargar o abrir la imagen original
```

Todo el flujo debe funcionar sin recargar la página.

El usuario debe poder repetir el proceso con otro video de forma inmediata.

---

# 14. Diseño visual

Crear una identidad visual original, moderna y profesional.

Características:

- Minimalista.
- Limpia.
- Confiable.
- Rápida.
- Orientada a herramientas.
- Fácil de entender.
- Optimizada para conversiones de uso, no para publicidad engañosa.

Utilizar:

- Tipografía legible.
- Espaciado consistente.
- Bordes suaves.
- Sombras discretas.
- Iconos coherentes.
- Botones con estados claros.
- Jerarquía visual definida.
- Colores con contraste suficiente.

No copiar el diseño completo de otras herramientas.

No abusar de gradientes, animaciones o efectos visuales.

Utilizar una paleta configurable mediante CSS Variables.

---

# 15. Responsive Design

Diseñar mobile-first.

Comprobar el funcionamiento en:

- 320 px.
- 375 px.
- 390 px.
- 430 px.
- Tablet.
- Laptop.
- Desktop.
- Pantallas grandes.

En móviles:

- Campo de URL cómodo.
- Botones suficientemente grandes.
- Tarjetas en una columna o cuadrícula adaptativa.
- Imágenes sin recortes accidentales.
- Textos legibles.
- Navegación sencilla.
- Sin desplazamiento horizontal involuntario.

La descarga debe funcionar tanto en dispositivos móviles como en escritorio dentro de las limitaciones de cada navegador.

---

# 16. Estados de interfaz

Implementar estados explícitos:

- Inicial.
- URL introducida.
- Validando.
- Buscando miniaturas.
- Resultados disponibles.
- Sin miniaturas válidas.
- URL inválida.
- Error temporal.
- Descarga iniciada cuando pueda confirmarse.
- Copia realizada.
- Error de descarga.

Evitar dobles envíos y operaciones duplicadas.

Deshabilitar el botón de búsqueda durante operaciones incompatibles.

Mostrar un indicador de carga accesible.

No afirmar que una descarga terminó si el navegador no permite verificarlo.

---

# 17. Accesibilidad

Objetivo: WCAG 2.2 AA.

Implementar:

- HTML semántico.
- Navegación por teclado.
- Foco visible.
- Etiquetas para los campos.
- Contraste suficiente.
- Textos alternativos.
- Mensajes de error accesibles.
- Estados anunciados mediante regiones adecuadas de accesibilidad.
- Botones con nombres claros.
- Orden lógico de navegación.
- Respeto por `prefers-reduced-motion`.

No utilizar el color como único indicador de estado.

No utilizar elementos visuales que dependan exclusivamente de hover.

Los controles deben funcionar en pantallas táctiles.

---

# 18. SEO técnico

Optimizar la página principal y las páginas educativas complementarias.

Implementar:

- Título único.
- Meta description.
- URL canónica.
- Idioma español.
- Viewport.
- Open Graph.
- Twitter/X Cards.
- Favicon.
- Sitemap XML.
- Robots.txt.
- Enlaces internos.
- HTML semántico.
- Contenido rastreable.
- Imágenes con dimensiones declaradas cuando corresponda.

Evitar generar una URL indexable por cada ID de video introducido por el usuario.

Las consultas con parámetros no deben crear millones de páginas duplicadas.

La metadata debe corresponder al contenido real de cada página.

---

# 19. Estrategia de contenido SEO

Crear contenido útil y original que explique:

- Qué es una miniatura de YouTube.
- Cómo descargar una miniatura.
- Qué resoluciones pueden estar disponibles.
- Diferencia entre HD y 4K.
- Por qué algunas miniaturas no están disponibles en máxima resolución.
- Cómo guardar una imagen desde el navegador.
- Qué formatos de URL se admiten.
- Cómo utilizar una miniatura respetando los derechos de autor.
- Limitaciones técnicas de las miniaturas.
- Preguntas frecuentes.

No prometer que todos los videos tienen miniaturas 4K.

No utilizar keyword stuffing.

No publicar contenido generado en masa sin valor informativo.

No crear páginas SEO casi idénticas únicamente para posicionar variaciones de palabras clave.

---

# 20. Datos estructurados

Implementar JSON-LD cuando corresponda.

Evaluar:

- WebApplication.
- WebSite.
- WebPage.
- BreadcrumbList.
- Organization, si existe una organización real.
- FAQPage únicamente cuando sea elegible y represente contenido visible que cumpla las directrices aplicables.

No utilizar datos estructurados para inventar valoraciones, precios, disponibilidad o características.

Validar los datos estructurados con herramientas apropiadas.

No prometer resultados enriquecidos en Google, ya que su aparición depende de los sistemas y políticas del buscador.

---

# 21. Páginas complementarias

Preparar una arquitectura de páginas útiles:

```text
/
 /como-descargar-miniaturas-youtube
 /miniaturas-youtube-hd
 /resoluciones-miniaturas-youtube
 /preguntas-frecuentes
 /sobre-nosotros
 /contacto
 /politica-de-privacidad
 /terminos-de-uso
```

Crear únicamente las páginas que contengan contenido real, diferenciado y útil.

No generar páginas vacías o duplicadas.

Si alguna página todavía no existe, no incluir enlaces que conduzcan a rutas rotas.

---

# 22. Rendimiento

Optimizar:

- JavaScript.
- CSS.
- Fuentes.
- Carga de imágenes.
- Tamaño de los bundles.
- Dependencias.
- Renderizado.
- Interacciones.

Objetivos orientativos de Lighthouse:

- Performance: 95 o superior cuando sea razonablemente posible.
- Accessibility: 95 o superior.
- Best Practices: 95 o superior.
- SEO: 95 o superior.

No tratar las puntuaciones como garantías.

Priorizar los Core Web Vitals:

- LCP.
- INP.
- CLS.

No cargar las miniaturas de todas las variantes antes de que el usuario introduzca una URL.

Evitar que una URL inválida dispare múltiples peticiones.

Implementar límites razonables de concurrencia para comprobar imágenes.

Cancelar o ignorar las peticiones obsoletas cuando el usuario introduzca una nueva URL.

No permitir que una consulta lenta sobrescriba resultados más recientes.

---

# 23. Seguridad

Aplicar buenas prácticas de seguridad desde el inicio.

Implementar:

- Validación estricta de URLs.
- Lista permitida de dominios.
- Prevención de XSS.
- Evitar `eval()`.
- Evitar `innerHTML` con contenido no confiable.
- Content Security Policy.
- X-Content-Type-Options.
- Referrer-Policy.
- Permissions-Policy.
- HTTPS.
- Dependencias auditadas.
- Tratamiento seguro de errores.
- Protección de secretos.
- Configuración segura del servidor.

Si se incorpora backend:

- Validar nuevamente las entradas.
- Evitar SSRF.
- No permitir que el usuario haga que el servidor solicite cualquier URL.
- Limitar tamaño de respuestas.
- Limitar tiempo de espera.
- Aplicar rate limiting.
- Restringir los hosts accesibles.
- Evitar redirecciones hacia destinos no autorizados.
- No crear un proxy abierto.

La Content Security Policy debe ajustarse a los dominios realmente utilizados por la aplicación.

No incluir políticas que rompan accidentalmente las miniaturas o las funcionalidades esenciales.

---

# 24. Privacidad

La primera versión debe funcionar sin cuentas ni base de datos.

No guardar el historial de URLs.

No almacenar miniaturas de forma persistente.

No transmitir las URLs introducidas a servicios analíticos.

No recopilar datos financieros ni información personal innecesaria.

Si se utilizan servicios de analítica, documentarlos y evaluar el consentimiento aplicable.

Evitar cookies no esenciales.

Crear una política de privacidad coherente con el comportamiento real de la aplicación.

No afirmar que no se procesa ningún dato si existen registros técnicos del servidor o de proveedores externos.

---

# 25. Firebase y base de datos

Firebase no es necesario para la primera versión.

No incorporar:

- Firestore.
- Firebase Authentication.
- Firebase Storage.
- Bases de datos.
- Cuentas.
- Historiales persistentes.

salvo que aparezca una necesidad real.

Si en el futuro se requiere almacenamiento de preferencias o cuentas, evaluar Firebase, Supabase u otras alternativas.

La arquitectura inicial debe permitir una ampliación futura sin obligar a reescribir el extractor de URL ni la galería.

---

# 26. Cloudflare

Preparar el proyecto para desplegarse en Cloudflare Pages.

La primera versión debe ser una aplicación estática cuando resulte suficiente.

Aprovechar:

- HTTPS.
- CDN.
- Caché de recursos estáticos.
- Compresión.
- Distribución global.
- Cabeceras de seguridad.

No añadir Workers únicamente por moda.

Si se necesita un backend, evaluar Cloudflare Workers y definir claramente su función.

No implementar un proxy general de imágenes.

Documentar la configuración de producción y los posibles límites del servicio.

---

# 27. GitHub y CI/CD

Preparar un repositorio profesional.

Crear:

- README.md.
- CONTRIBUTING.md.
- SECURITY.md.
- CHANGELOG.md.
- LICENSE.
- `.gitignore`.
- `.env.example`.
- `.github/workflows/`.

Configurar GitHub Actions para ejecutar:

```text
Push o Pull Request
        ↓
Instalar dependencias
        ↓
Lint
        ↓
Type Check
        ↓
Pruebas unitarias
        ↓
Pruebas de integración
        ↓
Build de producción
        ↓
Auditoría de dependencias
        ↓
Deploy si todas las comprobaciones pasan
```

No desplegar una versión que no supere las comprobaciones críticas.

Utilizar permisos mínimos en los workflows y proteger los secretos del repositorio.

---

# 28. Docker

Proporcionar soporte opcional para Docker.

Crear:

- Dockerfile multi-stage.
- docker-compose.yml.
- nginx.conf.
- .dockerignore.

Etapas sugeridas:

```text
Node.js
    ↓
Instalación de dependencias
    ↓
Build de Vite
    ↓
Servidor estático Nginx
```

La imagen final debe ser pequeña y no contener herramientas de desarrollo innecesarias.

Configurar:

- Servidor en primer plano.
- Manejo correcto de señales.
- Cabeceras de seguridad.
- Compresión.
- Caché de archivos estáticos.
- Fallback SPA solo si se necesita.
- Usuario sin privilegios cuando resulte viable.

Documentar:

```bash
docker build -t youtube-thumbnail-downloader .
docker compose up --build
```

Verificar que los comandos realmente funcionan antes de entregarlos.

Docker debe ser una alternativa de despliegue, no un requisito para utilizar la aplicación.

---

# 29. Variables de entorno

Crear `.env.example` únicamente si la aplicación necesita configuración por entorno.

No incluir secretos reales.

No subir `.env` a GitHub.

No colocar credenciales privadas en variables públicas de Vite.

Recordar que las variables expuestas al frontend pueden ser visibles para cualquier visitante.

Si se incorpora YouTube Data API, proteger las credenciales mediante una arquitectura apropiada.

---

# 30. Descarga y compatibilidad del navegador

Probar las descargas en los navegadores más utilizados.

Considerar:

- Chrome.
- Firefox.
- Edge.
- Safari.
- Navegadores móviles.

Distinguir entre abrir una imagen, copiar su URL y descargarla.

Si el origen no permite una descarga directa desde el navegador, ofrecer una alternativa segura y explicar el procedimiento.

No utilizar extensiones, automatizaciones o mecanismos de evasión como requisito.

No indicar que la imagen se descargó si solamente se abrió en una pestaña.

---

# 31. Portapapeles y compartir

Implementar:

- Copiar URL de la miniatura.
- Copiar ID del video.
- Copiar enlace de la herramienta.
- Compartir la página mediante Web Share API cuando esté disponible.

Incluir alternativas para navegadores incompatibles.

Solicitar las acciones del portapapeles mediante una interacción real del usuario.

Mostrar confirmaciones accesibles y comprensibles.

No copiar contenido automáticamente sin que el usuario lo solicite.

---

# 32. Gestión de errores

Crear un sistema centralizado de errores.

Mensajes posibles:

- Introduce una URL de YouTube válida.
- El formato de la URL no es compatible.
- No se pudo identificar el video.
- No se encontraron miniaturas verificables.
- La miniatura de máxima resolución no está disponible.
- El navegador no permite descargar directamente esta imagen.
- No se pudo copiar el enlace.
- Se produjo un error temporal. Inténtalo nuevamente.

No mostrar stack traces ni información interna.

No clasificar un video como inexistente basándose únicamente en el fallo de una miniatura.

Una miniatura no disponible no demuestra que el video sea inexistente.

---

# 33. Acciones de la interfaz

Todos los botones deben funcionar.

Implementar:

- Pegar URL.
- Procesar URL.
- Limpiar campo.
- Descargar imagen.
- Abrir imagen original.
- Copiar enlace.
- Copiar ID.
- Cambiar tema.
- Abrir y cerrar FAQ.
- Volver a empezar.

No crear botones decorativos que no hagan nada.

No utilizar mensajes falsos de éxito.

---

# 34. Modo oscuro

Implementar:

- Modo claro.
- Modo oscuro.
- Preferencia del sistema operativo.

Permitir guardar la preferencia localmente.

Evitar parpadeos durante la carga inicial.

Garantizar contraste adecuado en ambos temas.

Respetar las preferencias de accesibilidad del usuario.

---

# 35. PWA y funcionamiento sin conexión

Evaluar soporte PWA.

La aplicación puede permitir que su interfaz se cargue sin conexión cuando los recursos estén disponibles.

Sin embargo, no prometer que podrá consultar miniaturas nuevas sin conexión.

Los recursos remotos pueden dejar de estar disponibles y no deben almacenarse automáticamente de forma persistente sin considerar privacidad, licencias y consumo de almacenamiento.

Implementar el service worker únicamente si aporta un beneficio real.

---

# 36. Internacionalización

La versión inicial debe estar en español.

Preparar una estructura que permita agregar posteriormente:

- Inglés.
- Portugués.
- Francés.

Separar los textos de interfaz cuando resulte conveniente.

Utilizar correctamente los atributos `lang` y las convenciones lingüísticas.

No crear páginas traducidas automáticas de baja calidad.

---

# 37. Diseño de la página principal

Orden recomendado:

1. Header.
2. Hero con formulario de URL.
3. Instrucciones breves.
4. Galería de miniaturas después de procesar el enlace.
5. Explicación de las resoluciones.
6. Guía de uso.
7. Información sobre limitaciones.
8. FAQ.
9. Disclaimer de derechos de autor.
10. Footer.

La página debe priorizar la herramienta sobre el contenido secundario.

No mostrar resultados ficticios al abrirla por primera vez.

Puede utilizarse una ilustración de ejemplo claramente identificada, siempre que no parezca un resultado real de una URL procesada.

---

# 38. FAQ

Crear preguntas frecuentes accesibles:

- ¿Cómo descargar una miniatura de YouTube?
- ¿Puedo descargar miniaturas en HD?
- ¿Todas las miniaturas están disponibles en 4K?
- ¿Por qué no aparece la opción de máxima resolución?
- ¿La herramienta descarga videos?
- ¿Necesito instalar un programa?
- ¿Funciona en teléfonos móviles?
- ¿La herramienta guarda las URLs que introduzco?
- ¿Puedo utilizar las miniaturas comercialmente?
- ¿Qué hago si la descarga directa no funciona?
- ¿Qué formatos de URL acepta la herramienta?
- ¿Por qué una miniatura puede estar disponible en unas resoluciones y no en otras?

Las respuestas deben ser correctas y comprensibles.

No afirmar que una miniatura puede utilizarse comercialmente sin autorización.

---

# 39. Testing unitario

Implementar pruebas para:

- Extracción del ID.
- URL de YouTube normal.
- URL corta.
- Shorts.
- Embed.
- Live.
- Parámetros adicionales.
- URLs inválidas.
- Dominios falsos.
- Protocolos no permitidos.
- ID malformado.
- Resoluciones posibles.
- Clasificación por dimensiones.
- Errores de carga.
- Estados de disponibilidad.
- Nombres de archivo.
- Construcción de enlaces.
- Casos extremos.

Probar que una URL maliciosa nunca pueda generar una petición a un dominio arbitrario.

---

# 40. Testing de integración

Comprobar:

1. El usuario introduce una URL.
2. El sistema la valida.
3. Se extrae el ID.
4. Se consultan las variantes admitidas.
5. Se verifican las imágenes.
6. Se muestran las imágenes disponibles.
7. Se identifican las dimensiones.
8. El usuario abre o descarga una imagen.
9. Puede copiar su enlace.
10. Puede introducir otro video.

Probar las rutas de error y las limitaciones de red.

---

# 41. Pruebas E2E

Utilizar Playwright.

Escenarios:

- Página inicial.
- URL válida.
- URL inválida.
- Dominio falso.
- Video con distintas resoluciones.
- Miniatura máxima no disponible.
- Error de red.
- Cambio rápido de URL.
- Copiar enlace.
- Descargar cuando el navegador lo permita.
- Navegación por teclado.
- Modo oscuro.
- Responsive.
- Accesibilidad básica.
- Recarga de la aplicación.

Las pruebas no deben depender exclusivamente de que YouTube mantenga indefinidamente un recurso de prueba concreto.

Utilizar mocks controlados para probar los casos límite y realizar comprobaciones reales adicionales cuando sea apropiado.

---

# 42. Testing de seguridad

Comprobar:

- XSS.
- Manipulación de URL.
- Dominios falsos.
- Inyección de parámetros.
- Redirecciones.
- Contenido inesperado.
- Dependencias vulnerables.
- Políticas CSP.
- Exposición de secretos.
- Posible SSRF si se incorpora backend.

No implementar un endpoint que descargue recursos de cualquier dominio introducido por el usuario.

---

# 43. Auditoría de producción

Antes de considerar el proyecto terminado:

- Ejecutar lint.
- Ejecutar TypeScript.
- Ejecutar tests.
- Ejecutar build.
- Ejecutar auditoría de dependencias.
- Revisar accesibilidad.
- Revisar SEO.
- Revisar cabeceras.
- Revisar Docker.
- Revisar CI/CD.
- Revisar descargas reales.
- Revisar limitaciones CORS.
- Revisar comportamiento móvil.

Documentar los problemas pendientes y no afirmar que se ha superado una prueba que no se ha ejecutado.

---

# 44. Analítica opcional

No incluir seguimiento invasivo por defecto.

Si se requiere analítica, crear una capa desacoplada para poder utilizar servicios como:

- Cloudflare Web Analytics.
- Plausible.
- Umami.

No enviar las URLs completas introducidas por los usuarios a los sistemas analíticos.

Medir eventos agregados como:

- Uso de la herramienta.
- Procesamiento correcto.
- Errores generales.
- Selección de resoluciones.

Evaluar consentimiento, privacidad y legislación aplicable antes de activar cualquier servicio.

---

# 45. Escalabilidad

La arquitectura debe permitir futuras ampliaciones:

- Soporte para múltiples idiomas.
- Nuevas variantes de miniaturas.
- Verificación mejorada de dimensiones.
- Información pública del video, cuando se permita.
- Herramientas educativas para creadores.
- Historial local opcional.
- API propia limitada.
- Integraciones adicionales.

No implementar estas funciones por adelantado si no son necesarias.

Mantener el extractor de URL, la resolución de miniaturas, la validación y la descarga desacoplados de la interfaz.

---

# 46. Rendimiento y límites

Evitar peticiones ilimitadas.

Implementar:

- Número máximo de variantes consultadas por video.
- Concurrencia controlada.
- Tiempo de espera razonable.
- Cancelación de operaciones obsoletas.
- Gestión de errores.
- Prevención de solicitudes duplicadas.
- Carga diferida cuando resulte conveniente.

No cargar ni almacenar todas las imágenes a máxima resolución innecesariamente.

No descargar la imagen completa en segundo plano antes de que el usuario lo solicite.

---

# 47. Documentación

Crear un README completo que incluya:

- Descripción.
- Características.
- Stack tecnológico.
- Arquitectura.
- Requisitos.
- Instalación.
- Desarrollo local.
- Build.
- Tests.
- Docker.
- Despliegue en Cloudflare.
- Configuración de GitHub.
- Variables de entorno.
- Resoluciones admitidas.
- Limitaciones técnicas.
- Privacidad.
- Seguridad.
- Derechos de autor.
- Licencia.
- Solución de problemas.

Comandos mínimos esperados:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
```

Todos los comandos documentados deben corresponder a scripts reales.

---

# 48. Configuración SEO y archivos públicos

Generar correctamente:

- `robots.txt`.
- `sitemap.xml`.
- `manifest.webmanifest`, si se implementa PWA.
- `favicon.svg`.
- Iconos compatibles.
- Imagen Open Graph.
- Metadata.
- JSON-LD.

Definir la URL canónica real mediante configuración.

No inventar un dominio de producción.

No indexar rutas de pruebas, errores o URLs generadas a partir de cada video.

---

# 49. Licencias y cumplimiento

Revisar:

- Licencias de las dependencias.
- Derechos de autor de los recursos visuales.
- Términos aplicables a los recursos de YouTube.
- Política de privacidad.
- Términos de uso.
- Requisitos de los proveedores de hosting.

No copiar marcas, logotipos o elementos protegidos de terceros de una forma que sugiera afiliación oficial.

No utilizar la marca YouTube para afirmar que la herramienta es oficial.

---

# 50. Entregables

Al terminar, entregar:

1. Código completo y funcional.
2. Estructura del proyecto.
3. Interfaz responsive.
4. Extractor y validador de URLs.
5. Resolución de miniaturas.
6. Verificación de disponibilidad.
7. Detección de dimensiones reales.
8. Descarga y apertura de imágenes.
9. Mensajes de error.
10. SEO técnico.
11. Contenido educativo y FAQ.
12. Datos estructurados válidos.
13. Configuración de seguridad.
14. Pruebas unitarias.
15. Pruebas de integración.
16. Pruebas E2E.
17. Docker opcional.
18. GitHub Actions.
19. Configuración de Cloudflare.
20. README profesional.
21. Auditoría de producción.
22. Lista de limitaciones conocidas.
23. Mejoras futuras recomendadas.

---

# 51. Criterios de aceptación

La aplicación solamente podrá considerarse terminada si cumple estas condiciones:

- La URL se valida correctamente.
- Los dominios falsos son rechazados.
- El ID se extrae correctamente.
- Se consultan únicamente variantes admitidas.
- Las imágenes se comprueban antes de presentarse como disponibles.
- Las dimensiones mostradas son reales y verificadas.
- No se inventan miniaturas 4K.
- Los botones ejecutan acciones reales.
- Las limitaciones de descarga se gestionan correctamente.
- La aplicación funciona en móviles y escritorio.
- No requiere una base de datos.
- No expone secretos.
- No incorpora un proxy abierto.
- La metadata SEO es coherente.
- La aplicación compila.
- Los tests principales pasan.
- Docker funciona si se incluye.
- El despliegue está documentado.
- Las limitaciones técnicas están explicadas.

---

# 52. Instrucción final al agente de desarrollo

Primero, analiza los requisitos y define una arquitectura proporcionada al tamaño real del proyecto.

Después, implementa la aplicación completa.

No te limites a crear un prototipo, una maqueta visual o una lista de recomendaciones.

No generes funciones ficticias.

No inventes resultados.

No afirmes que una imagen es 4K si no has comprobado sus dimensiones.

No introduzcas Firebase, una base de datos, un backend o una API externa sin una necesidad técnica justificada.

Prioriza tecnologías maduras, bajo coste de mantenimiento, privacidad, seguridad y rendimiento.

Si encuentras una limitación de YouTube, del navegador o de CORS, resuélvela mediante una alternativa compatible o documenta la limitación con claridad. No la ocultes mediante resultados falsos.

Antes de finalizar, revisa todo el proyecto como desarrollador senior, especialista SEO, ingeniero de seguridad y responsable de QA.

Corrige los errores detectados.

No afirmes que has desplegado el proyecto ni ejecutado una auditoría si no lo has hecho realmente.

El resultado final debe poder clonarse, instalarse, ejecutarse, probarse, compilarse, contenerizarse opcionalmente y desplegarse en Cloudflare Pages.

**Construye un producto real, funcional, rápido, accesible, seguro, mantenible y preparado para producción.**
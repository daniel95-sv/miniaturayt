# Guía de Contribución — MiniaturaYT

¡Agradecemos tu interés en colaborar con MiniaturaYT!

## Flujo de Trabajo

1. Realiza un fork del repositorio.
2. Crea una rama descriptiva para tu feature o corrección (`git checkout -b feature/nueva-mejora`).
3. Instala dependencias con `npm install`.
4. Ejecuta el servidor local con `npm run dev`.
5. Asegúrate de que todos los tests pasen con `npm run test`.
6. Verifica que no existan errores de tipos con `npm run typecheck`.
7. Haz commit de tus cambios respetando las convenciones (`git commit -m "feat: agregar soporte para..."`).
8. Envía un Pull Request hacia la rama principal.

## Criterios de Aceptación para Contribuciones

- No se admiten dependencias pesadas innecesarias.
- El código TypeScript debe compilar con configuración estricta.
- Se debe preservar la accesibilidad (WCAG 2.2 AA) y la privacidad del usuario (sin trackers).

# Multi-stage Dockerfile para producción

# Etapa 1: Construcción
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar manifiestos para aprovechar el caché de capas
COPY package*.json ./

RUN npm ci

# Copiar el código fuente y archivos de configuración
COPY . .

# Compilar la aplicación para producción
RUN npm run build

# Etapa 2: Servidor web de producción Nginx
FROM nginx:alpine-slim

# Metadatos del contenedor
LABEL maintainer="MiniaturaYT Team"
LABEL description="Contenedor de producción Nginx para MiniaturaYT"

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos compilados desde la etapa builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]

# Proyecto de Análisis y Diseño de Software

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Node.js](https://nodejs.org/) (opcional, solo para desarrollo local)
- `curl` o cliente HTTP (para probar endpoints)

## Instalación

### 1. Clonar el repositorio
git clone https://github.com/SmokePythonCL/GRUPO11-2025-PROYINF.git
(debe tener docker-desktop abierto en todo momento)

### 2. Ejecutar en terminal:

1. Deben navegar hasta la carpeta [Proyecto](https://github.com/SmokePythonCL/GRUPO11-2025-PROYINF/tree/main/Proyecto)

2. Ejecutar el siguiente comando el cual levantará el servidor y descargará las dependencias.

  docker compose up --build

  (para detener los contenedores)  
  docker compose down -v

## Ejecución

Si utiliza Docker Desktop puede correr directamene el proyecto desde ahí.

O por linea de comandos:
docker run mi-proyecto-node-docker-app:latest

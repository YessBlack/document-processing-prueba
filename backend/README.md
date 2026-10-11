# Backend

API REST para recibir archivos CSV, almacenarlos localmente, encolarlos para procesamiento y exponer su estado y resultados. Está implementada con Fastify, TypeScript y Prisma sobre PostgreSQL.

## Requisitos

- Node.js 20.9 o posterior.
- pnpm 10 o posterior.
- Docker y Docker Compose.

## Configuración local

Desde la raíz del repositorio:

```bash
cd backend
pnpm install
cp .env.example .env
```

Edita `backend/.env` y establece `DATABASE_URL` para el puerto publicado por Docker Compose:

```dotenv
DATABASE_URL="postgresql://postgres:admin@localhost:5433/document_processing?schema=public"
```

Los valores de usuario y contraseña son únicamente los de desarrollo configurados en `docker-compose.yml`; cámbialos para cualquier entorno compartido o desplegado. El ejemplo de entorno incluido apunta al puerto `5432`, mientras que Compose publica PostgreSQL en el puerto del host `5433`; usa el valor anterior o ajusta Compose de forma consistente.

Desde el directorio `backend`, inicia PostgreSQL y prepara el cliente y esquema:

```bash
docker compose up -d
pnpm generate
pnpm migrate
```

`pnpm migrate` usa Prisma Migrate contra la base indicada por `DATABASE_URL`.

## Ejecución

```bash
pnpm dev
```

La API escucha en `http://localhost:3001` por defecto. El archivo `.env` permite cambiar el puerto con `PORT`.

El worker se inicia dentro de la aplicación API y consulta la cola cada 3 segundos. No se debe arrancar un worker aparte: la cola mock se crea en memoria en el composition root y una instancia separada no compartiría sus mensajes. Aunque hay un script `pnpm worker` declarado, el módulo del worker solo define la clase y no constituye un proceso independiente funcional.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `NODE_ENV` | Entorno de ejecución. |
| `PORT` | Puerto HTTP de Fastify; por defecto `3001`. |
| `DATABASE_URL` | Cadena de conexión PostgreSQL para Prisma. |
| `UPLOADS_DIR` | Directorio local para archivos cargados; por defecto `./uploads`. |
| `WORKER_POLL_INTERVAL_MS` | Está en la plantilla de entorno, pero el worker se instancia actualmente con un intervalo fijo de 3000 ms. |

No publiques archivos `.env` ni credenciales reales.

## API

Todas las rutas usan el prefijo `/api/v1`.

| Método | Ruta | Parámetros / cuerpo | Respuesta |
| --- | --- | --- | --- |
| `POST` | `/api/v1/uploads` | Multipart con un campo `file`. | `201` con `id`, `status`, `fileName` y `createdAt`. |
| `GET` | `/api/v1/uploads` | Query opcional `page` (1 por defecto) y `limit` (10 por defecto). | Lista paginada de uploads. |
| `GET` | `/api/v1/uploads/:id` | ID del upload. | Detalle, estado y conteos disponibles. |
| `GET` | `/api/v1/uploads/:id/results` | ID del upload. | Filas válidas procesadas. |
| `GET` | `/api/v1/uploads/summary` | — | Conteos para el dashboard. |

La subida admite archivos de hasta 10 MiB y el nombre debe terminar en `.csv`. Para probar la API con el ejemplo incluido, ejecuta desde la raíz:

```bash
curl -X POST http://localhost:3001/api/v1/uploads \
  -F "file=@backend/sample-data.csv;type=text/csv"
```

La respuesta contiene el identificador que puedes usar para consultar el detalle:

```bash
curl http://localhost:3001/api/v1/uploads/ID_DEL_UPLOAD
curl "http://localhost:3001/api/v1/uploads?page=1&limit=10"
curl http://localhost:3001/api/v1/uploads/ID_DEL_UPLOAD/results
curl http://localhost:3001/api/v1/uploads/summary
```

## Formato y procesamiento CSV

El archivo debe tener este encabezado exacto y en este orden:

```csv
category,amount,unit,date
Electricity,150.5,kWh,2024-01-01
```

Se exige categoría y unidad no vacías, monto numérico positivo y fecha real con formato `YYYY-MM-DD`. Las líneas vacías se ignoran. Las filas válidas se guardan aunque otras filas tengan errores; el upload registra los conteos de filas procesadas y fallidas. Un archivo vacío o con encabezado inválido falla. El parser separa campos por comas de forma simple y no soporta comas dentro de campos CSV entrecomillados.

Estados usados por el flujo: `PENDING`, `PROCESSING`, `COMPLETED` y `FAILED`.

## Estructura

```text
src/
├── document-processing/
│   ├── domain/          # Entidades, value objects y contratos de repositorio
│   ├── application/     # Handlers de comandos/consultas y parser CSV
│   ├── infrastructure/  # Prisma, almacenamiento local y cola mock
│   └── presentation/    # Controladores y rutas Fastify
├── main/                # Composition root y arranque de la API
├── shared/              # Tipos y utilidades HTTP/dominio compartidos
└── workers/             # Worker de procesamiento integrado
```

## Scripts

| Comando | Acción |
| --- | --- |
| `pnpm dev` | Ejecuta la API en modo watch. |
| `pnpm build` | Compila/verifica TypeScript. |
| `pnpm generate` | Genera el cliente Prisma. |
| `pnpm migrate` | Ejecuta `prisma migrate dev`. |
| `pnpm worker` | Script declarado, pero no inicia un consumidor independiente; el worker funcional se arranca desde la API. |

## Limitaciones conocidas frente a la prueba

- La cola es mock y reside en memoria; no es Amazon SQS y sus mensajes no sobreviven a un reinicio.
- Los archivos se guardan en disco local; no se configura Amazon S3.
- Compose levanta PostgreSQL solamente. No hay contenedor de API ni worker independiente.
- El worker comparte proceso e instancia de cola con la API, por lo que no puede escalarse por separado.
- No se persisten mensajes de error detallados por cada fila inválida; se almacenan conteos y datos válidos.
- `WORKER_POLL_INTERVAL_MS` está documentada en el entorno, pero el código usa 3000 ms fijos.
- La prueba solicita documentar el uso de IA; [USO-DE-IA.md](./USO-DE-IA.md) está vacío y debe llenarse con información veraz antes de entregar.

## Verificación

```bash
pnpm build
```

El `package.json` del backend no define actualmente scripts de test o lint.

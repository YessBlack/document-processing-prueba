# Frontend

Interfaz web para cargar CSV, seguir el procesamiento y revisar los uploads, su detalle y sus resultados. Está construida con Next.js App Router, React, TypeScript, React Query, Axios y Tailwind CSS.

## Requisitos

- Node.js 20.9 o posterior.
- pnpm 10 o posterior.
- Backend ejecutándose en `http://localhost:3001` para usar los datos y operaciones de la aplicación.

## Instalación y configuración

Desde la raíz del repositorio:

```bash
cd frontend
pnpm install
```

Crea `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

La variable debe contener solo el origen de la API; el cliente añade `/api/v1`. No agregues esa ruta a `NEXT_PUBLIC_API_URL`.

## Ejecución

```bash
pnpm dev
```

Abre `http://localhost:3000`. Para que las consultas funcionen, inicia también el backend siguiendo [backend/README.md](../backend/README.md).

## Pantallas

| Ruta | Funcionalidad |
| --- | --- |
| `/` | Dashboard y resumen de uploads. |
| `/uploads` | Lista paginada de archivos cargados. |
| `/uploads/new` | Formulario de carga de un archivo CSV. |
| `/uploads/:id` | Detalle del upload y acceso a resultados. |

Mientras un upload esté `PENDING` o `PROCESSING`, React Query vuelve a consultar su detalle cada tres segundos. La vista de resultados consume los datos del endpoint de resultados; la paginación de esa tabla se realiza en el frontend.

## Scripts

| Comando | Acción |
| --- | --- |
| `pnpm dev` | Inicia Next.js en modo desarrollo. |
| `pnpm build` | Genera la compilación de producción. |
| `pnpm start` | Ejecuta la compilación de producción. |
| `pnpm lint` | Ejecuta ESLint. |

## Estilo

La interfaz está configurada para mostrarse en modo claro, sin seguir la preferencia de modo oscuro del sistema operativo.

## Validación

```bash
pnpm lint
pnpm build
```

El frontend necesita una API disponible para completar el flujo de subida, consulta y resultados.

# Uso de Inteligencia Artificial en esta Prueba

## Herramientas Utilizadas

- [ ] Claude Code
- [x] GitHub Copilot
- [ ] ChatGPT
- [ ] Cursor AI
- [x] Claude (chat en claude.ai)
- [ ] Otra:

## Cómo trabajé (proceso)

1. **Primero entender el problema.** Antes de escribir código, leí el enunciado y, con ayuda de la IA, lo dividí en partes pequeñas (base de datos, API, cola, worker, frontend) para entender qué se pedía.
2. **Investigué por mi cuenta.** Vi algunos videos, revisé la documentación de forma ligera y le pedí ejemplos a la IA de cómo usar cada una de las tecnologías solicitadas.
3. **Identifiqué lo que no conocía y lo practiqué antes de empezar.** Antes de lanzarme a la prueba, saqué la lista de conceptos y tecnologías que no dominaba o que necesitaba ensayar más (Prisma, Docker, Fastify, CQRS, TanStack Query, entre otros) y los probé por separado, con ejemplos pequeños. Por ejemplo, empecé con una práctica sencilla de Prisma (usuarios y posts) usando primero pgAdmin y luego PostgreSQL en Docker; después seguí con Fastify, y fui sumando temas y tecnologías de forma progresiva hasta tener una práctica que combinaba varios.
4. **Base de datos y ORM.** Empecé probando la base de datos con pgAdmin, que ya conocía, y luego pasé a correr PostgreSQL en un contenedor con Docker. Para entender Prisma lo comparé con Hibernate/JPA de Spring Boot, que ya había usado: en ambos describo el modelo de datos (en Prisma en `schema.prisma`, en Hibernate con entidades y anotaciones) y el ORM se encarga de generar las tablas y las consultas, sin escribir SQL a mano. Esa comparación me ayudó a entender los conceptos de Prisma más rápido.
5. **Usé la IA para escribir buena parte del código, además de comandos y configuración** ("¿cómo configuro X?"). Cuando no entendía el código que generaba, le pedía que lo hiciera de otra forma antes de aceptarlo. Por ejemplo, a veces TypeScript no reconocía los modelos de Prisma y le pedí ayuda para entender por qué: la causa era que no había vuelto a generar el cliente de Prisma (`prisma generate`) después de cambiar el schema. Así aprendí que el schema por sí solo no actualiza los tipos: hay que regenerarlo.

## ¿Qué Generé con IA?

### Backend
- [x] Estructura inicial de carpetas (según la estructura que pedía el enunciado)
- [x] Explicaciones de conceptos y de las tecnologías del proyecto (Prisma, Fastify, CQRS, polling)
- [x] Comandos y configuración (Prisma, Docker, Fastify)
- [x] Schema de Prisma
- [x] Lógica de parseo de CSV
- [x] Handlers (commands y queries)
- [x] Worker y cola mock

**Cómo lo validé:** el código del backend lo construí con ayuda de la IA y después lo probé yo misma: peticiones con Postman, revisión de los datos en Prisma Studio y 16 archivos de prueba que preparé (encabezado incorrecto, archivo vacío, filas válidas e inválidas, fechas y montos erróneos, CRLF, archivo que no es CSV, entre otros).

### Frontend
El frontend es el área donde tengo más experiencia (React), así que fue la parte donde más escribí yo.
- [x] Setup inicial de Next.js (con `pnpm create next-app@latest my-app --yes`)
- [x] Componentes: reutilicé componentes que ya había construido en otros proyectos y usé shadcn para tener componentes listos más rápido. Mi trabajo fue traer los datos de la API y mostrarlos.
- [x] Lógica de React Query y polling: no conocía TanStack Query, así que investigué cómo funciona y me apoyé en la IA para escribir los hooks.
- [x] Apoyo de la IA para escribir parte del código de los componentes.
- [x] Estilos con Tailwind y componentes de shadcn.

## ¿Qué Modifiqué o Corregí?

1. **Manejo de errores: de Either a Result.**
   - El enunciado pedía el patrón Either y me costó entenderlo, así que le pedí a la IA que me lo explicara varias veces.
   - La IA me estaba generando código TypeScript que no entendía, así que le pedí una versión más simple y la adoptamos: un tipo `Result<T>` con dos casos, `{ ok: true, value }` y `{ ok: false, error }`, y las funciones `ok()` y `fail()`.
   - La IA escribió el resto de ese sistema: `AppError` (un error con código HTTP), `unwrapResult` (si el Result es error, lanza `AppError`) y un `errorHandler` central de Fastify que convierte cualquier error en la respuesta HTTP, para que los controllers no tengan `try/catch`.
   - Limitación: como el error es solo un texto, no se distinguen tipos de error (por ejemplo, "no encontrado" frente a "dato inválido").

2. **Código simple y explícito en lugar de TypeScript "moderno".**
   - Parte del código que generaba la IA usaba construcciones que no entendía. Por ejemplo, al crear las entidades me sugería no escribir los getters, porque si se inicializan las propiedades en el constructor se puede usar directamente `user.email` sin `this` ni métodos de acceso.
   - Eso me confundía: no tenía claro si así seguía habiendo encapsulamiento. Entiendo que en JavaScript/TypeScript la privacidad de los atributos es más limitada que en Java, pero quería un código que pudiera leer y explicar antes de aceptarlo.
   - Por eso pedí que las entidades mantuvieran atributos privados, constructor y getters/setters al estilo Java, que ya conocía, aunque el código quede más largo.

3. **Errores de tipado en TypeScript.**
   - Fue el error más común. Pedí ayuda para entender cada mensaje en vez de solo copiar la solución.
   - Un ejemplo: TypeScript no reconocía los modelos de Prisma porque no había ejecutado `prisma generate` después de cambiar el schema.
   - Con `noUncheckedIndexedAccess` activado hay que validar `undefined` al leer posiciones de arrays.

4. **Error con la barra final `/` en las rutas.** Una ruta GET aceptaba terminar en `/`, pero el POST daba error.

5. **Código ilegible o muy complejo.** Cuando algo me parecía demasiado complejo o ilegible, le indicaba a la IA que lo hiciera de otra forma, y no avanzaba hasta entender lo que quedaba escrito.

## ¿Qué Aprendí?

1. **Prisma, Docker y PostgreSQL:**
   - Practiqué con un ejemplo de usuarios y posts, primero con pgAdmin y luego con PostgreSQL en un contenedor de Docker.
   - Entendí que el schema de Prisma por sí solo no actualiza los tipos de TypeScript: hay que generar el cliente de nuevo.
   - Comparé Prisma con Hibernate/JPA de Spring Boot, que ya conocía.

2. **Fastify:** lo practiqué con un ejemplo pequeño antes de usarlo en la prueba, no lo conocia, me parecio intenresante, antes solo usaba express y hay que hacer más cosas manuales como las schemas y validaciones.

3. **CQRS:**
   - Concepto nuevo. Lo practiqué con ejemplos pequeños antes de aplicarlo en la prueba.
   - Entendí lo básico: separar lo que escribe datos (commands) de lo que los lee (queries), cada uno con su handler.

4. **TanStack Query y polling:**
   - No conocía TanStack Query; investigué cómo funciona antes de usarlo.
   - Aprendí el concepto de polling: consultar el estado cada cierto tiempo hasta que el proceso termine. En el frontend se hace con `refetchInterval`.

5. **Next.js:**
   - Siempre había armado mis proyectos de React con Vite y React Router DOM. Con Next.js investigué cómo funciona su sistema de rutas por carpetas (App Router).
   - También investigué la directiva `"use client"` y cuándo un componente la necesita.
   - No profundicé más en el framework. Sé que Next.js es muy usado y potente, sobre todo por su renderizado del lado del servidor (SSR), pero en mis proyectos anteriores el tamaño no justificaba usarlo y por eso trabajaba con React y Vite. En esta prueba usé lo necesario para cumplir el enunciado: rutas por carpetas, `"use client"` y consumo de la API con TanStack Query.

## Limitaciones Encontradas con IA

1. **Either:** me costó entenderlo aunque la IA lo explicó varias veces, así que opté por una versión más simple (Result) que sí pude comprender y explicar.
2. **Código difícil de leer:** la IA tiende a proponer código compacto o con atajos del lenguaje que no siempre entendía (por ejemplo, omitir los getters). Tuve que pedir explícitamente versiones más simples.
3. **Colas de mensajes:** no había trabajado antes con colas y fue el concepto que más me costó ver completo, es decir, qué pasa desde que la API publica un mensaje hasta que el worker lo procesa. La IA me dio la implementación, pero necesité repasar el flujo varias veces para entenderlo y aún creo que necesito practicarlo más. 
4. **Mensajería simplificada:** usé un mock con un array en memoria en lugar de SQS. Por eso el worker corre en el mismo proceso que la API, y si el servidor se reinicia se pierden los mensajes pendientes. Con más tiempo investigaría LocalStack o SQS real. Está documentado en el README.
5. **Dependencia en el backend:** el backend es mi punto más débil y me apoyé bastante en la IA. Después de terminarlo hice un repaso por capas para poder explicar cada parte.
# YiQi Landing Page

Este repositorio contiene la landing page principal de YiQi ERP, construida con Next.js 16 (Turbopack) y Tailwind CSS 4. El objetivo del sitio es exponer contenido estático y dinámico (blog, módulos, clientes, integraciones y FAQ) que se alimenta exclusivamente desde SQL Server Express para mantener la información actualizada.

## Arquitectura general

- **Next.js App Router** (`app/`): define las rutas principales (`/`, `/blog`, `/faq`, `/blog/[slug]`) y monta los componentes compartidos como `Header`, `Footer`, secciones destacadas y páginas completas que consumen stores desde `lib/`.
- **Componentes** (`components/`): contienen secciones reutilizables (`HeroSection`, `ModulesSection`, `FAQSection`, etc.) y componentes auxiliares (`LogoScroller`, `BlogContent`, `BlogPostContent`).
- **Librerías de datos** (`lib/`): alojan la lógica de conexión y normalización. Cada recurso real (blog, clientes, integraciones, FAQ) tiene su propio store o helper:
  * `lib/db.ts`: configura la conexión a SQL Server a partir de variables de ambiente obligatorias.
  * `lib/blog-store.ts`: ejecuta la consulta de posts, normaliza HTML/Markdown, genera slugs, resúmenes y calcula tiempos de lectura.
  * `lib/faq-store.ts`: agrupa preguntas, implementa cache con TTL configurable (`FAQ_CACHE_TTL_MS`) y ofrece `clearFaqCache()` para invalidar manualmente.
  * `lib/logo-utils.ts`: helper compartido que suministra `loadLogoItems`, deduplica consultas concurrentes, cachea resultados (TTL configurable vía `LOGO_CACHE_TTL_MS`) y permite invalidar el cache con `clearLogoCache()`.
  * `lib/clients-store.ts` y `lib/integrations-store.ts`: simplemente llaman a `loadLogoItems` con sus querys y textos de fallback.
  * `lib/image-utils.ts`: convierte los blobs base64 de la base de datos en `data:` URLs seguras.
- **Datos de módulos** (`data/modules.ts`): concentra todas las tarjetas de módulos y sus detalles en español para que el componente `ModulesSection` y el panel de detalles compartan el mismo origen.
- **Assets públicos** (`public/`): incluye logotipos, íconos y recursos estáticos mínimos. Las imágenes de clientes e integraciones se eliminaron en favor de los datos desde la base.
- **Documentación viva** (`docs/data-architecture.md`): describe cómo fluyen los datos reales, los patrones reutilizados y dónde añadir nuevos cargadores para mantener la coherencia.

## Variables de entorno

Copiar .env.example a .env.local (no versionado) y completar valores reales.

`env
DB_SERVER=
DB_NAME=WEB_YIQI
DB_USER=
DB_PASSWORD=
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true
FAQ_CACHE_TTL_MS=120000        # opcional, default 2 minutos
LOGO_CACHE_TTL_MS=300000       # opcional, default 5 minutos
CONTACT_MAIL_TO=comercial@yiqi.com.ar
CONTACT_SENDER_MAIL=info@yiqi.com.ar
CONTACT_SENDER_NAME=YiQi Web
CONTACT_AUDIT_USER=WEB
CONTACT_ALLOWED_ORIGINS=
NEXT_PUBLIC_SITE_URL=
SITE_URL=
`

DB_ENCRYPT/DB_TRUST_SERVER_CERTIFICATE ya estan forzados en lib/db.ts.

## Scripts útiles

```bash
npm run dev   # arrancar el servidor de desarrollo
npm run build # compilar para producción
npm run start # ejecutar el build compilado
npm run lint  # revisar el código con ESLint
```

## Flujo de datos destacable

1. Cuando la landing (`app/page.tsx`) se renderiza, llama a `loadFaqCategories({ maxEntries: 7 })`, `getClientLogos()` y `getIntegrationLogos()`. Todos ellos usan cache interno para evitar consultas repetidas durante unos minutos.
2. El blog (`app/blog/page.tsx`) recoge todas las entradas desde SQL y las muestra con paginación, búsqueda y filtros en `components/blog-content.tsx`. Las fechas, autores y tiempos se normalizan en `lib/blog-store.ts`.
3. El detalle de cada post (`app/blog/[slug]/page.tsx`) reutiliza la misma store para evitar duplicación de lógica.
4. Los módulos y su panel de detalle comparten `data/modules.ts`, así cualquier cambio de texto se duplica de forma segura en todas las vistas.
5. FAQ completa (`app/faq/page.tsx`) usa `loadFaqCategories()` sin límite para mostrar todo el contenido.

## Recomendaciones para seguir escalando

1. Si agregas nuevos data-sources (por ejemplo, testimonios o casos), crea un store con la misma estrategia: query SQL en `lib/`, normalización, cache TTL opcional y clear helper documentado en `docs/data-architecture.md`.
2. Usa `clearFaqCache()` / `clearLogoCache()` desde un script o webhook de actualización para forzar nueva lectura cuando los editores cambian los datos sin redeploy.
3. Mantén las secciones UI (Hero, Modules, FAQ) en español y sin duplicar strings en varios archivos. El catálogo en `data/` es el único origen autorizado para módulos.

## ¿Qué no se almacena aquí?

- Archivos de log o config sensitiva: las credenciales viven solo en `.env.local`.
- Blogs MD/HTML antiguos: se borraron de `public/blog/` para evitar contenido duplicado y ahora todo viene desde `WEB_YIQI`.
- Imágenes de clientes/integraciones: los logos los genera la base (base64) y los convierte `buildImageSource`, así se evita mantener assets gigantes.

## ¿Qué sigue?

Si necesitas ayuda para desplegar, documentar o extender alguna sección, puedo ayudarte a:

1. Crear un script de invalidación que ejecute `clearFaqCache()` y `clearLogoCache()` tras un deploy o edición.
2. Añadir nuevas secciones guiadas desde SQL (testimonios, casos de éxito, recursos) siguiendo el mismo patrón.
3. Preparar un plan para pruebas end-to-end o de rendimiento ahora que el sitio usa datos reales.

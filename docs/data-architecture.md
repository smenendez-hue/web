## Data & UI composition overview

- **Blog posts** are fetched via `lib/blog-store.ts`. The SQL query streams the list directly from `ENT_BLOG` joined with `ADM_ARCHIVO`, and the helper normalizes dates, authors, reading time, and converts HTML/Markdown to safe markup. `buildImageSource` keeps the inline-assets consistent. Pagination, filtering, and placeholder handling are all client-side concerns inside `components/blog-content.tsx`.
**FAQ content** now uses `lib/faq-store.ts` with three exported helpers:
  1. `getFaqEntries()` lowers them from SQL and trims text.
  2. `groupFaqsByCategory()` builds the grouped structure.
  3. `loadFaqCategories({ maxEntries })` centralizes the server-side limit that the landing page needs, so every route consumes the same grouping/limiting logic and avoids repeated filtering code in `app/page.tsx` or `components/faq-section.tsx`.
  4. The layered cache respects `FAQ_CACHE_TTL_MS` if set and exposes `clearFaqCache()` so you can bust the grouping on demand (e.g., from an admin webhook).
  4. It also caches the grouped result for two minutes, preventing redundant queries when the landing page and the full FAQ page are rendered in quick succession.
**Clients** and **integrations** share the `LogoScroller` display component, and each store now reuses `lib/logo-utils.ts`: `loadLogoItems` executes the SQL, converts the base64 content into data URLs, clamps the scale factor, filters invalid rows, caches the final list (TTL configurable via `LOGO_CACHE_TTL_MS`), and exposes `clearLogoCache()` so additional sections can revalidate when needed.
- **Modules** content is centralized in `data/modules.ts`, so both the cards and the detail panel rely on the same data set and the Spanish copy stays in sync with Figma.

## Suggested follow-ups

1. Extract the shared `clampScale` and `mapRecordToLogo` behavior into `lib/logo-store.ts` (or a reusable helper) so `clients` and `integrations` draw from the same normalization pipeline.
2. Keep tracking which UI sections rely on server-side stores (blog, FAQ, clients, integrations) and codify their contracts in either dedicated loaders or a `/hooks` helper so future pages can reuse them without re-implementing limit/grouping logic.
3. Whenever a new data source is added, add an entry to this document so the architecture stays documented in one place.

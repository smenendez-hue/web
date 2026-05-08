# CHANGELOG

Todos los cambios notables en el YiQi Design System están documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

---

## [1.2.5] - 2026-05-03 *(actualización)*

### 🎯 Focus
Filosofía borderless consolidada · interlinea estandarizada · toggle/checkbox borderless · fixes mobile · limpieza de anti-patrones visuales.

### ✨ Added
- **Toggle switch (borderless):** Componente `.switch-label` / `.switch-track` / `.switch-thumb`. Track usa `box-shadow` en lugar de `border`. Estado on: `var(--cyan)`.
- **Checkbox (borderless):** Componente `.checkbox-label` / `.checkbox`. Unchecked: `var(--bg-soft)` + `shadow-sm`. Checked: `var(--cyan)` + checkmark SVG inline.
- **Catálogo comparativo de interlineas:** Nueva subsección en DS example (Typography) mostrando el mismo párrafo en 6 valores: 1.1 / 1.35 / 1.4 / 1.55 / 1.7 / 2.0.
- **Swatches de color reactivos:** Los bloques de color en DS example ahora usan `var(--token)` en lugar de hex hardcodeado — se adaptan automáticamente al tema activo.

### 🔧 Changed
- **Interlinea default del sistema: `1.4` (compact).** Aplica a `body` en todos los entregables. Escala canónica documentada.
- **Bajadas (`.section-sub`, `.pricing-sub`, `.tcard-quote`):** Reducidas a `1.1` (tight) en secciones de propuesta y testimonios.
- **Limpieza global de `1.5`–`1.75`** en textos de interfaz → unificados a `1.4`.
- **Logo canónico en topbar:** `height: 39px; width: auto` en todos los archivos (`index.html`, `dashboards/index.html`, `ecosan_informe.html`, `ds-doc.css`).
- **`overflow-x: clip`** en lugar de `hidden` — no rompe `position: sticky` del sidebar.
- **Títulos de sección DS example:** `white-space: nowrap` para forzar una sola línea cuando hay espacio.
- **`app-desc` en marketplace:** `line-height: 1.4` (antes `1.6`).
- **Info de app en banner cards (home):** Cada `.mkt-bp-card` del banner de marketplace ahora muestra kicker de categoría, nombre de app y descripción corta mediante overlay `.mkt-bp-info` con gradiente. Se adapta a dark y light mode. Apps: YiQi Analytics Pro, Depósito Smart, Cobranzas 360, GEODELIVER.
- **Sección "Sobre YiQi" (home):** Nueva sección `.about-section` con layout 2 columnas (texto + stats). Texto completo del perfil LinkedIn. 18 feature tags clickeables (`.tag`) con módulos del ERP. 3 stat cards (fundación 2011, 14+ módulos, tagline). Insertada entre FAQ y CTA final. ID `#sobre-yiqi`.
- **"Acerca de" en site-header.js:** Enlace `#sobre-yiqi` agregado al nav desktop y mobile (entre Contacto y Trabaja con nosotros).
- **Componente `.tag` (feature tag) en home:** Migración de pills personalizados a `.tag` — componente canónico del DS (`ds-doc.css`). `cyan-soft` background, `var(--cyan)` text, `radius-pill`, `font-mono`, sin dot. Usado en sección Sobre YiQi.

### 🐛 Fixed
- **Doble tap en módulos (home):** Todos los `:hover` de `.mod-card` y `.mod-card-header` envueltos en `@media (hover: hover)`. `touch-action: manipulation` en card y header.
- **Donut chart en mobile:** A partir de 768px, `.donut-inner` apila verticalmente (chart arriba, leyenda abajo). `.donut-leg-val` oculto en mobile.
- **Drag grip en mobile:** `.panel:hover .panel-drag-grip` envuelto en `@media (hover: hover)` — no aparece en touch.
- **Alert de donut (texto fragmentado):** Texto del `.donut-alert` envuelto en `<span>` para evitar fragmentación como flex-items separados.
- **Título bicolor en CTA final:** `<em>` cyan eliminado — título en `var(--text)` plano.
- **Swatches de colores en light mode:** Valores hardcodeados reemplazados por tokens CSS.
- **`foto-fab` en dashboard:** `box-shadow` eliminado (mismo criterio que `llm-fab`).

### ↩️ Reverted
- **Accordion sidebar en dashboard:** Se revertió el accordion por nav-section — demasiado disruptivo. El sidebar vuelve a mostrar todos los items siempre.

### 📚 Docs
- `content/design-system/yiqi-design.md` → v1.2.6: interlinea, toggle, checkbox, touch behavior, anti-patrón bicolor, logo size, `overflow-x: clip`.
- `CHANGELOG.md` → esta entrada.

### 🔗 Archivos modificados
- `index.html` (home)
- `examples/dashboards/index.html`
- `examples/marketplace/index.html`
- `examples/ecosan/ecosan_informe.html`
- `yiqi-design-system.html`
- `examples/design-system/styles.css`
- `examples/design-system/ds-doc.css`
- `components/llm-fab.js`
- `components/site-header.js`
- `content/design-system/yiqi-design.md`


### Notas — versión original (2026-04-30)
Filosofía borderless, nuevo token de texto, iconografía SVG inline, patrón mod-card con zonas separadas, filtro por tags y fondo con grilla + radiales.

### ✨ Added
- **Token `--text-cyan-muted`:** Nuevo token para texto con tinte cyan pero vibe muted. Dark: `rgba(0,195,240,.45)` / Light: `rgba(0,140,175,.48)`. Usar en subtítulos, estado activo de módulos y labels secundarios con acento — nunca en CTAs
- **Fondo con grilla + radiales:** `body` tiene grilla de 52×52px y dos radiales cyan superpuestos, con versión adaptada para light mode
- **Patrón mod-card con zonas separadas:** Header dividido en zona izquierda (accordion) y zona derecha (link API), clickeables de forma independiente
- **Sistema de filtro por tags:** `filterByTag()` reordena las cards: las que coinciden suben, las demás se atenúan; `clearFilterByName()` restaura el orden original por `data-order`
- **Toggle de tema 3 pasos:** Oscuro / Sistema / Claro — con Sistema como default. JS: `resolveTheme()` + `applyTheme()` + `setTheme()` + listener a `prefers-color-scheme`
- **Animaciones de entrada por pares:** Cards con `translateX` alternado (izquierda/derecha) via `IntersectionObserver`
- **Banner de campaña:** Patrón `.campaign-banner` con gradiente purple y grilla interna enmascarada

### 🔧 Changed
- **Filosofía borderless:** Los elementos deben ir sin borde siempre que sea posible. La profundidad se logra con elevación de fondo (`--bg-elev`, `--bg-elev-2`) y `box-shadow`. Excepciones documentadas: inputs, controles compuestos, `card-accent`
- **Módulo accordion:** `border: none` → profundidad por `box-shadow: var(--shadow-sm)`. Estado `open` usa `box-shadow` inset sutil en lugar de `border-color` cyan
- **Iconografía:** En HTML standalone se usan SVG stroke inline — no `<i class="ph ph-*">`. Phosphor Icons sigue siendo válido en Next.js
- **Estado activo de módulos:** Cambio de `var(--cyan)` a `var(--text-cyan-muted)` — menos agresivo, más coherente con el resto del sistema
- **HTML de referencia:** Separado en `index.html` (estructura) + `styles.css` (estilos) para reducir tokens al trabajar con IA
- **Default de tema:** `html data-theme` parte en `"system"` — el JS resuelve el modo real al cargar según `prefers-color-scheme`

### 🚀 Deprecated
- `toggleTheme()` (binary dark/light) — reemplazado por `setTheme(v)` con 3 valores: `"dark"` | `"system"` | `"light"`
- Uso de `var(--cyan)` en texto de estado activo/abierto — usar `var(--text-cyan-muted)`
- Phosphor Icons `<i class="ph ph-*">` en HTML standalone sin CDN garantizado — usar SVG stroke inline

### 📚 Docs
- Receta canónica: `YiQi_DS_v1_2_5_Recipe.md`
- Skill actualizado: `/skills/yiqi-ds/SKILL.md`

### 🔗 Archivos
- `yiqi-design-system.html` (HTML de referencia, sin estilos embebidos)
- `examples/design-system/styles.css` (estilos canónicos v1.2.5)
- `content/design-system/YiQi_DS_v1_2_5_Recipe.md` (receta canónica)

---

## [1.2.4] - 2026-04-15

### 🎯 Focus
Mobile responsiveness refinado, fixes de accesibilidad, componentes de tabla mejorados.

### ✨ Added
- **Tabla sortable:** Nuevo componente `table-sortable` con ordenamiento por columna (asc/desc)
- **Phosphor Icons:** Integración completa del set de iconos (500+ iconos disponibles)
- **Mobile breakpoints:** Soporte explícito para 420px (teléfono pequeño)
- **Donut chart sorter:** Función `sortDonutDesc()` para ordenamiento automático descendente
- **Interactive recipe:** Documento HTML con demostraciones en vivo

### 🔧 Changed
- **Logo embebido:** Todos los HTML ahora incluyen SVG inline (positivo/negativo) en lugar de `<img>`
- **Border rule enforcement:** Cards, KPIs y paneles siempre usan `border: 4px solid` completo, nunca solo lado
- **Dark mode refinado:** Ajustes de contraste para WCAG AA en componentes secundarios
- **Tipografía mejorada:** Kerning fino en títulos y mejora de legibilidad en tamaños pequeños
- **Grid responsivo:** Ajustes de gap y márgenes según breakpoint

### 🐛 Fixed
- Overflow de tablas en mobile (ahora con scroll horizontal)
- Alineación de iconos en botones pequeños (sm)
- Espaciado de modales en pantallas < 420px
- Contrast ratio en hover state de botones secundarios
- Padding inconsistente en cards en modo light

### 🚀 Deprecated
- Logo vía `<img>` tag — usar SVG inline siempre
- Custom borders (solo `border-left`, etc.) — usar border completo

### 📚 Docs
- Receta actualizada: `YiQi_DS_v1_2_4_Recipe.md` (completa y canónica)
- Guía de tablas sortables
- Guía de Phosphor icons
- Plantillas mejoradas para reportes y dashboards

### 🔗 Archivos
- `yiqi-design-system-v1_2_4-mobile-phosphor-fix.html` (referencia completa)
- `YiQi_DS_v1_2_4_Recipe.md` (receta canónica)
- `CHANGELOG.md` (este archivo)

---

## [1.2.3] - 2026-03-10

### 🎯 Focus
Refinamiento del dark mode, mejor accesibilidad.

### ✨ Added
- **Light mode palette:** Colores ajustados para fondo claro (eeece7)
- **ARIA labels:** Mejora de accesibilidad en navegación, botones y formularios
- **Keyboard navigation:** Tab order consistente en todos los componentes
- **Focus indicators:** Anillo de focus visible en modo keyboard

### 🔧 Changed
- **Dark/light toggle:** Mejor transición entre modos
- **Text contrast:** Ajustes en variables --muted y --muted-2 para garantizar WCAG AA
- **Spacing refinado:** Márgenes y paddings ajustados tras feedback de UX

### 🐛 Fixed
- Botones deshabilitados con contrast insuficiente (dark mode)
- Help text invisible en ciertos backgrounds
- Modales con scroll interno truncando contenido

### 📚 Docs
- Guía de color actualizada con nuevas recomendaciones light mode
- Checklist de accesibilidad

---

## [1.2.0] - 2026-02-01

### 🎯 Focus
Primera versión stable completa con todos los componentes core y patrones de dashboard.

### ✨ Added
- **Componentes base:** Botones, inputs, cards, navegación
- **Componentes complejos:** Tablas, gráficos (Chart.js), modales, popovers
- **Patrones UI:** Dashboards, formularios, reportes, estados vacíos
- **Responsive:** Breakpoints 980px (desktop), 640px (tablet), 420px (mobile)
- **Dark/Light mode:** Soporte completo con CSS variables
- **Tipografía:** Inter + IBM Plex Mono, pesos 400-700
- **Tokens:** Sistema de colores, espaciado, tamaños, sombras
- **Logo assets:** Negativo y positivo como SVG

### 🔧 Changed
- Estructura de carpetas: `foundations/`, `components/`, `patterns/`, `responsive/`
- Documentación: Markdown + HTML playgrounds interactivos

### 📚 Docs
- `YiQi_DS_v1_2_0.md` (guía completa)
- `YiQi_DS_v1_2_0_Recipe.md` (receta de implementación)
- Playgrounds HTML para demostración

---

## [1.0.0] - 2025-12-15

### 🎯 Focus
Foundations iniciales: tokens, color, tipografía, spacing.

### ✨ Added
- **CSS Variables:** Sistema completo de tokens (backgrounds, borders, text, colores)
- **Color palette:** Cyan, green, amber, red, purple (dark + light)
- **Typography:** Inter (principal) + IBM Plex Mono (monoespaciada)
- **Spacing scale:** xs (4px) → 2xl (48px)
- **Responsive breakpoints:** 980px, 640px, 420px
- **Documentación:** Guía de foundations

### 📚 Docs
- `foundations/tokens.md`
- `foundations/color-palette.md`
- `foundations/typography.md`
- `foundations/spacing-sizing.md`

---

## [Unreleased]

### 🔮 Roadmap para 1.3.0

- [ ] **Animations:** Transiciones y micro-interacciones consistentes
- [ ] **Data pickers:** Calendarios y time pickers mejorados
- [ ] **Validación avanzada:** Custom validators y messages contextuales
- [ ] **Figma integration:** Tokens Studio sync automático
- [ ] **Motion guidelines:** Duración, easing, y timing
- [ ] **Component library:** Storybook integrando todos los componentes
- [ ] **Performance:** Optimizaciones de carga y renders

### 🔮 Roadmap para 2.0.0 (breaking)

- [ ] **Redesign visual:** Evaluación de color palette y tipografía
- [ ] **Nuevo grid system:** Cambio a CSS Grid nativo
- [ ] **Web components:** Migración a custom elements
- [ ] **Accesibilidad mejorada:** WCAG AAA target
- [ ] **Temas personalizables:** Sistema de theming dinámico

---

## Cómo contribuir

Si encontrás un bug o tenés una sugerencia:

1. Describe el problema claramente
2. Incluye screenshots/video si es visual
3. Sugiere una solución (si aplica)
4. Abre una issue o PR con referencia a esta versión

## Versionado

Seguimos [Versionado Semántico](https://semver.org/lang/es/):

- **MAJOR:** Cambios incompatibles con versiones anteriores
- **MINOR:** Nuevas funcionalidades, retrocompatibles
- **PATCH:** Fixes y refinamientos, retrocompatibles

---

**Última actualización:** Abril 2026  
**Mantenedor:** Design System Team @ YiQi  
**Licencia:** Proprietary — YiQi S.A.

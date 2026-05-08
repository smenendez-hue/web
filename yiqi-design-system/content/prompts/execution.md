# YiQi Design System — Master Recipe + Prompt v1.2.5

Fuente única de verdad para:
- Generación de UI con IA
- Implementación manual
- Estandarización cross-producto

---

## 0 · Modo de uso

Este documento es ejecutable. Cumple 3 funciones:

1. Design System (tokens, componentes, reglas)
2. Receta estructural (qué construir)
3. Prompt operativo (cómo generarlo con IA)

**Regla:** no se permite desviación de este documento.

---

## 1 · Prompt Maestro (usar directamente con IA)

Vas a actuar como un experto en UI implementando estrictamente el YiQi Design System v1.2.5.

**Contexto obligatorio:**
- Este documento es la única fuente de verdad
- No inferir estilos fuera de lo definido
- Logo YiQi siempre SVG inline (nunca `<img>`)

**Objetivo:** generar un HTML interactivo autocontenido siguiendo esta receta y el DS.

**Reglas estrictas:**
- Solo usar variables CSS (no colores hardcodeados)
- Tipografía: Plus Jakarta Sans (`--display`) → títulos · Inter (`--sans`) → UI · IBM Plex Mono (`--mono`) → datos
- Spacing múltiplos de 4
- **Filosofía borderless:** cards, panels, KPIs, badges y tags sin `border` — profundidad solo con `box-shadow: var(--shadow-sm)`
- **Excepción borderless:** inputs, selects, textareas y checkboxes sí llevan `border: 1px solid var(--line)`
- **Fondo sin grilla** — solo 2 radiales cyan + `var(--bg)`. Sin `background-size` de grid
- `data-theme="system"` en `<html>` — nunca "dark" ni "light" hardcodeado
- Toggle 3 pasos: Oscuro / Sistema / Claro — usar `setTheme(v)`, no `toggleTheme()`
- Responsive obligatorio (≤ 980px)

**Output:**
- 1 archivo HTML completo con `<head>` incluido
- Sin errores · Sin dependencias rotas
- No explicar nada · No texto fuera del HTML

---

## 2 · Receta estructural (Informe estándar)

**Layout base:**
- Topbar sticky (56px)
- Sidebar con navegación (240px)
- Contenido principal centrado · max-width: 1100px

**Secciones obligatorias:**
1. Contexto
2. Resumen (KPIs)
3. Distribución (donut charts)
4. Histórico (línea 12 meses)
5. Análisis (insights + embeds)
6. Detalle (tabla)

**Componentes obligatorios:**

Topbar:
- Logo YiQi (SVG inline)
- Cliente + Período
- Toggle 3 pasos (Oscuro / Sistema / Claro)
- CTA: "Reserva tu demo"

Sidebar:
- Scroll-spy
- Navegación por secciones

KPI cards (borderless — box-shadow únicamente):
- accent-cyan · accent-green · accent-amber · accent-muted

Charts: Chart.js con colores desde CSS vars

Tabla: sortable + filtrable + estado vacío

---

## 3 · Contrato de datos

Excel requerido. Columnas obligatorias:

| Columna | Tipo |
|---|---|
| titulo | string |
| sprint | YYYYMM |
| BL | string |
| sector | string |
| tipo | bug \| mejora \| soporte |
| estado | creado \| en_progreso \| resuelto |
| esfuerzo | number |

Opcionales: prioridad · responsable · fecha_creacion · fecha_cierre

---

## 4 · Core JS obligatorio

```js
/* ── Theme system DS v1.2.5 ── */
function resolveTheme() {
  const s = localStorage.getItem('yiqi-theme') || 'system';
  return s === 'system'
    ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    : s;
}
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  const s = localStorage.getItem('yiqi-theme') || 'system';
  document.querySelectorAll('.theme-opt').forEach((b, i) =>
    b.classList.toggle('active', ['dark','system','light'][i] === s));
}
function setTheme(v) {
  localStorage.setItem('yiqi-theme', v);
  applyTheme(v === 'system' ? resolveTheme() : v);
  document.querySelectorAll('.theme-opt').forEach((b, i) =>
    b.classList.toggle('active', ['dark','system','light'][i] === v));
}
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
  if ((localStorage.getItem('yiqi-theme') || 'system') === 'system') applyTheme(resolveTheme());
});

function initSidebar() {}
function initScrollSpy() {}
function initTableSorting() {}
function initTableFiltering() {}
function renderCharts() {}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(resolveTheme());
  initSidebar();
  initScrollSpy();
  initTableSorting();
  initTableFiltering();
  renderCharts();
});
```

---

## 5 · Responsive

| Breakpoint | Comportamiento |
|---|---|
| > 980px | Sidebar fijo · layout completo |
| ≤ 980px | Sidebar off-canvas · hamburger |
| ≤ 640px | Grids 1 col · espaciados reducidos |
| ≤ 420px | Mobile pequeño — stacks totales |

Mobile fix obligatorio:
```css
html, body { overflow-x: hidden; }
.app-layout, .content, .card, .panel,
.kpi-grid, .table-wrap { min-width: 0; }
img, svg { max-width: 100%; }
```

---

## 6 · Layout shell (HTML mínimo)

```html
<html data-theme="system" lang="es">
<head>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
  <header class="topbar">
    <!-- SVG logo + toggle 3 pasos -->
  </header>
  <div class="app-layout">
    <nav class="sidebar"><!-- scroll-spy --></nav>
    <main class="content">
      <div class="kpi-grid"><!-- cards borderless --></div>
    </main>
  </div>
</body>
```

---

## 7 · Fondo de pantalla

Elegir variante según el contexto del entregable:

**Dashboards, informes, panel gerencial — solo radiales:**
```css
body {
  background:
    radial-gradient(circle at 72% 8%, rgba(0,204,255,.07), transparent 28%),
    radial-gradient(circle at 12% 60%, rgba(0,204,255,.04), transparent 22%),
    var(--bg);
}
html[data-theme="light"] body {
  background:
    radial-gradient(circle at 72% 8%, rgba(0,159,199,.06), transparent 28%),
    radial-gradient(circle at 12% 60%, rgba(0,159,199,.04), transparent 22%),
    var(--bg);
}
```

**Landing, leads, sitio web — radiales + grilla:**
```css
body {
  background:
    radial-gradient(circle at 72% 8%, rgba(0,204,255,.07), transparent 28%),
    radial-gradient(circle at 12% 60%, rgba(0,204,255,.04), transparent 22%),
    linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px),
    var(--bg);
  background-size: auto, auto, 52px 52px, 52px 52px, auto;
}
html[data-theme="light"] body {
  background:
    radial-gradient(circle at 72% 8%, rgba(0,159,199,.06), transparent 28%),
    radial-gradient(circle at 12% 60%, rgba(0,159,199,.04), transparent 22%),
    linear-gradient(rgba(0,0,0,.032) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,.032) 1px, transparent 1px),
    var(--bg);
  background-size: auto, auto, 52px 52px, 52px 52px, auto;
}
```


## 8 · Tokens

### Dark (`:root`)

```css
:root {
  --bg: #0c0c0e;  --bg-elev: #111114;  --bg-elev-2: #18181c;
  --bg-soft: rgba(255,255,255,.04);
  --line: rgba(255,255,255,.08);  --line-strong: rgba(255,255,255,.14);
  --text: #f0f1f3;  --muted: #908e8e;  --muted-2: #7d7c82;
  --cyan: #00ccff;  --cyan-soft: rgba(0,204,255,.12);
  --cyan-soft-2: rgba(0,204,255,.18);
  --text-cyan-muted: rgba(0,195,240,.45);
  --green: #00c48c;  --green-soft: rgba(0,196,140,.12);
  --amber: #f6a623;  --amber-soft: rgba(246,166,35,.12);
  --red: #f25f5c;    --red-soft: rgba(242,95,92,.12);
  --purple: #a78bfa; --purple-soft: rgba(167,139,250,.12);
  --glow: 0 0 0 3px rgba(0,204,255,.22);
  --shadow-sm: 0 1px 3px rgba(0,0,0,.35), 0 1px 8px rgba(0,0,0,.18);
  --shadow-md: 0 4px 16px rgba(0,0,0,.4), 0 1px 4px rgba(0,0,0,.2);
  --radius: 10px;  --radius-sm: 7px;  --radius-pill: 99px;
  --sans: "Inter", system-ui, sans-serif;
  --display: "Plus Jakarta Sans", "Inter", system-ui, sans-serif;
  --mono: "IBM Plex Mono", monospace;
  --topbar-h: 56px;  --sidebar-w: 240px;
}
```

### Light (`html[data-theme="light"]`)

```css
html[data-theme="light"] {
  --bg: #f5f4f0;  --bg-elev: #eeece7;  --bg-elev-2: #e6e4df;
  --bg-soft: rgba(0,0,0,.04);
  --line: rgba(0,0,0,.08);  --line-strong: rgba(0,0,0,.14);
  --text: #1a1a1e;  --muted: #6b6e78;  --muted-2: #636875;
  --cyan: #009fc7;  --cyan-soft: rgba(0,159,199,.1);
  --cyan-soft-2: rgba(0,159,199,.16);
  --text-cyan-muted: rgba(0,140,175,.48);
  --green: #007a58;  --green-soft: rgba(0,122,88,.1);
  --amber: #c47c00;  --amber-soft: rgba(196,124,0,.1);
  --red: #c93c39;    --red-soft: rgba(201,60,57,.1);
  --purple: #7c3aed; --purple-soft: rgba(124,58,237,.1);
  --shadow-sm: 0 1px 3px rgba(0,0,0,.08), 0 1px 8px rgba(0,0,0,.05);
  --shadow-md: 0 4px 16px rgba(0,0,0,.1), 0 1px 4px rgba(0,0,0,.06);
}
```

---

## 9 · Tipografía

- **Plus Jakarta Sans (`--display`)** → títulos, heroes, headings grandes
- **Inter (`--sans`)** → UI, body, labels, botones
- **IBM Plex Mono (`--mono`)** → kickers, badges, datos, IDs

KPI value: `font: 700 28px/1 var(--display); letter-spacing: -.03em;`

---

## 10 · Componentes base

```css
/* Card — borderless */
.card {
  padding: 20px;
  border-radius: var(--radius);
  background: var(--bg-elev);
  box-shadow: var(--shadow-sm);
}

/* Button — borderless */
.btn-primary {
  background: var(--cyan-soft-2);
  color: var(--cyan);
  border: none;
}

/* Input — excepción: controles interactivos llevan borde */
.input {
  border: 1px solid var(--line);
  background: var(--bg-elev-2);
}

/* Table headers */
.table th::after  { content: " ↕"; color: var(--muted-2); }
.table th.sorted-asc::after  { content: " ↑"; color: var(--cyan); }
.table th.sorted-desc::after { content: " ↓"; color: var(--cyan); }

/* Badge — sin borde */
.badge { border: none; background: var(--bg-elev-2); color: var(--muted); }
.badge-cyan { background: var(--cyan-soft); color: var(--cyan); }
```

---

## 11 · Charts

- type: doughnut · cutout: 68% · legend custom
- Colores desde CSS vars (nunca hex hardcodeado)
- `sortDonutDesc()` para ordenamiento automático descendente

---

## 12 · Branding

- Nombre: **YiQi**
- CTA: **"Reserva tu demo"**
- Español neutro — sin voseo ni regionalismos
- Logo SVG inline obligatorio (nunca `<img>`)

---

## 13 · Versionado

Incluir en footer:

```
© 2026 YiQi S.A. · [Nombre entregable] · DS v1.2.5
```

---

## 14 · Dependencias

**Modo estándar:**
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

**Iconos** (solo Next.js — en HTML standalone usar SVG inline):
```html
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
```

---

## 15 · Output contract

El HTML final debe:
- Renderizar correctamente
- Ser responsive
- No tener errores JS
- Mantener consistencia visual DS
- Ser reutilizable para cualquier cliente

---

## 16 · Convención de archivo

`[nombre]-v1_0_0.html` (puntos → guiones bajos)

---

## 17 · Regla crítica final

Si algo no está definido:
→ NO inventar
→ Usar criterio mínimo basado en este documento

---

*YiQi ERP · Design System v1.2.5 · Master Recipe · 30/04/2026*



### Search Input
```css
/* site.css — clases canónicas */
.search-wrap  { position: relative; display: block; }
.search-icon  { position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
                width: 15px; height: 15px; color: var(--muted-2); pointer-events: none; }
.search-input { width: 100%; height: 44px; padding: 0 40px;
                background: var(--bg-elev-2); border: 1px solid transparent;
                border-radius: var(--radius); color: var(--text);
                font: 400 13px var(--sans); caret-color: var(--cyan); }
.search-input:focus { border-color: rgba(0,204,255,.3); box-shadow: 0 0 0 3px var(--cyan-soft); }
.search-clear { position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                background: none; border: none; cursor: pointer; color: var(--muted-2); display: none; }
.search-clear.visible { display: block; }
.search-kbd   { position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                font: 500 10px var(--mono); color: var(--muted-2); border-radius: 4px; padding: 1px 5px; }
```

---

## 18 · YiQi Runtime (JS compartido)

Incluir en el `<head>` de cualquier entregable HTML standalone:

```html
<script src="/system/sdk/yiqi-runtime.js"></script>
```

Reemplaza el bloque de JS que antes se copiaba en cada archivo. API global:

```js
// Tema
YiQi.setTheme('dark' | 'system' | 'light')  // persiste en localStorage
YiQi.getTheme()                              // devuelve preferencia guardada

// Toast
YiQi.toast('Guardado', 'success')            // types: success | error | warning | info
YiQi.toast('Error al cargar', 'error', 5000) // duration en ms (default 3000)

// Tabla sorteable
YiQi.initSortable(document.querySelector('.mi-tabla'))
// Los <th> deben tener data-col="nombre"

// ScrollSpy (nav activo por sección)
YiQi.initScrollSpy({
  sections:  '.section',     // selector o NodeList
  navItems:  '.nav-item',    // selector o NodeList
  threshold: 0.25            // opcional
})

// Formatters
YiQi.fmt.currency(1500000)   // → $ 1.500.000
YiQi.fmt.number(12345)       // → 12.345
YiQi.fmt.percent(12.3)       // → 12,3 %
YiQi.fmt.date('2026-04-30')  // → 30/04/2026
YiQi.fmt.dateShort(new Date) // → 30 abr
```

El tema se inicializa automáticamente al cargar el script (sin esperar DOMContentLoaded),
eliminando el flash de tema incorrecto.

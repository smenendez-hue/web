# YiQi Design System — Guía maestra v1.2.6

> Fuente única de verdad para implementación de UI en productos YiQi ERP.
> Este archivo reemplaza cualquier versión anterior de `yiqi-design.md`.
> Referencias completas: `YiQi_DS_v1_2_4.md` · `YiQi_DS_v1_2_4_Recipe.md` · `YiQi_DS_v1_2_5_Recipe.md`

---

## 0. Identidad de marca

| Elemento | Valor |
|---|---|
| Nombre del producto | **YiQi** — Y mayúscula, i minúscula, Q mayúscula, i minúscula |
| ❌ Incorrecto | `yiqi` `YIQI` `YiQI` `Yiqi` |
| CTA canónica | **"Reserva tu demo"** |
| Copy | Español neutro — sin voseo ni regionalismos |

### Ortografía y sintaxis del copy

- Todo texto visible al usuario debe respetar ortografía en español (acentos, tildes diacríticas y puntuación).
- Evitar mayúsculas sostenidas en labels de UI salvo siglas (`POS`, `SLA`, `SKU`, `API`).
- Usar terminología consistente en todos los módulos:
  - "Facturación", "nota de débito", "nota de crédito", "órdenes", "proyección", "preparación".
- Si un indicador muestra fórmula o composición, redactar en lenguaje funcional claro y gramaticalmente correcto.

### Logo

- Siempre como **SVG inline** — nunca `<img src="logo.svg">` ni `<img src="logo.png">`
- **Dark mode / negativo:** letras `#f2f0ef`, símbolo Q `#00ccff`
- **Light mode / positivo:** letras `#231f20`, símbolo Q `#009fc7`
- **Topbar universal:** letras `var(--text)`, símbolo Q `var(--cyan)`
- No rotar, deformar, recolorear ni aplicar efectos
- **Tamaño canónico en topbar:** `height: 39px; width: auto` — nunca tamaño fijo por ancho
- **Wordmark en displays estáticos:** sin animación — solo SVG inline sin `data-yiqi-logo`
- **Animación canónica (único eje aprobado):** `data-axis="y"` (flip vertical). Los ejes `x` y `z` están descartados.

### Logo iA Ready

- Siempre como **SVG inline** — nunca `<img src="iAready.svg">`
- Letras "iready" → `var(--text)` · letra "A" → `var(--cyan)`
- No rotar, deformar, recolorear ni aplicar efectos
- Uso habitual: footer, sección de certificaciones, landing de producto
- **Tamaño canónico:** `height: 32px; width: auto`
- Clases helper: `.iar { fill: var(--text) }` · `.iar-a { fill: var(--cyan) }`

```html
<style>.iar{fill:var(--text)}.iar-a{fill:var(--cyan)}</style>
<svg viewBox="0 0 256 68" xmlns="http://www.w3.org/2000/svg" aria-label="iA ready" style="height:32px;width:auto">
  <path class="iar" d="M225.626 67.89C224.75 67.89 224.239 67.452 224.677 66.576L229.933 54.02L216.063 19.491C215.771 18.688 216.209 18.25 217.012 18.25H227.159C227.743 18.25 228.327 18.542 228.546 19.126L235.846 39.712L243.219 19.126C243.438 18.542 244.022 18.25 244.606 18.25H254.753C255.556 18.25 255.921 18.688 255.629 19.491L236.722 67.014C236.503 67.598 235.919 67.89 235.335 67.89H225.626Z"/>
  <path class="iar" d="M190.294 54.896C180.439 54.896 173.65 46.7199 173.65 36.1349C173.65 25.6229 180.439 17.3739 190.294 17.3739C194.747 17.3739 197.886 18.688 200.222 21.243V2.99295C200.222 2.33595 200.733 1.82495 201.39 1.82495H211.391C212.048 1.82495 212.559 2.33595 212.559 2.99295V52.852C212.559 53.509 211.975 54.02 211.318 54.02H202.339C201.682 54.02 201.171 53.509 201.171 52.852L201.025 49.8589C198.616 52.9979 195.185 54.896 190.294 54.896ZM185.622 36.1349C185.622 40.8069 188.834 43.7999 193.068 43.7999C197.375 43.7999 200.368 40.734 200.368 36.062C200.368 31.463 197.375 28.4699 193.068 28.4699C188.834 28.4699 185.622 31.5359 185.622 36.1349Z"/>
  <path class="iar" d="M147.515 54.896C137.66 54.896 130.871 46.72 130.871 36.135C130.871 25.623 137.66 17.374 147.515 17.374C152.552 17.374 155.983 19.199 158.246 22.338L158.392 19.418C158.392 18.761 158.903 18.25 159.56 18.25H168.612C169.269 18.25 169.78 18.761 169.78 19.418V52.852C169.78 53.509 169.196 54.02 168.539 54.02H159.56C158.903 54.02 158.392 53.509 158.392 52.852L158.246 49.859C155.837 52.998 152.406 54.896 147.515 54.896ZM142.843 36.135C142.843 40.807 146.055 43.8 150.289 43.8C154.596 43.8 157.589 40.734 157.589 36.062C157.589 31.463 154.596 28.47 150.289 28.47C146.055 28.47 142.843 31.536 142.843 36.135Z"/>
  <path class="iar" d="M112.868 54.896C101.115 54.896 93.0117 47.012 93.0117 35.989C93.0117 25.477 100.385 17.374 111.554 17.374C122.504 17.374 128.855 25.331 128.855 34.529C128.855 38.398 127.906 40.807 124.329 40.807H104.984C106.298 44.092 109.437 45.333 113.89 45.333C115.934 45.333 118.27 45.26 121.263 43.654C121.847 43.362 122.212 43.508 122.577 44.092L125.935 48.764C126.227 49.202 126.3 49.786 125.57 50.443C122.577 53.509 117.978 54.896 112.868 54.896ZM104.765 32.412H117.978C117.248 28.616 114.62 27.375 111.627 27.375C108.488 27.375 105.714 28.762 104.765 32.412Z"/>
  <path class="iar" d="M69.2676 54.02C68.6106 54.02 68.0996 53.509 68.0996 52.852V19.418C68.0996 18.761 68.6106 18.25 69.2676 18.25H78.9036C79.4876 18.25 79.9256 18.542 79.9986 19.491L80.3636 24.309C81.5316 20.294 83.7216 17.374 87.8096 17.374C89.6346 17.374 90.5836 17.885 91.0946 18.323C91.6786 18.761 91.8246 19.272 91.8246 19.929V28.032C91.8246 28.908 91.3136 29.2 90.2916 28.981C89.5616 28.762 88.8316 28.616 87.5906 28.616C83.2836 28.616 80.3636 30.879 80.3636 36.427V52.852C80.3636 53.509 79.8526 54.02 79.1956 54.02H69.2676Z"/>
  <path class="iar-a" d="M17.7429 54.0199C16.9399 54.0199 16.5019 53.5089 16.7939 52.7789L33.5839 3.79593C33.8029 3.21192 34.3869 2.91992 34.9709 2.91992H45.9939C46.5779 2.91992 47.2349 3.21192 47.4539 3.79593L64.2439 52.7789C64.5359 53.5089 64.0979 54.0199 63.2949 54.0199H52.4179C51.8339 54.0199 51.3229 53.8009 51.1039 53.1439L49.2059 47.0119H31.7589L29.8609 53.1439C29.6419 53.8009 29.2039 54.0199 28.6199 54.0199H17.7429ZM35.2629 35.7699H45.7019L40.5189 19.0529L35.2629 35.7699Z"/>
  <path class="iar" d="M6.64301 13.213C2.774 13.213 0 10.293 0 6.57C0 2.92 2.774 0 6.64301 0C10.439 0 13.286 2.92 13.286 6.57C13.286 10.293 10.439 13.213 6.64301 13.213ZM0.438004 52.852V19.418C0.438004 18.761 0.949003 18.25 1.606 18.25H11.68C12.337 18.25 12.848 18.761 12.848 19.418V52.852C12.848 53.509 12.337 54.02 11.68 54.02H1.606C0.949003 54.02 0.438004 53.509 0.438004 52.852Z"/>
</svg>
```


---

## 1. CSS Custom Properties

### 1.1 Dark mode (`:root` — default)

```css
:root {
  /* Backgrounds */
  --bg:        #0a0a0b;
  --bg-elev:   #0f1013;
  --bg-elev-2: #14161b;
  --bg-soft:   #181b21;

  /* Borders */
  --line:        rgba(255,255,255,.08);
  --line-strong: rgba(255,255,255,.14);

  /* Text */
  --text:    #f3f5f7;
  --muted:   #908e8e;
  --muted-2: #7d7c82;  /* WCAG AA 4.6:1 */

  /* Brand — Cyan */
  --cyan:            #00ccff;
  --cyan-soft:       rgba(0,204,255,.10);
  --cyan-soft-2:     rgba(0,204,255,.16);
  --cyan-label:      rgba(0,204,255,.52);
  --text-cyan-muted: rgba(0,195,240,.45);  /* subtítulos activos, labels acento */

  /* Semantic */
  --green:       #15d49c;
  --green-soft:  rgba(21,212,156,.10);
  --amber:       #ffb020;
  --amber-soft:  rgba(255,176,32,.10);
  --red:         #ff637d;
  --red-soft:    rgba(255,99,125,.10);
  --purple:      #a78bfa;
  --purple-soft: rgba(167,139,250,.12);

  /* Focus glow */
  --glow: 0 0 0 3px rgba(0,204,255,.22);

  /* Typography */
  --sans:    "Inter", system-ui, sans-serif;
  --display: "Greycliff CF", "Plus Jakarta Sans", "Inter", system-ui, sans-serif;
  --mono:    "IBM Plex Mono", monospace;

  /* Font weights */
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  /* Spacing (base 4px) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 48px;

  /* Border radius */
  --radius-xs:   6px;
  --radius-sm:   10px;
  --radius:      14px;
  --radius-pill: 999px;

  /* Elevation / Shadows */
  --shadow-sm: 0 1px 3px rgba(0,18,28,.30);
  --shadow-md: 0 4px 14px rgba(0,20,30,.26);
  --shadow-lg: 0 12px 40px rgba(0,26,40,.34), 0 2px 12px rgba(0,204,255,.06);

  /* Transitions */
  --transition-fast: 120ms ease;
  --transition-base: 180ms ease;
  --transition-slow: 240ms ease;

  /* Layout */
  --sidebar-w: 240px;
  --topbar-h:  56px;

  /* Nav active border — borderless por defecto */
  --nav-item-active-border: transparent;
}
```

### 1.2 Light mode (`html[data-theme="light"]`)

```css
html[data-theme="light"] {
  /* Backgrounds */
  --bg:        #eeece7;
  --bg-elev:   #f6f4ef;
  --bg-elev-2: #ffffff;
  --bg-soft:   #ece9e2;

  /* Borders */
  --line:        rgba(0,0,0,.08);
  --line-strong: rgba(0,0,0,.13);

  /* Text */
  --text:    #17191c;
  --muted:   #5e5a57;
  --muted-2: #636875;  /* WCAG AA 4.8:1 */

  /* Brand — Cyan (shifted para fondo claro) */
  --cyan:            #009fc7;
  --cyan-soft:       rgba(0,159,199,.1);
  --cyan-soft-2:     rgba(0,159,199,.16);
  --cyan-label:      rgba(0,159,199,.52);
  --text-cyan-muted: rgba(0,140,175,.48);

  /* Semantic */
  --green:       #0c9b6d;
  --green-soft:  rgba(12,155,109,.10);
  --amber:       #c78000;
  --amber-soft:  rgba(199,128,0,.10);
  --red:         #d4485e;
  --red-soft:    rgba(212,72,94,.10);
  --purple:      #7c3aed;
  --purple-soft: rgba(124,58,237,.12);

  /* Shadows (más suaves en fondo claro) */
  --shadow-sm: 0 1px 3px rgba(16,36,54,.06);
  --shadow-md: 0 4px 14px rgba(16,36,54,.08);
  --shadow-lg: 0 8px 24px rgba(0,80,110,.09), 0 1px 4px rgba(0,80,110,.05);
}
```

---

## 2. Tipografía

### Imports (en `<head>`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Regla de uso

- **Plus Jakarta Sans (`--display`)** → títulos de página, hero headlines, headings grandes
- **Inter (`--sans`)** → todo el texto de interfaz: body, labels, botones, nav
- **IBM Plex Mono (`--mono`)** → tokens, badges, kickers, valores numéricos, IDs, atajos de teclado

### Escala tipográfica

| Uso | Fuente | Tamaño | Peso | Letter-spacing |
|---|---|---|---|---|
| Hero / Page title | `--display` | 40–52px | 800 | -0.03em a -0.04em |
| Título de sección | `--display` | 24–28px | 700 | -0.025em |
| Subtítulo / card heading | `--sans` | 16–20px | 600 | -0.02em |
| Panel title | `--sans` | 14px | 700 | — |
| Body / celdas | `--sans` | 13–14px | 400 | — |
| Label / meta | `--sans` | 12px | 500 | — |
| Kicker / section label | `--mono` | 10–11px | 600–700 | .10em–.16em, uppercase |
| Valor numérico / ID | `--mono` | 10–13px | 500 | — |

### Interlinea (line-height) — escala canónica

**Default del sistema: `1.4` (compact)** — aplica al `body` base.

| Nombre | Valor | Uso |
|---|---|---|
| tight | `1.1` | Títulos display, hero headlines |
| snug | `1.35` | Subtítulos, headings de panel |
| **compact** *(default)* | **`1.4`** | **Body UI, descripciones, app-desc, bajadas** |
| normal | `1.55` | Texto de ayuda, prose más largo |
| relaxed | `1.7` | Notas al pie, tooltips |
| loose | `2.0` | Código mono, logs |

```css
body { line-height: 1.4; }  /* compact — default del sistema */
```

**Anti-patrón:** usar `1.6` o `1.7` en texto de interfaz estándar — se ve con demasiado aire.

---

## 3. Filosofía borderless *(nuevo en v1.2.5)*

**Regla:** los elementos de display van **sin borde** siempre que sea posible. La profundidad se logra con elevación de fondo y `box-shadow`.

```
borde visible → solo en controles interactivos (input, select, textarea, switch, checkbox, search)
sin borde     → cards, panels, KPIs, badges, tags, nav items, modales, accordions, icon cards
```

```css
/* ✅ Correcto — card borderless */
.card {
  background: var(--bg-elev);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);   /* profundidad por sombra */
}

/* ✅ Correcto — input con borde (control interactivo) */
.input {
  border: 1px solid var(--line);
}

/* ❌ Incorrecto */
.card { border: 1px solid var(--line); }
.badge { border: 1px solid var(--line); }
```

---

## 4. Token `--text-cyan-muted` *(nuevo en v1.2.5)*

Usar en: subtítulos, estado activo de módulos, labels secundarios con acento cyan.

**Nunca** en CTAs ni texto principal.

```css
/* ✅ Uso correcto */
.section-kicker    { color: var(--text-cyan-muted); }
.module-open-title { color: var(--text-cyan-muted); }
.nav-item.active   { color: var(--text-cyan-muted); }

/* ❌ Incorrecto — usar --cyan directo para estados activos */
.nav-item.active { color: var(--cyan); }
```

---

## 5. Fondo de pantalla *(actualizado en v1.2.5)*

Dos variantes según el contexto del entregable:

| Variante | Cuándo usarla |
|---|---|
| **Solo radiales** | Dashboard, informe, panel gerencial — cualquier app funcional |
| **Radiales + grilla** | Landing, propuesta comercial (leads), sitio web (www.yiqi.com.ar) |

### Variante A — Solo radiales (dashboards e informes)

```css
body {
  background:
    radial-gradient(circle at 72% 8%,  rgba(0,204,255,.07), transparent 28%),
    radial-gradient(circle at 12% 60%, rgba(0,204,255,.04), transparent 22%),
    var(--bg);
}
html[data-theme="light"] body {
  background:
    radial-gradient(circle at 72% 8%,  rgba(0,159,199,.06), transparent 28%),
    radial-gradient(circle at 12% 60%, rgba(0,159,199,.04), transparent 22%),
    var(--bg);
}
```

### Variante B — Radiales + grilla (landing, leads, web)

```css
body {
  background:
    radial-gradient(circle at 72% 8%,  rgba(0,204,255,.07), transparent 28%),
    radial-gradient(circle at 12% 60%, rgba(0,204,255,.04), transparent 22%),
    linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px),
    var(--bg);
  background-size: auto, auto, 52px 52px, 52px 52px, auto;
}
html[data-theme="light"] body {
  background:
    radial-gradient(circle at 72% 8%,  rgba(0,159,199,.06), transparent 28%),
    radial-gradient(circle at 12% 60%, rgba(0,159,199,.04), transparent 22%),
    linear-gradient(rgba(0,0,0,.032) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,.032) 1px, transparent 1px),
    var(--bg);
  background-size: auto, auto, 52px 52px, 52px 52px, auto;
}
```


## 6. Layout shell

### Estructura base

```
topbar sticky (56px, z-index: 99)
  └─ SVG logo inline + version pill + toggle 3 pasos + hamburger mobile
sidebar (240px, sticky top: 56px)
  └─ off-canvas en mobile (breakpoint: 980px)
main content
  └─ padding: 36–40px desktop / 20–22px mobile
  └─ max-width: 1100px
```

### Topbar

```css
.topbar {
  position: sticky; top: 0; z-index: 99;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 0 28px; height: var(--topbar-h);
  background: rgba(12,12,14,.82);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--line);  /* excepción: separador estructural */
}
html[data-theme="light"] .topbar {
  background: rgba(238,236,231,.88);
}
```

### Sidebar

```css
.sidebar {
  width: var(--sidebar-w);
  position: sticky; top: var(--topbar-h);
  height: calc(100vh - var(--topbar-h));
  overflow-y: auto;
  border-right: 1px solid var(--line);  /* excepción: separador estructural */
  padding: 24px 16px;
}
```

### HTML mínimo

```html
<html data-theme="system" lang="es">
<body>
  <header class="topbar">...</header>
  <div class="app-layout">
    <nav class="sidebar">...</nav>
    <main class="content">
      <div class="kpi-grid">...</div>
      <div class="panel">...</div>
    </main>
  </div>
</body>
```

---

## 7. Responsive

### Breakpoints

| Breakpoint | Comportamiento |
|---|---|
| `> 1200px` | 3–4 columnas KPIs completos |
| `≤ 1200px` | Grids 3 col → 2 col |
| `≤ 980px` | Sidebar off-canvas, layout 1 columna |
| `≤ 640px` | Espaciados reducidos |
| `≤ 420px` | Mobile pequeño — stacks totales |

### Mobile frame fix (obligatorio)

```css
html, body { overflow-x: clip; }  /* clip en lugar de hidden — no rompe position:sticky */
.app-layout, .content, .card, .panel,
.kpi-grid, .table-wrap { min-width: 0; }
img, svg { max-width: 100%; }
```

---

## 8. Componentes clave

### Botones

```css
.btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 16px; border-radius: var(--radius);
  border: none; font: 600 13px var(--sans);
  transition: all var(--transition-base); cursor: pointer;
}
.btn-primary   { background: var(--cyan-soft-2); color: var(--cyan); }
.btn-secondary { background: var(--bg-elev-2);   color: var(--text); }
.btn-ghost     { background: var(--bg-elev-2);   color: var(--muted); }
.btn-danger    { background: var(--red-soft);     color: var(--red); }
```

### Badges / Tags / Pills — sin borde

```css
.badge {
  display: inline-flex; align-items: center;
  padding: 3px 9px; border-radius: var(--radius-pill);
  font: 600 11px var(--mono); letter-spacing: .04em;
  /* sin border — borderless philosophy */
}
.badge-cyan   { background: var(--cyan-soft);   color: var(--cyan); }
.badge-green  { background: var(--green-soft);  color: var(--green); }
.badge-amber  { background: var(--amber-soft);  color: var(--amber); }
.badge-red    { background: var(--red-soft);    color: var(--red); }
.badge-purple { background: var(--purple-soft); color: var(--purple); }
```

### Feature tags — `.tag`

Etiquetas de capacidad del producto. Usan `cyan-soft` background sin dot. Para módulos, funcionalidades, atributos.

```html
<span class="tag">Facturación</span>
<span class="tag">Real-time</span>
<a href="#modulos" class="tag">Stock</a>
```

```css
.tag {
  display: inline-flex; align-items: center;
  padding: 5px 10px; border-radius: var(--radius-pill);
  background: var(--cyan-soft); color: var(--cyan);
  font: 700 10px var(--mono); text-decoration: none;
}
@media (hover: hover) { a.tag:hover { background: var(--cyan); color: #fff; } }
```

**Diferencia con `.badge`:** el badge es para estados (activo, pendiente, error) y lleva dot. El `.tag` es para atributos de producto/módulo, sin dot.

---

### Cards / KPIs — sin borde

```css
.card {
  padding: 20px;
  border-radius: var(--radius);
  background: var(--bg-elev);
  box-shadow: var(--shadow-sm);   /* profundidad por sombra, no por borde */
}
.card-kicker {
  font: 700 10px var(--mono); letter-spacing: .12em;
  text-transform: uppercase; color: var(--muted-2);
}
.kpi-value {
  font: 700 28px var(--display); letter-spacing: -.03em;
  color: var(--text); margin-top: 8px;
}
.kpi-delta-positive { color: var(--green); }
.kpi-delta-negative { color: var(--red); }
```

### Inputs — excepción borderless

```css
.input {
  width: 100%; padding: 9px 12px;
  border: 1px solid var(--line);  /* controles interactivos sí llevan borde */
  border-radius: var(--radius-sm);
  background: var(--bg-elev-2); color: var(--text);
  font: 400 14px var(--sans);
  transition: border-color 160ms, box-shadow 160ms;
  outline: none;
}
.input:focus {
  border-color: var(--cyan);
  box-shadow: var(--glow);
}
```

### Módulos accordion — sin borde, profundidad por sombra

```css
.module-card {
  background: var(--bg-elev);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.module-card[open],
.module-card.open {
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(0,195,240,.12);
}
```

### Panel

```css
.panel {
  background: var(--bg-elev);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
  display: flex; flex-direction: column; gap: var(--space-4);
}
```

### Tablas

```css
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th {
  font: 600 11px var(--mono); letter-spacing: .06em;
  text-transform: uppercase; color: var(--muted-2);
  padding: 8px 12px; border-bottom: 1px solid var(--line); text-align: left;
}
.table td {
  padding: 11px 12px; color: var(--muted);
  border-bottom: 1px solid var(--line);
}
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: var(--bg-soft); }
```

### Nav item

```css
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: var(--radius-sm);
  font: 500 13px var(--sans); color: var(--muted);
  transition: all var(--transition-base);
}
.nav-item:hover  { background: var(--bg-soft); color: var(--text); }
.nav-item.active {
  background: var(--cyan-soft);
  color: var(--text-cyan-muted);    /* nunca --cyan directo */
  border-left: 2px solid var(--nav-item-active-border);  /* transparent — borderless */
}
```

---


### Load progress

Barra de carga con porcentaje. Aparece mientras la app se conecta al backend o carga datos pesados.

```html
<div class="load-progress">
  <div class="load-progress-track">
    <div class="load-progress-fill" style="width: 65%"></div>
  </div>
  <div class="load-progress-meta">
    <span>Conectando con el servidor...</span>
    <strong>65%</strong>
  </div>
</div>
```

- Fill: degradado `var(--cyan)` → `var(--green)`, animado con `transition: width 0.35s ease`
- Estado completo: `width: 100%`

---

### Session warning

Aviso inline no crítico. Para alertas de sesión, límites de uso, o información de contexto que requiere atención sin interrumpir el flujo.

```html
<p class="session-warning">
  Tu sesión expira en 10 minutos. Guardá tu trabajo antes de continuar.
</p>
```

- Color ámbar (`var(--amber)`) con fondo y borde sutiles
- Max-width 52ch — nunca ocupa todo el ancho

---

### Runtime banner

Banner de estado que ocupa el ancho completo de un panel. Dos variantes según el estado de conexión.

```html
<!-- Datos de prueba (mock) -->
<div class="runtime-banner" data-state="mock">
  <div>
    <span>Modo demo</span>
    <strong>Datos de ejemplo activos</strong>
    <p>Conectá tu empresa para ver datos reales.</p>
  </div>
  <button class="btn btn-primary">Conectar</button>
</div>

<!-- Error de conexión -->
<div class="runtime-banner" data-state="error">
  <div>
    <span>Sin conexión</span>
    <strong>No se pudo alcanzar el servidor</strong>
    <p>Revisá tu conexión o intentá más tarde.</p>
  </div>
</div>
```

- `data-state="mock"` → borde cyan + glow (app corriendo con datos de prueba)
- `data-state="error"` → borde rojo (fallo de conexión)
- Sin `data-state` → neutro, solo fondo oscuro semitransparente

---

### Skeleton / Shimmer

Placeholders animados que reemplazan el contenido mientras carga. Evitan el efecto de "pantalla en blanco" y comunican que algo viene.

```html
<div class="card skeleton-card">
  <div class="skeleton-line skeleton-label" style="margin-bottom:10px"></div>
  <div class="skeleton-line skeleton-value" style="margin-bottom:14px"></div>
  <div class="skeleton-line skeleton-text"></div>
  <div class="skeleton-line skeleton-text" style="width:80%;margin-top:6px"></div>
</div>
```

Clases de tamaño disponibles:

| Clase | Ancho | Alto | Uso |
|---|---|---|---|
| `.skeleton-label` | 42% | 12px | Etiqueta / kicker |
| `.skeleton-value` | 70% | 28px | Valor numérico grande |
| `.skeleton-text` | 100% | 12px | Línea de texto |

- Animación: `yiqi-shimmer` — barrido horizontal de luz de 1.4s
- Se adapta al modo claro automáticamente

---

### Coherence badge

Badge de estado para tablas de coherencia contable — compara totales entre comprobantes (pedidos, remitos, facturas, cobranzas) y marca si están alineados.

```html
<!-- Datos coherentes -->
<span class="coherence-badge is-good">98.2%</span>

<!-- Diferencia detectada -->
<span class="coherence-badge is-alert">87.4%</span>
```

- `.is-good` → verde, diferencia < umbral aceptable
- `.is-alert` → ámbar, diferencia supera el umbral


### Toggle switch — borderless

```html
<label class="switch-label">
  <div class="switch-track on"><div class="switch-thumb"></div></div>
  <span class="switch-text">Notificaciones por email</span>
</label>
<label class="switch-label">
  <div class="switch-track"><div class="switch-thumb"></div></div>
  <span class="switch-text" style="color:var(--muted)">Modo mantenimiento</span>
</label>
```

```css
.switch-label { display:flex; align-items:center; gap:12px; cursor:pointer; user-select:none; }
.switch-track {
  position:relative; width:40px; height:22px; flex-shrink:0;
  background:var(--bg-soft);
  border-radius:999px;
  box-shadow:var(--shadow-sm);   /* profundidad por sombra, no borde */
  transition:background 200ms ease;
}
.switch-track.on { background:var(--cyan); }
.switch-thumb {
  position:absolute; top:3px; left:3px;
  width:16px; height:16px;
  background:var(--text); border-radius:50%;
  box-shadow:0 1px 4px rgba(0,0,0,.28);
  transition:transform 200ms cubic-bezier(.4,0,.2,1), background 200ms ease;
}
.switch-track.on .switch-thumb { transform:translateX(18px); background:#fff; }
.switch-text { font:500 13px var(--sans); color:var(--text); }
```

- **Filosofía:** borderless — el track usa `box-shadow` en lugar de `border`
- Estado on: `var(--cyan)` como fondo, thumb blanco
- Estado off: `var(--bg-soft)`, thumb en `var(--text)`

### Checkbox — borderless

```html
<label class="checkbox-label">
  <div class="checkbox checked">
    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
  </div>
  Importar datos al guardar
</label>
<label class="checkbox-label">
  <div class="checkbox"></div>
  <span style="color:var(--muted)">Enviar notificación al proveedor</span>
</label>
```

```css
.checkbox-label { display:flex; align-items:center; gap:10px; cursor:pointer; user-select:none; font:500 13px var(--sans); color:var(--text); }
.checkbox {
  width:18px; height:18px; flex-shrink:0;
  background:var(--bg-soft);
  border-radius:var(--radius-sm);
  box-shadow:var(--shadow-sm);   /* profundidad por sombra, no borde */
  display:grid; place-items:center;
  transition:background 180ms ease, box-shadow 180ms ease;
}
.checkbox.checked { background:var(--cyan); box-shadow:none; }
.checkbox svg {
  width:11px; height:11px; fill:none; stroke:#fff;
  stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round;
  opacity:0; transition:opacity 150ms ease;
}
.checkbox.checked svg { opacity:1; }
```

- **Filosofía:** borderless — unchecked usa `box-shadow`, nunca `border`
- Checked: `var(--cyan)` + checkmark SVG blanco inline

### Search Input

Componente de búsqueda borderless. Implementado en `site.css`.

```html
<div class="search-wrap">
  <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
  <input class="search-input" type="text" placeholder="Buscar…">
  <button class="search-clear" aria-label="Limpiar">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" width="14" height="14">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>
  <kbd class="search-kbd">⌘K</kbd>  <!-- opcional -->
</div>
```

```css
.search-wrap  { position: relative; display: block; }
.search-icon  { position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
                width: 15px; height: 15px; color: var(--muted-2); pointer-events: none; }
.search-input { width: 100%; height: 44px; padding: 0 40px;
                background: var(--bg-elev-2); border: 1px solid transparent;
                border-radius: var(--radius); color: var(--text);
                font: 400 13px var(--sans); outline: none; caret-color: var(--cyan); }
.search-input::placeholder { color: var(--muted-2); }
.search-input:focus { border-color: rgba(0,204,255,.3);
                      box-shadow: 0 0 0 3px var(--cyan-soft); }
.search-clear { position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                background: none; border: none; cursor: pointer;
                color: var(--muted-2); display: none; }
.search-clear.visible { display: block; }
.search-kbd   { position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                font: 500 10px var(--mono); color: var(--muted-2);
                background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
                border-radius: 4px; padding: 1px 5px; pointer-events: none; }
.search-kbd.hidden { opacity: 0; }
/* Sin ícono izquierdo */
.search-input--no-icon { padding-left: 14px; }
```

- `search-clear` se muestra/oculta con `.visible` según si hay texto
- `search-kbd` se oculta con `.hidden` cuando el input tiene foco
- Sin borde por defecto, focus ring cyan

---

## 9. Iconografía

**HTML standalone:** usar **SVG stroke inline**. El CDN de Phosphor puede fallar offline.

```html
<!-- Ejemplo SVG inline (recomendado para standalone) -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
     width="16" height="16">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9 22 9 12 15 12 15 22"/>
</svg>
```

**Next.js:** Phosphor Icons sigue siendo válido.

```html
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
```

| Ícono Phosphor | Módulo |
|---|---|
| `ph-house` | Inicio / Dashboard |
| `ph-chart-line-up` | Reportes / Analytics |
| `ph-shopping-cart` | Compras |
| `ph-package` | Inventario |
| `ph-receipt` | Facturación |
| `ph-users` | CRM / Clientes |
| `ph-gear-six` | Configuración |
| `ph-bell` | Notificaciones |
| `ph-magnifying-glass` | Búsqueda |

---

## 10. Principios UX

YiQi Design no es estética. Es diseño de **superficies de decisión sobre datos de negocio**.

**Pregunta central:** ¿Qué tiene que decidir el usuario ahora?

**Arquitectura de pantalla (orden obligatorio):**
1. Contexto — Hero card
2. Estado — KPIs
3. Dirección — Tendencias / gráficos
4. Diagnóstico — Tabla de detalle
5. Acción — CTA / decisión

**Regla:** arriba → decisión / abajo → explicación.

**Touch behavior:** envolver `:hover` en `@media (hover: hover)` para evitar el "doble tap" en móvil. Agregar `touch-action: manipulation` en elementos clickeables (divs con onclick, cards accordion, etc.).

```css
@media (hover: hover) {
  .card:hover { background: var(--cyan-soft-2); }
}
.card { touch-action: manipulation; cursor: pointer; }
```

**Anti-patrón:** títulos bicolor (texto + `em` en cyan) — recurso genérico sobreusado. Usar siempre `var(--text)` en títulos.

**Color semántico:** cyan = foco/acción · green = positivo · amber = alerta · red = crítico · muted = secundario.

---

## 11. Toggle de tema — 3 pasos *(actualizado en v1.2.5)*

El toggle tiene tres estados: **Oscuro / Sistema / Claro**. `Sistema` es el default — respeta la preferencia del sistema operativo del usuario.

```html
<html data-theme="system" lang="es">

<!-- Segmented control en topbar -->
<div class="theme-toggle" role="group" aria-label="Tema">
  <button class="theme-opt" onclick="setTheme('dark')">Oscuro</button>
  <button class="theme-opt" onclick="setTheme('system')">Sistema</button>
  <button class="theme-opt" onclick="setTheme('light')">Claro</button>
</div>
```

```js
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
applyTheme(resolveTheme());
```

> ⚠️ `toggleTheme()` binario está **deprecated** desde v1.2.5. Usar `setTheme(v)`.

---

## 12. Uso semántico del color

| Color | Token | Uso |
|---|---|---|
| Cyan | `--cyan` | CTA, links, foco, acción principal |
| Cyan muted | `--text-cyan-muted` | Subtítulos activos, kickers, labels acento |
| Green | `--green` | Éxito, positivo, incremento |
| Amber | `--amber` | Advertencia, instalación, acción secundaria |
| Red | `--red` | Error, peligro, decremento, eliminación |
| Purple | `--purple` | Acento decorativo secundario |
| Muted | `--muted` | Texto secundario, estados neutrales |

**Regla:** el color es semántico, nunca decorativo. No hardcodear hex — siempre tokens.

---

## 13. Reglas críticas de implementación

1. **Tokens siempre** — nunca hardcodear colores (`background: #000`, `fill="#17191c"`, etc.)
2. **Logo SVG inline** — nunca `<img>`. Símbolo Q adaptado por tema vía `var(--cyan)`.
3. **Borderless philosophy** — elementos de display sin borde; profundidad con `box-shadow: var(--shadow-sm)`. Excepción: inputs, selects, textareas, switches, checkboxes.
4. **Fondo sin grilla** — solo 2 radiales cyan. Sin `background-size` de grilla.
5. **`data-theme="system"` como default** — nunca `"dark"` ni `"light"` hardcodeado.
6. **Toggle 3 pasos** — `setTheme(v)` con `"dark" | "system" | "light"`. No `toggleTheme()`.
7. **`--text-cyan-muted`** — para estados activos y labels con acento. Nunca `var(--cyan)` directo en texto de estado.
8. **Plus Jakarta Sans** — importar y usar como `var(--display)` en títulos y heroes.
9. **SVG inline para íconos** en HTML standalone — no Phosphor CDN sin fallback.
10. **Spacing múltiplos de 4** — sin valores arbitrarios.
11. **Archivos self-contained** — fuentes y scripts embebidos o desde CDN confiable.
12. **Convención de nombres** — `[proyecto]-v1_0_0.html` (puntos → guiones bajos).
13. **Trazabilidad obligatoria de KPIs** — cada indicador visible debe incluir origen validable: módulo + campo(s) + agregado/fórmula + periodo.
14. **Composición de cuentas visible** — cuando un indicador represente una cuenta o total compuesto, debe aclarar qué incluye, qué excluye y con qué criterio.
15. **No inventar datos faltantes** — si la fuente no está disponible, mostrar estado "No disponible" o "Dato de ejemplo" explícitamente.

---

## 14. Checklist antes de deploy

- [ ] `data-theme="system"` en `<html>` como estado inicial
- [ ] Variables CSS completas en `:root` y `html[data-theme="light"]`
- [ ] Token `--text-cyan-muted` declarado en ambos modos
- [ ] Logo YiQi en SVG inline (nunca `<img>`)
- [ ] Fuentes Plus Jakarta Sans + Inter + IBM Plex Mono cargadas
- [ ] `overflow-x: clip` en `html, body` — no `hidden` (rompe `position: sticky`)
- [ ] `min-width: 0` en todos los containers del grid
- [ ] Toggle 3 pasos: `setTheme()` + `resolveTheme()` + listener `prefers-color-scheme`
- [ ] Cards, panels, badges sin `border` — profundidad por `box-shadow`
- [ ] Fondo con solo 2 radiales cyan (sin grilla `background-size`)
- [ ] Colores hardcodeados reemplazados por custom properties
- [ ] CTA canónica: **"Reserva tu demo"** (sin voseo)
- [ ] Nombre de marca: **YiQi**
- [ ] Footer con versión DS: `· DS v1.2.6`
- [ ] Todo KPI visible muestra fuente validable (módulo + campo(s) + agregado/fórmula + periodo)
- [ ] KPIs derivados o cuentas compuestas incluyen fórmula/composición en ayuda contextual
- [ ] KPIs sin fuente disponible se muestran como no disponibles o demo, nunca como reales

---

## 15. Dependencias estándar

```html
<!-- Fuentes -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<!-- Iconos (solo Next.js — en standalone usar SVG inline) -->
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">

<!-- Charts (cuando aplique) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

---

---

## 16. Patrón — Tabla de implementación

Combina un **timeline de 4 pasos numerados** con una **infografía de plazos por fases**. Se usa en propuestas e informes para comunicar el proceso de puesta en marcha.

### Clases

Prefijo `impl-` en todas las clases para evitar colisiones.

| Clase | Elemento |
|---|---|
| `.impl-timeline` | Grid de 4 columnas para los pasos |
| `.impl-tl-step` | Contenedor de cada paso (nodo + contenido) |
| `.impl-tl-node` | Círculo numerado en `var(--cyan)` |
| `.impl-tl-content` | Título + descripción centrados bajo el nodo |
| `.impl-plazos-card` | Card de plazos con barra + detalle |
| `.impl-plazos-bar` | Barra de 3 fases: cyan · green · amber |
| `.impl-plazos-phases` | Grid de 3 columnas con descripción por fase |
| `.impl-plazos-note` | Nota al pie con íconos y lista de aclaraciones |

### Tokens usados

`--bg-elev-2` · `--radius-lg` · `--shadow-sm` · `--cyan` · `--green` · `--amber` · `--mono` · `--display` · `--line`

### Fases de la barra (colores)

| Fase | Color | Semanas orientativas |
|---|---|---|
| Configuración | `--cyan` (25%) | Sem 1–3 |
| Módulos e integraciones | `--green` (42%) | Sem 4–8 |
| Ajuste · Go live | `--amber` (33%) | Sem 9–12 |

### Reglas

- El total de semanas se destaca con `font-size: 18px` en `var(--text)`, antecedido por el número en negrita.
- La nota al pie usa flex con ícono SVG inline alineado al tope + lista con `›` en `var(--cyan)`.
- Responsive: en `≤ 760px` el timeline pasa a 2 columnas; en `≤ 480px` a 1 columna y la línea conectora desaparece.

---

## 17. Patrón — Contador animado

Función `runCounters()` que anima cifras de `0` al valor destino con easing cúbico en 900 ms. Sin dependencias. Activación por `IntersectionObserver`.

### Atributos HTML

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-count` | number | Valor destino. Requerido. |
| `data-prefix` | string | Texto antes de la cifra. Ej: `$` |
| `data-suffix` | string | Texto después de la cifra. Ej: `%`, ` ped.` |

### Función canónica

```js
function runCounters(root = document) {
  root.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isInt  = Number.isInteger(target);
    const dur    = 900;
    let start = null;
    function fmt(v) {
      return isInt
        ? prefix + Math.round(v) + suffix
        : prefix + v.toFixed(1).replace('.', ',') + suffix;
    }
    el.textContent = fmt(0);
    function step(ts) {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      el.textContent = fmt(ease * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// Activación por IntersectionObserver
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { runCounters(e.target); io.unobserve(e.target); } });
}, { threshold: 0.3 });
document.querySelectorAll('.kpi-block').forEach(b => io.observe(b));
```

### Reglas

- Siempre inicializar los elementos en `0` antes de que el usuario los vea (evitar flash del valor final).
- Decimales: usar coma como separador decimal (`toFixed(1).replace('.', ',')`).
- Activar por `IntersectionObserver` cuando la cifra está fuera del viewport inicial.
- Tipografía canónica para cifras: `IBM Plex Mono`, `font-variant-numeric: tabular-nums`.

---

*YiQi ERP · Design System v1.2.6 · Última actualización: 02/06/2026*
*Reemplaza todas las versiones anteriores de yiqi-design.md*

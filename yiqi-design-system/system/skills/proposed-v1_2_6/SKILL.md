---
name: yiqi-ds
description: >
  Aplicar el Design System YiQi v1.2.6 a cualquier entregable de YiQi — sitio web
  (Next.js), HTMLs standalone (landing, propuestas, informes, dashboards, panel gerencial).
  Activar siempre que el usuario mencione "Design System", "DS", "tokens", "landing",
  "panel", "informe", "propuesta", o pida que algo "siga el estilo de YiQi".
  Sin este skill es muy fácil usar colores hardcodeados, inventar tokens, romper
  el dark/light toggle, o generar componentes fuera del sistema visual.
---

# YiQi Design System v1.2.6 — Skill de aplicación

Versión activa: **v1.2.6** (mayo 2026)

Cambios respecto a v1.2.5:
- **Patrón `depth-stack`** — 3 capas decorativas (grilla con fade radial · radiales spotlight · halo de frame) para secciones de marketing
- **Cards con multi-shadow** — sombras tinted navy (`rgba(8,16,32,…)`), nunca negro puro
- **Breakpoint `xxl ≥ 1440px`** — grids densos suman columna (módulos 4→5)
- **Preview takeover** — items del sidebar con `data-preview="..."` abren un iframe full-bleed
- **Tipografía display refinada** — `--font-display` para `.ds-section-title` y `.page-hero-title` (Greycliff CF con fallback)
- **Cifras KPI tabulares** — `.kpi-value` con IBM Plex Mono + `font-variant-numeric: tabular-nums`
- **Capa decorativa "estrellas lejanas"** — `.star-field` fixed con parallax sutil
- **Badge `.badge-google`** — excepción de marca externa con paleta oficial Google

Cambios respecto a v1.2.4:
- **Filosofía borderless** — cards y módulos sin borde; profundidad por sombra
- **Toggle 3 pasos** — Oscuro · Sistema · Claro (`"system"` como default)
- **Token `--text-cyan-muted`** — para estado activo/abierto y subtítulos con tinte cyan
- **Fondo según contexto** — solo radiales en dashboards/informes · radiales + grilla en landing/leads
- **Paleta recalibrada** — backgrounds más fríos, semánticos ajustados
- **Radius reducido** — `--radius` 14→10px, `--radius-sm` 10→7px, `--radius-xs` 6→5px
- **`--bg-soft` ahora rgba** — `rgba(255,255,255,.04)` en dark, `rgba(0,0,0,.04)` en light
- **`yiqi-runtime.js`** — JS compartido disponible como `<script>` standalone

---

## Contextos de entrega

| Contexto | Stack | Tokens |
|---|---|---|
| Sitio web (www.yiqi.com.ar) | Next.js + Tailwind v4 | `--ds-*` |
| HTML standalone (informes, propuestas, panel) | HTML puro | `--*` (sin prefijo) |

**Regla:** en HTML standalone nunca usar `--ds-*`.

---

## Tokens completos — HTML standalone

```css
:root {
  /* Backgrounds */
  --bg:          #0c0c0e;
  --bg-elev:     #111114;
  --bg-elev-2:   #18181c;
  --bg-soft:     rgba(255,255,255,.04);

  /* Bordes */
  --line:        rgba(255,255,255,.08);
  --line-strong: rgba(255,255,255,.14);

  /* Texto */
  --text:        #f0f1f3;
  --muted:       #8a8d94;
  --muted-2:     #5a5d66;

  /* Marca */
  --cyan:        #00ccff;
  --cyan-soft:   rgba(0,204,255,.12);
  --cyan-soft-2: rgba(0,204,255,.18);
  --cyan-label:  rgba(0,204,255,.52);

  /* v1.2.5 — texto con tinte cyan, vibe muted */
  --text-cyan-muted: rgba(0,195,240,.45);

  /* Semánticos */
  --green:       #00c48c;
  --green-soft:  rgba(0,196,140,.12);
  --amber:       #f6a623;
  --amber-soft:  rgba(246,166,35,.12);
  --red:         #f25f5c;
  --red-soft:    rgba(242,95,92,.12);
  --blue:        #7ab7ff;
  --purple:      #a78bfa;
  --purple-soft: rgba(167,139,250,.12);
  --warm:        #b5a090;
  --warm-soft:   rgba(181,160,144,.10);

  /* Efectos */
  --glow:        0 0 0 3px rgba(0,204,255,.22);
  --shadow-sm:   0 1px 3px rgba(0,0,0,.35), 0 1px 8px rgba(0,0,0,.18);
  --shadow-md:   0 4px 16px rgba(0,0,0,.28);
  --shadow-lg:   0 8px 32px rgba(0,0,0,.36);

  /* Tipografía */
  --sans:        "Inter", ui-sans-serif, system-ui, sans-serif;
  --mono:        "IBM Plex Mono", ui-monospace, monospace;
  --display:     "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;

  /* Layout */
  --sidebar-w:   240px;
  --topbar-h:    56px;

  /* Border Radius */
  --radius-xs:   5px;
  --radius-sm:   7px;
  --radius:      10px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-pill: 999px;
  --tr:          180ms ease;
}

html[data-theme="light"] {
  --bg:          #f5f4f0;
  --bg-elev:     #eeece7;
  --bg-elev-2:   #e6e4df;
  --bg-soft:     rgba(0,0,0,.04);

  --line:        rgba(0,0,0,.08);
  --line-strong: rgba(0,0,0,.13);

  --text:        #17191c;
  --muted:       #586170;
  --muted-2:     #7f8896;

  --text-cyan-muted: rgba(0,140,175,.48);

  --cyan:        #009fc7;
  --cyan-soft:   rgba(0,159,199,.12);
  --cyan-soft-2: rgba(0,159,199,.18);
  --cyan-label:  rgba(0,159,199,.52);

  --green:       #0c9b6d;
  --amber:       #c78000;
  --red:         #d4485e;
  --blue:        #347de6;
  --purple:      #7c3aed;

  --glow:        0 0 0 3px rgba(0,159,199,.22);
  --shadow-sm:   0 2px 8px rgba(16,36,54,.08);
  --shadow-md:   0 8px 24px rgba(16,36,54,.12);
  --shadow-lg:   0 16px 32px rgba(16,36,54,.16);
}
```

---

## Reglas de marca (no negociables)

- Siempre escribir **YiQi** — Y mayúscula, i minúscula, Q mayúscula
- CTA canónico: **"Reserva tu demo"** — nunca "Agendá", "Solicitar demo", "Agendar"
  - Link: `https://calendly.com/javierperez/meet-30-demo`
- Copy: **español neutro** — sin voseo ("tenés"→"tienes", "sabés"→"sabes")
- Logo: siempre **SVG inline** — nunca `<img src="logo.svg">`
- Fondo: **solo radiales** en dashboards e informes · **radiales + grilla** en landing y leads

---

## Fondo de pantalla

Dos variantes según el contexto del entregable:

### Variante A — Solo radiales (default para dashboards, informes, panels)

```css
/* Uso: panel gerencial, dashboards, informes operativos */
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

### Variante B — Radiales + grilla (marketing, landing, leads)

```css
/* Uso: landing pages, propuestas comerciales (leads), sitio web */
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

**Cuándo usar cada una:**

| Variante | Contexto |
|---|---|
| Solo radiales | Dashboard, informe, panel gerencial, cualquier app funcional |
| Radiales + grilla | Landing, propuesta comercial (leads), sitio web (www.yiqi.com.ar) |

---

## Filosofía borderless (v1.2.5)

**Regla general:** elementos display (cards, panels, módulos) usan `box-shadow` para elevación, NO `border`.

```css
/* ✓ Card borderless */
.card {
  background: var(--bg-elev);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);   /* profundidad por sombra */
  border: none;
}
.card:hover {
  box-shadow: 0 0 0 1px rgba(0,204,255,.12) inset, var(--shadow-md);
}

/* ✓ Excepción: controles interactivos SÍ llevan borde */
.input, .select, .textarea, .checkbox, .switch {
  border: 1px solid var(--line);
}
.input:focus { border-color: rgba(0,204,255,.28); }
```

---

## Token --text-cyan-muted (v1.2.5)

Para estado activo/abierto y subtítulos con tinte cyan — nunca para CTAs.

```css
/* ✓ Usar en: estado open de módulos, subtítulos de sección */
.module.open .module-title { color: var(--text-cyan-muted); }

/* ✗ NO usar en: botones CTA, badges de acento, texto de cuerpo */
```

- Dark: `rgba(0,195,240,.45)` — cálido y contenido
- Light: `rgba(0,140,175,.48)` — más saturado para contraste

---

## Toggle de tema 3 pasos (v1.2.5)

`"system"` es el default. El HTML initial state es `data-theme="system"`.

```html
<!-- HTML -->
<html data-theme="system">

<!-- Switch -->
<div class="theme-toggle">
  <button class="theme-opt" data-val="dark"   onclick="YiQi.setTheme('dark')">Oscuro</button>
  <button class="theme-opt" data-val="system" onclick="YiQi.setTheme('system')">Sistema</button>
  <button class="theme-opt" data-val="light"  onclick="YiQi.setTheme('light')">Claro</button>
</div>
```

**Con yiqi-runtime.js** (recomendado):
```html
<script src="/system/sdk/yiqi-runtime.js"></script>
<!-- El toggle y la inicialización están incluidos — no copiar el bloque de JS manualmente -->
```

**Sin yiqi-runtime.js** (inline):
```js
const _mq = window.matchMedia('(prefers-color-scheme: dark)');
function resolveTheme(v) { return v === 'system' ? (_mq.matches ? 'dark' : 'light') : v; }
function applyTheme(v)   { document.documentElement.dataset.theme = resolveTheme(v); }
function setTheme(v) {
  localStorage.setItem('yiqi-theme', v);
  applyTheme(v);
  document.querySelectorAll('.theme-opt').forEach(b =>
    b.classList.toggle('active', b.dataset.val === v));
}
_mq.addEventListener('change', () => {
  if ((localStorage.getItem('yiqi-theme') || 'system') === 'system') applyTheme('system');
});
(function() {
  const s = localStorage.getItem('yiqi-theme') || 'system';
  applyTheme(s);
  document.addEventListener('DOMContentLoaded', () =>
    document.querySelectorAll('.theme-opt').forEach(b =>
      b.classList.toggle('active', b.dataset.val === s)));
})();
```

---

## yiqi-runtime.js — JS compartido

```html
<script src="/system/sdk/yiqi-runtime.js"></script>
```

```js
YiQi.setTheme('dark'|'system'|'light')  // cambia y persiste el tema
YiQi.toast('msg', 'success'|'error'|'warning'|'info')
YiQi.initSortable(tableEl)              // tabla sorteable (th[data-col])
YiQi.initScrollSpy({ sections, navItems })
YiQi.fmt.currency(1500000)  // → $ 1.500.000
YiQi.fmt.number(12345)      // → 12.345
YiQi.fmt.percent(12.3)      // → 12,3 %
YiQi.fmt.date('2026-04-30') // → 30/04/2026
YiQi.fmt.dateShort(d)       // → 30 abr
```

---

## Logo YiQi — SVG inline

```html
<!-- Clases helper -->
<style>.yql{fill:var(--text)}.yqs{fill:var(--cyan)}</style>

<!-- Siempre SVG inline, nunca <img src="logo.svg"> -->
<svg viewBox="0 0 100 65" xmlns="http://www.w3.org/2000/svg" aria-label="YiQi">
  <!-- letras Y, i, i → var(--text) -->
  <!-- símbolo Q      → var(--cyan) -->
</svg>
```

---

## Topbar

```css
.topbar {
  position: sticky; top: 0; z-index: 100;
  height: var(--topbar-h);           /* 56px */
  display: flex; align-items: center;
  padding: 0 28px; gap: 16px;
  background: rgba(12,12,14,.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line);
}
html[data-theme="light"] .topbar {
  background: rgba(238,236,231,.88);
}
```

---

## Sidebar

```css
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;  /* 240px */
  min-height: 100vh;
}
.sidebar {
  position: sticky; top: 0; height: 100vh;
  overflow-y: auto; padding: 24px 16px;
  background: linear-gradient(180deg, rgba(24,24,28,.96), rgba(17,17,20,.92));
  backdrop-filter: blur(18px);
  border-right: 1px solid var(--line);
}
```

---

## Componentes base

### Botón

```css
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px; border-radius: var(--radius);
  font: 500 13px var(--sans); cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--tr);
}
.btn-primary {
  background: var(--cyan-soft-2);
  border-color: rgba(0,204,255,.28);
  color: var(--cyan);
}
.btn-primary:hover { background: var(--cyan-soft); }

.btn-ghost {
  background: transparent; color: var(--muted);
}
.btn-ghost:hover { background: var(--bg-soft); color: var(--text); }
```

### Badge (sin borde en dark, borde en light)

```css
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 8px; border-radius: var(--radius-pill);
  font: 600 11px var(--mono);
  border: 1px solid transparent;
}
.badge-cyan   { color: var(--cyan);  background: var(--cyan-soft); }
.badge-green  { color: var(--green); background: var(--green-soft); }
.badge-amber  { color: var(--amber); background: var(--amber-soft); }
.badge-red    { color: var(--red);   background: var(--red-soft); }

/* Light mode: agregar borde sutil */
html[data-theme="light"] .badge { border-color: currentColor; opacity on border: .22; }
```

### Input (excepción — siempre lleva borde)

```css
.input {
  background: var(--bg-elev);
  border: 1px solid var(--line);   /* ← excepción documentada */
  border-radius: var(--radius);
  color: var(--text); padding: 10px 12px;
  font: 14px var(--sans);
  transition: border-color var(--tr);
}
.input:focus { outline: none; border-color: rgba(0,204,255,.28); box-shadow: var(--glow); }
```

---

## Módulo accordion borderless

```css
.module-card {
  border: none;
  border-radius: var(--radius-md);
  background: var(--bg-elev-2);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
/* Estado abierto — usar text-cyan-muted, no cyan puro */
.module-card.open {
  box-shadow: 0 0 0 1px rgba(0,204,255,.10) inset, var(--shadow-md);
}
.module-card.open .module-title { color: var(--text-cyan-muted); }
```

---

## Animaciones de entrada

```css
.card-reveal {
  opacity: 0;
  transition: opacity .65s cubic-bezier(.22,1,.36,1),
              transform .65s cubic-bezier(.22,1,.36,1);
}
.card-reveal:nth-child(odd)  { transform: translateX(-52px) translateY(12px); }
.card-reveal:nth-child(even) { transform: translateX(52px)  translateY(12px); }
.card-reveal:nth-child(1) { transition-delay: .00s; }
.card-reveal:nth-child(2) { transition-delay: .07s; }
.card-reveal:nth-child(3) { transition-delay: .14s; }
.card-reveal:nth-child(4) { transition-delay: .21s; }
.card-reveal.visible { opacity: 1; transform: none; }
```

---

## Checklist HTML standalone (v1.2.5)

- [ ] `<html data-theme="system">` como estado inicial
- [ ] `:root` completo + `html[data-theme="light"]` con todos los overrides
- [ ] `--text-cyan-muted` definido en ambos modos
- [ ] `body` con variante de fondo correcta: solo radiales (dashboard) o radiales + grilla (marketing)
- [ ] Logo SVG inline — letras `var(--text)`, Q `var(--cyan)`
- [ ] Topbar con `backdrop-filter: blur(16px)`, height `56px`
- [ ] Íconos como SVG stroke inline (nunca `ph ph-*` sin CDN)
- [ ] Cards y módulos: `box-shadow` en lugar de `border`
- [ ] `overflow-x: hidden` en html y body
- [ ] Footer: `© [año] YiQi S.A. · [Nombre] · DS v1.2.5`
- [ ] Copy en español neutro sin voseo
- [ ] CTA → `calendly.com/javierperez/meet-30-demo`

---

## URLs canónicas YiQi

| Propósito | URL |
|---|---|
| Demo | calendly.com/javierperez/meet-30-demo |
| Sitio | yiqi.com.ar |
| Login | me.yiqi.com.ar |
| API Docs | apidoc.yiqi.com.ar |
| Soporte | sites.google.com/yiqi.com.ar/ayudaerp |
| WhatsApp | wa.me/5491123727422 |

---

*YiQi ERP · Design System v1.2.5 · 30/04/2026*

---

## Depth stack (v1.2.6)

Patrón de profundidad para secciones de **landing/marketing** con grids densos. Tres capas no intrusivas sobre la sección + cards con multi-shadow tinted.

```css
.depth-section {
  position: relative; overflow: hidden; isolation: isolate;
}

/* Capa 1 — Grilla con fade radial */
.depth-section::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 0%, #000 45%, transparent 82%);
}

/* Capa 2 — Radiales spotlight */
.depth-section::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 55% 38% at 50% -6%, rgba(0,204,255,.10), transparent 62%),
    radial-gradient(ellipse 85% 50% at 50% 118%, rgba(0,204,255,.045), transparent 68%);
}

/* Capa 3 — Halo detrás del grid */
.depth-grid { position: relative; }
.depth-grid::before {
  content: ""; position: absolute; inset: -28px -40px; z-index: -1;
  background: radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0,204,255,.05), transparent 70%);
}

/* Card con sombra tinted navy — NUNCA usar rgba(0,0,0,...) */
.depth-card {
  background:
    linear-gradient(180deg, rgba(255,255,255,.024), transparent 38%),
    var(--bg-elev-2);
  box-shadow:
    0 1px 0 rgba(255,255,255,.045) inset,
    0 2px 6px rgba(8,16,32,.28),
    0 14px 32px rgba(8,16,32,.40);
}
.depth-card:hover {
  box-shadow:
    0 1px 0 rgba(0,204,255,.20) inset,
    0 4px 14px rgba(8,16,32,.32),
    0 18px 44px rgba(0,204,255,.10),
    0 22px 56px rgba(8,16,32,.44);
}
```

**Cuándo usarlo:** landing, propuestas, leads. **Cuándo NO:** dashboards, informes, formularios.

---

## Breakpoint xxl (v1.2.6)

```css
@media (min-width: 1440px) {
  .mod-grid     { grid-template-columns: repeat(5, 1fr); gap: 14px; }
  .kpi-grid     { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}
```

| Breakpoint | Ancho      | Cambio                                              |
|-----------|------------|-----------------------------------------------------|
| **xxl**   | >= 1440px  | Grids densos +1 col (modulos 4 -> 5, KPIs 4 -> 5)   |
| xl        | > 1200px   | Layout completo                                     |
| lg        | <= 1200px  | 2 col KPIs                                          |
| md        | <= 980px   | Sidebar colapsable                                  |
| sm        | <= 720px   | 1 columna global                                    |

---

## Tipografia display (v1.2.6)

```css
:root {
  --font-display: "Greycliff CF", "GreycliffCF",
                  "Plus Jakarta Sans", "Inter", ui-sans-serif, sans-serif;
}

.ds-section-title,
.page-hero-title {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -.025em;
}

.kpi-value {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-feature-settings: "tnum" 1, "lnum" 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -.01em;
}
```

**Importante:** Greycliff CF es comercial. El fallback a Plus Jakarta Sans mantiene
el sistema funcionando sin licencia activa.

---

## Capa decorativa "estrellas lejanas" (v1.2.6)

```html
<body>
  <div class="star-field" aria-hidden="true"></div>
  ...
</body>
```

```css
.star-field {
  position: fixed; inset: 0; pointer-events: none;
  z-index: 1; overflow: hidden; mix-blend-mode: screen;
}
html[data-theme="light"] .star-field { mix-blend-mode: multiply; }

.star-field::before, .star-field::after {
  content: ""; position: absolute; inset: -50%;
  background-image:
    radial-gradient(1px 1px at 12% 8%,  rgba(0,204,255,.55), transparent 60%),
    radial-gradient(1px 1px at 24% 18%, rgba(255,255,255,.35), transparent 60%);
  /* ... ~20-25 estrellas distribuidas */
}
```

**Reglas:** solo landing/marketing, respetar `prefers-reduced-motion: reduce`.

---

## Marca externa Google (v1.2.6)

```css
.badge-google {
  background: conic-gradient(from 0deg at 50% 50%,
              #4285F4 0deg 90deg,
              #DB4437 90deg 180deg,
              #F4B400 180deg 270deg,
              #0F9D58 270deg 360deg);
  color: #fff;
  font: 700 9px "Google Sans", "Product Sans", sans-serif;
  letter-spacing: .12em;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
}
```

**Reglas:** solo para productos Google (Workspace, Ads, Looker Studio). No reutilizar fuera de ese contexto.

---


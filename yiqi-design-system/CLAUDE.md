# YiQi Design System — Instrucciones para Claude

## Archivo de referencia primario

`yiqi-design-system.html` es **el archivo de referencia principal del DS**.
Todo cambio de componente, token o patrón debe reflejarse en él, además de en los MD y CSS correspondientes.

## Regla crítica: cero inline styles en index.html

El archivo `yiqi-design-system.html` es el DS en sí mismo. Un inline style de tipografía, color o fondo es una violación directa del sistema.

**Antes de agregar cualquier bloque HTML a `index.html`:**
1. Leer los patrones existentes en `ds-doc.css` para ese tipo de contenido
2. Identificar la clase DS correcta (ver tabla abajo)
3. Nunca usar `style="font:..."`, `style="color:..."`, `style="background:..."` — solo clases

**Clases DS para contenido documental:**

| Uso | Clase |
|-----|-------|
| Descripción de sección | `ds-section-sub` |
| Rótulo de subsección | `subsection-title` |
| Etiqueta de tamaño/variante | `logo-label` |
| Nota de especificación técnica | `swatch-hex` |
| Texto kicker de sección | `ds-section-kicker` |
| Título de sección | `ds-section-title` |

**Inline styles permitidos únicamente para:**
- `margin-top` / `margin-bottom` de ajuste puntual de espaciado
- `height` / `width` en SVGs de demo
- Atributos `fill` en paths SVG de demo (cuando CSS vars no alcanzan)

## Estructura de secciones

Cada bloque de contenido va **dentro** de su `<section class="ds-section" id="...">`.
Nunca dejar bloques flotando entre `</section>` y `<section>`.

## Botones

Siempre `class="btn btn-primary"`, nunca solo `class="btn-primary"`.
Spec DS: `background: var(--cyan-soft)` · `border-color: rgba(0,204,255,.28)` · `color: var(--cyan)`.
**Sin sombra. Sin `transform: translateY`.**

## Colores del logo YiQi (Q)

El fill de la Q siempre es `var(--cyan)`. Nunca hardcodear `#00ccff` ni `#009fc7` en el logo YiQi.

## Logo iA Ready

- `.iar` → `fill: var(--text)` · `.iar-a` → `fill: var(--cyan)`
- En demos con fondo fijo: hardcodear fills directamente en los paths SVG
  - Dark: letras `#f0f1f3` · A `#00ccff` — Light: letras `#17191c` · A `#009fc7`

## Voseo

Español neutro: `tenés→tienes`, `Coordiná→Coordina`, `encontrás→encuentras`, `Contactanos→Contáctanos`.

# YiQi Design System — v1.2.5

Repositorio canónico del sistema de diseño de YiQi ERP.

---

## Estructura

```
/
├── content/
│   ├── context/
│   │   └── YiQi ERP — Contexto para IA.md   ← contexto de producto para prompts
│   │
│   ├── design-system/
│   │   ├── yiqi-design.md                    ← GUÍA MAESTRA v1.2.5 (referencia completa)
│   │   └── archive/
│   │       ├── YiQi_DS_v1_2_4.md
│   │       ├── YiQi_DS_v1_2_4_Recipe.md
│   │       └── YiQi_DS_v1_2_5_Recipe.md      ← reemplazado por yiqi-design.md
│   │
│   └── prompts/
│       └── execution.md                      ← RECETA PARA IA (prompt maestro + tokens)
│
├── examples/
│   ├── design-system/
│   │   ├── index.html                        ← showcase completo del DS
│   │   ├── styles.css                        ← CSS standalone v1.2.5 (para Christian)
│   │   └── ds-doc.css                        ← estilos de la documentación interna
│   │
│   ├── dashboards/
│   │   └── index.html
│   │
│   ├── marketplace/
│   │   └── index.html
│   │
│   ├── landing/
│   │   └── YiQi_Landing_DS.html
│   │
│   ├── leads/
│   │   └── YiQi_MelCity_ERP_v1.8.html
│   │
│   └── ecosan/
│       └── ecosan_informe.html
│
├── informes/
│   ├── informes-index.html
│   └── 2026-04-22.html
│
├── system/
│   ├── icons/
│   │   ├── LOGO YiQi 100x65.svg
│   │   ├── LOGO YiQi 100x65 NEGATIVO.svg
│   │   ├── iAready.svg
│   │   ├── LOGOS CLIENTES/
│   │   └── LOGOS INTEGRACIONES/
│   │
│   ├── sdk/
│   │   ├── foundation/
│   │   │   ├── tokens.css                    ← tokens DS v1.2.5
│   │   │   ├── themes.css                    ← overrides light mode
│   │   │   └── base.css                      ← reset + componentes base
│   │   ├── components/
│   │   ├── core/
│   │   ├── elements/
│   │   ├── index.css                         ← entry point CSS del SDK
│   │   └── index.js
│   │
│   └── skills/
│       ├── yiqi-ds-v1_2_5.skill              ← skill activo DS v1.2.5
│       ├── yiqi-charts.skill
│       ├── yiqi-dashboard.skill
│       ├── yiqi-3d.skill
│       ├── iAready.skill
│       └── archive-yiqi-ds-v1_2_4.skill      ← archivado
│
├── archive/                                  ← versiones anteriores de entregables
├── DS_AUDIT_v1_2_5.html                      ← auditoría DS v1.2.5 (30/04/2026)
├── index.html                                ← landing principal
├── CHANGELOG.md
├── netlify.toml
└── README.md
```

---

## Archivos clave por audiencia

| Quién | Archivo | Para qué |
|---|---|---|
| Developer (Christian) | `examples/design-system/styles.css` | CSS standalone para incluir en HTML |
| Developer (SDK) | `system/sdk/index.css` | Entry point del SDK modular |
| IA / Claude | `content/prompts/execution.md` | Prompt maestro + tokens para generar entregables |
| Referencia / Diseño | `content/design-system/yiqi-design.md` | Guía completa del sistema |

---

## Versión activa

**DS v1.2.5** · 30/04/2026

Cambios principales respecto a v1.2.4:
- Filosofía borderless (cards, módulos y panels sin borde; sombra por elevación)
- Toggle de tema 3 pasos: Oscuro · Sistema · Claro (`"system"` por defecto)
- Token `--text-cyan-muted` para subtítulos con tinte cyan
- Fondo sin grilla — solo 2 radiales + `var(--bg)`
- Paleta dark ajustada: backgrounds más fríos, colores semánticos recalibrados
- Radius system reducido: `--radius` 14→10px, `--radius-sm` 10→7px


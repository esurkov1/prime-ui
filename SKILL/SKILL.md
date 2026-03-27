---

## name: prime-ui-kit  
description: >  
  Builds responsive, mobile-first screens with prime-ui-kit: CSS Grid for page/shell layouts and grids,
  Flexbox for local stacks/toolbars, CSS Modules, and --prime-sys-* tokens.
  Use when laying out pages, templates, forms, navigation, or dashboards; converting desktop layouts to  
  mobile-first; picking a component for a region; validating breakpoints, touch targets, or Drawer vs inline.  
  Includes recipes (dashboard, settings, catalog, landing, form wizard), a 47-entry component catalog, per-component `examples/*.tsx` scenarios, and anti-patterns.  
  Non-negotiable: no custom wrappers or reskins of kit components—only primitives, default styles, and the public API.

# prime-ui-kit

**Agent role:** implement UI strictly through documented prime-ui-kit components and semantic tokens; do not “improve” appearance with wrappers or overrides of kit styles.

## When to use

- Layout or reflow across viewports, touch, and overlays.
- Questions like what to use for a region, or how to structure grid / sidebar / footer within the kit.
- Checking design-system compliance (tokens, sizing, accessibility).

## Where to read docs


| What                            | In this repo                                     | After `npm install prime-ui-kit`                                |
| ------------------------------- | ------------------------------------------------ | --------------------------------------------------------------- |
| API, props, canonical example   | `../src/components/<kebab>/COMPONENT.md`         | `node_modules/prime-ui-kit/src/components/<kebab>/COMPONENT.md` |
| Extended scenario code (copy-paste) | `../src/components/<kebab>/examples/*.tsx`   | same path under `node_modules/prime-ui-kit/`                    |
| Sidebar                         | `../src/layout/sidebar/COMPONENT.md` + `examples/` | same pattern under `node_modules/prime-ui-kit/src/layout/sidebar/` |
| Tokens                          | `[design-tokens.md](./design-tokens.md)`         | `node_modules/prime-ui-kit/src/styles/` (CSS + `package.json` exports) |
| All components + layout shells (catalog table) | `[component-catalog.md](./component-catalog.md)` | only in this repo’s `SKILL/` (not in the npm tarball)           |


Cursor skill: copy the whole `SKILL/` directory from the GitHub repository — it is not published to npm.

### Application layout (canonical)

- **`AppShell.Template`** + **`Sidebar`** in `nav` + **`Outlet`** (or page children) in **`main`**: edge padding for the content column is **only** from **`AppShell.MainInset`** inside the kit — do not add a second inset wrapper or ad‑hoc page margins.
- **`PageContent.Section`** or **`PageContent.Root`** for page structure; avoid duplicating outer padding that **`MainInset`** already applies.

### How to use `COMPONENT.md` + `examples/` (agents)

1. **Read order:** open `COMPONENT.md` → use the **Canonical example** (single maximal block) for the full public API in one place → follow **Extended examples** links to `./examples/<file>.tsx` for product-style compositions (dashboard, settings, checkout, etc.).
2. **Do not** treat playground snippets as the only truth; they are minimal demos. Prefer **`examples/*.tsx`** for “finished” compositions.
3. **Compound components** always use the documented subcomponents (`Typography.Root`, `Button.Root`, `LinkButton.Root`, `Modal.Root`, …). Never use namespace objects as JSX tags (e.g. `<Typography>` is invalid).
4. **Layout-only CSS** in examples may use `examples.module.css` with `var(--prime-sys-*)` only — same rules as app layout.
5. **Chunking for LLMs:** one file per scenario keeps retrieval precise; a single giant `examples.md` is **not** used.

---

## Non-negotiable rules

1. **Semantic tokens only** — color, spacing, radii, shadows, z-index, and motion come from `--prime-sys-`*. Do not use raw `--prime-ref-*` in layout.
2. **No visual literals** — no hex colors or bare px for spacing, radius, shadow, or z-index in layout styles.
3. **Theming via `data-theme`** — components do not hard-code light/dark; roles stay semantic.
4. **CSS Modules + variables** — Tailwind is not part of prime-ui-kit.
5. **Control sizing via `size`** — layout does not override button or field heights.
6. **Default size `m`** — for any component with a `size` axis unless the scenario explicitly needs another value.

### Raw kit only — no custom shells


| Do not                                                                                                                                                     | Do                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wrap kit components to change look or behavior; swap markup; override kit CSS (ad-hoc `className`, inline styles from another system, `div`/`span` clones) | Use standard composition and the **public API** only: props (`size`, `variant`, `mode`, `fullWidth`, …), documented subcomponents, `ControlSizeProvider`, `data-theme`, and `--prime-sys-`* on **page-level surfaces**—not on “reskinned” internals |


Breaking this drifts from the design system, weakens accessibility guarantees, and makes upgrades unsafe.

### Token cheat sheet (layout)


| Category   | Prefix                           | Examples                       |
| ---------- | -------------------------------- | ------------------------------ |
| Background | `--prime-sys-color-surface-`*    | default, raised, overlay       |
| Text       | `--prime-sys-color-content-*`    | primary, secondary, muted      |
| Border     | `--prime-sys-color-border-*`     | separator, subtle, strong      |
| Spacing    | `--prime-sys-spacing-*`          | s, l, 2xl, 4xl                 |
| Radii      | `--prime-sys-shape-radius-*`     | m, 4xl                         |
| Shadows    | `--prime-sys-elevation-shadow-*` | surface, modal                 |
| Z-index    | `--prime-sys-elevation-zIndex-*` | sticky, modal                  |
| Motion     | `--prime-sys-motion-*`           | duration-fast, easing-standard |


Full reference: `[design-tokens.md](./design-tokens.md)`.

---

## Layout principles

- **Mobile-first:** start with a single column (`grid-template-columns: 1fr` or `flex-direction: column`); expand to several columns at `@media (min-width: …)`.
- **Breakpoints:** `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 — place them where the layout breaks, not by device name.
- **CSS Grid (предпочтительно для каркаса и сеток):** страница приложения (`AppShell`) — `grid-template-columns: auto minmax(0, 1fr)` (навигация + колонка с `minmax(0, 1fr)` чтобы не ломалось переполнение); карточные сетки — `display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, …), 1fr)); gap: var(--prime-sys-spacing-*)`; при необходимости `grid-template-areas` для слотов header / main / footer.
- **Flexbox (локально):** ряды кнопок, выравнивание в тулбаре, вертикальный стек внутри карточки/формы, «хвост» sticky footer внутри колонки — там, где не нужна двумерная сетка.
- **Spacing:** `gap` / `padding` / `margin` only from `--prime-sys-spacing-`*; for fluid spacing use e.g. `clamp(var(--prime-sys-spacing-s), 2vw, var(--prime-sys-spacing-xl))` — avoid mixing literals and tokens in one rule without good reason.
- **Touch:** minimum 44×44 px (WCAG 2.5.5); on mobile use Button / Input / Select at `size="l"`; pad Checkbox / Radio / Switch hit areas; LinkButton at least `m`.
- **Navigation:** desktop — Sidebar в колонке `auto` (или фиксированный `minmax`); below `md` — Sidebar in a left Drawer; Breadcrumb with `maxItems`; Tabs horizontal scroll or Accordion; CommandMenu reachable from a button on all widths.

---

## Recipes (compact)

**Dashboard:** Sidebar + header (Breadcrumb, Avatar, CommandMenu) + content (Tabs, DataTable, ProgressBar, Badge). **Card:** `mini` / `mini-media` / `metric` / `panel` (график), плюс `stat-trend`, `cta`, `list`, `split`, `cover` — см. `COMPONENT.md`. At `≥ lg` — двухколоночный каркас (часто `AppShell`, CSS Grid); below `lg` stack and move the sidebar to a Drawer; scroll Tabs; below `md` use a horizontally scrolling table with a pinned column; below `sm` use a vertical Stepper if needed.

**Settings:** side section nav + form (Label, Input, Select, Switch, Textarea, Button). At `≥ md` — две колонки (grid/flex row); below `md` turn the sidebar into Tabs or Accordion; fields `fullWidth`; form footer — ButtonGroup, `justify-end`; below `sm` buttons `fullWidth`.

**Catalog:** search + SegmentedControl + filters + card grid. Filters в боковой колонке (`minmax` / фикс. ширина) at `≥ md`; карточки — CSS Grid (`repeat(auto-fill, minmax(…))`); below `md` filters in a bottom Drawer; below `sm` single column; many segments — use Select on narrow widths; Pagination in compact mode.

**Landing:** sections as a column with `max-width` and centering; Hero stacks below `md`, text + media in a row at `≥ md`; FAQ — Accordion; below `md` nav in a Drawer; CTA — ButtonGroup, vertical on narrow widths.

**Form wizard:** Stepper (horizontal at `≥ md`, vertical otherwise) + step column with `max-width` ~600px; actions `space-between`; on mobile the step can live in Modal or Drawer; ProgressBar under progress; below `sm` buttons `fullWidth`, larger DigitInput.

Per-component details live in each `COMPONENT.md` where present; the full overview (including **ExampleFrame**, **ScrollContainer** without a separate COMPONENT.md) is in `[component-catalog.md](./component-catalog.md)` — **AppShell** has `[../src/layout/app-shell/COMPONENT.md](../src/layout/app-shell/COMPONENT.md)`.

---

## Component catalog

Every exported component is documented under `../src/components/<kebab-name>/COMPONENT.md`. Full list and scenarios: `[component-catalog.md](./component-catalog.md)` — do not duplicate long tables here (progressive disclosure).

---

## Anti-patterns

1. `100vw` instead of `100%` — scrollbar width causes horizontal overflow.
2. `height: 100vh` on mobile without accounting for Safari’s dynamic chrome — prefer `min-height: 100dvh` or a fallback with `-webkit-fill-available`.
3. Sidebar column without `minmax(0, 1fr)` on the main track / `grid-template-columns` without `minmax` on the fluid column — main content can overflow instead of scrolling; в flex-режиме — без `flex-shrink: 0` / `flex: 0 0 <width>` боковая колонка сжимается.
4. Wide tables without a scroll wrapper — use DataTable (`overflow-x`, pinned column).
5. Centered Modal on mobile for long flows — prefer a bottom Drawer below `md`.
6. Small tap targets on mobile — see Touch above.
7. Fixed px on flex items with no adaptation — use `flex-basis` + min/max or `%` / `clamp`.
8. Hard-coded `#…`, `gap: 16px`, `z-index: 999`, etc. instead of `--prime-sys-`*.
9. Custom wrappers and reskins — see **Raw kit only** above.

---

## Checklist before answering the user

- Visuals use `--prime-sys-`* only; no bypassing the kit with custom wrappers.
- Control sizes via props; default `size` axis is `m` unless specified otherwise.
- Breakpoints follow layout breakage; Sidebar / Drawer accounted for below `md` / `lg` where relevant.
- If unsure, open `COMPONENT.md`, then matching `examples/*.tsx` for the scenario, and `[component-catalog.md](./component-catalog.md)`.


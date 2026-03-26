# prime-ui-kit design tokens

Full map of the token system for use in responsive layouts.
All visual values come **only** from the semantic layer (`--prime-sys-*`).
Direct references to primitives (`--prime-ref-*`) in components are **forbidden** (RULES.md, section 3).

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай размер **`m`** для оси `size` у компонентов, если явно не оговорено иное.

---

## Architecture

```
tokens/primitives.ts  →  src/styles/tokens.css        (--prime-ref-*)
tokens/semantic.ts    →  src/styles/theme-light.css    (--prime-sys-*)
tokens/themes/light.ts    src/styles/theme-dark.css
tokens/themes/dark.ts
```

- **Primitives** (`--prime-ref-*`): raw palette, size, and shadow values. Not used directly in components.
- **Semantic** (`--prime-sys-*`): roles tied to context (action, surface, content, border, field…). Switched by theme.
- **Theme**: `data-theme="light"` / `data-theme="dark"` on `:root` or a container. A component does not know the theme — only semantic roles.

---

## Colors

### Palette (primitives, `--prime-ref-color-*`)

| Group | Scale | Example |
|--------|-------|--------|
| gray | 0–950 + alpha10/16/24 | `--prime-ref-color-gray-400` = `#c7ced9` |
| red | 50–950 | `--prime-ref-color-red-500` |
| blue | 50–950 | `--prime-ref-color-blue-600` |
| green | 50–950 | `--prime-ref-color-green-500` |
| orange | 50–950 | `--prime-ref-color-orange-500` |
| yellow | 50–950 | `--prime-ref-color-yellow-500` |
| purple | 50–950 | `--prime-ref-color-purple-500` |
| sky | 50–950 | `--prime-ref-color-sky-500` |
| pink | 50–950 | `--prime-ref-color-pink-500` |
| teal | 50–950 | `--prime-ref-color-teal-500` |
| black / white | — | `#0f1115` / `#f8f7f4` |
| overlay | scrimLight / scrimDark | `rgba(15, 17, 21, 0.58)` |

### Semantic colors (`--prime-sys-color-*`)

Use **only these** in layout styles:

| Group | Tokens | Purpose |
|--------|--------|------------|
| **action** | `primaryBackground`, `primaryBackgroundHover`, `primaryForeground`, `primarySoftBackground`, `primarySoftForeground`, `neutralBackground`, `neutralBackgroundHover`, `neutralForeground`, `errorBackground`, `errorBackgroundHover`, `errorForeground` | Buttons, links, interactive elements |
| **surface** | `default`, `raised`, `elevated`, `overlay`, `accentSoft`, `dangerSoft` | Page, card, panel, and overlay backgrounds |
| **content** | `primary`, `secondary`, `muted`, `disabled`, `inverse`, `accent`, `danger` | Text and icon color |
| **border** | `subtle`, `separator`, `strong`, `emphasis`, `muted`, `accent`, `danger`, `disabled`, `inverse` | Outlines, dividers |
| **field** | `bg`, `text`, `placeholder`, `border`, `borderHover`, `borderFocus`, `borderError` | Input fields |
| **focus** | `ring` | Focus ring |
| **status** | `information-*`, `warning-*`, `success-*`, `error-*`, `away-*`, `feature-*`, `verified-*` | Status colors (background, backgroundEmphasis, foreground, border) |
| **badge** | `grayFilled-*`, `pink-*`, `teal-*`, etc. | Badges (soft, emphasis, border, foregroundOnSoft) |
| **dataTable** | `dividerHorizontal`, `dividerVertical`, `headBackground`, `rowBackground` | Tables |
| **tooltip** | `background`, `foreground`, `border` | Tooltips |

**Layout rule:** page background — `surface-default`; cards — `surface-raised`;
overlay (Drawer, Modal) — `surface-overlay`; border between sections — `border-separator`.

---

## Typography

### Font families

| Token | Value |
|-------|----------|
| `--prime-ref-font-family-base` | `"Roboto Flex", "Roboto", ui-sans-serif, system-ui, sans-serif` |
| `--prime-ref-font-family-mono` | `"Roboto Mono", ui-monospace, monospace` |

### Size scale (`--prime-ref-font-size-*`)

| Token | Size | Line-height |
|-------|--------|-------------|
| `3xs` | 0.625rem (10px) | 0.875rem |
| `2xs` | 0.6875rem (11px) | 1rem |
| `xs` | 0.75rem (12px) | 1rem |
| `s` | 0.8125rem (13px) | 1.125rem |
| `m` | 0.875rem (14px) | 1.25rem |
| `l` | 1rem (16px) | 1.375rem |
| `xl` | 1.125rem (18px) | 1.5rem |
| `2xl` | 1.25rem (20px) | 1.625rem |
| `3xl` | 1.375rem (22px) | 1.75rem |
| `4xl` | 1.5rem (24px) | 1.875rem |
| `5xl` | 1.75rem (28px) | 2rem |
| `6xl` | 2rem (32px) | 2.25rem |

### Weights (`--prime-ref-font-weight-*`)

| Token | Value |
|-------|----------|
| `regular` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |

### Tracking (`--prime-ref-font-letterSpacing-*`)

| Token | Value |
|-------|----------|
| `tighter` | -0.02em |
| `tight` | -0.01em |
| `normal` | 0 |
| `wide` | 0.04em |
| `wider` | 0.06em |

### Semantic typography (`--prime-sys-typography-*`)

- `body-size`, `body-lineHeight`, `body-letterSpacing` — body text.
- `title-size`, `title-weight` — headings.
- `control-s|m|l` — text inside controls (size + line-height).
- `support-3xs|2xs|xs|s` — small supporting text.
- `lineHeight-tight` (1.25), `normal` (1.5), `relaxed` (1.65).

**Layout rule:** use `--prime-sys-typography-*` for text in the layout.
For page headings — Typography `variant` from the component scale.
For fluid typography across breakpoints — `clamp()` with `--prime-ref-font-size-*` as min/max.

---

## Spacing

### Layout spacing (`--prime-sys-spacing-*`)

| Token | Value | Typical use |
|-------|----------|---------------------|
| `xs` | 0.25rem (4px) | Minimal gap, inline inset |
| `s` | 0.5rem (8px) | Gap in dense lists |
| `m` | 0.75rem (12px) | Gap between form fields |
| `l` | 1rem (16px) | Card padding, section gap |
| `xl` | 1.25rem (20px) | Container padding |
| `2xl` | 1.5rem (24px) | Section inset |
| `3xl` | 1.75rem (28px) | Gap between blocks |
| `4xl` | 2rem (32px) | Gap between page sections |
| `5xl` | 2.5rem (40px) | Large section break |
| `6xl` | 3.5rem (56px) | Hero / landing section |

### Numeric scale (`--prime-sys-spacing-x*`)

`x0` (0) … `x14` — mapping to layout tokens for programmatic iteration.

### Control spacing (`--prime-ref-spaces-control-*`)

Internal padding of controls (Input, Button, Select); driven by the `size` prop, not set manually in layout.

**Layout rule:** for `gap`, `padding`, `margin` on wrappers — **only** `--prime-sys-spacing-*`.
Do not use px literals. For fluid spacing: `gap: clamp(var(--prime-sys-spacing-s), 2vw, var(--prime-sys-spacing-xl))`.

---

## Radii (`--prime-sys-shape-radius-*`)

| Token | Value | Use |
|-------|----------|------------|
| `xs` | 8px | Small elements, Badge, Tag |
| `s` | 10px | Input, Select, Button (s) |
| `m` | 11px | Button (m), cards |
| `l` | 12px | Button (l), sections |
| `4xl` | 24px | Modal, Drawer, large cards |
| `round` | 9999px | Avatar, circular buttons |

**Layout rule:** card radius = `--prime-sys-shape-radius-l` or `4xl` for large blocks.
Do not hard-code `border-radius` in px.

---

## Shadows (`--prime-sys-elevation-shadow-*`)

| Token | Context |
|-------|----------|
| `surface` | Cards, raised surfaces |
| `modal` | Modal, large overlays |
| `tooltip` | Tooltip, Popover |
| `buttonFocus` | Button focus |
| `primaryFocus` | Primary element focus |
| `errorFocus` | Error element focus |
| `fancyButtonNeutral` | Decorative shadow for neutral button |
| `fancyButtonPrimary` | Decorative shadow for primary button |
| `fancyButtonError` | Decorative shadow for error button |

Values differ for light / dark themes (automatically via `data-theme`).

---

## Z-index (`--prime-sys-elevation-zIndex-*`)

| Token | Value | Layer |
|-------|----------|------|
| `base` | 10 | Base content |
| `sticky` | 100 | Sticky header, fixed sidebar |
| `popover` | 1000 | Popover |
| `dropdown` | 1200 | Dropdown, Select menu (above popover) |
| `tooltip` | 1600 | Tooltip (above popover and dropdown) |
| `modal` | 2000 | Modal |
| `drawer` | 2000 | Drawer, fullscreen mobile sidebar (same numeric level as `modal`) |
| `toast` | 3000 | Notification |

**Layout rule:** for sticky header — `z-index: var(--prime-sys-elevation-zIndex-sticky)`.
Sidebar on desktop — `base`; Drawer on mobile — `drawer`. Do not invent custom z-index values.

---

## Motion (`--prime-sys-motion-*`)

| Token | Value | Use |
|-------|----------|------------|
| `duration-fast` | 200ms | Hover, focus, toggle |
| `duration-medium` | 350ms | Drawer, Accordion, expand/collapse |
| `duration-slow` | 500ms | Page-level transitions |
| `easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | All transitions |

**Layout rule:** for responsive transitions (sidebar collapse, drawer open) —
`transition: transform var(--prime-sys-motion-duration-medium) var(--prime-sys-motion-easing-standard)`.

---

## Control sizes (`--prime-sys-size-control-*`)

Controls (Button, Input, Select, etc.) have predefined sizes via the `size` prop.
Layout should not override control height — use `size="s|m|l"`.

| Size | Approx. height | When |
|------|------------------|-------|
| `s` | ~32px | Dense desktop UI, tables |
| `m` | ~40px | Default |
| `l` | ~48px | Mobile, touch-friendly |

---

## Borders (`--prime-sys-border-*`)

| Token | Value |
|-------|----------|
| `width-control` | 1px |
| `width-focusRing` | 2px |

Border color comes from `--prime-sys-color-border-*`.

---

## Token checklist for layout

1. **Background:** `background: var(--prime-sys-color-surface-default)` — not hex, not rgb.
2. **Text:** `color: var(--prime-sys-color-content-primary)` — not `#000`, not `black`.
3. **Spacing:** `gap: var(--prime-sys-spacing-l)` — not `16px`.
4. **Radii:** `border-radius: var(--prime-sys-shape-radius-m)` — not `12px`.
5. **Shadows:** `box-shadow: var(--prime-sys-elevation-shadow-surface)` — not a custom shadow.
6. **Z-index:** `z-index: var(--prime-sys-elevation-zIndex-sticky)` — not a magic number.
7. **Motion:** `transition-duration: var(--prime-sys-motion-duration-medium)` — not `0.3s`.
8. **Font:** `font-family: var(--prime-sys-typography-family-base)` — not `"Roboto"` directly.
9. **Text size:** via Typography component or `--prime-sys-typography-*`.
10. **Control size:** via `size` prop, not via CSS.

---

## Source files

| File | Role |
|------|------|
| `tokens/primitives.ts` | Primitive source (TS) |
| `tokens/semantic.ts` | Semantic source (TS) |
| `tokens/themes/light.ts` | Light theme overrides |
| `tokens/themes/dark.ts` | Dark theme overrides |
| `src/styles/tokens.css` | Generated CSS primitives (AUTO-GENERATED) |
| `src/styles/theme-light.css` | Generated light theme |
| `src/styles/theme-dark.css` | Generated dark theme |
| `src/styles/units.css` | Helper units (`--prime-sys-unit-*`) |
| `src/styles/globals.css` | Global styles, keyframes |

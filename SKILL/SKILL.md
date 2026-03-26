---
name: prime-ui-responsive-app
description: >
  Responsive mobile-first layouts with prime-ui-kit (Flexbox, CSS Modules, --prime-sys-* tokens).
  Use when: building a page / layout / template / form / navigation / dashboard
  with prime-ui-kit components; converting a desktop layout to mobile-first; you need a
  Flexbox layout recipe (sidebar + content, card grid, holy grail, sticky footer); choosing
  a kit component for a layout region; checking responsive behavior (breakpoints,
  touch targets, overlay vs inline). Includes: layout recipes (dashboard, settings,
  catalog, landing, form wizard), responsive catalog of 41 components, design tokens,
  anti-patterns. Strict: no custom wrappers, reskins, or structural overrides of kit
  components — use raw primitives, default styles/layout, and public props/API only.
---

# prime-ui-responsive-app

## Documentation layout

| What | Path (this repository) | After `npm install prime-ui-kit` |
|------|--------------------------|-------------------------------------|
| Per-component API, props, examples | `../src/components/<kebab-name>/COMPONENT.md` | `node_modules/prime-ui-kit/src/components/<kebab-name>/COMPONENT.md` |
| Design tokens, full 41-component catalog, flexbox source notes | `design-tokens.md`, `component-catalog.md`, `responsive-flexbox-sources.md` (next to `SKILL.md`) | `node_modules/prime-ui-kit/SKILL/*.md` |

Install as a Cursor skill by pointing the skill directory at `SKILL/` in this repository (clone or copy the whole `SKILL/` folder so `SKILL.md` and the sibling `.md` files stay together).

---

## Visual Language & Design Tokens

Any responsive layout on prime-ui-kit **must** follow the system’s visual language.
Full token reference: [`design-tokens.md`](./design-tokens.md).

### Mandatory rules

1. **Semantic tokens only.** All visual values (color, spacing, radius, shadow, z-index,
   animation) come from `--prime-sys-*`. Primitive `--prime-ref-*` tokens are not allowed in layout.
2. **No hard-coded values.** No hex colors, pixel spacing, numeric z-index, or custom shadows
   in layout styles. Tokens only.
3. **Theme via `data-theme`.** A component does not know the theme — only semantic roles.
   Light and dark are supported equally.
4. **CSS Modules + CSS variables.** Tailwind is not used in prime-ui-kit.
5. **Control sizing via the `size` prop.** Layout does not override button or field heights.
6. **Default size when designing.** When planning screens, wireframes, and examples, **always start with `m`** for every component that exposes a `size` (or control-size) axis — unless the scenario explicitly requires `s`, `l`, or `xl`. This applies to prompts, skills, and documentation: **`m` is the baseline**, not an afterthought.

### Raw components only — no custom shells (strict)

**Forbidden:** wrapping kit components in custom containers to change how they look or behave; redefining their structure, architecture, or design; overriding or replacing kit CSS (including ad-hoc `className` hacks, inline styles that mimic a different visual system, or duplicating internals with plain `div`/`span` + bespoke styles).

**Required:** use **only** the **standard, raw** kit components as documented — with **default** kit styles and the **standard composition** (`Modal.Root`, `Input.Field`, `Select.Trigger`, etc.). Arrange screens with kit primitives and layout tokens; do **not** substitute “styled” clones of Button, Input, or other controls.

**For customization:** use **exclusively** the **public API** — props (`size`, `variant`, `mode`, `fullWidth`, `disabled`, …), documented subcomponents/slots, `ControlSizeProvider`, theme via `data-theme`, and semantic `--prime-sys-*` on **page layout** surfaces — not on re-skinned kit internals.

Violating this produces drift from the design system, breaks accessibility guarantees maintained by the kit, and makes upgrades unsafe.

### Key tokens for layout

| Category | Prefix | Example |
|-----------|---------|--------|
| Backgrounds | `--prime-sys-color-surface-*` | `surface-default`, `raised`, `overlay` |
| Text | `--prime-sys-color-content-*` | `content-primary`, `secondary`, `muted` |
| Borders | `--prime-sys-color-border-*` | `border-separator`, `subtle`, `strong` |
| Spacing | `--prime-sys-spacing-*` | `spacing-s` (8px), `spacing-l` (16px), `spacing-4xl` (32px) |
| Radii | `--prime-sys-shape-radius-*` | `radius-m` (11px), `radius-4xl` (24px) |
| Shadows | `--prime-sys-elevation-shadow-*` | `shadow-surface`, `shadow-modal` |
| Z-index | `--prime-sys-elevation-zIndex-*` | `zIndex-sticky` (100), `zIndex-modal` (2000) |
| Animation | `--prime-sys-motion-*` | `duration-fast` (200ms), `easing-standard` |

---

## Core Principles

### 1. Mobile-first: column → row

Start with `flex-direction: column`. Expand to `row` via `@media (min-width: …)`.
This yields a usable layout at any viewport without extra styles.

### 2. Breakpoints

| Token | min-width | Typical context |
|-------|-----------|-----------------|
| `sm`  | 640 px    | Large phones, landscape |
| `md`  | 768 px    | Tablet portrait |
| `lg`  | 1024 px   | Tablet landscape, laptop |
| `xl`  | 1280 px   | Desktop |

Content drives breakpoints, not device names. If the layout breaks earlier, add an intermediate breakpoint.

### 3. Flexbox patterns

- **Sidebar + content:** container `display: flex; flex-wrap: wrap`, sidebar `flex: 0 0 280px`,
  content `flex: 1 1 0%`. Below `< md` — column, sidebar 100%.
- **Holy Grail:** body `flex-direction: column; min-height: 100vh`, middle section `flex: 1; display: flex`,
  main `flex: 1`, aside `flex: 0 0 <width>`.
- **Card grid:** container `display: flex; flex-wrap: wrap; gap: var(--prime-sys-spacing-l)`,
  card `flex: 1 1 calc(33.33% - var(--prime-sys-spacing-l))`, min-width for reflow.
- **Sticky footer:** body `display: flex; flex-direction: column; min-height: 100vh`,
  main `flex: 1 0 auto`, footer `flex-shrink: 0`.

### 4. Spacing

Use `--prime-sys-spacing-*` for gap, padding, and margin. For fluid spacing, use `clamp()`:
`gap: clamp(var(--prime-sys-spacing-s), 2vw, var(--prime-sys-spacing-xl))`.
Do not mix pixel literals with tokens in the same context.

### 5. Touch targets

Minimum 44 × 44 px (WCAG 2.5.5 AAA). On mobile:
- Button, Select, Input — `size="l"`.
- Checkbox, Radio, Switch — increase click-area padding.
- LinkButton — at least `size="m"`.

### 6. Accessible responsive navigation

- Desktop: Sidebar fixed, `flex-shrink: 0`.
- Mobile (`< md`): Sidebar → Drawer (`position="left"`), trigger — hamburger button.
- Breadcrumb auto-shortens via `maxItems`.
- Tabs: horizontal scroll or replace with Accordion.
- CommandMenu: available on all viewports via a button.

### 7. Content → breakpoint

Do not tie breakpoints to devices. Place them where the layout stops looking right.
Use DevTools Responsive Mode to check intermediate widths.

---

## Layout Recipes

### Dashboard

**Regions:** Sidebar (navigation) + Header (Breadcrumb, Avatar, CommandMenu) + Content (Tabs, DataTable, ProgressBar, Badge).

**Flexbox structure:**
- Root: `flex-direction: row` at `≥ lg`, `column` below `< lg`.
- Sidebar: `flex: 0 0 260px`, below `< lg` → Drawer.
- Main: `flex: 1; display: flex; flex-direction: column`.
- Content area: Tabs switch DataTable / cards with ProgressBar.
- Footer content: Pagination.

**Responsive transitions:**
- `< lg`: Sidebar hidden → Drawer; Tabs scroll horizontally.
- `< md`: DataTable → horizontal scroll with first column pinned.
- `< sm`: Stepper (if present) → vertical; Badge may drop text.

---

### Settings Page

**Regions:** Sidebar (vertical section navigation) + Content (form: Label, Input, Select, Switch, Textarea, Button).

**Flexbox structure:**
- Root: `flex-direction: row` at `≥ md`, column below.
- Sidebar: `flex: 0 0 220px`, contains Sidebar with groups.
- Form area: `flex: 1`, fields in `flex-direction: column`, `gap: var(--prime-sys-spacing-2xl)`.
- Field groups separated by Divider.
- Form footer: ButtonGroup (Save + Cancel), `justify-content: flex-end`.

**Responsive transitions:**
- `< md`: Sidebar → Tabs or Accordion; form full width.
- All Input, Select, Textarea — `fullWidth`.
- Button — `fullWidth` below `< sm`.

---

### Catalog / E-commerce

**Regions:** Header (search Input, SegmentedControl for view) + Filters (Checkbox, Radio, Slider, Tag) + Grid (cards with Avatar, Badge, Button).

**Flexbox structure:**
- Toolbar: `flex-direction: row; flex-wrap: wrap; gap`.
- Body: `flex-direction: row` at `≥ md`.
- Filters sidebar: `flex: 0 0 260px`.
- Grid: `flex: 1; display: flex; flex-wrap: wrap; gap`.
- Card: `flex: 1 1 calc(33.33% - gap)`, `min-width: 280px`.

**Responsive transitions:**
- `< md`: Filters → Drawer (bottom); active filters — Tag row in flex-wrap.
- `< sm`: Cards → `flex: 1 1 100%`, single column.
- SegmentedControl → Select below `< sm` when there are more than 3 segments.
- Pagination → compact mode (arrows + number).

---

### Landing / Marketing

**Regions:** Header (LinkButton navigation, CTA Button) + Hero (Typography, Button) + Features (cards) + FAQ (Accordion) + Footer.

**Flexbox structure:**
- Sections: `flex-direction: column; align-items: center; max-width: 1200px; margin: 0 auto`.
- Hero: `flex-direction: column` below `< md`, `row` at `≥ md` (text + image).
- Features: flex-wrap cards, same idea as Catalog grid.
- FAQ: Accordion at 100% max-width.
- Banner: full width above/below hero.
- Footer: `flex-wrap` link columns.

**Responsive transitions:**
- `< md`: navigation → Drawer; Hero stacks vertically.
- `< sm`: CTA ButtonGroup → `vertical`; Typography uses smaller `variant`.
- Banner stays full width on all viewports.

---

### Form Wizard

**Regions:** Stepper (progress) + Step content (Input, Checkbox, Select, Datepicker, FileUpload, DigitInput) + Actions (Button prev/next).

**Flexbox structure:**
- Stepper: horizontal at `≥ md`, vertical below `< md`.
- Step body: `flex-direction: column; gap; max-width: 600px; margin: 0 auto`.
- Actions: `display: flex; justify-content: space-between`.
- Each step — Modal or Drawer on mobile, inline on desktop.

**Responsive transitions:**
- `< md`: Stepper vertical; step may live in Drawer (bottom).
- `< sm`: Button actions — `fullWidth`, stacked vertically.
- DigitInput — larger `size` for finger input.
- ProgressBar under Stepper for overall progress.

---

## Component Quick-Reference

All **41** exported kit components — `COMPONENT.md` next to the implementation (props, composition, examples):

| Component | Documentation |
|-----------|----------------|
| Accordion | [`accordion/COMPONENT.md`](../src/components/accordion/COMPONENT.md) |
| Avatar | [`avatar/COMPONENT.md`](../src/components/avatar/COMPONENT.md) |
| Badge | [`badge/COMPONENT.md`](../src/components/badge/COMPONENT.md) |
| Banner | [`banner/COMPONENT.md`](../src/components/banner/COMPONENT.md) |
| Breadcrumb | [`breadcrumb/COMPONENT.md`](../src/components/breadcrumb/COMPONENT.md) |
| Button | [`button/COMPONENT.md`](../src/components/button/COMPONENT.md) |
| ButtonGroup | [`button-group/COMPONENT.md`](../src/components/button-group/COMPONENT.md) |
| Checkbox | [`checkbox/COMPONENT.md`](../src/components/checkbox/COMPONENT.md) |
| CodeBlock | [`code-block/COMPONENT.md`](../src/components/code-block/COMPONENT.md) |
| ColorPicker | [`color-picker/COMPONENT.md`](../src/components/color-picker/COMPONENT.md) |
| CommandMenu | [`command-menu/COMPONENT.md`](../src/components/command-menu/COMPONENT.md) |
| DataTable | [`data-table/COMPONENT.md`](../src/components/data-table/COMPONENT.md) |
| Datepicker | [`datepicker/COMPONENT.md`](../src/components/datepicker/COMPONENT.md) |
| DigitInput | [`digit-input/COMPONENT.md`](../src/components/digit-input/COMPONENT.md) |
| Divider | [`divider/COMPONENT.md`](../src/components/divider/COMPONENT.md) |
| Drawer | [`drawer/COMPONENT.md`](../src/components/drawer/COMPONENT.md) |
| Dropdown | [`dropdown/COMPONENT.md`](../src/components/dropdown/COMPONENT.md) |
| FileUpload | [`file-upload/COMPONENT.md`](../src/components/file-upload/COMPONENT.md) |
| Hint | [`hint/COMPONENT.md`](../src/components/hint/COMPONENT.md) |
| Input | [`input/COMPONENT.md`](../src/components/input/COMPONENT.md) |
| Kbd | [`kbd/COMPONENT.md`](../src/components/kbd/COMPONENT.md) |
| Label | [`label/COMPONENT.md`](../src/components/label/COMPONENT.md) |
| LinkButton | [`link-button/COMPONENT.md`](../src/components/link-button/COMPONENT.md) |
| Modal | [`modal/COMPONENT.md`](../src/components/modal/COMPONENT.md) |
| Notification | [`notification/COMPONENT.md`](../src/components/notification/COMPONENT.md) |
| Pagination | [`pagination/COMPONENT.md`](../src/components/pagination/COMPONENT.md) |
| Popover | [`popover/COMPONENT.md`](../src/components/popover/COMPONENT.md) |
| ProgressBar | [`progress-bar/COMPONENT.md`](../src/components/progress-bar/COMPONENT.md) |
| ProgressCircle | [`progress-circle/COMPONENT.md`](../src/components/progress-circle/COMPONENT.md) |
| Radio | [`radio/COMPONENT.md`](../src/components/radio/COMPONENT.md) |
| SegmentedControl | [`segmented-control/COMPONENT.md`](../src/components/segmented-control/COMPONENT.md) |
| Select | [`select/COMPONENT.md`](../src/components/select/COMPONENT.md) |
| Sidebar | [`sidebar/COMPONENT.md`](../src/components/sidebar/COMPONENT.md) |
| Slider | [`slider/COMPONENT.md`](../src/components/slider/COMPONENT.md) |
| Stepper | [`stepper/COMPONENT.md`](../src/components/stepper/COMPONENT.md) |
| Switch | [`switch/COMPONENT.md`](../src/components/switch/COMPONENT.md) |
| Tabs | [`tabs/COMPONENT.md`](../src/components/tabs/COMPONENT.md) |
| Tag | [`tag/COMPONENT.md`](../src/components/tag/COMPONENT.md) |
| Textarea | [`textarea/COMPONENT.md`](../src/components/textarea/COMPONENT.md) |
| Tooltip | [`tooltip/COMPONENT.md`](../src/components/tooltip/COMPONENT.md) |
| Typography | [`typography/COMPONENT.md`](../src/components/typography/COMPONENT.md) |

Responsive roles, zones, and scenarios (same 41): [`component-catalog.md`](./component-catalog.md).

---

## Anti-Patterns

### 1. `width: 100vw` instead of `width: 100%`

`100vw` includes scrollbar width → horizontal overflow. Use `100%` or omit `width` (block elements fill 100% anyway).

### 2. `height: 100vh` on mobile

In Safari, `100vh` ignores the dynamic URL bar, so content can be clipped. Use `min-height: 100dvh` (dynamic viewport) or fallback `min-height: 100vh` + `-webkit-fill-available`.

### 3. Sidebar without `flex-shrink: 0`

Without `flex-shrink: 0`, the sidebar shrinks when the content area overflows. Always use `flex: 0 0 <width>` for a fixed side column.

### 4. Native `<table>` without a scroll wrapper

Wide tables break the layout. Use DataTable, which wraps content in `overflow-x: auto` and pins the first column.

### 5. Modal instead of Drawer on mobile

A centered modal is awkward for touch: the lower screen area is hard to reach one-handed. Below `< md`, prefer Drawer with `position="bottom"`.

### 6. Small touch targets

Interactive elements under 44 px on mobile. Use `size="l"` for Button, Input, Select. For Checkbox and Radio, increase container padding.

### 7. Fixed pixel widths on flex items

`width: 300px` does not adapt. Use `flex-basis` + `min-width` / `max-width` or percentages with `clamp()`.

### 8. Hard-coded visual values instead of tokens

`background: #f3f4f7`, `gap: 16px`, `border-radius: 12px`, `z-index: 999` — all of this breaks theming and consistency. Use `--prime-sys-*` tokens. Details: [`design-tokens.md`](./design-tokens.md).

### 9. Custom wrappers or “reskinned” kit components

Do not wrap `Button`, `Input`, `Select`, etc. in custom styled shells, replace their markup, or override their CSS to match a one-off design. If the design differs, use kit **props and composition** first; if the kit truly cannot express it, flag a **kit change** — do not fork visuals in app code. See **Mandatory rules → Raw components only** above.

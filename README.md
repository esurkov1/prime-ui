# prime-ui-kit

[![npm version](https://img.shields.io/npm/v/prime-ui-kit.svg)](https://www.npmjs.com/package/prime-ui-kit)
[![License: MIT](https://img.shields.io/npm/l/prime-ui-kit.svg)](https://github.com/esurkov1/prime-ui/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A **React 19** component library built with **CSS Modules**, **design tokens** as CSS variables (`--prime-sys-*`), and a **composable API** (`Modal.Root`, `Input.Field`, `Select.Trigger`, …). Works with **Vite**, **Next.js**, **Remix**, or any bundler that supports CSS Modules. Accessibility follows **react-aria-components** where it fits.

**Links:** [npm](https://www.npmjs.com/package/prime-ui-kit) · [Repository & issues](https://github.com/esurkov1/prime-ui/issues)

---

## Table of contents

- [Metadata (for tooling and LLMs)](#metadata-for-tooling-and-llms)
- [Key features](#key-features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Styles and theming](#styles-and-theming)
- [Quick start](#quick-start)
- [Typography](#typography)
- [Imports: main entry and heavy modules](#imports-main-entry-and-heavy-modules)
- [Providers and context](#providers-and-context)
- [Component catalog](#component-catalog)
- [Package exports (`package.json` / `exports`)](#package-exports-packagejson--exports)
- [TypeScript](#typescript)
- [Where component docs live](#where-component-docs-live)
- [License](#license)

---

## Metadata (for tooling and LLMs)

```yaml
name: prime-ui-kit
ecosystem: react
react_version: "^19.0.0"
module_system: ESM
styling: CSS Modules + CSS variables (--prime-sys-*)
a11y_stack: react-aria-components (peer)
documentation_per_component: src/components/<name>/COMPONENT.md
component_examples_glob: src/components/<name>/examples/*.tsx
layout_examples_glob: src/layout/<name>/examples/*.tsx
repository: https://github.com/esurkov1/prime-ui
typography: variant_roles  # see src/components/typography/COMPONENT.md
```

---

## Key features

- **Tokens & themes** — semantic variables, light and dark themes via `data-theme`.
- **Composition** — subcomponent pattern (`Root`, `Field`, `Trigger`, …) instead of monolithic prop blobs.
- **Forms** — inputs, selects, toggles, file upload, color, OTP-style fields, sliders.
- **Overlays** — modals, drawers, popovers, menus, tooltips, command palette.
- **Navigation & layout** — sidebar, breadcrumbs, tabs, accordion, stepper, pagination, page shell.
- **Data** — table with sorting, pagination, or infinite scroll.
- **Types** — published `.d.ts` alongside the package.
- **Notifications** — toast queue via `NotificationProvider` and `useNotifications()`.

---

## Requirements

| Dependency | Version |
|------------|---------|
| `react` / `react-dom` | ^19.0.0 |
| `react-aria-components` | ^1.16.0 |
| `react-day-picker` | ^9.14.0 |
| `date-fns` | ^4.0.0 |

The package bundles **lucide-react**, **framer-motion**, and **react-router-dom** (icons, notification motion, and **Sidebar** routing). Use a router (e.g. `BrowserRouter`) if **Sidebar** renders navigation items.

---

## Installation

```bash
npm install prime-ui-kit react react-dom react-aria-components react-day-picker date-fns
```

```bash
pnpm add prime-ui-kit react react-dom react-aria-components react-day-picker date-fns
```

```bash
bun add prime-ui-kit react react-dom react-aria-components react-day-picker date-fns
```

---

## Styles and theming

Import **global styles** (fonts, reset, tokens, both themes) and the **bundled component CSS** (CSS Modules output from the published build):

```css
@import "prime-ui-kit/styles.css";
@import "prime-ui-kit/bundle.css";
```

- **`styles.css`** — Google Fonts, CSS reset, design tokens, light and dark themes.
- **`bundle.css`** — class rules that match the JS bundle (`Button`, `Input`, …).

**Light / dark:** set `data-theme="light"` or `data-theme="dark"` on `<html>`, a layout root, or any wrapper.

Fine-grained imports (custom reset, single theme):

```css
@import "prime-ui-kit/tokens.css";
@import "prime-ui-kit/theme-light.css";
/* @import "prime-ui-kit/theme-dark.css"; */
@import "prime-ui-kit/bundle.css";
```

If you only use **`prime-ui-kit/components`**, swap `bundle.css` for **`prime-ui-kit/components.css`**.

---

## Quick start

```tsx
import { Button, Input, Modal } from "prime-ui-kit";

export function Example() {
  return (
    <>
      <Input.Root size="m" label="Email" id="email">
        <Input.Wrapper>
          <Input.Field type="email" placeholder="you@example.com" />
        </Input.Wrapper>
      </Input.Root>

      <Button variant="primary" mode="filled" size="l">
        Submit
      </Button>
    </>
  );
}
```

---

## Typography

Текст страницы оформляется компонентом **`Typography`** с ролями **`variant`**: каждая роль задаёт пару кегль/межстрочный интервал из темы (`typography.role` → `--prime-sys-typography-role-*`). Примитивы `font.size.*` согласованы со [шкалой MD3](https://m3.material.io/styles/typography/type-scale-tokens); роли выстроены по смыслу рядом с **MD3**, **Apple SF** и **Polaris** — таблица соответствий и примерных **rem/px** при корне 16px — в [Typography COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/typography/COMPONENT.md).

---

## Imports: main entry and heavy modules

- **`prime-ui-kit`** — main entry; use for most apps.
- **`prime-ui-kit/components`** — alternate entry for tree-shaking heavier modules (e.g. `DataTable`).

```tsx
import { DataTable } from "prime-ui-kit/components";
```

---

## Providers and context

| API | Purpose |
|-----|---------|
| **`NotificationProvider`** + **`useNotifications()`** | Toast queue: `notify`, `dismiss`, `dismissAll`. Wrap your app or a subtree. |
| **`ControlSizeProvider`** | Default **`s` \| `m` \| `l` \| `xl`** for controls inside the subtree. |

---

## Component catalog

Descriptions are short summaries from the **About** section in each `COMPONENT.md` (where it exists). Full API, parts, and examples are in the linked files. **AppShell**, **PageContent**, **ExampleFrame**, and **ScrollContainer** ship without a dedicated `COMPONENT.md` — use the linked source folders.

Documentation base URL in the repo: `https://github.com/esurkov1/prime-ui/blob/main/src/components/`

| Category | Component | Description | Docs |
|----------|-----------|-------------|------|
| Forms & input | **Checkbox** | Checkbox with chrome, label, hint, and error text. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/checkbox/COMPONENT.md) |
| Forms & input | **ColorPicker** | Color selection: 2D area, channel sliders, swatches, hex, eyedropper (react-aria). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/color-picker/COMPONENT.md) |
| Forms & input | **DigitInput** | OTP-style one-character cells with paste and focus handoff. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/digit-input/COMPONENT.md) |
| Forms & input | **FileUpload** | File picking: hidden `input`, drag-and-drop, per-file rows with progress. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/file-upload/COMPONENT.md) |
| Forms & input | **Hint** | Helper or status line under a field, optional leading icon. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/hint/COMPONENT.md) |
| Forms & input | **Input** | Single-line field with wrapper, affixes, and hint/error lines. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/input/COMPONENT.md) |
| Forms & input | **Kbd** | Keyboard shortcuts styled as UI chrome (`kbd`). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/kbd/COMPONENT.md) |
| Forms & input | **Label** | Field caption: icon, required asterisk, secondary text. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/label/COMPONENT.md) |
| Forms & input | **Radio** | Radio group with label, hint, and error wiring. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/radio/COMPONENT.md) |
| Forms & input | **SegmentedControl** | Horizontal `radiogroup` with segments and a sliding indicator. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/segmented-control/COMPONENT.md) |
| Forms & input | **Select** | Single-select combobox with a portaled listbox. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/select/COMPONENT.md) |
| Forms & input | **Slider** | Horizontal `input type="range"` with kit sizing. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/slider/COMPONENT.md) |
| Forms & input | **Switch** | On/off control with label and metadata slots. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/switch/COMPONENT.md) |
| Forms & input | **Textarea** | Multiline field, character counter, hints and errors. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/textarea/COMPONENT.md) |
| Date & time | **Datepicker** | Calendar, ranges, presets, optional time (react-day-picker + date-fns). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/datepicker/COMPONENT.md) |
| Overlays | **CommandMenu** | Modal command palette: search and pick from the list with the keyboard. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/command-menu/COMPONENT.md) |
| Overlays | **Drawer** | Side sheet in a portal with scroll lock and focus management. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/drawer/COMPONENT.md) |
| Overlays | **Dropdown** | Action menu with trigger and portaled panel (`role="menu"`). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/dropdown/COMPONENT.md) |
| Overlays | **Modal** | Centered dialog with backdrop, focus trap, optional built-in chrome. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/modal/COMPONENT.md) |
| Overlays | **Popover** | Anchor + portaled panel; non-modal surface next to the trigger. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/popover/COMPONENT.md) |
| Overlays | **Tooltip** | Delayed hint; trigger and content in a portal. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/tooltip/COMPONENT.md) |
| Navigation & layout | **Accordion** | Expandable sections (FAQ, settings groups) with height animation. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/accordion/COMPONENT.md) |
| Navigation & layout | **Breadcrumb** | `nav` trail with links, separators, and optional ellipsis. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/breadcrumb/COMPONENT.md) |
| Navigation & layout | **Pagination** | Page controls: prev/next, page numbers, ellipsis. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/pagination/COMPONENT.md) |
| Navigation & layout | **Sidebar** | Side navigation: single panel, groups, menus, responsive overlay. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/layout/sidebar/COMPONENT.md) |
| Navigation & layout | **Stepper** | Multi-step flow on `<ol>` / `<li>` plus horizontal/vertical primitives. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/stepper/COMPONENT.md) |
| Navigation & layout | **Tabs** | Tablist, indicator, one visible panel at a time. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/tabs/COMPONENT.md) |
| Navigation & layout | **PageContent** | Main column: max width (`readable` / `wide`), header and body regions. | [Source](https://github.com/esurkov1/prime-ui/tree/main/src/components/page-content) |
| Navigation & layout | **AppShell** | Application shell: grid root, nav slot, main region, optional full viewport. | [Source](https://github.com/esurkov1/prime-ui/tree/main/src/layout/app-shell) |
| Navigation & layout | **ScrollContainer** | Scrollable region with horizontal or vertical axis (overflow wrapper). | [Source](https://github.com/esurkov1/prime-ui/tree/main/src/components/scroll-container) |
| Data | **DataTable** | Table with scroll, sorting, pagination or infinite scroll, sticky regions. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/data-table/COMPONENT.md) |
| Display & content | **Avatar** | Circular avatar: image, fallback, group with overflow cell. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/avatar/COMPONENT.md) |
| Display & content | **Badge** | Compact status or count; optional presence dot variant. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/badge/COMPONENT.md) |
| Display & content | **Banner** | In-flow announcement strip with icon, copy, and actions. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/banner/COMPONENT.md) |
| Display & content | **CodeBlock** | TS/TSX syntax highlighting in `pre`/`code` (static presentation). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/code-block/COMPONENT.md) |
| Display & content | **ExampleFrame** | Preview stage + code layout for playgrounds and internal docs. | [Source](https://github.com/esurkov1/prime-ui/tree/main/src/components/example-frame) |
| Display & content | **Card** | Dashboard tiles: `mini`, `mini-media`, `metric`, `panel`, `stat-trend`, `cta`, `list`, `split`, `cover`. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/card/COMPONENT.md) |
| Display & content | **Divider** | Horizontal or vertical rule with optional inset label. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/divider/COMPONENT.md) |
| Display & content | **ProgressBar** | Horizontal progress on the native `<progress>` element. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/progress-bar/COMPONENT.md) |
| Display & content | **SegmentedProgressBar** | Stacked horizontal segments with proportional weights and semantic tones. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/segmented-progress-bar/COMPONENT.md) |
| Display & content | **ProgressCircle** | Circular progress ring (SVG + `progressbar`). | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/progress-circle/COMPONENT.md) |
| Display & content | **Tag** | Chip with optional icon, trailing dismiss when `onRemove` is set. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/tag/COMPONENT.md) |
| Display & content | **Typography** | Reading text via semantic **`variant`** (roles), weight, tracking, muted tone. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/typography/COMPONENT.md) |
| Actions & feedback | **Button** | Action control: `asChild`, icon, loading spinner. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/button/COMPONENT.md) |
| Actions & feedback | **ButtonGroup** | Button row sharing one outline and internal dividers. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/button-group/COMPONENT.md) |
| Actions & feedback | **LinkButton** | Text-style link with control padding and underline on hover/focus. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/link-button/COMPONENT.md) |
| Actions & feedback | **Notification** | Toasts: provider, queue, positions, semantic types. | [COMPONENT.md](https://github.com/esurkov1/prime-ui/blob/main/src/components/notification/COMPONENT.md) |

---

## Package exports (`package.json` / `exports`)

| Path | Purpose |
|------|---------|
| `prime-ui-kit` | Main JS/TS API. |
| `prime-ui-kit/components` | Alternate entry for tree-shaking heavier chunks. |
| `prime-ui-kit/styles.css` | Global styles (fonts, reset, tokens, themes). |
| `prime-ui-kit/tokens.css` | Tokens only. |
| `prime-ui-kit/theme-light.css` / `theme-dark.css` | Individual theme files. |
| `prime-ui-kit/bundle.css` | CSS aligned with the main bundle. |
| `prime-ui-kit/components.css` | CSS for the `components` entry. |

---

## TypeScript

Type definitions ship with the package (`dist/*.d.ts`).

---

## Where component docs live

- **In the repo / on GitHub:** each component has `src/components/<name>/COMPONENT.md` (see the table above). **Sidebar** uses `src/layout/sidebar/COMPONENT.md`.
- **Canonical + extended examples:** next to each `COMPONENT.md`, the `examples/` folder holds **3–5 self-contained `.tsx` files** (and optional `examples.module.css`) with real product scenarios. `COMPONENT.md` lists them under **Extended examples**; start from the **Canonical example** in the same file for a maximal single-block overview.
- **Why separate files (not one `examples.md`):** each file is one scenario with a clear filename — easier for humans to navigate and for LLMs to retrieve the right chunk without loading an entire mega-document.
- **In the installed package:** `COMPONENT.md` and `examples/**` are published (`package.json` → `files`), e.g. `node_modules/prime-ui-kit/src/components/button/examples/`.

**AppShell**, **PageContent**, **ExampleFrame**, and **ScrollContainer** do not have a dedicated `COMPONENT.md`; refer to the linked source folders and types in the `.tsx` files.

---

## License

MIT — see [`LICENSE`](https://github.com/esurkov1/prime-ui/blob/main/LICENSE) in the repo and in the npm package.

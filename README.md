# prime-ui-kit

**prime-ui-kit** is a UI kit for **React 19** focused on a predictable runtime, **CSS Modules**, and **design tokens** as plain **CSS variables** (`--prime-sys-*`). Tailwind is not part of the required stack, and there is no Radix “monolith” on every widget: overlays, dropdowns, focus, and positioning rely on **custom hooks and markup**, while heavy peer dependencies are limited to a narrow area (dates and calendar accessibility).

Repository: [github.com/esurkov1/prime-ui](https://github.com/esurkov1/prime-ui). npm package: **`prime-ui-kit`**.

---

## Why this approach

### Almost dependency-free (in the runtime sense)

- **The build does not bundle peer packages** into the library bundle (`tsup` with `external` for React, React Aria, react-day-picker, date-fns) — one version in the app, no duplication.
- **Few direct package dependencies:** icons (`lucide-react`), notification animations (`framer-motion`), navigation links in the sidebar (`react-router-dom`). The core for forms, modals, selects, tooltips, etc. does not pull in dozens of `@radix-ui/*`.
- **No Tailwind** as a required layer: consumers do not need utility-first CSS for the kit to look consistent — it is enough to import the generated **tokens and themes** plus `styles.css`.

### Works with different “frameworks” around React

Components are built with **React** — they are not Vue/Svelte widgets. The kit is **not tied** to Next.js, Remix, or plain Vite: these are ordinary ESM modules and CSS that work in any React app with **CSS Modules** support (as most bundlers provide). Separately: the **token layer** is plain CSS; it can be used for visual alignment even outside React (e.g. a shell on another stack with the same variables), while composition stays in React.

### Predictable architecture

- **Design system from code:** palette, control dimensions, color semantics, and themes are **generated** from TypeScript (`tokens/` → `bun run tokens:build` → `src/styles/*.css`). Components use **`--prime-sys-*`**, not scattered literals.
- **Internal layer** (`src/internal/`): `cx`, contexts, Portal, **Slot** (an `asChild`-style pattern without Radix), hooks such as `useFocusTrap`, `useScrollLock`, `usePosition`.
- **States and sizes** are centralized (`src/internal/states.ts` — e.g. `componentSizes`: `s` | `m` | `l` | `xl`).
- **Complex widgets** use a composable API: `Modal.Root`, `Select.Trigger`, `Input.Field`, … with typed context.
- **Themes:** `data-theme="light" | "dark"` on the root or an isolated container.

---

## Repository architecture

```text
tokens/primitives.ts
    → tokens/semantic.ts
    → tokens/themes/light.ts | dark.ts
         ↓
scripts/build-tokens.ts
         ↓
src/styles/tokens.css
src/styles/theme-light.css      (AUTO-GENERATED)
src/styles/theme-dark.css

src/components/*/*.tsx + *.module.css   — public components
src/internal/*                        — kit infrastructure
src/hooks/*                           — hooks (e.g. form fields)
src/icons/*                           — icon wrappers
src/index.ts                          — public entry + globals.css

dist/                                 — ESM + types after tsup
```

**npm publish** (`package.json` → `files`): `dist`, `src/styles`, `LICENSE`. Explicit **`exports`**: main entry, `prime-ui-kit/components`, separate paths to `styles.css`, `tokens.css`, `theme-light.css`, `theme-dark.css`.

---

## What’s in the kit (feature overview)

Forms and input: **Input**, **Textarea**, **Checkbox**, **Radio**, **Switch**, **Select**, **Slider**, **DigitInput**, **FileUpload**, **ColorPicker**, **Hint**, **Label**, **Kbd**.

Overlays and layered navigation: **Modal**, **Drawer**, **Popover**, **Dropdown**, **Tooltip**, **CommandMenu**.

Layout and product chrome: **PageShell**, **PageContent**, **Sidebar**, **Breadcrumb**, **Tabs**, **Accordion**, **Stepper** (horizontal/vertical), **SegmentedControl**, **Pagination**, **DataTable**.

Feedback and content: **Button**, **ButtonGroup**, **LinkButton**, **Badge**, **Banner**, **Notification** (+ provider/store), **ProgressBar**, **ProgressCircle**, **Typography**, **Divider**, **Tag**, **Avatar**, **CodeBlock**, **Datepicker** (with presets and time).

Additionally: **ControlSizeProvider** for consistent control sizing in a subtree, **ExampleFrame** (for docs/playground).

The full export list is in `src/components/index.ts`. Live examples are in `playground/` (`bun run playground:dev`).

---

## Dependencies: straight talk

| Layer | Packages |
|------|--------|
| **Peer (required in the app)** | `react`, `react-dom`, `react-aria-components`, `react-day-picker`, `date-fns` |
| **Ships with the kit (dependencies)** | `lucide-react`, `framer-motion`, `react-router-dom` |

**React Aria** and **react-day-picker** are used where proven accessibility and calendar behavior are needed; the rest of the interactivity is implemented locally. **React Router** is required for links in **Sidebar**; without a router you can avoid those API surfaces or wrap the app in `Router`.

There is **no** `@radix-ui/*` in the source; polymorphic triggers go through the internal **Slot** (`src/internal/slot.tsx`).

---

## Installation

```bash
npm install prime-ui-kit
npm install react react-dom react-aria-components react-day-picker date-fns
```

Peer versions — see `package.json`.

---

## Wiring up styles

Recommended order at the entry point:

```css
@import "prime-ui-kit/tokens.css";
@import "prime-ui-kit/theme-light.css";
/* or theme-dark.css / switch via data-theme */
@import "prime-ui-kit/styles.css";
```

---

## Importing components

```tsx
import { Button, Input, Modal } from "prime-ui-kit";

import { DataTable } from "prime-ui-kit/components";
```

---

## API examples

```tsx
<Input.Root size="m" label="Email" id="email">
  <Input.Wrapper>
    <Input.Field type="email" placeholder="name@company.com" />
  </Input.Wrapper>
</Input.Root>

<Button variant="primary" mode="filled" size="l">
  Submit
</Button>
```

---

## Development and verification

| Command | Purpose |
|---------|------------|
| `bun run verify` | lint + types + tests + build |
| `bun run build` | tokens + `tsup` |
| `bun run tokens:build` | rebuild CSS tokens |
| `bun run playground:dev` | Vite playground |
| `bun run test` | Vitest |
| `bun run check` / `check:fix` | Biome |

Contributor contract — **`RULES.md`**. Assistant materials and checklists — **`prime-ui-skill/`** (not included in the npm package).

---

## CI and npm publishing

GitHub Secrets must include **`NPM_TOKEN`**.

- On push to `main` and on PRs — `bun run verify` runs.
- Release via **GitHub Release**: the workflow builds the package and runs `npm publish`.

Before a release, bump **`version`** in `package.json` and create a release with a tag like `v0.2.0` matching the package version.

---

## License

MIT — see `LICENSE`.

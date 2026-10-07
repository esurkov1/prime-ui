---
name: prime-ui-kit
description: >
  Build product UI with prime-ui-kit (React 19, CSS Modules, --prime-* tokens) the way its author would.
  Use when laying out screens, forms, tables, dashboards, settings or navigation on prime-ui-kit; when
  choosing which kit component fits a task; when a needed component is missing and must be composed from
  the kit; and when reviewing a screen for design-system compliance (spacing rhythm, sizes, tokens,
  states, a11y). Triggers: build a screen, page, form, table, settings, dashboard, navigation;
  which component to use; prime-ui-kit; review a screen against the design system — in any language.
---

# prime-ui-kit

You build screens only from kit components and `--prime-*` tokens. Every visually repeated element is one
component. If the kit lacks something, compose it from kit parts (see [composition.md](composition.md)).

## Where things are

Component docs and examples ship with the package. Paths below are relative to this folder in the kit
repository; in a consumer project the same files are under `node_modules/prime-ui-kit/`:

| What | Kit repository | Consumer project |
|---|---|---|
| Component reference | `../src/components/<dir>/COMPONENT.md` | `node_modules/prime-ui-kit/src/components/<dir>/COMPONENT.md` |
| Copyable scenarios | `../src/components/<dir>/examples/*.tsx` | `node_modules/prime-ui-kit/src/components/<dir>/examples/*.tsx` |
| AppShell, Sidebar | `../src/layout/<dir>/…` | `node_modules/prime-ui-kit/src/layout/<dir>/…` |

Read the component's `COMPONENT.md` before using it; copy structure from its `examples/`. Never guess props.

## Files of this skill

| File | Read when |
|---|---|
| [foundations.md](foundations.md) | always — grid, proximity scale, sizes, surfaces, type |
| [api-contract.md](api-contract.md) | writing JSX — prop names, controlled state, forms |
| [components.md](components.md) | finding a component and its docs |
| [choosing.md](choosing.md) | unsure which component fits |
| [composition.md](composition.md) | the kit has no ready component |
| [layouts.md](layouts.md) | starting a screen — skeletons for typical pages |
| [anti-slop.md](anti-slop.md) | before and after writing — what never to do |
| [checklist.md](checklist.md) | before handing the screen over |

## Setup (once per app)

```tsx
import "prime-ui-kit/styles.css"; // fonts, reset, tokens, light + dark themes
import "prime-ui-kit/bundle.css"; // component styles
import { applyTheme } from "prime-ui-kit";

applyTheme("light"); // sets data-theme on <html>; "dark" for the dark theme
```

Wrap the app in `NotificationProvider` if it shows toasts. Styles, `applyTheme`, `NotificationProvider`
and `AppShell` belong to the app root, once. A screen component you deliver renders only its page
(`PageContent…`) and assumes the root exists. If the project has no app frame yet, also deliver it as
a separate `AppLayout` from [layouts.md](layouts.md#app-frame-once-per-app) — never inline the frame
into a page.

Icons: the kit exports a small set (`Icon name="…"`, `IconSearch`, … — list in
[api-contract.md](api-contract.md#icons)). For any other icon add `lucide-react` to the app's own
dependencies and import from it; use the same icon library everywhere.

## How to build a screen

1. **Structure.** Pick the recipe in [layouts.md](layouts.md): `AppShell.Root` + `Sidebar` +
   `PageContent`. Write the regions first: header (title, description, page actions), then blocks.
2. **Components.** For each block choose the category, then the component ([choosing.md](choosing.md)).
   Open its `COMPONENT.md`, copy the closest file from `examples/`.
3. **Rhythm.** Apply the proximity scale ([foundations.md](foundations.md) §2): label→field 4–8,
   field→field 20, group→group 32, section→section 40–48. Spacing via `gap` on the parent, never margins.
4. **States.** Every data block has loading, empty and error; every field has hint/error; every action
   has disabled/loading. Wire them with the props the component already has.
5. **Check.** Walk [checklist.md](checklist.md) and [anti-slop.md](anti-slop.md). Fix, then hand over.

## Ten rules

1. Kit component first. A `div` that looks like a Card, Badge, Divider or Kbd is a bug.
2. Tokens only: `--prime-space-*`, `--prime-color-*`, `--prime-radius-*`, `--prime-text-*`. No raw px,
   rem, hex, no `--prime-ref-*`, no inline `style`.
3. Depth from fill, not lines: card on canvas, field inside card. No borders to separate blocks.
4. One size per row. Default `m` everywhere; change size for the whole row, not one control.
5. Air is hierarchy: tighter inside a group, wider between groups, widest between sections.
6. One primary action per area. The rest are `soft`/`ghost`/`outline` with `tone="neutral"`.
7. Labels above fields, always. Placeholder is an example value, never the label.
8. Text through `Typography.Root` roles (`heading-m` page title, `title-s` card title, `body-m` text,
   `caption` meta). No custom font sizes.
9. Overlays (Modal, Drawer, Popover, Dropdown, Tooltip, Select) come from the kit — never hand-made.
10. No decoration: no emoji, no icons that do not carry meaning, no explanatory text nobody asked for.

## Component structure

Compound components are used through parts: `Button.Root`, `Modal.Root > Modal.Content > Modal.Body`.
The namespace itself is not a component: `<Button>` is invalid, `<Button.Root>` is right. Leaf utilities
(`DataTable.Root` with column config, `Datepicker.Root`, `TagSelect.Root`) take data as props.

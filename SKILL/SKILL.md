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

You build screens only from kit components and `--prime-*` tokens, on the kit's own page skeleton.
Every visually repeated element is one component. The goal: a screen that looks as if the kit's author
polished it for weeks — one rhythm, one size, one primary action, fill instead of lines, a state for
every region, and states that flow into each other instead of flipping (`Crossfade` around every
region, `Skeleton` while it loads).

## How to use this skill

0. **Read first** — [cheatsheet.md](cheatsheet.md): one page of the decisions agents most often get
   wrong, each as «do this, not that» with the exact API.
1. **Choose** — [choosing.md](choosing.md): the category by task, then the component, then the pairs
   that are easy to confuse.
2. **Read the component** — [components.md](components.md) links each `COMPONENT.md` (API, variants,
   states, a11y, mistakes) and its `examples/`. Never guess a prop; copy structure from an example.
3. **Compose the screen** — [composition.md](composition.md): skeleton, rhythm, hierarchy, surfaces,
   actions, forms, tables, feedback, overlays, narrow screens. Start from the closest working screen in
   [patterns/](patterns/) and keep its skeleton.
4. **Check** — [checklist.md](checklist.md) and [anti-slop.md](anti-slop.md). Fix every «no», then hand
   over.

## Where things are

Component docs and examples ship with the package. Paths below are relative to this folder in the kit
repository; in a consumer project the same files are under `node_modules/prime-ui-kit/`:

| What | Kit repository | Consumer project |
|---|---|---|
| Component reference | `../src/components/<dir>/COMPONENT.md` | `node_modules/prime-ui-kit/src/components/<dir>/COMPONENT.md` |
| Copyable scenarios | `../src/components/<dir>/examples/*.tsx` | `node_modules/prime-ui-kit/src/components/<dir>/examples/*.tsx` |
| AppShell, Sidebar | `../src/layout/<dir>/…` | `node_modules/prime-ui-kit/src/layout/<dir>/…` |
| Whole screens | `patterns/*.tsx` (this folder) | copied with this skill |

## Files of this skill

| File | Read when |
|---|---|
| [cheatsheet.md](cheatsheet.md) | first — the most frequent decisions and mistakes in one page |
| [choosing.md](choosing.md) | unsure which component fits |
| [components.md](components.md) | finding a component and its docs |
| [composition.md](composition.md) | building any screen — the rules of assembly, and what to do when the kit lacks a component |
| [patterns/](patterns/) | starting a screen — list, detail, settings, form in Drawer, dashboard, states |
| [layouts.md](layouts.md) | the app frame (once per app), page wrappers, which pattern to start from, auth |
| [foundations.md](foundations.md) | always — grid, proximity scale, sizes, surfaces, type, tone and color |
| [api-contract.md](api-contract.md) | writing JSX — prop names, controlled state, forms, icons |
| [anti-slop.md](anti-slop.md) | before and after writing — what never to do |
| [checklist.md](checklist.md) | before handing the screen over |

## Setup (once per app)

```tsx
import "prime-ui-kit/bundle.css"; // tokens, light + dark themes, component styles
import "prime-ui-kit/fonts.css"; // optional: Golos Text + JetBrains Mono from Google Fonts
import "prime-ui-kit/reset.css"; // optional: minimal document reset (skip if the app has one)
import { applyTheme } from "prime-ui-kit";

applyTheme("light"); // sets data-theme on <html>; "dark" for the dark theme
```

Wrap the app in `NotificationProvider` if it shows toasts. Styles, `applyTheme`, `NotificationProvider`
and `AppShell` belong to the app root, once. A screen component you deliver renders only its page
(`PageContent…`) and assumes the root exists. If the project has no app frame yet, also deliver it as
a separate `AppLayout` from [layouts.md](layouts.md#app-frame-once-per-app) — never inline the frame
into a page.

Icons: the kit exports a set for product UI (`<Icon name="…" />` — names in
[api-contract.md](api-contract.md#icons)); take every glyph it has from it. Only for a domain glyph
the kit lacks add `lucide-react` to the app's own dependencies and wrap the glyph with `createIcon`;
use the same icon library everywhere.

## Ten rules

1. Kit component first. A `div` that looks like a Card, Badge, Divider or Kbd is a bug.
2. Tokens only: `--prime-space-*`, `--prime-color-*`, `--prime-radius-*`, `--prime-text-*`. No raw px,
   rem, hex, no `--prime-ref-*`, no inline `style`.
3. Depth from fill, not lines: Card on the panel, field inside the Card. No borders to separate blocks,
   no card around a table, no card in a card.
4. One size per row. Default `m` everywhere (omit `size`); change the tier for a whole region.
5. Air is hierarchy: tighter inside a group, wider between groups, widest between sections — spacing via
   `gap` on the parent, never margins.
6. One primary action per area. The rest are `soft`/`ghost`/`outline` with `tone="neutral"`.
7. Labels above fields, always. Placeholder is an example value, never the label.
8. Text through `Typography` roles (`title-m` section, `title-s` group, `body-m` text, `caption` meta;
   the page title is `PageContent.Title`). No custom font sizes.
9. Overlays (Modal, Drawer, Popover, Dropdown, Tooltip, CommandMenu, Select) come from the kit — never
   hand-made.
10. No decoration: no emoji, no icons that do not carry meaning, no explanatory text nobody asked for.

## Component structure

Components with parts are used through them: `Button.Root` + `Button.Icon`,
`Modal.Root > Modal.Content > Modal.Body`; the namespace itself is not a component (`<Button>` is
invalid, `<Button.Root>` is right). Leaves without parts are single exports: `<Typography>`, `<Kbd>`,
`<Divider>`, `<Spinner>`, `<LinkButton>`, `<NativeSelect>`, `<DigitInput>`, `<Slider>`, `<TagSelect>`,
`<ColorSwatches>`, `<CodeBlock>`, `<ProgressBar>`, `<ProgressCircle>`, `<Pagination>`. Data-driven
components take data as props: `DataTable` (`columns`, `rows`), `TagSelect` (`options`), `SmartFilter`
(`fields`), `ProgressBar` (`segments`).

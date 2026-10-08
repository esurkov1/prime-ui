---
name: prime-ui-kit
description: >
  Build product UI with prime-ui-kit (React 19, CSS Modules, --prime-* tokens) the way its author would.
  Use when laying out screens, forms, tables, dashboards, settings or navigation on prime-ui-kit; when
  choosing which kit component fits a task; when a needed component is missing and must be composed from
  the kit; when adding loading, empty and error states, feedback, motion or micro-animation to a screen;
  and when reviewing a screen for design-system compliance (spacing rhythm, sizes, tokens, states,
  motion, a11y, narrow screens). Triggers: build a screen, page, form, table, settings, dashboard,
  navigation; which component to use; animate, transition, loading state; prime-ui-kit; review a screen
  against the design system — in any language.
---

# prime-ui-kit

You build screens only from kit components and `--prime-*` tokens, on the kit's own page skeleton.
Every visually repeated element is one component. The goal: a screen that looks as if the kit's author
polished it for weeks — one rhythm, one size, one primary action, fill instead of lines, a state for
every region, and states that flow into each other instead of flipping (`Crossfade` around every
region, `Skeleton` while it loads).

## How to use this skill

0. **First** — [cheatsheet.md](cheatsheet.md): one page of the decisions agents most often get wrong,
   each as «do this, not that» with the exact API. Then follow the steps in order; each names its file.
1. **The app frame, once per app** — [layouts.md](layouts.md): styles, theme, providers, `AppShell`
   with `Sidebar` and `AppHeader`, page wrappers, auth screens. A screen you deliver renders only its page.
2. **Choose** — [choosing.md](choosing.md): the category by task, then the component, then the pairs
   that are easy to confuse.
3. **Read the component** — [components.md](components.md) links each `COMPONENT.md` (API, variants,
   states, a11y, mistakes) and its `examples/`. Never guess a prop; copy structure from an example.
4. **Compose the screen** — [composition.md](composition.md): start from the closest working screen in
   [patterns/](patterns/) and keep its skeleton; rhythm, hierarchy, surfaces and type in
   [foundations.md](foundations.md).
5. **Write the JSX** — [api-contract.md](api-contract.md): prop names, controlled state, forms,
   destructive actions, helpers, icon names.
6. **States and motion** — [motion.md](motion.md): every region loads, empties and fails without
   flipping; what the kit animates by itself and when to move your own elements.
7. **Narrow screens** — [responsive.md](responsive.md): every screen works from 320px, the page panel is
   `PageToolbar`, nothing is hidden on phones, touch follows `(hover)` / `(pointer)`.
8. **Check** — [checklist.md](checklist.md) and [anti-slop.md](anti-slop.md). Fix every «no», then hand
   over.

## Where things are

Every component link in this skill opens that component's `COMPONENT.md` (API, variants, states,
a11y, mistakes) or its `examples/` — follow the link, never guess a prop. The installed skill carries
them under `reference/`; the same files are in the kit repository under `src/` and in a consumer
project under `node_modules/prime-ui-kit/src/`.

| What | Installed skill | Consumer project |
|---|---|---|
| Component reference | `reference/components/<dir>/COMPONENT.md` | `node_modules/prime-ui-kit/src/components/<dir>/COMPONENT.md` |
| Copyable scenarios | `reference/components/<dir>/examples/*.tsx` | `node_modules/prime-ui-kit/src/components/<dir>/examples/*.tsx` |
| AppShell, Sidebar, AppHeader, BottomNav | `reference/layout/<dir>/…` | `node_modules/prime-ui-kit/src/layout/<dir>/…` |
| Whole screens | `patterns/*.tsx` | — (only in this skill) |

## Files of this skill

| File | Read when |
|---|---|
| [cheatsheet.md](cheatsheet.md) | first — the most frequent decisions and mistakes in one page |
| [layouts.md](layouts.md) | once per app — the app frame, page wrappers, auth screens |
| [choosing.md](choosing.md) | unsure which component fits; how to confirm a destructive action |
| [components.md](components.md) | finding a component and its `COMPONENT.md` / `examples/` |
| [composition.md](composition.md) | building any screen — the patterns table, the rules of assembly, what to do when the kit lacks a component |
| [patterns/](patterns/) | starting a screen — list, detail, settings, form in a Drawer, dashboard, states |
| [foundations.md](foundations.md) | grid, proximity scale, sizes, surfaces, type, tone and color |
| [api-contract.md](api-contract.md) | writing JSX — prop names, sizes and host tiers, controlled state, forms, helpers, icons |
| [motion.md](motion.md) | every screen — loading / empty / error that flow, what the kit animates, when to move, recipes |
| [responsive.md](responsive.md) | every screen — 320px and up, the page panel (`PageToolbar`), touch |
| [anti-slop.md](anti-slop.md) | before and after writing — what makes a screen look generated |
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

Icons: every glyph comes from the kit, and every kit icon is animated — its gesture plays when its
button, link, tab, menu item or row is hovered or pressed, which gives the screen life with no code.
Take a semantic `<Icon name="…" />` first, else a glyph from the full animated set
`prime-ui-kit/icons` (`<BellIcon />`, about 500); only a glyph neither has goes through
`createIcon` with `lucide-react`. Order, names and the full list: [api-contract.md](api-contract.md#icons).

## Ten rules

1. Kit component first. A `div` that looks like a Card, Badge, Divider or Kbd is a bug.
2. Tokens only: `--prime-space-*`, `--prime-color-*`, `--prime-radius-*`, `--prime-text-*`. No raw
   lengths or hex (a raw length only in `@media` / `@container` conditions), no `--prime-ref-*`, no
   inline `style`.
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
    Icons that do carry meaning come from the kit only (`<Icon name>`, `prime-ui-kit/icons`) — they
    are animated.

## Component structure

Components with parts are used through them: `Button.Root` + `Button.Icon`,
`Modal.Root > Modal.Content > Modal.Body`; the namespace itself is not a component (`<Button>` is
invalid, `<Button.Root>` is right). Leaves without parts are single exports (`<Typography>`,
`<Skeleton>`, `<DataTable>`, `<Sparkline>`… — the full list in [api-contract.md](api-contract.md)). Data-driven
components take data as props: `DataTable` (`columns`, `rows`), `TagSelect` (`options`), `SmartFilter`
(`fields`), `ProgressBar` (`segments`).

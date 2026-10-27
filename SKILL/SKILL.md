---
name: prime-ui-kit
description: >
  Build product UI with prime-ui-kit (React 19, CSS Modules, --prime-* tokens) the way its author would.
  Use when laying out screens, forms, tables, boards, schedules, chats, dashboards, settings or
  navigation on prime-ui-kit; when
  choosing which kit component fits a task; when a needed component is missing and must be composed from
  the kit; when adding loading, empty and error states, feedback, motion or micro-animation to a screen;
  when changing or redesigning a screen that exists; and when reviewing a screen for design-system and
  UX compliance (data shape and layout, repeated or redundant labels, copy, friction, spacing rhythm,
  sizes, tokens, states, motion, a11y, narrow screens). Triggers: build a screen, page, form, table,
  board, schedule, chat, uploads, settings, dashboard, navigation; repeating fields, add another row;
  which component to use; animate, transition, loading state; prime-ui-kit; improve, fix or review a
  screen against the design system — in any language.
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
   Changing a screen that exists: audit it first ([ux.md](ux.md#8-changing-a-screen-someone-built)),
   then make the change.
1. **Brief** — [ux.md](ux.md): five lines before any JSX (who and what for, the data and its shape,
   the main action, the states, the narrow screen); the shape of the data decides the layout, every
   label must carry something new, friction matches the cost of a mistake.
2. **The app frame, once per app** — [layouts.md](layouts.md): styles, theme, providers, `AppShell`
   with the `Sidebar`, page wrappers, auth screens. A screen you deliver renders its page: one
   `Page.Root` with its top bar (title, a line of data, its tools) and its body.
3. **Choose** — [choosing.md](choosing.md): the category by task, then the component, then the pairs
   that are easy to confuse.
4. **Read the component** — [components.md](components.md) links each `COMPONENT.md` (API, variants,
   states, a11y, mistakes) and its `examples/`. Never guess a prop; copy structure from an example.
5. **Compose the screen** — [composition.md](composition.md): start from the closest working screen (the
   [screens index](composition.md#screens): the `examples/screen.tsx` of its main component) and keep
   its skeleton; rhythm, hierarchy, surfaces and type in
   [foundations.md](foundations.md).
6. **Write the JSX** — [api-contract.md](api-contract.md): prop names, controlled state, events (async
   events return the request's Promise), forms and their submit flow (`Fieldset disabled`), uploads
   (`useUploadQueue`), destructive actions (`ConfirmDialog`), helpers (`groupMessages` for chat rows you build yourself),
   icon names.
7. **States and motion** — [motion.md](motion.md): every region loads, empties and fails without
   flipping; what the kit animates by itself and when to move your own elements.
8. **Narrow screens** — [responsive.md](responsive.md): every screen works from 320px, the page's top bar
   gives way by width itself, nothing is hidden on phones, touch follows `(hover)` / `(pointer)`.
9. **Check** — [checklist.md](checklist.md) and [anti-slop.md](anti-slop.md), then look at the screen
   in a browser ([ux.md](ux.md#9-look-at-it-before-handing-it-over)). Fix every «no», then hand
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
| AppShell, Sidebar, BottomNav, Page | `reference/layout/<dir>/…` | `node_modules/prime-ui-kit/src/layout/<dir>/…` |
| Whole screens | `reference/<base>/<dir>/examples/screen.tsx` | `node_modules/prime-ui-kit/src/<base>/<dir>/examples/screen.tsx` |

## Files of this skill

| File | Read when |
|---|---|
| [cheatsheet.md](cheatsheet.md) | first — the most frequent decisions and mistakes in one page |
| [ux.md](ux.md) | before the layout of every screen and before changing one — the brief, data shape → layout, label economy, copy, friction, defaults, the visual check |
| [layouts.md](layouts.md) | once per app — the app frame, page wrappers, auth screens |
| [choosing.md](choosing.md) | unsure which component fits (Gantt / Timeline / Kanban / DataTable, Message / Composer, FileUpload list / grid / gallery / strip, ColorField / ColorPicker…); how to confirm a destructive action |
| [components.md](components.md) | finding a component and its `COMPONENT.md` / `examples/` |
| [composition.md](composition.md) | building any screen — the screens index (list, detail, settings, form in a Drawer, dashboard, states, messenger, board, app frame, media library, schedule, record editor) and what each one teaches, the rules of assembly, what to do when the kit lacks a component |
| [foundations.md](foundations.md) | grid, proximity scale, sizes, surfaces, type, tone and color |
| [api-contract.md](api-contract.md) | writing JSX — prop names, sizes and host tiers, controlled state, forms, helpers, icons |
| [motion.md](motion.md) | every screen — loading / empty / error that flow, what the kit animates, when to move, recipes |
| [responsive.md](responsive.md) | every screen — 320px and up, the page's top bar (`Page.TopBar`), touch |
| [anti-slop.md](anti-slop.md) | before and after writing — what makes a screen look generated |
| [checklist.md](checklist.md) | before handing the screen over |

## Setup (once per app)

```tsx
import "prime-ui-kit/fonts.css"; // optional: Golos Text + JetBrains Mono, metric-matched fallbacks
import "prime-ui-kit/reset.css"; // optional: minimal document reset (skip if the app has one)
import { applyTheme } from "prime-ui-kit";

applyTheme("light"); // sets data-theme on <html>; "dark" for the dark theme
```

`fonts.css` loads the faces from Google Fonts, so an app that runs offline or under a strict CSP (a
desktop app with `default-src 'self'`, a device's panel) leaves it out and self-hosts them —
`@fontsource/golos-text` (400, 500, 600) and `@fontsource/jetbrains-mono` (400, 500), which the
token stacks pick up by name — or keeps the system font.

Wrap the app in `NotificationProvider` if it shows toasts. Styles, `applyTheme`, `NotificationProvider`
and `AppShell` belong to the app root, once. A screen component you deliver renders its page — one
`Page.Root` with its `Page.TopBar` and its `Page.Body` — and assumes the root exists. If the project has no app
frame yet, also deliver it as a separate root layout from
[layouts.md](layouts.md#app-frame-once-per-app) — never inline the frame into a page.

Build: the kit's styles come with its components and the package is marked side-effect free, so any
bundler (Vite, webpack, Next.js, esbuild) ships only the components a screen imports and their CSS —
import from `"prime-ui-kit"`, never a copied component or stylesheet. Pick the build by where the
frontend runs:

- **Embedded UI** (a device's web panel served from a microcontroller, a router, a printer — flash
  measured in megabytes): one small single-page app on Vite, the system font (no `fonts.css`), no
  router package when two or three tabs do, no `prime-ui-kit/color-picker`; compress the output
  (`.gz` or `.br` beside each file) and serve it with `Content-Encoding`; keep the asset count low
  (no code splitting) when the device's web server handles few connections. Set a gzip budget from
  the free flash and read it on every build (Vite prints the gzip sizes): React itself is about
  60 KB of it, and the heavy kit parts are DataTable, Gantt, Kanban, Chat, MediaViewer, Datepicker
  and the color picker — a settings screen of fields, switches and cards needs none of them.
- **An app or a site**: the framework's own build as is — code-split by route (`React.lazy` or the
  router's lazy routes), so a page loads only its components; heavy optional parts (`color-picker`,
  charts, the chat) load on the routes that use them.

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
   no card around a table ([surfaces](foundations.md#4-fill-not-lines)).
4. One size per row. Default `m` everywhere (omit `size`); change the tier for a whole region.
5. Air is hierarchy: tighter inside a group, wider between groups, widest between sections — spacing via
   `gap` on the parent, never margins.
6. One primary action per area. Every other button with text is `soft` with `tone="neutral"`; `ghost` only for icon-only buttons; no `outline` buttons.
7. Labels above fields, always — once per column for records in rows (`FieldList`), never numbered
   («Пункт 1»), never repeating their heading. Placeholder is an example value, never the label.
8. Text through `Typography` roles (`title-m` section, `title-s` group, `body-m` text, `caption` meta;
   the page title is `Page.Title`, one per page: in the `Page.Heading` of `Page.TopBar` on every screen
   of data — lists, boards, records, dashboards and analytics alike; in the flow only on a document page
   with no page tools). No custom font sizes.
9. Overlays (Modal, ConfirmDialog, Drawer, Sheet, Popover, Dropdown, Tooltip, CommandMenu, Select,
   MediaViewer) come from the kit — never hand-made — and stay mounted: drive them with `open`,
   never `{open && …}`.
10. No decoration: no emoji, no icons that do not carry meaning, no explanatory text nobody asked for.
    Icons that do carry meaning come from the kit only (`<Icon name>`, `prime-ui-kit/icons`) — they
    are animated.

## Component structure

Components with parts are used through them: `Button.Root` + `Button.Icon`,
`Modal.Root > Modal.Content > Modal.Body`; the namespace itself is not a component (`<Button>` is
invalid, `<Button.Root>` is right). Leaves without parts are single exports (`<Typography>`,
`<Skeleton>`, `<DataTable>`, `<Sparkline>`… — the full list in [api-contract.md](api-contract.md)). Data-driven
components take data as props: `DataTable` (`columns`, `rows`), `Gantt` (`rows`, `getRowBars`), `Kanban`
(`columns`, `items`), `TagSelect` (`options`), `SmartFilter` (`fields`), `ProgressBar` (`segments`).

# AppShell

**Category:** page
**Kind:** layout

> The app frame: a navigation rail on the canvas and a content panel on the surface.

## When to use
- The root layout of an application: navigation column, optional sticky header, scrolling main column, a bottom bar for phone navigation.
- Any page that needs the kit's responsive gutters and the surface context for cards and fields.

## When not to use
- The navigation itself → use [Sidebar](../sidebar/COMPONENT.md) inside `AppShell.Nav`, [BottomNav](../bottom-nav/COMPONENT.md) inside `AppShell.Footer`.
- Page heading, actions and sections inside main → use [PageContent](../../components/page-content/COMPONENT.md).
- A temporary side panel over the page → use [Drawer](../../components/drawer/COMPONENT.md).
- A scroll region inside a page → use [ScrollContainer](../../components/scroll-container/COMPONENT.md).

## Import
```tsx
import { AppShell } from "prime-ui-kit";
```

## Anatomy
```
AppShell.Root                grid: nav column | content panel (bg-surface)
├─ AppShell.Nav              navigation column on the canvas (usually Sidebar.Root)
├─ AppShell.Header           sticky top bar of the panel
├─ AppShell.Main             <main>, scrolls, carries the gutters
└─ AppShell.Footer           sticky bottom bar of the panel (usually BottomNav.Root)
AppShell.Template            Root + Nav + Header + Main + Footer in one component
```
Every child of Root that is not `AppShell.Nav` is placed into the content panel.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### AppShell.Root
`ref` → `HTMLDivElement`. Grid of the nav column (canvas) and the content panel (surface); every child that is not `AppShell.Nav` goes into the panel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fillViewport` | `boolean` | `false` | The shell is exactly the viewport high and only `AppShell.Main` scrolls; otherwise the document scrolls and the nav is sticky. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Nav, Header, Main, Footer), `className` and the other div attributes. |

### AppShell.Nav
`ref` → `HTMLDivElement`. The navigation column slot (not a landmark: Sidebar renders the `<nav>`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (usually `Sidebar.Root`), `className` and the other div attributes. |

### AppShell.Header
`ref` → `HTMLElement`. Sticky `<header>` row of the panel for breadcrumbs, search and actions; keeps the top safe-area inset and stops sticking below 480px of viewport height.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes. |

### AppShell.Main
`ref` → `HTMLElement`. The `<main>` with the canonical gutters: a vertical `ScrollContainer`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `contentWidth` | `"contained" \| "full"` | `"full"` | `full` — the whole panel with gutters; `contained` — a centred column up to `--prime-layout-content-max-width`. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes. |

### AppShell.Footer
`ref` → `HTMLDivElement`. Sticky bottom bar of the panel for `BottomNav`; no padding of its own. A container (`prime-shell-footer`): BottomNav inside shows only while the panel is narrower than 640px.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (usually `BottomNav.Root`), `className` and the other div attributes. |

### AppShell.Template
`ref` → the `<main>`. Root + Nav + Header + Main + Footer in one; main scrolls to the top when `scrollResetKey` changes.

| Prop | Type | Default | Description |
|---|---|---|---|
| `nav` | `ReactNode` | — | Navigation column content; without it the panel takes the full width. |
| `header` | `ReactNode` | — | Header content; no header row when omitted. |
| `footer` | `ReactNode` | — | Footer content (`BottomNav`); no footer when omitted. |
| `mainProps` | `Omit<AppShellMainProps, "children">` | — | Props for Main (e.g. `contentWidth`). |
| `scrollResetKey` | `unknown` | — | Main scrolls back to the top whenever this value changes; pass the router pathname. |
| `children` | `ReactNode` | — | Page content inside Main. |
| `…rest` | `Omit<AppShellRootProps, "children">` | — | Root props: `fillViewport`, `className` and the div attributes. |

## Variants

### fillViewport (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | Shell at least viewport high; the document scrolls; nav sticks to the top | Content sites, simple apps | yes |
| `true` | Shell exactly viewport high; only Main scrolls; header and nav stay put | Dense apps with a fixed frame | |

### contentWidth (Main)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `full` | Content spans the panel with responsive gutters | Tables, dashboards | yes |
| `contained` | Centred column up to the content max width | Long-read pages | |

### Structure
| Value | Looks like | Use when | Default |
|---|---|---|---|
| with `AppShell.Nav` | Two columns: canvas rail + surface panel | Apps with navigation | |
| without Nav | Panel takes the full width | Single-page tools, auth screens | |
| with `AppShell.Header` | Sticky bar at the top of the panel | Breadcrumbs, page actions, mobile menu button | |
| with `AppShell.Footer` | Sticky bar at the bottom of the panel, shown while it holds a visible bar | BottomNav on a phone | |

`AppShell.Template` with `nav={<Sidebar.Root …/>}` and `PageContent` inside is the standard app; `contentWidth="contained"` + `PageContent.Root maxWidth="readable"` for docs and articles.

## States
| State | Driven by | DOM |
|---|---|---|
| fixed frame | `fillViewport` | `data-fill-viewport="true"` on Root |
| content width | `contentWidth` | `data-content-width` on Main |
| short viewport | viewport below 480px high (a phone on its side) | Header stops sticking |
| footer bar | panel width (container `prime-shell-footer` on Footer) | BottomNav inside leaves from 640px of panel width; the empty footer takes no room |

## Layout & spacing
- Two full-height planes edge to edge: no inset, radius, shadow or border — the boundary is the fill change (canvas → surface).
- Gutters in Main and Header: `--prime-layout-gutter-s` (16) → `-m` (24) from 640px → `-l` (32) from 1024px. Main top padding `--prime-space-6` (24) → `--prime-space-10` (40) from 1024px; bottom `--prime-space-16`.
- Header: min height = control m + 2 × `--prime-space-3`, padding-block `--prime-space-3` (the top grows to the safe-area inset), `z-index: --prime-z-sticky`.
- Footer: no padding of its own (BottomNav keeps the bottom safe-area inset), sticky at the bottom, `z-index: --prime-z-sticky`.
- The panel is a surface context: fields use the surface field fill, Cards inside become sunken tiles without shadow.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Main is the `<main>` landmark and Header is `<header>`; the navigation landmarks come from Sidebar and BottomNav (`<nav>`).
- Give the page one `<h1>` (PageContent.Title).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The app frame: Sidebar in the nav column, breadcrumbs in the sticky header, the page in main; only main scrolls — `fillViewport`. |
| [contained.tsx](examples/contained.tsx) | A shell without navigation whose main column is centred and capped for long reads — `contentWidth`. |
| [footer.tsx](examples/footer.tsx) | A phone-wide app: the bar in the footer stays at the bottom while main scrolls under it, and leaves once the panel is 640px wide — `AppShell.Footer`. |
| [template.tsx](examples/template.tsx) | Root, nav, header and main in one component; main scrolls back to the top whenever the page changes — `AppShell.Template` with `scrollResetKey`. |

## Mistakes
- Adding padding around the page content → Main already has the gutters.
- Wrapping Main content in another scroll container → Main scrolls (with `fillViewport`) or the document does.
- A border or shadow between nav and panel → the fill change is the boundary.
- Putting the Sidebar directly in Root without `AppShell.Nav` → it lands inside the content panel.
- `AppShell.Template` in a router app without `scrollResetKey` → a new page opens at the old scroll position; pass the pathname.

## Related
- **Built from:** [ScrollContainer](../../components/scroll-container/COMPONENT.md)
- **See also:** [Sidebar](../sidebar/COMPONENT.md), [BottomNav](../bottom-nav/COMPONENT.md), [PageContent](../../components/page-content/COMPONENT.md), [Breadcrumb](../../components/breadcrumb/COMPONENT.md)

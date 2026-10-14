# AppShell

**Category:** page
**Kind:** layout

> The app frame: a content panel that is the page itself and a navigation rail one layer above it.

## When to use
- The root layout of an application: navigation column, an optional AppHeader, scrolling main column, a bottom bar for phone navigation.
- Any page that needs the kit's responsive gutters and the surface ladder for cards and fields.

## When not to use
- The navigation itself → use [Sidebar](../sidebar/COMPONENT.md) inside `AppShell.Nav`, [BottomNav](../bottom-nav/COMPONENT.md) inside `AppShell.Footer`.
- The page's top bar (the page title, its tools, the menu button) → use [AppHeader](../app-header/COMPONENT.md) anywhere in the shell: it renders in the shell's header row.
- Page heading, actions and sections inside main → use [PageContent](../../components/page-content/COMPONENT.md).
- A temporary side panel over the page → use [Drawer](../../components/drawer/COMPONENT.md).
- A scroll region inside a page → use [ScrollContainer](../../components/scroll-container/COMPONENT.md).

## Import
```tsx
import { AppShell } from "prime-ui-kit";
```

## Anatomy
```
AppShell.Root                grid: nav column | content panel (the page, layer 0)
├─ AppShell.Nav              navigation column (usually Sidebar.Root, a surface one layer above the page)
├─ (header row)              the panel's top: the latest AppHeader.Root in the shell renders here
├─ AppShell.Main             <main>, scrolls, carries the gutters
└─ AppShell.Footer           sticky bottom bar of the panel (usually BottomNav.Root)
AppShell.Template            Root + Nav + the header + Main + Footer in one component
useAppShellNav()             the navigation the Sidebar publishes, for triggers outside the rail
```
Every child of Root that is not `AppShell.Nav` is placed into the content panel. An `AppHeader.Root` anywhere in the shell — a child of Root, `Template.header`, a page's own one in main — renders in the header row; the latest one on screen wins, so a page's header replaces the default while that page is shown.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### AppShell.Root
`ref` → `HTMLDivElement`. Grid of the nav column and the content panel (the page itself); every child but `AppShell.Nav` goes into the panel. Owns the navigation its Sidebar publishes (`useAppShellNav`) and the header row an `AppHeader.Root` anywhere in it renders in.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fillViewport` | `boolean` | `false` | The shell is exactly the viewport high and only `AppShell.Main` scrolls; otherwise the document scrolls and the nav is sticky. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Nav, `AppHeader.Root`, Main, Footer), `className` and the other div attributes. |

### AppShell.Nav
`ref` → `HTMLDivElement`. The navigation column slot (not a landmark: Sidebar renders the `<nav>`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (usually `Sidebar.Root`), `className` and the other div attributes. |

### AppShell.Main
`ref` → `HTMLElement`. The `<main>` with the canonical gutters: a vertical `ScrollContainer`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `contentWidth` | `"contained" \| "full"` | `"full"` | `full` — the whole panel with gutters; `contained` — a centred column up to `--prime-layout-content-max-width`. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes. |

### AppShell.Footer
`ref` → `HTMLDivElement`. Sticky bottom bar of the panel for `BottomNav`; no padding of its own. Shows only while the shell has no navigation column on screen (no `AppShell.Nav`, or the Sidebar is off-canvas); with the rail on screen the footer leaves.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (usually `BottomNav.Root`), `className` and the other div attributes. |

### AppShell.Template
`ref` → the `<main>`. Root + Nav + the header + Main + Footer in one; main scrolls to the top when `scrollResetKey` changes.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fillViewport` | `boolean` | `false` | As on `AppShell.Root`: only `<main>` scrolls. |
| `nav` | `ReactNode` | — | Navigation column content; without it the panel takes the full width. |
| `header` | `ReactNode` | — | The default header row, an `AppHeader.Root`: a page that renders its own header replaces it while that page is on screen. |
| `footer` | `ReactNode` | — | Footer content (`BottomNav`); no footer when omitted. |
| `mainProps` | `Omit<AppShellMainProps, "children">` | — | Props for Main (e.g. `contentWidth`). |
| `scrollResetKey` | `unknown` | — | Main scrolls back to the top whenever this value changes; pass the router pathname. |
| `children` | `ReactNode` | — | Page content inside Main. |
| `…rest` | `Omit<AppShellRootProps, "children">` | — | Root props: `fillViewport`, `className` and the div attributes. |

### Types

#### `AppShellNavState`
The navigation of the shell, as its Sidebar publishes it.

| Field | Type | Default | Description |
|---|---|---|---|
| `navId` | `string` | — | `id` of the navigation landmark, for `aria-controls`. |
| `offCanvas` | `boolean` | — | The navigation is an off-canvas panel now (a phone, or `offCanvas="always"`). |
| `open` | `boolean` | — | The off-canvas panel is open. |
| `setOpen` | `(open: boolean) => void` | — | Opens or closes the off-canvas panel. |
| `expanded` | `boolean` | — | The navigation is in view: the off-canvas panel open, or the rail expanded. |
| `toggle` | `() => void` | — | Opens or closes the off-canvas panel; on screen, expands or folds the rail. |

### Functions

#### `useAppShellNav()`
`() => AppShellNavState \| null`

The navigation of the nearest `AppShell.Root` for a trigger outside the rail (a BottomNav «Ещё», an own menu button); `null` outside a shell or without a Sidebar in it.

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
| with `AppShell.Nav` | Two columns: a rail one layer above the page + the panel that is the page | Apps with navigation | |
| without Nav | Panel takes the full width | Single-page tools, auth screens | |
| with `AppHeader.Root` | Sticky bar in the header row at the top of the panel, from anywhere in the shell | The page title (or the path and the record), the page's tools and buttons; on a phone it leads with the menu button | |
| with `AppShell.Footer` | Sticky bar at the bottom of the panel, shown while no navigation column is on screen | BottomNav on a phone | |

`AppShell.Template` with `nav={<Sidebar.Root …/>}` and `PageContent` inside is the standard app; `contentWidth="contained"` + `PageContent.Root maxWidth="readable"` for docs and articles.

## States
| State | Driven by | DOM |
|---|---|---|
| fixed frame | `fillViewport` | `data-fill-viewport="true"` on Root |
| navigation column | an `AppShell.Nav` child | `data-nav="true"` on Root (two grid columns) |
| content width | `contentWidth` | `data-content-width` on Main |
| off-canvas navigation | the Sidebar publishes that it is an off-canvas panel (`offCanvas="auto"` on a phone, `"always"`) | `data-off-canvas="true"` on Root; `useAppShellNav()` reports `offCanvas`, `open`, `navId` |
| footer bar | the navigation column: `AppShell.Nav` with a Sidebar that is not off-canvas | the footer is `display: none` while the rail is on screen; without Nav or with an off-canvas Sidebar it stays at any width |
| header row | an `AppHeader.Root` in the shell | the latest one on screen renders at the top of the panel, before main |

## Layout & spacing
- Two full-height planes edge to edge: no inset, radius, shadow or border — the boundary is the fill change (the Sidebar rail is layer 1, the panel the page: white rail beside a gray page in light, a rail one step lighter than the near-black page in dark).
- Gutters in Main (and in the header row): the page gutter `--prime-layout-gutter` — `--prime-layout-gutter-s` (16) → `-m` (24) from 640px → `-l` (32) from 1024px. Main top padding `--prime-space-6` (24) → `--prime-space-8` (32) from 1024px; bottom `--prime-space-16`. Inside Main the page gutter is the small one again, so a frame nested in the page starts from its own gutter, not the shell's.
- A page that fills the panel height (`PageContent.Root fill`): Main's bottom padding drops to the side gutter, so no long scroll tail stays under it.
- Main scrolls with `overscroll-behavior: contain`, so its scroll never chains to the document.
- Nav column: sticky at the top, viewport high, `z-index: --prime-z-sticky` (above the panel, so the compact Sidebar toggle can ride the rail edge); with `fillViewport` it fills the shell height instead.
- Footer: no padding of its own (BottomNav keeps the bottom safe-area inset), sticky at the bottom, `z-index: --prime-z-sticky`.
- A floating BottomNav (`floating`) in the footer: the footer takes no height, the capsule overlays the page, and Main keeps extra bottom room (the capsule height and the safe-area inset) so its last line never ends up under it.
- The panel is the page (layer 0 of the surface ladder, gray in light): fields on it take the page fill, a Card inside is layer 1 — white in light with the raised whisper — and cards in cards go deeper.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Main is the `<main>` landmark; the banner comes from AppHeader (`<header>`), the navigation landmarks from Sidebar and BottomNav (`<nav>`).
- One `<h1>` per page: `AppHeader.Title` on app pages, `PageContent.Title` on a document page (whose header then has no title).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The app frame: Sidebar in the nav column, the page title and its action in the AppHeader, the page in main; only main scrolls — `fillViewport`. |
| [contained.tsx](examples/contained.tsx) | A shell without navigation whose main column is centred and capped for long reads — `contentWidth`. |
| [footer.tsx](examples/footer.tsx) | A phone app without a Sidebar: the bar in the footer stays at the bottom while main scrolls under it — `AppShell.Footer`. |
| [template.tsx](examples/template.tsx) | Root, nav, header and main in one component; main scrolls back to the top whenever the page changes — `AppShell.Template`, `scrollResetKey`. |
| [screen.tsx](examples/screen.tsx) | The app frame for desktop and phone: the Sidebar rail on a wide screen, the floating BottomNav in the footer on a phone whose More item opens the Sidebar, the AppHeader with the menu button it draws by itself, the page title with a line of data, and a simple home page that swaps with the current section — `fillViewport`, `scrollResetKey`, `useAppShellNav`. |

## Mistakes
- Adding padding around the page content → Main already has the gutters.
- Wrapping Main content in another scroll container → Main scrolls (with `fillViewport`) or the document does.
- A border or shadow between nav and panel → the fill change is the boundary.
- Putting the Sidebar directly in Root without `AppShell.Nav` → it lands inside the content panel.
- BottomNav anywhere but `AppShell.Footer` → it stays next to the Sidebar rail on a desktop; the footer is what leaves while the rail is on screen.
- `AppShell.Template` in a router app without `scrollResetKey` → a new page opens at the old scroll position; pass the pathname.
- A hand-wired menu state shared by the Sidebar, a menu button and a BottomNav «Ещё» → the Sidebar publishes it to the shell: the AppHeader draws the menu button, other triggers read `useAppShellNav()`.

## Related
- **Built from:** [ScrollContainer](../../components/scroll-container/COMPONENT.md)
- **See also:** [AppHeader](../app-header/COMPONENT.md), [Sidebar](../sidebar/COMPONENT.md), [BottomNav](../bottom-nav/COMPONENT.md), [PageContent](../../components/page-content/COMPONENT.md), [Breadcrumb](../../components/breadcrumb/COMPONENT.md)

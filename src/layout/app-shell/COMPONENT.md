# AppShell

**Category:** page
**Kind:** layout

> The app frame — navigation and the page: a content panel that is the page itself and a navigation rail one layer above it.

## When to use
- The root layout of an application: navigation column, the scrolling main where the page renders, a bottom bar for phone navigation.
- Any page that needs the kit's responsive gutters and the surface ladder for cards and fields.

## When not to use
- The navigation itself → use [Sidebar](../sidebar/COMPONENT.md) inside `AppShell.Nav`, [BottomNav](../bottom-nav/COMPONENT.md) inside `AppShell.Footer`.
- Anything at the top of the page — the title, its actions and tools, the phone menu button → the page's own top bar, [Page](../page/COMPONENT.md) `Page.TopBar`; the shell has no header.
- Page heading, actions and sections inside main → use [Page](../page/COMPONENT.md).
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
├─ AppShell.Main             <main>, scrolls; hands the page (Page.Root) its gutters and top air
└─ AppShell.Footer           sticky bottom bar of the panel (usually BottomNav.Root)
AppShell.Template            Root + Nav + Main + Footer in one component
useAppShellNav()             the navigation the Sidebar publishes, for triggers outside the rail
```
Every child of Root that is not `AppShell.Nav` is placed into the content panel. Everything at the top of the panel belongs to the page: its `Page.TopBar` sticks to the top of main.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### AppShell.Root
`ref` → `HTMLDivElement`. Grid of the nav column and the content panel (the page itself); every child but `AppShell.Nav` goes into the panel. Owns the navigation its Sidebar publishes (`useAppShellNav`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `fillViewport` | `boolean` | `false` | The shell is exactly the viewport high and only `AppShell.Main` scrolls; otherwise the document scrolls and the nav is sticky. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Nav, Main, Footer), `className` and the other div attributes. |

### AppShell.Nav
`ref` → `HTMLDivElement`. The navigation column slot (not a landmark: Sidebar renders the `<nav>`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (usually `Sidebar.Root`), `className` and the other div attributes. |

### AppShell.Main
`ref` → `HTMLElement`. The `<main>` where the page renders: a vertical `ScrollContainer` that hands `Page.Root` the gutters and top air (`--page-gutter`, `--page-top`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes. |

### AppShell.Footer
`ref` → `HTMLDivElement`. Sticky bottom bar of the panel for `BottomNav`; no padding of its own. Shows only while the shell has no navigation column on screen (no `AppShell.Nav`, or the Sidebar is off-canvas); with the rail on screen the footer leaves.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (usually `BottomNav.Root`), `className` and the other div attributes. |

### AppShell.Template
`ref` → the `<main>`. Root + Nav + Main + Footer in one; main scrolls to the top when `scrollResetKey` changes.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fillViewport` | `boolean` | `false` | As on `AppShell.Root`: only `<main>` scrolls. |
| `nav` | `ReactNode` | — | Navigation column content; without it the panel takes the full width. |
| `footer` | `ReactNode` | — | Footer content (`BottomNav`); no footer when omitted. |
| `mainProps` | `Omit<AppShellMainProps, "children">` | — | Props for Main (`id`, `tabIndex` for a skip link). |
| `scrollResetKey` | `unknown` | — | Main scrolls back to the top whenever this value changes; pass the router pathname. |
| `children` | `ReactNode` | — | The page inside Main (`Page.Root`). |
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
| `true` | Shell exactly viewport high; only Main scrolls; nav and the page's sticky top bar stay put | Dense apps with a fixed frame | |

### Structure
| Value | Looks like | Use when | Default |
|---|---|---|---|
| with `AppShell.Nav` | Two columns: a rail one layer above the page + the panel that is the page | Apps with navigation | |
| without Nav | Panel takes the full width | Single-page tools, auth screens | |
| with `AppShell.Footer` | Sticky bar at the bottom of the panel, shown while no navigation column is on screen | BottomNav on a phone | |

`AppShell.Template` with `nav={<Sidebar.Root …/>}` and a `Page.Root` inside is the standard app; `Page.Root maxWidth="readable"` for docs and articles.

## States
| State | Driven by | DOM |
|---|---|---|
| fixed frame | `fillViewport` | `data-fill-viewport="true"` on Root |
| navigation column | an `AppShell.Nav` child | `data-nav="true"` on Root (two grid columns) |
| off-canvas navigation | the Sidebar publishes that it is an off-canvas panel (`offCanvas="auto"` on a phone, `"always"`) | `data-off-canvas="true"` on Root; `useAppShellNav()` reports `offCanvas`, `open`, `navId` |
| footer bar | the navigation column: `AppShell.Nav` with a Sidebar that is not off-canvas | the footer is `display: none` while the rail is on screen; without Nav or with an off-canvas Sidebar it stays at any width |

## Layout & spacing
- Two full-height planes edge to edge: no inset, radius, shadow or border — the boundary is the fill change (the Sidebar rail is layer 1, the panel the page: white rail beside a gray page in light, a rail one step lighter than the near-black page in dark).
- Main hands the page its edge air: `--page-gutter` is the page gutter `--prime-layout-gutter` — `--prime-layout-gutter-s` (16) → `-m` (24) from 640px → `-l` (32) from 1024px; `--page-top` is `--prime-space-6` (24) → `--prime-space-8` (32) from 1024px. `Page.Root` pads itself with them (its top bar steps out to the panel's edges). Main itself pads only the bottom: `--prime-space-16`. Inside Main the page gutter is the small one again, so a frame nested in the page starts from its own gutter, not the shell's.
- A page that fills the panel height (`Page.Root fill`): Main's bottom padding drops to the side gutter, so no long scroll tail stays under it.
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

- Main is the `<main>` landmark; the navigation landmarks come from Sidebar and BottomNav (`<nav>`). The page's top bar is a `<header>` inside main, not a banner.
- One `<h1>` per page: its `Page.Title`, in the top bar or in the flow.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The app frame: Sidebar in the nav column, the page in main with its title and action in its top bar; only main scrolls — `fillViewport`. |
| [footer.tsx](examples/footer.tsx) | A phone app without a Sidebar: the bar in the footer stays at the bottom while main scrolls under it — `AppShell.Footer`. |
| [template.tsx](examples/template.tsx) | Root, nav, main and footer in one component; main scrolls back to the top whenever the page changes — `AppShell.Template`, `scrollResetKey`. |
| [screen.tsx](examples/screen.tsx) | The app frame for desktop and phone: the Sidebar rail on a wide screen, the floating BottomNav in the footer on a phone whose More item opens the Sidebar, the page top bar with the menu button it draws by itself, the page title with a line of data, and a simple home page that swaps with the current section — `fillViewport`, `scrollResetKey`, `useAppShellNav`. |

## Mistakes
- Adding padding around the page content → `Page.Root` takes the gutters Main hands it.
- Wrapping Main content in another scroll container → Main scrolls (with `fillViewport`) or the document does.
- A border or shadow between nav and panel → the fill change is the boundary.
- Putting the Sidebar directly in Root without `AppShell.Nav` → it lands inside the content panel.
- BottomNav anywhere but `AppShell.Footer` → it stays next to the Sidebar rail on a desktop; the footer is what leaves while the rail is on screen.
- `AppShell.Template` in a router app without `scrollResetKey` → a new page opens at the old scroll position; pass the pathname.
- A hand-wired menu state shared by the Sidebar, a menu button and a BottomNav «Ещё» → the Sidebar publishes it to the shell: the page's `Page.TopBar` draws the menu button, other triggers read `useAppShellNav()`.

## Related
- **Built from:** [ScrollContainer](../../components/scroll-container/COMPONENT.md)
- **See also:** [Page](../page/COMPONENT.md), [Sidebar](../sidebar/COMPONENT.md), [BottomNav](../bottom-nav/COMPONENT.md), [Breadcrumb](../../components/breadcrumb/COMPONENT.md)

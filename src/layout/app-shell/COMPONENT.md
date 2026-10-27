# AppShell

**Category:** page
**Kind:** layout

> The app frame — navigation and the page: a content panel that is the page itself and a navigation rail one layer above it.

## When to use
- The root layout of an application: navigation column, the scrolling main where the page renders, a bottom bar for phone navigation.
- An app-wide floating main action (an assistant, a quick create) that stays on every page, desktop and phone → `AppShell.Fab`.
- Any page that needs the kit's responsive gutters and the surface ladder for cards and fields.

## When not to use
- The navigation itself → use [Sidebar](../sidebar/COMPONENT.md) inside `AppShell.Nav`, [BottomNav](../bottom-nav/COMPONENT.md) inside `AppShell.Footer`.
- Anything at the top of the page — the title, its actions and tools, the phone menu button → the page's own top bar, [Page](../page/COMPONENT.md) `Page.TopBar`; the shell has no header.
- Page heading, actions and sections inside main → use [Page](../page/COMPONENT.md).
- The main action of one page → its `Page.Actions`; a round action beside the phone bar → `BottomNav.Action`. `AppShell.Fab` is for the one action the whole app keeps in the corner.
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
├─ AppShell.Footer           bottom bar of the panel in its sticky dock (usually BottomNav.Root)
└─ AppShell.Fab              floating main action in the dock's corner, rendered from anywhere in the shell
AppShell.Template            Root + Nav + Main + Footer in one component
useAppShellNav()             the navigation the Sidebar publishes, for triggers outside the rail
```
Every child of Root that is not `AppShell.Nav` is placed into the content panel; the panel ends in the dock, a sticky bottom zone that holds `AppShell.Footer` and, above it, the corner of `AppShell.Fab`. Everything at the top of the panel belongs to the page: its `Page.TopBar` sticks to the top of main.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### AppShell.Root
`ref` → `HTMLDivElement`. Grid of the nav column and the content panel (the page itself); every child but `AppShell.Nav` goes into the panel. Owns the navigation its Sidebar publishes (`useAppShellNav`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `fillViewport` | `boolean` | `true` | The app frame: fixed to the viewport, only `AppShell.Main` scrolls; the document stays still (no rubber band, no pull-to-refresh). A nested shell is a box. `false`: a document page, the document scrolls. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Nav, Main, Footer), `className` and the other div attributes. |

### AppShell.Nav
`ref` → `HTMLDivElement`. The navigation column slot (not a landmark: Sidebar renders the `<nav>`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (usually `Sidebar.Root`), `className` and the other div attributes. |

### AppShell.Main
`ref` → `HTMLElement`. The `<main>` where the page renders: a vertical `ScrollContainer` that hands `Page.Root` the gutters and top air (`--page-gutter`, `--page-top`) and keeps room under a floating `BottomNav`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes. |

### AppShell.Footer
`ref` → `HTMLDivElement`. Sticky bottom bar of the panel for `BottomNav`; no padding of its own. Shows only while the shell has no navigation column on screen (no `AppShell.Nav`, or the Sidebar is off-canvas); with the rail on screen the footer leaves.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (usually `BottomNav.Root`), `className` and the other div attributes. |

### AppShell.Fab
`ref` → `HTMLButtonElement`. The app's floating main action: a `Button shape="circle"` (`xl`, solid neutral) in the panel's bottom end corner, above the footer bar or the capsule, inside `--prime-safe-area-*`, under every overlay. Rendered from anywhere inside `AppShell.Root`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The glyph (`<Icon>`), placed in `Button.Icon`. |
| `aria-label` | `string` | — (required) | The action the button performs; it has no visible text. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">` | — | `onClick`, `aria-expanded`, `aria-keyshortcuts`, `className` and the other button attributes (a `Tooltip.Trigger` or `Drawer.Trigger` slot wraps it). |

### AppShell.Template
`ref` → the `<main>`. Root + Nav + Main + Footer in one; main scrolls to the top when `scrollResetKey` changes.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fillViewport` | `boolean` | `true` | As on `AppShell.Root`: the app frame, only `<main>` scrolls. |
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
| `true` | The app frame: the top-level shell is fixed to the viewport (`position: fixed; inset: 0`), only Main scrolls and holds its overscroll, the document under it stays still — no rubber band, no pull-to-refresh, no shift after the keyboard; nav, the page's top bar and the BottomNav stay put. A shell nested in a page or a preview stays a box of the height its host gives | Apps — every app on a phone, an installed PWA, a WebView | yes |
| `false` | Shell at least viewport high; the document scrolls; nav sticks to the top | A page that is a document (a content site, an article) | |

### Structure
| Value | Looks like | Use when | Default |
|---|---|---|---|
| with `AppShell.Nav` | Two columns: a rail one layer above the page + the panel that is the page | Apps with navigation | |
| without Nav | Panel takes the full width | Single-page tools, auth screens | |
| with `AppShell.Footer` | Sticky bar at the bottom of the panel, shown while no navigation column is on screen | BottomNav on a phone | |
| with `AppShell.Fab` | A solid neutral `xl` disk with the overlay lift in the bottom end corner of the panel | One app-wide main action (an assistant) | |

`AppShell.Template` with `nav={<Sidebar.Root …/>}` and a `Page.Root` inside is the standard app; `Page.Root maxWidth="readable"` for docs and articles.

## States
| State | Driven by | DOM |
|---|---|---|
| fixed frame | `fillViewport` | `data-fill-viewport="true"` on Root |
| viewport frame | `fillViewport` (on by default) on the outermost shell (not inside another shell or `ExampleFrame`) | `data-frame="viewport"` on Root, `data-prime-frame` on `<html>` while it is mounted |
| navigation column | an `AppShell.Nav` child | `data-nav="true"` on Root (two grid columns) |
| off-canvas navigation | the Sidebar publishes that it is an off-canvas panel (`offCanvas="auto"` on a phone, `"always"`) | `data-off-canvas="true"` on Root; `useAppShellNav()` reports `offCanvas`, `open`, `navId` |
| floating action entering | an `AppShell.Fab` mounted on a shell already shown | `enterMotion.enter` on its holder (a pop from `--prime-motion-scale-pop`); still when it mounts with the shell |
| footer bar | the navigation column: `AppShell.Nav` with a Sidebar that is not off-canvas | the footer is `display: none` while the rail is on screen; without Nav or with an off-canvas Sidebar it stays at any width |

## Layout & spacing
- Two full-height planes edge to edge: no inset, radius, shadow or border — the boundary is the fill change (the Sidebar rail is layer 1, the panel the page: white rail beside a gray page in light, a rail one step lighter than the near-black page in dark).
- Main hands the page its edge air: `--page-gutter` is the page gutter `--prime-layout-gutter` — `--prime-layout-gutter-s` (16) → `-m` (24) from 640px → `-l` (32) from 1024px; `--page-top` is `--prime-space-6` (24) → `--prime-space-8` (32) from 1024px. `Page.Root` pads itself with them (its top bar steps out to the panel's edges). Main itself keeps only the bottom air, as a spacer after the page (a scroller's end padding does not scroll in every engine): `--prime-space-16`, the scroll tail of a long page. Inside Main the page gutter is the small one again, so a frame nested in the page starts from its own gutter, not the shell's.
- A page that fills the panel height (`Page.Root fill`): Main's bottom air drops to the side gutter, so no long scroll tail stays under it — beside the Sidebar rail too.
- The viewport frame (the outermost shell with `fillViewport`, on by default) is fixed to the layout viewport, so it follows the browser's collapsing toolbars and the document has nothing to scroll; `<html data-prime-frame>` (globals.css) sets `overflow: hidden` and `overscroll-behavior: none` on `html` and `body`. Main there is the page's one scroller and holds its overscroll (ScrollContainer `overscrollBehavior="contain"`): it scrolls with momentum and bounces by itself, and nothing inside it chains to the document. Where iOS ignores those properties, a touch guard (`useViewportFrame`) cancels a vertical gesture that no scroller under the finger can take, and a document iOS panned for the keyboard goes back to its origin once no field is focused.
- Outside the viewport frame Main hands its scroll on at its end (`overscrollBehavior="auto"`): with `fillViewport={false}` it is not a scroller and the document scrolls under the pointer; a nested fill shell (an example, a preview) hands it on to the page around it.
- Nav column: fills the shell height, `z-index: --prime-z-sticky` (above the panel, so the compact Sidebar toggle can ride the rail edge); with `fillViewport={false}` it is sticky at the top and viewport high instead.
- Footer: no padding of its own (BottomNav keeps the bottom safe-area inset), inside the dock — the last zone of the panel, sticky at the bottom, `z-index: --prime-z-sticky`.
- Fab: in the dock's bottom end corner, `--prime-layout-gutter` from the panel's end edge plus `--prime-safe-area-right`. Its height above the dock follows what is on screen: no bar (no footer, or the Sidebar rail on screen) — the gutter plus `--prime-safe-area-bottom`; a flat BottomNav — a gutter above the bar; a floating BottomNav — `--prime-bottom-nav-floating-inset` above the capsule (its height grows to the touch row on a coarse pointer), lined up with its end edge. Several stack in a column `--prime-space-3` apart. Over the page and its sticky top bar (the dock comes after main on the same layer), under every overlay and its scrim (the panel is isolated; a modal layer makes it inert).
- A floating BottomNav (`floating`) in the footer: the footer takes no height, the capsule stands `--prime-bottom-nav-floating-inset` above the frame's bottom safe area — the same place on every page — and overlays the page. Main keeps exactly the capsule's room under its last line — the inset, the capsule height (the touch row on a coarse pointer, icons only lower), `--prime-safe-area-bottom` and a page gutter — so the last block scrolls up to a gutter above the glass.
- The panel is the page (layer 0 of the surface ladder, gray in light): fields on it take the page fill, a Card inside is layer 1 — white in light with the raised whisper — and cards in cards go deeper.
- Safe-area insets: the frame and every edge part of the kit (the page's top bar, BottomNav, the floating BottomNav room in Main, Drawer, the off-canvas Sidebar panel, a centred Modal, bottom sheets, Notification zones, MediaViewer) read the container's outer insets from `--prime-safe-area-*` (`top`, `right`, `bottom`, `left`), declared once on `:root` with `env(safe-area-inset-*)` as the value. An app whose host draws over the web view and reports the insets its own way sets those four variables on `:root` once, after the kit's styles; nothing else changes.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` · `Shift+Tab` | Reaches `AppShell.Fab` after the page and before the phone navigation, wherever it is rendered. |
| `Enter` · `Space` | Runs the floating action (`AppShell.Fab`). |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Main is the `<main>` landmark; the navigation landmarks come from Sidebar and BottomNav (`<nav>`). The page's top bar is a `<header>` inside main, not a banner.
- One `<h1>` per page: its `Page.Title`, in the top bar or in the flow.
- `AppShell.Fab` is a `<button>` named by its required `aria-label`; under a modal overlay it is inert with the rest of the page.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The app frame: Sidebar in the nav column, the page in main with its title and action in its top bar; only main scrolls — `AppShell.Nav`, `AppShell.Main`. |
| [footer.tsx](examples/footer.tsx) | A phone app without a Sidebar: the bar in the footer stays at the bottom while main scrolls under it — `AppShell.Footer`. |
| [fab.tsx](examples/fab.tsx) | The app's floating main action: in the corner beside the Sidebar rail on a wide screen, above the floating BottomNav on a phone, under the Drawer it opens — `AppShell.Fab`. |
| [template.tsx](examples/template.tsx) | Root, nav, main and footer in one component; main scrolls back to the top whenever the page changes — `AppShell.Template`, `scrollResetKey`. |
| [screen.tsx](examples/screen.tsx) | The app frame for desktop and phone: the Sidebar rail on a wide screen, the floating BottomNav in the footer on a phone whose More item opens the Sidebar, the page top bar with the menu button it draws by itself, the page title with a line of data, and a simple home page, and each section rendered at once in its place — `scrollResetKey`, `useAppShellNav`. |

## Mistakes
- Adding padding around the page content → `Page.Root` takes the gutters Main hands it.
- Wrapping Main content in another scroll container → Main scrolls (or the document, with `fillViewport={false}`).
- A border or shadow between nav and panel → the fill change is the boundary.
- Putting the Sidebar directly in Root without `AppShell.Nav` → it lands inside the content panel.
- BottomNav anywhere but `AppShell.Footer` → it stays next to the Sidebar rail on a desktop; the footer is what leaves while the rail is on screen.
- A floating action in its own `position: fixed` wrapper with a hand-made offset from the BottomNav tokens → `AppShell.Fab` clears the bar, the capsule and the safe area by itself; render it inside the shell (in `AppShell.Template`, among the children).
- `AppShell.Template` in a router app without `scrollResetKey` → a new page opens at the old scroll position; pass the pathname.
- A hand-wired menu state shared by the Sidebar, a menu button and a BottomNav «Ещё» → the Sidebar publishes it to the shell: the page's `Page.TopBar` draws the menu button, other triggers read `useAppShellNav()`.
- A Telegram Mini App in full screen (`requestFullscreen()`) left on `env(safe-area-inset-*)` → Telegram's header covers the page's top bar, because Telegram reports the insets as `--tg-safe-area-inset-*` (the device) and `--tg-content-safe-area-inset-*` (its own controls) on `<html>`. Map them onto the kit's insets once, in the app's stylesheet after the kit's:

  ```css
  :root {
    --prime-safe-area-top: max(
      env(safe-area-inset-top, 0px),
      calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px))
    );
    --prime-safe-area-bottom: max(
      env(safe-area-inset-bottom, 0px),
      calc(var(--tg-safe-area-inset-bottom, 0px) + var(--tg-content-safe-area-inset-bottom, 0px))
    );
    --prime-safe-area-left: max(env(safe-area-inset-left, 0px), var(--tg-safe-area-inset-left, 0px));
    --prime-safe-area-right: max(env(safe-area-inset-right, 0px), var(--tg-safe-area-inset-right, 0px));
  }
  ```

## Related
- **Built from:** [Button](../../components/button/COMPONENT.md), [ScrollContainer](../../components/scroll-container/COMPONENT.md)
- **See also:** [Page](../page/COMPONENT.md), [Sidebar](../sidebar/COMPONENT.md), [BottomNav](../bottom-nav/COMPONENT.md), [Breadcrumb](../../components/breadcrumb/COMPONENT.md)

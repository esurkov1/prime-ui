# AppHeader

**Category:** page
**Kind:** layout

> The page's bar at the top of the app's content panel: the page title with a line of data, the page's tools and its own buttons — only what the current page needs.

## When to use
- Every page of an app built on [AppShell](../app-shell/COMPONENT.md): the page titles itself here — `AppHeader.Title` (the page's `<h1>`) with an `AppHeader.Description` that carries data, the path up (`Breadcrumb`) on a nested record.
- The page's tools — its own search and filter, sections, the view, the primary action — as a [PageToolbar](../../components/page-toolbar/COMPONENT.md) in `AppHeader.Tools`.
- The phone header: the menu button that opens the off-canvas Sidebar, the title, the page's action as an icon.

## When not to use
- A document page (settings, a long form, an article) → its title is `PageContent.Header` in main ([PageContent](../../components/page-content/COMPONENT.md)); the header then has no title.
- App navigation → [Sidebar](../sidebar/COMPONENT.md) and, on a phone, [BottomNav](../bottom-nav/COMPONENT.md); the header holds at most the menu button.
- Anything that is not about the current page (a global search, app-wide buttons) → the header row is per page; the app's own places live in the Sidebar.

## Import
```tsx
import { AppHeader } from "prime-ui-kit";
```

## Anatomy
```
AppHeader.Root               <header>, the page's sticky row as high as the Sidebar brand row
├─ AppHeader.Start           leading zone, takes the free width
│  ├─ AppHeader.MenuButton   opens the off-canvas Sidebar (below 768px by default)
│  ├─ Breadcrumb             the path up, only on a nested record
│  ├─ AppHeader.Separator    short vertical line between the path and the title
│  └─ AppHeader.Title        the page title, truncates
│     ├─ AppHeader.Icon      decorative glyph on a tile shaped like a soft button m
│     └─ AppHeader.Description  a muted line of data under the name
├─ AppHeader.Actions         the page's own buttons at the end of the title row
└─ AppHeader.Tools           second row, full width: the page's tools (a PageToolbar.Root)
```
The name of `AppHeader.Title` (not the icon or the description) is the page's `<h1>`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### AppHeader.Root
`ref` → `HTMLElement`. The page's sticky `<header>` bar at the top of the content panel: only what the current page needs — its title, tools and own buttons. As high as the Sidebar brand row, lined up with the page. Icon buttons inside are `soft`, not `ghost`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<AppHeaderLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (`AppHeader.Start`, `AppHeader.Actions`, `AppHeader.Tools`), `className` and the other attributes. |

### AppHeader.Start
`ref` → `HTMLDivElement`. The leading zone that takes the free width: the menu button, the path up (a Breadcrumb) and the title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### AppHeader.Title
`ref` → `HTMLDivElement`. The page title: an optional `AppHeader.Icon`, the name (title-s, truncates) and an optional `AppHeader.Description` under it. The name is the page heading `<h1>`; the description stays outside its accessible name.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the name, `AppHeader.Icon`, `AppHeader.Description` in any order), `className` and the other div attributes. |

### AppHeader.Icon
`ref` → `HTMLSpanElement`. Decorative glyph before the title (`aria-hidden`) on a tile shaped like the bar's soft buttons: control m square (36), its radius and the subtle fill.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (an `Icon`), `className` and the other span attributes. |

### AppHeader.Description
`ref` → `HTMLSpanElement`. Muted line under the title that carries data («128 в работе · 6 ждут оплаты», a status and a date); truncates on a narrow header, never hides.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### AppHeader.Separator
`ref` → `HTMLDivElement`. A short vertical `Divider` (20) between groups in a zone — the path and the title — with 16 of air on each side.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<DividerProps, "orientation" \| "children" \| "align" \| "size">` | — | `className` and the other div attributes. |

### AppHeader.Tools
`ref` → `HTMLDivElement`. The page's tools in the header (a `PageToolbar.Root`): the header's second row, full width under the title row, as a direct child of `AppHeader.Root`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (a `PageToolbar.Root`), `className` and the other div attributes. |

### AppHeader.Actions
`ref` → `HTMLDivElement`. The trailing row of the page's own buttons in the title row (export, a more menu); the page's primary action goes into the PageToolbar in `AppHeader.Tools` when the page has tools. Never wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### AppHeader.MenuButton
`ref` → `HTMLButtonElement`. A soft neutral icon `Button` named by `labels.menu` that opens the off-canvas Sidebar; wire `onClick` and `aria-expanded`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `show` | `"narrow" \| "always"` | `"narrow"` | `narrow` — only below 768px, where a Sidebar with `offCanvas="auto"` leaves the layout; `always` — on every width (`offCanvas="always"`). |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `aria-expanded`, `aria-label` (replaces `labels.menu`), `className` and the other button attributes. |

## Variants

### show (MenuButton)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `narrow` | The menu button shows only below 768px | Sidebar with `offCanvas="auto"` | yes |
| `always` | The menu button on every width | Sidebar with `offCanvas="always"`, or you decide visibility yourself | |

### Structure
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `AppHeader.Title` | Icon, name and a line of data under it, like the Sidebar brand | A top-level page | |
| Breadcrumb in Start | The path, `AppHeader.Separator` and the record as the title | A nested record page | |
| with `AppHeader.Actions` | A row of the page's buttons at the end of the title row | Export, a more menu of the page | |
| with `AppHeader.Tools` | A second row under the title row with the page's PageToolbar | The page has search, filters, sections, a view or a primary action | |
| no `AppHeader.Title` | Only the menu button and the page's buttons | A document page: its title is `PageContent.Header` in main | |

## States
| State | Driven by | DOM |
|---|---|---|
| with page tools | an `AppHeader.Tools` child | Root renders it after the title row (DOM and Tab order follow the rows), full width, `--prime-space-3` under it |
| narrow header | header width below 36rem (container `prime-app-header`) | the icon tile hides; the title and its line of data truncate |
| menu button hidden | `show="narrow"` and viewport from 768px | `data-show="narrow"` on MenuButton |
| short viewport | viewport below 480px high (a phone on its side) | Root stops sticking |

## Layout & spacing
- Row min height = control m + `--prime-space-2` (44), padding-block `--prime-space-3` (the top grows to the safe-area inset): 68 in all, the height of the Sidebar header, so the brand and the title share one line.
- Inline padding: the shell gutters (16 → 24 → 32, the same as `AppShell.Main`) in the shell's panel, so the header lines up with the page; `--prime-space-4` elsewhere. Main's top air (24, 32 from 1024px) stands between the header and the page's first block.
- Icon buttons are `soft` neutral (MenuButton is), never `ghost`: every button on the bar has a shape.
- Gaps: `--prime-space-3` between zones, `--prime-space-2` inside Start and Actions; `AppHeader.Separator` adds `--prime-space-2` on each side (16 in all) and is 20 high.
- `AppHeader.Icon` is a 36 tile with the radius and fill of a soft neutral button m, so it lines up with the buttons on the bar.
- On the panel surface with no divider or shadow (depth from fill); `z-index: --prime-z-sticky`.
- Sticky at `top: 0` of its scroller (static on a viewport below 480px high). The shared sticky surface paints its fill one border width past the top edge, so no sub-pixel seam of the scrolling rows shows above it.
- Controls inside are size `m`.
- `AppHeader.Tools` is the header's second row: the full width under the title row, 12 apart, sticky with it. The PageToolbar inside lays itself out from that width — one row from 56rem, stacked rows below, the primary action on its own row when the search would get less than 18rem beside it — so on a phone the page tools wrap under the title, never squeeze it.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves through the menu button, the path links and the page's buttons in reading order, then the page tools in the second row. |
| `Enter` · `Space` | Presses the focused button: opens the menu or runs the action. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Root is a `<header>`: the banner landmark when it sits at the top level of the page.
- MenuButton is named by `labels.menu`; pass `aria-expanded` (whether the Sidebar is open).
- The name of `AppHeader.Title` is the page heading `<h1>`; the description sits next to it, outside its accessible name. One `<h1>` per page: in the header on app pages, `PageContent.Title` on a document page (whose header has no title).
- `AppHeader.Tools` follows the title row in the DOM, so Tab and screen readers meet the page tools after the header's own buttons.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `menu` | `"Открыть меню"` | Name of `AppHeader.MenuButton`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The page's header: the page title with its icon and a line of data under it, the page's own buttons at the end — `AppHeader.Title`, `AppHeader.Description`, `AppHeader.Actions`. |
| [breadcrumbs.tsx](examples/breadcrumbs.tsx) | A nested record: the path up, a separator and the record as the page title, the record's buttons at the end — `AppHeader.Separator`, `AppHeader.Actions`. |
| [page-title.tsx](examples/page-title.tsx) | The header carries the page: the title is the page heading with a line of data, the page tools (sections, the period, the primary action) are its second row and lay themselves out from its width — `AppHeader.Title`, `AppHeader.Tools`. |
| [in-app-shell.tsx](examples/in-app-shell.tsx) | The header in the app frame: one row with the Sidebar brand across the two planes, sticky over main — `AppShell`, `Sidebar.Brand`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone: the menu button opens the navigation, the title and its line of data truncate and the page's action keeps its icon — `AppHeader.MenuButton`, `show`. |

## Mistakes
- A border or shadow under the header → it sits on the panel surface; the fill is the boundary.
- `AppHeader.Title` while main also has `PageContent.Title` → two titles; an app page titles itself in the header, only a document page keeps `PageContent.Header` (and then the header has no title).
- No title at all on an app page → the page has no `<h1>`.
- A description that describes the page («Все заказы магазина») → a line of data («128 в работе · 6 ждут оплаты») or nothing.
- Page tools crammed into `AppHeader.Actions` → `AppHeader.Tools` with a PageToolbar: it wraps under the title instead of squeezing it.
- A global search, notifications or app-wide buttons in the header → the row is per page; the app's own places live in the Sidebar.
- A heading element of your own inside `AppHeader.Title` → the title's name is already the `<h1>`; a second heading nests inside it.
- A hand-made menu button with a media query → `AppHeader.MenuButton` follows the Sidebar breakpoint.
- `ghost` icon buttons in the header → `variant="soft" tone="neutral"`: a light fill gives each button a shape on the bar.

## Related
- **Built from:** [Button](../../components/button/COMPONENT.md), [Divider](../../components/divider/COMPONENT.md), Icon (`nav.menu`)
- **See also:** [AppShell](../app-shell/COMPONENT.md), [Sidebar](../sidebar/COMPONENT.md), [PageContent](../../components/page-content/COMPONENT.md), [PageToolbar](../../components/page-toolbar/COMPONENT.md) (inside `AppHeader.Tools`), [Breadcrumb](../../components/breadcrumb/COMPONENT.md)

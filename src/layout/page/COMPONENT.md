# Page

**Category:** page
**Kind:** layout

> The page inside the app frame: everything at the top belongs to it — a top bar with the title, actions and tools, the large document title in the flow — then sections, the tile grid and the list + detail layout.

## When to use
- Every route rendered inside `AppShell.Main`: the app is navigation and the page, and the page carries its own top (`Page.TopBar`), title (`Page.Title`, the `<h1>`) and body.
- A work screen (a list, a board, a chat, a schedule): `Page.Header` with the title, a line of data and actions in `Page.TopBar`, the page's tools (`Page.Toolbar`: search and filter, sections, view, the primary action, chips) as the bar's second row.
- A document page (settings, a long form, help) or an overview (a dashboard): `Page.Header` in the flow — the large title — and `Page.TopBar collapse`, which repeats the title once it scrolls away and keeps the path and actions in reach.
- A nested record: a `Breadcrumb` path before the title in the header.
- A text page held to a reading measure (`maxWidth="readable"`), a wide dashboard capped at the content width (`maxWidth="wide"`).
- The tiles of a dashboard — KPI cards, charts, panels — as one board (`Page.Grid` + `Page.Cell`).
- A new topic of the page with its own heading and a link or button beside it (`Page.Section`); a settings page with a heading column beside each panel (`layout="aside"`).
- A page whose body takes the rest of the panel's height — a log table, a board, a chat (`fill`).
- Mail, a messenger, a ticket queue: a list and the chosen record side by side, one at a time on a narrow panel (`Page.Split`).

## When not to use
- The app frame (navigation rail, scrolling main, phone footer) → use [AppShell](../app-shell/COMPONENT.md); there is no global app header — a bar belongs to its page.
- A search across the whole app → a page of its own or a [CommandMenu](../../components/command-menu/COMPONENT.md); the top bar carries only what its page needs.
- A bounded block inside the page → use [Card](../../components/card/COMPONENT.md).
- An empty / error / not-found page → use [EmptyPage](../../components/empty-page/COMPONENT.md).
- A heading inside a card → `Card.Title`; text headings inside prose → use [Typography](../../components/typography/COMPONENT.md).
- A grid inside one block (thumbnails, fields, bars in a panel) → the block's own CSS grid; `Page.Grid` places the page's tiles.
- Details that open over the list and close again (a record from a table) → use [Drawer](../../components/drawer/COMPONENT.md); `Split` is for a list people work through record by record.

## Import
```tsx
import { Page } from "prime-ui-kit";
```

## Anatomy
```
Page.Root                          the page column (<div>); maxWidth, fill, labels
├─ Page.TopBar                     <header> strip at the top edge, sticky; sticky, collapse
│  │                               (+ the menu button while the Sidebar is off-canvas)
│  ├─ Page.Header                  compact title row
│  │  ├─ Breadcrumb.Root           the path; the header draws the separator after it
│  │  ├─ Page.Title                <h1>, title-m, truncates
│  │  ├─ Page.Description          <p>, muted caption, truncates
│  │  └─ Page.Actions              one line; trailing secondary Buttons fold into «⋯»
│  └─ Page.Toolbar                 tools row, 12 under the title row
│     ├─ Page.ToolbarTools         search and filter (SmartFilter.Toolbar)
│     ├─ Page.ToolbarSections      sections (SegmentedControl)
│     ├─ Page.ToolbarView          period, view, columns
│     ├─ Page.ToolbarActions       the primary action
│     └─ Page.ToolbarChips         active filters (SmartFilter.Chips)
├─ Page.Header                     the large document header in the flow
│  ├─ Breadcrumb.Root              the path over the title
│  ├─ Page.Title                   <h1>, heading-m
│  ├─ Page.Description             <p>, secondary body-m
│  └─ Page.Actions                 wrap under the title on a narrow column
└─ Page.Body                       page content, blocks 24 apart
   ├─ Page.Grid                    12-column tile grid, 16 on both axes; a container (prime-grid)
   │  └─ Page.Cell                 one tile place: span, rows; its child fills it
   ├─ Page.Section                 <section> + <h2> label, 40 from its neighbours
   │  └─ Page.Actions              a link or button at the end of the section heading
   └─ Page.Split                   list + detail; a container (prime-split)
      ├─ Page.List                 list pane: 16–20rem column, or the whole split while closed
      └─ Page.Detail               detail pane: the rest, or the whole split while open
         └─ Page.BackButton        back to the list, only while one pane shows
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Page.Root
`ref` → `HTMLDivElement`. The page column inside `AppShell.Main`: top bar, header and body 24 apart; takes the shell's gutters and top air (`--page-gutter`, `--page-top`). Named, it is a `region`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxWidth` | `"full" \| "readable" \| "wide"` | `"full"` | Cap of everything but the top bar, centred: `full` — the whole main; `readable` — 42rem (`--prime-layout-reading-max-width`); `wide` — 75rem (`--prime-layout-content-max-width`). |
| `fill` | `boolean` | `false` | The page takes the height of main (`AppShell.Root fillViewport`) and the body takes what the bar and the header leave: for a full-height table, board, chat or `Page.Split`. |
| `labels` | `Partial<PageLabels>` | — | Built-in strings of every part, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (TopBar, Header, Body), `className` and the other div attributes. |

### Page.TopBar
`ref` → `HTMLElement` (`<header>`). The strip at the page's top edge across the panel: `Page.Header` and / or `Page.Toolbar` 12 under it. Starts with the menu button while the shell's Sidebar is off-canvas.

| Prop | Type | Default | Description |
|---|---|---|---|
| `sticky` | `boolean` | `true` | Sticks to the top of the page's scroller (`AppShell.Main`); `false` — scrolls away with the page. On a screen lower than 480px it scrolls anyway. |
| `collapse` | `boolean` | `false` | Once the flow `Page.Title` scrolls out under the bar, the bar repeats it (with its description) in its title row; it leaves when the title returns. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (Header, Toolbar — direct children), `className` and the other attributes. |

### Page.Header
`ref` → `HTMLDivElement`. An optional `Breadcrumb.Root` path, `Page.Title`, `Page.Description` and `Page.Actions` in one row (direct children). Compact in `Page.TopBar`, the large document header in the flow.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.Title
`ref` → `HTMLHeadingElement`. The page's `<h1>`, one per page: title-m in the top bar (truncates), heading-m in the flow (wraps). A flow title is what a `collapse` top bar repeats.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `children`, `id`, `className` and the other heading attributes. |

### Page.Description
`ref` → `HTMLParagraphElement`. One line of context that carries data (a period, a count): muted caption that truncates in the top bar, secondary body-m that wraps (up to the reading measure) in the flow.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `children`, `className` and the other paragraph attributes. |

### Page.Actions
`ref` → `HTMLDivElement`. The page's buttons at the end of a header or a section heading. In the flow they wrap; in the top bar trailing secondary `Button.Root`s fold into «⋯» by measured width, the primary stays.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Buttons), `className` and the other div attributes. |

### Page.Toolbar
`ref` → `HTMLDivElement`. The page's tools: one row from 56rem of its own width, stacked rows below. DOM and Tab order: Tools, Sections, View, Actions, Chips. Named, a `group`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.ToolbarTools
`ref` → `HTMLDivElement`. Search and filter button (`SmartFilter.Toolbar`): always the first slot and the stretchy one; it gives way first when the row runs short.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.ToolbarSections
`ref` → `HTMLDivElement`. Sections of the page — a `fullWidth` SegmentedControl with counts; scrolls inside when it does not fit.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.ToolbarView
`ref` → `HTMLDivElement`. How the data is shown: period, table / cards, columns. Sized by content when wide; its own full row when narrow, its controls sharing it equally.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.ToolbarActions
`ref` → `HTMLDivElement`. The primary action of the toolbar: at the end of the top row; on a phone, when the search would get less than 18rem beside it, its own full row right under the search.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.ToolbarChips
`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) in their own row under the top row; the row takes no space while it is empty.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.Body
`ref` → `HTMLDivElement`. The page content: blocks of one screen 24 apart, a `Page.Section` 40 from its neighbours.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.Section
`ref` → `HTMLElement`. A titled section of the page — a `<section>` named by its `h2` (title-m): the heading with an optional description and `Page.Actions` at its end, then the content 16 below. Stands 40 from its neighbours in Body.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | The visible heading (`h2`); it also names the section. |
| `description` | `ReactNode` | — | One line of context under the heading, in secondary body-s. |
| `layout` | `"stack" \| "aside"` | `"stack"` | `stack` — the heading over the content; `aside` — a ~16rem heading column beside it (a settings page), above it once the content would get narrower than 30rem. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "title">` | — | `children` (the content; `Page.Actions` goes to the heading row), `className` and the other section attributes. |

### Page.Grid
`ref` → `HTMLDivElement`. The grid of the page's tiles (KPI cards, charts, panels): 12 columns, 16 apart on both axes, so its rows read as one board. A size container: cells fold by its own width (see Grid columns).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Page.Cell`), `className` and the other div attributes. |

### Page.Cell
`ref` → `HTMLDivElement`. One tile place in `Page.Grid`; its child (a Card, a ChartFrame) stretches to it, so the tiles of a row share one height.

| Prop | Type | Default | Description |
|---|---|---|---|
| `span` | `1 \| 2 \| … \| 12` | `12` | Columns of 12 on a wide grid (64rem+). Narrower grids round it: see Grid columns in COMPONENT.md. |
| `rows` | `1 \| 2 \| 3 \| 4` | `1` | Rows the cell spans from 40rem: a chart beside two stacked tiles (`ChartFrame.Plot height="fill"` fills the height). |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (one tile), `className` and the other div attributes. |

### Page.Split
`ref` → `HTMLDivElement`. List + detail (mail, a messenger, a ticket queue): side by side from 48rem of its own width, one pane at a time below it, focus following the pane that comes into view.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | The detail is open (a record is chosen), controlled. On a narrow split it takes the place of the list; on a wide one both panes stay. |
| `defaultOpen` | `boolean` | `false` | Initial open state, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | `Page.BackButton` closes the detail (`false`); clear the chosen record there. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Page.List`, then `Page.Detail`), `className` and the other div attributes. |

### Page.List
`ref` → `HTMLDivElement`. The list pane: the 16–20rem column, or the whole split while the detail is closed; going back refocuses its last control. A column whose last child takes the free height (a Card with its own ScrollContainer). Focusable from code (`tabindex=-1`, no ring).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `aria-label`, `className` and the other div attributes. |

### Page.Detail
`ref` → `HTMLDivElement`. The detail pane: the rest of a wide split, or the whole split while open; focus lands here when it opens. A column whose last child takes the free height. Focusable from code (`tabindex=-1`, no ring).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `aria-label`, `className` and the other div attributes. |

### Page.BackButton
`ref` → `HTMLButtonElement`. Back from the detail to the list: a soft neutral icon Button (`nav.chevronLeft`) named by `labels.back`, shown only while the split shows one pane. Put it first in the detail's header; `event.preventDefault()` in `onClick` keeps the detail open.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children">` | — | `onClick`, `aria-label` (replaces `labels.back`), `className` and the other button attributes. |

## Variants

### maxWidth (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `full` | The page fills main | App pages, tables, boards, dashboards | yes |
| `readable` | Everything but the top bar capped at `--prime-layout-reading-max-width` (42rem), centred | Terms, articles, help pages | |
| `wide` | Everything but the top bar capped at `--prime-layout-content-max-width` (75rem), centred | Settings, wide screens where content should not stretch edge to edge | |

### Place of Page.Header
| Value | Looks like | Use when | Default |
|---|---|---|---|
| in `Page.TopBar` | one line as high as the Sidebar brand row: path · separator · title-m over a caption line, actions folding into «⋯» | work screens: lists, boards, chats, records | |
| in the flow | the large document header: path over a heading-m title, body-m description, actions wrapping under it | document pages and overviews | |

The size follows the place; the consumer passes nothing. One `Page.Title` (`<h1>`) per page, in one of the two places.

### Flags
| Flag | Looks like when on | Use when | Default |
|---|---|---|---|
| `fill` (Root) | the page is as high as main; the body takes what the bar and the header leave; main keeps gutter-high air under it | a full-height table, board, chat or `Page.Split` in an `AppShell.Root fillViewport` | `false` |
| `sticky` (TopBar) | the bar stays at the top of main while the page scrolls under it | every page; `false` for a bar that should scroll away | `true` |
| `collapse` (TopBar) | the flow title rises into the bar's title row once it scrolls away | a document page or an overview with the title in the flow | `false` |

### layout (Section)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `stack` | the heading row over the content, 16 apart | a topic of a dashboard, a list or a detail page | ✓ |
| `aside` | a ~16rem heading column beside the content, above it once the content would get < 30rem | a settings page: a heading column beside each panel | |

### Toolbar layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| wide (from 56rem of the toolbar's width) | one row: Tools (stretch) · Sections · View · Actions; Chips under it | desktops | — |
| narrow (below 56rem) | Tools + Actions, then Chips, Sections, View, each a full row 12 apart | tablets, a narrow panel | — |
| phone (Tools would get < 18rem beside Actions) | Tools, then Actions as a full row, then the rest | phones | — |

### Grid columns
| Grid width | Cell `span` 1–3 | `span` 4 | `span` 5–6 | `span` 7–12 | `rows` |
|---|---|---|---|---|---|
| < 30rem | the row | the row | the row | the row | — |
| 30–40rem | half | the row | the row | the row | — |
| 40–64rem | half | a third | half | the row | spans |
| ≥ 64rem | its span | its span | its span | its span | spans |

### Split layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| wide (from 48rem of the split's width) | list in a 16–20rem column, detail beside it, 24 apart; no back button | desktops, tablets in landscape | — |
| narrow (below 48rem) | one pane: the list, or the open detail with `Page.BackButton` | phones, a narrow panel next to an open Sidebar | — |

## States
| State | Driven by | DOM |
|---|---|---|
| capped page | `maxWidth` | `data-max-width="readable" \| "wide"` on Root (absent for `full`) |
| filling | `fill` | `data-fill="true"` on Root; `AppShell.Main` drops its long bottom air for it |
| sticky bar | `sticky` | `data-sticky="true"` on TopBar |
| title repeated in the bar | `collapse` and the flow title out of view | `data-collapsed="true"` on TopBar; the echo rises in (`transform` on the fast movement clock, `opacity` on the fast fade; reduced motion keeps the fade) |
| menu button | the shell's Sidebar is off-canvas (`useAppShellNav`) | a soft icon Button at the start of the bar, `aria-expanded` |
| folded actions | the bar's title row runs out of width (ResizeObserver) | folded Buttons `hidden`; a «⋯» Dropdown in their place |
| header place | inside TopBar or in the flow | `data-place="bar" \| "flow"` on Header |
| with actions | `Page.Actions` child | `data-has-actions="true"` on Header / the section heading row |
| section heading column | `layout="aside"` on Section | `data-layout="aside"` on Section (absent for `stack`) |
| tile span | `span` / `rows` on Cell | `data-span="1"…"12"` (always), `data-rows="2"…"4"` (absent for 1) |
| detail open | `open` / `defaultOpen` on Split | `data-open="true"` on Split; narrow: the list is `display: none`, else the detail is |
| pane swap | `open` changes on a narrow split | the pane that comes into view enters once (`enterMotion.enterBase`); focus moves into the detail, or back to the list control |

## Layout & spacing
- The edge air comes from the host: `AppShell.Main` sets `--page-gutter` (the page gutter, 16 → 24 → 32) and `--page-top` (24 → 32 from 1024px); `Page.Root` pads itself with them. Outside a host the page brings no air. The page resets both for what it holds, so a page nested in it starts clean.
- `Page.TopBar` steps out of the gutter to the panel's edges and keeps the gutter inside; padding 12 above (or the top safe-area inset) and below; the page's top air goes under it. Title row → toolbar row 12. The title row is as high as the Sidebar brand row (control m + 8), so the two read as one line.
- Header → Body 24; blocks inside Body 24; a `Page.Section` 40 from its neighbours (the body's 24 + 16); tile → tile in a Grid 16 on both axes; section heading → content 16, heading → description 4; flow Title → Description 8; buttons in Actions 8; heading → Actions 24 side by side, 16 once they wrap below.
- In the bar the title and its description truncate; actions keep one line and fold their trailing secondary Buttons into «⋯» once the title would get less than 9rem (measured, not by breakpoints).
- Every part takes only its own width and only when it is there. In the bar the actions stand at the end and the heading takes the room between; without a title the path and the actions keep their places. When the row runs short the title truncates first (down to 6rem), then the path collapses, then secondary actions fold into «⋯». In a wide toolbar only the search stretches: Sections and View keep their content width, the Actions stand at the end, and a missing slot leaves free room rather than making another grow.
- The toolbar lays itself out from its own width (container `prime-page-tools`), the grid from its own (`prime-grid`), the split from its own (`prime-split`) — never from the window.
- `fill` needs a main with a height: `AppShell.Root fillViewport`. The body passes its free height on to a filling child — DataTable `scrollHeight="fill"`, Crossfade `fill`, `Page.Split`.
- Each pane of a split is a column whose last child takes the free height — put a Card with its own `ScrollContainer` there. The detail pane on a wide split shows a short hint while nothing is chosen; a newly chosen record cross-fades in.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Space` | On the top bar's menu button: opens or closes the off-canvas Sidebar. On «⋯»: opens the menu of folded actions (arrows move, Escape closes). On `Page.BackButton`: back from the detail to the list; focus returns to the list control that opened it. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `AppShell.Main` is the `<main>` landmark; the page inside it is a plain column (a `region` only when named). `Page.TopBar` is a `<header>` inside main — no banner landmark.
- `Page.Title` is the page's `<h1>`, one per page, in the bar or in the flow. The title a `collapse` bar repeats is `aria-hidden` and `inert`: the heading is read once.
- The menu button carries `aria-expanded` and `aria-controls` → the Sidebar's `<nav>`. Folded actions are `display: none` in the bar and `menuitem`s in the «⋯» menu, named by the Button's `aria-label` or its text; their `onClick` runs from the menu.
- `Page.Toolbar` renders the slots in the wide layout's reading order — Tools, Sections, View, Actions, Chips — whatever the JSX order; the narrow layout moves them only visually (`order`). Named, it is a `group`.
- `Page.Section` is a `<section>` named by its own `<h2>` (`label`) through `aria-labelledby`; the heading levels go h1 (page) → h2 (section) → h3 (a card title inside it).
- Name both panes of `Page.Split` with `aria-label`: a named pane is `role="region"`. On a narrow split opening the detail moves focus into it and going back returns focus to the list control; the hidden pane is `display: none`. `Page.BackButton` is named by `labels.back` and shown only while the split shows one pane.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `menu` | `"Открыть меню"` | Name of the menu button `Page.TopBar` draws while the shell's Sidebar is off-canvas. |
| `more` | `"Ещё действия"` | Name of the «⋯» button the top bar's `Page.Actions` fold into. |
| `back` | `"Назад к списку"` | Name of `Page.BackButton`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A work page in an app window: the top bar with the title, its line of data and the page's actions, the body under it — `Page.TopBar`, `Page.Header`, `Page.Actions`. |
| [variants.tsx](examples/variants.tsx) | The same page at three caps: the whole main, a wide dashboard column, a reading column — `maxWidth`. |
| [structure.tsx](examples/structure.tsx) | A document page in the flow: the path over the large title, its line of data and the page's actions, then the body with a section — `Page.Header`, `Page.Description`, `Page.Section`. |
| [top-bar.tsx](examples/top-bar.tsx) | A nested record in the top bar: the path, the record as the page title with its line of data, its actions at the end, the page's tools as the second row — `Page.TopBar`, `Page.Toolbar`. |
| [collapse.tsx](examples/collapse.tsx) | An overview whose large title scrolls away under the top bar: the bar repeats it with its line of data and keeps the page's actions in reach — `collapse`. |
| [tools.tsx](examples/tools.tsx) | The panel of an orders page: search and filter, sections with counts, the period and the primary action in one row; active filters under the top row — `Page.ToolbarTools`, `Page.ToolbarSections`, `Page.ToolbarView`, `Page.ToolbarActions`, `Page.ToolbarChips`. |
| [tools-without-search.tsx](examples/tools-without-search.tsx) | A dashboard panel without search on a tablet-width column: the sections fill the top row, the period selector alone in the bottom row stretches to the full width — `Page.ToolbarSections`, `Page.ToolbarView`. |
| [sections.tsx](examples/sections.tsx) | A page with titled sections: tiles of one screen close together, a new topic set off by air, a link at the end of the heading, a heading column beside a panel — `Page.Section`, `label`, `description`, `Page.Actions`, `layout`. |
| [grid.tsx](examples/grid.tsx) | A dashboard board: four KPI tiles, a chart two rows high beside two panels, one gap on both axes — `Page.Grid`, `Page.Cell`, `span`, `rows`. |
| [list-detail.tsx](examples/list-detail.tsx) | A ticket queue as list + detail on a full-height page: side by side on a wide panel, one pane at a time with a back button on a narrow one; the chosen ticket cross-fades in — `Page.Split`, `Page.List`, `Page.Detail`, `Page.BackButton`, `fill`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone the top bar leads with the menu button that opens the navigation by itself, the title and its line of data truncate and the secondary actions fold into «⋯» — `offCanvas`, `Page.Actions`. |
| [screen.tsx](examples/screen.tsx) | A settings page as a document: the path in the top bar that repeats the title once it scrolls away, the large title in the flow, sections with a heading column and a panel, a form saved by its own button, switches that apply at once and a danger zone with a confirm — `collapse`, `layout`, `maxWidth`. |

## Mistakes
- A global header above every page → the app is navigation and the page; each page renders its own `Page.TopBar` with only what it needs.
- Padding on `Page.Root` or around it to imitate gutters → the page takes them from `AppShell.Main`.
- Two titles — one in the bar, one in the flow → one `Page.Title`; a flow title with `collapse` is repeated in the bar by itself.
- A hand-made menu button for the phone Sidebar → the bar draws it while the Sidebar is off-canvas.
- Hiding actions with media queries on a phone → `Page.Actions` in the bar folds them by measured width.
- Wrapping `Page.Header` or `Page.Toolbar` in your own component inside the bar, or a `Breadcrumb` inside the header → they are found among the direct children.
- A hand-made `<section>` + `Typography as="h2"` + own gap CSS → `Page.Section label`.
- Each row of cards in its own grid → put every tile of the screen in one `Page.Grid`.
- Computing a height from `100vh` minus the bar for a full-height table or chat → `Page.Root fill` and a filling child.
- A list + detail built with window media queries → `Page.Split` follows its own width.

## Related
- **Built from:** [AppShell](../app-shell/COMPONENT.md) (the navigation the menu button opens), [Breadcrumb](../../components/breadcrumb/COMPONENT.md) (the path it places), [Button](../../components/button/COMPONENT.md) (the menu button, «⋯», `Page.BackButton`), [Dropdown](../../components/dropdown/COMPONENT.md) (folded actions), [Divider](../../components/divider/COMPONENT.md) (path separator), Icon (`nav.menu`, `action.more`, `nav.chevronLeft`)
- **See also:** [Sidebar](../sidebar/COMPONENT.md), [BottomNav](../bottom-nav/COMPONENT.md), [SmartFilter](../../components/smart-filter/COMPONENT.md), [SegmentedControl](../../components/segmented-control/COMPONENT.md), [Card](../../components/card/COMPONENT.md), [ChartFrame](../../components/chart-frame/COMPONENT.md), [List](../../components/list/COMPONENT.md), [EmptyPage](../../components/empty-page/COMPONENT.md), [Drawer](../../components/drawer/COMPONENT.md)

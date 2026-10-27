# Page

**Category:** page
**Kind:** layout

> The page inside the app frame: everything at the top belongs to it — a top bar with the title, tools and buttons, the large document title in the flow — then sections, the tile grid and the list + detail layout.

## When to use
- Every route rendered inside `AppShell.Main`: the app is navigation and the page, and the page carries its own top (`Page.TopBar`), title (`Page.Title`, the `<h1>`) and body.
- A work screen (a list, a board, a chat, a schedule): `Page.TopBar` with the title (`Page.Heading`), the page's tools (`Page.Tools`: sections, search and filter, view), all its buttons (`Page.Actions`) and the active filters (`Page.Chips`).
- A filter stands next to what it filters. `Page.Tools` holds what acts on the whole page: sections, the view, a period that drives several blocks (the KPI cards and the table), a search and filter that narrows several views of one set (a board and its list), and the tools of a section page — a page that is mainly one table (clients, deals, a fleet): its search and filter (`SmartFilter.Toolbar`), «Вид» (`DataTableColumnsMenu`) in `Page.Tools`, the chips in `Page.Chips`, so they stand in one place on every section page and in every view. A table that is one block among others (on a dashboard, a section of a record page) keeps its search, filter, chips and «Вид» in its own tools row (DataTable `toolbar` + `toolbarChips`); the selection menu always stays with the table.
- A section with sub-pages (the «Мессенджеры» item of the Sidebar with «Каналы», «Шаблоны» and «Статистика»): each sub-page is a route of its own, `Page.Title` stays the section's name, and the switch is a `SegmentedControl` of links (`SegmentedControl.Item asChild`) in `Page.Tools`: in the heading row at the end edge, before the sub-page's own `Page.Actions` (tools, then buttons, the primary last), and on a line of its own under the title once the bar is narrow (see Top bar plan); the body is the current sub-page. The Sidebar keeps the section's item current on every sub-route — a router `NavLink` to the section's path without `end`, or `current={pathname.startsWith("/messengers")}`.
- A document page (settings, a long form, help) read top to bottom with no page tools: `Page.Header` in the flow — the large title and its buttons — and `Page.TopBar collapse` with the path in its `Page.Heading`, which repeats the title once it scrolls away. A dashboard or an analytics page titles itself in `Page.TopBar` like a list.
- A nested record: a `Breadcrumb` path in `Page.Heading`; in the bar the title reads as its last level.
- A text page held to a reading measure (`maxWidth="readable"`), a wide dashboard capped at the content width (`maxWidth="wide"`).
- The tiles of a dashboard — KPI cards, charts, panels — as one board (`Page.Grid` + `Page.Cell`).
- A new topic of the page with its own heading and a link or button beside it (`Page.Section`, the heading over its content).
- A page whose body takes the rest of the panel's height — a log table, a board, a chat (`fill`).
- Mail, a messenger, a ticket queue: a list and the chosen record side by side, one at a time on a narrow panel (`Page.Split`).
- A form that is the whole page (a record's editor, settings with one save): `Page.Guard dirty busy` holds leaving it through the navigation, the path and the browser.

## When not to use
- The app frame (navigation rail, scrolling main, phone footer) → use [AppShell](../app-shell/COMPONENT.md); there is no global app header — a bar belongs to its page.
- A search across the whole app → a page of its own or a [CommandMenu](../../components/command-menu/COMPONENT.md); the top bar carries only what its page needs.
- A bounded block inside the page, a titled panel of a settings page included → use [Card](../../components/card/COMPONENT.md) with its own `Card.Header`.
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
├─ Page.Guard                      no DOM: holds leaving the page; busy, dirty (anywhere inside)
├─ Page.TopBar                     <header> strip at the top edge, sticky; sticky, collapse
│  │                               (+ the menu button while the Sidebar is off-canvas)
│  │                               groups in any JSX order, rendered in this order:
│  ├─ Page.Heading                 the title group: path › title on one line, description under it
│  │  ├─ Breadcrumb.Root           the path; the heading draws one chevron after it
│  │  ├─ Page.Title                <h1>, title-m, the path's last level, truncates
│  │  └─ Page.Description          <p>, muted caption under the whole line, truncates
│  ├─ Page.Tools                   what acts on the whole page, in the order written: the one tool row (as the DataTable toolbar)
│  │  ├─ SegmentedControl.Root     sections (route links of sub-pages), view (fullWidth unless set)
│  │  ├─ SmartFilter.Toolbar       a search and filter over several views: grows first on a line of its own
│  │  ├─ Datepicker.Root           a period (fullWidth unless set)
│  │  └─ Select.Root …             a period, columns; the trigger fills its place
│  ├─ Page.Actions                 every button of the page; icons, then «⋯» when short
│  └─ Page.Chips                   SmartFilter.Chips on a line under everything
├─ Page.Header                     the document header in the flow
│  ├─ Page.Heading
│  │  ├─ Breadcrumb.Root           the path over the title
│  │  ├─ Page.Title                <h1>, heading-m
│  │  ├─ Page.Badges               a record's badges on the title's line
│  │  └─ Page.Description          <p>, secondary body-m
│  └─ Page.Actions                 wrap under the heading on a narrow column
└─ Page.Body                       page content, blocks 24 apart
   ├─ Page.Grid                    12-column tile grid, 16 on both axes; a container (prime-grid)
   │  └─ Page.Cell                 one tile place: span, rows; its child fills it
   ├─ Page.Section                 <section> + <h2> label (+ a record's number), 40 from its neighbours
   │  ├─ Page.Badges               the record's badges on the heading's line
   │  └─ Page.Actions              a link or button at the end of the section heading
   └─ Page.Split                   list + detail; a container (prime-split)
      ├─ Page.List                 list pane: 16–20rem column, or the whole split while closed
      └─ Page.Detail               detail pane: the rest, or the whole split while open
         └─ Page.BackButton        back to the list, only while one pane shows
```

`SmartFilter.Root` holds no DOM: wrap it around `Page.Root` (or whatever holds both its Toolbar in `Page.Tools` and its Chips in `Page.Chips`).

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Page.Root
`ref` → `HTMLDivElement`. The page column inside `AppShell.Main`: top bar, header and body 24 apart; takes the shell's gutters and top air (`--page-gutter`, `--page-top`). Named, it is a `region`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxWidth` | `"full" \| "readable" \| "wide"` | `"full"` | Cap of everything but the top bar, centred: `full` — the whole main; `readable` — 42rem (`--prime-layout-reading-max-width`); `wide` — 75rem (`--prime-layout-content-max-width`). |
| `fill` | `boolean` | `false` | The page takes the height of main (`AppShell.Root`) and the body takes what the bar and the header leave: for a full-height table, board, chat or `Page.Split`. |
| `labels` | `Partial<PageLabels>` | — | Built-in strings of every part, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Page.TopBar`, `Page.Header`, `Page.Body`), `className` and the other div attributes. |

### Page.TopBar
`ref` → `HTMLElement` (`<header>`). The strip at the page's top edge: `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` in this DOM order, laid out by one steady plan — one line, tools below, icon-only buttons, «⋯», then a stacked or truncated heading.

| Prop | Type | Default | Description |
|---|---|---|---|
| `sticky` | `boolean` | `true` | Sticks to the top of the page's scroller (`AppShell.Main`); `false` — scrolls away with the page. On a screen lower than 480px it scrolls anyway. |
| `collapse` | `boolean` | `false` | Once the flow `Page.Title` scrolls out under the bar, the bar repeats it as the last level of its heading (of its `Breadcrumb` path, which folds for it), unless the path ends at it; it leaves when the title returns. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (`Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — direct children), `className` and the other attributes. |

### Page.Header
`ref` → `HTMLDivElement`. The document header in the page flow (settings, long forms): a `Page.Heading` and its `Page.Actions` in one row; the actions wrap under it on a narrow column.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Page.Heading`, `Page.Actions`), `className` and the other div attributes. |

### Page.Heading
`ref` → `HTMLDivElement`. The title group: a `Breadcrumb.Root` path, `Page.Title`, `Page.Description`. In the bar the title is the path's last level (path › title on one line, both truncate); in the flow the path stands over a large title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Breadcrumb.Root`, `Page.Title`, `Page.Badges`, `Page.Description`), `className` and the other div attributes. |

### Page.Title
`ref` → `HTMLHeadingElement`. The page's `<h1>`, one per page: the path's last level in the bar (title-m, truncates), a large title in the flow (heading-m, wraps). A flow title is what a `collapse` bar repeats.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `children`, `id`, `className` and the other heading attributes. |

### Page.Description
`ref` → `HTMLParagraphElement`. Context that carries data (a period, a count): in the bar a muted caption under the heading line, claiming no width of the plan — one line, two between words on a compact page; body-m that wraps in the flow.

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | `false` | Its data is loading: a Skeleton keeps the line's place, so the title never moves; the data then fades in. Sets `aria-busy`. |
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `children`, `className` and the other paragraph attributes. |

### Page.Badges
`ref` → `HTMLDivElement`. The badges of what a heading names, on its line after the title — in `Page.Heading` beside `Page.Title`, in a `Page.Section` beside its `label`: one `Badge.Group`, chip tier `m`, one row, the rest folds into «+N».

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Badge.Root`s), `aria-label` (a named row is `role="group"`), `className` and the other div attributes. |

### Page.Tools
`ref` → `HTMLDivElement`. What acts on the whole page: sub-page links, view, a shared period, a filter over views, a section page's table tools (a table block: its `toolbar`). In the heading row before the buttons while they fit, else on a line of their own. Named, a `group`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (kit controls), `className` and the other div attributes. |

### Page.Actions
`ref` → `HTMLDivElement`. All the page's buttons. In the flow they wrap; in the bar a `Button.Root` with a `Button.Icon` gives way to its icon (secondary first, then the primary), then the secondary ones fold into «⋯».

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Buttons), `className` and the other div attributes. |

### Page.Chips
`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) on a line of their own under everything in the bar; it takes no space while empty.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.Body
`ref` → `HTMLDivElement`. The page content: blocks of one screen 24 apart, a `Page.Section` 40 from its neighbours; on a compact page (under 30rem, a phone) 16 and 32, as wide as the gutter.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Page.Section
`ref` → `HTMLElement`. A titled section of the page — a `<section>` named by its `h2` (title-m): the heading with an optional description and `Page.Actions` at its end, then the content 16 below. Stands 40 from its neighbours in Body.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | The visible heading (`h2`); it also names the section. |
| `number` | `ReactNode` | — | The number of the record the section is about («#852»): muted, tabular, after the `label`. The heading becomes one line: the `label` is cut, the number never is. |
| `description` | `ReactNode` | — | One line of context under the heading, in secondary body-s. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "title">` | — | `children` (the content; `Page.Actions` goes to the heading row, `Page.Badges` to the heading's line), `className` and the other section attributes. |

### Page.Grid
`ref` → `HTMLDivElement`. The grid of the page's tiles (KPI cards, charts, panels): 12 columns, 16 apart on both axes, so its rows read as one board. A size container: cells fold by its own width, a wide cell next to a narrow one pairs up (see Grid columns).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Page.Cell`), `className` and the other div attributes. |

### Page.Cell
`ref` → `HTMLDivElement`. One tile place in `Page.Grid`; its child (a Card, a ChartFrame) stretches to it, so the tiles of a row share one height; a `Crossfade` child gets `fill` unless it sets it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `span` | `1 \| 2 \| … \| 12` | `12` | Columns of 12 on a wide grid (64rem+). Narrower grids round it: see Grid columns in COMPONENT.md. |
| `rows` | `1 \| 2 \| 3 \| 4` | `1` | Rows the cell spans from 40rem: a chart beside two stacked tiles (`ChartFrame.Plot height="fill"` fills the height). |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (one tile), `className` and the other div attributes. |

### Page.Guard
No DOM, no ref. Holds the page from anywhere inside it: a press on a `Sidebar.Item`, `BottomNav.Item` or `Breadcrumb.Item` link (a router link too) stops before it navigates, and the browser asks before the tab closes. Renders only its `ConfirmDialog`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `busy` | `boolean` | `false` | A request runs (a save): a press on those items does nothing until it ends; the browser asks before the tab closes. |
| `dirty` | `boolean` | `false` | Changes are not saved: a press on those items asks «leave without saving?»; its confirm (`labels.leaveConfirm`) repeats the press, its cancel keeps the page. The browser asks before the tab closes. |

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

### Place of Page.Heading
| Value | Looks like | Use when | Default |
|---|---|---|---|
| in `Page.TopBar` | one line as high as the Sidebar brand row: path › title-m, the caption description under the whole line; both truncate | screens of data: lists, boards, chats, records, dashboards and analytics | |
| in `Page.Header` in the flow | the large document header: path over a heading-m title, body-m description, the header's `Page.Actions` beside it, wrapping under it | document pages with no page tools: settings, long forms, help | |

The size follows the place; the consumer passes nothing, and there are no title size props. One `Page.Title` (`<h1>`) per page, in one of the two places. A bar with no visible title still holds the `<h1>`: a `Page.Title` wrapped in `VisuallyHidden`, or a flow `Page.Title` (with `collapse` the bar repeats it).

### Flags
| Flag | Looks like when on | Use when | Default |
|---|---|---|---|
| `fill` (Root) | the page is as high as main; the body takes what the bar and the header leave; main keeps gutter-high air under it | a full-height table, board, chat or `Page.Split` in an `AppShell.Root` | `false` |
| `sticky` (TopBar) | the bar stays at the top of main while the page scrolls under it | every page; `false` for a bar that should scroll away | `true` |
| `collapse` (TopBar) | the flow title rises into the bar's title row once it scrolls away | a document page with the path in the bar and the title in the flow | `false` |
| `dirty` (Guard) | nothing until a person leaves: a press on the navigation or the path asks «leave without saving?» | a form that is the page has unsaved changes | `false` |
| `busy` (Guard) | nothing until a person leaves: a press on the navigation or the path does nothing | the page's save request runs | `false` |

### Top bar plan
One plan, chosen from the natural widths of the groups (`data-plan` on the bar's row). The heading counts its title line only (path, title, badges): `Page.Description` truncates in the room that line leaves, so its live data never moves the plan. Each button counts the width it settles at — a label that changes in place is read where its glide lands. The bar takes the first step whose first line fits; once laid out it holds its step within a margin of 48 (`--prime-space-6` × 2): short by less, the heading truncates by that much (at most half its width) instead; a looser step comes back only once it fits with the margin to spare. A label that changes by a word, or a resize across a step, never flips the row back and forth:

| Step | Looks like | Use when | Default |
|---|---|---|---|
| `one` | `[Heading 1fr][Tools][Actions]` on one line | everything fits | yes |
| `below` | the tools on a line of their own under the heading and the actions — the one tool row, as the DataTable `toolbar`: a search (`SmartFilter.Toolbar`, `Input.Root`) takes the free room, switchers, pickers and buttons keep their width at the end; under 36rem the search takes a line of its own and a `SegmentedControl.Root` / `Datepicker.Root` / Select fills the line it stands on | heading + tools + actions do not fit | |
| `icons-secondary` | as `below`; secondary Buttons with a `Button.Icon` show only the icon, the label is their name and their tooltip | heading + actions still do not fit | |
| `icons` | the primary Button gives way to its icon too | still too wide | |
| `fold` | the secondary Buttons fold into «⋯» (`labels.more`); the primary stays | still too wide, and «⋯» is narrower than their icons (a single secondary keeps its icon); past it a Breadcrumb path folds into «…»; if the path and the title still do not share the line, the heading stacks: the path on its own line over the title, the title and the description wrapping (`data-heading="stack"`); a heading without a path truncates | |

A section's sub-pages follow the same plan as any tools: in the heading row before the buttons, so a sub-page with its own buttons («Подключить канал» on one, none on another) moves the switch along the row by their width. The actions stay on the first line beside the heading at every step; `Page.Chips` is always a line under everything; nothing overflows. The primary is the first solid `Button.Root`; a Button without an icon keeps its label at every step; anything that is not a `Button.Root` stays as it is.

### Grid columns
| Grid width | Cell `span` 1–3 | `span` 4 | `span` 5–6 | `span` 7–12 | `rows` |
|---|---|---|---|---|---|
| < 30rem | the row | the row | the row | the row | — |
| 30–40rem | half | the row | the row | the row | — |
| 40–51rem | half | a third | half (a third in a pair) | the row (2/3 in a pair) | spans |
| 51–64rem | a quarter | a third | half (a third in a pair) | the row (2/3 in a pair) | spans |
| ≥ 64rem | its span | its span | its span | its span | spans |

A wide cell (`span` 7–11) written next to a narrow one (`span` 4–5) is a pair: on a 40–64rem grid it takes 2/3 and its neighbour 1/3, so an 8 + 4 row keeps no hole. The pair is read from the cells' own `data-span` among their DOM siblings (a wide cell with a narrow one right before or after it), so a cell rendered inside a consumer component pairs too as long as it is a direct child of the grid; a `span` 12 never pairs. 51rem is four tiles of `--prime-layout-tile-min-width` (12rem) and three gaps. The flow is `dense`: a small cell fills a hole left by a wide one.

### Split layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| wide (from 48rem of the split's width) | list in a 16–20rem column, detail beside it, 24 apart; no back button | desktops, tablets in landscape | — |
| narrow (below 48rem) | one pane: the list, or the open detail with `Page.BackButton` | phones, a narrow panel next to an open Sidebar | — |

## States
| State | Driven by | DOM |
|---|---|---|
| capped page | `maxWidth` | `data-max-width="readable" \| "wide"` on Root (absent for `full`) |
| line of data loading | `loading` on Description | a Skeleton in the line (its height kept, so the title never moves), `aria-busy`; the data fades in under the same element |
| filling | `fill` | `data-fill="true"` on Root; `AppShell.Main` drops its long bottom air for it |
| sticky bar | `sticky` | `data-sticky="true"` on TopBar |
| title repeated in the bar | `collapse` and the flow title out of view | `data-collapsed="true"` on TopBar; the echo rises in (`transform` on the fast movement clock, `opacity` on the fast fade; reduced motion keeps the fade). After a `Breadcrumb` path the echo is the path's last level (an `aria-hidden`, `inert` `Breadcrumb.Item`), so the path folds its levels into «…» for it (`data-collapsed` on the Breadcrumb) and the title stays readable; a path whose last level already reads as the title (the same words, however spaced or cased) gets no echo |
| menu button | the shell's Sidebar is off-canvas (`useAppShellNav`) | a soft icon Button at the start of the bar, `aria-expanded` |
| bar plan | the natural widths of the groups against the bar's width (measured after every render, re-chosen on resize and once web fonts load), held within the plan's margin | `data-plan="one" \| "below" \| "icons-secondary" \| "icons" \| "fold"` on the bar's row; `data-heading="stack"` when a heading with a path stacks past the last step |
| icon-only button | plan `icons-secondary` (secondary) or `icons` / `fold` (all) | `data-button-label="icon"` on the button's wrapper; its label hides, its tooltip opens on hover and focus |
| folded buttons | plan `fold` | the secondary Buttons' wrappers `hidden`; a «⋯» Dropdown in their place, their `menuitem`s inside |
| heading place | inside TopBar or in the flow | `data-place="bar" \| "flow"` on Heading |
| with actions | `Page.Actions` child | `data-has-actions="true"` on Header / the section heading row |
| tile span | `span` / `rows` on Cell | `data-span="1"…"12"` (always), `data-rows="2"…"4"` (absent for 1) |
| tile pair | a `span` 7–11 Cell next to a `span` 4–5 Cell in the Grid | `data-pair="wide" \| "narrow"` on both Cells (set by the Grid) |
| held | `Page.Guard` `busy` or `dirty` | a press on a `Sidebar.Item`, `Sidebar.Brand`, `BottomNav.Item` or `Breadcrumb.Item` link is stopped (capture phase, before the item's and the router link's handlers); `dirty` opens the `ConfirmDialog` and its confirm repeats the press once the dialog has closed (its texts are the `leave*` keys of `labels` on `Page.Root`); a `beforeunload` listener while either is on. A press that opens a new tab (a modifier key, a middle click, `target="_blank"`) and navigation from code are never held |
| detail open | `open` / `defaultOpen` on Split | `data-open="true"` on Split; narrow: the list is `display: none`, else the detail is |
| pane swap | `open` changes on a narrow split | the pane that comes into view enters once (`enterMotion.enterBase`); focus moves into the detail, or back to the list control |

## Layout & spacing
- The edge air comes from the host: `AppShell.Main` sets `--page-gutter` (the page gutter, 16 → 24 → 32) and `--page-top` (24 → 32 from 1024px); `Page.Root` pads itself with them. Outside a host the page brings no air. The page resets both for what it holds, so a page nested in it starts clean.
- `Page.TopBar` steps out of the gutter to the panel's edges and keeps the gutter inside; padding 12 above (or the top safe-area inset) and below; what follows starts 24 under its controls (header → body; the bar's own 12 counts in), 16 on a compact page. The first line is as high as the Sidebar brand row (control m + 8), so the two read as one line. Groups 16 apart on a line, lines 12 apart; tools 8 apart; buttons 8 apart.
- `Page.Tools` and `Page.Chips` are the kit's one tool row and chips line (`ToolRow`), the same as the DataTable `toolbar` and `toolbarChips`: the bar only places them. On the first line every tool keeps its natural width; on a line of their own they take the line and lay out from its width (container `prime-tool-row`), never from the window.
- The tool row lays out the elements it is given, each in a cell: pass the tools as direct children of `Page.Tools` or a fragment. A wrapper component that returns several controls is one cell — no gaps between them, no growing search.
- In the bar only the heading's column gives (`minmax(0, 1fr)`): the tools and the actions keep their width. The heading keeps its title line's natural width until every button step is taken — short of room by less than the plan's margin, it truncates by that much and the step holds; its description truncates in whatever room the line has (on a compact page it wraps between words to two lines first; a description that opens with a `StatusDot` stays one line); then a heading with a path stacks (the path over the title, the title and the description wrapping), so no level is cut to a fragment; a heading without a path truncates its title.
- The plan is measured, never chosen by breakpoints: the bar lays itself out from its own width.
- Header (flow) → Body 24; blocks inside Body 24; a `Page.Section` 40 from its neighbours (the body's 24 + 16); tile → tile in a Grid 16 on both axes; section heading → content 16, heading → description 4; flow Title → Description 8; heading → Actions 24 side by side, 16 once they wrap below.
- A `Page.Section` about a record (`number`, `Page.Badges`) heads it with one line, as a record header does: the `label` is cut down to its own text or 8em, the number after it never, the badges 6 after it fold into «+N»; a plain heading wraps.
- Compact: under 30rem of its own content width (a phone) the page breathes at one number, 16 — the gutter `AppShell.Main` hands it, header or top bar → body, block → block, tile → tile and the padding of an `m` Card (its frame reads the same width); a `Page.Section` stands 32 off. `Page.Root` is the size container (`prime-page`) that query reads.
- The grid lays itself out from its own width (`prime-grid`), the split from its own (`prime-split`) — never from the window.
- `fill` needs a main with a height: the app frame of `AppShell.Root` (not a `fillViewport={false}` document shell). The body passes its free height on to a filling child — DataTable `scrollHeight="fill"`, Crossfade `fill`, `Page.Split`.
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
- The menu button carries `aria-expanded` and `aria-controls` → the Sidebar's `<nav>`. A Button that shows only its icon keeps its label as its accessible name; its tooltip repeats it. Folded Buttons are `hidden` in the bar and `menuitem`s in the «⋯» menu (named by `labels.more`), named by the Button's `aria-label` or its text, disabled with it; their `onClick` runs from the menu.
- `Page.TopBar` renders its groups in reading order — `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — whatever the JSX order; the plan moves them only visually. A named `Page.Tools` is a `group`. The chevron between the path and the title is decorative (`aria-hidden`): the title is the `<h1>`, outside the path's `<nav>`.
- `Page.Section` is a `<section>` named by its own `<h2>` (`label`) through `aria-labelledby`; the heading levels go h1 (page) → h2 (section) → h3 (a card title inside it).
- `Page.Guard` holds a press made by pointer or keyboard alike (Enter on a link is a click). Its confirm is a `ConfirmDialog` (`alertdialog`): focus moves into it and, on «stay», returns to the item that was pressed.
- Name both panes of `Page.Split` with `aria-label`: a named pane is `role="region"`. On a narrow split opening the detail moves focus into it and going back returns focus to the list control; the hidden pane is `display: none`. `Page.BackButton` is named by `labels.back` and shown only while the split shows one pane.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `menu` | `"Открыть меню"` | Name of the menu button `Page.TopBar` draws while the shell's Sidebar is off-canvas. |
| `more` | `"Ещё действия"` | Name of the «⋯» button the secondary Buttons of the top bar's `Page.Actions` fold into. |
| `back` | `"Назад к списку"` | Name of `Page.BackButton`. |
| `leaveTitle` | `"Уйти без сохранения?"` | Title of the confirm `Page.Guard` opens when a person leaves a `dirty` page. |
| `leaveDescription` | `"Изменения на странице пропадут."` | Its description. |
| `leaveConfirm` | `"Уйти"` | Its confirm button: leave and lose the changes. |
| `leaveCancel` | `"Остаться"` | Its cancel button: stay on the page. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A work page in an app window: the top bar with the title, its line of data and the page's buttons, the body under it — `Page.TopBar`, `Page.Heading`, `Page.Actions`. |
| [variants.tsx](examples/variants.tsx) | The same page at three caps: the whole main, a wide dashboard column, a reading column — `maxWidth`. |
| [structure.tsx](examples/structure.tsx) | A document page in the flow: the path over the large title, its line of data and the page's buttons beside them, then the body with a section — `Page.Header`, `Page.Heading`, `Page.Description`, `Page.Section`. |
| [top-bar.tsx](examples/top-bar.tsx) | A nested record in the top bar: the path ending in the title, a line of data, the page's tools and its buttons — `Page.TopBar`, `Page.Heading`, `Page.Tools`, `Page.Actions`. |
| [loading.tsx](examples/loading.tsx) | A page whose figures load after it opens: the line of data keeps its place under the title while it loads, so nothing in the bar moves — `loading`. |
| [collapse.tsx](examples/collapse.tsx) | A document page whose large title scrolls away under the top bar: the bar holds the path and repeats the title after it once the title is out of view — `collapse`, `Page.Header`. |
| [tools.tsx](examples/tools.tsx) | The orders page's tools in its top bar: sections with counts, the search and filter that narrow both views, the view, in the order written; the active filters on a line under everything — `Page.Tools`, `Page.Chips`. |
| [router.tsx](examples/router.tsx) | A section with sub-pages: the title is the section, each sub-page is a route of its own with its own actions, the switch in the heading row before the buttons is their links and the body renders the sub-page at once; render it inside a router — `Page.Tools`, `asChild`. |
| [actions-collapse.tsx](examples/actions-collapse.tsx) | The buttons of an invoices page on a tablet-wide column: the line runs short, so the secondary buttons show only their icons with the label as the name and the tooltip, the primary keeps its label — `Page.Actions`, `Button.Icon`. |
| [sections.tsx](examples/sections.tsx) | A page with titled sections: tiles of one screen close together, a new topic set off by air, a link at the end of the heading, a section about one contract with its number and status on the heading's line — `Page.Section`, `label`, `number`, `description`, `Page.Badges`, `Page.Actions`. |
| [grid.tsx](examples/grid.tsx) | A dashboard board: four KPI tiles, a chart two rows high beside two panels, one gap on both axes — `Page.Grid`, `Page.Cell`, `span`, `rows`. |
| [list-detail.tsx](examples/list-detail.tsx) | A ticket queue as list + detail on a full-height page: side by side on a wide panel, one pane at a time with a back button on a narrow one; the chosen ticket cross-fades in — `Page.Split`, `Page.List`, `Page.Detail`, `Page.BackButton`, `fill`. |
| [guard.tsx](examples/guard.tsx) | A client's card edited on its own page: after an edit a press on the navigation or the path asks before the changes are lost, and while it saves nothing leaves — `Page.Guard`, `dirty`, `busy`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone the top bar leads with the menu button that opens the navigation by itself, the primary button gives way to its icon and the secondary ones fold into «⋯» — `offCanvas`, `Page.Actions`. |
| [screen.tsx](examples/screen.tsx) | A settings page as a document: the path in the top bar that repeats the title once it scrolls away, the large title in the flow, each section a card with its own heading, a form saved by its own button, switches that apply at once and a danger zone with a confirm — `collapse`, `maxWidth`, `Card.Header`. |

## Mistakes
- `{ready ? <Page.Description>…</Page.Description> : null}` → the line appears after the load and the title jumps; keep it mounted with `loading` until the data comes.
- A global header above every page → the app is navigation and the page; each page renders its own `Page.TopBar` with only what it needs.
- Padding on `Page.Root` or around it to imitate gutters → the page takes them from `AppShell.Main`.
- Two titles — one in the bar, one in the flow → one `Page.Title`; a flow title with `collapse` is repeated in the bar by itself.
- A second title row in the bar (the path on one line, the title under it) → `Page.Heading` puts the title after the path on one line; the description is the only line under it.
- A title outside the path (`Page.Title` beside `Page.Heading`, or the record's name as the last Breadcrumb item) → the title goes inside `Page.Heading` with the `Breadcrumb.Root`; the heading draws the chevron.
- Buttons without an icon in a crowded bar → they cannot give way to an icon; give each `Button.Root` a `Button.Icon` beside its label.
- Two places for buttons (some beside the title, the primary among the tools) → every button of the page goes into the one `Page.Actions`, the primary last.
- `SmartFilter.Root` inside the bar, around `Page.Tools` → it holds no DOM; wrap it around `Page.Root` so its Toolbar (in `Page.Tools`) and its Chips (in `Page.Chips`) share it.
- A table block's search, filter, chips or «Вид» in `Page.Tools` / `Page.Chips` on a page with other blocks (KPI cards, a chart, a record's sections) → they read as filters of the whole page; they go in the table's `toolbar` / `toolbarChips`. The bar keeps the title, sections, the view, a period that drives every block and the page's buttons.
- A DataTable `toolbar` on a section page (a page that is mainly the table) → the tools stand elsewhere on every page and jump when the view switches to a board; put them in `Page.Tools` / `Page.Chips` and wrap `Page.Root` in `SmartFilter.Root`.
- Sub-pages of a section as a second Sidebar level, a tab strip inside `Page.Body`, or a title that names the sub-page → the title stays the section, the sub-pages are route links in `Page.Tools` (`SegmentedControl.Item asChild`), and the section's Sidebar item stays current on every sub-route.
- A dashboard or analytics page with a bar of tools only (`collapse`) over a large title in the flow → the title and its line of data go in the bar's `Page.Heading` beside the tools, as on a list; the flow header is for document pages.
- `Page.Header` inside `Page.TopBar` → the bar takes `Page.Heading` and `Page.Actions` directly; `Page.Header` is the flow's document header.
- A hand-made menu button for the phone Sidebar → the bar draws it while the Sidebar is off-canvas.
- Hiding buttons with media queries on a phone → `Page.Actions` in the bar collapses and folds them by measured width.
- Wrapping a group of the bar or `Page.Title` in your own component → the bar and the heading find their parts among their direct children.
- A hand-made `<section>` + `Typography as="h2"` + own gap CSS → `Page.Section label`.
- A record's number typed into a section `label` («Сделка #852»), or a `List` row or a hand-made row of a heading and a `Badge` over a section → `Page.Section label number` with `Page.Badges`.
- A heading column beside a panel (the section's title and description on the left, its card on the right) → it wastes the width and breaks the reading line; a titled block is a `Card.Root` with its own `Card.Header` (`Card.Title as="h2"`, `Card.Description`) stacked in the flow.
- Each row of cards in its own grid → put every tile of the screen in one `Page.Grid`.
- Computing a height from `100vh` minus the bar for a full-height table or chat → `Page.Root fill` and a filling child.
- A list + detail built with window media queries → `Page.Split` follows its own width.
- A `beforeunload` listener and a ConfirmDialog on a crumb of your own for unsaved changes → `Page.Guard dirty`; it also holds the Sidebar and BottomNav items.
- Tiles of a row cut to 6 + 6 so a mid-width grid keeps no hole → write the 8 and the 4 next to each other; the grid pairs them as 2/3 + 1/3.

## Related
- **Built from:** [AppShell](../app-shell/COMPONENT.md) (the navigation the menu button opens), [Badge](../../components/badge/COMPONENT.md) (the `Badge.Group` of `Page.Badges`), `headerRow` (a record section's title line), [Breadcrumb](../../components/breadcrumb/COMPONENT.md) (the path the heading places), [Button](../../components/button/COMPONENT.md) (the menu button, «⋯», `Page.BackButton`; the icon-only label hook), [Dropdown](../../components/dropdown/COMPONENT.md) (folded buttons), [Tooltip](../../components/tooltip/COMPONENT.md) (the label of an icon-only button), `ToolRow` (`Page.Tools` and `Page.Chips`: the kit's one tool row and chips line) with [SmartFilter](../../components/smart-filter/COMPONENT.md), [Input](../../components/input/COMPONENT.md) and [Typography](../../components/typography/COMPONENT.md) (what grows in the tool row), [SegmentedControl](../../components/segmented-control/COMPONENT.md), [Datepicker](../../components/datepicker/COMPONENT.md) and [Select](../../components/select/COMPONENT.md) (what fills a short line; the first two get `fullWidth`), [Crossfade](../../components/crossfade/COMPONENT.md) (a `Page.Cell` child gets `fill`), [Skeleton](../../components/skeleton/COMPONENT.md) (the line of data while it loads), [StatusDot](../../components/status-dot/COMPONENT.md) (the status that opens a description), [ConfirmDialog](../../components/confirm-dialog/COMPONENT.md) (the confirm of `Page.Guard`), Icon (`nav.menu`, `nav.chevronRight`, `action.more`, `nav.chevronLeft`)
- **See also:** [DataTable](../../components/data-table/COMPONENT.md) (`toolbar`, `toolbarChips`), [Sidebar](../sidebar/COMPONENT.md), [BottomNav](../bottom-nav/COMPONENT.md), [Select](../../components/select/COMPONENT.md), [Card](../../components/card/COMPONENT.md), [ChartFrame](../../components/chart-frame/COMPONENT.md), [List](../../components/list/COMPONENT.md), [EmptyPage](../../components/empty-page/COMPONENT.md), [Drawer](../../components/drawer/COMPONENT.md), [VisuallyHidden](../../components/visually-hidden/COMPONENT.md)

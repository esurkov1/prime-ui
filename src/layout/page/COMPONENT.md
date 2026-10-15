# Page

**Category:** page
**Kind:** layout

> The page inside the app frame: everything at the top belongs to it — a top bar with the title, tools and buttons, the large document title in the flow — then sections, the tile grid and the list + detail layout.

## When to use
- Every route rendered inside `AppShell.Main`: the app is navigation and the page, and the page carries its own top (`Page.TopBar`), title (`Page.Title`, the `<h1>`) and body.
- A work screen (a list, a board, a chat, a schedule): `Page.TopBar` with the title (`Page.Heading`), the page's tools (`Page.Tools`: sections, search and filter, view), all its buttons (`Page.Actions`) and the active filters (`Page.Chips`).
- A document page (settings, a long form, help) or an overview (a dashboard): `Page.Header` in the flow — the large title and its buttons — and `Page.TopBar collapse`, which repeats the title once it scrolls away and keeps the path and the buttons in reach.
- A nested record: a `Breadcrumb` path in `Page.Heading`; in the bar the title reads as its last level.
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
│  │                               groups in any JSX order, rendered in this order:
│  ├─ Page.Heading                 the title group: path › title on one line, description under it
│  │  ├─ Breadcrumb.Root           the path; the heading draws one chevron after it
│  │  ├─ Page.Title                <h1>, title-m, the path's last level, truncates
│  │  └─ Page.Description          <p>, muted caption under the whole line, truncates
│  ├─ Page.Tools                   the page's controls in the order written, one wrapper each
│  │  ├─ SegmentedControl.Root     sections, view (fullWidth unless set)
│  │  ├─ SmartFilter.Toolbar       search and filter: grows first on a line of its own
│  │  └─ Select.Root …             a period, columns
│  ├─ Page.Actions                 every button of the page; icons, then «⋯» when short
│  └─ Page.Chips                   SmartFilter.Chips on a line under everything
├─ Page.Header                     the document header in the flow
│  ├─ Page.Heading
│  │  ├─ Breadcrumb.Root           the path over the title
│  │  ├─ Page.Title                <h1>, heading-m
│  │  └─ Page.Description          <p>, secondary body-m
│  └─ Page.Actions                 wrap under the heading on a narrow column
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

`SmartFilter.Root` holds no DOM: wrap it around `Page.Root` (or whatever holds both its Toolbar in `Page.Tools` and its Chips in `Page.Chips`).

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Page.Root
`ref` → `HTMLDivElement`. The page column inside `AppShell.Main`: top bar, header and body 24 apart; takes the shell's gutters and top air (`--page-gutter`, `--page-top`). Named, it is a `region`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxWidth` | `"full" \| "readable" \| "wide"` | `"full"` | Cap of everything but the top bar, centred: `full` — the whole main; `readable` — 42rem (`--prime-layout-reading-max-width`); `wide` — 75rem (`--prime-layout-content-max-width`). |
| `fill` | `boolean` | `false` | The page takes the height of main (`AppShell.Root fillViewport`) and the body takes what the bar and the header leave: for a full-height table, board, chat or `Page.Split`. |
| `labels` | `Partial<PageLabels>` | — | Built-in strings of every part, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Page.TopBar`, `Page.Header`, `Page.Body`), `className` and the other div attributes. |

### Page.TopBar
`ref` → `HTMLElement` (`<header>`). The strip at the page's top edge: `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` in this DOM order, laid out by one plan from their natural widths — one line, tools below, icon-only buttons, «⋯», then a truncated heading.

| Prop | Type | Default | Description |
|---|---|---|---|
| `sticky` | `boolean` | `true` | Sticks to the top of the page's scroller (`AppShell.Main`); `false` — scrolls away with the page. On a screen lower than 480px it scrolls anyway. |
| `collapse` | `boolean` | `false` | Once the flow `Page.Title` scrolls out under the bar, the bar repeats it (with its description) as the last level of its heading; it leaves when the title returns. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (`Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — direct children), `className` and the other attributes. |

### Page.Header
`ref` → `HTMLDivElement`. The document header in the page flow (settings, long forms, overviews): a `Page.Heading` and its `Page.Actions` in one row; the actions wrap under it on a narrow column.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Page.Heading`, `Page.Actions`), `className` and the other div attributes. |

### Page.Heading
`ref` → `HTMLDivElement`. The title group: a `Breadcrumb.Root` path, `Page.Title`, `Page.Description`. In the bar the title is the path's last level (path › title on one line, both truncate); in the flow the path stands over a large title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Breadcrumb.Root`, `Page.Title`, `Page.Description`), `className` and the other div attributes. |

### Page.Title
`ref` → `HTMLHeadingElement`. The page's `<h1>`, one per page: the path's last level in the bar (title-m, truncates), a large title in the flow (heading-m, wraps). A flow title is what a `collapse` bar repeats.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `children`, `id`, `className` and the other heading attributes. |

### Page.Description
`ref` → `HTMLParagraphElement`. One line of context that carries data (a period, a count): a muted caption under the whole heading line that truncates in the bar, secondary body-m that wraps (up to the reading measure) in the flow.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `children`, `className` and the other paragraph attributes. |

### Page.Tools
`ref` → `HTMLDivElement`. The page's tools as kit controls in the order written: sections, `SmartFilter.Toolbar`, view. On a line of their own a search grows first; a `SegmentedControl.Root` is `fullWidth` unless set. Named, a `group`.

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

### Place of Page.Heading
| Value | Looks like | Use when | Default |
|---|---|---|---|
| in `Page.TopBar` | one line as high as the Sidebar brand row: path › title-m, the caption description under the whole line; both truncate | work screens: lists, boards, chats, records | |
| in `Page.Header` in the flow | the large document header: path over a heading-m title, body-m description, the header's `Page.Actions` beside it, wrapping under it | document pages and overviews | |

The size follows the place; the consumer passes nothing, and there are no title size props. One `Page.Title` (`<h1>`) per page, in one of the two places. A bar with no visible title still holds the `<h1>`: a `Page.Title` wrapped in `VisuallyHidden`, or a flow `Page.Title` (with `collapse` the bar repeats it).

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

### Top bar plan
One plan, chosen from the natural widths of the groups (`data-plan` on the bar's row). The bar takes the first step whose first line fits:

| Step | Looks like | Use when | Default |
|---|---|---|---|
| `one` | `[Heading 1fr][Tools][Actions]` on one line | everything fits | yes |
| `below` | the tools on a line of their own under the heading and the actions, filling it: a search (`SmartFilter.Toolbar`, `Input.Root`) grows first, switchers share the rest and wrap when one line is not enough | heading + tools + actions do not fit | |
| `icons-secondary` | as `below`; secondary Buttons with a `Button.Icon` show only the icon, the label is their name and their tooltip | heading + actions still do not fit | |
| `icons` | the primary Button gives way to its icon too | still too wide | |
| `fold` | the secondary Buttons fold into «⋯» (`labels.more`); the primary stays | still too wide; past it the heading truncates (path levels first, then the title) | |

The actions stay on the first line beside the heading at every step; `Page.Chips` is always a line under everything; nothing overflows. The primary is the first solid `Button.Root`; a Button without an icon keeps its label at every step; anything that is not a `Button.Root` stays as it is.

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
| bar plan | the natural widths of the groups against the bar's width (measured after every render, re-chosen on resize and once web fonts load) | `data-plan="one" \| "below" \| "icons-secondary" \| "icons" \| "fold"` on the bar's row |
| icon-only button | plan `icons-secondary` (secondary) or `icons` / `fold` (all) | `data-button-label="icon"` on the button's wrapper; its label hides, its tooltip opens on hover and focus |
| folded buttons | plan `fold` | the secondary Buttons' wrappers `hidden`; a «⋯» Dropdown in their place, their `menuitem`s inside |
| heading place | inside TopBar or in the flow | `data-place="bar" \| "flow"` on Heading |
| with actions | `Page.Actions` child | `data-has-actions="true"` on Header / the section heading row |
| section heading column | `layout="aside"` on Section | `data-layout="aside"` on Section (absent for `stack`) |
| tile span | `span` / `rows` on Cell | `data-span="1"…"12"` (always), `data-rows="2"…"4"` (absent for 1) |
| detail open | `open` / `defaultOpen` on Split | `data-open="true"` on Split; narrow: the list is `display: none`, else the detail is |
| pane swap | `open` changes on a narrow split | the pane that comes into view enters once (`enterMotion.enterBase`); focus moves into the detail, or back to the list control |

## Layout & spacing
- The edge air comes from the host: `AppShell.Main` sets `--page-gutter` (the page gutter, 16 → 24 → 32) and `--page-top` (24 → 32 from 1024px); `Page.Root` pads itself with them. Outside a host the page brings no air. The page resets both for what it holds, so a page nested in it starts clean.
- `Page.TopBar` steps out of the gutter to the panel's edges and keeps the gutter inside; padding 12 above (or the top safe-area inset) and below; the page's top air goes under it. The first line is as high as the Sidebar brand row (control m + 8), so the two read as one line. Groups 16 apart on a line, lines 12 apart; tools 8 apart; buttons 8 apart.
- In the bar only the heading's column gives (`minmax(0, 1fr)`): the tools and the actions keep their width. The heading keeps its natural width until every button step is taken; then the path levels truncate first, then the title, down to a few letters.
- The plan is measured, never chosen by breakpoints: the bar lays itself out from its own width.
- Header (flow) → Body 24; blocks inside Body 24; a `Page.Section` 40 from its neighbours (the body's 24 + 16); tile → tile in a Grid 16 on both axes; section heading → content 16, heading → description 4; flow Title → Description 8; heading → Actions 24 side by side, 16 once they wrap below.
- The grid lays itself out from its own width (`prime-grid`), the split from its own (`prime-split`) — never from the window.
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
- The menu button carries `aria-expanded` and `aria-controls` → the Sidebar's `<nav>`. A Button that shows only its icon keeps its label as its accessible name; its tooltip repeats it. Folded Buttons are `hidden` in the bar and `menuitem`s in the «⋯» menu (named by `labels.more`), named by the Button's `aria-label` or its text, disabled with it; their `onClick` runs from the menu.
- `Page.TopBar` renders its groups in reading order — `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — whatever the JSX order; the plan moves them only visually. A named `Page.Tools` is a `group`. The chevron between the path and the title is decorative (`aria-hidden`): the title is the `<h1>`, outside the path's `<nav>`.
- `Page.Section` is a `<section>` named by its own `<h2>` (`label`) through `aria-labelledby`; the heading levels go h1 (page) → h2 (section) → h3 (a card title inside it).
- Name both panes of `Page.Split` with `aria-label`: a named pane is `role="region"`. On a narrow split opening the detail moves focus into it and going back returns focus to the list control; the hidden pane is `display: none`. `Page.BackButton` is named by `labels.back` and shown only while the split shows one pane.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `menu` | `"Открыть меню"` | Name of the menu button `Page.TopBar` draws while the shell's Sidebar is off-canvas. |
| `more` | `"Ещё действия"` | Name of the «⋯» button the secondary Buttons of the top bar's `Page.Actions` fold into. |
| `back` | `"Назад к списку"` | Name of `Page.BackButton`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A work page in an app window: the top bar with the title, its line of data and the page's buttons, the body under it — `Page.TopBar`, `Page.Heading`, `Page.Actions`. |
| [variants.tsx](examples/variants.tsx) | The same page at three caps: the whole main, a wide dashboard column, a reading column — `maxWidth`. |
| [structure.tsx](examples/structure.tsx) | A document page in the flow: the path over the large title, its line of data and the page's buttons beside them, then the body with a section — `Page.Header`, `Page.Heading`, `Page.Description`, `Page.Section`. |
| [top-bar.tsx](examples/top-bar.tsx) | A nested record in the top bar: the path ending in the title, a line of data, the page's tools, its buttons and the active filters — `Page.TopBar`, `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips`. |
| [collapse.tsx](examples/collapse.tsx) | An overview whose large title scrolls away under the top bar: the bar repeats it with its line of data and keeps the period and the page's buttons in reach — `collapse`. |
| [tools.tsx](examples/tools.tsx) | The orders page's tools in its top bar: sections with counts, search and filter, the period, in the order written; the active filters on a line under everything — `Page.Tools`, `Page.Chips`. |
| [actions-collapse.tsx](examples/actions-collapse.tsx) | The buttons of an invoices page on a tablet-wide column: the line runs short, so the secondary buttons show only their icons with the label as the name and the tooltip, the primary keeps its label — `Page.Actions`, `Button.Icon`. |
| [sections.tsx](examples/sections.tsx) | A page with titled sections: tiles of one screen close together, a new topic set off by air, a link at the end of the heading, a heading column beside a panel — `Page.Section`, `label`, `description`, `Page.Actions`, `layout`. |
| [grid.tsx](examples/grid.tsx) | A dashboard board: four KPI tiles, a chart two rows high beside two panels, one gap on both axes — `Page.Grid`, `Page.Cell`, `span`, `rows`. |
| [list-detail.tsx](examples/list-detail.tsx) | A ticket queue as list + detail on a full-height page: side by side on a wide panel, one pane at a time with a back button on a narrow one; the chosen ticket cross-fades in — `Page.Split`, `Page.List`, `Page.Detail`, `Page.BackButton`, `fill`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone the top bar leads with the menu button that opens the navigation by itself, the primary button gives way to its icon and the secondary ones fold into «⋯» — `offCanvas`, `Page.Actions`. |
| [screen.tsx](examples/screen.tsx) | A settings page as a document: the path in the top bar that repeats the title once it scrolls away, the large title in the flow, sections with a heading column and a panel, a form saved by its own button, switches that apply at once and a danger zone with a confirm — `collapse`, `layout`, `maxWidth`. |

## Mistakes
- A global header above every page → the app is navigation and the page; each page renders its own `Page.TopBar` with only what it needs.
- Padding on `Page.Root` or around it to imitate gutters → the page takes them from `AppShell.Main`.
- Two titles — one in the bar, one in the flow → one `Page.Title`; a flow title with `collapse` is repeated in the bar by itself.
- A second title row in the bar (the path on one line, the title under it) → `Page.Heading` puts the title after the path on one line; the description is the only line under it.
- A title outside the path (`Page.Title` beside `Page.Heading`, or the record's name as the last Breadcrumb item) → the title goes inside `Page.Heading` with the `Breadcrumb.Root`; the heading draws the chevron.
- Buttons without an icon in a crowded bar → they cannot give way to an icon; give each `Button.Root` a `Button.Icon` beside its label.
- Two places for buttons (some beside the title, the primary among the tools) → every button of the page goes into the one `Page.Actions`, the primary last.
- `SmartFilter.Root` inside the bar, around `Page.Tools` → it holds no DOM; wrap it around `Page.Root` so its Toolbar (in `Page.Tools`) and its Chips (in `Page.Chips`) share it.
- `Page.Header` inside `Page.TopBar` → the bar takes `Page.Heading` and `Page.Actions` directly; `Page.Header` is the flow's document header.
- A hand-made menu button for the phone Sidebar → the bar draws it while the Sidebar is off-canvas.
- Hiding buttons with media queries on a phone → `Page.Actions` in the bar collapses and folds them by measured width.
- Wrapping a group of the bar or `Page.Title` in your own component → the bar and the heading find their parts among their direct children.
- A hand-made `<section>` + `Typography as="h2"` + own gap CSS → `Page.Section label`.
- Each row of cards in its own grid → put every tile of the screen in one `Page.Grid`.
- Computing a height from `100vh` minus the bar for a full-height table or chat → `Page.Root fill` and a filling child.
- A list + detail built with window media queries → `Page.Split` follows its own width.

## Related
- **Built from:** [AppShell](../app-shell/COMPONENT.md) (the navigation the menu button opens), [Breadcrumb](../../components/breadcrumb/COMPONENT.md) (the path the heading places), [Button](../../components/button/COMPONENT.md) (the menu button, «⋯», `Page.BackButton`; the icon-only label hook), [Dropdown](../../components/dropdown/COMPONENT.md) (folded buttons), [Tooltip](../../components/tooltip/COMPONENT.md) (the label of an icon-only button), [SegmentedControl](../../components/segmented-control/COMPONENT.md) (`fullWidth` in `Page.Tools`), [SmartFilter](../../components/smart-filter/COMPONENT.md) and [Input](../../components/input/COMPONENT.md) (the search that grows first in `Page.Tools`), Icon (`nav.menu`, `nav.chevronRight`, `action.more`, `nav.chevronLeft`)
- **See also:** [Sidebar](../sidebar/COMPONENT.md), [BottomNav](../bottom-nav/COMPONENT.md), [Select](../../components/select/COMPONENT.md), [Card](../../components/card/COMPONENT.md), [ChartFrame](../../components/chart-frame/COMPONENT.md), [List](../../components/list/COMPONENT.md), [EmptyPage](../../components/empty-page/COMPONENT.md), [Drawer](../../components/drawer/COMPONENT.md), [VisuallyHidden](../../components/visually-hidden/COMPONENT.md)

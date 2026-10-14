# PageContent

**Category:** page
**Kind:** layout

> Page structure inside the main column: title, page actions and content blocks, titled sections and the tile grid of a dashboard; a page as high as the panel and the list + detail layout.

## When to use
- Every route rendered inside `AppShell.Main`: a page heading (`<h1>`), an intro line, page-level actions and the page body.
- A text page held to a reading measure (`PageContent.Root maxWidth="readable"`).
- A wide dashboard page capped at the content width (`maxWidth="wide"`).
- The tiles of a dashboard — KPI cards, charts, panels — as one board (`PageContent.Grid` + `PageContent.Cell`).
- A new topic of the page with its own heading and a link or button beside it (`PageContent.Section`); a settings page with a heading column beside each panel (`layout="aside"`).
- A page whose body takes the rest of the panel's height — a log table, a board, a chat (`fill`).
- Mail, a messenger, a ticket queue: a list and the chosen record side by side, one at a time on a narrow panel (`PageContent.Split`).

## When not to use
- The app frame (navigation rail, header, scrolling main column) → use [AppShell](../../layout/app-shell/COMPONENT.md).
- A bounded block inside the page → use [Card](../card/COMPONENT.md).
- An empty / error / not-found page → use [EmptyPage](../empty-page/COMPONENT.md).
- A heading inside a card → `Card.Title`; text headings inside prose → use [Typography](../typography/COMPONENT.md).
- A grid inside one block (thumbnails, fields, bars in a panel) → the block's own CSS grid; `PageContent.Grid` places the page's tiles.
- Details that open over the list and close again (a record from a table) → use [Drawer](../drawer/COMPONENT.md); `Split` is for a list people work through record by record.

## Import
```tsx
import { PageContent } from "prime-ui-kit";
```

## Anatomy
```
PageContent.Root                           column (<div>, or <section> with as="section"); maxWidth, fill
├─ PageContent.Header                      heading column + actions in one wrapping row
│  ├─ PageContent.Title                    <h1>, heading-m
│  ├─ PageContent.Description              <p>, secondary body-m
│  └─ PageContent.Actions                  page buttons (moved to the end of the header row)
└─ PageContent.Body                        page content, blocks 24 apart
   ├─ PageContent.Grid                     12-column tile grid, 16 on both axes; a container (prime-grid)
   │  └─ PageContent.Cell                  one tile place: span, rows; its child fills it
   ├─ PageContent.Section                  <section> + <h2> label, 40 from its neighbours
   │  └─ PageContent.Actions               a link or button at the end of the section heading
   └─ PageContent.Split                    list + detail; a container (prime-split)
      ├─ PageContent.Panel kind="list"     list pane: 16–20rem column, or the whole split while closed
      └─ PageContent.Panel kind="detail"   detail pane: the rest, or the whole split while open
         └─ PageContent.BackButton         back to the list, only while one pane shows
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### PageContent.Root
`ref` → `HTMLElement` (`<div>` or `<section>`). The page column inside `main`: header → body 24 apart, centred under its cap.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"div" \| "section"` | `"div"` | `section` — the whole app page as a region; name it with `aria-labelledby` → the Title `id`. |
| `maxWidth` | `"full" \| "readable" \| "wide"` | `"full"` | Cap of the column, centred: `full` — the whole main; `readable` — the reading measure `--prime-layout-reading-max-width` (42rem); `wide` — the content width `--prime-layout-content-max-width` (75rem). |
| `fill` | `boolean` | `false` | The page takes the height of main (`AppShell.Root fillViewport`) and the body takes what the header leaves: for a full-height table, board, chat or `PageContent.Split`. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (Header, Body), `className` and the other attributes. |

### PageContent.Header
`ref` → `HTMLDivElement`. Heading column and page actions in one wrapping row; `PageContent.Actions` children move to the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Title, Description, Actions), `className` and the other div attributes. |

### PageContent.Title
`ref` → `HTMLHeadingElement`. The page `<h1>` in heading-m.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `children`, `id`, `className` and the other heading attributes. |

### PageContent.Description
`ref` → `HTMLParagraphElement`. Intro `<p>` in secondary body-m.

| Prop | Type | Default | Description |
|---|---|---|---|
| `measure` | `"readable" \| "full"` | `"readable"` | `readable` — no wider than the reading measure `--prime-layout-reading-max-width` (42rem); `full` — the full width of the parent. |
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `children`, `className` and the other paragraph attributes. |

### PageContent.Actions
`ref` → `HTMLDivElement`. Page-level buttons next to the title; they wrap under the heading on narrow columns.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Buttons), `className` and the other div attributes. |

### PageContent.Body
`ref` → `HTMLDivElement`. The page content: blocks of one screen 24 apart, a `PageContent.Section` 40 from its neighbours.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageContent.Section
`ref` → `HTMLElement`. A titled section of the page — a `<section>` named by its `h2` (title-m): the heading with an optional description and `PageContent.Actions` at its end, then the content 16 below. Stands 40 from its neighbours in Body.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | The visible heading (`h2`); it also names the section. |
| `description` | `ReactNode` | — | One line of context under the heading, in secondary body-s. |
| `layout` | `"stack" \| "aside"` | `"stack"` | `stack` — the heading over the content; `aside` — a ~16rem heading column beside it (a settings page), above it once the content would get narrower than 30rem. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "title">` | — | `children` (the content; `PageContent.Actions` goes to the heading row), `className` and the other section attributes. |

### PageContent.Grid
`ref` → `HTMLDivElement`. The grid of the page's tiles (KPI cards, charts, panels): 12 columns, 16 apart on both axes, so its rows read as one board. A size container: cells fold by its own width (see Grid columns).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`PageContent.Cell`), `className` and the other div attributes. |

### PageContent.Cell
`ref` → `HTMLDivElement`. One tile place in `PageContent.Grid`; its child (a Card, a ChartFrame) stretches to it, so the tiles of a row share one height.

| Prop | Type | Default | Description |
|---|---|---|---|
| `span` | `1 \| 2 \| … \| 12` | `12` | Columns of 12 on a wide grid (64rem+). Narrower grids round it: see Grid columns in COMPONENT.md. |
| `rows` | `1 \| 2 \| 3 \| 4` | `1` | Rows the cell spans from 40rem: a chart beside two stacked tiles (`ChartFrame.Plot height="fill"` fills the height). |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (one tile), `className` and the other div attributes. |

### PageContent.Split
`ref` → `HTMLDivElement`. List + detail (mail, a messenger, a ticket queue): side by side from 48rem of its own width, one pane at a time below it, focus following the pane that comes into view.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | The detail is open (a record is chosen), controlled. On a narrow split it takes the place of the list; on a wide one both panes stay. |
| `defaultOpen` | `boolean` | `false` | Initial open state, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | `PageContent.BackButton` closes the detail (`false`); clear the chosen record there. |
| `labels` | `Partial<PageContentLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (two `PageContent.Panel`s: `list`, then `detail`), `className` and the other div attributes. |

### PageContent.Panel
`ref` → `HTMLDivElement`. A pane of the split: a column whose last child takes the free height (a Card with its own ScrollContainer). Focusable from code (`tabindex=-1`, no ring).

| Prop | Type | Default | Description |
|---|---|---|---|
| `kind` | `"list" \| "detail"` | — (required) | `list` — the 16–20rem column, or the whole split while closed; going back refocuses its last control. `detail` — the rest, or the whole split while open; focus lands here when it opens. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `aria-label`, `className` and the other div attributes. |

### PageContent.BackButton
`ref` → `HTMLButtonElement`. Back from the detail to the list: a soft neutral icon Button (`nav.chevronLeft`) named by `labels.back`, shown only while the split shows one pane. Put it first in the detail's header; `event.preventDefault()` in `onClick` keeps the detail open.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children">` | — | `onClick`, `aria-label` (replaces `labels.back`), `className` and the other button attributes. |

## Variants

### maxWidth (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `full` | Column fills the main area | App pages, tables, dashboards in a padded main | yes |
| `readable` | Column capped at `--prime-layout-reading-max-width` (42rem), centred | Terms, articles, help pages | |
| `wide` | Column capped at `--prime-layout-content-max-width` (75rem), centred | Wide screens where content should not stretch edge to edge | |

### measure (Description)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `readable` | Intro line wraps at the reading width | Default, most pages | yes |
| `full` | Intro uses the full header width | The column is already narrow | |

One `PageContent.Title` (`<h1>`) per page; a topic inside Body is a `PageContent.Section` (its `h2`). One primary button in Actions, the rest `soft` / `ghost` neutral.

### Flags
| Flag | Looks like when on | Use when | Default |
|---|---|---|---|
| `fill` (Root) | the page is as high as main; the body takes what the header leaves; main keeps gutter-high air under it | a full-height table, board, chat or `PageContent.Split` in an `AppShell.Root fillViewport` | `false` |

### layout (Section)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `stack` | the heading row over the content, 16 apart | a topic of a dashboard, a list or a detail page | ✓ |
| `aside` | a ~16rem heading column beside the content, above it once the content would get < 30rem | a settings page: a heading column beside each panel | |

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
| narrow (below 48rem) | one pane: the list, or the open detail with `PageContent.BackButton` | phones, a narrow panel next to an open Sidebar | — |

## States
| State | Driven by | DOM |
|---|---|---|
| capped column | `maxWidth` | `data-max-width="readable" \| "wide"` on Root (absent for `full`) |
| filling | `fill` | `data-fill="true"` on Root; `AppShell.Main` drops its long bottom air for it |
| full-width intro | `measure="full"` | `data-measure="full"` on Description |
| with actions | `PageContent.Actions` child | `data-has-actions="true"` on Header |
| section heading column | `layout="aside"` on Section | `data-layout="aside"` on Section (absent for `stack`) |
| section with actions | `PageContent.Actions` child of Section | `data-has-actions="true"` on the section heading row |
| tile span | `span` / `rows` on Cell | `data-span="1"…"12"` (always), `data-rows="2"…"4"` (absent for 1) |
| detail open | `open` / `defaultOpen` on Split | `data-open="true"` on Split; narrow: the list is `display: none`, else the detail is |
| pane swap | `open` changes on a narrow split | the pane that comes into view enters once (`enterMotion.enterBase`: base, opacity + a 4 px rise); focus moves into the detail, or back to the list control; a wide split moves nothing |

## Layout & spacing
- No outer padding: edge gutters come from `AppShell.Main`.
- Header → Body `--prime-space-6` (24); blocks inside Body `--prime-space-6` (24); a `PageContent.Section` 40 from its neighbours (the body's 24 + `--prime-space-4`); tile → tile in a Grid `--prime-space-4` (16) on both axes; section heading → content `--prime-space-4` (16), heading → description `--prime-space-1` (4); Title → Description `--prime-space-2` (8); buttons in Actions `--prime-space-2`; heading → Actions `--prime-space-6` (24) side by side, `--prime-space-4` (16) once they wrap below.
- Header is a wrapping row: actions stay to the right of the title while the heading keeps half a reading measure, otherwise they wrap below it — no breakpoint needed, works from 320px.
- Title and Description wrap long words (`overflow-wrap: anywhere`).
- Grid lays itself out from its own width (container `prime-grid`), never from the window, so a board beside an open Sidebar folds on its own. A Cell stretches its child: the tiles of a row share one height; a chart in a `rows={2}` cell fills it with `ChartFrame.Plot height="fill"`. `dense` flow lets a small tile fill a hole left by a wide one.
- `fill` needs a main with a height: `AppShell.Root fillViewport` (main scrolls inside the panel). The body passes its free height on to a filling child — DataTable `scrollHeight="fill"`, Crossfade `fill`, `PageContent.Split`.
- Split takes the free height of a filling page and lays itself out from its own width (container `prime-split`), never from the window: a split beside an open Sidebar may be narrow on a wide screen. Each pane is a column whose last child takes the free height — put a Card with its own `ScrollContainer` there, so the list and the thread scroll separately. The records of the list pane are a [List](../list/COMPONENT.md).
- The detail pane is on screen all the time on a wide split: while nothing is chosen it shows a short hint («Выберите обращение»), never an empty card. A newly chosen record cross-fades in (`Crossfade` keyed by its id).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Space` | On `PageContent.BackButton`: back from the detail to the list; focus returns to the list control that opened it. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `PageContent.Title` is an `<h1>`; use one per page.
- Give `PageContent.Root as="section"` an `aria-labelledby` that points at the Title `id` to name the region.
- `PageContent.Section` is a `<section>` named by its own `<h2>` (`label`) through `aria-labelledby`, so it is a region landmark with the heading's name; the heading levels go h1 (page) → h2 (section) → h3 (a card title inside it).
- Name both `PageContent.Panel`s with `aria-label`: a named pane is `role="region"`, a landmark. On a narrow split opening the detail moves focus into it and going back returns focus to the list control; the hidden pane is `display: none`, out of Tab and the accessibility tree. The panes take focus from code only (`tabindex="-1"`, no ring).
- `PageContent.BackButton` is named by `labels.back` and is shown only while the split shows one pane.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `back` | `"Назад к списку"` | Name of `PageContent.BackButton` (on `PageContent.Split`). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A page in the main column: title, description and page actions, then the body blocks — `PageContent.Actions`. |
| [variants.tsx](examples/variants.tsx) | The same page column at three caps: the whole main, a wide dashboard column, a reading column — `maxWidth`. |
| [grid.tsx](examples/grid.tsx) | A dashboard board: four KPI tiles, a chart two rows high beside two panels, one gap on both axes — `PageContent.Grid`, `PageContent.Cell`, `span`, `rows`. |
| [sections.tsx](examples/sections.tsx) | A page with titled sections: tiles of one screen close together, a new topic set off by air, a link at the end of the heading, a heading column beside a panel — `PageContent.Section`, `label`, `description`, `PageContent.Actions`, `layout`. |
| [list-detail.tsx](examples/list-detail.tsx) | A ticket queue as list + detail on a full-height page: side by side on a wide panel, one pane at a time with a back button on a narrow one; the chosen ticket cross-fades in — `PageContent.Split`, `PageContent.Panel`, `PageContent.BackButton`, `fill`. |
| [narrow.tsx](examples/narrow.tsx) | In a phone-width column the page actions wrap under the heading instead of squeezing it — `PageContent.Actions`. |
| [screen.tsx](examples/screen.tsx) | A settings page: sections with a heading column and a panel, a form saved by its own button, switches that apply at once and a danger zone with a confirm — `layout`, `maxWidth`. |

## Mistakes
- Padding on `PageContent.Root` to imitate gutters → gutters come from `AppShell.Main`.
- Actions placed outside Header → put `PageContent.Actions` inside `PageContent.Header` so it aligns with the title and wraps.
- Several `PageContent.Title` on one page → one `<h1>`; a topic of the page is a `PageContent.Section` with its `<h2>`.
- A hand-made `<section>` + `Typography as="h2"` + own gap CSS → `PageContent.Section label`.
- Each row of cards in its own grid → the rows stand 24 apart instead of 16; put every tile of the screen in one `PageContent.Grid`.
- Margins between blocks in Body → Body already sets the 24 gap and the 40 around a Section.
- Computing a height from `100vh` minus the header for a full-height table or chat → `PageContent.Root fill` and a filling child.
- A list + detail built with window media queries → `PageContent.Split` follows its own width.
- Unmounting the detail content the moment the narrow split goes back → keep the last record until another is chosen (the pane leaves with it on screen).

## Related
- **Built from:** [Button](../button/COMPONENT.md) (`PageContent.BackButton`), Icon (`nav.chevronLeft`)
- **See also:** [AppShell](../../layout/app-shell/COMPONENT.md), [Sidebar](../../layout/sidebar/COMPONENT.md), [Card](../card/COMPONENT.md), [ChartFrame](../chart-frame/COMPONENT.md), [List](../list/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [Drawer](../drawer/COMPONENT.md)

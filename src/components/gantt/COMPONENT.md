# Gantt

**Category:** data-display
**Kind:** composite

> A resource or project schedule: rows of people, rooms, vehicles or tasks with bars on a day / week / month axis, edited by pointer and keyboard.

## When to use
- Resource occupancy: who or what is busy when (people with projects and vacations, rooms, vehicles).
- A project plan: phases with progress and milestones that people move and stretch.
- Any set of rows whose records have a start and an end date that people compare across time.

## When not to use
- A history of events without durations → use [Timeline](../timeline/COMPONENT.md).
- Records compared by many attributes, sorted and selected → use [DataTable](../data-table/COMPONENT.md).
- Work items moved between statuses → use [Kanban](../kanban/COMPONENT.md).
- Picking a date or a range → use [Datepicker](../datepicker/COMPONENT.md).
- Slots within a day (hours, meeting-room bookings, appointments) → not covered: the chart's unit is a calendar day, dates snap to local midnight and the finest zoom is a day.

## Import
```tsx
import {
  Gantt,
  type GanttBar,
  GanttCategoriesMenu,
  type GanttCategory,
  type GanttDates,
  type GanttZoom,
} from "prime-ui-kit";
```

## Anatomy
```
Gantt                          surface (layer of the ladder), size container
├─ toolbar                     only with `toolbar` or `legend`: the kit's tool row of your content and the legend
├─ «Сегодня»                   Button at the edge of the head where today went off screen
└─ viewport                    ScrollContainer, rows scroll up and down; time is the camera's: pinch, Ctrl / ⌘ + wheel, a sideways wheel, one finger
   └─ role="grid"
      ├─ head row (sticky)     corner: the zoom Select · axis: the quiet tier of dates on a time layer; a drag along it zooms and slides
      └─ rows                  backdrop time layer: weekends, grid lines, today line
         ├─ rowheader          renderRowAvatar · renderRow (or getRowLabel); inside an <a> with getRowHref
         └─ gridcell           the row's time layer — bars in lanes: <button> + Tooltip (title, dates, renderBarTooltip), grips at both ends, diamond for a milestone
GanttCategoriesMenu            the kit's view trigger (columns icon · «Вид» · count Badge) + Dropdown: «На графике» check items · «По умолчанию» once changed; in Page.Tools beside the search
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Gantt
`ref` → `HTMLDivElement` (the surface). A schedule: rows with bars on a time axis in a `role="grid"`, under one head row — the zoom selector, then the dates. A pinch, the wheel and `+` / `−` zoom; a swipe slides. `aria-label` names the grid; other attributes go to the surface.

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` | `Row[]` | — (required) | Rows: people, rooms, vehicles, tasks. Virtualized, so thousands of rows stay fast. |
| `getRowKey` | `(row: Row) => Key` | — (required) | Stable row id. |
| `getRowLabel` | `(row: Row) => string` | — (required) | Row name: the first column text by default and the row header for assistive tech. |
| `getRowBars` | `(row: Row) => Bar[]` | — (required) | Bars of a row (`GanttBar`); bars that overlap in time stack into lanes and grow the row. |
| `renderRow` | `(row: Row) => ReactNode` | — | First-column content instead of the label (a name with a role or a code). |
| `renderRowAvatar` | `(row: Row) => ReactNode` | — | A picture before the row content (an `Avatar`). Below 36rem of chart width the column keeps only it; the row header is then named by `getRowLabel` (`aria-label`). |
| `getRowHref` | `(row: Row) => string` | — | The row header is a link: a real `<a>` fills the first column and is the row's stop in the grid, so a click, ⌘/Ctrl-click, a middle click and «open in new tab» work on it; Space follows it like Enter. |
| `onRowClick` | `(row: Row, event: GanttRowClickEvent) => void` | — | Opens a row in place (a profile in a Drawer): a click on its header, Enter or Space; never from a control inside it. With `getRowHref` it gets plain clicks: `event.preventDefault()` routes in the app. |
| `renderBarTooltip` | `(bar: Bar, row: Row) => ReactNode` | — | Extra lines of a bar's tooltip (a client, hours, an owner), under its title and the dates line — those always stay, the dates and the duration are what the bar means on the axis. |
| `categories` | `readonly GanttCategory[]` | — | Kinds of bars (rentals, bookings, service), in menu order: a bar with a `category` takes its hue, `hiddenCategories` hide its bars; `legend` lists them above the chart. |
| `hiddenCategories` | `readonly string[]` | — | Ids of the hidden categories (`GanttCategoriesMenu` changes them): their bars are not drawn and their legend entries close up; the time axis keeps its span. |
| `legend` | `boolean` | `false` | Shows the legend of `categories` on the row above the chart — a Badge with the dot of each shown category, after your `toolbar` content. Off: the hues and the hiding work alone. |
| `zoom` | `"day" \| "week" \| "month" \| number` | — | Zoom, controlled: a preset of the selector (`day`, `week`, `month`), or the length of a day in px a gesture or a key left between them (the selector reads «Свой»), held between the whole axis in view and the top step. |
| `defaultZoom` | `"day" \| "week" \| "month" \| number` | `"week"` | Initial zoom, uncontrolled. |
| `onZoomChange` | `(zoom: GanttZoom) => void` | — | The zoom changed: a preset from the selector (the day in the middle stays in the middle), or where a gesture or a key left it (the day under the hand stays under it) — a preset when it ended within 8% of one. |
| `range` | `{ start: Date; end: Date }` | — | The time axis, in whole days. Default: every bar and today with a month of room on both sides, from the 1st of a month, at least 12 months — one axis for every zoom. |
| `today` | `Date` | today | The day of the today line and of today's flag in the head; the chart opens with it a third into the view, and once the view slides away «Сегодня» at that edge of the head glides back to it. |
| `locale` | `Locale` | `ru` | date-fns locale of the header, tooltips and spoken dates. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of rows, bars and the head: one-lane rows 28 · 32 · 44 · 48 · 52 px, the zoom presets of the tier; bar text, the selector and «Сегодня» one tier down. Without it the host's tier, else `m`. |
| `readOnly` | `boolean` | `false` | No moving, resizing or creating; bars still select and show their dates. |
| `loading` | `boolean` | `false` | Without rows — skeleton rows in the chart's geometry and a status for screen readers; with rows they stay and the grid is `aria-busy`. |
| `empty` | `ReactNode` | — | Empty-state content when `rows` is empty; a string goes into a compact `EmptyPage`. Defaults to `labels.empty`. |
| `toolbar` | `ReactNode` | — | Your tools (search, «Вид», a filter) on a row above the chart, before the `legend`; the row is there only with `toolbar` or `legend`. |
| `scrollHeight` | `number \| "fill"` | — | Max height of the viewport in px, so the header sticks while rows scroll; `"fill"` — no taller than its flex / grid parent: as tall as its rows, scrolling them inside beyond it. |
| `onItemOpen` | `(bar: Bar, row: Row) => void` | — | A bar was activated (click, Enter, Space): open its record. A drag never opens it. |
| `onBarChange` | `(dates: GanttDates, bar: Bar, row: Row) => void \| Promise<void>` | — | New dates of a bar after a drag or an editing key — update your data. A returned Promise keeps the bar busy at the new dates; a rejection glides it back. Without it bars cannot be edited. |
| `onBarCreate` | `(dates: GanttDates, row: Row) => void \| Promise<void>` | — | A new bar in a row: drawn across empty space, a double-click, a touch long-press or `N`. Add it to your data; a returned Promise keeps a busy ghost in place. Without it nothing can be created. |
| `labels` | `Partial<GanttLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `aria-label` (the grid's name), `className` and the other div attributes. |

### GanttCategoriesMenu
`ref` → `HTMLButtonElement`. The view of a chart, for the page's tools: the kit's one view trigger (the columns icon, «Вид», the count of shown categories), a check item per category and «По умолчанию» once changed. The chart reads the same `hiddenCategories`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `categories` | `readonly GanttCategory[]` | — (required) | The chart's `categories`, in menu order. |
| `hiddenCategories` | `readonly string[]` | — | Ids of the hidden categories (controlled). |
| `defaultHiddenCategories` | `readonly string[]` | `[]` | The default view: the initial hidden categories (uncontrolled) and what «По умолчанию» puts back. |
| `onHiddenCategoriesChange` | `(hiddenCategories: readonly string[]) => void` | — | A category was shown or hidden, or the default view put back. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the trigger and the menu. |
| `labels` | `Partial<GanttCategoriesMenuLabels>` | — | The menu's strings: `view`, `categories`, `reset`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "type">` | — | `className` and the other attributes of the trigger button. |

### Types

#### `GanttBar`
One bar of `getRowBars`: data, not a part. Dates are calendar days with an exclusive `end`; `start` equal to `end` is a milestone. Extend the type with your own fields: callbacks get your object back.

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | Unique across the chart. |
| `start` | `Date` | — (required) | First day. |
| `end` | `Date` | — (required) | The day after the last one. |
| `label` | `string` | — (required) | Text inside the bar — beside it when the bar is too short (measured) — in the tooltip and in the accessible name. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | the hue of its `category`, else `"blue"` | Palette hue of the bar (a project, a team, a kind of absence). |
| `category` | `string` | — | Id of its `GanttCategory`: the bar takes its hue and leaves with it (`hiddenCategories`). |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | — | Status color (done, at risk, overdue); wins over `color`. |
| `progress` | `number` | — | Share done, `0…1`: a stronger fill from the start of the bar; the percentage joins the tooltip and the name. |
| `edit` | `"all" \| "end" \| "none"` | `"all"` | Which dates a person may change: `all` — move and both edges; `end` — only the end (a rental already issued): no move, no start grip, only Ctrl + Shift + arrows, and a milestone stays put; `none` — nothing (a public holiday, a closed phase). |
| `height` | `"s" \| "m" \| "l"` | `"m"` | The bar's height, on the tier letters: `m` — the one-line bar, the label inside; `l` — a caption line taller, the label and `description` on two lines (a long booking); `s` — a step shorter, a caption label inside (documents, a check). The main bars (`m`, `l`) pack first, then `s` below them; a lane is as tall as its tallest bar; the root `size` scales all three. |
| `description` | `string` | — | The secondary text: the second line of an `l` bar; on every bar it joins the tooltip and the accessible name. |

#### `GanttCategory`
One entry of `categories`: a kind of bar, a legend entry and an item of `GanttCategoriesMenu`.

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | Stable id: `GanttBar.category` and `hiddenCategories` refer to it. |
| `label` | `string` | — (required) | Text of its legend entry and of its menu item. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"blue"` | Palette hue of its bars and its legend dot. |

## Variants

### zoom
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `day` | a day is 40 px at `m`: a number per day, «1 ноя» at a month's 1st, a line every day, weekends barely washed | daily shifts, bookings by the day, a sprint | |
| `week` | a day is 16 px at `m`: a number every 2 or 7 days counted from each 1st, a line every day | a quarter of projects, team occupancy | yes |
| `month` | a day is 4 px: the 1st, 8th, 15th, 22nd and 29th, a line at each, no weekend wash | a yearly roadmap | |
| a number | the length of a day in px that a gesture or a key left between the presets; the selector reads «Свой» | the person's own zoom, kept by the page | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` · `s` | one-lane rows 28 / 32, bars 20 / 24, a head row of 40, a day 32 / 12 / 4 px at the presets | dense side panels, many rows | |
| `m` | rows 44, bars 28, a head row of 52, a day 40 / 16 / 4 px at the presets | page content | yes |
| `l` · `xl` | rows 48 / 52, bars 32 / 36, a head row of 56, a day 48 / 20 / 4 px at the presets | spacious screens, touch-first | |

### color (GanttBar)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `blue` | soft blue bar, blue text | default category | yes |
| `gray` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | soft fill and text of the hue; progress a stronger mix of its solid | projects, teams, kinds of absence | |

### tone (GanttBar)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | muted fill, primary text | duty, a service block | |
| `accent` | accent soft | the current focus, a key milestone | |
| `success` · `warning` · `danger` · `info` | status soft fill and text | done, at risk, overdue, on approval | |

A `tone` wins over `color`. Say the status in the label too, never only by color.

### edit (GanttBar)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `all` | a grab cursor on the body, grips at both ends; every editing key | a phase, a booking, planned work | yes |
| `end` | no grab cursor, a grip only at the end; only Ctrl + Shift + arrows; a milestone stays put | a rental already issued, work already started: the start is history | |
| `none` | no grips, no editing keys; still selects and shows its tooltip | a vacation, a public holiday, a closed phase | |

### height (GanttBar)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `m` | a lane of the tier's bar height (28 px at `m`), the label inside | the bars the chart is about: rentals, bookings, phases | yes |
| `l` | a lane a caption line taller (44 px at `m`): the label, and `description` on a second line in the caption role | a long or key bar whose secondary fact matters on sight: a booking with its deposit | |
| `s` | a lane a step shorter (20 px at `m`), a caption label inside | an auxiliary task beside the main ones: documents, a check, an inspection | |

The main bars (`m`, `l`) pack first, then `s` below them, each by start. A lane is as tall as its tallest bar (an `m` bar stands centred in an `l` lane); the three heights follow the root `size`. `description` is on every bar's tooltip and name; only `l` draws it.

### Flags
| Flag | Effect |
|---|---|
| `readOnly` | No moving or resizing anywhere; bars still select and show their tooltip. |
| `loading` | Skeleton rows without data; with rows the grid is `aria-busy`. |
| `legend` | The legend of `categories` on the row above the chart. Off by default: the hues and the hiding (`hiddenCategories`, `GanttCategoriesMenu`) work without it — say the kind in the bar's label and tooltip. |

## States
| State | Driven by | DOM |
|---|---|---|
| zoom | `zoom` / `defaultZoom`; a pinch, Ctrl / ⌘ + wheel, a drag along the dates, `+` / `−` | the length of a day, continuous, laid out every frame of a gesture; `data-step` on the root (`day` · `2days` · `week` · `month` · `quarter` · `half` · `year` · `2years` · `5years` · `10years`: the head's one label step); a preset or a key glides about the middle — a zoom that cannot centre it (the whole axis fits, an edge) shows the nearest view, and the next zoom returns to that day; a gesture keeps the day under the hand exactly; a step change cross-fades the labels, both steps on the live camera |
| slid | a sideways wheel or swipe, Shift + wheel, one finger, a drag along the dates, «Сегодня», a key that reveals a bar | one transform written onto every time layer at once — the dates, the backdrop and each row — and nothing rendered until the view nears the edge of what is laid out |
| today off screen | the view slid away from `today` | «‹ Сегодня» / «Сегодня ›» at that edge of the head rises in (part presence) and glides today back a third into the view; it closes up once today is in view |
| tier | `size` (else the host tier) | `data-size` on the root; each row's track carries the tier one down (`data-size`), the size of the bar text |
| bar color | `color` / `tone`, else the `category` hue | `data-color` (without a tone) or `data-tone` on the bar |
| hidden category | `hiddenCategories` (`GanttCategoriesMenu`) | its bars are not rendered and the lanes close up; its legend Badge closes up in place, the rest glide; shown again, it rises in. The time axis keeps the span of every bar |
| milestone | `start` equal to `end` | `data-milestone`: a diamond on its day, the label beside it |
| bar label | the label against its bar (measured; chosen again only at rest, never per frame of a zoom) | `data-label="inside"` (it fits), `"outside"` (it does not, and the lane is free beside it up to the next bar), `"clipped"` (no room beside: inside, start-aligned as ever, cut at the bar's end under a short fade — no ellipsis), `"hidden"` (a milestone with no room); the name and the tooltip keep the whole title |
| progress | `progress` | `data-progress`, `--progress` |
| editable | `onBarChange`, not `readOnly`, `GanttBar.edit` | `data-editable="all"`: grips at both ends, `aria-keyshortcuts`, `aria-describedby` → `labels.editHint`; `data-editable="end"`: the end grip only, the end keys in `aria-keyshortcuts`, `aria-describedby` → `labels.editEndHint`; `edit` `none`: no `data-editable` |
| dragging | a pointer drag | `data-dragging="move \| start \| end"`: the bar lifts and follows the pointer exactly; the dates land on whole days at every zoom (held with hysteresis; zoomed out to the years a px may cover days — the day under the pointer); hold Alt to land on the nearest tick of the head's step (the 8th, a 1st), a faint accent guide marking it; the tooltip shows the exact dates and the days («5 – 18 октября · 14 дн.»); on release the bar glides to them |
| creating | the mouse over empty space, a row header with keyboard focus, a long press, drawing, `onBarCreate` pending or refused | one ghost element throughout, in a real bar's height, radius and lane. Hovered (and at the `N` slot of a focused row header, and picked up by a long press) the phantom (`data-look="phantom"`): a faint accent wash and ring with «+» and «Новая задача» when it fits, one cell of the grid — a day whenever day lines are drawn — stepping with a short glide; never over a bar, never where it would need a lane of its own. Pressed and dragged a real bar (`data-look="bar"`, the default hue): its length in days inside, its dates in the tooltip (`drawing`), growing and shrinking by whole days either way from the pressed day; with Alt by cells of the head's step. A press let go where it began creates nothing; Escape fades the bar out (`leaving`). Pending a pulsing Skeleton; on resolve the bar you added stands where it stood, on reject it fades out |
| pending | `onBarChange` returned a Promise | `data-pending`, `aria-busy`, a Spinner; reject → the bar glides back |
| loading | `loading` without rows | Skeleton rows with one or two bars each in a real bar's height, radius and lane, under the column and today lines; `aria-busy`, status `labels.loading`; data cross-fades in |
| empty | `rows` empty | a compact `EmptyPage` (`empty` or `labels.empty`), cross-faded in |
| row opens | `onRowClick` / `getRowHref` | `data-clickable` on the row header: a pointer cursor and a hover wash under its content (an inset shadow over the opaque header, faded both ways); with `getRowHref` the content is an `<a>` whose hit area fills the header |
| axis cut | the view hides days at an edge | `data-overflow-start` / `data-overflow-end`: an edge shadow from the first column / at the end |

## Layout & spacing
- The root is a surface one step off its host (Card radius, no border) and a size container; give it a width (it fills its parent).
- `scrollHeight="fill"`: no taller than the parent — the chart sizes to its rows (or its empty / loading state) and stops at the free height of its flex / grid parent, its rows scrolling inside beyond it with the head stuck; a short chart leaves no empty box under its rows.
- The first column is 12rem; below 48rem of chart width 10rem; below 36rem 6rem, or only the avatar with `renderRowAvatar`.
- Head: one row (52 px at `m`) that sticks with the first column. Its corner holds only the zoom selector (a Select one tier down, as wide as its value; with avatars only, its glyph); there is no title and no label over the names. The head is the top of the grid: a tick at its foot on each of the grid's lines, as faint and all one height, and the labels of ONE step on them — regular sans figures in tabular width, all one muted colour (weekends too), numbers only. A month's 1st writes the date with its month («1 ноя», the month semibold in the primary text; «1 янв 2026» at a year); the month steps name the months («Окт») and the year at January («2027»). The boundary of the period at the start edge sticks there on the head's fill — the month you are in (the year from a month step on) — pushed out by the next one. Every label starts after its tick, by the same small padding. The today line runs at the start of today's cell, through the head and down the rows; from it, in the head, today's flag (the line's accent, square on the line, rounded at its free end) grows to the end side and says today's date — today's own label, its text exactly where the plain label's is («21»; «21 окт» at the month steps, with the year when the view spans years from the quarter step on) — kept whole inside the axis; a neighbour gives way only where the flag reaches it. No other accent in the head, no upper tier.
- Time runs on one camera — the length of a day and the day at the start edge — and everything that shows time is placed from it by one function, on a whole device pixel: a bar's edge is the pixel of the grid line it sits on at every zoom. The dates, the backdrop and every row are layers laid out from the scene's origin over five screens (a screen and a half while a zoom moves) and slid by one transform written onto all of them in the same call, so they never part. Bars move only when their dates change (a glide); a zoom or a slide never eases them.
- The zoom is continuous and stops at the whole axis in view and at 96 px a day. The chart is one even surface. Lines: one family at a time, one weight — a line every day once a day is 6 px wide, so every boundary is one of them; below that a line at each tick of the head's step, and nothing between or stronger; the head's ticks are the same lines. Weekends are the kit's faintest fill, only from 16 px a day (a built-in default: Saturday and Sunday); no other fill on the chart. Labels stand on one step at a time — 1 or 2 days, 7 days, 1, 3 or 6 months, 1, 2, 5 or 10 years — the finest whose labels, measured, stand apart with room for their margins; a finer step needs 15% to spare, so a zoom resting on a threshold never flickers, and a step change cross-fades. Every step stands on the calendar's own boundaries: 2 and 7 days count from each month's 1st (1, 3, 5… and 1, 8, 15, 22, 29; a month's last cell runs 0–3 days short), months from January, so a month's or a year's start («1 янв 2027») is always a tick, at the start of a cell like every label; there are no weeks, which do not nest in months. One format per family, so a step only thins the same labels. A boundary always stands: an ordinary label next to it, under the stuck one or under today's flag fades by the room left, never overlapping. A pinch (two fingers on touch, the trackpad on desktop), Ctrl / ⌘ + wheel and a drag along the dates (down closer, up back, sideways along) are anchored at the hand: the day under the fingers stays under them, gathered and laid out once a frame. The selector's presets and `+` / `−` glide about the middle. A gesture that ends within 8% of a preset glides onto it.
- Sliding: a sideways wheel or trackpad swipe, Shift + wheel, one finger sideways and a drag along the dates slide the view with the hand; a sideways swipe is the chart's from its first event (the browser never takes it for «back»), a vertical one stays the page's. There is no sideways scrollbar.
- Nothing selects where a press is a gesture — the dates, the rows' time, bars, the drawn bar (`user-select: none`, no touch callout); the names stay selectable.
- Touch: one finger up and down scrolls the rows natively, sideways slides the view (`touch-action: pan-y`); two fingers are the chart's pinch, never the page's zoom, and cancel a long press or a drag one of them began. A slide has no momentum.
- Virtualization: rows render only in view (plus an overscan) at offsets computed from their lanes and corrected by measuring, so the total height and the scrollbar stay exact; dates, lines, weekends and bars render only inside the scene laid out around the view. A focused, dragged, pending or new bar stays rendered wherever the view stands. Off screen the whole chart is skipped by the browser (`content-visibility: auto`, keeping its last height), so a page of several charts composites only those in view; the time layers slide by a 2D `translate`, never a composited layer per row. A bar paints the chart surface under its tint, so the grid and the weekends never show through it.
- Editing precision: a move, a resize and a drawing land on whole days at every zoom — held with hysteresis so a few px a day never jitter — and the tooltip says the exact dates and days; hold Alt to land on the ticks of the head's step (the 1st, 8th, 15th…; the 1sts of months). The keys move by a day at every zoom; with Alt from tick to tick. A bar is at least one day long: a resize past the opposite edge stops there and never flips. On touch a finger held on a bar picks it up, then it drags like a pointer.
- Creating: on empty space the cursor is a crosshair and the phantom of the bar a press would create stands under it — a day whenever day lines are drawn. Press and drag across a row: the phantom turns into a real bar of whole days, either way from the pressed day; or double-click (long-press on touch) for one phantom cell; a drag after the long press draws on. A press let go where it began creates nothing. Without `onBarCreate` (or with `readOnly`) nothing can be created and empty space shows no create cursor or phantom. Near the edges of the axis a drag, a resize and a drawing slide the view.
- Tooltip: the bar's title, then its dates · duration · progress; `renderBarTooltip` adds lines under them (a client, planned hours) and never replaces them — the dates are what the bar means on the axis, and the same tooltip shows the new dates while dragging.
- A legend of bar colours is `categories` with `legend`: the chart draws a `Badge.Group` named `labels.legend` of `Badge.Root color` + `Badge.Dot` with the category name, one per shown category, after your `toolbar` content, on the row above the chart (the row is there only with a `toolbar` or `categories`). A bar with a `category` takes its hue unless it has a `color` or a `tone` of its own. Say the category in the bar label or the tooltip too, never only by colour.
- What the chart shows is the person's choice: `GanttCategoriesMenu` («Вид») in the page's tools beside the search, bound to the same `hiddenCategories` the chart reads — the kit's one view trigger, the same soft neutral Button with the `view.columns` icon, «Вид» and the count of shown items as `DataTableColumnsMenu` and `KanbanFieldsMenu`, so a page that switches table ↔ board ↔ schedule keeps one «Вид» in one place. «По умолчанию» appears only while the view differs from `defaultHiddenCategories`. A bar without a `category` is always shown.
- The default axis covers every bar and today with a month of room on both sides, from the 1st of a month, at least a year — one axis for every zoom; pass `range` for a fixed period.
- The chart opens with today a third into the view (once it has a width); «Сегодня», the zoom and the arrow keys move only the chart's own view, never the page.
- A row grows by a lane for every overlapping bar: lanes are packed greedily by start date (then end, then order), from the row's real bars only — the main bars (`m`, `l`) first, then `s` below them (`height`), each lane as tall as its tallest bar; a shorter bar stands centred in a taller lane. The phantom and a drawing are `m` bars and stand only in a main lane. Nothing a pointer does moves them: the phantom stands in the lane under the pointer when that lane is free over its days, else it does not show (no other lane, no reflow); a drawn bar stays in the pressed lane while it is free, else takes the first free lane, else stays — the row keeps its height while hovering, drawing and dragging. Only a created bar may add a lane, once, on release (pending); a moved bar re-packs when its new dates arrive.
- Dates are calendar days; `end` is exclusive, so a one-day task on 3 July is `{ start: 3 July, end: 4 July }`.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | The chart is one tab stop: the last active cell (a bar or a row header). |
| `←` · `→` | Along the row: its header, then its bars in time order. A row or a bar off screen is rendered and brought into view. |
| `↑` · `↓` | From a bar, the bar nearest in time in the row above / below (rows without bars are skipped); from a row header, the next row's header, empty rows too. |
| `Home` · `End` | First / last bar of the row; with Ctrl, of the chart. |
| `Enter` · `Space` | On a bar: opens its record (`onItemOpen`). On a row header: opens the row (`onRowClick`) or follows its link (`getRowHref`). |
| `Shift + ←` · `Shift + →` | Moves the bar by one day, at every zoom; a bar with `edit` `end` does not move. |
| `Shift + Alt + ←` · `Shift + Alt + →` | Moves the bar to the next / previous tick of the head's step (1, 8, 15… of a month; a month) — as a drag with Alt lands on it. |
| `Ctrl + Shift + ←` · `Ctrl + Shift + →` | Shortens / lengthens the bar by one day (⌘ on macOS); it stops at one day. |
| `Ctrl + Shift + Alt + ←` · `Ctrl + Shift + Alt + →` | Shortens / lengthens the bar to a tick of the head's step. |
| `N` | Creates a bar of one cell of the phantom — a cell of the grid, a day whenever days are drawn (`onBarCreate`): at today on a row header — its phantom shows there while the header has focus — right after the bar on a bar. |
| `+` · `-` | Zooms in / out around the middle of the view, a step a press; the selector reads «Свой» between the presets. |
| `Escape` | Cancels a drag or the drawing of a new bar; closes the tooltip. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A `role="grid"` named by `aria-label`: a header row of `columnheader`s (the first column and the time axis named `labels.timeline`), then a row per record with a `rowheader` (the row name) and a `gridcell` holding its bars. A grid because the bars are navigated in two dimensions: moving between rows, a screen reader announces the row.
- A bar is a `<button>` named «Задача: 6 июля 2026 — 10 июля 2026» (with «выполнено 50%» when it has progress); a milestone «Релиз: 20 июля 2026». The Tooltip with the dates opens on hover and on focus and closes as soon as the chart moves (a slide, a zoom, the scrollbar, a touch); the next hover or focus opens it again. It points at the visible part of the bar and stays inside the timeline, never over the label column or the header; a bar with less than `--prime-space-6` in view shows none.
- An editable bar has `aria-keyshortcuts` and is described by `labels.editHint`; a bar with `edit` `end` lists only the end keys and is described by `labels.editEndHint`. The new dates after an editing key are announced in a polite status, a refused change with `labels.changeFailed`.
- While `onBarChange` runs the bar and the grid are `aria-busy`. Loading without rows hides the skeletons and announces `labels.loading`.
- The dates of the head, weekends, the grid lines and the today line are `aria-hidden`: the dates live in the bar names.
- A row header is a focusable cell; with `onBarCreate` it is described by `labels.createHint` and has `aria-keyshortcuts="N"`. A new bar is announced, a refused one with `labels.createFailed`; the ghost is `aria-hidden`.
- With `getRowHref` the header's stop in the grid is a real `<a>` named by the row's content inside the `rowheader`: a click, ⌘/Ctrl-click, a middle click and «open in new tab» work, Space follows it like Enter, and the arrows rove from it as from any cell. With `onRowClick` alone the header itself opens the row by a click, Enter or Space; a click on a control inside it never does.
- The legend of `categories` is a `group` named `labels.legend`; each entry says its category in words beside the dot. `GanttCategoriesMenu` is a menu button named by its text and count («Вид 4»); its items are a group named `labels.categories` of `menuitemcheckbox` with `aria-checked`.
- The zoom selector is a `Select` named `labels.zoom` in the head of the first column (a `columnheader` named `labels.rowsHeader`). A gesture or `+` / `−` that changes the zoom announces the selector's text with `labels.zoomChanged` in the polite status. Once today is slid out of view, a `Button` named `labels.toToday` («‹ Сегодня» / «Сегодня ›», pointing at it) at that edge of the head brings it back.
- Rows are virtualized: only the rows in view are in the DOM, while `aria-rowcount` on the grid and `aria-rowindex` on each row keep the full count.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Gantt

| Key | Default | Used for |
|---|---|---|
| `rowsHeader` | `"Название"` | Accessible name of the first column; its head holds the zoom selector. |
| `timeline` | `"Шкала времени"` | Accessible name of the time axis column. |
| `zoom` | `"Масштаб"` | Accessible name of the zoom selector. |
| `day` | `"День"` | Zoom preset: a day a column. |
| `week` | `"Неделя"` | Zoom preset: weeks. |
| `month` | `"Месяц"` | Zoom preset: months. |
| `customZoom` | `"Свой"` | The selector's text for a zoom between the presets. |
| `zoomChanged` | `"Масштаб: {zoom}"` | Announced when a gesture or a key changes the zoom; `{zoom}` is the selector's text. |
| `today` | `"Сегодня"` | Text of the button that brings today back into view. |
| `toToday` | `"К сегодня"` | Accessible name of that button. |
| `todayIs` | `"Сегодня, {date}"` | Description of the time axis: today's date, spoken in full (the flag on the today line is `aria-hidden`). |
| `bar` | `"{label}: {start} — {end}"` | Accessible name of a bar; `{start}` and `{end}` are its first and last day, spoken in full. |
| `milestone` | `"{label}: {date}"` | Accessible name of a milestone. |
| `progress` | `"выполнено {progress}%"` | Added to a bar's name when it has `progress`. |
| `editHint` | `"Shift + стрелки сдвигают на день, Ctrl + Shift + стрелки меняют окончание на день; с Alt — по линиям сетки"` | Description of an editable bar: the editing keys. |
| `editEndHint` | `"Ctrl + Shift + стрелки меняют окончание на день; с Alt — по линиям сетки"` | Description of a bar with `edit` `end`: the keys that change its end. |
| `duration` | `"{days} дн."` | Duration of a bar in its tooltip («5 – 18 октября · 14 дн.»). |
| `changeFailed` | `"Сроки не изменены: {label}"` | Announced when `onBarChange` rejects and the bar returns to its dates. |
| `newBar` | `"Новая задача"` | Label of the ghost of a bar being created and of its announcement. |
| `createHint` | `"N — создать задачу"` | Description of a row header when bars can be created. |
| `createFailed` | `"Задача не создана"` | Announced when `onBarCreate` rejects and the ghost fades out. |
| `loading` | `"Загрузка графика…"` | Screen-reader status while skeleton rows are shown. |
| `empty` | `"Нет задач за этот период."` | Default empty-state text. |
| `legend` | `"Обозначения"` | Accessible name of the legend of `categories`. |

#### GanttCategoriesMenu

| Key | Default | Used for |
|---|---|---|
| `view` | `"Вид"` | Text of the trigger. |
| `categories` | `"На графике"` | Heading of the group of categories. |
| `reset` | `"По умолчанию"` | The item that puts `defaultHiddenCategories` back. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A project plan: work streams with phases, progress and a launch milestone that move and stretch by pointer or keyboard — `getRowBars`, `onBarChange`. |
| [variants.tsx](examples/variants.tsx) | Bars colored by category with palette hues, and by status with tones that win over the hue — `color`, `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier: one-lane rows from 28 to 52 px, bars, the head row and its selector, and the zoom presets of the tier — `size`. |
| [occupancy.tsx](examples/occupancy.tsx) | Team occupancy by day: people with avatars, projects that overlap into lanes, locked vacations, a saved move held busy and a conflicting one gliding back, new work drawn on a free day — `renderRowAvatar`, `renderRow`, `onBarChange`, `onBarCreate`, `onItemOpen`, `edit`. |
| [rentals.tsx](examples/rentals.tsx) | A fleet calendar: an issued rental changes only its end, a booking moves and changes both edges, a long booking is a two-line bar with its deposit, documents and an inspection are short bars in a lane under the main ones, a new booking is drawn in a free lane — `edit`, `height`, `description`, `onBarChange`, `onBarCreate`. |
| [large.tsx](examples/large.tsx) | Two thousand people over two years stay fast: only the rows and days in view are rendered, keyboard focus reaches any row, bars move and stretch and new ones are drawn on empty space — `rows`, `range`, `scrollHeight`, `onBarChange`, `onBarCreate`. |
| [row-link.tsx](examples/row-link.tsx) | A team by client: each row header is a link to the person's profile that a plain click opens in place, each tooltip adds the client and the planned hours under the dates, and the clients are categories: their hues colour the bars and stand in the legend — `getRowHref`, `onRowClick`, `renderBarTooltip`, `categories`, `legend`. |
| [categories.tsx](examples/categories.tsx) | A fleet calendar by kind of bar: rentals, bookings and service share a legend and a view menu that hides a kind from the chart and from the legend at once — `categories`, `legend`, `hiddenCategories`, `GanttCategoriesMenu`. |
| [states.tsx](examples/states.tsx) | Skeleton rows in the chart's geometry while it loads, an empty period and a report you may only look at, its today line on the report day — `loading`, `empty`, `readOnly`, `today`. |
| [controlled.tsx](examples/controlled.tsx) | The zoom owned by the page: its presets, the selector and a pinch change one state — `zoom`, `onZoomChange`. |
| [narrow.tsx](examples/narrow.tsx) | At 360 px the first column keeps only the avatars, the zoom selector over them only its glyph, and the axis beside it slides under a finger and pinches — `renderRowAvatar`. |
| [screen.tsx](examples/screen.tsx) | A team schedule as a work screen: the title with the people shown and a toolbar with search, filters, team sections and the primary action in its top bar over a full-height Gantt; moves saved or refused, new work drawn and named in a Modal, details in a Drawer; the clients are categories with a legend and a view menu beside the search — `scrollHeight`, `onBarChange`, `onBarCreate`, `onItemOpen`, `categories`, `legend`, `GanttCategoriesMenu`. |

## Mistakes
- Updating the rows before the request succeeds (optimistic) → the chart cannot glide back on reject; update them when `onBarChange` resolves, or before you resolve it.
- An inclusive `end` (`{ start: 3 July, end: 3 July }` for a one-day task) → that is a milestone; `end` is the day after the last one.
- Status only by bar color → put it into the label too («Отпуск», «Просрочено»).
- Dates with times expecting hour precision → the chart works in calendar days.
- A `<div onClick>` inside `renderRow` to open a bar's or a row's record → use `onItemOpen` for a bar and `onRowClick` / `getRowHref` for a row: they work from the keyboard too.
- Replacing the dates in the tooltip with your own text → `renderBarTooltip` adds lines under them; the dates stay.
- Wrapping the chart in a Card → it is a surface itself; place it directly in the page or a Card body only as the card's one content.
- Expecting the page to scroll to today → «Сегодня» moves only the chart's view.
- Reading `scrollLeft` of the chart to know what is in view → time is not scrolled; `range`, `today` and the zoom say what the chart shows.
- A title or a zoom switch in `toolbar` → the chart is named by `aria-label` and the page's heading; the zoom is the selector in its head, a pinch and the wheel.
- Saving the zoom as a preset only → `onZoomChange` also reports a number (a day's length in px) when a gesture leaves it between presets; keep the value as given.
- A legend of `Badge`s in `toolbar` and bars filtered by hand in `getRowBars` → `categories` with `legend` and `hiddenCategories`: the chart hides the bars and their legend entries together.
- Bars filtered by hand to hide a kind without a legend → `categories` and `hiddenCategories` without `legend`: the hues and the «Вид» menu work, no legend row.
- A hand-made Dropdown of check items for what the chart shows → `GanttCategoriesMenu`, the same «Вид» as the table's and the board's.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md), [Badge](../badge/COMPONENT.md) (the legend, the view trigger's count), [Dropdown](../dropdown/COMPONENT.md) (`GanttCategoriesMenu`), `ViewMenu` (the kit's one view trigger and menu), `listPresence` (legend entries close up and rise in), [Select](../select/COMPONENT.md) (the zoom selector), [Button](../button/COMPONENT.md) («Сегодня»), [Skeleton](../skeleton/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Spinner](../spinner/COMPONENT.md), Icon (`action.add` in the phantom, `nav.chevronLeft` / `nav.chevronRight` on «Сегодня», `action.zoomIn` on the compact selector), `swapMotion` (the labels cross-fade to a new step), `edgeAutoScroll` (a drag held near an edge slides the view), `partPresence` («Сегодня» rises in and closes up), [VisuallyHidden](../visually-hidden/COMPONENT.md); `ToolRow` (the toolbar, as the DataTable `toolbar`) with [SmartFilter](../smart-filter/COMPONENT.md), [Input](../input/COMPONENT.md) and [Typography](../typography/COMPONENT.md) (what grows in the tool row), [SegmentedControl](../segmented-control/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md) and [Select](../select/COMPONENT.md) (what fills a short line; the first two get `fullWidth`)
- **See also:** [Timeline](../timeline/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Kanban](../kanban/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md), [Avatar](../avatar/COMPONENT.md)

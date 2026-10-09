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

## Import
```tsx
import { Gantt, type GanttBar, type GanttDates, type GanttScale } from "prime-ui-kit";
```

## Anatomy
```
Gantt                          surface (layer of the ladder), size container
├─ toolbar                     your `toolbar` content · «Сегодня» · zoom (SegmentedControl)
└─ viewport                    ScrollContainer, both axes, own scroll only
   └─ role="grid"
      ├─ head row (sticky)     corner (sticky) · axis: top tier (months / years) over bottom tier (days / weeks / months), today chip
      └─ rows                  backdrop: weekends, column lines, today line
         ├─ rowheader (sticky) renderRowAvatar · renderRow (or getRowLabel)
         └─ gridcell           bars in lanes: <button> + Tooltip, grips at both ends, diamond for a milestone
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Gantt
`ref` → `HTMLDivElement` (the surface). A schedule: a toolbar with the zoom and «Сегодня», then a `role="grid"` of rows — a sticky row header and a track of bars on a two-tier time axis with weekends and a today line. `aria-label` / `aria-labelledby` name the grid; the other attributes go to the surface.

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` | `Row[]` | — (required) | Rows: people, rooms, vehicles, tasks. Virtualized: only the rows in view (plus an overscan) are rendered, at offsets from their lane count and measured height, so thousands of rows stay fast. |
| `getRowKey` | `(row: Row) => Key` | — (required) | Stable row id. |
| `getRowLabel` | `(row: Row) => string` | — (required) | Row name: the first column text by default and the row header for assistive tech. |
| `getRowBars` | `(row: Row) => Bar[]` | — (required) | Bars of a row (`GanttBar`); bars that overlap in time stack into lanes and grow the row. |
| `renderRow` | `(row: Row) => ReactNode` | — | First-column content instead of the label (a name with a role or a code). |
| `renderRowAvatar` | `(row: Row) => ReactNode` | — | A picture before the row content (an `Avatar`). Below 36rem of chart width the column keeps only it; the name stays for assistive tech. |
| `scale` | `"day" \| "week" \| "month"` | — | Zoom, controlled: a column per day (months over days), per week (months over weeks) or per month (years over months). |
| `defaultScale` | `"day" \| "week" \| "month"` | `"week"` | Initial zoom, uncontrolled. |
| `onScaleChange` | `(scale: GanttScale) => void` | — | The zoom switch changed. The day in the middle of the view stays in the middle. |
| `range` | `{ start: Date; end: Date }` | — | The time axis, snapped to whole units. Default: every bar and today with room on both sides (a week of days, two weeks, a month), at least 35 days / 14 weeks / 12 months. |
| `today` | `Date` | `new Date()` | The day of the today line; the chart opens with it a third into the view and «Сегодня» scrolls back to it. |
| `locale` | `Locale` | `ru` | date-fns locale of the header, tooltips and spoken dates. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of rows, bars, header and toolbar controls: one-lane rows 28 · 32 · 44 · 48 · 52 px; a day is 32 · 40 · 48 px wide at `day`. |
| `readOnly` | `boolean` | `false` | No moving, resizing or creating; bars still select and show their dates. |
| `loading` | `boolean` | `false` | Without rows — skeleton rows in the chart's geometry and a status for screen readers; with rows they stay and the grid is `aria-busy`. |
| `empty` | `ReactNode` | — | Empty-state content when `rows` is empty; a string goes into a compact `EmptyPage`. Defaults to `labels.empty`. |
| `toolbar` | `ReactNode` | — | Content at the start of the toolbar (title, filters, a primary action); the zoom and «Сегодня» sit at its end. |
| `scrollHeight` | `number \| "fill"` | — | Max height of the viewport in px, so the header sticks while rows scroll; `"fill"` — the chart takes its flex / grid parent's height. |
| `onSelect` | `(bar: Bar, row: Row) => void` | — | A bar was activated (click, Enter, Space): open its record. A drag never selects. |
| `onBarChange` | `(dates: GanttDates, bar: Bar, row: Row) => void \| Promise<void>` | — | New dates of a bar after a drag or an editing key, in whole days at every zoom (whole weeks / months with Alt) — update your data with them. A drag follows the pointer exactly and snaps to days with a little hysteresis; a resize stops at one day and never flips. A returned Promise keeps the bar at the new dates and busy (spinner, `aria-busy`) until it settles; on reject it glides back and `labels.changeFailed` is announced. Without it bars cannot be edited. |
| `onBarCreate` | `(dates: GanttDates, row: Row) => void \| Promise<void>` | — | A new bar in a row: drawn across empty space in whole days (whole units of the zoom with Alt; a ghost with a dates and duration tooltip follows the pointer, Escape cancels), one unit of the zoom on a double-click or a touch long-press (a drag after the long press draws days), or `N` on a row header (at today) or a bar (right after it). Add it to your data. A returned Promise keeps a busy ghost in place until it settles: resolve — the bar you added stands where the ghost stood; reject — the ghost fades out and `labels.createFailed` is announced. Without it (and with `readOnly`) nothing can be created and empty space shows no create cursor. |
| `labels` | `Partial<GanttLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "onSelect">` | — | `aria-label` (the grid's name), `className` and the other div attributes. |

### GanttBar
One bar of `getRowBars`: data, not a part. Dates are calendar days; `end` is exclusive (a one-day task on 3 July ends on 4 July), so `start` equal to `end` is a milestone — a diamond on that day with the label beside it. Extend the type for your own fields: callbacks get your object back.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | Unique across the chart. |
| `start` | `Date` | — (required) | First day. |
| `end` | `Date` | — (required) | The day after the last one. |
| `label` | `string` | — (required) | Text inside the bar — beside it when the bar is too short (measured) — in the tooltip and in the accessible name. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"blue"` | Palette hue of a category (project, team, kind of absence). |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | — | Status color (done, at risk, overdue); wins over `color`. |
| `progress` | `number` | — | Share done, `0…1`: a stronger fill from the start of the bar; the percentage joins the tooltip and the name. |
| `readOnly` | `boolean` | `false` | This bar cannot be moved or resized (a public holiday, a closed phase). |

## Variants

### scale
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `day` | a column per day (40 px at `m`), months over day numbers, weekends shaded, today's number in accent | shifts, bookings, a sprint | |
| `week` | a day is 16 px, months over week ranges («6–12»), weekends shaded | a quarter of projects, team occupancy | yes |
| `month` | a day is 4 px, years over month names, no weekend wash | a yearly roadmap | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` · `s` | one-lane rows 28 / 32, bars 20 / 24, header tiers 24, a day 32 px at `day` | dense side panels, many rows | |
| `m` | rows 44, bars 28, header tiers 28, a day 40 px at `day` | page content | yes |
| `l` · `xl` | rows 48 / 52, bars 32 / 36, header tiers 32, a day 48 px at `day` | spacious screens, touch-first | |

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

### Flags
| Flag | Effect |
|---|---|
| `readOnly` | No moving or resizing anywhere; bars still select and show their tooltip. |
| `GanttBar.readOnly` | One bar stays put (a vacation, a holiday); no grips, no editing keys. |
| `loading` | Skeleton rows without data; with rows the grid is `aria-busy`. |

## States
| State | Driven by | DOM |
|---|---|---|
| zoom | `scale` / `defaultScale` | `data-scale` on the root; the grid cross-fades into the new zoom, the day in the middle stays in the middle |
| tier | `size` | `data-size` on the root |
| bar color | `color` / `tone` | `data-color` (without a tone) or `data-tone` on the bar |
| milestone | `start` equal to `end` | `data-milestone`: a diamond on its day, the label beside it |
| label beside | the label does not fit the bar (measured) | `data-label="outside"` |
| progress | `progress` | `data-progress`, `--progress` |
| editable | `onBarChange`, not `readOnly` | `data-editable`, grips at both ends, `aria-keyshortcuts`, `aria-describedby` → `labels.editHint` |
| dragging | a pointer drag | `data-dragging="move \| start \| end"`: the bar lifts and follows the pointer exactly; the dates snap to whole days (with Alt to the zoom's unit) with hysteresis, a faint accent guide marks the snapped edge at the week and month zoom, the tooltip shows the dates and the duration («5 – 18 октября · 14 дн.»); on release the bar glides to the snapped days |
| creating | drawing on empty space, `onBarCreate` pending or refused | a ghost bar in its future lane: accent outline with a dates tooltip while drawn (`data-state="drawing"`), a pulsing Skeleton while pending, fading out on reject (`leaving`) |
| pending | `onBarChange` returned a Promise | `data-pending`, `aria-busy`, a Spinner; reject → the bar glides back |
| loading | `loading` without rows | Skeleton rows with one or two bars each in a real bar's height, radius and lane, under the column and today lines; `aria-busy`, status `labels.loading`; data cross-fades in |
| empty | `rows` empty | a compact `EmptyPage` (`empty` or `labels.empty`), cross-faded in |
| scrolled | the axis hides content at an edge | `data-overflow-start` / `data-overflow-end`: an edge shadow from the pinned column / at the end |

## Layout & spacing
- The root is a surface one step off its host (Card radius, no border) and a size container; give it a width (it fills its parent).
- The first column is 12rem; below 48rem of chart width 10rem; below 36rem 6rem, or only the avatar with `renderRowAvatar`.
- Header: two quiet mono tiers. The upper tier (months as `MM.yyyy` — «09.2026» — or years at `month`) is the faintest text on the chart and has no lines: a period is told by its label, which starts at the period's first column (at `week`, the first ISO week: the one whose Thursday is in the month) and rides the start of the visible axis while the period is on screen. The lower tier has faint hairlines; the column that opens a new period gets a slightly stronger line, down through the rows too. The today line and the «Сегодня» flag lie over the labels; today's cell is an accent chip with the kit's chip radius (a single digit is a small rectangle, never a circle).
- The header (two tiers) and the first column stick inside the chart's own scroller; pass `scrollHeight` (or `"fill"` in a sized parent) so the header sticks while rows scroll. Below 480 px of screen height the header scrolls with the rows.
- Virtualization: rows render only in view (plus an overscan) at offsets computed from their lanes and corrected by measuring, so the total height and the scrollbar stay exact; header cells, period lines and bars render only inside the visible time window plus a screen on each side; weekends and day / week column lines are CSS patterns, not elements. A focused, dragged, pending or new bar stays rendered wherever the chart scrolls.
- Editing precision: a move, a resize and a drawing snap to whole days at every zoom (at the month zoom a day is 4 px, so the snap holds a day until the pointer clearly leaves it); hold Alt to snap to the zoom's week or month. A bar is at least one day long: a resize past the opposite edge stops there and never flips. On touch a long press picks a bar up, then it drags like a pointer.
- Creating: on empty space the cursor is a crosshair and, on pointer devices, the cell under it is washed with a «+». Drag across a row to draw a range in days, double-click (or long-press on touch) for one unit of the zoom; a drag after the long press draws days. Near the edges of the axis a drag, a resize and a drawing scroll the chart.
- The default axis covers every bar and today with a unit of room on both sides; pass `range` for a fixed period.
- The chart opens with today a third into the view; «Сегодня» and the arrow keys scroll only the chart's scroller, never the page.
- A row grows by a lane for every overlapping bar: lanes are packed greedily by start date.
- Dates are calendar days; `end` is exclusive, so a one-day task on 3 July is `{ start: 3 July, end: 4 July }`.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | The chart is one tab stop: the last active cell (a bar or a row header). |
| `←` · `→` | Along the row: its header, then its bars in time order. A row off screen is rendered and scrolled into view. |
| `↑` · `↓` | From a bar, the bar nearest in time in the row above / below (rows without bars are skipped); from a row header, the next row's header, empty rows too. |
| `Home` · `End` | First / last bar of the row; with Ctrl, of the chart. |
| `Enter` · `Space` | Selects the bar (`onSelect`). |
| `Shift + ←` · `Shift + →` | Moves the bar by one day, at every zoom. |
| `Shift + Alt + ←` · `Shift + Alt + →` | Moves the bar by the zoom's unit (a week, a month). |
| `Ctrl + Shift + ←` · `Ctrl + Shift + →` | Shortens / lengthens the bar by one day (⌘ on macOS); it stops at one day. |
| `Ctrl + Shift + Alt + ←` · `Ctrl + Shift + Alt + →` | Shortens / lengthens the bar by the zoom's unit. |
| `N` | Creates a one-unit bar (`onBarCreate`): at today on a row header, right after the bar on a bar. |
| `Escape` | Cancels a drag or the drawing of a new bar; closes the tooltip. |

### ARIA
- A `role="grid"` named by `aria-label`: a header row of `columnheader`s (the first column and the time axis named `labels.timeline`), then a row per record with a `rowheader` (the row name) and a `gridcell` holding its bars. A grid because the bars are navigated in two dimensions: moving between rows, a screen reader announces the row.
- A bar is a `<button>` named «Задача: 6 июля 2026 — 10 июля 2026» (with «выполнено 50%» when it has progress); a milestone «Релиз: 20 июля 2026». The Tooltip with the dates opens on hover and on focus and closes as soon as the chart scrolls (scrollbar, wheel, touch); the next hover or focus opens it again. It points at the visible part of the bar and stays inside the timeline, never over the label column or the header; a bar with less than `--prime-space-6` in view shows none.
- An editable bar has `aria-keyshortcuts` and is described by `labels.editHint`; the new dates after an editing key are announced in a polite status, a refused change with `labels.changeFailed`.
- While `onBarChange` runs the bar and the grid are `aria-busy`. Loading without rows hides the skeletons and announces `labels.loading`.
- The axis tiers, weekends and the today line are `aria-hidden`: the dates live in the bar names.
- A row header is a focusable cell; with `onBarCreate` it is described by `labels.createHint` and has `aria-keyshortcuts="N"`. A new bar is announced, a refused one with `labels.createFailed`; the ghost is `aria-hidden`.
- Rows are virtualized: only the rows in view are in the DOM, while `aria-rowcount` on the grid and `aria-rowindex` on each row keep the full count.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `rowsHeader` | `"Название"` | Heading of the first column. |
| `timeline` | `"Шкала времени"` | Accessible name of the time axis column. |
| `scale` | `"Масштаб"` | Accessible name of the zoom switch. |
| `day` | `"День"` | Zoom segment: days. |
| `week` | `"Неделя"` | Zoom segment: weeks. |
| `month` | `"Месяц"` | Zoom segment: months. |
| `today` | `"Сегодня"` | The button that scrolls to today and the chip on the today line. |
| `bar` | `"{label}: {start} — {end}"` | Accessible name of a bar; `{start}` and `{end}` are its first and last day, spoken in full. |
| `milestone` | `"{label}: {date}"` | Accessible name of a milestone. |
| `progress` | `"выполнено {progress}%"` | Added to a bar's name when it has `progress`. |
| `editHint` | `"Shift + стрелки сдвигают на день, Ctrl + Shift + стрелки меняют окончание на день; с Alt — на неделю или месяц масштаба"` | Description of an editable bar: the editing keys. |
| `duration` | `"{days} дн."` | Duration of a bar in its tooltip («5 – 18 октября · 14 дн.»). |
| `changeFailed` | `"Сроки не изменены: {label}"` | Announced when `onBarChange` rejects and the bar returns to its dates. |
| `newBar` | `"Новая задача"` | Label of the ghost of a bar being created and of its announcement. |
| `createHint` | `"N — создать задачу"` | Description of a row header when bars can be created. |
| `createFailed` | `"Задача не создана"` | Announced when `onBarCreate` rejects and the ghost fades out. |
| `loading` | `"Загрузка графика…"` | Screen-reader status while skeleton rows are shown. |
| `empty` | `"Нет задач за этот период."` | Default empty-state text. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A project plan: work streams with phases, progress and a launch milestone that move and stretch by pointer or keyboard — `getRowBars`, `onBarChange`. |
| [variants.tsx](examples/variants.tsx) | Bars colored by category with palette hues, and by status with tones that win over the hue — `color`, `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier: one-lane rows from 28 to 52 px, bars, header and toolbar controls of the tier — `size`. |
| [occupancy.tsx](examples/occupancy.tsx) | Team occupancy by day: people with avatars, projects that overlap into lanes, locked vacations, a saved move held busy and a conflicting one gliding back, new work drawn on a free day — `renderRowAvatar`, `renderRow`, `onBarChange`, `onBarCreate`, `onSelect`, `readOnly`. |
| [large.tsx](examples/large.tsx) | Two thousand people over two years stay fast: only the rows and days in view are rendered, keyboard focus reaches any row, and new bars are drawn on empty space — `rows`, `range`, `scrollHeight`, `onBarCreate`. |
| [states.tsx](examples/states.tsx) | Skeleton rows in the chart's geometry while it loads, an empty period and a plan you may only look at — `loading`, `empty`, `readOnly`. |
| [controlled.tsx](examples/controlled.tsx) | The zoom owned by the page: presets in the toolbar and the built-in switch change one state — `scale`, `onScaleChange`. |
| [narrow.tsx](examples/narrow.tsx) | At 360 px the first column keeps only the avatars, the toolbar moves to its own row and the axis scrolls under the pinned column — `renderRowAvatar`. |

## Mistakes
- Updating the rows before the request succeeds (optimistic) → the chart cannot glide back on reject; update them when `onBarChange` resolves, or before you resolve it.
- An inclusive `end` (`{ start: 3 July, end: 3 July }` for a one-day task) → that is a milestone; `end` is the day after the last one.
- Status only by bar color → put it into the label too («Отпуск», «Просрочено»).
- Dates with times expecting hour precision → the chart works in calendar days.
- A `<div onClick>` inside `renderRow` to open a bar's record → use `onSelect`; the row header is not interactive.
- Wrapping the chart in a Card → it is a surface itself; place it directly in the page or a Card body only as the card's one content.
- Expecting the page to scroll to today → «Сегодня» scrolls only the chart.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), [Button](../button/COMPONENT.md), [Skeleton](../skeleton/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Spinner](../spinner/COMPONENT.md), Icon (`action.add` in the create cue)
- **See also:** [Timeline](../timeline/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Kanban](../kanban/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md), [Avatar](../avatar/COMPONENT.md)

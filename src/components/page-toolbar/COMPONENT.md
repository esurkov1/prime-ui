# PageToolbar

**Category:** page
**Kind:** layout

> The panel at the top of a page — sections, filter and search, view options and the primary action — laid out from its own width: one row when wide, stacked rows when narrow, search and filter always first with the active filters under the top row.

## When to use
- A list, registry or dashboard page whose top holds several of: sections with counts, a filter and search, a period or view switch, the primary action.
- A settings page with sections and a «Сохранить N изменений» action that must stay reachable on a phone.
- Any page that has to work from 320px with the same controls as on desktop — nothing is hidden, the slots only move.

## When not to use
- One or two buttons of the page and nothing else → `AppHeader.Actions` in the [AppHeader](../../layout/app-header/COMPONENT.md) title row.
- Tools that belong to one table → the DataTable `toolbar` slot.
- Switching panels inside a card or a section → [Tabs](../tabs/COMPONENT.md).
- App-level navigation → [Sidebar](../../layout/sidebar/COMPONENT.md).

## Import
```tsx
import { PageToolbar } from "prime-ui-kit";
```

## Anatomy
```
PageToolbar.Root                 container: its own width picks the layout
├─ PageToolbar.Tools             search + filter button: SmartFilter.Toolbar — always first
├─ PageToolbar.Sections          sections of the page: a fullWidth SegmentedControl with counts
├─ PageToolbar.View              period, table / cards, columns
├─ PageToolbar.Actions           the primary action (and its secondary twin, e.g. «Отменить»)
└─ PageToolbar.Chips             active filters: SmartFilter.Chips, a row under the top row
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### PageToolbar.Root
`ref` → `HTMLDivElement`. The page panel: one row from 56rem of its own width, stacked rows below. Any slot may be left out; whatever the JSX order, the DOM and Tab order is Tools, Sections, View, Actions, Chips. Named (`aria-label`), it is a `group`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.Sections
`ref` → `HTMLDivElement`. Sections of the page — a `fullWidth` SegmentedControl with counts; scrolls inside when it does not fit.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.Tools
`ref` → `HTMLDivElement`. Search and filter button (`SmartFilter.Toolbar`): always the first slot and the stretchy one; it gives way first when the row runs short.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.View
`ref` → `HTMLDivElement`. How the data is shown: period, table / cards, columns. Sized by content when wide; its own full row when narrow, its controls sharing it equally.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.Actions
`ref` → `HTMLDivElement`. The primary action of the page: at the end of the top row; on a phone, when the search would get less than 18rem beside it, its own full row right under the search.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.Chips
`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) in their own row under the top row; the row takes no space while it is empty.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

## Variants
PageToolbar has no variants: the layout follows the toolbar's width.

### Layout by width
| Toolbar width | Looks like | Default |
|---|---|---|
| `≥ 56rem` | one row that never wraps: Tools (stretch) · Sections (content width) · View (content width) · Actions; Chips under it; short of room the Tools give way first, down to 12rem, so the Sections keep their items and counts whole; only then the Sections shrink and scroll inside | |
| `< 56rem` | rows: Tools (stretch) + Actions; Chips; Sections (full row); View (full row) | yes (mobile first) |
| phone (Tools would get < 18rem beside the Actions) | rows: Tools (full row); Actions (full row, its buttons share it); Chips; Sections; View — the search is never squeezed; an icon-only action still fits beside the Tools | |
| any | Chips under the top row, only while there are chips | |

## States
| State | Driven by | DOM |
|---|---|---|
| wide | container ≥ 56rem | one flex row, no wrapping; Chips rendered under the bar |
| narrow | container < 56rem | one wrapping flex line of real rows only (`order` + full-row slots): a missing slot makes no row, every row is 12 from the next |
| action on its own row | narrow, and the Tools (or the Sections in their place) would get less than 18rem beside the Actions | the Actions wrap under them and stretch across the row; an Actions slot alone in the toolbar keeps its buttons at the end |
| no Tools | Sections without Tools; View without Tools and Sections | that slot takes the Tools' place: first and stretchy, beside the action, so the action stays at the top row's end |
| alone in a row | Tools or Sections without Actions; View when narrow | that slot stretches to the full row; the View's controls share it equally and may shrink below their content (`min-width: 0`), so the row fits a phone |
| no chips | `PageToolbar.Chips` empty (`SmartFilter.Chips` renders nothing) | the chips row takes no space |

## Layout & spacing
- 8 inside a slot. No padding or fill of its own: on an app page it is the page's tools row in `AppHeader.Tools`, under the page title; tools of one table go into that table's `toolbar`.
- The order is fixed: search and filter first, then the sections, the view and the primary action; the active filters sit under the top row, never under the sections. The primary action is at the end of the top row; on a phone, where the search would get less than 18rem beside it, it takes its own row right under the search — still above the sections and the view.
- Every gap is one step: 12 between slots and between every pair of rows, at any width — no row is ever further from the next.
- Sections take a `fullWidth` SegmentedControl: the toolbar decides when it stretches (content width when wide, the full row when narrow), its items tend to equal width and it scrolls inside itself when they do not fit.
- All controls share one tier, so they share one height and wrapped rows stay level: leave `size` off the controls (default `m`); for a denser page wrap the toolbar in `<ControlSizeProvider value="s">`.
- On a phone the primary action takes its own row by itself; an icon-only action with `aria-label` stays beside the search instead. Never remove it.
- The toolbar breaks by its own width, so it behaves the same with the sidebar open or closed.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- With an `aria-label` the root is `role="group"` named by it: when a page has more than one panel, name each.
- The root renders the slots in the wide layout's reading order — Tools, Sections, View, Actions, Chips — whatever the JSX order; the narrow layout moves them only visually (`order`).
- An icon-only primary action carries `aria-label`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The panel of an orders page: search and filter, sections with counts, the period and the primary action in one row; active filters under the top row — `PageToolbar.Tools`, `PageToolbar.Sections`, `PageToolbar.View`, `PageToolbar.Actions`, `PageToolbar.Chips`. |
| [without-search.tsx](examples/without-search.tsx) | A dashboard panel without search on a tablet-width column: the sections fill the top row, the period selector alone in the bottom row stretches to the full width — `PageToolbar.Sections`, `PageToolbar.View`. |
| [save-changes.tsx](examples/save-changes.tsx) | A settings page: sections of the form on the left, the save action with the number of changes at the end of the top row — never a sticky bar at the bottom of a phone screen — `PageToolbar.Actions`. |
| [narrow.tsx](examples/narrow.tsx) | A phone-width column: search and filter on top, the primary action on its own row under them, then the active filters, the sections and the period, every row 12 apart — `PageToolbar.Root`. |

## Mistakes
- A hand-built flex row of tabs, search and buttons with `flex-wrap` → rows wrap «as they come», the action drifts down; use `PageToolbar`.
- `size="s"` on one control inside → a step in the row; one tier for all, through `ControlSizeProvider` around the toolbar.
- A SegmentedControl without `fullWidth` in Sections → it never stretches on narrow widths.
- Stat cards above a table for the section totals → counts inside the sections (`SegmentedControl.Count`).
- Hiding the search or the action on phones → they move, they never disappear.
- A sticky «Сохранить» bar at the bottom of a phone → the save action with its count in `PageToolbar.Actions`.

## Related
- **Built from:** —
- **See also:** [SegmentedControl](../segmented-control/COMPONENT.md), [SmartFilter](../smart-filter/COMPONENT.md), [PageContent](../page-content/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Select](../select/COMPONENT.md)

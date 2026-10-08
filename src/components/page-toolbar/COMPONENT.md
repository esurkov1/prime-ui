# PageToolbar

**Category:** layout
**Kind:** layout

> The panel at the top of a page — sections, filter and search, view options and the primary action — laid out from its own width: one row when wide, exactly two rows when narrow, every slot in a fixed place.

## When to use
- A list, registry or dashboard page whose top holds several of: sections with counts, a filter and search, a period or view switch, the primary action.
- A settings page with sections and a «Сохранить N изменений» action that must stay reachable on a phone.
- Any page that has to work from 320px with the same controls as on desktop — nothing is hidden, the slots only move.

## When not to use
- A page with a title, a description and one or two buttons → [PageContent](../page-content/COMPONENT.md) `Header` with `Actions`.
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
├─ PageToolbar.Sections          sections of the page: a fullWidth SegmentedControl with counts
├─ PageToolbar.Tools             filter button + search: SmartFilter.Toolbar
├─ PageToolbar.View              period, table / cards, columns
├─ PageToolbar.Actions           the primary action (and its secondary twin, e.g. «Отменить»)
├─ PageToolbar.Chips             active filters: SmartFilter.Chips, a row under the panel
└─ break                         hidden line break of the two-row layout (rendered by Root)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### PageToolbar.Root
`ref` → `HTMLDivElement`. The page panel: lays its slots out from its own width — one row from a 56rem container, exactly two rows below it. Parts may be left out; JSX order is the Tab order.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.Sections
`ref` → `HTMLDivElement`. Sections of the page — a `fullWidth` SegmentedControl with counts. Top row; sized by content when wide, stretches when narrow and scrolls inside when it does not fit.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.Tools
`ref` → `HTMLDivElement`. Filter button and search (`SmartFilter.Toolbar`): the stretchy item of its row, shrinks to 9rem before anything wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.View
`ref` → `HTMLDivElement`. How the data is shown: period, table / cards, columns. Sized by content next to the Tools; alone in its row it stretches and its controls share the row equally.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.Actions
`ref` → `HTMLDivElement`. The primary action of the page: at the end of the top row at every width, never wraps down.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageToolbar.Chips
`ref` → `HTMLDivElement`. Active filters (`SmartFilter.Chips`) in their own row under the panel; the row takes no space while it is empty.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

## Variants
PageToolbar has no variants: the layout follows the toolbar's width.

### Layout by width
| Toolbar width | Looks like | Default |
|---|---|---|
| `≥ 56rem` | one row: Sections (content width) · Tools (stretch) · View (content width) · Actions | |
| `< 56rem` | two rows: Sections (stretch) + Actions on top; Tools (stretch) + View below | yes (mobile first) |
| any | Chips in their own row under the panel, only while there are chips | |

## States
| State | Driven by | DOM |
|---|---|---|
| wide | container ≥ 56rem | one row, break hidden |
| narrow | container < 56rem | `order` moves Actions to the top row, the break forces the second row |
| one row empty | a row has no slot | break hidden, no empty gap |
| alone in a row | Sections without Actions, Tools without View, View without Tools | that slot stretches to the full row; the View's controls share it equally |
| tight bottom row | Tools would go under 9rem | the View wraps whole onto its own row and stretches there |
| no chips | `PageToolbar.Chips` empty (`SmartFilter.Chips` renders nothing) | the chips row takes no space |

## Layout & spacing
- 12 between slots and between rows, 8 inside a slot. No padding or fill of its own: it sits at the top of `PageContent.Body` (or replaces `PageContent.Header` on dense pages that keep their `h1` in the shell).
- One stretchy item per row: Sections on top, Tools below. The primary action is at the end of the top row at every width and never wraps down; with no sections it is still pushed to the end.
- Sections take a `fullWidth` SegmentedControl: the toolbar decides when it stretches (content width when wide, the full row when narrow), its items tend to equal width and it scrolls inside itself when they do not fit.
- All controls share one tier, so they share one height and wrapped rows stay level: leave `size` off the controls (default `m`); for a denser page wrap the toolbar in `<ControlSizeProvider value="s">`.
- On a phone the primary action may drop its text and keep the icon with `aria-label`; never remove it.
- The toolbar breaks by its own width, so it behaves the same with the sidebar open or closed.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- A plain `<div>`: name it with `aria-label` when a page has more than one panel.
- Slots move only visually (`order`); the Tab order is the JSX order. Write the slots in the reading order of the wide layout — Sections, Tools, View, Actions, Chips. In the narrow layout the action is shown before the tools but reached after them.
- An icon-only primary action on a narrow page carries `aria-label`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The panel of an orders page: sections with counts, filter and search, the period and the primary action in one row; active filters in a row under it — `PageToolbar.Sections`, `PageToolbar.Tools`, `PageToolbar.View`, `PageToolbar.Actions`, `PageToolbar.Chips`. |
| [without-search.tsx](examples/without-search.tsx) | A dashboard panel without search on a tablet-width column: the sections fill the top row, the period selector alone in the bottom row stretches to the full width — `PageToolbar.Sections`, `PageToolbar.View`. |
| [save-changes.tsx](examples/save-changes.tsx) | A settings page: sections of the form on the left, the save action with the number of changes at the end of the top row — never a sticky bar at the bottom of a phone screen — `PageToolbar.Actions`. |
| [narrow.tsx](examples/narrow.tsx) | A phone-width column: exactly two rows — sections and the primary action on top, filter, search and the period below; each row has one stretchy item — `PageToolbar.Root`. |

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

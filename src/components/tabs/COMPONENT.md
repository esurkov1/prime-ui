# Tabs

**Category:** navigation
**Kind:** navigation

> Tabs for navigating between content panels of one screen.

## When to use
- Splitting one screen into sections that are viewed one at a time (Overview / Orders / Reviews).
- Settings pages with a side list of sections (`orientation="vertical"`).
- Dashboard sections that need a counter or a one-line summary per tab (`Tabs.Count`, `Tabs.Description`).

## When not to use
- Choosing a value or a mode (period, list view, filter) → use [SegmentedControl](../segmented-control/COMPONENT.md).
- Toolbar toggles or joined actions → use [ButtonGroup](../button-group/COMPONENT.md).
- Collapsible sections that can be open together → use [Accordion](../accordion/COMPONENT.md).
- Steps of a sequential process → use [Stepper](../stepper/COMPONENT.md).
- App-level navigation between pages → use [Sidebar](../../layout/sidebar/COMPONENT.md).

## Import
```tsx
import { Tabs } from "prime-ui-kit";
```

## Anatomy
```
Tabs.Root                 value, size, orientation; lays out the list and the panel
├─ Tabs.List              role="tablist" on a ScrollContainer, sliding indicator; scrolls, never wraps
│  └─ Tabs.Item           one tab (role="tab"); plain text or parts:
│     ├─ Tabs.Icon        decorative icon
│     ├─ Tabs.Label       title; truncates, keeps its width when it turns medium weight
│     ├─ Tabs.Count       counter Badge, one tier below the tabs size
│     └─ Tabs.Description muted second line; makes the tab two-line
└─ Tabs.Panel             role="tabpanel", rendered only while its tab is active
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Tabs.Root
`ref` → `HTMLDivElement`. `<div>` that owns the active value, size and orientation and lays out the list and the panel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Active tab (controlled). |
| `defaultValue` | `string` | `""` | Initial active tab (uncontrolled). With `""` no tab is selected. |
| `onValueChange` | `(value: string) => void` | — | Called with the new active value. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | List direction and arrow keys. A vertical list stacks above the panel when the container is narrower than 600px. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Control tier: tab height 28 · 32 · 36 · 40 · 48, text, icon, radius, spacing, indicator thickness. |
| `children` | `ReactNode` | — | `Tabs.List` and `Tabs.Panel`s. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">` | — | `className` and the other div attributes. |

### Tabs.List
`ref` → `HTMLDivElement`. `role="tablist"` on a `ScrollContainer` (horizontal, edge fade, hidden scrollbar) with the sliding indicator; scrolls instead of wrapping.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | `Tabs.Item`s. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `aria-label` (name the list), `className` and the other div attributes; `role`, `aria-orientation` and `onKeyDown` are set by the list. |

### Tabs.Item
`ref` → `HTMLButtonElement`. One tab, a `<button role="tab">`; plain text children are wrapped in `Tabs.Label`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Value that selects this tab and its panel. |
| `disabled` | `boolean` | `false` | Disables the tab; clicks and arrow keys skip it. |
| `children` | `ReactNode` | — (required) | Plain text, or `Tabs.Icon` / `Tabs.Label` / `Tabs.Count` / `Tabs.Description`. A description makes the tab two-line. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" \| "type" \| "role" \| "onClick">` | — | `className`, `aria-*` and the other button attributes. |

### Tabs.Icon
`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`) before the label; muted, accent on the active tab.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="field.calendar" />`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Tabs.Label
`ref` → `HTMLSpanElement`. Title; truncates and keeps a stable width when it turns medium weight.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Title text. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Tabs.Count
`ref` → `HTMLSpanElement`. Counter `Badge` after the label, one tier below the tabs size.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Badge hue. |
| `children` | `ReactNode` | — (required) | The number. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Tabs.Description
`ref` → `HTMLSpanElement`. Muted second line; becomes the tab's `aria-describedby`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Second-line text; wrap a key value in `<strong>`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Tabs.Panel
`ref` → `HTMLDivElement`. `<div role="tabpanel">`, focusable, rendered only while its tab is active.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Tab value this panel belongs to. |
| `children` | `ReactNode` | — | Panel content. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

## Variants
Tabs have no `variant`: navigation tabs are always underline (horizontal) or pill (vertical).

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `horizontal` | regular-weight secondary text over a `border-subtle` hairline; the active tab is primary text, medium weight, with an accent bar under its text that slides between tabs (thickness by `size`) | switching sections above the content | yes |
| `vertical` | items padded like controls, no rail; active item is a `fill-muted` pill with a short accent mark at the start; hover `fill-subtle`; below a 600px container it becomes a scrolling row above the panel | settings pages with a side list of sections | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px tabs, 12/16 text, gap between tabs 12, indicator 2px | dense panels | |
| `s` | 32px, 13/20, gap 16, indicator 2.5px | compact cards | |
| `m` | 36px, 14/20, gap 20, indicator 3px | default | yes |
| `l` | 40px, 16/24, gap 24, indicator 3.5px | page-level sections | |
| `xl` | 48px, 16/24, gap 32, indicator 4px | hero / landing sections | |

The indicator is half the tier track thickness `--prime-control-<tier>-track` — the line of ProgressBar and Slider. Tab height equals the control height: Tabs line up with Button, Input and SegmentedControl of the same `size`.

### Item content
| Value | Looks like | Use when | Default |
|---|---|---|---|
| text | label only | most tabs | yes |
| `Tabs.Icon` + `Tabs.Label` | muted icon before the label; the active tab's leading icon turns accent | sections with recognizable icons | |
| `Tabs.Count` | soft badge after the label, tabular numbers | showing how many items a section has | |
| `Tabs.Description` (two-line) | label (+ count) on line 1, `body-s` muted text on line 2; `<strong>` is primary / medium | dashboards with a summary per section | |

Avoid icons or descriptions on only some tabs (uneven rows) and Tabs used as a filter — use SegmentedControl.

## States
| State | Driven by | DOM |
|---|---|---|
| active | `value` / `defaultValue` | item `aria-selected="true"`, `data-state="active"`, `tabIndex=0`; others `data-state="inactive"`, `tabIndex=-1` |
| hover | pointer | text → primary (vertical: `fill-subtle` background) |
| focus-visible | keyboard | focus ring inside the tab (`--prime-focus-offset-inset`); the panel shows the outer ring |
| disabled | `disabled` on Item | native `disabled`, `data-disabled="true"`, `text-disabled` |
| two-line | `Tabs.Description` child | `data-two-line="true"` |
| overflow | list wider than its container | `data-overflow-start` / `data-overflow-end` on the list (ScrollContainer), faded edges; the active tab scrolls into view |

Other attributes: Root `data-orientation`, `data-size`; List `data-indicator="bar" | "pill"`; Item `data-value`; Label `data-text`. Inactive panels are unmounted.

## Layout & spacing
- List → panel: `var(--prime-space-4)`; vertical list → panel: `var(--prime-space-6)`.
- The list never wraps; it scrolls horizontally with faded edges. Give the list's container a width (`min-width: 0` on flex children).
- A vertical Tabs.Root is a size container: give it a width (it measures itself to switch to a row).
- In a vertical layout align the panel heading with the first tab by making the heading row one control tall (`min-height: var(--prime-control-m-height)`).

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `ArrowLeft` · `ArrowRight` | Select the neighbouring tab, wrapping and skipping disabled ones; also work in a vertical list. |
| `ArrowUp` · `ArrowDown` | The same in a vertical list. |
| `Home` · `End` | First and last enabled tab. |
| `Tab` | Enters the active tab (roving tabindex), then moves to the panel. |

### ARIA
- WAI-ARIA tabs pattern: `tablist` / `tab` / `tabpanel` with `aria-controls` / `aria-labelledby` wired automatically; give `Tabs.List` an `aria-label`.
- Selection follows focus; the panel is focusable (`tabIndex=0`).
- In a two-line tab the accessible name is label (+ count); `Tabs.Description` becomes `aria-describedby`.
- `Tabs.Icon` is `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Sections of one screen; the accent bar slides to the active tab — `defaultValue`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; the tab height equals the control height of the same tier — `size`. |
| [states.tsx](examples/states.tsx) | A disabled tab that clicks and arrow keys skip — `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | A muted icon before the label; the active tab's icon turns accent — `Tabs.Icon`, `Tabs.Label`. |
| [orientation.tsx](examples/orientation.tsx) | Tabs over the panel and a side list of sections that stacks on top below 600px — `orientation`. |
| [overflow.tsx](examples/overflow.tsx) | More tabs than fit a phone-width column: the list scrolls with faded edges and keeps the active tab in view. |
| [two-line.tsx](examples/two-line.tsx) | A label and a counter on the first line, a summary on the second — `Tabs.Count`, `Tabs.Description`. |
| [controlled.tsx](examples/controlled.tsx) | The active tab lives in parent state, e.g. synced with the URL — `value`, `onValueChange`. |

## Mistakes
- `<Tabs.Root>` without `defaultValue` / `value` → no tab is active; pass the first tab's value.
- `variant="pills"` / `variant="underline"` → Tabs have no variant; use `orientation`, or SegmentedControl for a pill switch.
- Using Tabs to filter a list → use SegmentedControl.
- `onClick` on `Tabs.Item` → use `onValueChange` on Root.
- `Tabs.List` without `aria-label` → add one.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md), [Badge](../badge/COMPONENT.md)
- **See also:** [SegmentedControl](../segmented-control/COMPONENT.md), [ButtonGroup](../button-group/COMPONENT.md), [Accordion](../accordion/COMPONENT.md)

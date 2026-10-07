# Tabs

**Category:** navigation (Навигация)

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
- `Tabs.Root` — state, size and orientation; lays out the list and the panel.
  - `Tabs.List` — `role="tablist"` with the sliding indicator; scrolls instead of wrapping.
    - `Tabs.Trigger` — one tab (`role="tab"`). Plain text, or parts:
      - `Tabs.Icon` — decorative icon.
      - `Tabs.Label` — title; truncates, keeps a stable width when it becomes medium weight.
      - `Tabs.Count` — counter badge, one tier below the tabs size.
      - `Tabs.Description` — muted second line; makes the trigger two-line.
  - `Tabs.Panel` — `role="tabpanel"`, rendered only while its tab is active.

## API
No part forwards a ref.

### Tabs.Root
+ native `<div>` props (except `defaultValue`, `children`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Active tab (controlled). |
| `defaultValue` | `string` | `""` | Initial active tab (uncontrolled). With `""` no tab is selected. |
| `onValueChange` | `(value: string) => void` | — | Called when the active tab changes. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | List direction and arrow keys. A vertical list stacks above the panel when the container is narrower than 600px. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Control tier: tab height, text, icon, radius, spacing. |
| `children` | `ReactNode` | — (required) | `Tabs.List` and `Tabs.Panel`s. |
| `className` | `string` | — | Extra class on the root. |

### Tabs.List
+ native `<div>` props (pass `aria-label`) except `role`, `aria-orientation`, `onKeyDown`, `onScroll` — they are set after the spread and override yours.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | `Tabs.Trigger`s. |
| `className` | `string` | — | Extra class. |

### Tabs.Trigger
+ native `<button>` props except `value`, `children`, `type`, `role`, `onClick`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Value that selects this tab and its panel. |
| `disabled` | `boolean` | `false` | Disables the tab; arrow keys skip it. |
| `children` | `ReactNode` | — (required) | Plain text (auto-wrapped in `Tabs.Label`) or `Tabs.Icon` / `Tabs.Label` / `Tabs.Count` / `Tabs.Description`. |
| `className` | `string` | — | Extra class. |

### Tabs.Icon, Tabs.Label, Tabs.Description
+ native `<span>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Icon SVG / title text / second-line text (wrap a key value in `<strong>`). |
| `className` | `string` | — | Extra class. |

### Tabs.Count
No native props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Badge hue. |
| `children` | `ReactNode` | — (required) | The number. |
| `className` | `string` | — | Extra class. |

### Tabs.Panel
+ native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Tab value this panel belongs to. |
| `children` | `ReactNode` | — (required) | Panel content. |
| `className` | `string` | — | Extra class. |

## Variants
Tabs have no `variant`: navigation tabs are always underline (horizontal) or pill (vertical).

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `horizontal` | regular-weight secondary text over a `border-subtle` hairline; the active tab is primary text, medium weight, with a 2px accent bar under its text that slides between tabs | switching sections above the content | yes |
| `vertical` | items padded like controls, no rail; active item is a `fill-muted` pill with a short accent mark at the start; hover `fill-subtle`; below a 600px container it becomes a scrolling row above the panel | settings pages with a side list of sections | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px tabs, 12/16 text, gap between tabs 12 | dense panels | |
| `s` | 32px, 13/20, gap 16 | compact cards | |
| `m` | 36px, 14/20, gap 20 | default | yes |
| `l` | 40px, 16/24, gap 24 | page-level sections | |
| `xl` | 48px, 16/24, gap 32 | hero / landing sections | |

Tab height equals the control height: Tabs line up with Button, Input and SegmentedControl of the same `size`.

### Trigger content
| Value | Looks like | Use when | Default |
|---|---|---|---|
| text | label only | most tabs | yes |
| `Tabs.Icon` + `Tabs.Label` | muted icon before the label; the active tab's leading icon turns accent | sections with recognizable icons | |
| `Tabs.Count` | soft badge after the label, one badge tier below the tabs size, tabular numbers | showing how many items a section has | |
| `Tabs.Description` (two-line) | label (+ count) on line 1, `body-s` muted text on line 2; tab height grows; `<strong>` is primary/medium | dashboards with a summary per section | |

**Combinations**
- Recommended: `Tabs.Count color="blue"` on the active tab and `gray` on others (see `controlled.tsx`); per-section hues in two-line dashboards.
- Avoid: icons on only some tabs; a `Tabs.Description` on only some tabs (rows of uneven height); Tabs used as a filter — use SegmentedControl.

## States
| State | Driven by | DOM |
|---|---|---|
| active | `value` / `defaultValue` | trigger `aria-selected="true"`, `data-state="active"`, `tabIndex=0`; others `data-state="inactive"`, `tabIndex=-1` |
| hover | pointer | text → primary (vertical: `fill-subtle` background) |
| focus-visible | keyboard | focus ring inside the tab (`--prime-focus-offset-inset`); panel shows the outer ring |
| disabled | `disabled` on Trigger | native `disabled`, `data-disabled="true"`, `text-disabled` |
| two-line | `Tabs.Description` child | `data-two-line="true"` |
| overflow | list wider than its container | `data-overflow-start` / `data-overflow-end="true"` on the list, faded edges; the active tab scrolls into view |

Other attributes: Root `data-orientation`, `data-size`; List `data-indicator="bar" | "pill"`; Trigger `data-value`; Label `data-text`. Controlled: `value` + `onValueChange`; uncontrolled: `defaultValue`. Inactive panels are unmounted.

## Layout & spacing
- List → panel: `var(--prime-space-4)`; vertical list → panel: `var(--prime-space-6)`.
- The list never wraps; it scrolls horizontally with faded edges. Give the list's container a width (`min-width: 0` on flex children).
- In a vertical layout align the panel heading with the first tab by making the heading row one control tall (`min-height: var(--prime-control-m-height)`).

## Accessibility
- WAI-ARIA tabs pattern: `tablist` / `tab` / `tabpanel` with `aria-controls` / `aria-labelledby` wired automatically; give `Tabs.List` an `aria-label`.
- Keyboard: horizontal ← →, vertical ↑ ↓ (← → also work), Home / End; selection follows focus and wraps; disabled tabs are skipped. Roving tabindex — Tab enters the active tab, then moves to the panel (`tabIndex=0`).
- In a two-line tab the accessible name is label (+ count); `Tabs.Description` becomes `aria-describedby`.
- `Tabs.Icon` is `aria-hidden`. No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [horizontal.tsx](examples/horizontal.tsx) | Underline tabs with panels | switching panels of one screen |
| [sizes.tsx](examples/sizes.tsx) | Every size next to a Button of the same size | aligning tabs with controls |
| [states.tsx](examples/states.tsx) | Icons, disabled tab, overflow at phone width | icons, unavailable sections, narrow screens |
| [controlled.tsx](examples/controlled.tsx) | `value` + `onValueChange` with `Tabs.Count` | tab in app state / URL |
| [two-line.tsx](examples/two-line.tsx) | Label + Count + Description | dashboards with per-section summary |
| [vertical.tsx](examples/vertical.tsx) | Vertical settings tabs in a card | settings pages |

```tsx
import { Tabs } from "prime-ui-kit";

export function ShopTabs() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Магазин">
        <Tabs.Trigger value="overview">Обзор</Tabs.Trigger>
        <Tabs.Trigger value="orders">Заказы</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="overview">Сводка по магазину.</Tabs.Panel>
      <Tabs.Panel value="orders">Последние заказы.</Tabs.Panel>
    </Tabs.Root>
  );
}
```

## Mistakes
- `<Tabs.Root>` without `defaultValue`/`value` → no tab is active; pass the first tab's value.
- `variant="pills"` / `variant="underline"` → Tabs have no variant; use `orientation`, or SegmentedControl for a pill switch.
- Using Tabs to filter a list → use SegmentedControl.
- `onClick` on `Tabs.Trigger` → use `onValueChange` on Root.
- `Tabs.List` without `aria-label` → add one.

## Related
- [SegmentedControl](../segmented-control/COMPONENT.md)
- [ButtonGroup](../button-group/COMPONENT.md)
- [Accordion](../accordion/COMPONENT.md)
- [Badge](../badge/COMPONENT.md)

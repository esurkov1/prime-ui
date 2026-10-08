# Tabs

**Category:** navigation
**Kind:** navigation

> Folder tabs for navigating between content panels of one screen: the active tab rises out of the panel.

## When to use
- Splitting one screen into sections that are viewed one at a time (Overview / Orders / Reviews).
- Settings pages with a side list of sections (`orientation="vertical"`).
- Dashboard sections that need a counter or a one-line summary per tab (`Tabs.Count`, `Tabs.Description`).
- Section bars that must survive narrow containers: with an icon on every tab they collapse to icons with tooltips.
- Open documents or records the user switches between and closes, like browser tabs (`onRemove`, `minItemWidth`, `maxItemWidth`).

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
Tabs.Root                 value, size, orientation, tone, fullWidth, min/maxItemWidth; horizontal: the frame
├─ Tabs.List              role="tablist" on a ScrollContainer, sliding folder / pill; collapses, then scrolls
│  ├─ Tabs.Item           one tab (role="tab") in an item wrapper; onRemove adds a close button; parts:
│  │  ├─ Tabs.Icon        decorative icon; hidden first, kept last
│  │  ├─ Tabs.Label       title; keeps its width when it turns medium weight
│  │  ├─ Tabs.Count       counter Badge, one tier below the tabs size
│  │  └─ Tabs.Description muted second line; makes the tab two-line
│  └─ Tabs.Separator      Divider hairline between groups of tabs
└─ Tabs.Panel             role="tabpanel", rendered only while its tab is active
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Tabs.Root
`ref` → `HTMLDivElement`. `<div>` that owns the active value, size and orientation and lays out the list and the panel; horizontal, it is the frame: a sunken strip over the panel surface.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Active tab (controlled). |
| `defaultValue` | `string` | `""` | Initial active tab (uncontrolled). With `""` no tab is selected. |
| `onValueChange` | `(value: string) => void` | — | Called with the new active value. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | List direction and arrow keys. A vertical list stacks above the panel when the container is narrower than 600px. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Control tier: text, icon, spacing, folder radius and panel padding. A horizontal tab is the control height plus the folder rise on both sides; a vertical one is the control height. |
| `fullWidth` | `boolean` | `true` | Horizontal tabs share the list width equally, within `minItemWidth` … `maxItemWidth`; `false` sizes each tab to its content within the same bounds. |
| `tone` | `"neutral" \| "accent"` | `"neutral"` | Colour of the active tab: `neutral` is primary text with an accent icon, `accent` puts text and icon in accent. |
| `minItemWidth` | `number \| string` | `2.5 × control height` | Narrowest a horizontal tab with a label gets, px or a CSS length; past it the list scrolls. Icon-only tabs are square. |
| `maxItemWidth` | `number \| string` | `7 × control height` | Widest a horizontal tab gets, px or a CSS length (`"none"` lifts the cap); a longer label ends with an ellipsis. |
| `labels` | `Partial<TabsLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | `Tabs.List` and `Tabs.Panel`s. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">` | — | `className` and the other div attributes. |

### Tabs.List
`ref` → `HTMLDivElement`. `role="tablist"` on a `ScrollContainer` (horizontal, edge fade, hidden scrollbar) with the sliding folder (vertical: pill). When tabs do not fit or a label would be cut, it hides icons and descriptions, then labels (icons with tooltips stay; only when every tab has an icon); tabs then shrink to `minItemWidth` and the list scrolls.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | `Tabs.Item`s and `Tabs.Separator`s. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `aria-label` (name the list), `className` and the other div attributes; `role`, `aria-orientation` and `onKeyDown` are set by the list. |

### Tabs.Item
`ref` → `HTMLButtonElement`. One tab, a `<button role="tab">` in an item wrapper that also holds the close button of a removable tab; plain text children are wrapped in `Tabs.Label`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Value that selects this tab and its panel. |
| `disabled` | `boolean` | `false` | Disables the tab; clicks and arrow keys skip it. |
| `onRemove` | `() => void` | — | Makes the tab closable: a close button (shown on the active tab, on hover and focus, always on touch screens), `Delete` / `Backspace` and a middle click. Closing the active tab first selects its neighbour; remove the item from your list here. |
| `children` | `ReactNode` | — (required) | Plain text, or `Tabs.Icon` / `Tabs.Label` / `Tabs.Count` / `Tabs.Description`. A description makes the tab two-line. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" \| "type" \| "role" \| "onClick">` | — | `className`, `aria-*` and the other button attributes; your `onKeyDown` / `onAuxClick` run first and `preventDefault()` keeps the tab open. |

### Tabs.Icon
`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`) before the label; muted, accent on the active tab. Hidden first when tabs do not fit; the last thing left when nothing else fits.

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

### Tabs.Separator
`ref` → `HTMLDivElement`. A `Divider` hairline between groups of tabs, across the list direction; hidden from assistive tech.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other div attributes. |

### Tabs.Panel
`ref` → `HTMLDivElement`. `<div role="tabpanel">`, focusable, rendered only while its tab is active; horizontal, the padded surface the folder rises from. Its content enters each time it opens.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Tab value this panel belongs to. |
| `children` | `ReactNode` | — | Panel content. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

## Variants
Tabs have no `variant`: navigation tabs are always a folder (horizontal) or pills (vertical).

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | active tab in primary text, medium weight, its leading icon in `accent-text` | most screens | yes |
| `accent` | active label and icon both in `accent-text` | the tabs are the main control of the screen and must read as selected at a glance | |

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `horizontal` | a `bg-sunken` strip over a padded `bg-surface` panel, tabs edge to edge; the active tab is the panel surface rising into the strip with concave flares, gliding between tabs; primary text, medium weight, accent icon; hover is the same shape in `fill-faint` | switching sections above the content | yes |
| `vertical` | items padded like controls, no rail; active item is a `fill-muted` pill with a short accent mark at the start; hover `fill-subtle`; below a 600px container it becomes a scrolling row above the panel | settings pages with a side list of sections | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 12/16 text, folder radius 8, rise 4, panel padding 16 | dense panels | |
| `s` | 13/20, radius 8, rise 4, padding 20 | compact cards | |
| `m` | 14/20, radius 12, rise 8, padding 24 | default | yes |
| `l` | 16/24, radius 16, rise 12, padding 24 | page-level sections | |
| `xl` | 16/24, radius 16, rise 12, padding 32 | hero / landing sections | |

A horizontal tab is the control height of the tier plus the rise above and below its content; a vertical tab is the control height, so a vertical list lines up with Button, Input and SegmentedControl of the same `size`.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | horizontal tabs share the list width equally (up to `maxItemWidth`), content centred; `false` sizes each tab to its content, the strip still spans the frame | `false` for tabs of very different label lengths | `true` |

### minItemWidth · maxItemWidth
| Value | Looks like | Use when | Default |
|---|---|---|---|
| defaults | a horizontal tab is 2.5 to 7 control heights wide (90 … 252 at `m`); tabs never stretch into wide bars | most screens | yes |
| lengths (`128`, `"16rem"`) | browser tabs: grow up to `maxItemWidth` with the label cut by an ellipsis past it, shrink to `minItemWidth` in a crowded list, then the list scrolls | open documents, records, chats — many tabs with long titles | |
| `maxItemWidth="none"` | tabs share the whole strip | a few sections that must fill a wide frame | |

### Item content
| Value | Looks like | Use when | Default |
|---|---|---|---|
| text | label only | most tabs | yes |
| `Tabs.Icon` + `Tabs.Label` | muted icon before the label; the active tab's leading icon turns accent | sections with recognizable icons | |
| `Tabs.Count` | soft badge after the label, tabular numbers | showing how many items a section has | |
| `Tabs.Description` (two-line) | label (+ count) on line 1, `body-s` muted text on line 2; `<strong>` is primary / medium | dashboards with a summary per section | |
| `onRemove` on Item | a ghost close button (`action.close`, two tiers below) at the end of the tab: on the active tab, on hover and focus, always on touch screens | open documents the user closes, like browser tabs | |

Avoid icons or descriptions on only some tabs (uneven rows; without an icon on every tab the list cannot collapse to icons) and Tabs used as a filter — use SegmentedControl.

## States
| State | Driven by | DOM |
|---|---|---|
| active | `value` / `defaultValue` | item `aria-selected="true"`, `data-state="active"`, `tabIndex=0`; others `data-state="inactive"`, `tabIndex=-1` |
| hover | pointer | text → primary; horizontal: the folder shape in `fill-faint`, under the folder; vertical: `fill-subtle` background |
| pressed | pointer down | the tab content scales to `--prime-motion-press-scale-compact` |
| focus-visible | keyboard | focus ring inside the tab, above the folder; the panel shows an inset ring (vertical: outer ring) |
| disabled | `disabled` on Item | native `disabled`, `data-disabled="true"`, `text-disabled`; a removable tab loses its close button |
| removable | `onRemove` on Item | item wrapper `data-removable="true"`, close button, tab `aria-keyshortcuts="Delete"` |
| two-line | `Tabs.Description` child | `data-two-line="true"` |
| collapsed | tabs wider than the list, or a label that would be cut (horizontal) | list `data-collapse="full" \| "compact" \| "icon"`: `compact` hides icons and descriptions; `icon` hides labels (sr-only, shown in a `Tooltip`), counts and close buttons, only when every tab has an icon |
| overflow | tabs at `minItemWidth` (or icon squares) still wider than the list | `data-overflow-start` / `data-overflow-end` on the list (ScrollContainer), faded edges; the active tab scrolls into view |

Other attributes: Root `data-orientation`, `data-size`, `data-tone`, `data-full-width`, inline `--tabs-item-min` / `--tabs-item-max` when set; List `data-indicator="folder" | "pill"`; Item `data-value` on the tab, `data-state` / `data-disabled` on its wrapper too; Label `data-text`. Inactive panels are unmounted; a panel's content enters each time it opens.

## Layout & spacing
- Horizontal: the root is the frame (`radius-xl`, `bg-sunken`), the list sits flush on the panel and runs edge to edge; the panel pads its content by tier (`--prime-space-4` … `--prime-space-8`). Do not wrap Tabs in a Card — it already is one.
- Vertical list → panel: `var(--prime-space-6)`.
- The list never wraps: it collapses, then scrolls horizontally with faded edges. Give the list's container a width (`min-width: 0` on flex children).
- A vertical Tabs.Root is a size container: give it a width (it measures itself to switch to a row).
- In a vertical layout align the panel heading with the first tab by making the heading row one control tall (`min-height: var(--prime-control-m-height)`).

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `ArrowLeft` · `ArrowRight` | Select the neighbouring tab, wrapping and skipping disabled ones; also work in a vertical list. |
| `ArrowUp` · `ArrowDown` | The same in a vertical list. |
| `Home` · `End` | First and last enabled tab. |
| `Delete` · `Backspace` | Close a tab with `onRemove`; closing the active tab selects and focuses its neighbour. |
| `Tab` | Enters the active tab (roving tabindex), then moves to the panel. |

### ARIA
- WAI-ARIA tabs pattern: `tablist` / `tab` / `tabpanel` with `aria-controls` / `aria-labelledby` wired automatically; give `Tabs.List` an `aria-label`.
- Selection follows focus; the panel is focusable (`tabIndex=0`).
- In a two-line tab the accessible name is label (+ count); `Tabs.Description` becomes `aria-describedby`.
- `Tabs.Icon` and `Tabs.Separator` are `aria-hidden`.
- When only icons are left, the label stays for screen readers (sr-only) and shows in a `Tooltip` on hover and focus.
- The close button of a removable tab is named after it (`labels.remove`) and stays out of the Tab order; the tab announces `aria-keyshortcuts="Delete"`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `remove` | `"Закрыть вкладку «{label}»"` | Accessible name of the close button of a removable tab; `{label}` is the tab title (its value when the title is not text). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Sections of one screen; the active tab rises into the panel and glides to the next one — `defaultValue`. |
| [variants.tsx](examples/variants.tsx) | The active tab in primary text with an accent icon, or all in accent — `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: text, icon, folder radius and spacing grow together — `size`. |
| [states.tsx](examples/states.tsx) | A disabled tab that clicks and arrow keys skip — `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | A muted icon before the label and a hairline before the service section — `Tabs.Icon`, `Tabs.Label`, `Tabs.Separator`. |
| [orientation.tsx](examples/orientation.tsx) | Tabs over the panel and a side list of sections that stacks on top below 600px — `orientation`. |
| [overflow.tsx](examples/overflow.tsx) | Drag the frame narrower: icons go first, then labels, and icons with tooltips stay; then the list scrolls — `Tabs.Icon`. |
| [closable.tsx](examples/closable.tsx) | Open order cards as browser tabs: each closes by its button, Delete or a middle click; tabs stay between two widths and scroll past the narrower one — `onRemove`, `minItemWidth`, `maxItemWidth`. |
| [two-line.tsx](examples/two-line.tsx) | A label and a counter on the first line, a summary on the second — `Tabs.Count`, `Tabs.Description`. |
| [controlled.tsx](examples/controlled.tsx) | The active tab lives in parent state, e.g. synced with the URL — `value`, `onValueChange`. |

## Mistakes
- `<Tabs.Root>` without `defaultValue` / `value` → no tab is active; pass the first tab's value.
- `variant="pills"` / `variant="underline"` → Tabs have no variant; use `orientation`, or SegmentedControl for a pill switch.
- An icon on only some tabs → the list cannot collapse to icons and scrolls instead; give every tab an icon or none.
- Tabs inside a `Card.Root` → a frame in a frame; the horizontal root is the surface.
- Using Tabs to filter a list → use SegmentedControl.
- `onClick` on `Tabs.Item` → use `onValueChange` on Root.
- A hand-made × inside `Tabs.Item` → a button inside a tab button; pass `onRemove` instead.
- `onRemove` that does not drop the tab from your list → the tab stays; the kit only moves the selection.
- `Tabs.List` without `aria-label` → add one.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Button](../button/COMPONENT.md), [Divider](../divider/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md)
- **See also:** [SegmentedControl](../segmented-control/COMPONENT.md), [ButtonGroup](../button-group/COMPONENT.md), [Accordion](../accordion/COMPONENT.md)

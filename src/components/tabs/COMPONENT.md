# Tabs

**Category:** navigation
**Kind:** navigation

> A tab bar of folder tabs for navigating between content panels of one screen: the active tab is the host's surface rising into the strip, the panel is the host's content with no frame or padding of its own.

## When to use
- Splitting one screen into sections that are viewed one at a time (Overview / Orders / Reviews).
- Sections of a record opened in a Drawer or Modal: the tab bar runs along the bottom of the header.
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
Tabs.Root                 value, size (else the host tier), orientation, tone, fullWidth, min/maxItemWidth
├─ Tabs.List              role="tablist" on the switcher row, sliding folder; collapses, then scrolls
│  ├─ Tabs.Item           one tab (role="tab") in an item wrapper; onRemove adds a close button; parts:
│  │  ├─ Tabs.Icon        decorative icon; hidden first, kept last
│  │  ├─ Tabs.Label       title; keeps its width when it turns medium weight
│  │  ├─ Tabs.Count       counter Badge, one tier below the tabs size
│  │  └─ Tabs.Description muted second line; makes the tab two-line
│  └─ Tabs.Separator      Divider hairline between groups of tabs
└─ Tabs.Panel             role="tabpanel", rendered only while its tab is active (keepMounted: kept hidden once opened); no fill, no padding
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Tabs.Root
`ref` → `HTMLDivElement`. `<div>` that owns the active value, size and orientation; no surface of its own — it stands in the host's padding. In a Modal or Drawer it wraps `X.Header` (with `Tabs.List` last) and `X.Body`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Active tab (controlled). |
| `defaultValue` | `string` | `""` | Initial active tab (uncontrolled). With `""` no tab is selected. |
| `onValueChange` | `(value: string) => void` | — | Called with the new active value. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | List direction and arrow keys. Vertical: a column of sections beside the panel, which becomes a horizontal strip in a container below 600px. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Control tier: text, icon, spacing, folder radius and the gap between the strip and the panel; a tab is at least the control height. Without it the tier of the host. |
| `fullWidth` | `boolean` | `true` | Horizontal tabs fill the list and tend to equal widths within `minItemWidth` … `maxItemWidth`; `false` sizes each tab to its content within the same bounds. |
| `tone` | `"neutral" \| "accent"` | `"neutral"` | Colour of the active tab: `neutral` is primary text with an accent icon, `accent` puts text and icon in accent. |
| `minItemWidth` | `number \| string` | 2.5 × control height | Narrowest a horizontal tab with a label gets, px or a CSS length; a tab is also never narrower than its content (up to `maxItemWidth`). |
| `maxItemWidth` | `number \| string` | 7 × control height | Widest a horizontal tab gets, px or a CSS length (`"none"` lifts the cap); a longer label ends with an ellipsis. |
| `labels` | `Partial<TabsLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | `Tabs.List` and `Tabs.Panel`s. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">` | — | `className` and the other div attributes. |

### Tabs.List
`ref` → `HTMLDivElement`. `role="tablist"` on the switcher row (a sideways `ScrollContainer`) with the sliding folder. When tabs do not fit it hides icons and descriptions, then labels (only when every tab has an icon), then scrolls; the active tab stays in view.

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
| `onRemove` | `() => void \| Promise<void>` | — | Makes the tab closable (close button, `Delete` / `Backspace`, middle click); remove the item from your list here. Return a promise to confirm first: rejected, the tab stays. |
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
`ref` → `HTMLDivElement`. `<div role="tabpanel">`, focusable, rendered only while its tab is active (with `keepMounted`, kept hidden once opened). No fill and no padding: its content is the host's content, aligned with the strip's edges. Content opened after mount enters.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Tab value this panel belongs to. |
| `keepMounted` | `boolean` | `false` | Once opened, the panel stays mounted and `hidden` while another tab is active: its data, form draft and scroll survive a switch. A panel never opened is not mounted. |
| `children` | `ReactNode` | — | Panel content. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

## Variants
Tabs have no `variant`: navigation tabs are always a folder — the host's surface rising into the strip from below (horizontal) or reaching into the column from its side (vertical).

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | active tab in primary text, medium weight, its leading icon in `accent-text` | most screens | yes |
| `accent` | active label and icon both in `accent-text` | the tabs are the main control of the screen and must read as selected at a glance | |

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `horizontal` | a rounded `fill-muted-hover` strip (two steps off the host surface) above the panel, tabs edge to edge; the active tab is the host's surface (`layer-current`) rising into the strip with concave flares, gliding between tabs; primary text, medium weight, accent icon; hover is the same shape in `fill-faint` | switching sections above the content | yes |
| `vertical` | the same folder on its side: a column of sections in the strip at the panel's inline start; the active section is the host's surface reaching into the column, rounded on the outer side, with concave flares above and below; hover is the same shape in `fill-faint`. Below a 600px container the column becomes the horizontal strip above the panel (it scrolls, never wraps) | settings pages with a side list of sections | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 12/16 text, folder radius 8, rise 4, panel gap 12 | dense panels | |
| `s` | 13/20, radius 8, rise 4, gap 16 | compact cards | |
| `m` | 14/20, radius 12, rise 4, gap 20 | default | yes |
| `l` | 16/24, radius 16, rise 8, gap 24 | page-level sections | |
| `xl` | 16/24, radius 16, rise 8, gap 32 | hero / landing sections | |

A tab is at least the control height of the tier, so a one-line list lines up with Button, Input and SegmentedControl of the same `size`; content sets the rest — a two-line tab grows by its lines and padding, and the tabs of a row share the tallest height. The strip adds the rise above the tabs.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | horizontal tabs fill the list and tend to equal widths (`flex: 1 1 0`, up to `maxItemWidth`), content centred; a tab is never narrower than its content or `minItemWidth`, so a long label keeps its width and the short ones share the rest; `false` sizes each tab to its content, the strip still spans the frame | `false` for tabs of very different label lengths | `true` |

### minItemWidth · maxItemWidth
| Value | Looks like | Use when | Default |
|---|---|---|---|
| defaults | a horizontal tab is 2.5 to 7 control heights wide (90 … 252 at `m`); tabs never stretch into wide bars | most screens | yes |
| lengths (`128`, `"16rem"`) | browser tabs: grow up to `maxItemWidth` with the label cut by an ellipsis past it, never narrower than `minItemWidth` or their title up to the cap; in a crowded list the list scrolls | open documents, records, chats — many tabs with long titles | |
| `maxItemWidth="none"` | tabs share the whole strip | a few sections that must fill a wide frame | |

### Item content
| Value | Looks like | Use when | Default |
|---|---|---|---|
| text | label only | most tabs | yes |
| `Tabs.Icon` + `Tabs.Label` | muted icon before the label; the active tab's leading icon turns accent | sections with recognizable icons | |
| `Tabs.Count` | soft badge after the label, tabular numbers | showing how many items a section has | |
| `Tabs.Description` (two-line) | label (+ count) on line 1, `body-s` muted text on line 2; `<strong>` is primary / medium | dashboards with a summary per section | |
| `onRemove` on Item | a ghost close button (`action.close`, `xs`; `s` in `l` and `xl` tabs) at the end of the tab: on the active tab, on hover and focus, always on touch screens; the tab also closes by `Delete` / `Backspace` and a middle click, and closing the active tab selects its neighbour | open documents the user closes, like browser tabs | |

Avoid icons or descriptions on only some tabs (uneven rows; without an icon on every tab the list cannot collapse to icons) and Tabs used as a filter — use SegmentedControl.

## States
| State | Driven by | DOM |
|---|---|---|
| active | `value` / `defaultValue` | item `aria-selected="true"`, `data-state="active"`, `tabIndex=0`; others `data-state="inactive"`, `tabIndex=-1` |
| hover | pointer | text → primary; the folder shape in `fill-faint`, under the folder |
| pressed | pointer down | the tab content scales to `--prime-motion-press-scale-compact` (`internal/press`) |
| focus-visible | keyboard | the tab draws an inset ring in its own shape, above the folder; the focused panel draws the outer ring |
| disabled | `disabled` on Item | native `disabled`, `data-disabled="true"`, `text-disabled`; a removable tab loses its close button |
| removable | `onRemove` on Item | item wrapper `data-removable="true"`, close button, tab `aria-keyshortcuts="Delete"` |
| closing, confirm pending | `onRemove` returned a promise that has not settled | the close button is `loading` (`aria-busy`); the tab, its selection and focus stay; resolved → the neighbour takes over, rejected → nothing changes |
| kept | `keepMounted` on Panel, its tab once opened and now inactive | the panel stays mounted with `hidden` (out of the layout, the tab order and the accessibility tree); its tab keeps `aria-controls`; shown again, its content enters as on a first open |
| two-line | `Tabs.Description` child | `data-two-line="true"` |
| collapsed | tabs wider than the list, or a label that would be cut (horizontal) | list `data-collapse="full" \| "compact" \| "icon"`: `compact` hides icons and descriptions; `icon` takes labels, counts and close buttons out of the row — a `VisuallyHidden` copy of the label names the tab and a `Tooltip` shows it — only when every tab has an icon |
| overflow | tabs at their narrowest (content width, `minItemWidth` or icon squares) still wider than the list | `data-overflow-start` / `data-overflow-end` on the list (the switcher row, a ScrollContainer), faded edges as deep as the hidden part at most (they grow and melt with the scroll, never switch); when the end edge would cut only a tab's empty side, the tabs at `minItemWidth` widen a little (`--tabs-peek`, up to 30%) so a label fades out at the edge and shows that more tabs follow; the active tab is kept in view and clear of the fades on mount and on every value change, the first and the last tab scroll all the way to the end — only the list scrolls, never the page. A column (a wide vertical list) has plain edges |

The indicator glides (`emphasized` + `base`, `data-animate="true"`) only into a choice by click, arrow keys or closing the active tab; on mount, a value set from outside, a resize, font loading, tabs added or removed and collapse it is placed without motion, and it stays still under `prefers-reduced-motion`. The list scrolls smoothly to the active tab only after such a choice too.

Other attributes: Root `data-orientation`, `data-size`, `data-tone`, `data-full-width`, inline `--tabs-item-min` / `--tabs-item-max` when set; the folder (the list's first child, `data-indicator`) `data-axis="x" | "y"` (follows the list's direction, so a vertical list in a narrow container gets the top folder); Item `data-value` on the tab, `data-state` / `data-disabled` on its wrapper too; Label `data-text`. Inactive panels are unmounted (unless `keepMounted`), and a tab points at its panel (`aria-controls`) only while the panel is in the document; a panel's content enters each time it opens after mount (the panel shown on mount stands still).

## Layout & spacing
- Tabs are a bar, not a surface: the root has no fill, padding, radius or `data-depth`. On a page or in a `Card.Body`, put it straight into the host's padded region and the panel content straight into `Tabs.Panel`. The strip's edges and the panel content share the host's content edge; the panel stands one tier gap below the strip (`--prime-space-3` … `--prime-space-8`).
- In a Modal or Drawer the tabs belong to the header: `Tabs.Root` wraps `X.Header` and `X.Body`, `Tabs.List` goes last into the header, the panels into the body. The header becomes the strip (painted like it, no hairline, edge to edge — the header hands the bar its side padding as `--prime-bleed-inline`), the active tab is the body rising into it, and the root renders no box (`display: contents`), so only the body scrolls and the tabs stay in view.

```tsx
<Drawer.Content>
  <Tabs.Root defaultValue="summary">
    <Drawer.Header>
      <Drawer.Title>Заказ № 1042</Drawer.Title>
      <Tabs.List aria-label="Заказ № 1042">…</Tabs.List>
    </Drawer.Header>
    <Drawer.Body>
      <Tabs.Panel value="summary">…</Tabs.Panel>
    </Drawer.Body>
  </Tabs.Root>
</Drawer.Content>
```
- The folder paints the host's `layer-current`, so the active tab is always the colour of the surface it stands on; controls in a panel read the host's field and fill tokens.
- Vertical: the column is as wide as its widest section (at least four control heights, at most 40% of the root) and as tall as its sections; the panel sits beside it, one gap away.
- The list is a switcher (foundation §9): it never wraps — it collapses, then scrolls horizontally with faded edges (hidden scrollbar; at its sideways edge it stops, a vertical wheel goes on to the page). Give the list's container a width (`min-width: 0` on flex children).
- Without `size` the tabs take the tier of their host (a Card, a Drawer, a form), else `m`.
- A horizontal tab is never narrower than its content (`min-width: max-content`; the tab bounds that content between `minItemWidth` and `maxItemWidth`), so a label is never cut to make room. Full width, tabs tend to equal widths, not widths in proportion to their labels (`flex: 1 1 0`): a long label keeps its width, the short ones share the rest.
- A vertical Tabs.Root is a size container: give it a width (it measures itself to switch to a row).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `ArrowLeft` · `ArrowRight` | Select the neighbouring tab, wrapping and skipping disabled ones; also work in a vertical list. |
| `ArrowUp` · `ArrowDown` | The same in a vertical list. |
| `Home` · `End` | First and last enabled tab. |
| `Delete` · `Backspace` | Close a tab with `onRemove`; closing the active tab selects and focuses its neighbour. |
| `Tab` | Enters the active tab (roving tabindex), then moves to the panel. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- WAI-ARIA tabs pattern: `tablist` / `tab` / `tabpanel` with `aria-controls` / `aria-labelledby` wired automatically; a tab names its panel in `aria-controls` only while the panel is in the document. Give `Tabs.List` an `aria-label`.
- Selection follows focus; the panel is focusable (`tabIndex=0`).
- In a two-line tab the accessible name is label (+ count); `Tabs.Description` becomes `aria-describedby`.
- `Tabs.Icon` and `Tabs.Separator` are `aria-hidden`.
- When only icons are left, a `VisuallyHidden` copy of the label names the tab and the label shows in a `Tooltip` on hover and focus.
- The close button of a removable tab is named after it (`labels.remove`) and stays out of the Tab order; the tab announces `aria-keyshortcuts="Delete"`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `remove` | `"Закрыть вкладку «{label}»"` | Accessible name of the close button of a removable tab; `{label}` is the tab title (its value when the title is not text). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Sections of one screen; the active tab rises into the strip and glides to the next one — `defaultValue`. |
| [variants.tsx](examples/variants.tsx) | The active tab in primary text with an accent icon, or all in accent — `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: text, icon, folder radius and spacing grow together; tabs sized to their content — `size`, `fullWidth`. |
| [states.tsx](examples/states.tsx) | A disabled tab that clicks and arrow keys skip — `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | A muted icon before the label and a hairline before the service section — `Tabs.Icon`, `Tabs.Label`, `Tabs.Separator`. |
| [orientation.tsx](examples/orientation.tsx) | Account settings with a side list of sections: the active section reaches out of the panel, and below 600px the list moves above it — `orientation`. |
| [overflow.tsx](examples/overflow.tsx) | Drag the frame narrower: icons go first, then labels, and icons with tooltips stay; then the list scrolls — `Tabs.Icon`. |
| [closable.tsx](examples/closable.tsx) | Open order cards as browser tabs: each closes by its button, Delete or a middle click; tabs stay between two widths, and the list scrolls when they do not fit — `onRemove`, `minItemWidth`, `maxItemWidth`. |
| [two-line.tsx](examples/two-line.tsx) | A label and a counter on the first line, a summary on the second — `Tabs.Count`, `Tabs.Description`. |
| [in-drawer.tsx](examples/in-drawer.tsx) | Order details in a Drawer: the tab bar runs along the bottom of the header and scrolls sideways when the tabs outgrow the drawer, the active tab is the body rising into it, every panel is the body's own content, and the delivery form keeps its edits across tabs — `Tabs.Root`, `Tabs.List`, `Tabs.Panel`, `keepMounted`. |
| [controlled.tsx](examples/controlled.tsx) | The active tab lives in parent state, e.g. synced with the URL — `value`, `onValueChange`. |

## Mistakes
- `<Tabs.Root>` without `defaultValue` / `value` → no tab is active; pass the first tab's value.
- `variant="pills"` / `variant="underline"` → Tabs have no variant; use `orientation`, or SegmentedControl for a pill switch.
- An icon on only some tabs → the list cannot collapse to icons and scrolls instead; give every tab an icon or none.
- Tabs or a panel wrapped in an extra padded box (`Card.Root` around the root, a padded `div` or Card inside `Tabs.Panel`) → a container in a container with doubled padding; Tabs stand in the host's padding and the panel content goes straight in.
- Using Tabs to filter a list → use SegmentedControl.
- `onClick` on `Tabs.Item` → use `onValueChange` on Root.
- A hand-made × inside `Tabs.Item` → a button inside a tab button; pass `onRemove` instead.
- `onRemove` that does not drop the tab from your list → the tab stays; the kit only moves the selection.
- `Tabs.List` without `aria-label` → add one.
- Lifting a panel's data or form draft to the parent only so it survives a tab switch → `keepMounted` on that `Tabs.Panel`.
- Tabs inside `Drawer.Body` / `Modal.Body` under the header → a floating strip under the header's hairline; wrap the header and the body in `Tabs.Root` and put `Tabs.List` into the header.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (`internal/SwitcherScroller`, the list), [Badge](../badge/COMPONENT.md), [Button](../button/COMPONENT.md), [Divider](../divider/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md), [VisuallyHidden](../visually-hidden/COMPONENT.md) (the label of an icon-only tab), Icon (`action.close`); `internal/selectionIndicator` (the folder), `internal/press`
- **See also:** [SegmentedControl](../segmented-control/COMPONENT.md), [ButtonGroup](../button-group/COMPONENT.md), [Accordion](../accordion/COMPONENT.md)

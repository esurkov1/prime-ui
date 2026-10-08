# Dropdown

**Category:** overlays
**Kind:** overlay

> A menu of actions that opens from a trigger: picking an item runs it and closes the menu.

## When to use
- Secondary actions of a card, row or document behind a «⋯» or labelled button.
- An account / user menu in the app header.
- A short list of commands (export formats, move to project) where picking one runs an action.

## When not to use
- Choosing and showing a value in a form → use [Select](../select/COMPONENT.md) (or [TagSelect](../tag-select/COMPONENT.md) for several).
- Searching across many commands → use [CommandMenu](../command-menu/COMPONENT.md).
- Free content, forms or filters in a floating panel → use [Popover](../popover/COMPONENT.md).
- A hint on hover → use [Tooltip](../tooltip/COMPONENT.md).
- Two to four always-visible actions → show [Button](../button/COMPONENT.md)s or a [ButtonGroup](../button-group/COMPONENT.md).

## Import
```tsx
import { Dropdown } from "prime-ui-kit";
```

## Anatomy
```
Dropdown.Root                     state and dismiss policy (no DOM)
├── Dropdown.Trigger              clones its child; toggles the menu
└── Dropdown.Content              portaled role="menu" on the floating surface, scrolls
    ├── Dropdown.Header           non-interactive row: [avatar] [Title + Description] [badge]
    │   ├── Dropdown.Title
    │   └── Dropdown.Description
    ├── Dropdown.Separator        full-bleed Divider
    ├── Dropdown.Group            role="group", named by `label`
    │   └── Dropdown.Item         <button role="menuitem">
    │       ├── Dropdown.ItemIcon       leading glyph (aria-hidden)
    │       └── Dropdown.ItemShortcut   Kbd at the end
    ├── Dropdown.CheckboxItem     <button role="menuitemcheckbox">: label + check mark at the end while checked; stays open
    └── Dropdown.Item
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Dropdown.Root
No DOM, no ref. Open state and dismiss policy.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, item pick, Escape, outside press, code. |
| `closeOnOutsideClick` | `boolean` | `true` | A pointerdown outside the menu and its trigger closes it; focus follows the pointer. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the menu and returns focus to the trigger. |
| `children` | `ReactNode` | — (required) | Trigger and Content. |

### Dropdown.Trigger
No DOM: clones the single child, merges `ref` and `onClick` (toggles), sets `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `data-state`; the child's own `id` wins. Other props given to it (handlers, ARIA, `ref`) reach the child, so a wrapping `Tooltip.Trigger` keeps working.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button. |

### Dropdown.Content
`ref` → `HTMLDivElement`. Portal + `role="menu"` on the floating surface (a ScrollContainer), named by the trigger; renders while open and during its exit animation. Focus moves to the first item; Tab closes the menu and returns focus to the trigger. Below 640px of viewport the menu is a bottom sheet: a scrim, a grab handle, swipe down to close (with `closeOnOutsideClick`), page scroll locked.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side; flips to the opposite side when there is no room. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment along the trigger; shifts inside the viewport. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Row tier: item height, text and icon; key hints one tier down. |
| `matchTriggerWidth` | `boolean` | `false` | The menu is at least as wide as the trigger. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "role">` | — | `className`, `onKeyDown` (runs before the arrow-key navigation) and the other attributes of the menu. |

### Dropdown.Item
`ref` → `HTMLButtonElement`. A `<button role="menuitem">`; a click, Enter or Space runs `onSelect` and closes the menu. + native button props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSelect` | `() => void` | — | The action of the item. |
| `disabled` | `boolean` | `false` | Muted, `aria-disabled`, skipped by the arrow keys, does nothing on click. |
| `tone` | `"neutral" \| "danger"` | `"neutral"` | `danger`: destructive action — danger text, icon and hover fill. |
| `children` | `ReactNode` | — | `Dropdown.ItemIcon`, the label, `Dropdown.ItemShortcut`. |

### Dropdown.CheckboxItem
`ref` → `HTMLButtonElement`. A `<button role="menuitemcheckbox">` with `aria-checked`: the label (and an `ItemIcon`) on the left like any item, an accent check mark at the end while checked and nothing while not; a click, Enter or Space toggles it and the menu stays open. + native button props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Checked state (controlled). |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled). |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called with the new state. |
| `disabled` | `boolean` | `false` | Muted, `aria-disabled`, skipped by the arrow keys, does not toggle. |
| `children` | `ReactNode` | — | The label (optionally after a `Dropdown.ItemIcon`). |

### Dropdown.ItemIcon · Dropdown.ItemShortcut
`ref` → `HTMLSpanElement` / `HTMLElement` (the `<kbd>`). An `aria-hidden` `<span>` holding the leading glyph at the menu icon size (a kit `Icon` follows it) / a `Kbd` one tier below the menu, pushed to the end of the item — a hint, not a handler. + native props.

### Dropdown.Group
`ref` → `HTMLDivElement`. `<div role="group">` named by its visible `label`. + native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Heading of the group (caption, muted); also its accessible name. |

### Dropdown.Separator
`ref` → `HTMLDivElement`. A full-bleed Divider between items or groups.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the divider. |

### Dropdown.Header · Dropdown.Title · Dropdown.Description
`ref` → `HTMLDivElement`. A non-interactive row at the top (who is signed in, the plan): an avatar, Title + Description stacked in one column, a trailing badge or button — in the written order / the medium heading line / the muted line under it; both truncate. + native `<div>` props.

## Variants
The panel is the shared floating surface: the floating layer of the ladder (`data-depth="floating"`), `--prime-panel-radius` (12), padding 4, `shadow-overlay`; rows have radius 8 and the tier item height.

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | item 24, text 12/16, icon 14 | Dense toolbars | |
| `s` | item 28, text 13/20, icon 16 | Table rows, compact headers | |
| `m` | item 32, text 14/20, icon 16 | Most menus | yes |
| `l` | item 36, text 16/24, icon 20 | Roomy layouts | |
| `xl` | item 40, text 16/24, icon 20 | Touch-first screens | |

### tone (Item)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | primary text, muted icon, subtle fill on hover | Regular actions | yes |
| `danger` | danger text and icon, danger-soft fill on hover | Delete, revoke, leave | |

### side / align (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `side="bottom"` | Below the trigger | Default | yes |
| `side="top"` | Above the trigger | Triggers near the bottom of the screen | |
| `side="left"` / `"right"` | Beside the trigger, aligned along its height | Triggers in a side rail (account menu at the bottom of a sidebar) | |
| `align="start"` | Start edges aligned | Default | yes |
| `align="center"` | Centred on the trigger | Small triggers | |
| `align="end"` | End edges aligned | «⋯» buttons at the end of a row | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `disabled` (Item) | Disabled text, skipped by arrows | Not allowed right now (say why in the label) | `false` |
| `matchTriggerWidth` | Menu at least as wide as the trigger | Full-width buttons | `false` |
| `closeOnOutsideClick={false}` · `closeOnEscape={false}` | Stays open until an item is picked | A required choice in an onboarding step | |

**Combinations** — menu `size` = trigger `size`. Destructive items go last, after a separator. Key hints only for shortcuts the app really handles.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the menu (closed while the exit animation plays) and on the trigger, `aria-expanded` on the trigger |
| side | `side` and the room next to the trigger | `data-side` (resolved) |
| size | `size` on Content | `data-size` |
| item hover / focus | a hovering pointer, arrow keys | subtle fill (danger-soft for `danger`), no movement; a tap leaves no hover fill |
| item disabled | `disabled` | `aria-disabled="true"`, `data-disabled="true"` |
| item tone | `tone` | `data-tone` |
| sheet | viewport below 640px | a scrim and a full-width bottom sheet with an `aria-hidden` grab handle around the menu; the sheet carries `data-state`, the menu keeps its role and ref; page scroll locked; a swipe down from the handle closes it (with `closeOnOutsideClick`) |

## Layout & spacing
- Width is `max-content` between `--prime-panel-min-width` and twice that; items never wrap.
- Max height = min(`--prime-panel-max-height`, the room on the resolved side); the menu scrolls inside.
- Separators run edge to edge across the panel padding; group labels take `--prime-panel-group-label-height`.
- Kept `--prime-space-2` from viewport edges; follows the trigger on scroll and resize.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` · `Space` | On the trigger opens the menu (focus on the first item); on an item runs it and returns focus to the trigger; on a checkbox item toggles it and the menu stays open. |
| `ArrowDown` · `ArrowUp` | Move focus to the next / previous enabled item, wrapping. |
| `Home` · `End` | First / last enabled item. |
| `Escape` | Closes the menu (`closeOnEscape`); focus returns to the trigger. |
| `Tab` · `Shift+Tab` | Closes the menu; focus returns to the trigger (Tab then goes on to the next stop). |

### ARIA
- The menu is `role="menu"` named by the trigger; items are `role="menuitem"`, checkbox items `role="menuitemcheckbox"` with `aria-checked`, disabled ones `aria-disabled`.
- The trigger gets `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`.
- `Dropdown.Group` is `role="group"` named by its `label`.
- `Dropdown.ItemIcon` is hidden from screen readers; a key hint is text only — the app handles the shortcut.
- An outside press closes the menu without moving focus back to the trigger: focus follows the pointer (foundation §8).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An icon-only button opens the row actions; picking an item runs it and closes the menu — `Dropdown.Item`, `onSelect`. |
| [structure.tsx](examples/structure.tsx) | Optional parts of an account menu: a header with an avatar, a labelled group, item icons, key hints and separators — `Dropdown.Header`, `Dropdown.Group`, `Dropdown.ItemIcon`, `Dropdown.ItemShortcut`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier with icons, key hints and a destructive item; the menu takes the tier of its trigger — `size`. |
| [placement.tsx](examples/placement.tsx) | Every side and alignment relative to the trigger; near the viewport edge the menu flips and shifts — `side`, `align`. |
| [states.tsx](examples/states.tsx) | A regular, a disabled and a destructive item; arrow keys skip the disabled one — `disabled`, `tone`. |
| [match-trigger-width.tsx](examples/match-trigger-width.tsx) | Under a full-width button the menu is at least as wide as the trigger — `matchTriggerWidth`. |
| [checkbox-items.tsx](examples/checkbox-items.tsx) | A column chooser: toggles in the menu keep it open, the key column cannot be hidden — `Dropdown.CheckboxItem`, `checked`, `onCheckedChange`. |
| [long-list.tsx](examples/long-list.tsx) | More projects than fit: the grouped list scrolls inside the panel, capped by the room next to the trigger — `Dropdown.Group`. |
| [dismiss.tsx](examples/dismiss.tsx) | An onboarding step keeps the menu open on an outside press and on Escape until an item is picked — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the open state and opens the menu from another button; the picked step updates the trigger — `open`, `onOpenChange`. |

## Mistakes
- Using Dropdown to pick a form value → Select shows the value and works with forms.
- An icon passed as a component (`as={Icon}`) → put the glyph inside `Dropdown.ItemIcon`.
- A hand-written shortcut `<kbd>` → `Dropdown.ItemShortcut` (a Kbd at the end of the item).
- `Dropdown.Group` with a separate heading element → pass the heading as `label`.
- A destructive item without `tone="danger"`, or in the middle of the list → mark it and put it last.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (the menu), [Kbd](../kbd/COMPONENT.md) (`ItemShortcut`), [Divider](../divider/COMPONENT.md) (`Separator`), Icon (`action.check` of `CheckboxItem`)
- **See also:** [Select](../select/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md), [Popover](../popover/COMPONENT.md), [Button](../button/COMPONENT.md)

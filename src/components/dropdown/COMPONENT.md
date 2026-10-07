# Dropdown

**Category:** overlays (Оверлеи)

> A menu of actions that opens from a trigger: groups, a profile header and destructive items.

## When to use
- Secondary actions of a card, row or document behind a «⋯» or labelled button.
- An account / user menu in the app header.
- A short list of commands (export formats, sort order) where picking one runs an action.

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
Dropdown.Root                     state (no DOM)
├── Dropdown.Trigger              clones its single child (usually a Button)
└── Dropdown.Content              portaled role="menu" panel, scrolls
    ├── Dropdown.Block            vertical section (header + list)
    │   └── Dropdown.Header       user / plan header
    │       └── Dropdown.HeaderRow
    │           ├── Dropdown.HeaderLeading      avatar / icon
    │           ├── Dropdown.HeaderMain
    │           │   ├── Dropdown.HeaderTitle
    │           │   └── Dropdown.HeaderDescription
    │           └── Dropdown.HeaderTrailing     badge / button
    ├── Dropdown.Group            role="group"
    │   ├── Dropdown.GroupLabel
    │   └── Dropdown.Item         role="menuitem" button
    │       ├── Dropdown.ItemIcon
    │       ├── label
    │       └── Dropdown.ItemShortcut
    └── Dropdown.Separator        full-bleed hairline
```

## API

### Dropdown.Root
No DOM, no ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on trigger click, item select, Escape and outside press. |
| `closeOnOutsideClick` | `boolean` | `true` | A pointerdown outside the panel and its trigger closes it. |
| `children` | `ReactNode` | — (required) | Trigger and Content. |

### Dropdown.Trigger
No DOM of its own: clones the child (`cloneElement`), like `asChild`. Merges the child's `ref`, sets `id`, `aria-expanded`, `aria-haspopup="menu"`, `aria-controls`, `data-state`, chains `onClick` (toggles).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | Exactly one element. |

### Dropdown.Content
No ref. Rendered in a portal while open and during its exit animation. Traps focus while open and returns it to the trigger on close.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"bottom" \| "top"` | `"bottom"` | Preferred side; flips when it does not fit. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Horizontal alignment to the trigger. |
| `sameMinWidthAsTrigger` | `boolean` | `false` | The panel is at least as wide as the trigger. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Item height, text and icon tier; size context for controls inside. |
| `className` | `string` | — | Extra class on the panel. |
| `children` | `ReactNode` | — (required) | Items, groups, blocks, separators. |

### Dropdown.Item
No ref. Renders `<button type="button" role="menuitem">`. Activating it calls `onSelect` and closes the menu.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSelect` | `() => void` | — | Action on click / Enter / Space. |
| `disabled` | `boolean` | — | `aria-disabled`, `tabIndex={-1}`, skipped by arrow keys, does not close the menu. |
| `tone` | `"neutral" \| "danger"` | `"neutral"` | `danger` for destructive actions (delete, revoke). |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — (required) | ItemIcon, label, ItemShortcut. |

### Dropdown.ItemIcon
`forwardRef` to the rendered element. Polymorphic.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `ElementType` | `"span"` | Icon component (e.g. a lucide icon); receives `size`. |
| `size` | `number` | tier icon (14 · 16 · 16 · 20 · 20) | Icon size in px; by default follows the Content `size`. |
| `aria-hidden` | `boolean` | `true` | Decorative by default. |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Glyph when `as` is a wrapper. |

+ any other props, passed to the `as` element (e.g. `strokeWidth`).

### Dropdown.ItemShortcut
No ref. Renders `<kbd>` at the end of the item. A hint only: bind the key yourself. + native `HTMLAttributes<HTMLElement>`.

### Dropdown.Group
No ref. `<div role="group">`. + native `<div>` props.

### Dropdown.GroupLabel
No ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Group heading. |
| `className` | `string` | — | Extra class. |

### Dropdown.Separator
No ref. Renders `<hr>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |

### Dropdown.Block · Header · HeaderRow · HeaderLeading · HeaderMain · HeaderTitle
No ref. Layout `<div>`s. + native `<div>` props.

### Dropdown.HeaderDescription
No ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `truncate` | `boolean` | — | One line with an ellipsis (long emails). |

+ native `<div>` props.

### Dropdown.HeaderTrailing
No ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `alignSelf` | `"start" \| "center"` | `"start"` | Vertical alignment in the header row (`center` for a button). |

+ native `<div>` props.

## Variants
The panel has one look: `bg-raised` fill, `--prime-panel-radius` (12), `--prime-panel-padding` (4), `shadow-overlay`; items have radius 8.

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | item 24, text 12/16, icon 14 | xs triggers | |
| `s` | item 28, text 13/20, icon 16 | Dense toolbars, s triggers | |
| `m` | item 32, text 14/20, icon 16 | Most menus | yes |
| `l` | item 36, text 16/24, icon 20 | l triggers | |
| `xl` | item 40, text 16/24, icon 20 | xl triggers | |

### tone (Item)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | Primary text, muted icon, `fill-subtle` on hover / focus | Regular actions | yes |
| `danger` | `danger-text` label and icon, `danger-soft` on hover / focus | Delete, revoke, leave — last in the menu after a Separator | |

### side / align (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `side="bottom"` | Below the trigger, `--prime-space-1` away | Default | yes |
| `side="top"` | Above the trigger | Triggers near the bottom of the screen | |
| `align="start"` | Start edges aligned | Default | yes |
| `align="center"` | Centred to the trigger | Small centred triggers | |
| `align="end"` | End edges aligned | «⋯» buttons and user menus at the right edge | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `sameMinWidthAsTrigger` | Panel at least trigger width | Full-width triggers | `false` |
| `disabled` (Item) | `text-disabled`, no hover fill | Unavailable action that should stay visible | — |
| `truncate` (HeaderDescription) | One line with ellipsis | Long emails | — |
| `alignSelf` (HeaderTrailing) `start` · `center` | Trailing slot at the top or centred | Badge (`start`), button (`center`) | `start` |

**Combinations** — Content `size` = trigger `size`. Destructive item: `tone="danger"` placed last, separated by `Dropdown.Separator`. A disabled danger item looks like any disabled item.

**Hierarchy** — keep the primary action outside the menu as a visible button; the menu holds secondary actions. Group long menus with `GroupLabel`; one danger group at the end.

## States
- Closed / open: uncontrolled by default; `open` + `onOpenChange` for controlled. Selecting an item closes the menu.
- Panel DOM: `data-state="open" | "closed"`, `data-side` (resolved), `data-size`, `data-overlay-portal-layer`.
- Item DOM: `data-tone`, `data-disabled="true"`, `aria-disabled`.
- Trigger DOM: `data-state`, `aria-expanded`.
- Hover and keyboard focus highlight the row with background (`fill-subtle` / `danger-soft`), not a ring; active `fill-subtle-active`.
- No built-in search or empty state.

## Layout & spacing
- Width `max-content` between `--prime-panel-min-width` and twice that; max height `--prime-panel-max-height` or the free space, then the list scrolls.
- Item padding-x `--prime-panel-item-padding-x` (8); icon → label gap is the tier gap; the shortcut is pushed to the end with `--prime-space-4` before it.
- Separators are full-bleed hairlines with `--prime-panel-padding` above and below.
- Kept `--prime-space-2` from viewport edges.

## Accessibility
- Panel `role="menu"` labelled by the trigger; items `role="menuitem"`; groups `role="group"`.
- Keyboard: Arrow Down / Up move between enabled items (wrapping), Home / End jump to the first / last, Enter / Space activate, Tab is kept inside (focus trap), Escape closes and returns focus to the trigger.
- An outside press closes without moving focus back (foundation §8); only the topmost layer reacts.
- Icon-only triggers need `aria-label`. ItemIcon is `aria-hidden` by default.
- No `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | `size` xs → xl with icons, shortcuts, danger item | Matching the menu to the trigger |
| [variants.tsx](examples/variants.tsx) | Item kinds, groups, disabled and `tone="danger"` | Document actions menu |
| [states.tsx](examples/states.tsx) | Long scrolling list with groups and a disabled row | Many items |
| [row-actions.tsx](examples/row-actions.tsx) | Card toolbar with a visible primary action and «⋯» menu | Secondary actions of a card / row |
| [composition.tsx](examples/composition.tsx) | Account menu with header, avatar, badge and plan block | User menu |
| [placement.tsx](examples/placement.tsx) | `align` × `side` | Placing near edges |
| [full-width.tsx](examples/full-width.tsx) | `sameMinWidthAsTrigger` | Full-width triggers |
| [controlled.tsx](examples/controlled.tsx) | `open` + `onOpenChange` in parent state | Syncing with other UI |
| [as-child.tsx](examples/as-child.tsx) | Text-link button as the trigger | Inline switches |

```tsx
import { Button, Dropdown } from "prime-ui-kit";

export function Example() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Действия
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={() => {}}>Переименовать</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item tone="danger">Удалить</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
```

## Mistakes
- `onClick` on Dropdown.Item → use `onSelect` (Item has no `onClick` prop).
- Using Dropdown as a form select that shows the chosen value → use Select.
- `tone="error"` → destructive tone is `danger`.
- A different `size` on the trigger and the panel → use the same tier.
- Setting `size` on every `ItemIcon` → leave it, it follows the panel.

## Related
[Select](../select/COMPONENT.md) · [CommandMenu](../command-menu/COMPONENT.md) · [Popover](../popover/COMPONENT.md) · [Kbd](../kbd/COMPONENT.md) · [Avatar](../avatar/COMPONENT.md)

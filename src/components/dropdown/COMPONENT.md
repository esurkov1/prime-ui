# Dropdown

**Category:** overlays
**Kind:** overlay

> A menu of actions that opens from a trigger: picking an item runs it and closes the menu.

## When to use
- Secondary actions of a card, row or document behind a «⋯» or labelled button.
- An account / user menu behind the Sidebar account row (`Sidebar.Account`).
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
├── Dropdown.Trigger              clones its child; toggles the menu, opens it on the arrow keys
├── Dropdown.Anchor               instead of Trigger: the row or list a context menu opens at (anchorPoint)
└── Dropdown.Content              portaled role="menu" on the floating surface, scrolls
    ├── Dropdown.Header           non-interactive row: [avatar] [Title + Description] [badge]
    │   ├── Dropdown.Title
    │   └── Dropdown.Description
    ├── Dropdown.Separator        full-bleed Divider
    ├── Dropdown.Group            role="group", named by `label`
    │   └── Dropdown.Item         <button role="menuitem"> (or the asChild link)
    │       ├── Dropdown.ItemIcon         leading glyph (aria-hidden)
    │       ├── Dropdown.ItemDescription  muted second line; describes the item
    │       └── Dropdown.ItemShortcut     Kbd at the end
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
| `anchorPoint` | `{ x: number; y: number } \| null` | `null` | A point inside the trigger or `Dropdown.Anchor` (px from its top-left corner) the menu opens at: a context menu at the pointer. It moves with the element on scroll. |
| `children` | `ReactNode` | — (required) | Trigger (or Anchor) and Content. |

### Dropdown.Trigger · Dropdown.Anchor
No DOM: clone the single child and merge `ref`. Trigger toggles the menu on a click, opens it on the arrow keys and sets its ARIA; Anchor only places the menu (a context menu with `anchorPoint`, opened through `open`) and names it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element: usually a Button (Anchor: the row or list the context menu belongs to). |

### Dropdown.Content
`ref` → `HTMLDivElement`. Portal + `role="menu"` floating panel that scrolls inside, named by the control it opened from; focus moves to the first enabled item. Below 640px of viewport it is a bottom sheet.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side; flips to the opposite side when there is no room. |
| `align` | `"auto" \| "start" \| "center" \| "end"` | `"auto"` | Alignment along the trigger. `auto` lines the menu up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix the edge. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Row tier: item height, text and icon; key hints one tier down. The menu's own: it does not follow the trigger's size. |
| `matchTriggerWidth` | `boolean` | `false` | The menu is at least as wide as the trigger. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "role">` | — | `className`, `onKeyDown` (runs before the arrow-key navigation) and the other attributes of the menu. |

### Dropdown.Item
`ref` → `HTMLButtonElement` (or the `asChild` element). A `<button role="menuitem">`, no tab stop of its own (`tabIndex -1`, the arrow keys move between items); a click, Enter or Space runs `onSelect` and closes the menu.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSelect` | `() => void` | — | The action of the item. |
| `disabled` | `boolean` | `false` | Muted and `disabled` (a link item: `aria-disabled`), skipped by the arrow keys; no handler runs, the item's own `onClick` included. |
| `tone` | `"neutral" \| "danger"` | `"neutral"` | `danger`: destructive action — danger text, icon and hover fill. |
| `asChild` | `boolean` | `false` | The item is its single child link (`<a href>`, a router `Link`), so Cmd / Ctrl-click and «open in a new tab» work; the pick still closes the menu. |
| `children` | `ReactNode` | — | `Dropdown.ItemIcon`, the label, `Dropdown.ItemDescription`, `Dropdown.ItemShortcut`; with `asChild` one link element holding them. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "role" \| "onSelect">` | — | `className`, `onClick` (runs before `onSelect`; `preventDefault()` keeps the menu open) and the other attributes of the item. |

### Dropdown.CheckboxItem
`ref` → `HTMLButtonElement`. A `<button role="menuitemcheckbox">` with `aria-checked` and a check mark at the end while checked; a click, Enter or Space toggles it and the menu stays open.

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Checked state (controlled). |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled). |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called with the new state. |
| `disabled` | `boolean` | `false` | Muted and `disabled`, skipped by the arrow keys; no handler runs, the item's own `onClick` included. |
| `children` | `ReactNode` | — | The label (optionally after a `Dropdown.ItemIcon`). |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "role" \| "onSelect" \| "onChange" \| "defaultChecked">` | — | `className`, `onClick` (runs before the toggle; `preventDefault()` skips it) and the other attributes of the item. |

### Dropdown.ItemDescription
`ref` → `HTMLSpanElement`. A muted second line under the item label: what the action does, or why a disabled item is unavailable. Describes the item for assistive tech.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The sentence; it wraps inside the menu's width. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "id">` | — | `className` and the other attributes except `id` (the item points at it). |

### Dropdown.ItemIcon
`ref` → `HTMLSpanElement`. The `aria-hidden` leading glyph of an item at the menu icon size.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className`, `children` (the glyph) and the other attributes. |

### Dropdown.ItemShortcut
`ref` → `HTMLElement` (the `<kbd>`). A `Kbd` key hint at the end of the item, one tier below the menu — a hint, not a handler.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The keys («⌘D»). |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "children">` | — | `className` and the other attributes of the `<kbd>`. |

### Dropdown.Group
`ref` → `HTMLDivElement`. `<div role="group">` named by its visible `label`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Heading of the group (caption, muted); also its accessible name. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` (the items) and the other attributes of the group. |

### Dropdown.Separator
`ref` → `HTMLDivElement`. A full-bleed Divider between items or groups.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the divider. |

### Dropdown.Header · Dropdown.Title · Dropdown.Description
`ref` → `HTMLDivElement`. A non-interactive row at the top (who is signed in, the plan): an avatar, Title + Description in one column, a trailing badge or button.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the `<div>`. |

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
| `align="auto"` | Lined up with the trigger edge that has more room: near the end of the screen the end edges meet and the menu grows toward the start, near the start the other way; below the trigger, flipping to the top without room | Default — triggers anywhere | yes |
| `align="end"` | End edges aligned: the menu grows toward the start | The menu must line up with the end of a block whatever room there is | |
| `align="center"` | Centred on the trigger | Small triggers | |
| `align="start"` | Start edges aligned: the menu grows toward the end | The menu must line up with the start of a block whatever room there is | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `disabled` (Item) | Disabled text, skipped by arrows | Not allowed right now (say why in `Dropdown.ItemDescription`) | `false` |
| `matchTriggerWidth` | Menu at least as wide as the trigger | Full-width buttons | `false` |
| `closeOnOutsideClick={false}` · `closeOnEscape={false}` | Stays open until an item is picked | A required choice in an onboarding step | |
| `anchorPoint` (Root) | The menu opens at a point inside the trigger or `Dropdown.Anchor` | A context menu at the pointer over a row or a list | `null` |

**Combinations** — `size` is the menu's own, set on `Dropdown.Content`; match it to the trigger by hand when they stand together. Destructive items go last, after a separator. Key hints only for shortcuts the app really handles. A context menu: `Dropdown.Anchor` around the row, `anchorPoint` from the `contextmenu` event, `open` driven by it.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the menu (closed while the exit animation plays) and on the trigger, `aria-expanded` on the trigger |
| dismiss | `closeOnEscape`, `closeOnOutsideClick` (both default `true`) | Escape and a press outside close the menu; `false` turns that way off |
| side | `side` and the room next to the trigger | `data-side` (resolved) |
| size | `size` on Content | `data-size` |
| item hover / focus | a hovering pointer, arrow keys | subtle fill (danger-soft for `danger`), no movement; a tap leaves no hover fill |
| item disabled | `disabled` | native `disabled` (a link item `aria-disabled="true"`), `data-disabled="true"`; no handler runs |
| item tone | `tone` | `data-tone` |
| item checked | `checked` / `defaultChecked` / `onCheckedChange` on `Dropdown.CheckboxItem` | `aria-checked`; an accent check mark at the end while checked, nothing while not |
| sheet | a phone viewport | a scrim and a full-width bottom sheet around the menu; the sheet carries `data-state`, the menu `data-sheet` and keeps its role and ref; page scroll locked; with `closeOnOutsideClick` an `aria-hidden` grab handle, and a swipe down from it closes the sheet |

Motion (`overlayMotion`): the menu grows out of the side that faces its trigger and fades, in and out over `fast`; as a sheet it slides up over `slow` and down over `base`. Content stays mounted until the exit ends; under `prefers-reduced-motion` it unmounts at once.

## Layout & spacing
- Width is `max-content` between `--prime-panel-min-width` and twice that; item labels never wrap, a `Dropdown.ItemDescription` wraps inside that limit.
- Max height = min(`--prime-panel-max-height`, the room on the resolved side); the menu scrolls inside.
- A checkbox item keeps the label (and an `ItemIcon`) on the left like any item; the check mark sits at the end.
- `Dropdown.ItemIcon` holds the glyph at the menu icon size (a kit `Icon` follows it); `Dropdown.ItemShortcut` is a `Kbd` one tier below the menu, pushed to the end of the item.
- `Dropdown.Header` lays out its children in the written order; `Dropdown.Title` is the medium heading line, `Dropdown.Description` the muted line under it; both truncate.
- Separators run edge to edge across the panel padding; group labels take `--prime-panel-group-label-height`.
- Kept `--prime-space-2` from viewport edges; follows the trigger on scroll and resize.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Space` | On the trigger opens the menu (focus on the first item); on an item runs it and returns focus to the trigger; on a checkbox item toggles it and the menu stays open. |
| `ArrowDown` · `ArrowUp` | On the trigger open the menu at its first item; in the menu move focus to the next / previous enabled item, wrapping. |
| `Home` · `End` | First / last enabled item. |
| `Escape` | Closes the menu (`closeOnEscape`); focus returns to the trigger. |
| `Tab` · `Shift+Tab` | Closes the menu; focus returns to the trigger (Tab then goes on to the next stop). |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The menu is `role="menu"` named by the control it opened from (the trigger, or the control inside `Dropdown.Anchor`), read from the page; items are `role="menuitem"`, checkbox items `role="menuitemcheckbox"` with `aria-checked`, disabled ones `disabled`. Items are no tab stops: one Tab leaves the menu.
- The trigger gets `aria-haspopup="menu"`, `aria-expanded`, `data-state` and, while open, `aria-controls`; the child's own `id` wins. Other props given to `Dropdown.Trigger` (handlers, ARIA, `ref`) reach the child, so a wrapping `Tooltip.Trigger` keeps working.
- With a `Dropdown.ItemDescription` the label names the item (`aria-labelledby`) and the description describes it (`aria-describedby`).
- An `asChild` item merges its props onto the link; the link's children are the item content. A disabled link item gets `aria-disabled` and its click is stopped.
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
| [sizes.tsx](examples/sizes.tsx) | Every size tier with icons, key hints and a destructive item; the tier is the menu's own, set on `Dropdown.Content`, not taken from its trigger — `size`. |
| [placement.tsx](examples/placement.tsx) | Every side and alignment relative to the trigger; near the viewport edge the menu flips and shifts — `side`, `align`. |
| [states.tsx](examples/states.tsx) | A regular, a disabled and a destructive item; arrow keys skip the disabled one — `disabled`, `tone`. |
| [item-description.tsx](examples/item-description.tsx) | A second line under an item: what an action does, and why a disabled one is unavailable, readable by everyone and read with the item — `Dropdown.ItemDescription`. |
| [link-items.tsx](examples/link-items.tsx) | Items that navigate are real links: Cmd-click or the context menu opens them in a new tab, a plain pick closes the menu — `asChild`. |
| [context-menu.tsx](examples/context-menu.tsx) | A right-click on a deal opens its menu at the pointer, and Escape or a pick returns focus to that row — `anchorPoint`, `Dropdown.Anchor`. |
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
- A Tooltip on a disabled item to say why → keyboard and touch users never see it; put the reason in `Dropdown.ItemDescription`.
- `onSelect={() => navigate(url)}` for an item that opens a page → `asChild` with a link, so Cmd-click and a new tab work.
- A hidden button placed at the pointer to anchor a context menu → `Dropdown.Anchor` around the row and `anchorPoint` from the `contextmenu` event.
- Expecting the menu to take the trigger's `size` → it has its own; set `size` on `Dropdown.Content`.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (the menu), [Kbd](../kbd/COMPONENT.md) (`ItemShortcut`), [Divider](../divider/COMPONENT.md) (`Separator`), `Icon` (`action.check` of `CheckboxItem`)
- **See also:** [Select](../select/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md), [Popover](../popover/COMPONENT.md), [Button](../button/COMPONENT.md)

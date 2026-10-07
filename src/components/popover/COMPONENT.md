# Popover

**Category:** overlays
**Kind:** overlay

> A non-modal floating panel anchored to a trigger: short forms, filters, confirmations, explanations.

## When to use
- Filters or quick settings tied to one button.
- A short form (invite, rename) that does not need a full dialog.
- A lightweight confirm next to a destructive action.
- An explanation with more than one sentence, or with a link, next to a term.

## When not to use
- A one-line hint on hover → use [Tooltip](../tooltip/COMPONENT.md).
- A list of actions or menu items → use [Dropdown](../dropdown/COMPONENT.md).
- Choosing a value from options → use [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md).
- A task that blocks the page or a long form → use [Modal](../modal/COMPONENT.md) or [Drawer](../drawer/COMPONENT.md).
- A date picker → use [Datepicker](../datepicker/COMPONENT.md) (built on Popover).

## Import
```tsx
import { Popover } from "prime-ui-kit";
```

## Anatomy
```
Popover.Root                 state and dismiss policy (no DOM)
├── Popover.Trigger          clones its child; toggles the panel
├── Popover.Anchor           instead of Trigger: positions the panel, no click / ARIA
└── Popover.Content          portaled role="dialog" on the floating surface, scrolls
    ├── Popover.Header       title + description, 4 apart
    │   ├── Popover.Title        <h2>, names the dialog
    │   └── Popover.Description  <p>, describes the dialog
    ├── …content
    └── Popover.Actions      buttons at the end
        └── Popover.Close    clones its child; closes on click
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Popover.Root
No DOM, no ref. Open state and dismiss policy.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, `Popover.Close`, Escape, outside press, code. |
| `closeOnOutsideClick` | `boolean` | `true` | A pointerdown outside the panel and its trigger closes it; focus follows the pointer. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the panel and returns focus to the trigger. |
| `children` | `ReactNode` | — (required) | Trigger (or Anchor) and Content. |

### Popover.Trigger · Popover.Anchor · Popover.Close
No DOM: clone the single child and merge `ref` and `onClick`. Trigger toggles the panel and adds `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, `data-state` (the child's own `id` wins); Anchor only positions the panel and keeps presses on it from dismissing (open state comes from `open`); Close closes the panel unless the child's handler calls `preventDefault()`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button (Anchor: any element, e.g. a toolbar). |

### Popover.Content
`ref` → `HTMLDivElement`. Portal + `role="dialog"` on the floating surface (a ScrollContainer); renders while open and during its exit animation. Named by `Popover.Title`, else by the trigger.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side; flips to the opposite side when there is no room. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment along the trigger; shifts inside the viewport. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the text, padding and gap; also the size context of the controls inside. |
| `matchTriggerWidth` | `boolean` | `false` | The panel is exactly as wide as the trigger and its text wraps. |
| `trapFocus` | `boolean` | `false` | Tab cycles inside the panel (forms); focus returns to the trigger on close. |
| `flush` | `boolean` | `false` | No inner padding and no gap: rows and dividers reach the panel edges; the content lays out its own spacing. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "role">` | — | `className` and the other attributes of the panel. |

### Popover.Header · Popover.Title · Popover.Description · Popover.Actions
`ref` → the element. `<div>` (title + description with a 4 px step) / `<h2>` (names the dialog) / `<p>` (describes it) / `<div>` (buttons at the end, stacked full width below 480 px). + native props.

## Variants
The panel has one look: `bg-raised` fill, `--prime-panel-radius`, `shadow-overlay`, no border. Fields inside get the surface field fill; cards inside become sunken tiles.

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | padding 12, gap 8, text 12/16 | Next to xs triggers | |
| `s` | padding 12, gap 8, text 13/20 | Dense toolbars | |
| `m` | padding 16, gap 12, text 14/20 | Most panels | yes |
| `l` | padding 16, gap 16, text 16/24 | l triggers, roomier forms | |
| `xl` | padding 20, gap 16, text 16/24 | xl triggers | |

Title uses the tier text size with title weight; Description uses the tier label size (m: 13/20) in `text-secondary`.

### side / align (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `side="bottom"` | Below the trigger, `--prime-panel-offset` away | Default | yes |
| `side="top"` | Above the trigger | Triggers near the bottom of the screen | |
| `side="left"` / `"right"` | Beside the trigger, aligned along its height | Triggers in a side rail or a narrow column | |
| `align="start"` | Start edges aligned | Default | yes |
| `align="center"` | Centred on the trigger | Small icon triggers | |
| `align="end"` | End edges aligned | Triggers at the end of a toolbar | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `matchTriggerWidth` | Panel exactly as wide as the trigger, text wraps | Full-width triggers in narrow columns | `false` |
| `trapFocus` | Tab cycles inside the panel | Forms inside the panel | `false` |
| `flush` | No padding, no gap; dividers run edge to edge | Panels of full-width rows ([SmartFilter](../smart-filter/COMPONENT.md)) | `false` |
| `closeOnOutsideClick={false}` | Stays open on an outside press | Destructive confirms | |
| `closeOnEscape={false}` | Escape does nothing | While a request of the panel runs | |

**Combinations** — panel `size` = trigger `size` = sizes of the buttons in Actions. Forms: `trapFocus` + Header + Actions. Destructive confirm: `closeOnOutsideClick={false}`, ghost neutral «Отмена» in `Popover.Close` and a solid `tone="danger"` action.

**Hierarchy** — one primary button in Actions (last), the rest `ghost` neutral.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state="open" \| "closed"` on the panel (closed while the exit animation plays) and on the trigger, `aria-expanded` on the trigger |
| side | `side` and the room next to the trigger | `data-side` (resolved) |
| size | `size` on Content | `data-size` |
| width | `matchTriggerWidth` | `data-match-trigger-width="true"` |
| flush | `flush` | `data-flush="true"` |
| opened from a menu or a list | inside Dropdown / Select / TagSelect panels | `data-overlay-stack="above-dropdown"`: the panel rises above that panel |

There is no `disabled` on Popover: a disabled trigger never opens it.

## Layout & spacing
- Width is `max-content` between `--prime-panel-min-width` and twice that, never wider than the viewport; give forms an explicit width with `className`.
- Max height follows the free space on the resolved side; the panel scrolls inside.
- Kept `--prime-space-2` from viewport edges; follows the trigger on scroll and resize.
- Actions: at the end, `--prime-space-2` gap; below 480px they stack full width.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` · `Space` | On the trigger: opens and closes the panel. |
| `Escape` | Closes the panel (`closeOnEscape`); focus returns to the trigger. |
| `Tab` | Moves through the panel content; with `trapFocus` it cycles inside the panel. |

### ARIA
- The panel is `role="dialog"` without `aria-modal`, named by `Popover.Title` (else by the trigger) and described by `Popover.Description`.
- The trigger gets `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`.
- An outside press closes the panel without moving focus back to the trigger: focus follows the pointer (foundation §8).
- Only the topmost layer reacts: a Select open inside the panel closes first.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A button opens a filter panel with a header and actions; buttons in `Popover.Close` close it — `Popover.Trigger`, `Popover.Close`. |
| [structure.tsx](examples/structure.tsx) | Optional parts: a panel with plain text only, and a panel with a title, a description and actions — `Popover.Header`, `Popover.Actions`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier with a header and actions; the panel takes the tier of its trigger — `size`. |
| [placement.tsx](examples/placement.tsx) | Every side and alignment relative to the trigger; near the viewport edge the panel flips and shifts — `side`, `align`. |
| [match-trigger-width.tsx](examples/match-trigger-width.tsx) | In a narrow column the panel takes the exact width of a full-width trigger and its text wraps — `matchTriggerWidth`. |
| [flush.tsx](examples/flush.tsx) | A notification list whose rows and dividers reach the panel edges; each row brings its own padding — `flush`. |
| [dismiss.tsx](examples/dismiss.tsx) | A destructive confirm that closes only from its buttons, and not at all while the request runs — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the open state: another button opens the panel from code and its own button closes it — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | An invite form in a panel: Tab stays inside, the role list does not count as an outside click, and submit closes the panel — `trapFocus`. |

## Mistakes
- A hint of a few words in a Popover → use Tooltip (hover / focus, no interactive content).
- A form without `trapFocus` → add it so Tab stays in the panel.
- Closing from inside through your own `open` state only → wrap the button in `Popover.Close`.
- A menu of actions built from buttons in a Popover → use Dropdown (roving focus, menu roles).

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (the panel)
- **See also:** [Tooltip](../tooltip/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [Modal](../modal/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md), [ColorPicker](../color-picker/COMPONENT.md)

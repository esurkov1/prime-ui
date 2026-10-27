# Popover

**Category:** overlays
**Kind:** overlay

> A non-modal floating panel anchored to a trigger: short forms, filters, confirmations, explanations.

## When to use
- Filters or quick settings tied to one button.
- A short form (invite, rename) that does not need a full dialog.
- A must-finish step tied to a button (a note, a reason) that closes only from its own buttons.
- An explanation with more than one sentence, or with a link, next to a term.
- A hint or a person card that opens on hover yet holds a link or a button (`openOn="hover"`) — what a Tooltip cannot hold.
- The details behind a status chip (a sync state, a record's health): a `Badge.Root` with its `tone` is the child of `Popover.Trigger` — the badge becomes the opener with a chevron, keeps its tone while open and takes `Badge.Description` for a second line.

## When not to use
- A one-line hint on hover → use [Tooltip](../tooltip/COMPONENT.md).
- A list of actions or menu items → use [Dropdown](../dropdown/COMPONENT.md).
- Choosing a value from options → use [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md).
- A task that blocks the page or a long form → use [Modal](../modal/COMPONENT.md) or [Drawer](../drawer/COMPONENT.md).
- Confirming a destructive action → use [ConfirmDialog](../confirm-dialog/COMPONENT.md).
- A date picker → use [Datepicker](../datepicker/COMPONENT.md) (built on Popover).

## Import
```tsx
import { Popover } from "prime-ui-kit";
```

## Anatomy
```
Popover.Root                 state and dismiss policy (no DOM)
├── Popover.Trigger          clones its child; toggles the panel (with openOn="hover": hover and focus open it)
├── Popover.Anchor           instead of Trigger: positions the panel, no click / ARIA; its control names a panel without a Title
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
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, hover (`openOn="hover"`), `Popover.Close`, Escape, outside press, code. |
| `closeOnOutsideClick` | `boolean` | `true` | A pointerdown outside the panel and its trigger closes it; focus follows the pointer. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the panel and returns focus to the trigger. |
| `openOnArrow` | `boolean` | `false` | ArrowDown and ArrowUp on the trigger open the panel, as on a picker whose trigger reads as a field (a colour, a period); Enter and Space open it either way. |
| `openOn` | `"click" \| "hover"` | `"click"` | `click`: a press toggles the panel. `hover`: a hover card — hover or keyboard focus on the trigger opens it after a delay, Tab moves in; for a hint with a link a Tooltip cannot hold. |
| `children` | `ReactNode` | — (required) | Trigger (or Anchor) and Content. |

### Popover.Trigger · Popover.Anchor · Popover.Close
No DOM: clone the single child and merge `ref` and `onClick`. Trigger toggles the panel and sets its ARIA; Anchor only positions the panel (open state comes from `open`), and its control names a panel without a Title; Close closes the panel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button (Anchor: any element, e.g. a toolbar). |

### Popover.Content
`ref` → `HTMLDivElement`. Portal + `role="dialog"` floating panel that scrolls inside, named by `Popover.Title` (else by the control it opened from). Below 640px of viewport, opened from a Trigger by a press, it is a bottom sheet (`data-sheet`); a hover panel stays anchored.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side; flips to the opposite side when there is no room. |
| `align` | `"auto" \| "start" \| "center" \| "end"` | `"auto"` | Alignment along the trigger. `auto` lines the panel up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix the edge. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the text, padding and gap; also the size context of the controls inside. |
| `width` | `"auto" \| "trigger" \| "min-trigger" \| "content"` | `"auto"` | `auto`: by content, panel minimum to twice that. `trigger`: exactly the trigger. `min-trigger`: `auto`, never narrower than the trigger. `content`: what the content needs. A sheet is full width. |
| `trapFocus` | `boolean` | `false` | Tab cycles inside the panel (forms). Without it Tab past the last (Shift+Tab before the first) stop closes the panel and returns focus to the trigger. |
| `initialFocus` | `boolean` | `true` with `Popover.Trigger`, `false` with `Popover.Anchor` or `openOn="hover"` | Focus moves into the panel on open (`[data-autofocus]`, else the first tab stop, else the panel). Turn it on for an anchored panel opened by a command, such as a Dropdown item, so focus does not stay on the menu trigger. |
| `flush` | `boolean` | `false` | No inner padding and no gap: rows and dividers reach the panel edges; the content lays out its own spacing. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "role">` | — | `className` and the other attributes of the panel. |

### Popover.Header · Popover.Title · Popover.Description · Popover.Actions
`ref` → `HTMLDivElement` / `HTMLHeadingElement` / `HTMLParagraphElement` / `HTMLDivElement`. `<div>` (title + description) / `<h2>` (names the dialog) / `<p>` (describes it) / `<div>` (buttons at the end; stacked in a sheet).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement \| HTMLHeadingElement \| HTMLParagraphElement>` | — | `className`, `children` and the other attributes; an own `id` on Title or Description is the one the panel points at. |

## Variants
The panel has one look: the floating layer of the ladder (`data-depth="floating"`), `--prime-panel-radius`, `shadow-overlay`, no border. Fields inside take that layer's fill; a card inside is the next layer, a flat tile.

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
| `align="auto"` | Lined up with the trigger edge that has more room: near the end of the screen the end edges meet and the panel grows toward the start, near the start the other way; below the trigger, flipping to the top without room | Default — triggers anywhere | yes |
| `align="end"` | End edges aligned: the panel grows toward the start | The panel must line up with the end of a block whatever room there is | |
| `align="center"` | Centred on the trigger | Small icon triggers | |
| `align="start"` | Start edges aligned: the panel grows toward the end | The panel must line up with the start of a block whatever room there is | |

### openOn (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `click` | A press on the trigger opens and closes the panel; focus moves into it | Filters, forms, confirmations | yes |
| `hover` | A hover card: the pointer resting on the trigger or keyboard focus on it opens the panel after 400 ms; it stays while the pointer is over the trigger or the panel (300 ms of grace bridge the gap) or focus is in either; focus stays on the trigger, Tab moves in; a press or a tap opens it at once and keeps it until a dismiss; no bottom sheet on a phone | A hint that holds a link («Подробнее»), a person or record card next to a name | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `trapFocus` | Tab cycles inside the panel | Forms inside the panel | `false` |
| `flush` | No padding, no gap; dividers run edge to edge | Panels of full-width rows ([SmartFilter](../smart-filter/COMPONENT.md)) | `false` |
| `closeOnOutsideClick={false}` | Stays open on an outside press | A must-finish step whose typed input a stray click must not lose | |
| `closeOnEscape={false}` | Escape does nothing | While a request of the panel runs | |
| `openOnArrow` (Root) | ArrowDown / ArrowUp on the trigger open the panel | A picker whose trigger reads as a field (a colour, a period) | `false` |

### width (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `auto` | As wide as the content, between `--prime-panel-min-width` and twice that | Most panels | yes |
| `trigger` | Exactly as wide as the trigger, below the minimum too; text wraps | Full-width triggers in narrow columns | |
| `min-trigger` | As `auto`, never narrower than the trigger | A panel under a wide anchor that must stay readable when the anchor is narrow ([SmartFilter](../smart-filter/COMPONENT.md)) | |
| `content` | What the content needs, within the viewport | A wide calendar, a table of limits | |

A bottom sheet is always full width, whatever `width` says.

**Combinations** — panel `size` = trigger `size` = sizes of the buttons in Actions. Forms: `trapFocus` + Header + Actions inside a `<form>`. A must-finish step: `closeOnOutsideClick={false}`, soft neutral «Отмена» in `Popover.Close` and the primary action; a destructive confirm is a [ConfirmDialog](../confirm-dialog/COMPONENT.md).

**Hierarchy** — one primary button in Actions (last), the rest `soft` neutral.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange`; with `openOn="hover"` also hover and keyboard focus | `data-state="open" \| "closed"` on the panel (closed while the exit animation plays) and on the trigger, `aria-expanded` on the trigger |
| dismiss | `closeOnEscape`, `closeOnOutsideClick` (both default `true`) | Escape and a press outside close the panel; `false` turns that way off |
| side | `side` and the room next to the trigger | `data-side` (resolved) |
| size | `size` on Content | `data-size` |
| width | `width` on Content | `data-width` on the anchored panel |
| flush | `flush` | `data-flush="true"` |
| sheet | a phone viewport, opened from a Trigger with `openOn="click"` (an Anchor keeps the panel next to its field, a hover panel next to its trigger) | a scrim and a full-width bottom sheet around the panel; the sheet carries `data-state`, the panel `data-sheet` and keeps its role and ref; page scroll locked; with `closeOnOutsideClick` an `aria-hidden` grab handle, and a swipe down from it closes the sheet |

There is no `disabled` on Popover: a disabled trigger never opens it.

Motion (`overlayMotion`): the panel grows out of the side that faces its trigger and fades, in and out over `fast`; as a sheet it slides up over `slow` and down over `base`. Content stays mounted until the exit ends; under `prefers-reduced-motion` it unmounts at once.

## Layout & spacing
- Width follows `width`: by default the content's width between `--prime-panel-min-width` and twice that, never wider than the viewport; give forms an explicit width with `className`.
- Max height follows the free space on the resolved side; the panel scrolls inside.
- Kept `--prime-space-2` from viewport edges; follows the trigger on scroll and resize.
- Actions: at the end, `--prime-space-2` gap; in a bottom sheet they stack full width.
- Bottom sheet (below 640px): the content stands on the sheet frame of every dialog sheet — `--prime-sheet-padding` (24) on the sides and below, its blocks 16 apart, no top air of its own under the grab strip (a touch target, 44, tall; the bar small); the bottom safe-area inset under it; as tall as the content up to the sheet top gap, on the on-screen keyboard's top edge while it is up. `flush` content keeps its own spacing.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Space` | On the trigger: opens the panel (focus moves into it) and closes it. |
| `Tab` | On the trigger of an open hover panel (`openOn="hover"`): moves focus to the first stop of the panel, which follows its trigger in the Tab order; Shift+Tab from that stop returns to the trigger with the panel open. |
| `ArrowDown` · `ArrowUp` | On the trigger with `openOnArrow`: opens the panel. |
| `Escape` | Closes the panel (`closeOnEscape`); focus returns to the trigger. |
| `Tab` | Moves through the panel content; with `trapFocus` it cycles inside the panel, without it Tab past the last stop closes the panel and goes on from the trigger. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The panel is `role="dialog"` without `aria-modal`, named by `Popover.Title` (its own `id` included), else by the control it opened from — the trigger, or the control inside `Popover.Anchor` — read from the page, and described by `Popover.Description`.
- The trigger gets `aria-haspopup="dialog"`, `aria-expanded`, `data-state` and, while open, `aria-controls`; the child's own `id` wins. Other props given to `Popover.Trigger` (handlers, ARIA, `ref`) reach the child, so a wrapping `Tooltip.Trigger` keeps working.
- Opened from a Trigger, focus moves into the panel: `[data-autofocus]`, else the first tab stop, else the panel. Opened at a `Popover.Anchor`, focus stays in the anchor (`initialFocus` moves it in), and presses on the anchor do not dismiss the panel.
- With `openOn="hover"` keyboard focus on the trigger opens the panel as the pointer does, and focus stays on the trigger; focus moving out of both the trigger and the panel closes it, and focus handed back to the trigger by a close does not reopen it. Content that holds links or buttons belongs here, not in a Tooltip (`role="tooltip"` takes no focus).
- `Popover.Close` closes the panel and returns focus to the trigger, unless the child's own `onClick` calls `preventDefault()`.
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
| [sizes.tsx](examples/sizes.tsx) | Every size tier with a header and actions; the tier is the panel's own, set on `Popover.Content`, not taken from its trigger — `size`. |
| [placement.tsx](examples/placement.tsx) | Every side and alignment relative to the trigger; near the viewport edge the panel flips and shifts — `side`, `align`. |
| [width.tsx](examples/width.tsx) | In a narrow column the panel takes the exact width of a full-width trigger and its text wraps; a short trigger opens a panel at least as wide as itself; a table of limits takes the width it needs — `width`. |
| [flush.tsx](examples/flush.tsx) | A notification list whose rows and dividers reach the panel edges; each row brings its own padding — `flush`. |
| [from-menu.tsx](examples/from-menu.tsx) | A menu command opens a panel at the same button: the rename item shows a form anchored to the menu button and focus lands in its field, not back on that button — `Popover.Anchor`, `initialFocus`. |
| [hover-card.tsx](examples/hover-card.tsx) | A hint that holds a link and a person card open on hover and keyboard focus, and Tab moves into them — `openOn`. |
| [status-chip.tsx](examples/status-chip.tsx) | A status chip that opens its details: the badge is the trigger, keeps its tone while the panel is open and shows the time on a second line — `Popover.Trigger`, `Badge.Description`. |
| [dismiss.tsx](examples/dismiss.tsx) | A note being typed is not lost to a stray click: the panel closes only from its buttons, and not at all while the note is saved — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the open state: another button opens the panel from code, and the panel's own button in `Popover.Close` closes it — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | An invite form in a panel: Tab stays inside, the role list does not count as an outside click, an invalid email shakes the field and keeps the panel open until it is fixed — `trapFocus`, `error`. |

## Mistakes
- A Popover opened from a Dropdown item with `Popover.Anchor` and no `initialFocus` → focus returns to the menu button and the panel is out of keyboard reach; set `initialFocus`.
- A hint of a few words in a Popover → use Tooltip (hover / focus, no interactive content).
- A link or a button inside a Tooltip → a Popover with `openOn="hover"`: the pointer reaches it and Tab moves into it.
- A hover panel whose trigger is not focusable (a plain `<span>`) → keyboard users never open it; the trigger is a button or a link.
- A status chip as the opener through `Popover.Anchor` and the badge's `pressed` triad → put the badge in `Popover.Trigger`: it gets `aria-expanded` and keeps its status tone; pressed is a toggle's selected look, not an open state.
- A form without `trapFocus` → add it so Tab stays in the panel.
- Closing from inside through your own `open` state only → wrap the button in `Popover.Close`.
- A menu of actions built from buttons in a Popover → use Dropdown (roving focus, menu roles).
- A destructive confirm in a Popover → use ConfirmDialog (the request, its pending state and its failure are inside).
- `width="trigger"` on a panel whose content cannot wrap (a table, a calendar) → `width="content"`.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (the panel)
- **See also:** [Tooltip](../tooltip/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md), [ColorPicker](../color-picker/COMPONENT.md)

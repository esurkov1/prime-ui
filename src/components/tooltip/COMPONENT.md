# Tooltip

**Category:** overlays
**Kind:** overlay

> A short hint that appears next to an element on hover or keyboard focus.

## When to use
- Name and shortcut of an icon-only button.
- Why a control is disabled (wrap the disabled control in a focusable element).
- A one-line definition of a term or abbreviation.

## When not to use
- Content with links, buttons or fields, or anything the user must read to continue → use [Popover](../popover/COMPONENT.md).
- A list of actions → use [Dropdown](../dropdown/COMPONENT.md).
- Help text under a field → use the field `hint` or [Hint](../hint/COMPONENT.md).
- Status messages → use [Notification](../notification/COMPONENT.md) or [Banner](../banner/COMPONENT.md).
- The only label of an icon-only button → the button still needs `aria-label`; the tooltip only repeats it.

## Import
```tsx
import { Tooltip } from "prime-ui-kit";
```

## Anatomy
```
Tooltip.Provider        optional; delay and skip-delay group for a subtree
└── Tooltip.Root        state of one tooltip (no DOM)
    ├── Tooltip.Trigger clones its single child element and adds handlers
    └── Tooltip.Content portaled role="tooltip" chip
        └── arrow       decorative svg pointing at the trigger's centre
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Tooltip.Root
No DOM, no ref. State of one tooltip; without a Provider it joins the kit-wide default group (400 / 300).

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on hover, focus, blur, pointer-leave, press, Escape, and when a neighbour in the group opens. |
| `delayDuration` | `number` | `400` | Show delay in ms for this tooltip (the Provider's when omitted); hiding never waits for it. |
| `children` | `ReactNode` | — (required) | Tooltip.Trigger and Tooltip.Content. |

### Tooltip.Provider
No DOM, no ref. Its tooltips form a group: one is open at a time, and once one has been shown the next opens at once and without motion, until `skipDelayDuration` passes with none open.

| Prop | Type | Default | Description |
|---|---|---|---|
| `delayDuration` | `number` | `400` | Show delay in ms for every Tooltip.Root inside. |
| `skipDelayDuration` | `number` | `300` | Window in ms after a tooltip closes during which the next one opens instantly. |
| `children` | `ReactNode` | — (required) | Subtree. |

### Tooltip.Trigger
No DOM: clones the single child, composes its `ref`, appends the tooltip id to its `aria-describedby` while open, sets `data-state` and chains `onPointerEnter`, `onPointerLeave`, `onPointerDown`, `onFocus`, `onBlur`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One focusable element: a Button, or a `tabIndex={0}` wrapper around a disabled control. |

### Tooltip.Content
`ref` → `HTMLDivElement`. Portaled `role="tooltip"` chip with an arrow; renders while open and during its exit animation, placed before paint.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Preferred side; flips to the opposite one when it does not fit, then shifts inside the viewport. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the trigger: its start edge, centre or end edge; the arrow keeps pointing at the trigger. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Text and padding tier; also the size context of controls inside (a Kbd). |
| `children` | `ReactNode` | — (required) | Hint text, optionally with a Kbd. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "role" \| "onPointerEnter" \| "onPointerLeave">` | — | `className`, `style` and the other attributes of the chip. |

## Variants
Tooltip has no `variant` or `tone`: it is always a flat inverse chip (`tooltip-bg`, `tooltip-text`) — dark in the light theme, light in the dark one — with an arrow and no shadow, so it reads the same on every layer. The chip is a host of its own: it points the text and fill roles at `tooltip-muted` / `tooltip-fill`, so a Kbd or a secondary line inside reads on it. Content flows inline: a label and its key stay on one line, block children stack. The arrow (`--prime-tooltip-arrow-width` × `--prime-tooltip-arrow-height`) always points at the trigger's centre, also after flipping, aligning or shifting, and never slides into the chip's rounded corner.

### size (Content)
A chip of tier T is as tall as a menu item of tier T; text, padding and radius step together (`--prime-tooltip-<tier>-*`).

| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 12/16, padding 4 × 6, radius 4 — 24 tall | Next to xs controls | |
| `s` | 12/16, padding 6 × 8, radius 6 — 28 tall | Dense toolbars, s controls | |
| `m` | 13/20, padding 6 × 10, radius 6 — 32 tall | Most controls | yes |
| `l` | 14/20, padding 8 × 12, radius 8 — 36 tall | l controls, longer sentences | |
| `xl` | 16/24, padding 8 × 16, radius 8 — 40 tall | xl controls | |

### side (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `top` | Centred above the trigger, `--prime-tooltip-offset` away (the arrow sits in the gap) | Buttons in content | yes |
| `bottom` | Centred below the trigger | Toolbars at the top of a screen | |
| `left` | Vertically centred, to the left | Triggers near the right edge | |
| `right` | Vertically centred, to the right | Sidebar / rail icons | |

### align (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | Chip starts at the trigger's start edge | Wide triggers, triggers at a container's start | |
| `center` | Chip centred on the trigger | Most triggers | yes |
| `end` | Chip ends at the trigger's end edge | Triggers at a container's end | |

**Combinations** — size of the tooltip = size of the trigger control; a Kbd inside takes the tier one step down by itself.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | hover (mouse, pen) or focus after `delayDuration`; `open` / `onOpenChange` | `data-state="open" \| "closed"` on the chip (closed during the exit) and on the trigger |
| closing | blur, a press on the trigger, Escape, pointer leaving (unless it moves onto the chip) | — |
| warm group | another tooltip of the Provider was just shown | `data-instant="true"`: opens and leaves without motion |
| side | `side` and the room around the trigger | `data-side` (resolved), `data-align` |
| size | `size` | `data-size` |

## Layout & spacing
- Max width `--prime-tooltip-max-width`, never wider than the viewport minus `--prime-space-4`; text wraps (`overflow-wrap: anywhere`).
- Kept `--prime-space-2` from viewport edges; repositions on scroll and resize.
- Enter / exit come from the shared overlay motion (fade + `--prime-space-1` + scale 0.98, fast), growing from the arrow tip; instant inside a warm group.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Focus on the trigger opens the tooltip after the delay. |
| `Escape` | Hides the tooltip; focus stays on the trigger. |

### ARIA
- The chip is `role="tooltip"`; while open the trigger points at it with `aria-describedby`.
- The tooltip is a description, not the name: an icon-only button needs its own `aria-label`.
- The pointer may move onto the chip without closing it (WCAG 1.4.13); a touch does not open it, focus does.
- A natively `disabled` button gets no events: wrap it in `<span tabIndex={0}>`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An icon-only button with a tooltip that repeats its name on hover and keyboard focus — `Tooltip.Trigger`, `Tooltip.Content`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier next to buttons of the same tier; take the tier of the control it describes — `size`. |
| [placement.tsx](examples/placement.tsx) | Every side, and start / end alignment along the trigger; without room the chip flips and shifts, the arrow keeps pointing at the trigger — `side`, `align`. |
| [toolbar.tsx](examples/toolbar.tsx) | A formatting toolbar in one group: after the first tooltip the neighbours open at once, each with its name and shortcut — `Tooltip.Provider`. |
| [disabled-trigger.tsx](examples/disabled-trigger.tsx) | Why an action is unavailable: a disabled button inside a focusable wrapper still shows its tooltip on hover and Tab — `Tooltip.Trigger`. |
| [delay.tsx](examples/delay.tsx) | The show delay of one tooltip: at once, the default 400 ms and one second — `delayDuration`. |
| [long-content.tsx](examples/long-content.tsx) | A sentence of explanation wraps at the tooltip max width; anything with actions belongs in a Popover — `Tooltip.Content`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the open state: a switch shows the tooltip from code, hover and focus still work — `open`, `onOpenChange`. |

## Mistakes
- Tooltip on a `disabled` button directly → wrap the button in a focusable `span`.
- Links or buttons inside Tooltip.Content → use Popover.
- Several children inside Tooltip.Trigger → exactly one element.
- Relying on the tooltip as the button's name → add `aria-label` to the button.
- A Provider per tooltip in a toolbar → one Provider around the toolbar, so neighbours open instantly.

## Related
- **Built from:** —
- **See also:** [Popover](../popover/COMPONENT.md), [Kbd](../kbd/COMPONENT.md), [Button](../button/COMPONENT.md), [Hint](../hint/COMPONENT.md)

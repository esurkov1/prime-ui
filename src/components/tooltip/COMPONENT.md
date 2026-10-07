# Tooltip

**Category:** overlays

> A short hint that appears next to an element on hover or keyboard focus.

## When to use
- Name and shortcut of an icon-only button.
- Why a control is disabled (wrap the disabled control in a focusable element).
- A one-line definition of a term or abbreviation in text.

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
Tooltip.Provider        optional; shared show delay for a subtree
└── Tooltip.Root        state of one tooltip (no DOM)
    ├── Tooltip.Trigger clones its single child element and adds handlers
    └── Tooltip.Content portaled role="tooltip" chip
```

## API

### Tooltip.Provider
No DOM, no ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `delayDuration` | `number` | `400` | Show delay in ms for every Tooltip.Root inside. |
| `children` | `ReactNode` | — (required) | Subtree. |

### Tooltip.Root
No DOM, no ref. Works without a Provider (delay 400).

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on hover, focus, blur, pointer-leave and Escape. |
| `delayDuration` | `number` | from Provider (`400`) | Show delay in ms for this tooltip; hiding is immediate. |
| `children` | `ReactNode` | — (required) | Tooltip.Trigger and Tooltip.Content. |

### Tooltip.Trigger
No DOM of its own: clones the child (`cloneElement`), like `asChild`. Sets the child's `ref` (a `ref` on the child is replaced), merges `className`, appends `aria-describedby` while open, sets `data-state`, and chains `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | Exactly one focusable element (Button, a `<button>`, a `tabIndex={0}` span around a disabled control). |
| `className` | `string` | — | Merged with the child's `className`. |

### Tooltip.Content
No ref. Rendered in a portal only while open (and during its exit animation).

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Preferred side; flips to the opposite side when it does not fit, then shifts inside the viewport. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Text and padding tier; also the size context for controls inside (e.g. Kbd). |
| `className` | `string` | — | Extra class on the chip. |
| `children` | `ReactNode` | — (required) | Hint text, optionally with a Kbd. |

## Variants
Tooltip has no `variant` or `tone`: it is always a flat inverse chip (`tooltip-bg`, `tooltip-text`), no arrow, no shadow, so it reads the same on canvas, cards and floating layers.

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | caption 12/16, padding 4 × 8, radius 6 | Next to xs controls | |
| `s` | caption 12/16, padding 4 × 8 | Dense toolbars, s controls | |
| `m` | caption 12/16, padding 4 × 8 | Most controls | yes |
| `l` | body-s 13/20, padding 4 × 8 | l controls, longer sentences | |
| `xl` | body-s 13/20, padding 8 × 12 | xl controls | |

### side (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `top` | Centred above the trigger, `--prime-space-1` away | Default for buttons in content | yes |
| `bottom` | Centred below the trigger | Toolbars at the top of a screen | |
| `left` | Vertically centred, to the left | Triggers near the right edge | |
| `right` | Vertically centred, to the right | Sidebar / rail icons | |

**Combinations** — size of the tooltip = size of the trigger control; inside the chip use `Kbd` one tier smaller (`size="s"` tooltip → `size="xs"` Kbd).

## States
- Closed / open: uncontrolled by default; `open` + `onOpenChange` for controlled. Opens after `delayDuration` on mouse-enter or focus; closes immediately on mouse-leave, blur or Escape.
- Content DOM: `data-state="open" | "closed"` (closed during the fade-out), `data-size`, `data-side` (the resolved side after flipping), `data-positioned="true"` after the first measurement (invisible before), `data-overlay-portal-layer` (z-index layer when inside Modal / Drawer).
- Trigger DOM: `data-state="open" | "closed"` on the child.
- The chip has `pointer-events: none`, so it never blocks clicks on the trigger.

## Layout & spacing
- Max width `--prime-tooltip-max-width`, never wider than the viewport minus `--prime-space-4`; text wraps (`overflow-wrap: anywhere`).
- Kept `--prime-space-2` from viewport edges; repositions on scroll and resize.
- Enter / exit motion comes from the shared overlay motion (fade + 4px from the anchor, fast).

## Accessibility
- Content has `role="tooltip"`; the trigger gets `aria-describedby` pointing at it while open.
- Opens on keyboard focus, closes on Escape with focus staying on the trigger (WAI-ARIA tooltip pattern).
- The trigger must be focusable. A natively `disabled` button gets no pointer or focus events: wrap it in `<span tabIndex={0}>`.
- Icon-only buttons need their own `aria-label`; the tooltip is a description, not the name.
- No `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | `size` xs → xl next to matching buttons | Matching the tooltip to the control tier |
| [long-content.tsx](examples/long-content.tsx) | Long text wrapping at max width (also shown on canvas, card and floating surfaces) | One-sentence explanations |
| [states.tsx](examples/states.tsx) | Hover/focus, disabled button in a focusable span, inline term | Explaining unavailable actions and terms |
| [side.tsx](examples/side.tsx) | `side` top · bottom · left · right | Placing near edges and in toolbars |
| [controlled.tsx](examples/controlled.tsx) | `open` + `onOpenChange` driven by a Switch | Showing the hint programmatically |
| [composition.tsx](examples/composition.tsx) | Icon-only toolbar with names and Kbd shortcuts | Toolbars |
| [delay.tsx](examples/delay.tsx) | `delayDuration` 0 · default · 1000 | Tuning the show delay |

```tsx
import { Button, Tooltip } from "prime-ui-kit";

export function Example() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Экспорт
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>Выгрузка займёт около минуты</Tooltip.Content>
    </Tooltip.Root>
  );
}
```

## Mistakes
- Tooltip on a `disabled` button directly → wrap the button in a focusable `span`.
- Links or buttons inside Tooltip.Content → use Popover.
- Several children inside Tooltip.Trigger → exactly one element.
- Relying on the tooltip as the button's name → add `aria-label` to the button.
- Passing a `ref` to the trigger child and expecting it to be kept → the trigger replaces it.

## Related
[Popover](../popover/COMPONENT.md) · [Kbd](../kbd/COMPONENT.md) · [Button](../button/COMPONENT.md) · [Hint](../hint/COMPONENT.md)

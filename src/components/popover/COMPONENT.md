# Popover

**Category:** overlays

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
- A date picker → use [Datepicker](../datepicker/COMPONENT.md) (built on the same panel).

## Import
```tsx
import { Popover } from "prime-ui-kit";
```

## Anatomy
```
Popover.Root               state (no DOM)
├── Popover.Trigger        clones its single child (usually a Button)
└── Popover.Content        portaled panel, role="dialog", scrolls (ScrollContainer)
    ├── Popover.Header     title + description, 4 apart
    │   ├── Popover.Title        <h2>, names the dialog
    │   └── Popover.Description  <p>, describes the dialog
    ├── …content
    └── Popover.Actions    buttons at the end, right-aligned
```

## API

### Popover.Root
No DOM, no ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on trigger click, Escape and outside press. |
| `closeOnOutsideClick` | `boolean` | `true` | A pointerdown outside the panel and its trigger closes it. |
| `children` | `ReactNode` | — (required) | Trigger and Content. |

### Popover.Trigger
No DOM of its own: clones the child (`cloneElement`), like `asChild`. Merges the child's `ref`, sets `id`, `aria-expanded`, `aria-haspopup="dialog"`, `aria-controls`, `data-state`, and chains `onClick` (toggles).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | Exactly one element (Button, a `<button>` styled as a link). |

### Popover.Content
No ref. Rendered in a portal while open and during its exit animation.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"bottom" \| "top"` | `"bottom"` | Preferred side; flips when it does not fit. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Horizontal alignment to the trigger. |
| `sameMinWidthAsTrigger` | `boolean` | `false` | The panel takes the trigger width (not wider than the panel max width and viewport). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Padding, gap and text tier; size context for controls inside. |
| `trapFocus` | `boolean` | `false` | Moves focus into the panel and keeps Tab inside; focus returns to the trigger on close. |
| `insetPadding` | `"none" \| "x1" \| "x2" \| "x3"` | `"none"` | Extra padding on top of the tier padding: +4 · +8 · +12. |
| `insetGap` | `"none" \| "pad" \| "x2" \| "x3" \| "x4"` | `"pad"` | Gap between direct children: tier gap, or 0 · 8 · 12 · 16. |
| `stackAboveDropdown` | `boolean` | `false` | Raise the panel above a dropdown / listbox of the same layer (trigger inside a Select, TagSelect or Dropdown panel). |
| `className` | `string` | — | Extra class on the panel (e.g. a fixed width). |
| `children` | `ReactNode` | — (required) | Panel content. |

### Popover.Header · Popover.Actions
No ref. + native `<div>` props.

### Popover.Title
No ref. Renders `<h2>`; without an own `id` it becomes the dialog name (`aria-labelledby`). + native heading props.

### Popover.Description
No ref. Renders `<p>`; without an own `id` it becomes the dialog description (`aria-describedby`). + native `<p>` props.

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
| `side="bottom"` | Below the trigger, `--prime-space-1` away | Default | yes |
| `side="top"` | Above the trigger | Triggers near the bottom of the screen | |
| `align="start"` | Start edges aligned | Default, LTR reading | yes |
| `align="center"` | Centred under the trigger | Small icon triggers | |
| `align="end"` | End edges aligned | Triggers at the right edge | |

### insetPadding / insetGap
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `insetPadding="none"` | Tier padding only | Default | yes |
| `insetPadding="x1"` · `"x2"` · `"x3"` | +4 · +8 · +12 padding | Airy marketing/explainer panels | |
| `insetGap="pad"` | Tier gap (8 / 12 / 16) | Default | yes |
| `insetGap="none"` | No gap between children | Own layout inside | |
| `insetGap="x2"` · `"x3"` · `"x4"` | 8 · 12 · 16 gap | Fixed rhythm independent of size | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `sameMinWidthAsTrigger` | Panel as wide as the trigger | Full-width triggers in narrow columns | `false` |
| `trapFocus` | Focus moves into the panel | Forms inside the panel | `false` |
| `stackAboveDropdown` | Higher z-index on the same layer | Popover opened from inside a listbox | `false` |

**Combinations** — panel `size` = trigger `size` = sizes of the buttons in Actions. Forms: `trapFocus` + Header + Actions. Destructive confirm: Actions with ghost neutral «Отмена» and solid `tone="danger"` primary.

**Hierarchy** — one primary button in Actions (last), the rest `ghost` neutral.

## States
- Closed / open: uncontrolled by default; `open` + `onOpenChange` for controlled. There is no `disabled` on Popover: a disabled trigger simply never opens it.
- Panel DOM: `data-state="open" | "closed"`, `data-side` (resolved), `data-size`, `data-inset-padding`, `data-inset-gap`, `data-overlay-portal-layer`, `data-overlay-stack="above-dropdown"` (with `stackAboveDropdown`).
- Trigger DOM: `data-state="open" | "closed"`, `aria-expanded`.

## Layout & spacing
- Width is `max-content` between `--prime-panel-min-width` and twice that, never wider than the viewport; set an explicit width with `className` for forms.
- Max height follows the free space on the resolved side; the panel scrolls inside.
- Kept `--prime-space-2` from viewport edges; repositions on scroll / resize.
- Actions: right-aligned, `--prime-space-2` gap; below 480px they stack full width.

## Accessibility
- Panel: `role="dialog"`, `aria-modal="false"`, named by Popover.Title (or by the trigger when there is no Title), described by Popover.Description.
- Trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`.
- Dismiss (foundation §8): Escape closes and returns focus to the trigger; an outside press closes without moving focus back (focus follows the pointer). Clicks inside nested layers (a Select list inside the panel) do not close it. Only the topmost layer reacts.
- Use `trapFocus` for forms so keyboard users land inside the panel.
- No `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | `size` xs → xl with header and actions | Matching the panel to the trigger |
| [inset-variants.tsx](examples/inset-variants.tsx) | `insetPadding` / `insetGap` | Custom density |
| [states.tsx](examples/states.tsx) | Destructive confirm, disabled trigger | Confirming next to the action |
| [placement.tsx](examples/placement.tsx) | `side` × `align` | Placing near edges |
| [controlled.tsx](examples/controlled.tsx) | `open` + `onOpenChange` from the parent | Opening from other UI |
| [composition.tsx](examples/composition.tsx) | Report filters with SegmentedControl and checkboxes | Filters / quick settings |
| [full-width.tsx](examples/full-width.tsx) | `sameMinWidthAsTrigger` | Narrow columns |
| [as-child.tsx](examples/as-child.tsx) | Text-link button as the trigger | Inline explanations |
| [features.tsx](examples/features.tsx) | Invite form with `trapFocus` and a nested Select | Short forms |

```tsx
import { Button, Popover } from "prime-ui-kit";

export function Example() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Условия тарифа
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>
          <Popover.Title>Тариф «Бизнес»</Popover.Title>
          <Popover.Description>До 10 пользователей и 50 ГБ хранилища.</Popover.Description>
        </Popover.Header>
      </Popover.Content>
    </Popover.Root>
  );
}
```

## Mistakes
- `side="left"` / `"right"` → Popover supports only `top` and `bottom`.
- A form without `trapFocus` → add it so Tab stays in the panel.
- A popover opened from inside a Select/Dropdown panel hides behind it → `stackAboveDropdown`.
- Menu of actions built from buttons in a Popover → use Dropdown (roving focus, menu roles).

## Related
[Tooltip](../tooltip/COMPONENT.md) · [Dropdown](../dropdown/COMPONENT.md) · [Modal](../modal/COMPONENT.md) · [Datepicker](../datepicker/COMPONENT.md) · [ColorPicker](../color-picker/COMPONENT.md)

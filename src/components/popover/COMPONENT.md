# Popover

**Default sizing:** when designing screens and examples, start with **`m`** for `size` (where a size axis exists) unless the scenario explicitly needs another value.

## About

A composite “anchor + portaled panel”: clicking the trigger toggles a non-modal dialog next to the anchor, positioned toward the viewport edge and dismissible with Escape or an outside click.

- **Use** for short contextual panels—help text, compact filters, a few fields or actions—without leaving the page or blocking the whole UI.
- **Use** when content should stay visually tied to a specific control (metrics, footnotes, inline configuration).
- **Do not use** for full-screen or blocking flows; prefer [Modal](../modal/COMPONENT.md).
- **Do not use** for hover-only hints; prefer [Tooltip](../tooltip/COMPONENT.md).
- **Do not use** expecting left/right placement relative to the anchor; only **top** and **bottom** sides are supported.
- **Do not use** with multiple or fragment children under `Popover.Trigger`; exactly **one** element is supported.

## Composition

- **`Popover.Root`** — holds open state (controlled or uncontrolled), stable ids for trigger and content, and the trigger element ref used for positioning.
- **`Popover.Trigger`** — must wrap **exactly one** `React` element; ref, `aria-*`, and click-to-toggle are merged onto that child (`cloneElement`).
- **`Popover.Content`** — rendered in a **portal** only when open; root is a scroll container with `role="dialog"`, positioned from the trigger via `side` / `align`, wraps children in `ControlSizeProvider` when `size` is set, and applies optional **`insetPadding`** / **`insetGap`** on the same node (`data-inset-padding`, `data-inset-gap`).

### Minimal example

```tsx
import { Button, Popover } from "prime-ui-kit";

export function Example() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root type="button">Open</Button.Root>
      </Popover.Trigger>
      <Popover.Content insetPadding="x2" insetGap="x3">
        Panel
      </Popover.Content>
    </Popover.Root>
  );
}
```

### Canonical panel (reference)

Typical English recipe: stroke **`Button.Root`** trigger, **`insetPadding` / `insetGap`**, and short body copy. Source of truth (stays in sync with the snippet mindset below): **`examples/canonical-panel.tsx`**.

```tsx
import { Button, Popover, Typography } from "prime-ui-kit";

export function ShippingEstimatePopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          View details
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom" size="m">
        <Typography.Root as="p" variant="body-small" weight="semibold">
          Shipping estimate
        </Typography.Root>
        <Typography.Root as="p" variant="body-small">
          Arrives Tuesday–Thursday for metro addresses. Rural routes may add one business day.
        </Typography.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
```

### Example files in `examples/`

Runnable demos live next to this file. Imports use **`"prime-ui-kit"`** so the same snippets work in an app after installing the package.

| File | Intent |
|------|--------|
| `canonical-panel.tsx` | Default composition: stroke trigger, inset spacing, short copy |
| `date-trigger.tsx` | Date-style trigger label; native **`type="date"`** field; **`trapFocus`** |
| `rich-content.tsx` | Badges, **`Divider`**, **`Hint`** — denser non-modal panel |
| `placement.tsx` | **`side`** and **`align`** grid; flip behavior called out in copy |
| `form-in-popover.tsx` | Controlled root, small form, **`trapFocus`**, submit closes |

Broader Russian demos and layout variants: **`playground/snippets/popover/`** (for example `composition.tsx`, `placement.tsx`, `controlled.tsx`).

### Extended usage

- **Controlled popovers:** pass **`open`** and **`onOpenChange`** on **`Popover.Root`**; keep **`Popover.Trigger`** and **`Popover.Content`** as siblings. Close from inside the panel by calling the same setter or relying on outside click / Escape.
- **Forms and focus:** set **`trapFocus={true}`** on **`Popover.Content`** when several controls should keep Tab cycles inside the panel (see **`examples/form-in-popover.tsx`** and **`examples/date-trigger.tsx`**).
- **Match trigger width:** use **`sameMinWidthAsTrigger`** when the panel should align visually with a full-width or fixed-width anchor (still bounded by max width and viewport).
- **Nested Select:** portaled Select listbox clicks owned by the panel are not treated as outside closes (see `isPortaledSelectListboxOwnedByContainer` in implementation).
- **Density:** tune **`size`** on **`Popover.Content`** for nested controls and **`insetPadding` / `insetGap`** for internal vertical rhythm; optional **`className`** on **`Content`** for scoped layout hooks.

### Note for LLMs

When generating **Popover** markup for this library: (1) **`Popover.Trigger`** accepts **exactly one** child element—no fragments or multiple nodes. (2) Prefer **`Button.Root`**, **`LinkButton.Root`**, or another kit control as the trigger so sizing and focus styles stay on the design-system tier. (3) Only **`side="top"`** and **`side="bottom"`** are valid; do not assume left/right anchoring. (4) For copy-paste starting points, mirror **`examples/canonical-panel.tsx`**, then adapt **`date-trigger.tsx`**, **`rich-content.tsx`**, **`placement.tsx`**, or **`form-in-popover.tsx`**. (5) Do not wrap kit components to restyle them; use **`size`**, **`variant`**, **`mode`**, **`insetPadding`**, **`insetGap`**, and documented props only.

## Rules

- **Uncontrolled:** use `defaultOpen` on `Popover.Root` for the initial open state after mount.
- **Controlled:** pass `open` and `onOpenChange` together; parent can open or close from outside logic.
- When closed, **`Popover.Content`** returns `null` (nothing is mounted in the portal).
- **`trapFocus`** on `Popover.Content` keeps Tab cycling inside the panel while open and restores focus on close when enabled.
- **Escape** and **outside click** call close; clicks on a portaled **Select** listbox that belongs to the panel are ignored as outside (see `isPortaledSelectListboxOwnedByContainer`).
- **Non-modal:** `aria-modal={false}`—focus can leave the page; this is intentional for a lightweight overlay.
- Trigger receives **`aria-expanded`**, **`aria-haspopup="dialog"`**, and **`aria-controls`** pointing at the content id; **`aria-labelledby`** on the panel references the trigger id—give the anchor a visible name or **`aria-label`** when there is no text.
- There is no popover-level **`disabled`**; if the anchor (e.g. [Button](../button/COMPONENT.md)) is disabled, it will not open.
- **`asChild`** exists for slot API compatibility; merging always applies to the single child—**`asChild={false}`** does not render an internal button.
- Density: tune **`Popover.Content` `size`** for the control tier and **`insetPadding` / `insetGap`** for inner spacing; optional **`className`** on `Content` for further styling.

## API

### Popover.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| open | `boolean` | — | No | Controlled open state; use with `onOpenChange`. |
| defaultOpen | `boolean` | `false` | No | Initial state in uncontrolled mode. |
| onOpenChange | `(open: boolean) => void` | — | No | Fires when opening or closing (trigger, Escape, outside click). |
| children | `React.ReactNode` | — | Yes | Typically `Popover.Trigger` and `Popover.Content`. |

### Popover.Trigger

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactElement` | — | Yes | Single anchor element; ref, ARIA, and click handler are merged in. |
| asChild | `boolean` | `true` | No | Reserved for slot API compatibility; behavior always merges with the single child. |

### Popover.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| align | `"start" \| "center" \| "end"` | `"start"` | No | Horizontal alignment of the panel relative to the trigger. |
| side | `"bottom" \| "top"` | `"bottom"` | No | Preferred side; layout may flip at the viewport edge. |
| sameMinWidthAsTrigger | `boolean` | `false` | No | Panel min width matches the trigger (`border-box`), still subject to panel max width and viewport. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Control density tier for nested controls via `ControlSizeProvider`. |
| trapFocus | `boolean` | `false` | No | Trap focus inside the panel while open. |
| insetPadding | `"none" \| "x1" \| "x2" \| "x3"` | `"none"` | No | Extra inset padding relative to the panel tier (`data-inset-padding`). |
| insetGap | `"none" \| "x2" \| "x3" \| "x4"` | `"none"` | No | Vertical gap between direct children (`data-inset-gap`). |
| className | `string` | — | No | Extra class on the panel root. |
| children | `React.ReactNode` | — | Yes | Panel body. |

## Related

- [Button](../button/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md) — typical triggers.
- [Select](../select/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md) — nested overlays; Select listbox clicks are treated as inside the popover when owned by the panel.
- [Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [Checkbox](../checkbox/COMPONENT.md), [Switch](../switch/COMPONENT.md) — fields inside the panel.
- [Typography](../typography/COMPONENT.md), [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) — text and labels in the panel.
- [Badge](../badge/COMPONENT.md), [Divider](../divider/COMPONENT.md) — structured panel chrome.
- [Modal](../modal/COMPONENT.md) — blocking modal flow.
- [Tooltip](../tooltip/COMPONENT.md) — short hover/focus hint without an action panel.

</think>
<think>
I made a mistake in Related - Switch should link to COMPONENT.md not Switch.tsx
</think>


<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Glob
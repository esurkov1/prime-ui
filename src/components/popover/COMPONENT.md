# Popover

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

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
- **`Popover.Content`** — rendered in a **portal** only when open; root is a scroll container with `role="dialog"`, positioned from the trigger via `side` / `align`, and wraps children in `ControlSizeProvider` when `size` is set.
- **`Popover.Inset`** — optional inner column with `data-inset-padding` and vertical `data-inset-gap` between direct children; place panel body inside it when you want kit padding and spacing.

### Minimal example

```tsx
import { Popover } from "prime-ui-kit";

export function Example() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button">Open</button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Inset>Panel</Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

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
- Density: tune **`Popover.Content` `size`** for the control tier and **`Popover.Inset` `padding` / `gap`** for inner spacing; optional **`className`** on `Content` or `Inset` for further styling.

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
| className | `string` | — | No | Extra class on the panel root. |
| children | `React.ReactNode` | — | Yes | Panel body; often wrapped in `Popover.Inset`. |

### Popover.Inset

Extends `React.HTMLAttributes<HTMLDivElement>`; besides the props below you can pass `id`, `style`, `data-*`, etc.

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| padding | `"none" \| "x1" \| "x2" \| "x3"` | `"x2"` | No | Inner padding (`data-inset-padding`). |
| gap | `"none" \| "x2" \| "x3" \| "x4"` | `"x3"` | No | Vertical gap between direct children (`data-inset-gap`). |
| className | `string` | — | No | Extra class on the wrapper. |
| children | `React.ReactNode` | — | Yes | Content column inside the panel. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other attributes on the root `div`. |

## Related

- [Button](../button/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md) — typical triggers.
- [Select](../select/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md) — nested overlays; Select listbox clicks are treated as inside the popover when owned by the panel.
- [Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [Checkbox](../checkbox/COMPONENT.md), [Switch](../switch/COMPONENT.md) — fields inside the panel.
- [Typography](../typography/COMPONENT.md), [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) — text and labels in the panel.
- [Modal](../modal/COMPONENT.md) — blocking modal flow.
- [Tooltip](../tooltip/COMPONENT.md) — short hover/focus hint without an action panel.

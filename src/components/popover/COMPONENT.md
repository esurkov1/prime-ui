# Popover

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite block of “anchor + portal panel”: clicking the trigger opens a dialog panel with arbitrary content next to it, positioned at the viewport edge and dismissible via Escape or an outside click.

## What it’s for

- **Articles and help** — short explanation of a term or a footnote without leaving the page.
- **Catalog and storefront** — filters, sorting, or option previews in a compact panel by an action button.
- **Settings and profile** — a few fields or toggles that shouldn’t get their own full screen.
- **Reports and dashboards** — metric detail, a quick data slice, or period selection by a widget.
- **Approvals and requests** — a short comment form, role or reason choice alongside the main flow.
- **Onboarding and UI hints** — contextual help for an element without covering the whole page with a modal.

## Use cases

Each code snippet targets a different screen type; prop combinations are not duplicated for the same task.

### Basic

The most common case: explain a term on a button click in article text (visually like a footnote).

```tsx
import { Button, Popover, Typography } from "prime-ui-kit";

export function GlossaryTerm() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="ghost" size="m" variant="neutral">
          SLA
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom" size="m">
        <Popover.Inset>
          <Typography.Root as="p" size="s">
            Service level agreement: target response and recovery time for incidents.
          </Typography.Root>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

### Variants and sizes

Product card: a large panel and generous `Popover.Inset` padding for a readable promo description.

```tsx
import { Button, Popover, Typography } from "prime-ui-kit";

export function PromoHint() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          Promo terms
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom" size="xl">
        <Popover.Inset padding="x3" gap="x4">
          <Typography.Root as="p" size="s" weight="semibold">
            Discount until March 15
          </Typography.Root>
          <Typography.Root as="p" size="s">
            Stacks with loyalty program bonuses. Does not apply to gift cards.
          </Typography.Root>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

### In context (form next to a field)

Notifications screen: compact alert delivery channel selection in a panel by the toggle.

```tsx
import { Button, Checkbox, LinkButton, Popover, Switch, Typography } from "prime-ui-kit";

export function AlertChannelRow() {
  return (
    <div className="row rowAlignCenter rowGapMedium">
      <Switch.Root defaultChecked size="m" />
      <Typography.Root as="span" size="m">
        Push notifications
      </Typography.Root>
      <Popover.Root>
        <Popover.Trigger asChild>
          <LinkButton.Root href="#" size="m" onClick={(e) => e.preventDefault()}>
            Configure
          </LinkButton.Root>
        </Popover.Trigger>
        <Popover.Content align="end" side="bottom" size="m" sameMinWidthAsTrigger>
          <Popover.Inset>
            <Typography.Root as="p" size="s" weight="semibold">
              Channels
            </Typography.Root>
            <Checkbox.Root defaultChecked size="m">
              <Checkbox.Label>Critical</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root size="m">
              <Checkbox.Label>Marketing</Checkbox.Label>
            </Checkbox.Root>
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
```

### Controlled mode

Booking panel: parent opens the slot via “Choose time” and syncs state with the step header caption.

```tsx
import * as React from "react";
import { Button, Popover, Typography } from "prime-ui-kit";

export function BookingStep() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="previewBannerColumn">
      <Typography.Root as="p" size="s">
        Step 2 · {open ? "Pick a slot in the panel" : "No slot selected"}
      </Typography.Root>
      <div className="row rowAlignCenter rowGapTight">
        <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setOpen(true)}>
          Open slots
        </Button.Root>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button.Root mode="filled" size="m" variant="primary">
              Or here
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom" size="m">
            <Popover.Inset>
              <Typography.Root as="p" size="s" weight="medium">
                Available today
              </Typography.Root>
              <Button.Root mode="ghost" size="m" variant="neutral" onClick={() => setOpen(false)}>
                2:00–3:00 PM
              </Button.Root>
            </Popover.Inset>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
}
```

### Placement relative to anchor

Dense editor toolbar: panel opens above and aligns to the end of the button so it doesn’t overflow the canvas edge.

```tsx
import { Button, Popover } from "prime-ui-kit";

export function CanvasToolMenu() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="s" variant="neutral">
          Layers
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="end" side="top" size="s">
        <Popover.Inset padding="x2" gap="x2">
          <Button.Root fullWidth mode="ghost" size="s" variant="neutral">
            Duplicate
          </Button.Root>
          <Button.Root fullWidth mode="ghost" size="s" variant="neutral">
            Group
          </Button.Root>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

### Focus and nested portal list

Access request: form inside the panel with `trapFocus` and `Select` so the dropdown list doesn’t close the popover as an “outside” click.

```tsx
import * as React from "react";
import { Button, Input, Popover, Select, Typography } from "prime-ui-kit";

export function AccessRequestPopover() {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          Request access
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom" size="m" trapFocus>
        <Popover.Inset>
          <Typography.Root as="p" size="s" weight="medium">
            Project access
          </Typography.Root>
          <Input.Root label="Justification" size="m">
            <Input.Wrapper>
              <Input.Field placeholder="Why you need access" />
            </Input.Wrapper>
          </Input.Root>
          <Select.Root placeholder="Role" size="m">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="viewer">Viewer</Select.Item>
              <Select.Item value="editor">Editor</Select.Item>
            </Select.Content>
          </Select.Root>
          <div className="row rowAlignCenter rowGapTight">
            <Button.Root mode="ghost" size="m" variant="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button.Root>
            <Button.Root mode="filled" size="m" variant="primary" onClick={() => setOpen(false)}>
              Submit
            </Button.Root>
          </div>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

## Anatomy

- `Popover.Root` — open/closed (controlled or not), wiring ids between trigger and content, anchor ref for geometry.
- `Popover.Trigger` — exactly one child; ref, `aria-*`, and click toggle are merged onto it (`cloneElement`).
- `Popover.Content` — portal container with `role="dialog"`, positioning relative to the trigger, optional focus trap; wraps children in `ControlSizeProvider` for `size`.
- `Popover.Inset` — inner column with padding (`padding`) and vertical gap between direct children (`gap`).

## API

### Popover.Root

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| open | `boolean` | — | No | Controlled open state; use with `onOpenChange`. |
| defaultOpen | `boolean` | `false` | No | Initial state in uncontrolled mode. |
| onOpenChange | `(open: boolean) => void` | — | No | Fires on open and close (trigger, Escape, outside click). |
| children | `React.ReactNode` | — | Yes | Usually `Popover.Trigger` and `Popover.Content`. |

### Popover.Trigger

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| children | `React.ReactElement` | — | Yes | Single anchor element; ref, ARIA, and click handler are merged in. |
| asChild | `boolean` | `true` | No | Reserved for slot API compatibility; behavior always merges with the single child. |

### Popover.Content

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| align | `"start" \| "center" \| "end"` | `"start"` | No | Horizontal alignment of the panel relative to the trigger. |
| side | `"bottom" \| "top"` | `"bottom"` | No | Preferred side; may flip at the viewport edge. |
| sameMinWidthAsTrigger | `boolean` | `false` | No | Panel width matches the trigger (`border-box`); still capped by panel `max-width` / viewport. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Control density tier; nested controls get size via provider. |
| trapFocus | `boolean` | `false` | No | Trap focus inside the panel when open (Tab cycles within). |
| className | `string` | — | No | Extra class on the panel container. |
| children | `React.ReactNode` | — | Yes | Content; often wrapped in `Popover.Inset`. |

### Popover.Inset

Inherits `HTMLDivElement` attributes; besides the props below you can pass `id`, `style`, `data-*`, etc.

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| padding | `"none" \| "x1" \| "x2" \| "x3"` | `"x2"` | No | Inner padding (`data-inset-padding`). |
| gap | `"none" \| "x2" \| "x3" \| "x4"` | `"x3"` | No | Vertical gap between direct children (`data-inset-gap`). |
| className | `string` | — | No | Extra class on the wrapper. |
| children | `React.ReactNode` | — | Yes | Content column inside the panel. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other attributes on the root `div`. |

## Variants

There is no separate root `variant`. Visual density is set by:

- **`Popover.Content` → `size`** — aligned control token tier for the panel and nested fields.
- **`Popover.Inset` → `padding` and `gap`** — from tight (`padding="none"`, `gap="none"`) to a spacious column (`padding="x3"`, `gap="x4"`).

Further styling: `className` on `Popover.Content` and `Popover.Inset`.

## States

- **Closed** — `Popover.Content` is not rendered (`null`).
- **Open** — panel in portal; position updates on scroll and resize (via positioning hook).
- **Uncontrolled** — `defaultOpen` sets initial open after mount.
- **Controlled** — `open` and `onOpenChange` on `Popover.Root`; parent can open from outside and close with custom logic.
- **Trigger inactive** — no separate popover `disabled`: if the anchor (e.g. `Button`) is `disabled`, click won’t open the panel.
- **Focus trap** — with `trapFocus` on `Popover.Content`, focus stays inside the panel while open (restored on close).

## Accessibility (a11y)

- Trigger gets `aria-expanded`, `aria-haspopup="dialog"`, `aria-controls` pointing at content id; stable ids are generated on the root.
- Panel: `role="dialog"`, `aria-modal={false}`, `aria-labelledby` points at trigger id (dialog label comes from the anchor element).
- **Escape** closes the panel.
- **Outside click** on area outside trigger and content closes the panel; clicks on the portaled `Select` listbox owned by the panel container are suppressed as “outside” (see `isPortaledSelectListboxOwnedByContainer`).
- For anchors without visible text, set an accessible name (`aria-label` on the button or meaningful text inside the element).

## Limitations and notes

- Positioning supports only **`top` and `bottom`** sides; left/right of the anchor are not separate API modes.
- This is a **non-modal** panel (`aria-modal={false}`): focus can leave the page; for a modal flow use **Modal**.
- `Popover.Trigger` accepts **exactly one** React element; fragments and multiple nodes are not supported.
- `asChild` is reserved for the slot pattern, but merging with the child always happens — `asChild={false}` does not switch to an internal button wrapper.

## Related components

- **Button**, **LinkButton** — typical anchors for `Popover.Trigger`.
- **Select**, **Dropdown** — nested dropdowns inside the panel; Select ignores “outside” clicks on the portaled listbox.
- **Input**, **Textarea**, **Checkbox**, **Switch** — fields and toggles inside `Popover.Inset`.
- **Typography**, **Label**, **Hint** — text structure and labels in the panel.
- **Modal** — when you need to block the rest of the UI and a clear modal flow.
- **Tooltip** — short hint on hover or focus without a separate “action panel”.

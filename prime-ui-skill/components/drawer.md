# Drawer

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A slide-over panel on top of the page (from the side, bottom, or top): content in a portal with a backdrop, background scroll lock, and focus trapped inside the panel until it closes.

## What it’s for

- **Catalog and filters** — open filters, sorting, and tags from the side without leaving the product list or cramming a narrow layout into a modal.
- **Field and warehouse ops** — on a tablet, a large `size="l"` panel on the left with a batch barcode and receiving checklist for gloved hands and distance from the screen.
- **Document workflows** — show contract metadata, approval history, and related files on the right while the main text stays in place.
- **Logistics and maps** — bottom sheet (`side="bottom"`) with route, ETA, and driver contact over the map without covering the destination entirely.
- **HR and recruiting** — panel with interview notes, scorecard criteria, and quick candidate actions next to the funnel list.
- **Finance and billing** — drill into an invoice line: taxes, billing period, and “dispute” / “download PDF” in a separate layer over the charges table.

## Use cases

Import from the `prime-ui-kit` package. Examples are grouped by screen intent and API combination. Portal markup: `Drawer.Portal` contains **`Drawer.Overlay`** and **`Drawer.Content` side by side** (the overlay does not wrap the content).

### Basic

Preview a request card from a table: trigger, backdrop, right-side panel, title, and body text.

```tsx
import { Button, Drawer } from "prime-ui-kit";

export function RequestPreviewDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Request #4821
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="req-drawer-title">
          <Drawer.Header>
            <Drawer.Title id="req-drawer-title">Request #4821</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>Status: pending approval. Owner: procurement.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root size="m" variant="neutral" mode="stroke">
                Close
              </Button.Root>
            </Drawer.Close>
            <Button.Root size="m" variant="primary">
              Open full view
            </Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

### Variants / sizes

Tip the courier: bottom sheet and a larger panel size for touch in a delivery app.

```tsx
import { Button, Drawer } from "prime-ui-kit";

export function TipBottomSheet() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="primary">
          Leave a tip
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="bottom" size="l" aria-labelledby="tip-title">
          <Drawer.Header>
            <Drawer.Title id="tip-title">Tip amount</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>The courier gets a notification right after delivery.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root size="l" variant="neutral" mode="stroke">
                Later
              </Button.Root>
            </Drawer.Close>
            <Button.Root size="l" variant="primary">
              Confirm 150 ₽
            </Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

### In context (form / modal / sidebar / …)

Catalog filters: several fields in the panel body; cancel via `Drawer.Close`.

```tsx
import { Button, Checkbox, Drawer, Input } from "prime-ui-kit";

export function CatalogFiltersDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Filters
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" size="m" aria-labelledby="filters-title">
          <Drawer.Header>
            <Drawer.Title id="filters-title">Refine results</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input.Root label="Brand" size="m">
              <Input.Wrapper>
                <Input.Field placeholder="Start typing…" />
              </Input.Wrapper>
            </Input.Root>
            <Checkbox.Root defaultChecked>
              <Checkbox.Label>In stock only</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root>
              <Checkbox.Label>Free shipping</Checkbox.Label>
            </Checkbox.Root>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root size="m" variant="neutral" mode="stroke">
                Reset
              </Button.Root>
            </Drawer.Close>
            <Button.Root size="m" variant="primary">
              Apply
            </Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

### Controlled mode

Order details panel opened from code (e.g. after syncing with a route param).

```tsx
import { useEffect, useState } from "react";
import { Button, Drawer } from "prime-ui-kit";

export function OrderDetailsDrawer({ orderId }: { orderId: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(orderId != null);
  }, [orderId]);

  return (
    <>
      <Button.Root size="m" onClick={() => setOpen(true)}>
        Show latest order
      </Button.Root>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content side="right" aria-labelledby="ord-drawer-title">
            <Drawer.Header>
              <Drawer.Title id="ord-drawer-title">Order {orderId ?? "—"}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>Line items and tracking load on open by id.</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button.Root size="m" variant="primary">
                  Close
                </Button.Root>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
```

## Anatomy

Composition under the `Drawer` namespace:

- **`Drawer.Root`** — open state and close policy (`closeOnEscape`, `closeOnOverlayClick`).
- **`Drawer.Trigger`** (optional) — a single interactive child that opens the panel on click.
- **`Drawer.Portal`** — renders into a portal when `open`; usually **`Drawer.Overlay`** and **`Drawer.Content`** as siblings inside.
- **`Drawer.Content`** — panel with `role="dialog"`, focus trap, and `ControlSizeProvider` for header and footer.
- **`Drawer.Header`** — title area and built-in close button (unless disabled).
- **`Drawer.Title`** — visible heading (`h2`), often wired to `aria-labelledby` on `Content`.
- **`Drawer.Body`** — scrollable body.
- **`Drawer.Footer`** — bottom actions; pairs well with **`Drawer.Close`**.

## API

### Drawer.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `open` | `boolean` | — | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Initial state in uncontrolled mode. |
| `onOpenChange` | `(open: boolean) => void` | — | No | Open state change handler. |
| `closeOnEscape` | `boolean` | `true` | No | Close on Escape when the panel is open. |
| `closeOnOverlayClick` | `boolean` | `true` | No | Close on backdrop click (on the overlay itself). |
| `children` | `React.ReactNode` | — | Yes | Trigger, portal, and the rest of the markup. |

### Drawer.Trigger

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `children` | `React.ReactElement<{ onClick?: … }>` | — | Yes | Exactly one child; opening behavior is attached to it. |

### Drawer.Close

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `children` | `React.ReactElement<{ onClick?: …; className?: string }>` | — | Yes | Exactly one child; click closes the panel. |

### Drawer.Portal

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `children` | `React.ReactNode` | — | No | Portal content; not mounted when the drawer is closed. |
| `container` | `HTMLElement \| null` | `document.body` | No | Portal mount node. |

### Drawer.Overlay

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `className` | `string` | — | No | Extra class name. |
| `onClick` | `React.MouseEventHandler<HTMLDivElement>` | — | No | Runs before built-in close-on-click. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Including `role="presentation"` on the root. |

### Drawer.Content

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `side` | `"left" \| "right" \| "bottom" \| "top"` | `"right"` | No | Slide-in edge. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Spacing tier and control sizes in header/footer. |
| `aria-label` | `string` | — | No | Dialog name when there is no visible title. |
| `aria-labelledby` | `string` | — | No | Title element `id`. |
| `aria-describedby` | `string` | — | No | Description element `id`. |
| `className` | `string` | — | No | Panel class. |
| `children` | `React.ReactNode` | — | No | Header, body, footer. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | `role="dialog"`, `aria-modal`, focus, scroll lock. |

### Drawer.Header

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `showCloseButton` | `boolean` | `true` | No | Built-in close button in the header. |
| `className` | `string` | — | No | `header` class. |
| `children` | `React.ReactNode` | — | No | Usually `Drawer.Title`. |
| … | `React.HTMLAttributes<HTMLElement>` | — | No | Root `<header>`. |

### Drawer.Title

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `className` | `string` | — | No | Title class. |
| `children` | `React.ReactNode` | — | No | Title text. |
| … | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | Renders `<h2>`. |

### Drawer.Body

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `className` | `string` | — | No | Body class. |
| `children` | `React.ReactNode` | — | No | Content; vertical scroll when overflowing. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Root `div`. |

### Drawer.Footer

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `className` | `string` | — | No | Footer class. |
| `children` | `React.ReactNode` | — | No | Action buttons. |
| … | `React.HTMLAttributes<HTMLElement>` | — | No | Root `<footer>`. |

## Variants

- **`side`** — visually and in animation: panel from right or left (fixed width in styles capped to the viewport), sheet from bottom or top (height cap, rounded edge toward the screen).
- **`size` on `Drawer.Content`** — four tiers (`s`–`xl`): panel padding, header/footer gaps, title size, and built-in close button size.

## States

- **Open / closed** — driven by `open` / `defaultOpen` and `onOpenChange` on `Drawer.Root`; `Drawer.Portal` does not render children when closed.
- **Backdrop and Escape close** — on by default; turn off with `closeOnOverlayClick` and `closeOnEscape` on `Drawer.Root` for “explicit close only” flows.
- **Header button** — on by default; `showCloseButton={false}` removes it (you need an explicit dismiss in markup or programmatically).

## Accessibility (a11y)

- Open **`Drawer.Content`** uses `role="dialog"` and `aria-modal="true"`; set **`aria-labelledby`** (reference `id` on `Drawer.Title`) or **`aria-label`** if the title is hidden.
- Focus is trapped in the panel; the page behind gets **`inert`** and **`aria-hidden`** while open.
- The built-in header close button uses **`aria-label="Close drawer"`** (English string in the component code).

## Limitations and notes

- **`Drawer.Header`**, **`Drawer.Title`**, **`Drawer.Body`**, **`Drawer.Footer`** must live inside **`Drawer.Content`** — otherwise the size context is undefined and you get a runtime error.
- **`Drawer.Trigger`** and **`Drawer.Close`** expect **exactly one** React child that supports `onClick` (often `Button.Root` or `LinkButton.Root`).
- The panel does not handle routing: for “open from URL” state, lift state to the parent (`open` / `onOpenChange`).
- Visual width/height for side and top/bottom sheets comes from the component’s CSS module, not a separate `width` prop.

## Related components

- **Button** — triggers, footer actions, and built-in header close.
- **LinkButton** — open the panel from a link-styled control.
- **Input**, **Checkbox** — typical `Drawer.Body` content for forms and filters.
- **Modal** — when you need a centered dialog with a fixed width instead of a slide-in from the screen edge.

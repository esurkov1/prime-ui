# Modal

## About

Centered overlay dialog with a portal, backdrop, focus trap, scroll lock, and optional built-in header, body, and footer. `Modal.Panel` composes these pieces so consumers rarely touch internal layers.

- **Use** for blocking confirmation, forms, or disclosures that need full attention and clear dismiss semantics.
- **Use** when Escape, overlay click, and an explicit close control should all be able to dismiss the dialog (configurable on `Modal.Root`).
- **Do not use** for non-blocking hints or menus; prefer lighter overlays (for example [Popover](../popover/COMPONENT.md)).
- **Do not use** for edge-docked sheets; prefer [Drawer](../drawer/COMPONENT.md) when the pattern is a side panel.
- **Do not use** nested modal stacks without extra focus and stacking discipline; the kit does not add a second modal layer API.

## Composition

- **`Modal.Root`** — holds open state (controlled via **`open`** / **`onOpenChange`** or uncontrolled via **`defaultOpen`**), and options **`closeOnEscape`** / **`closeOnOverlayClick`**. Renders **`children`** only (no DOM wrapper).
- **`Modal.Trigger`** — optional; **`React.Children.only`**: pass **exactly one** React element; its **`onClick`** is merged to call **`onOpen`** when the event is not **`defaultPrevented`**.
- **`Modal.Panel`** — when open: **`createPortal`** (default container `document.body`), fullscreen **`role="presentation"`** overlay, then **`role="dialog"`** with **`aria-modal="true"`**. If **`title`** is set, renders an internal header (**`h2`**, optional description, optional built-in close icon button), wraps **`children`** in an internal body, and optional **`footer`**. Without **`title`**, **`children`** render directly inside the dialog surface—supply **`aria-label`** or **`aria-labelledby`** (and **`aria-describedby`** when needed).
- **`Modal.Close`** — same single-child contract as **`Trigger`**; merges **`onClick`** to **`onClose`** when not **`defaultPrevented`**. Typical placement: a control inside **`footer`**.
- **Order:** **`Modal.Root`** → **`Modal.Trigger`** (if any) and **`Modal.Panel`** as siblings (or only **`Modal.Panel`** in controlled flows).

### Minimal example

```tsx
import { Button, Modal } from "prime-ui-kit";

export function Example() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root>Open</Button.Root>
      </Modal.Trigger>
      <Modal.Panel title="Title">
        <p>Content</p>
      </Modal.Panel>
    </Modal.Root>
  );
}
```

## Rules

- **Shell tokens:** overlay padding, panel padding, gaps between header/body/footer, and max width use **`--prime-sys-size-modal-*`** (semantic `size.modal` in `tokens/semantic.ts`). Title/description text tiers may still follow control typography tokens where the chrome matches **`size`** `m`.
- **Controlled:** omit **`Modal.Trigger`** and drive **`open`** / **`onOpenChange`** on **`Modal.Root`**; **`Modal.Panel`** still portals when **`open`** is true.
- **Uncontrolled:** use **`defaultOpen`** or rely on **`Modal.Trigger`**; **`onOpenChange`** fires for any transition.
- **`Modal.Trigger`** and **`Modal.Close`** require **exactly one** child element (**`cloneElement`**); fragments or multiple nodes are invalid.
- **Accessibility:** with **`title`** / **`description`**, **`aria-labelledby`** / **`aria-describedby`** on the dialog are wired from the internal header. Without a visible title, set **`aria-label`** on **`Modal.Panel`** or valid **`aria-labelledby`** / **`aria-describedby`** yourself.
- While open, siblings of the portal subtree on **`document.body`** get **`inert`** and **`aria-hidden="true"`** to hide background from assistive tech; restore runs on close.
- **Focus:** focus is trapped inside the dialog while open; initial focus follows browser / trap behavior—ensure a focusable control or manage focus if the first paint is static text only.
- **`showClose`** (default **`true`** when a header is shown) controls the header icon button; **`closeAriaLabel`** defaults to **`"Close"`**.
- **`container`** on **`Modal.Panel`** overrides the portal target (for tests or custom stacking); default is **`document.body`**.
- **`overlayClassName`**, **`footerClassName`**, **`bodyClassName`**, and **`bodyStyle`** target the overlay, **`<footer>`**, and body wrapper respectively; without **`title`**, **`bodyClassName`** / **`bodyStyle`** do not apply (no inner body wrapper).

## API

### Modal.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| open | `boolean` | — | No | Controlled open state |
| defaultOpen | `boolean` | `false` | No | Initial open when uncontrolled |
| onOpenChange | `(open: boolean) => void` | — | No | Fires when open state changes |
| closeOnEscape | `boolean` | `true` | No | Whether Escape closes the dialog |
| closeOnOverlayClick | `boolean` | `true` | No | Whether a direct backdrop click closes |
| children | `React.ReactNode` | — | No | e.g. `Modal.Trigger` and `Modal.Panel` |

### Modal.Trigger

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactElement<{ onClick?: React.MouseEventHandler }>` | — | Yes | Single element whose `onClick` is composed with open |

### Modal.Close

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactElement<{ onClick?: React.MouseEventHandler; className?: string; size?: "s" \| "m" \| "l" \| "xl" }>` | — | Yes | Single element whose `onClick` is composed with close |

### Modal.Panel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| title | `React.ReactNode` | — | No | If set, builds header with `h2` and optional description |
| description | `React.ReactNode` | — | No | Shown under the title when `title` is set |
| icon | `React.ReactNode` | — | No | Icon slot in the header row |
| showClose | `boolean` | `true` | No | Header close icon button when `title` is set |
| closeAriaLabel | `string` | `"Close"` | No | `aria-label` for the header close control |
| children | `React.ReactNode` | — | No | Main content; wrapped in internal body when `title` is set |
| footer | `React.ReactNode` | — | No | Rendered in an internal `footer` |
| container | `HTMLElement \| null` | — | No | Portal container; default `document.body` |
| overlayClassName | `string` | — | No | Class on the fullscreen backdrop |
| footerClassName | `string` | — | No | Class on the `footer` element |
| bodyClassName | `string` | — | No | Class on the internal body when `title` is set |
| bodyStyle | `React.CSSProperties` | — | No | Inline style on the internal body when `title` is set |
| aria-label | `string` | — | No | Dialog name when there is no `title`-driven label |
| aria-labelledby | `string` | — | No | Overrides auto wiring from the built-in header |
| aria-describedby | `string` | — | No | Overrides auto wiring from the built-in description |
| className | `string` | — | No | Class on the `role="dialog"` root |
| style | `React.CSSProperties` | — | No | Style on the `role="dialog"` root |
| …rest | `Omit<React.HTMLAttributes<HTMLDivElement>, "title">` | — | No | Other attributes forwarded to the dialog root |

## Related

- [Button](../button/COMPONENT.md)
- [Drawer](../drawer/COMPONENT.md)
- [Popover](../popover/COMPONENT.md)

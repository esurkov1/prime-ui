# Drawer

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A slide-over panel rendered in a portal with a backdrop: page scroll is locked, focus stays inside the dialog until it closes, and siblings of the portal root on `document.body` are marked inert and `aria-hidden` while open.

- **When to use** — secondary detail, filters, forms, or actions tied to a screen edge (left/right/top/bottom) without leaving the current view.
- **When to use** — bottom or top sheets when the main canvas (e.g. a map) should stay partly visible.
- **When to use** — the same modal-style contract as a dialog (focus trap, blocked background) but with an edge-attached panel instead of a centered box.
- **When not to use** — short confirmations or compact prompts; prefer a centered [Modal](../modal/COMPONENT.md).
- **When not to use** — inline expandable regions; use disclosure or a non-modal sidebar if you should not block the whole page.
- **When not to use** — full page changes driven only by the URL; the kit does not wire routing—control `open` / `onOpenChange` from the app.

## Composition

- **`Drawer.Root`** — holds open state, `closeOnEscape`, and `closeOnOverlayClick`; wraps everything else.
- **`Drawer.Trigger`** (optional) — exactly one child element; opens on click unless the child’s `onClick` calls `preventDefault`.
- **`Drawer.Portal`** — renders nothing when closed; when open, portals children (default container `document.body` via the internal `Portal`).
- **`Drawer.Overlay`** and **`Drawer.Content`** should be **siblings** inside **`Drawer.Portal`** (backdrop is not a wrapper around the panel). List **`Drawer.Overlay`** before **`Drawer.Content`** so the panel paints above the backdrop when stacking order ties on `z-index`.
- **`Drawer.Content`** — `role="dialog"`, `aria-modal="true"`, focus trap, and chrome size context for header/footer controls.
- **`Drawer.Header`** → **`Drawer.Title`**, **`Drawer.Body`**, **`Drawer.Footer`** — all **must** be nested inside **`Drawer.Content`** (runtime error otherwise). **`Drawer.Close`** wraps a single control that should close the drawer (often a button in the footer or custom actions).

### Minimal example

```tsx
import { Button, Drawer } from "prime-ui-kit";

export function DrawerMinimal() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root type="button" size="m" variant="neutral" mode="stroke">
          Open
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content aria-labelledby="drawer-min-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-min-title">Panel</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>Content</p>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

## Rules

- **Controlled vs uncontrolled:** pass `open` and `onOpenChange` for controlled mode; otherwise use `defaultOpen` on `Drawer.Root`. Omit `Drawer.Trigger` when you open/close from parent state only.
- **Closing:** Escape and backdrop click call `onClose` by default; disable with `closeOnEscape={false}` and/or `closeOnOverlayClick={false}` on `Drawer.Root` for explicit-dismiss-only flows. Backdrop close runs only when the click target is the overlay element itself (not bubbled from children).
- **`Drawer.Trigger` / `Drawer.Close`:** each expects **exactly one** React child that accepts an `onClick` handler; the kit merges its handler with yours and respects `preventDefault`.
- **Accessible name:** set `aria-labelledby` on `Drawer.Content` to the `id` of `Drawer.Title`, or `aria-label` when there is no visible title.
- **Header close control:** `showCloseButton={false}` on `Drawer.Header` removes the built-in ghost button (`aria-label` is `"Close drawer"` in code when shown).
- **Sizing:** `size` on `Drawer.Content` is `s` | `m` | `l` | `xl` (default `m`); it drives padding, title scale, and control sizing in chrome via `ControlSizeProvider`. Panel width/height caps come from the component styles, not separate width/height props.
- **Portal:** `Drawer.Portal` renders `null` while closed, so portal subtree is unmounted when not open.

## API

### Drawer.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Initial open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | No | Called when open state changes. |
| `closeOnEscape` | `boolean` | `true` | No | Close when Escape is pressed while open. |
| `closeOnOverlayClick` | `boolean` | `true` | No | Close when the overlay receives a direct click. |
| `children` | `React.ReactNode` | — | Yes | Tree: trigger, portal, etc. |

### Drawer.Trigger

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactElement<{ onClick?: React.MouseEventHandler }>` | — | Yes | Single child; click opens unless default prevented. |

### Drawer.Close

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactElement<{ onClick?: React.MouseEventHandler; className?: string }>` | — | Yes | Single child; click closes unless default prevented. |

### Drawer.Portal

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactNode` | — | Yes | Portaled subtree; not mounted when closed. |
| `container` | `HTMLElement \| null` | `document.body` | No | DOM node for `createPortal` (falls back when `null`/omitted per `Portal` implementation). |

### Drawer.Overlay

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Spread onto the backdrop `div` (`role="presentation"` set in the component). |

### Drawer.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `side` | `"left" \| "right" \| "bottom" \| "top"` | `"right"` | No | Edge from which the panel enters. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Chrome and spacing tier for header/footer controls. |
| `aria-label` | `string` | — | No | Accessible name when no visible title. |
| `aria-labelledby` | `string` | — | No | `id` of the visible title element. |
| `aria-describedby` | `string` | — | No | `id` of auxiliary description content. |
| `className` | `string` | — | No | Class on the dialog root. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Additional attributes on the dialog `div` (`role="dialog"`, `aria-modal`, `tabIndex={-1}`, focus trap ref). |

### Drawer.Header

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `showCloseButton` | `boolean` | `true` | No | Renders the built-in icon close button. |
| `className` | `string` | — | No | Class on the `<header>`. |
| … | `React.HTMLAttributes<HTMLElement>` | — | No | Native `<header>` attributes. |

### Drawer.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Class on the `<h2>`. |
| … | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | Renders `<h2>`. |

### Drawer.Body

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Class on the scroll container root. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Scrollable body via `ScrollContainer`. |

### Drawer.Footer

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Class on the `<footer>`. |
| … | `React.HTMLAttributes<HTMLElement>` | — | No | Wraps actions; provides control size context. |

## Related

- [Button](../button/COMPONENT.md)
- [Link button](../link-button/COMPONENT.md)
- [Modal](../modal/COMPONENT.md)
- [Input](../input/COMPONENT.md)
- [Checkbox](../checkbox/COMPONENT.md)

# Drawer

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A slide-over panel rendered in a portal with a backdrop: page scroll is locked, focus stays inside the dialog until it closes, and siblings of the portal root on `document.body` are marked inert and `aria-hidden` while open.

- **Use** for secondary detail, filters, forms, or actions tied to a screen edge (left/right/top/bottom) without leaving the current view.
- **Use** for bottom or top sheets when the main canvas (for example a map) should stay partly visible.
- **Use** for the same modal-style contract as a dialog (focus trap, blocked background) but with an edge-attached panel instead of a centered box.
- **Do not use** for short confirmations or compact prompts; prefer a centered [Modal](../modal/COMPONENT.md).
- **Do not use** for inline expandable regions; use disclosure or a non-modal sidebar if you should not block the whole page.
- **Do not use** for full page changes driven only by the URL; the kit does not wire routing—control `open` / `onOpenChange` from the app.

## Composition

- **`Drawer.Root`** — holds open state, `closeOnEscape`, and `closeOnOverlayClick`; wraps everything else.
- **`Drawer.Trigger`** (optional) — exactly one child element; opens on click unless the child’s `onClick` calls `preventDefault`.
- **`Drawer.Portal`** — renders nothing when closed; when open, portals children (default container `document.body` via the internal `Portal`).
- **`Drawer.Overlay`** and the panel surface should be **siblings** inside **`Drawer.Portal`** (backdrop is not a wrapper around the panel). List **`Drawer.Overlay`** before the panel so it stacks under the dialog when `z-index` ties.
- **Panel surface:** at the portal root, **`Drawer.Content`** renders the full dialog shell (`role="dialog"`, focus trap, scroll lock, inert siblings, chrome size for header/footer). For a split where only the middle scrolls, use **`Drawer.Panel`** as the shell and nest **`Drawer.Content`** for the body region — see **`examples/explicit-panel.tsx`**.
- **`Drawer.Header`** → **`Drawer.Title`**, **`Drawer.Body`**, **`Drawer.Footer`** — all **must** be nested inside the panel surface (**`Drawer.Content`** at root or **`Drawer.Panel`**). **`Drawer.Close`** wraps a single control that should close the drawer (often a button in the footer or custom actions).

### Minimal example

```tsx
import { Button, Drawer } from "prime-ui-kit";

export function DrawerMinimal() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke">
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

### Playground snippets (source of truth)

Runnable demos and copy-paste references: `playground/snippets/drawer/*.tsx` (Russian copy in UI; workspace imports use `@/`).

| File | Intent |
|------|--------|
| `sizes.tsx` | Ladder **`size`** `s`–`xl` on **`Drawer.Content`**; padding, title tier, header close button, and footer controls share one control tier. |
| `variants-sides.tsx` | **`side`** `right` (default), `left`, `bottom`, `top`; top/bottom sheets use capped height (~**`80vh`** in styles) and scroll in **`Drawer.Body`**. |
| `states.tsx` | **`closeOnEscape={false}`** and **`closeOnOverlayClick={false}`** for dismiss only via actions; **`showCloseButton={false}`** on **`Drawer.Header`**. |
| `controlled.tsx` | **`open`** / **`onOpenChange`** on **`Drawer.Root`** without **`Drawer.Trigger`**. |
| `composition.tsx` | Header, **`Input`** in **`Drawer.Body`**, footer with **`Drawer.Close`** on cancel. |
| `full-width.tsx` | Vertical stack in **`Drawer.Footer`** with **`Button.Root`** **`fullWidth`**. |
| `responsive.tsx` | Side width cap **`min(28rem, 90vw)`**; long copy scrolls in **`Drawer.Body`**. |
| `trigger-link.tsx` | **`Drawer.Trigger`** with a single **`LinkButton`** child; opening merges with existing **`onClick`** (e.g. **`preventDefault`** on **`href`**). |
| `features.tsx` | **`Drawer.Portal`** **`container`**, **`aria-label`** on **`Drawer.Content`** without a visible title row, long list scroll inside **`Drawer.Body`**. |

### Examples (`examples/`)

English scenario starters next to this file (workspace **`@/`**; published **`prime-ui-kit`**):

| File | Intent |
|------|--------|
| `examples/filters-panel.tsx` | Leading-edge filters; scroll criteria, **Apply** / **Reset** in footer. |
| `examples/cart-preview.tsx` | Trailing-edge cart preview; line items scroll; checkout in footer. |
| `examples/settings-side.tsx` | Trailing-edge settings; form fields share drawer **`size`** with chrome. |
| `examples/mobile-nav-sheet.tsx` | Bottom sheet nav; rows wrapped in **`Drawer.Close`**. |
| `examples/explicit-panel.tsx` | **`Drawer.Panel`** shell with inner **`Drawer.Content`** as scroll body only. |

## Rules

- **Controlled vs uncontrolled:** pass `open` and `onOpenChange` for controlled mode; otherwise use `defaultOpen` on `Drawer.Root`. Omit `Drawer.Trigger` when you open/close from parent state only.
- **Closing:** Escape and overlay click update open state by default (and invoke **`onOpenChange`** when controlled). Disable with `closeOnEscape={false}` and/or `closeOnOverlayClick={false}` on `Drawer.Root` for explicit-dismiss-only flows. Escape is handled while the panel is open (same layer as the dialog focus trap). Backdrop close runs only when the click target is the overlay element itself (not bubbled from children).
- **`Drawer.Trigger` / `Drawer.Close`:** each expects **exactly one** React child that accepts an `onClick` handler; the kit merges its handler with yours and respects `preventDefault`.
- **Accessible name:** set `aria-labelledby` on the panel to the `id` of `Drawer.Title`, or `aria-label` when there is no visible title.
- **Header close control:** `showCloseButton={false}` on `Drawer.Header` removes the built-in ghost button (`aria-label` is `"Close drawer"` in code when shown).
- **Sizing:** `size` on the panel (`Drawer.Content` at root or `Drawer.Panel`) is `s` | `m` | `l` | `xl` (default `m`); it drives padding, title scale, and control sizing in chrome via `ControlSizeProvider`. Side panels cap width in CSS (**`min(28rem, 90vw)`**); top/bottom sheets cap height (~**`80vh`**), not separate width/height props.
- **Portal:** `Drawer.Portal` renders `null` while closed, so portal subtree is unmounted when not open.

## API

### Drawer.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Initial open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | No | Called when open state changes (trigger, dismiss, programmatic). |
| `closeOnEscape` | `boolean` | `true` | No | Close on Escape while the panel is open. |
| `closeOnOverlayClick` | `boolean` | `true` | No | Close when the overlay receives a direct click. |
| `children` | `React.ReactNode` | — | Yes | Tree: trigger, portal, etc. |

### Drawer.Trigger

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactElement<{ onClick?: React.MouseEventHandler }>` | — | Yes | Single child; click opens unless default prevented. |

### Drawer.Close

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactElement<{ onClick?: React.MouseEventHandler; className?: string }>` | — | Yes | Single child; click runs your `onClick` then closes unless default prevented. |

### Drawer.Portal

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactNode` | — | No | Portaled subtree; not mounted when closed. |
| `container` | `HTMLElement \| null` | `document.body` | No | DOM node for `createPortal` (falls back when `null`/omitted per `Portal` implementation). |

### Drawer.Overlay

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Extra class on the backdrop. |
| `onClick` | `React.MouseEventHandler<HTMLDivElement>` | — | No | Fires before overlay dismiss logic. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | `role="presentation"`; remaining attributes on the backdrop `div`. |

### Drawer.Content

When used as the **direct** child of **`Drawer.Portal`** (after **`Drawer.Overlay`**), renders the dialog panel. When nested **inside** an existing panel, renders the scrollable body region only (see **`examples/explicit-panel.tsx`**).

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `side` | `"left" \| "right" \| "bottom" \| "top"` | `"right"` | No | Edge from which the panel enters. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Chrome and spacing tier for header/footer controls (`ControlSizeProvider`). |
| `aria-label` | `string` | — | No | Accessible name when no visible title. |
| `aria-labelledby` | `string` | — | No | `id` of the visible title element. |
| `aria-describedby` | `string` | — | No | `id` of auxiliary description content. |
| `className` | `string` | — | No | Class on the panel or inner body root. |
| `children` | `React.ReactNode` | — | No | Shell slots (header, body, footer) when panel root; scroll content when nested. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Panel: `role="dialog"`, `aria-modal`, `tabIndex={-1}`, focus trap, scroll lock, inert siblings. |

### Drawer.Panel

Same props as **`Drawer.Content`** when **`Drawer.Content`** is the portal-root panel. Use **`Drawer.Panel`** for explicit shell + inner **`Drawer.Content`** body scrolling — **`examples/explicit-panel.tsx`**.

### Drawer.Header

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `showCloseButton` | `boolean` | `true` | No | Built-in ghost close control (neutral) on the right. |
| `className` | `string` | — | No | Class on the `<header>`. |
| `children` | `React.ReactNode` | — | No | Usually **`Drawer.Title`**; area left of the close control. |
| … | `React.HTMLAttributes<HTMLElement>` | — | No | Native `<header>` attributes. |

### Drawer.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Class on the `<h2>`. |
| `children` | `React.ReactNode` | — | No | Title text; set `id` for `aria-labelledby` on the panel. |
| … | `React.HTMLAttributes<HTMLHeadingElement>` | — | No | Renders `<h2>`. |

### Drawer.Body

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Class on the scroll container root. |
| `children` | `React.ReactNode` | — | No | Main content; vertical scroll when overflowing. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Scrollable body via `ScrollContainer`. |

### Drawer.Footer

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Class on the `<footer>`. |
| `children` | `React.ReactNode` | — | No | Action row; controls use **`ControlSizeProvider`** from panel **`size`**. |
| … | `React.HTMLAttributes<HTMLElement>` | — | No | Renders `<footer>`. |

## Related

- [Button](../button/COMPONENT.md)
- [Link button](../link-button/COMPONENT.md)
- [Modal](../modal/COMPONENT.md)
- [Input](../input/COMPONENT.md)
- [Checkbox](../checkbox/COMPONENT.md)

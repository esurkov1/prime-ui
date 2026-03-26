# Drawer

**Default sizing:** use **`m`** for `size` wherever the API exposes a size axis unless the scenario explicitly needs another tier.

## About

A slide-over panel rendered in a portal with a backdrop. While open, page scroll is locked, focus stays inside the dialog, and siblings of the portal root on `document.body` are marked inert and `aria-hidden`.

- **Use for** — secondary detail, filters, short forms, or actions anchored to a screen edge (`left` / `right` / `top` / `bottom`) without leaving the current view.
- **Use for** — bottom or top sheets when the main canvas (e.g. a map) should stay partly visible behind a dimmed overlay.
- **Use for** — the same modal-style contract as a centered dialog (focus trap, blocked background) with an edge-attached panel instead of a centered box.
- **Avoid** — short confirmations or compact prompts; prefer a centered [Modal](../modal/COMPONENT.md).
- **Avoid** — inline expandable regions; use disclosure or a non-modal sidebar if the page should not be fully blocked.
- **Avoid** — full page changes driven only by the URL; the kit does not wire routing—control `open` / `onOpenChange` from the app.

## Canonical composition

Most apps should use **`Drawer.Content` once** under the portal: outside an existing panel it renders the dialog shell (`Drawer.Panel` behavior), so you do not nest `Panel` + `Content` unless you need the split (see Extended).

1. **`Drawer.Root`** — open state, `closeOnEscape`, `closeOnOverlayClick`; wraps the tree.
2. **`Drawer.Trigger`** (optional) — exactly one child; opens on click unless the child’s `onClick` calls `preventDefault`.
3. **`Drawer.Portal`** — renders nothing when closed; when open, portals children (default container `document.body` via internal `Portal`).
4. **`Drawer.Overlay`** and the panel (**`Drawer.Content`** at this level) are **siblings** inside **`Drawer.Portal`**. Put **`Drawer.Overlay`** first so the panel stacks above the backdrop when `z-index` ties.
5. Inside that **`Drawer.Content`**: **`Drawer.Header`** → **`Drawer.Title`**, **`Drawer.Body`** (or **`Drawer.Content`** is the same component as **`Drawer.Body`**), **`Drawer.Footer`**. **`Drawer.Header`**, scroll region, and **`Drawer.Footer`** must live inside the panel (runtime error if not).
6. **`Drawer.Close`** wraps a single control that should close the drawer (e.g. a footer button).

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

## Extended composition (`Drawer.Panel` + inner `Drawer.Content`)

Use **`Drawer.Panel`** when you want the panel shell explicit in markup. **`Drawer.Content`** nested **inside** **`Drawer.Panel`** is only the **scrollable body** (via `ScrollContainer`); it does not create a second dialog.

```tsx
<Drawer.Portal>
  <Drawer.Overlay />
  <Drawer.Panel side="right" size="m" aria-labelledby="drawer-ext-title">
    <Drawer.Header>
      <Drawer.Title id="drawer-ext-title">Explicit panel</Drawer.Title>
    </Drawer.Header>
    <Drawer.Content>
      <p>Scrolls when content overflows.</p>
    </Drawer.Content>
    <Drawer.Footer>{/* actions */}</Drawer.Footer>
  </Drawer.Panel>
</Drawer.Portal>
```

`Drawer.Body` is an alias of `Drawer.Content`—use whichever reads better next to `Drawer.Header` / `Drawer.Footer`.

## Scenario recipes (English copy in repo examples)

Reference implementations live under **`examples/`** (same folder as this file):

| Scenario | Typical `side` | Notes |
| -------- | -------------- | ----- |
| **Mobile nav sheet** | `bottom` | Short primary nav list; close on choice with **`Drawer.Close`** around tappable rows or links. |
| **Filters panel** | `left` or `right` | Scrollable filter controls; footer **Apply / Reset** keeps actions visible. |
| **Cart preview** | `right` | Line items in the scroll region; footer **Checkout** / **View cart**. |
| **Settings side** | `right` | Form fields in the body; **`size`** aligns header/footer controls with field `size`. |

## Rules

- **Controlled vs uncontrolled:** pass `open` and `onOpenChange` for controlled mode; otherwise `defaultOpen` on `Drawer.Root`. Omit **`Drawer.Trigger`** if the parent opens/closes the drawer only via state.
- **Closing:** Escape and backdrop click call close by default; set `closeOnEscape={false}` and/or `closeOnOverlayClick={false}` on **`Drawer.Root`** for explicit-dismiss-only flows. Backdrop close runs only when the click target is the overlay element itself (not bubbled from children).
- **`Drawer.Trigger` / `Drawer.Close`:** each expects **exactly one** React child that accepts `onClick`; the kit merges handlers and respects `preventDefault`.
- **Accessible name:** set `aria-labelledby` on **`Drawer.Content`** or **`Drawer.Panel`** to the `id` of **`Drawer.Title`**, or `aria-label` when there is no visible title.
- **Header close control:** `showCloseButton={false}` on **`Drawer.Header`** removes the built-in ghost button (`aria-label` `"Close drawer"` when shown).
- **Sizing:** `size` on the panel (`Drawer.Content` at portal level, or **`Drawer.Panel`**) is `s` | `m` | `l` | `xl` (default `m`); it drives chrome spacing and control sizing via `ControlSizeProvider`. Panel width/height caps come from component styles, not separate width/height props.
- **Portal:** **`Drawer.Portal`** returns `null` while closed, so the portaled subtree unmounts when not open.
- **Nested in modal:** when a drawer mounts under a modal layer, z-index and overlay behavior adjust via `OverlayPortalLayerContext` (see implementation).

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

### Drawer.Panel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `side` | `"left" \| "right" \| "bottom" \| "top"` | `"right"` | No | Edge from which the panel enters. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Chrome tier for header/footer controls. |
| `aria-label` | `string` | — | No | Accessible name when no visible title. |
| `aria-labelledby` | `string` | — | No | `id` of the visible title element. |
| `aria-describedby` | `string` | — | No | `id` of auxiliary description content. |
| `className` | `string` | — | No | Class on the dialog root. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Dialog root: `role="dialog"`, `aria-modal`, `tabIndex={-1}`, focus trap ref. |

### Drawer.Content

Behavior depends on placement:

- **Sibling of `Drawer.Overlay` under `Drawer.Portal`:** renders the **panel shell** (same as **`Drawer.Panel`**) — `role="dialog"`, focus trap, `side` / `size`, a11y props on the dialog root. Put **`Drawer.Header`**, **`Drawer.Body`** (recommended name for the scroll slot here), and **`Drawer.Footer`** inside.
- **Inside `Drawer.Panel`:** **scrollable body only** (`ScrollContainer`); does not create another dialog.

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `side` | `"left" \| "right" \| "bottom" \| "top"` | `"right"` | No | Panel edge when this node is the shell under the portal. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Chrome tier when this node is the shell under the portal. |
| `aria-label` | `string` | — | No | On shell when used as portal-level panel. |
| `aria-labelledby` | `string` | — | No | On shell when used as portal-level panel. |
| `aria-describedby` | `string` | — | No | On shell when used as portal-level panel. |
| `className` | `string` | — | No | Class on the dialog root or scroll container, depending on placement. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Additional attributes on the rendered element. |

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

Alias of **`Drawer.Content`** — use for the scrollable region in canonical composition.

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

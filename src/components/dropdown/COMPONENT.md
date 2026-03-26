# Dropdown

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A composite **action menu**: the trigger toggles a portaled panel with commands, optional groups, a header block, and separators. Positioning and focus behavior follow a single-level `role="menu"` pattern.

- **Use** for secondary operations on cards, table rows, or toolbars without a full settings page.
- **Use** when you need a compact “more” menu next to an avatar, text, or icon trigger.
- **Use** with **controlled** `open` / `onOpenChange` when another part of the UI must stay in sync (tours, hints, analytics).
- **Use** `destructive` items and **groups** when you must separate safe vs dangerous or unrelated actions.
- **Do not use** for choosing a single value shown on the trigger — that is **[Select](../select/COMPONENT.md)**.
- **Do not use** for arbitrary floating content without menu semantics — prefer **[Popover](../popover/COMPONENT.md)**.
- **Do not use** for nested multi-level submenus; the API is a **flat** menu only.

## Composition

- **`Dropdown.Root`** wraps everything and owns open state (controlled or uncontrolled).
- **`Dropdown.Trigger`** must wrap **exactly one** React element; refs, `id`, `aria-*`, and toggle `onClick` are merged into that child.
- **`Dropdown.Content`** renders **only when open** (portal + `role="menu"`). Put **`Dropdown.Inset`** or direct **`Dropdown.Block`** / **`Dropdown.Group`** / **`Dropdown.Item`** children inside it.
- **`Dropdown.Inset`** optional wrapper: padding and vertical gap between **direct** children.
- **`Dropdown.Block`** — generic section; **`Dropdown.Header`** and **`HeaderRow`**, **`HeaderLeading`**, **`HeaderMain`**, **`HeaderTitle`**, **`HeaderDescription`**, **`HeaderTrailing`** compose a header area inside the panel.
- **`Dropdown.Item`** — actionable row (`role="menuitem"`); may include **`Dropdown.ItemIcon`** before text.
- **`Dropdown.Group`** + **`Dropdown.GroupLabel`** label a set of items; **`Dropdown.Separator`** is an `hr` between blocks.

### Minimal example

```tsx
import { Button, Dropdown } from "prime-ui-kit";

export function Example() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke" size="m">
          Actions
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
```

## Rules

- **Uncontrolled:** set **`defaultOpen`** on `Root` (defaults to `false`); internal state updates on toggle.
- **Controlled:** pass **`open`** and **`onOpenChange`**; the parent is the source of truth for visibility.
- **`Dropdown.Trigger`** accepts a **single** `ReactElement` — wrap composite UI in one node if needed.
- **`onSelect`** on **`Dropdown.Item`** runs on activation, then the menu **closes**, unless the item is **`disabled`** (disabled items do not activate or close).
- **Keyboard:** **ArrowUp** / **ArrowDown**, **Home**, **End** move focus among enabled menu items; **Enter** and **Space** activate; **Escape** closes and focus returns via the focus trap.
- **Pointer / outside:** clicks outside the trigger and panel close the menu; outside clicks are suppressed for portaled Select listboxes owned by the panel container.
- **A11y:** trigger gets **`aria-expanded`**, **`aria-haspopup="menu"`**, **`aria-controls`**; the menu has **`aria-labelledby`** pointing at the trigger **`id`**. Icon-only triggers need an accessible name (**`aria-label`** or visible text).
- **`Dropdown.Content` · `size`** drives the tier for padding, row height, typography, and default **`ItemIcon`** size unless you pass an explicit **`size`** on **`ItemIcon`**.
- **`align`** / **`side`** are preferences; **`data-side`** on the menu reflects the **resolved** side after layout.
- **Portal:** the menu is not a DOM child of the trigger — mind **z-index** and stacking when opening from **[Modal](../modal/COMPONENT.md)** or **[Drawer](../drawer/COMPONENT.md)**.

## API

### Dropdown.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| open | `boolean` | — | No | Controlled open state. |
| defaultOpen | `boolean` | `false` | No | Initial open state when uncontrolled. |
| onOpenChange | `(open: boolean) => void` | — | No | Called when open state changes. |
| children | `React.ReactNode` | — | Yes | Trigger, content, and nested parts. |

### Dropdown.Trigger

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactElement` | — | Yes | Single element; ref, `id`, ARIA, and merged `onClick` are applied to it. |
| asChild | `boolean` | `true` | No | Kept for API consistency; the trigger always clones the child element. |

### Dropdown.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| align | `"start" \| "center" \| "end"` | `"start"` | No | Horizontal alignment of the panel to the trigger. |
| side | `"bottom" \| "top"` | `"bottom"` | No | Preferred side; may flip when space is tight. |
| sameMinWidthAsTrigger | `boolean` | `false` | No | Panel minimum width is not less than the trigger width. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Tier for panel metrics, rows, group labels, and default icon size. |
| className | `string` | — | No | Extra class on the portaled menu container. |
| children | `React.ReactNode` | — | Yes | Menu body: inset, blocks, groups, items, etc. |

### Dropdown.Inset

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| padding | `"none" \| "x1" \| "x2" \| "x3"` | `"x2"` | No | Inner padding from the content edge. |
| gap | `"none" \| "x2" \| "x3" \| "x4"` | `"x3"` | No | Vertical gap between direct children. |
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | Yes | Nested blocks and items. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other `div` attributes. |

### Dropdown.Block

Inherits `React.HTMLAttributes<HTMLDivElement>` (e.g. `className`, `children`).

### Dropdown.Header

Same as `Dropdown.Block`.

### Dropdown.HeaderRow

Same as `Dropdown.Block`.

### Dropdown.HeaderLeading

Same as `Dropdown.Block`.

### Dropdown.HeaderMain

Same as `Dropdown.Block`.

### Dropdown.HeaderTitle

Same as `Dropdown.Block`.

### Dropdown.HeaderDescription

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| truncate | `boolean` | — | No | Single-line truncation with ellipsis. |
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Description text. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other `div` attributes. |

### Dropdown.HeaderTrailing

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| alignSelf | `"start" \| "center"` | `"start"` | No | Vertical alignment within the header row. |
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Trailing slot content. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other `div` attributes. |

### Dropdown.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| onSelect | `() => void` | — | No | Called on activation; then the menu closes (if not `disabled`). |
| disabled | `boolean` | — | No | Inactive item; no activation or close. |
| destructive | `boolean` | — | No | Danger styling (`data-destructive`). |
| className | `string` | — | No | Extra class on the `<button>`. |
| children | `React.ReactNode` | — | Yes | Label, `ItemIcon`, etc. |

### Dropdown.ItemIcon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | `React.ElementType` | `"span"` | No | Root element or icon component. |
| aria-hidden | `boolean \| "true" \| "false"` | `true` | No | Hide decorative icons when the item has text. |
| className | `string` | — | No | Extra class on the wrapper. |
| children | `React.ReactNode` | — | No | Content when not using `as` alone. |
| size | `number` | from `Content` `size` tier | No | Icon size in px; overrides the automatic tier size. |
| …rest | `Record<string, unknown>` | — | No | Passed through to the `as` element (e.g. icon props), except reserved fields. |

### Dropdown.Group

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class (`role="group"`). |
| children | `React.ReactNode` | — | No | Group label and items. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other `div` attributes. |

### Dropdown.GroupLabel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | Yes | Group heading text. |

### Dropdown.Separator

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Extra class on the `hr`. |

## Related

- [Button](../button/COMPONENT.md) — typical trigger.
- [Link button](../link-button/COMPONENT.md) — text-style trigger when a button chrome is not desired.
- [Select](../select/COMPONENT.md) — single-value field with a labeled trigger.
- [Popover](../popover/COMPONENT.md) — generic portaled surface without `menu` / `menuitem` behavior.
- [Modal](../modal/COMPONENT.md) / [Drawer](../drawer/COMPONENT.md) — shells where menus often open from headers or rows.
- [Avatar](../avatar/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Typography](../typography/COMPONENT.md) — common header and row content.

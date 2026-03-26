# Dropdown

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite action menu: clicking the trigger opens a portal panel with a list of commands, groups, a header, and separators.

## When to use it

- **Entity cards** — secondary operations on a task, document, or ticket without a separate settings page.
- **Tables and logs** — “⋯” on a row: duplicate, export, open history, without moving focus away from the list.
- **Product header** — profile, sign out, plan, and help in one compact menu next to an avatar or button.
- **Narrow columns and dense UIs** — short trigger and long item labels: panel width follows the trigger and content size.
- **Wizards and step flows** — external `open` state to highlight a step, sync a hint, or send an analytics event.
- **Text triggers and links** — the same menu pattern on a link or underlined text when a separate button is not needed.

## Use cases

Each example is a different screen and intent; prop combinations do not repeat the same task.

### Basic

Common case: action menu on a task card in a tracker.

```tsx
import { Button, Dropdown } from "prime-ui-kit";

export function TaskCardMenu() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke" aria-label="Task actions">
          ⋯
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Dropdown.Item onSelect={() => console.log("edit")}>Edit</Dropdown.Item>
        <Dropdown.Item onSelect={() => console.log("copy")}>Duplicate</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item destructive onSelect={() => console.log("archive")}>
          Archive
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
```

### Variants and sizes

Logistics: compact panel on mobile width and a clearly dangerous action.

```tsx
import { Button, Dropdown } from "prime-ui-kit";

export function ShipmentCardMenu() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root size="s" variant="neutral" mode="lighter">
          Order #4821
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content size="s" align="start" side="bottom">
        <Dropdown.Item>Show route</Dropdown.Item>
        <Dropdown.Item>Contact courier</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item destructive>Cancel delivery</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
```

### In context (form / modal / sidebar / …)

Payout registry: row caption and operations menu side by side on one line of the filter bar.

```tsx
import { Button, Dropdown, Typography } from "prime-ui-kit";

export function PayoutRowToolbar() {
  return (
    <div className="dropdownDocPayoutToolbar">
      <div className="dropdownDocPayoutText">
        <Typography.Root size="m" weight="medium">
          Payout 12 Apr 2025
        </Typography.Root>
        <Typography.Root size="s" tone="muted">
          Payee: North LLC · 128,400 ₽
        </Typography.Root>
      </div>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="s" variant="neutral" mode="stroke" aria-label="Payout actions">
            Actions
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="end" sameMinWidthAsTrigger>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Documents</Dropdown.GroupLabel>
            <Dropdown.Item>Download statement</Dropdown.Item>
            <Dropdown.Item>Email copy</Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Item disabled>Reversal (unavailable)</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
}
```

### Controlled mode

Monitoring dashboard: parent holds the open flag to show a hint next to the filter menu.

```tsx
import * as React from "react";
import { Button, Dropdown, Typography } from "prime-ui-kit";

export function FilterMenuWithHint() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="row rowAlignCenter rowGapMedium">
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Range
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Dropdown.Item onSelect={() => setOpen(false)}>Today</Dropdown.Item>
          <Dropdown.Item onSelect={() => setOpen(false)}>7 days</Dropdown.Item>
          <Dropdown.Item onSelect={() => setOpen(false)}>30 days</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <Typography.Root as="span" size="s" tone="muted">
        Menu {open ? "open — you can highlight an onboarding step" : "closed"}
      </Typography.Root>
    </div>
  );
}
```

## Anatomy

- `Dropdown.Root` — open/close, controlled and uncontrolled modes, id linking trigger and menu, trigger ref for positioning.
- `Dropdown.Trigger` — exactly one child; ref, `aria-*`, and click toggle are merged onto it.
- `Dropdown.Content` — portal, `role="menu"`, positioning relative to the trigger, focus trap, close on Escape and outside click.
- `Dropdown.Inset` — inner padding and vertical spacing between direct children inside the panel.
- `Dropdown.Block` — section inside the panel (header + list).
- `Dropdown.Header`, `HeaderRow`, `HeaderLeading`, `HeaderMain`, `HeaderTitle`, `HeaderDescription`, `HeaderTrailing` — markup for a profile header or promo block.
- `Dropdown.Item` — button with `role="menuitem"`; on activation calls `onSelect` and closes the menu (unless the item is `disabled`).
- `Dropdown.ItemIcon` — icon to the left of the row text; default size comes from the `Content` tier.
- `Dropdown.Group`, `Dropdown.GroupLabel`, `Dropdown.Separator` — grouping and visual separation of blocks.

## API

### Dropdown.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| open | `boolean` | — | No | Controlled panel open state. |
| defaultOpen | `boolean` | `false` | No | Initial state in uncontrolled mode. |
| onOpenChange | `(open: boolean) => void` | — | No | Fired on open and close. |
| children | `React.ReactNode` | — | Yes | Trigger, content, and nested markup. |

### Dropdown.Trigger

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactElement` | — | Yes | Single element; ref, aria, and merged `onClick` are applied to it. |
| asChild | `boolean` | `true` | No | Kept in the type for consistency; the trigger always clones the child element. |

### Dropdown.Content

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| align | `"start" \| "center" \| "end"` | `"start"` | No | Horizontal alignment of the panel relative to the trigger. |
| side | `"bottom" \| "top"` | `"bottom"` | No | Preferred side; recalculated when there is not enough space. |
| sameMinWidthAsTrigger | `boolean` | `false` | No | Minimum panel width is not less than the trigger width. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Token tier for the panel, rows, group labels, and default icon size. |
| className | `string` | — | No | Extra class on the portal panel. |
| children | `React.ReactNode` | — | Yes | Nested menu: Inset, Block, Group, Item, etc. |

### Dropdown.Inset

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| padding | `"none" \| "x1" \| "x2" \| "x3"` | `"x2"` | No | Inner padding from the `Content` edge. |
| gap | `"none" \| "x2" \| "x3" \| "x4"` | `"x3"` | No | Vertical gap between direct children. |
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | Yes | Blocks and items inside the inset. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other container attributes. |

### Dropdown.Block

Inherits `HTMLDivElement` attributes.

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Extra class on the section. |
| children | `React.ReactNode` | — | No | Header, groups, and items. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other `div` attributes. |

### Dropdown.Header

Same as `Dropdown.Block`: `className`, `children`, remaining `div` attributes.

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
|------|-----|---------|----------|-------------|
| truncate | `boolean` | — | No | Single-line truncation with ellipsis. |
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Description text. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other `div` attributes. |

### Dropdown.HeaderTrailing

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| alignSelf | `"start" \| "center"` | `"start"` | No | Vertical alignment of the slot in the header row. |
| className | `string` | — | No | Extra class. |
| children | `React.ReactNode` | — | No | Badge, button, etc. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other container attributes. |

### Dropdown.Item

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| onSelect | `() => void` | — | No | Called on activation; then the menu closes. |
| disabled | `boolean` | — | No | Item is inactive; does not close the menu on click. |
| destructive | `boolean` | — | No | Visual emphasis for a dangerous action (`data-destructive`). |
| className | `string` | — | No | Extra class on the item button. |
| children | `React.ReactNode` | — | Yes | Text, `ItemIcon`, and other row markup. |

### Dropdown.ItemIcon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| as | `React.ElementType` | `"span"` | No | Root element or icon component. |
| aria-hidden | `boolean \| "true" \| "false"` | `true` | No | Hide decorative icon from assistive tech when the item has text. |
| className | `string` | — | No | Extra class on the wrapper. |
| children | `React.ReactNode` | — | No | Content when the icon is not set via `as`. |
| size | `number` | from `Content` tier | No | Icon size in px. |
| …rest | `Record<string, unknown>` | — | No | Passed through to the `as` element (e.g. `strokeWidth`), except reserved fields. |

### Dropdown.Group

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Extra class (`role="group"`). |
| children | `React.ReactNode` | — | No | Group label and items. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other `div` attributes. |

### Dropdown.GroupLabel

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Extra class on the label. |
| children | `React.ReactNode` | — | Yes | Group heading text. |

### Dropdown.Separator

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Extra class on the `hr`. |

## Variants

- **`Dropdown.Content` · `size`** — single tier for the panel, row height, group label typography, and default size in `ItemIcon`. Sizes: `s`, `m` (default), `l`, `xl`. When size changes, the following update automatically:
  - Panel padding
  - Menu item min height
  - Item horizontal padding (`padding-inline`)
  - Item and group label font size
  - Icon size in `ItemIcon` (unless overridden with the `size` prop)
  - Item border radius
  - Header padding and spacing between elements
- **`Dropdown.Item` · `destructive`** — highlight dangerous commands (delete, cancel, block).
- **`Dropdown.Content` · `align` / `side`** — anchor to the trigger edge and preference to open below or above; the final side may change if the viewport is tight.
- **`Dropdown.HeaderDescription` · `truncate`** — long secondary text in the header on one line.
- **`Dropdown.Inset` · `padding` / `gap`** — tighter or looser text and list block inside the panel.

## States

- **Closed** — portal menu is not mounted; trigger has `aria-expanded={false}`.
- **Open** — panel in the portal, `aria-expanded={true}`, `data-size` and `data-side` on the menu container (actual side after layout).
- **Uncontrolled mode** — `defaultOpen` sets the initial value; state lives inside `Root` afterward.
- **Controlled mode** — `open` and `onOpenChange` fully control visibility from outside.
- **Disabled item** — `disabled` on `Dropdown.Item`: `aria-disabled`, `tabIndex={-1}`, click and keyboard activation do not call `onSelect` or close the menu.

## Accessibility (a11y)

- Trigger gets `aria-expanded`, `aria-haspopup="menu"`, `aria-controls` pointing at the panel id; panel has `role="menu"` and `aria-labelledby` pointing at the trigger id.
- Items use `role="menuitem"`; disabled items get `aria-disabled` and are excluded from activation logic.
- Open panel uses a focus trap and returns focus to the trigger on close; **Escape** and clicks outside the trigger and panel close the menu.
- **Up/Down** arrows, **Home**, and **End** move focus among enabled items; **Enter** and **Space** activate an item.
- For icon-only or symbol-only triggers, provide an accessible name: `aria-label` on the button or meaningful text inside the link.

## Limitations and notes

- The component targets a **flat menu**: nested second-level submenus are not part of the API — combine with navigation or other patterns for deep hierarchies.
- This is an **action menu**, not a form value picker — for a closed field showing the selected value, use **Select**.
- **`Dropdown.Trigger`** accepts exactly **one** React element; wrap composite triggers in a single node (e.g. `span` or `Button.Root`).
- After a successful `onSelect`, the menu **closes**; a disabled item does not close it.
- The panel renders in a **portal**; account for z-index and focus when nested inside **Modal** or **Drawer**.
- **Icon sizes**: `Dropdown.ItemIcon` picks icon size from `Dropdown.Content`’s `size`. **Do not** set the `size` prop on `ItemIcon` if you want icons to scale with the menu. An explicit `size` overrides the automatic size and breaks design-system consistency.

## Related components

- **Button** — typical menu trigger; **LinkButton** — when you need text emphasis outside a button.
- **Select** — pick one value from a list with a label on the trigger.
- **Popover** — neutral portal container without menu role or `menuitem` traversal.
- **Modal** / **Drawer** — scenario shells where menus may open from a header or row.
- **Avatar**, **Badge**, **Typography** — common content inside `Header` and `Item` rows.

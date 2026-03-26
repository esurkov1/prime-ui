# Select

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite dropdown: a trigger button showing the current value or a hint, plus a portal menu with options to pick exactly one value.

## When to use it

- **Onboarding and surveys** — pick a role, country, or request category from a fixed set without free-form input.
- **Account settings** — UI language, time zone, or units in a compact field alongside other controls.
- **Commerce and logistics** — delivery method, warehouse, or price currency: a short label in the trigger, a fuller name in the list.
- **Analytics and dashboards** — a single filter dimension (interval, audience segment) with a clear value after selection.
- **Support and tickets** — priority, product line, or owning team in a case form or assignment dialog.
- **Infrastructure and operations** — deployment region, queue, or environment; long lists with groups and temporarily unavailable items.

## Use cases

Subsections are split by screen and task; each includes a meaningful code example.

### Basic

A typical subscription form: hint in the trigger until a plan is chosen.

```tsx
import { Select } from "prime-ui-kit";

export function PlanField() {
  return (
    <Select.Root size="m" placeholder="Choose a plan">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="starter">Starter</Select.Item>
        <Select.Item value="growth">Growth</Select.Item>
        <Select.Item value="scale">Scale</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
```

### Sizes and default value

Device panel or app header: compact control with a preset option.

```tsx
import { Select } from "prime-ui-kit";

export function ThemeCompactSelect() {
  return (
    <Select.Root size="s" defaultValue="system">
      <Select.Trigger aria-label="Theme">
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="light">Light</Select.Item>
        <Select.Item value="dark">Dark</Select.Item>
        <Select.Item value="system">System</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
```

### In context (form with label and hint)

Profile screen: `Label` + select + `Hint`. `Label.Root` gets a stable `id`; the trigger uses `aria-labelledby` because the trigger button `id` is generated inside the component.

```tsx
import * as React from "react";
import { Hint } from "prime-ui-kit";
import { Label } from "prime-ui-kit";
import { Select } from "prime-ui-kit";

export function TimezoneField() {
  const labelId = React.useId();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        maxWidth: "20rem",
      }}
    >
      <Label.Root id={labelId} size="m">
        Time zone
      </Label.Root>
      <Select.Root size="m" defaultValue="utc3">
        <Select.Trigger aria-labelledby={labelId}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="utc0">UTC+0 (London)</Select.Item>
          <Select.Item value="utc3">UTC+3 (Moscow)</Select.Item>
          <Select.Item value="utc9">UTC+9 (Tokyo)</Select.Item>
        </Select.Content>
      </Select.Root>
      <Hint.Root size="s" variant="neutral">
        Affects reminder times and “today” reports.
      </Hint.Root>
    </div>
  );
}
```

### Controlled mode

Parent owns the value (URL sync, filter reset, store persistence).

```tsx
import * as React from "react";
import { Select } from "prime-ui-kit";

export function IntervalToolbar() {
  const [range, setRange] = React.useState("7d");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Select.Root value={range} onChange={setRange} size="m" placeholder="Interval">
        <Select.Trigger aria-label="Metrics interval">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="24h">24 hours</Select.Item>
          <Select.Item value="7d">7 days</Select.Item>
          <Select.Item value="30d">30 days</Select.Item>
        </Select.Content>
      </Select.Root>
      <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>Active: {range}</span>
    </div>
  );
}
```

### Inside a modal

Support flow: pick a category inside a dialog with action buttons.

```tsx
import { Button } from "prime-ui-kit";
import { Modal } from "prime-ui-kit";
import { Select } from "prime-ui-kit";

export function TicketCategoryModal() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          New ticket
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="ticket-cat-title">
            <Modal.Header>
              <Modal.Title id="ticket-cat-title">Request category</Modal.Title>
              <Modal.Description>Choose a topic before sending to the queue.</Modal.Description>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="ghost" aria-label="Close dialog">
                  Close
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Body>
              <Select.Root size="m" defaultValue="billing" placeholder="Category">
                <Select.Trigger aria-label="Ticket category">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="billing">Billing and invoices</Select.Item>
                  <Select.Item value="bug">Outage or bug</Select.Item>
                  <Select.Item value="access">Access and roles</Select.Item>
                </Select.Content>
              </Select.Root>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Cancel
                </Button.Root>
              </Modal.Close>
              <Button.Root size="m" variant="primary">
                Submit
              </Button.Root>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### Icons, trigger label, groups, and disabled item

Combines `Select.TriggerIcon` and `Select.ItemIcon`, a long field label via item `label`, list sections, and a “busy” item.

```tsx
import { Icon } from "prime-ui-kit/icons";
import { Select } from "prime-ui-kit";

export function RegionSelectRich() {
  return (
    <Select.Root size="m" defaultValue="eur" placeholder="Report currency">
      <Select.Trigger>
        <Select.TriggerIcon>
          <Icon name="nav.layoutGrid" size="s" tone="subtle" />
        </Select.TriggerIcon>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupLabel>Primary</Select.GroupLabel>
          <Select.Item value="rub" label="RUB — Russian ruble">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            ₽ RUB
          </Select.Item>
          <Select.Item value="eur" label="EUR — Euro">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            € EUR
          </Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.GroupLabel>Limited</Select.GroupLabel>
          <Select.Item value="usd" disabled label="USD — US dollar">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            $ USD
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
```

## Anatomy

- `Select.Root` — value (controlled or not), list open state, item highlight, size, `hasError`, `disabled`, `placeholder`.
- `Select.Trigger` — `role="combobox"` button; main row slot inside and a fixed chevron on the right.
- `Select.Value` — selected item text, otherwise `placeholder` (hint styling via data attribute).
- `Select.TriggerIcon` — optional icon to the left of the value in the trigger.
- `Select.Content` — portal `role="listbox"` positioned relative to the trigger with keyboard navigation; not rendered while closed.
- `Select.Item` — `role="option"`; child `Select.ItemIcon` is typed and rendered before the text.
- `Select.Group` / `Select.GroupLabel` / `Select.Separator` — structure for long lists.

## API

### Select.Root

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Trigger size and list tokens. |
| value | `string` | — | No | Controlled value. |
| defaultValue | `string` | — | No | Initial value when `value` is not used. |
| onChange | `(value: string) => void` | — | No | Called after an item is selected. |
| disabled | `boolean` | — | No | Blocks opening and selection. |
| placeholder | `string` | — | No | Text when nothing is selected. |
| hasError | `boolean` | `false` | No | Error styling on the trigger. |
| children | `React.ReactNode` | — | Yes | Trigger and list content. |

### Select.Trigger

Inherits `HTMLButtonElement` attributes except forced `id`, `type`, and `role`. Supports `ref` (forwardRef).

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| children | `React.ReactNode` | — | No | Usually `Select.Value` and optionally `Select.TriggerIcon`. |
| className | `string` | — | No | Extra class. |
| disabled | `boolean` | — | No | Native disable; final state respects `Select.Root`. |
| ref | `React.Ref<HTMLButtonElement>` | — | No | Ref to the button element. |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "id" \| "type" \| "role">` | — | No | Including `aria-label`, `aria-labelledby`, handlers. |

### Select.Value

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| className | `string` | — | No | Class for value / hint text. |

### Select.TriggerIcon

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| children | `React.ReactNode` | — | No | Slot content (icon). |
| className | `string` | — | No | Wrapper class. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other `span` attributes. |

### Select.Content

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| className | `string` | — | No | Portal list class. |
| children | `React.ReactNode` | — | Yes | Items and groups. |

### Select.Item

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| value | `string` | — | Yes | Option value. |
| label | `string` | — | No | Label in the trigger; otherwise from children text or `value`. |
| disabled | `boolean` | — | No | Not selectable; skipped in keyboard navigation. |
| className | `string` | — | No | Item class. |
| children | `React.ReactNode` | — | Yes | Text and optional `Select.ItemIcon`. |
| ref | `React.Ref<HTMLDivElement>` | — | No | Ref on the option root. |

### Select.ItemIcon

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| children | `React.ReactNode` | — | No | Icon in the item row. |
| className | `string` | — | No | Wrapper class. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes. |

### Select.Group

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| className | `string` | — | No | Group class (`role="group"`). |
| children | `React.ReactNode` | — | No | Label and items. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### Select.GroupLabel

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| className | `string` | — | No | Label class. |
| children | `React.ReactNode` | — | No | Heading text. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### Select.Separator

| Prop | Type | Default | Required | Description |
|------|-----|-------------|-------------|----------|
| className | `string` | — | No | `hr` class. |
| …rest | `React.HTMLAttributes<HTMLHRElement>` | — | No | `hr` attributes. |

## Variants

There is no separate `variant` prop: one visual field style. Differences come from `size`, `hasError` semantics, and optional classes on subcomponents.

## States

- **Empty value** — shows `placeholder`; `Select.Value` gets hint styling.
- **Selected** — trigger shows the item’s `label` or children text.
- **Root disabled** — `disabled` on `Select.Root`: inactive trigger, list cannot open.
- **Item disabled** — `disabled` on `Select.Item`: not selectable by click, skipped by arrow keys.
- **Error** — `hasError` on `Select.Root`: emphasized trigger outline.
- **Open** — portal listbox with focus and current item highlight.

## Accessibility (a11y)

- Trigger: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls` points to the listbox.
- List: `role="listbox"`, `aria-labelledby` ties to the trigger; focus moves into the panel on open.
- Items: `role="option"`, `aria-selected`, `aria-disabled` when needed.
- Keyboard: Up/Down, Home/End, Enter/Space to select, Escape closes the list (also handled by hooks outside the list).
- If the trigger has no visible text label, set `aria-label` on `Select.Trigger`. For an external `Label` with `htmlFor`, use `aria-labelledby` on the trigger with the label’s `id` (see “In context” use case).

## Limitations and notes

- Only **single** selection; multi-select and list search are not part of this component.
- Values are strings; coerce numbers and enums to strings yourself.
- While closed, unmounted `Select.Item` nodes do not initialize labels — until first open the trigger may show raw `value` if the label is not yet known.
- List position (above/below the trigger) is chosen internally from viewport space; there are no public `side` / `align` props.

## Related components

- **Label** — field label; **Hint** — helper text under the select.
- **Input** — when free-form input is needed instead of a fixed list.
- **Dropdown** — action menu, not form value selection.
- **Modal** / **Drawer** — wrappers for focus and portal scenarios; account for the nested list portal.

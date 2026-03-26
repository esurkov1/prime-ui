# Tag

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A compact label (chip): text, an optional icon, and an optional remove control. A compound component with a root element (`Tag.Root`) and an icon slot (`Tag.Icon`), sized consistently via context.

## When to use it

- **Filters and search** — selected criteria in a catalog filter panel, product or category tags with one-click removal.
- **Forms and editors** — email recipients, attached files, or selected skills in a profile, where each item can be removed without returning to the input field.
- **Metadata and classification** — project technologies, task statuses, or document labels on a card when compactness and visual grouping matter without extra columns.

## Use cases

### Basic

Static technology labels on a project card with no removal.

```tsx
import { Tag } from "prime-ui-kit";

export function ProjectTechStack() {
  return (
    <div className="previewRowWrap">
      <Tag.Root>React</Tag.Root>
      <Tag.Root>TypeScript</Tag.Root>
      <Tag.Root>prime-ui-kit</Tag.Root>
    </div>
  );
}
```

### Sizes

Filter panel: different sizes for emphasis — larger for active filters, smaller for available options.

```tsx
import { Tag } from "prime-ui-kit";

export function FilterTags() {
  return (
    <div className="previewRowWrap rowAlignCenter">
      <Tag.Root size="l">Active filter</Tag.Root>
      <Tag.Root size="m">Medium tag</Tag.Root>
      <Tag.Root size="s">Small tag</Tag.Root>
    </div>
  );
}
```

### Removable tags

A list of selected recipients with per-item removal.

```tsx
import * as React from "react";
import { Tag } from "prime-ui-kit";

export function RecipientList() {
  const [recipients, setRecipients] = React.useState(["alice@example.com", "bob@example.com"]);

  return (
    <div className="previewRowWrap">
      {recipients.map((email) => (
        <Tag.Root
          key={email}
          onRemove={() => setRecipients((prev) => prev.filter((e) => e !== email))}
        >
          {email}
        </Tag.Root>
      ))}
    </div>
  );
}
```

### With icons

Labels with icons for visual categorization.

```tsx
import { Tag } from "prime-ui-kit";
import { Icon } from "prime-ui-kit";

export function TagsWithIcons() {
  return (
    <div className="previewRowWrap">
      <Tag.Root>
        <Tag.Icon>
          <Icon name="status.locked" />
        </Tag.Icon>
        <span>Secured</span>
      </Tag.Root>
      <Tag.Root>
        <Tag.Icon>
          <Icon name="field.email" />
        </Tag.Icon>
        <span>Newsletter</span>
      </Tag.Root>
    </div>
  );
}
```

## Anatomy

- `Tag.Root` — root `span` with `data-size` and `data-disabled`; wraps children in `ControlSizeProvider` so icon sizes match.
- `Tag.Icon` — `span` for the icon to the left of the text.
- Remove button — rendered automatically when `onRemove` is set; built-in cross SVG with fixed `aria-label="Remove"`.

## Import

```ts
import { Tag } from "prime-ui-kit";
```

## API

### Tag.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` or size from `ControlSizeContext` | No | Tag size; visual tier for height, radius, text, and icon. |
| `onRemove` | `() => void` | — | No | When set, a remove button with a cross is rendered on the right. |
| `disabled` | `boolean` | — | No | Disables the tag and remove button; sets `aria-disabled` on the root. |
| `children` | `React.ReactNode` | — | No | Body content: text, `Tag.Icon`, other nodes. |
| `className` | `string` | — | No | Extra class on the root `span`. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other root `span` attributes (`data-*`, `aria-*`, etc.). |

### Tag.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `children` | `React.ReactNode` | — | Yes | Icon node. |
| `className` | `string` | — | No | Extra class on the wrapper. |

## Variants

There is no separate `variant` prop. Visual differences come only from **`size`** (four steps from `s` to `xl`) and **`onRemove`** (removable vs static tag).

## States

- **Default** — interactive when `onRemove` is present, without `disabled`.
- **disabled** — visually muted; remove button is natively disabled (`disabled` on `<button>`); root has `aria-disabled`.
- **Static** — without `onRemove`, there is no remove button and the tag is not interactive.

## Accessibility (a11y)

- Root is a native `span`; the tag itself has no keyboard behavior (it is not a button or link).
- Remove control is a native `<button type="button">` with fixed `aria-label="Remove"`; focusable with Tab, activated with Enter/Space.
- For meaningful removal context, wrap a group of tags in an element with `aria-label` or `aria-labelledby` so screen readers know what is being removed.
- `Tag.Icon` does not set `aria-hidden` — if the icon is decorative, ensure adjacent text is enough to convey meaning.

## Limitations and notes

- This is **not** a toggle and **not** a selection control; for choosing from options use `Checkbox`, `SegmentedControl`, or `Select`.
- The remove button has a **fixed** `aria-label="Remove"` (in the component source); localization requires a fork or wrapper.
- Size without an explicit `size` depends on **`ControlSizeProvider`** higher in the tree; **`m`** is used outside that context.
- **Icons** inside `Tag.Icon` automatically inherit size from `Tag.Root` via `ControlSizeProvider`.

## Related components

- **Badge** — static label without removal, for status or count.
- **Button** — when the label should be an action (click), not only visual.
- **Chip** (if present in the library) — alternative interactive label pattern.
- **Input**, **Select** — tags often show selected values in multiselects or autocomplete fields.

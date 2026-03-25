# Divider

## What it is

`Divider` is a visual content separator: a horizontal or vertical line, optionally with a label or icon.

## What it’s for

- **Account and payments** — separate the “payment method” block from order totals or transaction history without an extra “frame”.
- **Catalog and product card** — visually break up long descriptions, specs, and reviews while keeping a single column.
- **Internal tools** — group actions in a panel (filter | sort | export) with vertical bars between items.

## Use cases

### Basic

The most common case: a horizontal line between paragraphs, or a solid line with no text.

```tsx
import { Divider } from "prime-ui-kit";

export function OrderSummary() {
  return (
    <section>
      <p>Order contents: 3 items</p>
      <Divider.Root />
      <p>Delivery: tomorrow, 10:00–14:00</p>
      <Divider.Root size="m">Total</Divider.Root>
      <p>12,400 ₽</p>
    </section>
  );
}
```

### Variants and sizes

Another context — app settings: sections with a `text`-style label and a compact `line-spacing` marker between blocks in a column with `gap`.

```tsx
import { Checkbox, Divider } from "prime-ui-kit";

export function NotificationSettings() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
      <Divider.Root variant="text" size="l">
        Push notifications
      </Divider.Root>
      <Checkbox.Root size="m">
        <Checkbox.Label>Product news</Checkbox.Label>
      </Checkbox.Root>
      <Divider.Root variant="line-spacing" size="m" />
      <Checkbox.Root size="m">
        <Checkbox.Label>Event reminders</Checkbox.Label>
      </Checkbox.Root>
    </div>
  );
}
```

### In context (card and panel)

Document or article screen: a narrow text column and a full-width line at the card edge; separately — a panel with vertical dividers.

```tsx
import { Divider } from "prime-ui-kit";

export function ArticleCard() {
  return (
    <article style={{ maxWidth: 320, padding: 16, border: "1px solid #e5e5e5", borderRadius: 8 }}>
      <h2 style={{ margin: "0 0 8px" }}>Draft</h2>
      <p style={{ margin: 0 }}>Preview text…</p>
      <Divider.Root size="m" style={{ margin: "12px 0" }} />
      <p style={{ margin: 0, fontSize: 14 }}>Updated today</p>
    </article>
  );
}

export function EditorToolbar() {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 8, height: 40 }}>
      <span style={{ alignSelf: "center" }}>Bold</span>
      <Divider.Root orientation="vertical" size="m" />
      <span style={{ alignSelf: "center" }}>Italic</span>
      <Divider.Root orientation="vertical" size="m" />
      <span style={{ alignSelf: "center" }}>Link</span>
    </div>
  );
}
```

### Label with icon and decorative line

A “Contacts” section with an icon in the label; separately — a line used only for layout, hidden from assistive technologies.

```tsx
import { Divider } from "prime-ui-kit";

function MailIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
    </svg>
  );
}

export function ProfileContacts() {
  return (
    <>
      <Divider.Root variant="text" size="m">
        <MailIcon /> Get in touch
      </Divider.Root>
      <Divider.Root size="m" role="presentation" aria-hidden />
    </>
  );
}
```

## Anatomy

Flat API: **`Divider.Root`** renders a single `div` with `::before` and `::after` pseudo-elements (the lines). When `children` are present, they go inside a `span` with the content class; for `children`, `ControlSizeProvider` is enabled with the same `size` as the root.

## API

### Divider.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| orientation | `"horizontal"` \| `"vertical"` | `"horizontal"` | No | Horizontal line across the row or vertical between siblings. |
| align | `"start"` \| `"center"` \| `"end"` | `center` for `variant="default"`, `start` for `variant="text"` | No | Length of the line segment left/right of the label. |
| variant | `"default"` \| `"line-spacing"` \| `"text"` | `"default"` | No | Styling mode and participation in flex column layout (`line-spacing`). |
| size | `"s"` \| `"m"` \| `"l"` \| `"xl"` | `"m"` | No | Tokens for spacing, label typography, and icon size in content. |
| children | `React.ReactNode` | — | No | Label, icon + text, or omitted (solid line). |
| className | `string` | — | No | Extra class on the root. |
| role | `string` | `"separator"` | No | Element semantics; for decoration, often `presentation`. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Including `aria-*`, `data-*`, handlers. |

## Variants

- **`default`** — line with an optional centered label (or empty line full width of the row).
- **`line-spacing`** — does not stretch in a flex column; rhythm between blocks comes from the parent’s `gap`; the divider is a visual stroke between them.
- **`text`** — label styled like a section heading (uppercase, muted color); defaults to `align="start"`.

## States

There are no interactive states (`disabled`, `loading`, etc.): the component is decorative. Behavior can be extended via standard root HTML attributes (e.g. `aria-hidden` together with a changed `role`).

## Accessibility (a11y)

- By default **`role="separator"`**; for **`orientation="vertical"`**, **`aria-orientation="vertical"`** is added.
- If the line carries no meaning for screen readers, set **`role="presentation"`** (or **`none`**) and **`aria-hidden`** so you don’t duplicate structure already conveyed by nearby text.
- A vertical divider in a panel is not focusable by itself; focus stays on adjacent buttons or links.

## Limitations and notes

- Does not replace semantic document boundaries (`section` / meaningful `hr`): combine with correct page markup when needed.
- Vertical mode needs a **bounded height** on the flex parent (`align-items: stretch`), otherwise the line won’t show.
- The visual “nominal” size in CSS is one step below the passed `data-size` (note in component styles) — keep in mind when aligning with neighboring controls.

## Related components

- **Typography** — primary text next to the divider label.
- **Button** / **Link button** — toolbar items separated by a vertical `Divider`.
- **Tabs**, **Accordion** — alternatives when you need switchable section structure, not a line.

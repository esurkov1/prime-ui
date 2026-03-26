# Divider

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

`Divider` is a non-interactive visual separator: a horizontal or vertical line drawn with pseudo-elements, optionally wrapping a label or icon so control sizing matches the chosen `size`.

**When to use**

- Separate blocks in a form, card, or settings column without an extra bordered panel.
- Add a vertical bar between adjacent toolbar or inline actions.
- Mark rhythm between stacked sections when the parent is a flex column with `gap` (`variant="line-spacing"`).
- Show a short section title inline with the line (`variant="text"`), alongside real headings or `section` structure where it matters.

**When not to use**

- As the only semantic boundary for document structure — prefer meaningful headings or `hr` when the split carries meaning for assistive tech.
- For switchable or collapsible grouping — use [Tabs](../tabs/COMPONENT.md) or [Accordion](../accordion/COMPONENT.md) instead.
- In vertical orientation when the flex row has no definite height — the line needs stretch from the parent (`align-items: stretch`).
- When the stroke is purely decorative noise next to text that already states the structure — hide it from AT (`role` / `aria-hidden`; see Rules).

## Composition

- Single public part: **`Divider.Root`** — a `div` root with line segments from `::before` / `::after`; optional **`children`** render inside a **`span`** (content slot) wrapped in **`ControlSizeProvider`** so nested controls inherit the same `size`.
- No required child order beyond placing **`Divider.Root`** where the separator should appear in the layout.

### Minimal example

```tsx
import { Divider } from "prime-ui-kit";

export function Example() {
  return <Divider.Root />;
}
```

## Rules

- **Non-interactive:** there are no `disabled`, `loading`, or focus states; behavior comes only from standard HTML attributes on the root.
- **`variant="default"`** — full-width line with an optional centered label (`align` defaults to **`center`** unless overridden).
- **`variant="text"`** — section-style label; **`align`** defaults to **`start`** if you omit it.
- **`variant="line-spacing"`** — intended between flex children; vertical rhythm comes from the parent’s **`gap`**, not from stretching the divider like a spacer block.
- **Semantics:** default **`role="separator"`**; for **`orientation="vertical"`**, **`aria-orientation="vertical"`** is set automatically.
- **Pure decoration:** if the line adds no information, set **`role="presentation"`** (or **`none`**) and **`aria-hidden`** so screen readers are not given a redundant separator.
- **Sizing note:** rendered stroke thickness aligns with internal tokens for the chosen `data-size`; when matching adjacent controls, rely on the same **`size`** rather than ad hoc pixel tweaks.

## API

### Divider.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| orientation | `"horizontal"` \| `"vertical"` | `"horizontal"` | No | Line direction across the row or between siblings in a row. |
| align | `"start"` \| `"center"` \| `"end"` | `center` for `variant="default"` or `"line-spacing"`; `start` for `variant="text"` | No | How the line segments balance around the label. |
| variant | `"default"` \| `"line-spacing"` \| `"text"` | `"default"` | No | Visual mode and flex participation (`line-spacing` for gap-driven stacks). |
| size | `"s"` \| `"m"` \| `"l"` \| `"xl"` | `"m"` | No | Spacing, label typography, and nested control size context. |
| children | `React.ReactNode` | — | No | Label, icon + text, or omit for a solid line. |
| className | `string` | — | No | Additional class on the root element. |
| role | `string` | `"separator"` | No | ARIA role; use `presentation` / `none` for decorative lines. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `aria-*`, `data-*`, event handlers, and other div props. |

## Related

- [Typography](../typography/COMPONENT.md) — body and heading text beside labels.
- [Button](../button/COMPONENT.md) — toolbar actions often separated with a vertical divider.
- [Link button](../link-button/COMPONENT.md) — inline actions in the same toolbar pattern.
- [Tabs](../tabs/COMPONENT.md) — switchable sections instead of a static line.
- [Accordion](../accordion/COMPONENT.md) — collapsible sections when separation should be interactive.

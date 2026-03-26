# Divider

## Canonical

- **What:** `Divider.Root` draws a horizontal or vertical separator (pseudo-element lines) with optional **children** (label, icon + text). Nested controls inherit **`size`** via **`ControlSizeProvider`**.
- **Defaults:** `orientation="horizontal"`, `variant="default"`, `size="m"`. **`align`** defaults to **`start`** for **`variant="text"`**, otherwise **`center`**.
- **Import:** `import { Divider } from "prime-ui-kit"`.

```tsx
import { Divider } from "prime-ui-kit";

export function Example() {
  return <Divider.Root />;
}
```

## Extended

### About

`Divider` is a non-interactive visual separator: a line built from `::before` / `::after`, optionally wrapping a label or icon. **`Icon`** inside **`children`** does not use its own size classes — glyph size follows **`--prime-divider-icon`** from the root **`data-size`**.

**When to use**

- Separate blocks in a form, card, or settings column without an extra bordered panel.
- Full-width rows in a list-like shell (`examples/list-separators.tsx`).
- Section-style labels inline with the line (`variant="text"`) — see `examples/section-breaks.tsx`.
- Between flex children in a column when rhythm comes from the parent **`gap`** (`variant="line-spacing"`) — see `examples/line-spacing-column.tsx`.
- A vertical bar between toolbar actions (`orientation="vertical"`); parent row should **`align-items: stretch`** so the line gets height.

**When not to use**

- As the only semantic boundary for document structure — use real headings / **`section`** (and **`hr`** when a thematic break is appropriate).
- For switchable or collapsible grouping — use [Tabs](../tabs/COMPONENT.md) or [Accordion](../accordion/COMPONENT.md).
- **`orientation="vertical"`** in a row with no definite height — the vertical line needs stretch from the parent.
- Purely decorative repetition next to text that already states structure — hide from AT (**`role="presentation"`**, **`aria-hidden`**) per **Rules**.

### Composition

- Single public part: **`Divider.Root`** — optional **`children`** render in an inner **`span`** (**`styles.content`**).
- Place **`Divider.Root`** in document order where the break should appear; no required child structure beyond optional slot content.

### Examples (source)

| Scenario | File |
|----------|------|
| Section breaks (`variant="text"`) | [`examples/section-breaks.tsx`](examples/section-breaks.tsx) |
| Splits inside one card | [`examples/card-splits.tsx`](examples/card-splits.tsx) |
| List row separators | [`examples/list-separators.tsx`](examples/list-separators.tsx) |
| Inset copy in a stack, full-bleed rules | [`examples/inset-stack.tsx`](examples/inset-stack.tsx) |
| `line-spacing` + vertical toolbar | [`examples/line-spacing-column.tsx`](examples/line-spacing-column.tsx) |

Shared layout tokens for the examples: [`examples/divider-examples.module.css`](examples/divider-examples.module.css).

Playground snippets (broader overview): `playground/snippets/divider/` (`variants.tsx`, `sizes.tsx`, `composition.tsx`).

### Rules

- **Non-interactive:** no disabled/loading/focus states; behavior is plain **`div`** semantics unless you set **`role`** / **`aria-*`**.
- **`variant="default"`** — full-width line; optional centered label unless **`align`** overrides.
- **`variant="text"`** — uppercase section label styling; **`align`** defaults to **`start`**.
- **`variant="line-spacing"`** — **`flex: 0 0 auto`** so it does not act as a flex grow spacer; spacing is the parent’s **`gap`**.
- **Semantics:** default **`role="separator"`**; for **`orientation="vertical"`**, **`aria-orientation="vertical"`** is set automatically.
- **Decoration:** redundant lines → **`role="presentation"`** (or **`none`**) and **`aria-hidden`** (see list example).
- **Sizing:** match adjacent controls with the same **`size`** prop; do not patch stroke width with ad hoc pixels.

### API

#### Divider.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| orientation | `"horizontal"` \| `"vertical"` | `"horizontal"` | No | Line direction. |
| align | `"start"` \| `"center"` \| `"end"` | `center` for `default` / `line-spacing`; `start` for `text` | No | Balance of `::before` / `::after` stubs around content. |
| variant | `"default"` \| `"line-spacing"` \| `"text"` | `"default"` | No | Visual mode and flex participation. |
| size | `"s"` \| `"m"` \| `"l"` \| `"xl"` | `"m"` | No | Gap, label type, icon scale, **`ControlSizeProvider`** value. |
| children | `React.ReactNode` | — | No | Label, icon + text, or omit for a solid line. |
| className | `string` | — | No | Extra class on the root. |
| role | `string` | `"separator"` | No | Override for decorative separators. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | `aria-*`, `data-*`, etc. |

### Related

- [Typography](../typography/COMPONENT.md)
- [Button](../button/COMPONENT.md)
- [Link button](../link-button/COMPONENT.md)
- [Tabs](../tabs/COMPONENT.md)
- [Accordion](../accordion/COMPONENT.md)

## LLM note

- One export shape: **`Divider.Root`** only; no subcomponents.
- **`variant` × `align` defaults:** `text` → **`align` `start`**; else **`center`** (explicit **`align`** always wins).
- **`line-spacing`:** use only when the parent flex column uses **`gap`** for vertical rhythm; divider must not be relied on for layout height.
- **Vertical:** requires ancestor **`align-items: stretch`** (or explicit height) so `::before`/`::after` flex segments fill the row.
- **Children:** toggles inner **`span`** and **`ControlSizeProvider`**; **`Icon`** ignores its own **`size`** when inside divider content.
- **a11y:** default **`separator`** is announced; for decorative list lines between items, mirror **`examples/list-separators.tsx`**: **`ul`/`li`**, separator **`li`** with **`aria-hidden`**, **`Divider.Root`** with **`role="presentation"`**.
- **Playground alignment:** `playground/snippets/divider/variants.tsx` shows default vs `text` vs `line-spacing` vs vertical in one frame.

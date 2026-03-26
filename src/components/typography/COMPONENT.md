# Typography

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Styled text primitive with a fixed size scale and optional axes: weight, tracking, italic, and muted tone. Renders as a native `p`, `span`, or `div`.

- **Use** for body copy, captions, metrics, and inline emphasis where you want kit typography tokens instead of ad hoc font sizes.
- **Use** `tone="muted"` for secondary explanations and legal or helper-style lines at any step of the size scale.
- **Use** nested `Typography.Root` instances with different `as` values when you need mixed weight or tracking inside one paragraph.
- **Do not use** for page or section headings; `Typography` does not expose `h1`–`h6`—use native heading elements or another pattern for document outline.
- **Do not use** `as` to stand in for buttons or links; wrap real `<button>` / `<a>` elements and style their labels with typography or dedicated components.
- **Do not use** expecting a separate line-height control; line height is tied to `size` in the component styles.

## Composition

- Single part: **`Typography.Root`**. No provider or child slots—put text or inline elements in **`children`**.
- Optional **`as`** chooses the host element (`p` by default); valid values are **`p`**, **`span`**, and **`div`** only—pick one that matches valid HTML nesting (e.g. avoid `p` inside `p`).

### Minimal example

```tsx
import { Typography } from "prime-ui-kit";

export function Example() {
  return <Typography.Root size="m">Hello</Typography.Root>;
}
```

## Rules

- **`size` is required**; there is no internal state—props are applied on each render.
- Default styling omits redundant **`data-*`** attributes: `weight="regular"`, `tracking="normal"`, `tone="default"`, and non-italic omit their corresponding data attributes in the DOM.
- Pass **`id`**, **`aria-*`**, and other HTML attributes through **`...rest`** to the rendered element when you need labels or live regions.
- The root applies **`text-wrap: balance`** for short blocks; override wrapping via **`className`** or layout outside the component if needed.
- There are no disabled, loading, or error variants; pair with parent UI states as needed.

## API

### Typography.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | `"p" \| "span" \| "div"` | `"p"` | No | Host element |
| size | `"2xs" \| "xs" \| "s" \| "m" \| "l" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "5xl" \| "6xl"` | — | Yes | Font size and line-height scale |
| weight | `"regular" \| "medium" \| "semibold"` | `"regular"` | No | Font weight |
| tracking | `"normal" \| "tight" \| "tighter" \| "wide"` | `"normal"` | No | Letter spacing |
| italic | `boolean` | `false` | No | Italic style |
| tone | `"default" \| "muted"` | `"default"` | No | Primary or secondary text color |
| children | `React.ReactNode` | — | No | Content |
| className | `string` | — | No | Additional class on the root |
| ref | `React.Ref<HTMLElement>` | — | No | Ref to the host element |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | No | Other attributes on the host element |

## Related

- [Label](../label/COMPONENT.md)
- [Hint](../hint/COMPONENT.md)
- [LinkButton](../link-button/COMPONENT.md)
- [Banner](../banner/COMPONENT.md)
- [Notification](../notification/COMPONENT.md)

# Banner

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

An in-flow announcement strip: a root grid with a central content column and an optional dismiss control on the right. Use `status` and `variant` for semantic color and density; optional slots cover icon, title, description, and actions.

- **Use** for persistent page- or section-level messages (policy, incident, feature, validation summary) where the user should read the text in context.
- **Use** when you need optional actions (`Banner.Actions`) or dismiss without leaving the page.
- **Use** `size` to align spacing and typography with surrounding controls (`ControlSizeProvider` context applies to `Banner.CloseButton`).
- **Do not use** for transient overlay feedback; prefer [Notification](../notification/COMPONENT.md) or similar patterns.
- **Do not use** as a substitute for [Modal](../modal/COMPONENT.md) or [Drawer](../drawer/COMPONENT.md) when the user must complete a blocking task.
- **Do not use** decorative icons without `aria-hidden` (or an accessible name) when the icon is not redundant with the title.

## Composition

- `Banner.Root` is the outer `div` and size provider; pass `variant`, `status`, `size`, and optionally `onDismiss`.
- Put primary copy inside `Banner.Content`. Typical order: `Banner.Icon` (optional), `Banner.Title`, `Banner.Description` (optional), `Banner.Actions` (optional).
- `Banner.CloseButton` must be a **direct child** of `Banner.Root` (a sibling of `Banner.Content`, not nested inside `Content`). The implementation only scans **direct** children to decide whether to inject a default close button when `onDismiss` is set; a close control placed only inside `Banner.Content` does not suppress injection.
- If `onDismiss` is provided and no direct child is `Banner.CloseButton`, the root appends a default close button that calls `onDismiss`.

### Minimal example

```tsx
import { Banner } from "prime-ui-kit";

export function Example() {
  return (
    <Banner.Root>
      <Banner.Content>
        <Banner.Title>Title</Banner.Title>
      </Banner.Content>
    </Banner.Root>
  );
}
```

## Rules

- There is no `open` / `visible` prop: mount or unmount the root (or hide it with parent state) to show or hide the strip.
- `variant` defaults to `filled`; `status` to `information`; `size` to `m`. `stroke` uses a neutral surface with a status-colored bottom accent bar.
- Decorative icons: pass `aria-hidden` on the underlying SVG/component when the title already conveys the message.
- For a meaningful page-level region, set `role="region"` and `aria-label` or `aria-labelledby` on `Banner.Root` via standard HTML attributes.
- The auto-injected dismiss control uses `aria-label="Dismiss"`; set an explicit `aria-label` (or equivalent) on a custom `Banner.CloseButton` in the product language.
- `Banner.Title` and `Banner.Description` render as `span` elements; keep markup intentional if you nest interactive elements.
- `Banner.Icon` is driven by the `as` prop (not `asChild` on the root).

## API

### Banner.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"filled" \| "light" \| "lighter" \| "stroke"` | `"filled"` | No | Background density and accent treatment (`stroke` adds a status-colored bottom bar). |
| status | `"information" \| "warning" \| "error" \| "success" \| "feature"` | `"information"` | No | Semantic palette for the strip. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Spacing and type scale; feeds `Banner.CloseButton` via control-size context. |
| onDismiss | `() => void` | — | No | When set and no direct `Banner.CloseButton` child exists, renders a default close button that invokes this callback. |
| className | `string` | — | No | Additional class on the root `div`. |
| children | `React.ReactNode` | — | No | Typically `Banner.Content` and optionally `Banner.CloseButton`. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native attributes on the root `div` (e.g. `id`, `role`, ARIA). |

### Banner.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the content column `div`. |
| children | `React.ReactNode` | — | No | Icon, title, description, and/or actions. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native attributes on the inner `div`. |

### Banner.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | `React.ElementType` | `"div"` | No | Element or component to render (often an icon component). |
| className | `string` | — | No | Additional class on the wrapper. |
| children | `React.ReactNode` | — | No | Content when using the default element or a custom wrapper. |
| …rest | props of `T` without `as` and `className` | — | No | Forwarded to the element chosen by `as`. |

### Banner.Title

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the `span`. |
| children | `React.ReactNode` | — | No | Primary heading text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Native `span` attributes. |

### Banner.Description

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the `span`. |
| children | `React.ReactNode` | — | No | Supporting text. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Native `span` attributes. |

### Banner.Actions

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the actions row `div`. |
| children | `React.ReactNode` | — | No | Action controls (e.g. `Button`, `LinkButton`). |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Native attributes on the row `div`. |

### Banner.CloseButton

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Native `button` type. |
| className | `string` | — | No | Additional class on the button. |
| children | `React.ReactNode` | — | No | Button content; defaults to a cross icon when omitted. |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">` | — | No | Other button props; `size` is derived from banner context. |

## Related

- [Button](../button/COMPONENT.md) — actions inside `Banner.Actions`; `Banner.CloseButton` wraps `Button.Root` (ghost neutral).
- [LinkButton](../link-button/COMPONENT.md) — text-style navigation actions in the strip.
- [Typography](../typography/COMPONENT.md) — surrounding captions or body copy outside the banner slots.
- [Notification](../notification/COMPONENT.md) — transient or stacked overlay messages instead of an in-flow strip.

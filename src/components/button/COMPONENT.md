# Button

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Compound control for actions: a root that renders a native `<button>` (or merges props into one child with `asChild`), plus optional icon and loading indicator parts that share size via context.

- **When to use** — primary, secondary, or destructive actions in forms, toolbars, dialogs, and empty states; submit/reset in forms; triggers that must look like a button.
- **When to use** — async actions where you control `loading` and optionally show `Button.Spinner` next to the label.
- **When to use** — full-width actions in narrow layouts via `fullWidth`.
- **When not to use** — navigation that should be a plain link semantically (consider [Link button](../link-button/COMPONENT.md) or `asChild` with a link).
- **When not to use** — binary on/off or multi-option selection (use [Switch](../switch/COMPONENT.md), [Checkbox](../checkbox/COMPONENT.md), [Segmented control](../segmented-control/COMPONENT.md), etc.).
- **When not to use** — grouping several related buttons without shared chrome (see [Button group](../button-group/COMPONENT.md) for layout).

## Composition

- **`Button.Root`** — required wrapper. Provides size to children via `ControlSizeProvider` (including in `asChild` mode). Place all other parts inside it.
- **`Button.Icon`** — optional; wraps the icon in a `span` with `aria-hidden="true"`. Use for decorative icons next to text.
- **`Button.Spinner`** — optional; renders nothing unless the nearest `Button.Root` has `loading={true}`. Place it inside `Button.Root` alongside label text (order is up to you; keep a visible name for assistive tech).

### Minimal example

```tsx
import { Button } from "prime-ui-kit";

export function Example() {
  return <Button.Root>Save</Button.Root>;
}
```

## Rules

- `loading` is controlled only by the `loading` prop on `Button.Root`; there is no internal async state. When `loading` or `disabled` is true, the native button is disabled and clicks do not run.
- With `asChild`, pass exactly one React element child. `type` is not forwarded; `disabled`/`loading` become `aria-disabled`, blocked `onClick`, and styles—native `disabled` is not set on non-button elements.
- The `asChild` child must accept `className`, `aria-*`, `data-*`, and event props merged from the root.
- `Button.Spinner` reads context from the closest `Button.Root`; if `loading` is false, it renders nothing. It uses `aria-hidden="true"`—do not rely on it alone for a progress announcement; keep button text or `aria-label` meaningful while loading.
- For icon-only buttons, set a clear `aria-label` or `aria-labelledby` on `Button.Root`.
- `variant` sets color role (`primary`, `neutral`, `error`); `mode` sets visual weight (`filled`, `stroke`, `lighter`, `ghost`, `fancy`).
- Native `type` defaults to `"button"`; use `"submit"` / `"reset"` explicitly in forms when needed.

## API

### Button.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"primary" \| "neutral" \| "error"` | `"primary"` | No | Color semantics. |
| mode | `"filled" \| "stroke" \| "lighter" \| "ghost" \| "fancy"` | `"filled"` | No | Visual weight / style. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Height, radius, text, and icon scale. |
| fullWidth | `boolean` | — | No | Full-width layout (`data-full-width`). |
| loading | `boolean` | `false` | No | Disables interaction, sets `aria-busy`, exposes loading to `Button.Spinner`. |
| asChild | `boolean` | `false` | No | Merge props into the single child instead of rendering `<button>`. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Native button type; not forwarded when `asChild` is true. |
| disabled | `boolean` | — | No | Inactive state; combined with `loading` for effective disabled behavior. |
| className | `string` | — | No | Additional class on the root. |
| children | `React.ReactNode` | — | No | Label, `Button.Icon`, `Button.Spinner`, etc. |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">` | — | No | Other button attributes (`onClick`, `aria-*`, `data-*`, etc.); `size` is the component size prop, not the HTML attribute. |

### Button.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Icon node. |
| className | `string` | — | No | Additional class on the `span`. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Other `span` attributes; root sets `aria-hidden="true"`. |

### Button.Spinner

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the indicator. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other `span` attributes; not rendered when root `loading` is false. |

## Related

- [Link button](../link-button/COMPONENT.md) — link-styled control when the action is navigation.
- [Button group](../button-group/COMPONENT.md) — grouped actions with shared sizing and dividers.
- [Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md) — common consumers for open/close triggers.
- [Input](../input/COMPONENT.md), [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) — form fields alongside submit/reset buttons.

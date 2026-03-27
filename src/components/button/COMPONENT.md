# Button

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Compound control for actions: a root that renders a native `<button>` (or merges props into one child with `asChild`), plus optional icon and loading indicator parts that share size via context.

- **Use** for primary, secondary, or destructive actions in forms, toolbars, dialogs, and empty states; submit/reset in forms; triggers that must look like a button.
- **Use** for async actions where you set `loading` on `Button.Root` and optionally render `Button.Spinner` next to the label.
- **Use** for full-width actions in narrow layouts via `fullWidth`.
- **Do not use** for navigation that should be a plain link semantically (consider [Link button](../link-button/COMPONENT.md) or `asChild` with a link).
- **Do not use** for binary on/off or multi-option selection (use [Switch](../switch/COMPONENT.md), [Checkbox](../checkbox/COMPONENT.md), [Segmented control](../segmented-control/COMPONENT.md), etc.).
- **Do not use** when several related buttons need shared chrome and spacing (see [Button group](../button-group/COMPONENT.md)).

## Composition

- **`Button.Root`** — required wrapper. Provides size to descendants via `ControlSizeProvider` (including in `asChild` mode). Place all other parts inside it.
- **`Button.Icon`** — optional; wraps the icon in a `span` with `aria-hidden="true"`. Use for decorative icons next to text.
- **`Button.Spinner`** — optional; renders nothing unless the nearest `Button.Root` has `loading={true}`. Place it inside `Button.Root` with visible text or a clear `aria-label`; order relative to the label is up to you.

### Minimal example

```tsx
import { Button } from "prime-ui-kit";

export function Example() {
  return <Button.Root>Save</Button.Root>;
}
```

### Canonical composition (reference)

For **icon + label**, **several `variant` / `mode` pairs**, and **`loading` with `Button.Spinner`**, open **`examples/canonical-composition.tsx`** next to this file. Imports use **`"prime-ui-kit"`** so the same snippets work in an app after installing the package.

The playground Button section (`playground/sections/ButtonSection.tsx`) renders snippets from `playground/snippets/button/*.tsx`. The examples **`sizes-ladder`**, **`icon-composition`**, and **`full-width-stack`** mirror the **Размеры**, **Композиция**, and **Full width** demos there (same structure and labels; app-ready imports).

### Example files in `examples/`

| File | Scenario |
|------|----------|
| `sizes-ladder.tsx` | `size` `s`–`xl` at `variant="primary"` `mode="filled"` (playground: `snippets/button/sizes.tsx`) |
| `icon-composition.tsx` | `Button.Icon` left/right and icon-only with `aria-label`; primary filled + neutral stroke rows (`snippets/button/composition.tsx`) |
| `full-width-stack.tsx` | `fullWidth` primary filled and neutral stroke at `m` (`snippets/button/full-width.tsx`) |
| `canonical-composition.tsx` | Icon + text, variant/mode mix, loading + spinner |
| `form-submit-row.tsx` | English form footer: cancel vs submit, async loading |
| `destructive-confirm.tsx` | English confirm dialog: `error` + `Modal` |
| `toolbar.tsx` | English editor-style toolbar: ghost row + primary action |
| `marketing-cta.tsx` | English CTA column: `fancy` + `xl` / `l` with `fullWidth` (marketing emphasis; see also `full-width-stack.tsx`) |

### Note for LLMs

- **Imports:** `Button` (and `Icon`, `Modal` where needed) from **`"prime-ui-kit"`** in these examples; paths are relative to `src/components/button/examples/`.
- **`loading`** is **controlled** on `Button.Root` only; there is no internal async state. When `loading` or `disabled` is true, the native `<button>` is disabled.
- **`Button.Spinner`** only appears when `loading` is true; keep button text or `aria-label` meaningful while loading (`aria-busy` is set on the root).
- **Forms:** default `type` is **`"button"`**; use **`"submit"`** / **`"reset"`** explicitly when the control lives in a `<form>`.
- **Destructive actions:** use **`variant="error"`**; pair **filled** confirm with **stroke/lighter** or neutral cancel for hierarchy.
- **`asChild`:** exactly one element child; `disabled`/`loading` map to `aria-disabled` and blocked clicks, not native `disabled` on non-button hosts.

## Rules

- `loading` is controlled only by the `loading` prop on `Button.Root`; there is no internal async state. When `loading` or `disabled` is true, the native `<button>` is disabled and `onClick` does not run.
- With `asChild`, pass exactly one React element child. `type` is not forwarded; `disabled`/`loading` become `aria-disabled`, blocked `onClick`, and styles—native `disabled` is not set on non-button elements.
- The `asChild` child must accept `className`, `aria-*`, `data-*`, and event props merged from the root.
- For icon-only buttons, set a clear `aria-label` or `aria-labelledby` on `Button.Root`.
- `variant` sets color role (`primary`, `neutral`, `error`); `mode` sets visual weight (`filled`, `stroke`, `lighter`, `ghost`, `fancy`).

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
- [Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md) — common hosts for triggers and dialog footers.
- [Input](../input/COMPONENT.md), [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) — form fields alongside submit/reset buttons.

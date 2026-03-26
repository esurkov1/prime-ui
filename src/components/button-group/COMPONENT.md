# ButtonGroup

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A row or column of native buttons that share one bordered outline: one size tier for the whole group, internal dividers, and rounded corners only on the outer edges.

- **Use** for toolbars, filters, and view switches where segments should read as one control but keep separate button semantics (`type`, `disabled`, per-item handlers).
- **Use** for compact action pairs such as submit and reset inside a form.
- **Use** when you control which segment looks active with `pressed` and parent state (toggle or single-choice UX).
- **Do not use** when you need a true “one of N” form field with radio semantics and native submission — prefer [Radio](../radio/COMPONENT.md) or native radios.
- **Do not use** when the kit’s segmented switcher API fits better — see [SegmentedControl](../segmented-control/COMPONENT.md).
- **Do not use** for a single standalone call to action — use [Button](../button/COMPONENT.md) instead.

## Composition

- **`ButtonGroup`** is a namespace object: **`Root`**, **`Item`**, **`Icon`**.
- **`ButtonGroup.Root`** — wrapper `div` with `data-size={size}`; for `orientation="vertical"` it sets `data-orientation="vertical"`. It provides group context and **`ControlSizeProvider`**, so nested controls inherit the same size tier.
- Place one or more **`ButtonGroup.Item`** elements inside **`Root`** (they call the group context; using **`Item`** outside **`Root`** throws).
- Optionally put **`ButtonGroup.Icon`** inside an **`Item`** to wrap an SVG: it renders a **`span`** with **`aria-hidden="true"`**.

### Minimal example

```tsx
import { ButtonGroup } from "prime-ui-kit";

export function Example() {
  return (
    <ButtonGroup.Root aria-label="Options" size="m">
      <ButtonGroup.Item type="button">One</ButtonGroup.Item>
      <ButtonGroup.Item type="button">Two</ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
```

## Rules

- There is no `variant` prop: appearance is always the shared-outline segment style; vary **`size`**, **`orientation`**, **`pressed`**, and **`disabled`** instead.
- **`pressed`**: when `true`, the segment gets `data-state="on"` and `aria-pressed="true"`; when `false`, you get `aria-pressed="false"`; when omitted, `aria-pressed` is not set.
- The component does not enforce a single selected segment: for mutually exclusive choice, keep state in the parent and set **`pressed`** (and handlers) accordingly; avoid multiple **`pressed`** items unless that is intentional.
- Give **`Root`** an accessible name with **`aria-label`** or **`aria-labelledby`** when the group is not labeled by visible text.
- For icon-only segments, set **`aria-label`** on **`ButtonGroup.Item`**; do not rely on **`ButtonGroup.Icon`** for a name (it is hidden from assistive tech).
- Segments always render as **`<button>`** (no `asChild`); there is no built-in **`fullWidth`** — widen the group with layout on the root and items if needed.
- **`ButtonGroup.Item`** supports **`type="button" | "submit" | "reset"`** (default **`"button"`**) for correct form behavior.

## API

### ButtonGroup.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| orientation | `"horizontal" \| "vertical"` | `"horizontal"` | no | Layout direction of segments. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Size tier for the group (height, radius, typography, icon scale). |
| children | `React.ReactNode` | — | yes | Usually several `ButtonGroup.Item` nodes. |
| className | `string` | — | no | Additional class on the root element. |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | no | Other div attributes (e.g. `aria-label`, `role`, event handlers). |

### ButtonGroup.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| pressed | `boolean` | — | no | Selected look: `data-state="on"` when `true`; `aria-pressed` mirrors the prop when it is a boolean. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | no | Native button type inside forms. |
| disabled | `boolean` | — | no | Disables the segment. |
| children | `React.ReactNode` | — | no | Label content; optional `ButtonGroup.Icon` for icons. |
| className | `string` | — | no | Additional class on the button. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | no | Other native button attributes. |

### ButtonGroup.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Typically an SVG icon. |
| className | `string` | — | no | Additional class on the wrapper span. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | no | Other span attributes (not `children`). |

## Related

- [Button](../button/COMPONENT.md) — single actions, variants, loading.
- [SegmentedControl](../segmented-control/COMPONENT.md) — alternative segmented switcher API.
- [Radio](../radio/COMPONENT.md) — form “one of N” with radio semantics.

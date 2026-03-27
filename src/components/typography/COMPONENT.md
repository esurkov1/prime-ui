# Typography

**Default choice for page copy:** start from **`body-default`** in `variant` unless the scenario clearly needs another reading role.

## About

Styled text with **semantic reading roles** (`variant`) wired to `typography.role` in tokens, plus optional axes: `weight`, `tracking`, italic, and `tone` for secondary color. Renders as the HTML tag you pick with **`as`**.

**When to use**

- Body copy, headings, captions, and metrics where you want kit tokens instead of ad-hoc `font-size`.
- `tone="muted"` for secondary explanations, hints, and legal lines.
- Nested **`Typography.Root`** nodes with different `as` / `weight` inside one block (see `./examples/composition.tsx`, `./examples/05-inline-emphasis.tsx`).
- `as="h1"`–`as="h6"` for heading levels that match the theme; keep a sensible outline order on the page.
- `as` values that are landmarks (`main`, `article`, `section`, `header`, `footer`, …) when you need both semantics and typography on the same node — otherwise wrap landmarks in normal elements and put **`Typography.Root`** inside.

**When not to use**

- As a substitute for **button** or **link** chrome — use [Button](../button/COMPONENT.md) / [LinkButton](../link-button/COMPONENT.md).
- Expecting a separate `line-height` control per instance — line height is part of the role in CSS.
- Interactive controls (fields, switches, etc.) still use their own components and sizes; **Typography** does not restyle them.

## Reference mapping: MD3, Apple (SF), Polaris

Rough **hierarchy** alignment only — not pixel-perfect parity. Font size column assumes **`1rem = 16px`** on `:root` (rounded).

| `variant` | Token step | ≈ px @16 | Close MD3 | Close Apple (SF) | Polaris `Text` |
| --------- | ---------- | -------- | --------- | ---------------- | -------------- |
| `display` | `9xl` | 57 | Display Large | Large Title | `heading3xl` |
| `headline` | `6xl` | 32 | Headline Large | Title 1 | `heading2xl` |
| `heading-page` | `4xl` | 28 | Headline Medium | Title 2 | `headingXl` |
| `heading-section` | `2xl` | 24 | Headline Small | Title 3 | `headingLg` |
| `heading-subsection` | `xl` | 22 | Title Large | Headline | `headingMd` |
| `heading-group` | `xs` | 14 | Title Small | Subheadline / Footnote | `headingSm`, `headingXs` |
| `body-large` | `s` | 16 | Body Large | Body / Callout | `bodyLg` |
| `body-default` | `xs` | 14 | Body Medium | Subheadline | `bodyMd` |
| `body-small` | `2xs` | 12 | Body Small | Footnote | `bodySm` |
| `body-compact` | `xs` size, tighter line | 14 | Label Large (dense) | — | `bodyXs` |
| `caption` | `2xs` | 12 | Label Medium | Caption 1 | `bodySm` (with `tone`) |
| `caption-micro` | `labelMicro` | 11 | Label Small | Caption 2 | smallest semantic step |

Steps **`7xl`** / **`8xl`** exist in the scale but are **not** wired to `typography.role` — use tokens directly if you need them, not **`Typography`**.

## Composition

- Single primitive: **`Typography.Root`**. Put text or inline markup in **`children`**.
- **`as`** defaults to **`p`**; allowed: paragraph, inline, block, **`h1`–`h6`**, **`small`**, **`blockquote`**, landmarks (`article`, `section`, `header`, `footer`, `aside`, `nav`, `main`).

### Canonical example

```tsx
import { Typography } from "prime-ui-kit";

export function Example() {
  return (
    <>
      <Typography.Root as="h1" variant="heading-page">
        Release notes
      </Typography.Root>
      <Typography.Root as="p" variant="body-default" tone="muted">
        Summary of changes for the current shipping cycle.
      </Typography.Root>
      <Typography.Root as="p" variant="body-default">
        Copy uses reading roles; controls use their own size scale — keep both axes explicit in layouts.
      </Typography.Root>
    </>
  );
}
```

### Playground-aligned examples

Order matches **`playground/sections/TypographySection.tsx`** and the runnable snippets in **`playground/snippets/typography/`**; the same scenarios ship under **`./examples/`** for `prime-ui-kit` consumers (import from **`prime-ui-kit`**).

| Playground snippet | Package example |
| --- | --- |
| [`variant-catalog.tsx`](../../../playground/snippets/typography/variant-catalog.tsx) | [`./examples/variant-catalog.tsx`](./examples/variant-catalog.tsx) |
| [`article-landmarks.tsx`](../../../playground/snippets/typography/article-landmarks.tsx) | [`./examples/01-article.tsx`](./examples/01-article.tsx) (same structure; English copy) |
| [`reading-and-form.tsx`](../../../playground/snippets/typography/reading-and-form.tsx) | [`./examples/reading-and-form.tsx`](./examples/reading-and-form.tsx) |
| [`variants.tsx`](../../../playground/snippets/typography/variants.tsx) | [`./examples/variants.tsx`](./examples/variants.tsx) |
| [`states.tsx`](../../../playground/snippets/typography/states.tsx) | [`./examples/states.tsx`](./examples/states.tsx) |
| [`composition.tsx`](../../../playground/snippets/typography/composition.tsx) | [`./examples/composition.tsx`](./examples/composition.tsx) |
| [`full-width.tsx`](../../../playground/snippets/typography/full-width.tsx) | [`./examples/full-width.tsx`](./examples/full-width.tsx) |
| [`as-prop.tsx`](../../../playground/snippets/typography/as-prop.tsx) | [`./examples/as-prop.tsx`](./examples/as-prop.tsx) |

### Additional examples

- [`./examples/02-form-labels-contrast.tsx`](./examples/02-form-labels-contrast.tsx) — **`Input`** label / optional / hint slots built with **`Typography.Root`** (richer than the playground form frame).
- [`./examples/03-marketing-hero.tsx`](./examples/03-marketing-hero.tsx) — Hero stack: caption, display, headline, muted body.
- [`./examples/04-reading-scale.tsx`](./examples/04-reading-scale.tsx) — Compact English ladder of every **`variant`** (no **`Divider`** captions; use **`variant-catalog`** for the full labeled catalog).
- [`./examples/05-inline-emphasis.tsx`](./examples/05-inline-emphasis.tsx) — Nested spans on **`body-default`** (English; playground **`composition`** adds a link and `as="div"` wrapper).

**LLM note:** Use **`./examples/*.tsx`** for copy-paste scenarios; **`playground/snippets/typography/*.tsx`** stay the source shown in the dev playground (`?raw`). This page keeps the contract (rules + API tables) authoritative.

## Rules

- **`variant` is required**; default-looking props omit extra **`data-*`** (`weight="regular"`, `tracking="normal"`, `tone="default"`, no italic).
- DOM: **`data-variant`** uses kebab-case (e.g. `heading-page`).
- Standard HTML attributes (`id`, `aria-*`, …) pass through **`...rest`**.
- Root uses **`text-wrap: balance`** on short blocks; override from a parent if needed.
- No built-in disabled / loading / error states — combine with surrounding UI.

## API

### Typography.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | see `TypographyAs` | `"p"` | No | HTML element |
| variant | see `TypographyVariant` | — | Yes | Reading role |
| weight | `"regular"` \| `"medium"` \| `"semibold"` | `"regular"` | No | Font weight |
| tracking | `"normal"` \| `"tight"` \| `"tighter"` \| `"wide"` | `"normal"` | No | Letter spacing |
| italic | `boolean` | `false` | No | Italic |
| tone | `"default"` \| `"muted"` | `"default"` | No | Primary vs secondary text color |
| children | `React.ReactNode` | — | No | Content |
| className | `string` | — | No | Extra class |
| ref | `React.Ref<HTMLElement>` | — | No | Element ref |
| …rest | `React.HTMLAttributes<HTMLElement>` | — | No | Other element props |

## Related

- [Label](../label/COMPONENT.md)
- [Hint](../hint/COMPONENT.md)
- [Input](../input/COMPONENT.md)
- [LinkButton](../link-button/COMPONENT.md)
- [Banner](../banner/COMPONENT.md)
- [Notification](../notification/COMPONENT.md)

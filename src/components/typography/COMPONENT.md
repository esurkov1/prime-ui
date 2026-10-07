# Typography

**Category:** foundations (Основа)

> Text roles of the Golos Text type scale applied to any text element, with reading-width guidance.

## When to use
- Page titles, section headings, card titles, body text, captions and inline code outside of components that style their own text.
- Long-form reading content (articles, help pages) with semantic tags via `as`.
- Emphasis inside running text: nested `as="span"` with another `weight`, `tracking` or `tone`.
- Single-line names in fixed-width places (`truncate` + `title`).

## When not to use
- Field labels, hints and errors → use the field's own `label` / `hint` / `error` or [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md).
- Links → use [LinkButton](../link-button/COMPONENT.md).
- Multi-line code → use [CodeBlock](../code-block/COMPONENT.md); keyboard keys → [Kbd](../kbd/COMPONENT.md).
- Status labels → use [Badge](../badge/COMPONENT.md).
- Text inside controls (Button, Tabs, Badge …) — they set their own type. Inside Button a nested Typography inherits the button's size, weight and color.

## Import
```tsx
import { Typography } from "prime-ui-kit";
```

## API

### Typography.Root
`forwardRef` → `HTMLElement` (the element chosen by `as`). + native HTML attributes (`HTMLAttributes<HTMLElement>`: `id`, `title`, `aria-*` …).

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `TypographyRole` (see Variants) | — (required) | Text role: size, line height, weight, tracking from `--prime-text-<role>-*`. |
| `as` | `"p" \| "span" \| "div" \| "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "small" \| "blockquote" \| "article" \| "section" \| "header" \| "footer" \| "aside" \| "nav" \| "main"` | `"p"` | Rendered element. |
| `weight` | `"regular" \| "medium" \| "semibold"` | role weight | Overrides the role's weight. |
| `tracking` | `"normal" \| "tight" \| "tighter" \| "wide"` | role tracking | Overrides the role's letter spacing. |
| `tone` | `"default" \| "secondary" \| "muted" \| "accent" \| "success" \| "warning" \| "danger"` | `"default"` | Text color. |
| `truncate` | `boolean` | `false` | One line with an ellipsis; set `title` when the full text matters. |
| `italic` | `boolean` | `false` | Italic style. |
| `children` | `ReactNode` | — | Text or nested markup. |
| `className` | `string` | — | Extra class. |

## Variants

### variant (role)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `display-l` | 60/68, 600, −0.03em | hero headline | |
| `display-m` | 48/56, 600, −0.03em | large metric | |
| `display-s` | 36/44, 600, −0.02em | metric, promo | |
| `heading-l` | 30/36, 600, −0.02em | large page title | |
| `heading-m` | 24/32, 600, −0.02em | page title | |
| `heading-s` | 20/28, 600, −0.01em | page sub-heading | |
| `title-l` | 18/24, 600, −0.01em | large block title | |
| `title-m` | 16/24, 600, −0.01em | modal and section title | |
| `title-s` | 14/20, 600 | card and group title | |
| `body-l` | 16/24, 400 | reading text | |
| `body-m` | 14/20, 400 | default UI text | |
| `body-s` | 13/20, 400 | secondary text, dense UI | |
| `caption` | 12/16, 400, +0.01em | hints, meta, table head | |
| `code` | 13/20, mono (JetBrains Mono), 400 | inline code, IDs | |

Titles, headings and display roles use `text-wrap: balance`; body and caption use `text-wrap: pretty`. Weights are only 400 / 500 / 600.

### weight
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `regular` | 400 | plain text in a title role | role |
| `medium` | 500 | emphasis in body text, values | role |
| `semibold` | 600 | strong emphasis in body text | role |

### tracking
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `normal` | 0 | reset a role's tracking | role |
| `tight` | −0.01em | numbers, compact titles | role |
| `tighter` | −0.02em | large text set in a smaller role | role |
| `wide` | +0.01em | small uppercase-like labels | role |

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | primary text | main text | yes |
| `secondary` | secondary text | descriptions, intros | |
| `muted` | muted text | meta, captions | |
| `accent` | accent text | highlighted value | |
| `success` | success text | positive result | |
| `warning` | warning text | warning message | |
| `danger` | danger text | error, destructive context | |

### Visual flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `italic` | italic style | quotes, titles of works | off |
| `truncate` | single line, overflow hidden, ellipsis, `min-width: 0` | names in table cells, cards, list rows | off |

**Combinations**
- Recommended: `heading-m` page title + `body-m tone="secondary"` intro; `title-s` card title + `body-s tone="muted"` meta; nested `as="span" weight="medium"` for values in text.
- Avoid: `weight` overrides that turn body text into a fake heading (use a title role); `tone="danger"` for non-error text; `truncate` on long reading text.

**Hierarchy:** one `heading-m` (or `heading-l`) per page; sections `heading-s` or `title-m`; cards `title-s`; everything else `body-*` and `caption`.

## States
Text has no interactive states. DOM attributes: `data-variant`, `data-weight` and `data-tracking` (only when set), `data-tone` (only when not `default`), `data-italic="true"`, `data-truncate="true"`.

## Layout & spacing
- The root has `margin: 0`; space text with `gap` on the parent: heading → intro `var(--prime-space-2)`–`var(--prime-space-3)`, paragraph → paragraph `var(--prime-space-4)`, section → section `var(--prime-space-10)`–`var(--prime-space-12)`.
- Reading text: cap the column at `--prime-layout-reading-max-width` (≈ 65ch).
- Text takes the parent width; long words break (`overflow-wrap: break-word`).
- Numbers in tables and counters: add `font-variant-numeric: tabular-nums` on the host.

## Accessibility
- Pick `as` by meaning, `variant` by look: a page title is `as="h1"`, even if it uses `heading-m`. Do not skip heading levels.
- Landmarks (`article`, `section`, `nav`, `main`…) via `as`; label sections with `aria-labelledby`.
- Use only one `as="main"` per page.
- `truncate` hides text visually — add `title` (or a Tooltip) when the full text matters.
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [variant-catalog.tsx](examples/variant-catalog.tsx) | Every role with its size and purpose | choosing a role |
| [article.tsx](examples/article.tsx) | Landmarks, `h1`–`h2`, blockquote | long-form reading content |
| [reading-and-form.tsx](examples/reading-and-form.tsx) | Page heading + intro above an Input/Button form | form pages |
| [variants.tsx](examples/variants.tsx) | `weight`, `tracking`, `tone="secondary"` on `body-m` | overriding a role |
| [tones.tsx](examples/tones.tsx) | Every `tone` | text color by meaning |
| [truncate.tsx](examples/truncate.tsx) | One-line name with `title` | fixed-width cells and cards |
| [states.tsx](examples/states.tsx) | `italic` on the same role and weight | quotes, titles of works |
| [composition.tsx](examples/composition.tsx) | Nested spans and a link in one paragraph | emphasis in running text |
| [full-width.tsx](examples/full-width.tsx) | Same text in narrow and wide columns | multi-column layouts |
| [as-prop.tsx](examples/as-prop.tsx) | `as="p"`, `"div"`, inline `"span"` | choosing the element |

```tsx
import { Typography } from "prime-ui-kit";

export function PageTitle() {
  return (
    <Typography.Root as="h1" variant="heading-m">
      Заказы
    </Typography.Root>
  );
}
```

## Mistakes
- `<Typography.Root variant="h1">` → `variant="heading-m"` (or another role) plus `as="h1"`.
- Missing `variant` → it is required.
- `tone="error"` → `tone="danger"`; `color="gray"` → `tone="muted"`.
- `truncate` on `as="span"` inside a flex row that does not shrink → use a block element (`p`/`div`) and give flex parents `min-width: 0`.
- Raw `font-size` in `className` → pick a role.

## Related
- [LinkButton](../link-button/COMPONENT.md)
- [CodeBlock](../code-block/COMPONENT.md)
- [Label](../label/COMPONENT.md)
- [PageContent](../page-content/COMPONENT.md)

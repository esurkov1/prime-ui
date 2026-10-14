# Typography

**Category:** foundations
**Kind:** primitive

> Text roles of the Golos Text type scale applied to any text element, with reading-width guidance.

## When to use
- Page titles, section headings, card titles, body text, captions and inline code outside of components that style their own text.
- Long-form reading content (articles, help pages) with semantic tags via `as`.
- Emphasis inside running text: nested `as="span"` with another `weight`, `tracking` or `tone`.
- Single-line names in fixed-width places (`truncate` + `title`).

## When not to use
- Field labels, hints and errors → the field's own `label` / `hint` / `error`, or [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md).
- Links → use [LinkButton](../link-button/COMPONENT.md).
- Multi-line code → use [CodeBlock](../code-block/COMPONENT.md); keyboard keys → [Kbd](../kbd/COMPONENT.md).
- Status labels → use [Badge](../badge/COMPONENT.md).
- Text inside controls (Button, Tabs, Badge…) — they set their own type.

## Import
```tsx
import { Typography } from "prime-ui-kit";
```

## Anatomy
```
Typography       the element from `as` (default <p>); variant, tone, weight, tracking, italic, truncate
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Typography
`ref` → the element. Any text element styled by one text role (`--prime-text-<role>-*`); state goes to `data-*`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"caption" \| "body-s" \| "body-m" \| "body-l" \| "title-s" \| "title-m" \| "title-l" \| "heading-s" \| "heading-m" \| "heading-l" \| "display-s" \| "display-m" \| "display-l" \| "code"` | — (required) | Text role: size, line height, weight and tracking. |
| `tone` | `"default" \| "secondary" \| "muted" \| "accent" \| "success" \| "warning" \| "danger"` | `"default"` | Text color by meaning; `default` is primary text. |
| `as` | `"p" \| "span" \| "div" \| "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "small" \| "blockquote" \| "article" \| "section" \| "header" \| "footer" \| "aside" \| "nav" \| "main"` | `"p"` | The element, by the page outline; the role keeps the look. |
| `weight` | `"regular" \| "medium" \| "semibold"` | — | Overrides the role's weight. |
| `tracking` | `"normal" \| "tight" \| "tighter" \| "wide"` | — | Overrides the role's tracking with a `--prime-font-tracking-*` step. |
| `numeric` | `"proportional" \| "tabular"` | `"proportional"` | `tabular` — every digit as wide as the others: amounts, times and counts line up in a column and keep their width. |
| `italic` | `boolean` | `false` | Italic, for quotes and titles of works. |
| `truncate` | `boolean` | `false` | One line with an ellipsis; set `title` when the full text matters. |
| `children` | `ReactNode` | — | The text. |
| `className` | `string` | — | Class on the element. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `id`, `title` and the other attributes of the element. |

## Variants

### variant (text role)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `display-l` · `display-m` · `display-s` | 60/68 · 48/56 · 36/44, 600 | hero numbers, promo | |
| `heading-l` · `heading-m` · `heading-s` | 30/36 · 24/32 · 20/28, 600 | page titles and subtitles | |
| `title-l` · `title-m` · `title-s` | 18/24 · 16/24 · 14/20, 600 | block, dialog and card titles | |
| `body-l` · `body-m` · `body-s` | 16/24 · 14/20 · 13/20, 400 | reading text, interface text, dense secondary text | |
| `caption` | 12/16, 400 | hints, meta, table heads | |
| `code` | 13/20, mono | identifiers, inline code | |

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | primary text | most text | yes |
| `secondary` · `muted` | the two quieter steps | descriptions, meta | |
| `accent` · `success` · `warning` · `danger` | semantic `*-text` colors | a value with a meaning (with a word, not color alone) | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `italic` | italic | quotes, titles of works | `false` |
| `truncate` | one line with an ellipsis | names in fixed-width cells | `false` |

### numeric
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `proportional` | the font's own figures | running text | yes |
| `tabular` | every digit as wide as the others | amounts, times and counts in a column, a number that changes in place | |

`weight` (`regular` · `medium` · `semibold`) and `tracking` (`normal` 0 · `tight` −0.01em · `tighter` −0.02em · `wide` +0.01em, from `--prime-font-tracking-*`) override the role.

## States
| State | Driven by | DOM |
|---|---|---|
| role / overrides | `variant`, `weight`, `tracking`, `tone` | `data-variant`, `data-weight`, `data-tracking`, `data-tone` (not for `default`) |
| italic / truncate | flags | `data-italic`, `data-truncate` |

Text has no interactive states.

## Layout & spacing
- No outer margins: spacing comes from the parent's `gap`.
- Title, heading and display roles balance their lines (`text-wrap-style: balance`); body and caption avoid a lone last word (`pretty`). Long words break (`overflow-wrap: break-word`).
- `code` uses the mono family (JetBrains Mono); every other role the sans family (Golos Text).
- Reading text: cap the column at the reading measure (PageContent `maxWidth="readable"`, 60–75 characters).
- `truncate` needs a block element and a shrinking parent (`min-width: 0` in flex rows).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The heading level comes from `as` by the page outline, the look from `variant`: never skip levels for size.
- `tone` never carries meaning alone — name the status in words.
- With `truncate` pass the full text in `title` when it matters.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A block heading, its text and a meta line, each set by a text role and a semantic tag — `variant`, `as`, `tone`. |
| [variants.tsx](examples/variants.tsx) | Every text role from display to caption and code, then every text color on body text — `variant`, `tone`. |
| [weights.tsx](examples/weights.tsx) | One role with its weight, tracking or italic overridden — `weight`, `tracking`, `italic`. |
| [inline-emphasis.tsx](examples/inline-emphasis.tsx) | Values emphasized inside running text by nested spans with another weight — `as`, `weight`. |
| [semantic-tag.tsx](examples/semantic-tag.tsx) | The tag follows the page outline and the role sets the look, so a section title can be an `h2` at title size — `as`. |
| [truncate.tsx](examples/truncate.tsx) | A long product name clamped to one line with an ellipsis; the full text stays in the tooltip — `truncate`, `title`. |
| [numeric.tsx](examples/numeric.tsx) | Invoice amounts in a column line up digit under digit with tabular figures — `numeric`. |
| [article.tsx](examples/article.tsx) | A help article from landmarks, headings and a quote at the reading width — `as`, `variant`. |

## Mistakes
- `variant="h1"` → `variant="heading-m"` (or another role) plus `as="h1"`.
- `font-variant-numeric: tabular-nums` in your own class around a number → `numeric="tabular"`.
- Missing `variant` → it is required.
- `tone="error"` → `tone="danger"`; `color="gray"` → `tone="muted"`.
- `truncate` on an inline span in a flex row that does not shrink → use a block element and `min-width: 0`.
- Raw `font-size` in `className` → pick a role.

## Related
- **Built from:** —
- **See also:** [LinkButton](../link-button/COMPONENT.md), [CodeBlock](../code-block/COMPONENT.md), [Label](../label/COMPONENT.md), [PageContent](../page-content/COMPONENT.md)

# Divider

**Category:** layout (Раскладка)

> A hairline separator, horizontal or vertical, with or without a label.

## When to use
- Separate rows of a list or groups inside one panel, menu or card.
- An «или» between two alternative actions (sign in / get a link by email).
- A section heading drawn on a line (`align="start"`).
- A vertical break between groups of buttons in a toolbar row.

## When not to use
- To separate cards or panels from each other → use fill and spacing ([Card](../card/COMPONENT.md), [PageContent](../page-content/COMPONENT.md) sections), never a line.
- Separators inside a dropdown menu → use `Dropdown.Separator` ([Dropdown](../dropdown/COMPONENT.md)).
- Row lines of a table → [DataTable](../data-table/COMPONENT.md) draws them itself.
- Collapsible sections → use [Accordion](../accordion/COMPONENT.md).

## Import
```tsx
import { Divider } from "prime-ui-kit";
```

## API

### Divider.Root
`forwardRef` to `<div>`. No `asChild`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Full-width line in a column, or a vertical line that stretches to the height of a flex row. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Position of the label on the line. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the surrounding content: label type, gap and icon size. |
| `children` | `ReactNode` | — | Label (text, or icon + text). Without children the divider is a plain line. An `Icon` inside is sized by the divider, not by its own `size`. |
| `role` | `string` | `"separator"` | Use `"presentation"` for decorative lines between rows of an already structured list. |
| `className` | `string` | — | Extra class on the root. |

+ native `<div>` props (`HTMLAttributes<HTMLDivElement>`).

## Variants

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `horizontal` | 1px `border-subtle` line across the full row width | Between rows or groups stacked in a column | yes |
| `vertical` | 1px line stretched to the row height (`align-self: stretch`) | Between groups of buttons in a toolbar | |

### align (only with children)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | Label flush with the start edge, line fills the rest | Section heading on a line («Безопасность») | |
| `center` | Line – label – line | «или» between alternatives | yes |
| `end` | Line fills the start, label flush with the end edge | Trailing meta label (rare) | |

### Content
| Value | Looks like | Use when | Default |
|---|---|---|---|
| no children | One plain line, no gap | List rows, groups | yes |
| text / icon + text | Muted medium-weight label between line segments, tier gap | Headings, «или» | |

**Combinations**
- Recommended: plain horizontal line in a `gap` column; `align="start"` + icon + text as a section heading; `align="center"` + «или».
- Pointless: `orientation="vertical"` with a long label; `align` without children (has no effect).

**Sizes** — label / gap / icon per tier: xs 12/16 · 4 · 14, s 12/16 · 8 · 16, **m 13/20 · 8 · 16**, l 14/20 · 8 · 20, xl 16/24 · 12 · 20. Match the tier of the controls or text around it.

**Hierarchy** — lines are the only separators in the system and stay `border-subtle`; do not stack several labelled dividers in a row, use one heading per group.

## States
Static component. DOM: `data-orientation`, `data-align`, `data-size` on the root; `aria-orientation="vertical"` only for vertical dividers.

## Layout & spacing
- Has no margins: the spacing around a line comes from the parent `gap` (e.g. `--prime-space-3` in a list column, `--prime-space-2` in a toolbar).
- A horizontal divider takes `width: 100%` of a flex column; a vertical one needs a flex row parent to get height.
- A long label wraps (`overflow-wrap: anywhere`).

## Accessibility
- `role="separator"` by default; vertical dividers add `aria-orientation="vertical"`.
- Use `role="presentation"` when the line is purely decorative inside a structured list.
- No keyboard interaction, no `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [variants.tsx](examples/variants.tsx) | Plain line, `align` start · center · end, line in a gap column, vertical in a toolbar | Picking the right shape |
| [sizes.tsx](examples/sizes.tsx) | `size` xs → xl with a start label | Matching the label to the content tier |
| [composition.tsx](examples/composition.tsx) | «или» between buttons, heading with icon, presentation lines in a settings list | Separators inside one surface |

```tsx
import { Divider } from "prime-ui-kit";

export function Example() {
  return <Divider.Root>или</Divider.Root>;
}
```

## Mistakes
- Margins on the divider → spacing via the parent `gap`.
- Lines between cards → separate cards by fill and spacing.
- `<Icon size="l" />` inside the label → leave the size to the divider.
- Vertical divider in a block container (no height) → place it in a flex row.

## Related
[Dropdown](../dropdown/COMPONENT.md) · [Card](../card/COMPONENT.md) · [PageContent](../page-content/COMPONENT.md)

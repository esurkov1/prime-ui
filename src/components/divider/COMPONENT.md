# Divider

**Category:** page
**Kind:** primitive

> A hairline separator inside one surface, horizontal or vertical, with or without a label.

## When to use
- Separate rows of a list or groups inside one panel, menu or card.
- An «или» between two alternative actions (sign in / get a link by email).
- A section heading drawn on a line (`align="start"`).
- A vertical break between groups of buttons in a toolbar row.

## When not to use
- To separate cards or panels from each other → use fill and spacing ([Card](../card/COMPONENT.md), [PageContent](../page-content/COMPONENT.md) sections), never a line.
- Separators inside a dropdown menu → `Dropdown.Separator` ([Dropdown](../dropdown/COMPONENT.md)).
- Row lines of a table → [DataTable](../data-table/COMPONENT.md) draws them itself.

## Import
```tsx
import { Divider } from "prime-ui-kit";
```

## Anatomy
```
Divider          <div role="separator">; the line is drawn by ::before / ::after
└─ label         children (text, Icon) between the two line halves
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Divider
`ref` → `HTMLDivElement`. A `role="separator"` hairline in `border-subtle`; children become its label.

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | `vertical` stretches to the height of its flex row and sets `aria-orientation`. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Position of the label on the line; `start` reads as a section heading. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the label: type, gap and icon size. Match the content around the divider. |
| `children` | `ReactNode` | — | Label: text, an `Icon`, or both. Omit for a plain line. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `role` (`"presentation"` for a purely visual line), `aria-label` and the other div attributes. |

## Variants
No `variant`, `tone` or `color`: one hairline in `border-subtle`, label in `text-muted`, weight 500.

### align
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | label flush left, line to the right | a section heading on a line | |
| `center` | line — label — line | «или», a date in a feed | yes |
| `end` | line to the left, label flush right | an end marker | |

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `horizontal` | full-width line | between rows and blocks | yes |
| `vertical` | line as tall as its flex row | between toolbar groups | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` · `s` | label 12/16, caption tracking | dense menus, `s` content | |
| `m` | label 13/20, icon 16 | regular content | yes |
| `l` · `xl` | label 14/20 · 16/24, icon 20 | large panels | |

## States
| State | Driven by | DOM |
|---|---|---|
| plain line | no children | `:empty`, one line |
| labelled | children | two line halves, each at least `--prime-space-6` long |
| orientation / align / size | props | `data-orientation`, `data-align`, `data-size`, `aria-orientation` when vertical |

## Layout & spacing
- No margins: the parent's `gap` sets the rhythm around the line.
- Horizontal: `width: 100%` in its flex column. Vertical: `align-self: stretch` in a flex row.
- Label gap and icon size follow the tier (`--prime-control-<size>-gap`, `-icon`).

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- `role="separator"`; vertical sets `aria-orientation="vertical"`.
- A purely visual line between rows that are separate anyway → `role="presentation"`.
- The label is read as the separator's text; an icon-only divider needs `aria-label`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Hairlines between the rows of a settings list. |
| [sizes.tsx](examples/sizes.tsx) | The label at every tier, matching the content around it — `size`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before the label and an icon alone on the line; the divider sizes it. |
| [align.tsx](examples/align.tsx) | The label at the start, the center or the end of the line; `start` heads a section — `align`. |
| [vertical.tsx](examples/vertical.tsx) | A vertical line between groups of toolbar buttons — `orientation`. |
| [or-separator.tsx](examples/or-separator.tsx) | An "or" line between two ways to sign in. |

## Mistakes
- Margins on the divider → spacing via the parent `gap`.
- Lines between cards → separate cards by fill and spacing.
- `<Icon size="l" />` inside the label → leave the size to the divider.
- A vertical divider in a block container (no height) → place it in a flex row.

## Related
- **Built from:** —
- **See also:** [Dropdown](../dropdown/COMPONENT.md), [Card](../card/COMPONENT.md), [PageContent](../page-content/COMPONENT.md)

# Divider

**Category:** page
**Kind:** primitive

> A hairline separator inside one surface, horizontal or vertical, with or without a label.

## When to use
- Separate rows of a list or groups inside one panel, menu or card.
- An «или» between two alternative actions (sign in / get a link by email).
- A section heading drawn on a line (`align="start"`).
- A vertical break between groups of buttons in a toolbar row; `inset` makes it one text line tall (a header).

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
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the label: type, gap and icon size. Without it the tier of the content around (a menu, a panel with a size), else `m`. |
| `inset` | `boolean` | `false` | The line stands off its neighbours by the tier gap; a vertical one is one text line tall, centred in its row (a header, a toolbar). |
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

Without `size` the divider takes the tier of the content around it (a menu, a panel with a size), else `m`. The label type is a text role: caption for xs and s, body-s for m, body-m for l, body-l for xl.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `inset` | the tier gap on both sides of the line; vertical: one text line tall, centred in the row | a break between groups in a header or a toolbar | off |

## States
| State | Driven by | DOM |
|---|---|---|
| plain line | no children | `:empty`, one line |
| labelled | children that draw something (`false`, `null` and `""` do not) | two line halves, each at least `--prime-space-6` long; the separator is named by its label (`aria-labelledby`) |
| orientation / align / size / inset | props | `data-orientation`, `data-align`, `data-size`, `data-inset`, `aria-orientation` when vertical |

## Layout & spacing
- No margins: the parent's `gap` sets the rhythm around the line (`inset` adds the tier gap).
- Horizontal: `width: 100%` in its flex column. Vertical: `align-self: stretch` in a flex row.
- Label gap and icon size follow the tier (the shared tier table, `internal/fieldTier`).
- Bleed: a host whose padding the line should cross (a menu panel) sets `--divider-bleed` to that padding; the line reaches past it on both sides, inline for a horizontal line, block for a vertical one.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `role="separator"`; vertical sets `aria-orientation="vertical"`.
- A purely visual line between rows that are separate anyway → `role="presentation"`.
- A labelled separator is named by its label (`aria-labelledby`); an icon-only divider needs `aria-label`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Hairlines between the rows of a settings card — `Divider`. |
| [sizes.tsx](examples/sizes.tsx) | The label at every tier, matching the content around it — `size`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before the label and an icon alone on the line named by `aria-label`; the divider sizes the icon — `Icon`, `aria-label`. |
| [align.tsx](examples/align.tsx) | The label at the start, the center or the end of the line; `start` heads a section — `align`. |
| [vertical.tsx](examples/vertical.tsx) | Vertical lines between groups of toolbar buttons: one as tall as the row, one inset to a text line — `orientation`, `inset`. |
| [or-separator.tsx](examples/or-separator.tsx) | An "or" line between two ways to sign in, its label naming the separator — `Divider`. |

## Mistakes
- Margins on the divider → spacing via the parent `gap`.
- Lines between cards → separate cards by fill and spacing.
- `<Icon size="l" />` inside the label → leave the size to the divider.
- A vertical divider in a block container (no height) → place it in a flex row.
- A host class that shortens a vertical divider or pulls it across padding → `inset`, or `--divider-bleed`.

## Related
- **Built from:** `internal/fieldClasses` (the tier table), `internal/textRole` (the label type), `internal/hasContent`
- **See also:** [Dropdown](../dropdown/COMPONENT.md) (`Dropdown.Separator`), [Select](../select/COMPONENT.md) (`Select.Separator`), [Accordion](../accordion/COMPONENT.md), [Card](../card/COMPONENT.md), [PageContent](../page-content/COMPONENT.md)

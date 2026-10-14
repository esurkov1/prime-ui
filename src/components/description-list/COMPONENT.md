# DescriptionList

**Category:** data-display
**Kind:** composite

> Read-only properties of a record: «label — value» pairs on a `<dl>` that stack by themselves where the room is narrow, with a muted dash for an empty value.

## When to use
- The details of a record in a card, a drawer or a page section: requisites, contacts, deal terms.
- A summary before a confirm («Сумма», «Получатель», «Срок»).
- Properties next to a value-specific action: copy an ИНН, call a number, write an email (`DescriptionList.ItemAction`).

## When not to use
- Values the user edits → fields ([Input](../input/COMPONENT.md), [Select](../select/COMPONENT.md)) in a form.
- Many records with the same properties → [DataTable](../data-table/COMPONENT.md).
- One headline number → [Card](../card/COMPONENT.md) `mini` / `stat-trend`.
- A history of events → [Timeline](../timeline/COMPONENT.md).

## Import
```tsx
import { DescriptionList } from "prime-ui-kit";
```

## Anatomy
```
DescriptionList.Root                 <dl>; size (host tier), orientation; a size container
└─ DescriptionList.Item              <div> per pair; label
   ├─ <dt>                           the label
   └─ <dd>                           the value (or labels.empty) · DescriptionList.ItemAction?
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### DescriptionList.Root
`ref` → `HTMLDListElement`. A `<dl>` of «label — value» pairs and a size container: horizontal pairs stack once the list is narrower than 24rem. Gives its tier to the controls inside.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `host tier, else `"m"`` | Label and value type and the gap between pairs; without it the list takes the tier of its host (a Card, a Drawer, a form). |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | `horizontal` — the label in a column beside its value (one third of the width), stacking below 24rem of the list's own width; `vertical` — the label above its value at any width. |
| `labels` | `Partial<DescriptionListLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDListElement>` | — | `className`, `id`, `data-*` and the other attributes of the element. |

### DescriptionList.Item
`ref` → `HTMLDivElement`. One pair: a `<div>` holding the `<dt>` and the `<dd>`. The value wraps anywhere; no value (`null`, `""`, `false`) shows a muted `labels.empty` and speaks `labels.emptyText`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | The visible name of the value (`<dt>`). |
| `children` | `ReactNode` | — | The value (`<dd>`): text, a Badge, a link; plus an optional `DescriptionList.ItemAction`, which goes to the end of the value. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `id`, `data-*` and the other attributes of the element. |

### DescriptionList.ItemAction
`ref` → `HTMLButtonElement`. A row action at the end of the value («Копировать», «Позвонить»): a ghost icon Button one tier below the list, with `label` as its name and tooltip.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — (required) | Accessible name and tooltip of the action. |
| `children` | `ReactNode` | — (required) | The icon (`<Icon name="…" />`). |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">` | — | `onClick`, `disabled`, `className` and the other button attributes. |

## Variants

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `horizontal` | the label in a column (one third of the width) beside the value; stacked below 24rem of the list's width | record details in a card or a page | yes |
| `vertical` | the label above its value at any width | a narrow side panel, a summary of a few long values | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` · `s` | label 12/16, value 12–13, pairs 8 apart | dense side panels, table expansions | |
| `m` | label 13/20, value 14/20, pairs 12 apart | most cards and drawers | the host tier, else `m` |
| `l` · `xl` | label 14/20, value 16/24, pairs 16 apart | a record page with room | |

## States
| State | Driven by | DOM |
|---|---|---|
| size / orientation | props, the host tier | `data-size`, `data-orientation` on the `<dl>` |
| narrow | the list narrower than 24rem (container query) | each pair stacks: the label above its value |
| empty value | `children` is `null`, `""` or `false` | `data-empty` on the `<dd>`; muted `labels.empty`, spoken `labels.emptyText` |

No motion: the list is static text; a row action has the Button's own press and hover.

## Layout & spacing
- The list fills its container; pairs are separated by air (8 · 12 · 16 by tier), not lines.
- A horizontal pair: label column one third, value two thirds, 16 apart; values wrap anywhere, labels wrap too.
- A row action sits at the end of the value, centred on its first line; it does not make the row taller.
- Inside a `Card.Body` or a `Drawer` the list takes the host tier; do not pass `size` there.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves to the row actions (`DescriptionList.ItemAction`); the pairs themselves are not focusable. |
| `Enter` · `Space` | Runs the row action. |

### ARIA
- The list is a `<dl>`: the label is a `<dt>`, the value a `<dd>`; screen readers read each pair as a term and its definition.
- An empty value shows a muted `labels.empty` (hidden from assistive tech) and is read as `labels.emptyText`.
- A row action is named by its `label`, which is also its tooltip; the icon is decorative.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `empty` | `"—"` | Visible mark of an empty value (muted, hidden from assistive tech). |
| `emptyText` | `"Не указано"` | What assistive tech reads for an empty value. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A client's details in a card: labels beside values, a long address that wraps, an empty manager and a copy action — `DescriptionList.Item`, `label`, `DescriptionList.ItemAction`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier changes the label and value type and the gap between pairs — `size`. |
| [structure.tsx](examples/structure.tsx) | Optional pieces of a pair: a Badge or a link as the value, a row action and an empty value with its own mark — `DescriptionList.ItemAction`, `labels`. |
| [vertical.tsx](examples/vertical.tsx) | Labels above their values at any width, for a side panel of a record — `orientation`. |
| [narrow.tsx](examples/narrow.tsx) | In a 320 px card the list is narrower than 24rem: each label moves above its value and long values wrap. |
| [screen.tsx](examples/screen.tsx) | A detail page: breadcrumb and status in the header, actions by weight, a main column with the line items and a side column with the client and the history — `orientation`. |

## Mistakes
- A grid of `Typography` pairs or a two-column table for record details → `DescriptionList`: the `<dl>` semantics and the stacking come with it.
- `""` or «—» typed by hand for a missing value → pass nothing; the list shows `labels.empty` and speaks `labels.emptyText`.
- A copy button placed after the list or inside the label → `DescriptionList.ItemAction` inside the item, at the end of its value.
- A viewport media query to stack the pairs → the list adapts to its own width already.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (`ItemAction`), [Tooltip](../tooltip/COMPONENT.md) (the action's `label`)
- **See also:** [Card](../card/COMPONENT.md) (the surface the list usually sits in), [Drawer](../drawer/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Timeline](../timeline/COMPONENT.md)

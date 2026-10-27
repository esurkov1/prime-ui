# Fieldset

**Category:** inputs
**Kind:** primitive

> A frameless group of related form fields: a native `<fieldset>` with a `title-s` legend, the form rhythm between its fields and one `disabled` for all of them.

## When to use
- A long form split into groups («Реквизиты», «Контакты», «Уведомления»), each with a heading 16 above its fields.
- Disabling every field of a form while its request runs: `disabled` on the group instead of `disabled` on each field.
- A group that needs a native name for assistive tech (`<legend>`), e.g. a set of switches under one heading.
- Without `label`: the plain field column of a form — the fields 20 apart and one `disabled` for all of them, instead of a hand-made stack.
- Short fields side by side (ИНН and КПП, a period's start and end, settings of one device): `layout="pair"` instead of a hand-made grid — at most two columns, a field left alone in the last row spans it, one column in a narrow group.

## When not to use
- One choice among options with a heading → [Radio](../radio/COMPONENT.md) `Radio.Group label`, a [SegmentedControl](../segmented-control/COMPONENT.md) or [ButtonGroup](../button-group/COMPONENT.md) `label`.
- A bounded block with a surface (a settings panel) → [Card](../card/COMPONENT.md) `Card.Root`; a Fieldset inside it groups the fields.
- A page section with a title and actions → [Page](../../layout/page/COMPONENT.md) sections (`Page.Section`).
- A group of settings with a title and a trailing control (a «Сбросить» button, a master switch) → `Card.Root` with `Card.Header` (`Card.Title` + the control in `Card.Actions`) and the Fieldset in `Card.Body`, named by the title (`aria-labelledby`).
- A single field's label → the field's own `label`.

## Import
```tsx
import { Fieldset } from "prime-ui-kit";
```

## Anatomy
```
Fieldset           <fieldset>: no border, padding or fill; aria-disabled + the kit's disabled context
├─ <legend>        `label`: the heading, title-s, names the group
├─ <p>             `description`: secondary text, aria-describedby
└─ fields          children, field → field 20; `layout="pair"`: two to a row
```
A leaf: everything is a prop or a child. Each direct child is one cell of `layout`; a nested `Fieldset` without `label` lays out a part of the group (a pair under a full-width field).

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Fieldset
`ref` → `HTMLFieldSetElement`. A native `<fieldset>` without border, padding or fill: the `<legend>` heading, an optional description, then the children at the form rhythm. `disabled` disables every control inside.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Group heading in the native `<legend>` (`title-s`), the group name. Without it the fieldset is the plain field column of a form; give it an `aria-label` when the group needs a name. |
| `description` | `ReactNode` | — | Secondary text under the heading (`body-s`, secondary), linked through `aria-describedby`. |
| `disabled` | `boolean` | `false` | Disables every kit control inside (each takes its own disabled look, ARIA and keyboard, in place); nested groups inherit it. A native control of your own takes `disabled` itself. Use it while the form's request runs. |
| `layout` | `"stack" \| "pair"` | `"stack"` | How the fields stand: `stack` — one column; `pair` — two equal columns 20 apart, a field left alone in the last row spans it, and below 27.5rem of group width (`--prime-layout-form-width-s`) one column again. |
| `children` | `ReactNode` | — (required) | The fields, 20 apart, in the `layout`; each direct child is one cell — a nested `Fieldset` without `label` keeps a part of the group in its own `layout`. |
| `…rest` | `Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children" \| "disabled">` | — | `className`, `name`, `form`, `aria-*` and the other attributes of the `<fieldset>`. |

## Variants
Fieldset has no `variant`, `tone` or `size`: fields keep their own tier (or the host's).

### layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `stack` | One column, the fields 20 apart | Most groups; long fields (address, comment), choice rows | yes |
| `pair` | Two equal columns, 20 apart both ways; a field left alone in the last row spans it; one column when the group is narrower than 27.5rem | Short related fields side by side in a settings or details group | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `disabled` | Every control inside in its disabled look; the heading and the description keep their color | While the form's request runs; a section the person cannot edit | `false` |

**Combinations**
- Recommended: groups 32 apart in the form, a `label` on each; `disabled={saving}` on every group and `loading` on the submit button outside them.
- Allowed: `layout="pair"` on a group of short fields; a nested `Fieldset layout="pair"` without `label` for one row inside a stacked group.
- Allowed: no `label` — the plain field column of a form (the rhythm and `disabled` without a heading); give it an `aria-label` when the group itself needs a name.
- Pointless: a description without a heading.
- Pointless: `layout="pair"` around fields that need a full line (an address, a Textarea, a choice row) — they stand squeezed in a column.
- Forbidden: a border, padding or fill added to the group — the group is made by proximity; use a Card when it needs a surface.

## States
| State | Driven by | DOM |
|---|---|---|
| disabled | `disabled` (or a disabled Fieldset around it) | `aria-disabled="true"` + `data-disabled="true"` on the `<fieldset>` (no native `disabled`); every kit control inside takes its own disabled state (`data-disabled`, `aria-disabled`, native `disabled`) from the context, in place — nothing remounts as the group flips |

A Button inside a disabled group is disabled too (it reads the same context), so the submit button sits outside the group and shows `loading` while the request runs. `FormData` skips the kit fields of a disabled group (natively disabled, or under a tooltip without a `name`): read the form before disabling it. A native control of your own inside takes `disabled` itself.

## Layout & spacing
- Heading → fields `--prime-space-4` (16); heading → description `--prime-space-1` (4); description → fields `--prime-space-4`; field → field `--prime-space-5` (20).
- `layout="pair"`: a grid of two equal columns (`minmax(0, 1fr)`), the same `--prime-space-5` between rows and columns, fields aligned to the row's top (a hint under one never stretches the other). An odd last field spans both columns. The group is a container (`prime-fieldset`): below 27.5rem of its own width — `--prime-layout-form-width-s` — one column, so it adapts in a dialog, a card or a phone without viewport breakpoints.
- Group → group 32 — set by the form around the groups.
- `width: 100%`, `min-width: 0` (the native fieldset's `min-content` minimum is reset), so long values never widen the form.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves through the group's fields; the fields of a disabled group are skipped. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The native `<fieldset>` is a group (`role="group"`) named by the `<legend>` text from `label`; without a heading give it `aria-label`.
- `description` is linked to the group through `aria-describedby`.
- `disabled` sets `aria-disabled` on the group, never native `disabled`, and passes a context: kit controls set their own `disabled` / `aria-disabled` in place, so a `Tooltip.Trigger` inside never re-hosts one.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A group of contact fields under a heading with a short description, no frame of its own — `label`, `description`. |
| [states.tsx](examples/states.tsx) | An enabled group next to a disabled one: every kit control inside takes its disabled look — `disabled`. |
| [pair.tsx](examples/pair.tsx) | Company details two to a row: the field left alone in the last row spans it, a narrow group stacks them — `label`, `layout`. |
| [in-form.tsx](examples/in-form.tsx) | A client form in two groups: while the request runs every field inside is disabled at once and the submit button shows its progress — `label`, `disabled`. |

## Mistakes
- A raw `<fieldset disabled>` around kit controls → `Fieldset disabled`; the raw one leaves choice rows, segments and triggers in their enabled look.
- `disabled` on every field of a saving form → one `disabled` on the group.
- A `Typography` heading + `aria-labelledby` inside a hand-reset fieldset → `label`.
- Reading `new FormData(form)` after disabling the group → the disabled fields are missing; read it first.
- A border or a fill around the group → none; groups are separated by air, a surface is a Card.
- A hand-made `grid` with `auto-fit` / `auto-fill` around fields → `layout="pair"`; the grid leaves a hole beside an odd last field and lets three or more columns open on a wide screen.

## Related
- **Built from:** —
- **See also:** [Card](../card/COMPONENT.md) (a surface around the groups), [Input](../input/COMPONENT.md) (takes its disabled look from the group), [Button](../button/COMPONENT.md) (the submit with `loading`, outside the group), [Radio](../radio/COMPONENT.md)

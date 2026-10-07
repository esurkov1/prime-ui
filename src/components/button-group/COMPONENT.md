# ButtonGroup

**Category:** actions
**Kind:** control

> Joined buttons and toggle segments in one neutral bar.

## When to use
- A few related actions shown as one control (Undo / Redo, Submit / Reset, export formats).
- Toolbar toggles: independent on/off segments with `pressed`.
- A one-of-several switch that behaves like toolbar buttons (period, view mode), with `pressed` on the active segment.
- A vertical stack of related options (`orientation="vertical"`).

## When not to use
- Choosing a value from a set as a form control → use [SegmentedControl](../segmented-control/COMPONENT.md) (radio semantics, `value` / `onValueChange`).
- Switching between content panels → use [Tabs](../tabs/COMPONENT.md).
- Independent actions with their own visual weight (primary + cancel) → use separate [Button](../button/COMPONENT.md)s.
- Many actions or overflow → use [Dropdown](../dropdown/COMPONENT.md).

## Import
```tsx
import { ButtonGroup } from "prime-ui-kit";
```

## Anatomy
```
ButtonGroup.Root         <div role="group">; size and orientation for every segment
└─ ButtonGroup.Item      one segment, a native <button>; optional pressed toggle
   └─ ButtonGroup.Icon   decorative icon wrapper (aria-hidden), sized to the tier
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ButtonGroup.Root
`forwardRef` → `HTMLDivElement`. `<div role="group">`; sets the tier and orientation of every segment and passes the tier to nested icons.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Control tier of every segment: height 28 · 32 · 36 · 40 · 48, padding, text, icon. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the segments; `vertical` stretches them to the widest. |
| `fullWidth` | `boolean` | — | Stretches the group; horizontal segments share the width equally. |
| `children` | `ReactNode` | — | `ButtonGroup.Item` segments. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `aria-label` (name the group), `role` (e.g. `"toolbar"`), `className` and the other div attributes. |

### ButtonGroup.Item
`forwardRef` → `HTMLButtonElement`. One segment, a native `<button>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `pressed` | `boolean` | — | Toggle state: `aria-pressed` and `data-state="active" \| "inactive"`. Leave it out for a plain action segment. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type. |
| `disabled` | `boolean` | — | Native disabled. |
| `children` | `ReactNode` | — | Label and `ButtonGroup.Icon`. Only icons → square segment; give it `aria-label`. |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `className`, `aria-*` and the other button attributes. |

### ButtonGroup.Icon
`ref` → `HTMLSpanElement`. Decorative icon wrapper (`aria-hidden`) sized to the group tier.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="action.copy" />`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

## Variants

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `horizontal` | segments in a row, outer left / right corners rounded | toolbars, view and period switches | yes |
| `vertical` | segments in a column, stretched to the widest; top and bottom corners rounded | a short list of related options in a side column | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px high, 12/16 text, padX 8 | dense tables | |
| `s` | 32px, 13/20, padX 12 | compact toolbars | |
| `m` | 36px, 14/20, padX 16 | default | yes |
| `l` | 40px, 16/24, padX 20 | prominent forms | |
| `xl` | 48px, 16/24, padX 24 | hero areas | |

A group lines up with Button, Input, Select and SegmentedControl of the same `size`.

### pressed
| Value | Looks like | Use when | Default |
|---|---|---|---|
| — (omitted) | `fill-muted` fill, secondary text; hover `fill-muted-hover` + primary text; active `fill-strong` | plain actions | yes |
| `true` | `accent-soft` fill, accent text | the active toggle / selected option | |
| `false` | same as plain, but `aria-pressed="false"` | the non-active members of a toggle set | |

Segments have no borders: they sit on the neutral fill and are separated by a 1px gap that shows the surface behind; only the outer corners take the tier radius.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | group fills the row, segments `flex: 1` | plan pickers in narrow columns | off |
| icon-only (only `ButtonGroup.Icon` inside an Item) | square segment, width = height | toolbars; needs `aria-label` | — |

Do not mix action segments and toggle segments in one group, and do not put the primary action inside the group — place a [Button](../button/COMPONENT.md) of the same size next to it.

## States
| State | Driven by | DOM |
|---|---|---|
| hover / active | pointer | hover `fill-muted-hover` + primary text; active `fill-strong` |
| pressed | `pressed` | `aria-pressed`, `data-state="active" \| "inactive"` |
| disabled | `disabled` | native `:disabled`: `fill-muted` + `text-disabled`, `cursor: not-allowed` |
| focus-visible | keyboard | outer focus ring, the segment is raised above neighbours (`z-index: 1`) |

Root attributes: `data-size`, `data-orientation="vertical"` (only when vertical), `data-full-width`. Item attributes: `data-icon-only`, `data-leading-icon`, `data-trailing-icon` (optical padding `padX − 4px` on the icon side). Selection is always owned by the parent: keep the value in state and set `pressed`.

## Layout & spacing
- Groups in a toolbar: `gap: var(--prime-space-3)`; push the primary Button to the end with a flexible spacer.
- `max-width: 100%`; labels do not wrap. Use `fullWidth` in narrow columns.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus between segments; a disabled one is skipped. |
| `Enter` · `Space` | Presses the segment (native `<button>`). |

### ARIA
- `Root` is `role="group"` — give it `aria-label`; set `role="toolbar"` on the outer container of several groups.
- Toggle segments expose `aria-pressed`; in a toggle set pass `pressed={false}` to the inactive ones.
- Icon-only segments need `aria-label`; `ButtonGroup.Icon` is `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Related actions joined into one bar with a group name — `aria-label`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier, 28 to 48 px high, set once on the root — `size`. |
| [states.tsx](examples/states.tsx) | A plain segment, a toggled one and a disabled one — `pressed`, `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before the label and square icon-only segments — `ButtonGroup.Icon`, `aria-label`. |
| [orientation.tsx](examples/orientation.tsx) | A row of segments and a column of related options — `orientation`. |
| [full-width.tsx](examples/full-width.tsx) | The group fills its column and the segments share the width equally — `fullWidth`. |
| [controlled.tsx](examples/controlled.tsx) | One of several: the active segment lives in parent state and gets `pressed`. |
| [in-form.tsx](examples/in-form.tsx) | Segments are native buttons, so submit and reset work in one group — `type`. |

## Mistakes
- `size` on each `ButtonGroup.Item` → set `size` once on `Root`.
- `<Button.Root>` inside the group → use `ButtonGroup.Item`; Button segments are not joined.
- Expecting `value` / `onValueChange` → ButtonGroup has none; keep the value in state and set `pressed`, or use SegmentedControl.
- `pressed` only on the active segment of a toggle set → pass `pressed={false}` to the others so they announce as toggles.
- Icon-only segment without `aria-label` → add it.

## Related
- **Built from:** —
- **See also:** [Button](../button/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), [Tabs](../tabs/COMPONENT.md)

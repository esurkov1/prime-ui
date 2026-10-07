# ButtonGroup

**Category:** actions

> Joined buttons and toggle segments in one neutral bar.

## When to use
- A few related actions shown as one control (Undo / Redo, Submit / Reset).
- Toolbar toggles: independent on/off segments (Bold, Italic) with `pressed`.
- A one-of-several switch that behaves like toolbar buttons (period, view mode), with `pressed` on the active segment.
- A vertical stack of related options (`orientation="vertical"`).

## When not to use
- Choosing a value from a set as a form control → use [SegmentedControl](../segmented-control/COMPONENT.md) (radio semantics, `value`/`onValueChange`).
- Switching between content panels → use [Tabs](../tabs/COMPONENT.md).
- Independent actions with their own visual weight (primary + cancel) → use separate [Button](../button/COMPONENT.md)s.
- Many actions or overflow → use [Dropdown](../dropdown/COMPONENT.md).

## Import
```tsx
import { ButtonGroup } from "prime-ui-kit";
```

## Anatomy
- `ButtonGroup.Root` — `<div role="group">`; sets size and orientation for every segment.
- `ButtonGroup.Item` — one segment, a native `<button>`; must be inside `Root`.
- `ButtonGroup.Icon` — decorative icon wrapper (`aria-hidden`) sized to the group tier; must be inside `Root`.

## API

### ButtonGroup.Root
`forwardRef` → `HTMLDivElement`. + native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the segments. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Control tier for every segment; also provided to nested icons. |
| `fullWidth` | `boolean` | — | Stretches the group; horizontal segments share the width equally. |
| `role` | `string` | `"group"` | Override, e.g. `"toolbar"`. |
| `children` | `ReactNode` | — (required) | `ButtonGroup.Item` segments. |

### ButtonGroup.Item
`forwardRef` → `HTMLButtonElement`. + native `<button>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `pressed` | `boolean` | — | Toggle state: sets `aria-pressed` and `data-state="active" \| "inactive"`. Leave undefined for a plain action segment. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type. |
| `disabled` | `boolean` | — | Native disabled. |
| `children` | `ReactNode` | — | Label and `ButtonGroup.Icon`. Only icons → square segment (needs `aria-label`). |

### ButtonGroup.Icon
+ native `<span>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon (SVG). |
| `className` | `string` | — | Extra class. |

## Variants

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `horizontal` | segments in a row, outer left/right corners rounded | toolbars, view and period switches | yes |
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

### Segment look (`pressed`, icon-only)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| no `pressed` | `fill-muted` fill, secondary text; hover `fill-muted-hover` + primary text; active `fill-strong` | plain actions | yes |
| `pressed={true}` | `accent-soft` fill, accent text | the active toggle / selected option | |
| `pressed={false}` | same as plain, but `aria-pressed="false"` | the non-active members of a toggle set | |
| icon-only (only `ButtonGroup.Icon`) | square segment, width = height | toolbars | |
| `fullWidth` | group fills the row, segments `flex: 1` | plan pickers in narrow columns | off |

Segments have no borders: they sit on the neutral fill and are separated by a 1px gap that shows the surface behind; only the outer corners take the tier radius.

**Combinations**
- Recommended: in a toggle set give every segment a boolean `pressed` (true on active ones, false on the rest).
- Avoid: mixing action segments and toggle segments in one group; putting a primary action inside the group — place a [Button](../button/COMPONENT.md) of the same size next to it.

## States
| State | Driven by | DOM |
|---|---|---|
| pressed | `pressed` | `aria-pressed`, `data-state="active" \| "inactive"` |
| disabled | `disabled` | native `:disabled`: `fill-muted` + `text-disabled`, `cursor: not-allowed` |
| focus-visible | keyboard | outer focus ring, the segment is raised above neighbours (`z-index: 1`) |

Root attributes: `data-size`, `data-orientation="vertical"` (only when vertical), `data-full-width="true"`. Item attributes: `data-icon-only`, `data-leading-icon`, `data-trailing-icon` (optical padding `padX − 4px` on the icon side). Selection is always controlled by the parent: keep the value in state and set `pressed` (see `controlled.tsx`).

## Layout & spacing
- Groups in a toolbar: `gap: var(--prime-space-3)`; push the primary Button to the end with a flexible spacer.
- `max-width: 100%`; labels do not wrap. Use `fullWidth` in narrow columns.

## Accessibility
- `Root` is `role="group"` — give it `aria-label`; set `role="toolbar"` on the outer container of several groups.
- Toggle segments expose `aria-pressed`; icon-only segments need `aria-label`.
- Keyboard: Tab moves between segments, Enter/Space activates (native buttons). No arrow-key roving. No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | Five size tiers | matching neighbouring controls |
| [states.tsx](examples/states.tsx) | Plain, pressed, disabled segments | state reference |
| [orientation.tsx](examples/orientation.tsx) | Horizontal and vertical groups | column of options |
| [controlled.tsx](examples/controlled.tsx) | One of several via parent state + `pressed` | period / view switch |
| [composition.tsx](examples/composition.tsx) | Editor toolbar: history, toggles, alignment, primary Button | formatting toolbars |
| [full-width.tsx](examples/full-width.tsx) | `fullWidth` plan picker | narrow forms and cards |
| [in-form.tsx](examples/in-form.tsx) | `type="submit"` / `type="reset"` segments | search / filter forms |

```tsx
import { ButtonGroup } from "prime-ui-kit";

export function HistoryGroup() {
  return (
    <ButtonGroup.Root aria-label="История">
      <ButtonGroup.Item>Отменить</ButtonGroup.Item>
      <ButtonGroup.Item>Повторить</ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
```

## Mistakes
- `size` on each `ButtonGroup.Item` → set `size` once on `Root`.
- `<Button.Root>` inside the group → use `ButtonGroup.Item`; Button segments are not joined.
- Expecting `value`/`onValueChange` → ButtonGroup has none; keep the value in state and set `pressed`, or use SegmentedControl.
- `pressed` only on the active segment of a toggle set → pass `pressed={false}` to the others so they announce as toggles.
- Icon-only segment without `aria-label` → add it.

## Related
- [Button](../button/COMPONENT.md)
- [SegmentedControl](../segmented-control/COMPONENT.md)
- [Tabs](../tabs/COMPONENT.md)

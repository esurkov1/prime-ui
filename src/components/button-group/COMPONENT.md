# ButtonGroup

**Category:** actions
**Kind:** control

> Joined buttons and toggle segments in one neutral bar.

## When to use
- A few related actions shown as one control (Undo / Redo, Submit / Reset, export formats).
- Toolbar toggles: independent on/off segments with the pressed triad (`pressed` / `defaultPressed` / `onPressedChange`, a promise for a save on the server).
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
ButtonGroup.Root            field frame: label row · group · support row (hint | error)
└─ (group)                  <div role="group">: a row is the switcher row, a column stacks
   └─ ButtonGroup.Item      one segment, a native <button>; optional pressed toggle
      └─ ButtonGroup.Icon   decorative icon wrapper (aria-hidden), sized to the tier
```
The root is a field root: `className`, `ref` and the native attributes land on the frame, which hugs the group unless `fullWidth`; `id`, `role` and the `aria-label*` / `aria-describedby` names land on the group element. Without `label`, `hint` and `error` the frame shows only the segments.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ButtonGroup.Root
`ref` → `HTMLDivElement` (the field frame). The field: label · `<div role="group">` with the segments (a row scrolls as a switcher, a column stacks) · support row; sets the tier and orientation of every segment. The frame hugs the group unless `fullWidth`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Control tier of every segment: height 28 · 32 · 36 · 40 · 48, padding, text, icon. Without it the tier of its host (a toolbar, a panel), else `m`. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the segments; `vertical` stretches them to the widest. |
| `fullWidth` | `boolean` | — | Stretches the group; horizontal segments tend to equal widths but never get narrower than their label (the row scrolls instead). |
| `label` | `ReactNode` | — | Heading above the control; names the `group` (`aria-labelledby`). Without it give the root an `aria-label`. |
| `required` | `boolean` | `false` | Red `*` after the label and `aria-required` on the `group`. |
| `optional` | `boolean` | `false` | Muted marker after the label (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the control (`aria-describedby`). Hidden while `error` is shown. |
| `hintTone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Status color of `hint` («Осталось 12 дней» in `warning`). The words carry the status, the color repeats it; an `error` replaces the hint and its tone. A validation error is `error`, never a `danger` hint. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | `false` | Danger inset ring, `aria-invalid` and `data-invalid` on the `group`; the control shakes once when an error arrives. |
| `reserveSupportRow` | `boolean` | `false` | Always render the support row, so an appearing error does not shift the layout. |
| `id` | `string` | — | Id of the `group` element (generated when omitted); hint id is `<id>-hint`, error id `<id>-error`. |
| `labels` | `Partial<ButtonGroupLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | `ButtonGroup.Item` segments. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange" \| "dir">` | — | `aria-label` / `aria-labelledby` / `aria-describedby` and `role` (e.g. `"toolbar"`) go to the group element; `className`, `data-*` and the other attributes to the field frame `<div>`. |

### ButtonGroup.Item
`ref` → `HTMLButtonElement`. One segment, a native `<button>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `pressed` | `boolean` | — | Toggle state (controlled): `aria-pressed` and `data-state="active" \| "inactive"`. Leave the whole triad out for a plain action segment. |
| `defaultPressed` | `boolean` | — | The initial state of an uncontrolled toggle segment; a press flips it. |
| `onPressedChange` | `(pressed: boolean) => void \| Promise<void>` | — | The new state on a press (after `onClick`). A promise: the state shows at once, the segment is `aria-busy`, presses wait; a controlled owner sets `pressed` before resolving; reject turns it back. |
| `disabled` | `boolean` | — | Native disabled; a disabled `Fieldset` around the group sets it too. |
| `children` | `ReactNode` | — | Label and `ButtonGroup.Icon`. Only icons → square segment; give it `aria-label`. |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `type` (`"button"` unless set: `"submit"` / `"reset"` in a form), `onClick`, `className`, `aria-*` and the other button attributes. |

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
| `m` | 36px, 14/20, padX 16 | default | yes (without `size`: the host's tier, else `m`) |
| `l` | 40px, 16/24, padX 20 | prominent forms | |
| `xl` | 48px, 16/24, padX 24 | hero areas | |

A group lines up with Button, Input, Select and SegmentedControl of the same `size`.

### pressed
| Value | Looks like | Use when | Default |
|---|---|---|---|
| — (omitted) | `fill-muted` fill, secondary text; hover `fill-muted-hover` + primary text | plain actions | yes |
| `true` | `accent-soft` fill, accent text | the active toggle / selected option | |
| `false` | same as plain, but `aria-pressed="false"` | the non-active members of a toggle set | |

Segments have no borders: they sit on the neutral fill and are separated by a 1px gap that shows the surface behind; only the outer corners take the tier radius.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | group fills the row; segments tend to equal widths (`flex: 1 1 0`) but never get narrower than their label, the row scrolls instead | plan pickers in narrow columns | off |
| icon-only (only `ButtonGroup.Icon` inside an Item) | square segment, width = height | toolbars; needs `aria-label` | — |

Do not mix action segments and toggle segments in one group, and do not put the primary action inside the group — place a [Button](../button/COMPONENT.md) of the same size next to it.

## States
| State | Driven by | DOM |
|---|---|---|
| hover / press | pointer | hover `fill-muted-hover` + primary text; a press gives the segment in by `--prime-motion-press-distance` (`-compact` for icon-only segments, `internal/press`) and keeps its fill; disabled never scales |
| pressed | `pressed` / `defaultPressed` (a press flips it and calls `onPressedChange`) | `aria-pressed` (the look is styled from it), `data-state="active" \| "inactive"` |
| saving | `onPressedChange` returned a pending promise | the segment shows its new state at once, `aria-busy`, `cursor: progress`, keeps its size and colors; presses wait; a rejection turns the state back |
| disabled | `disabled` on an Item, or a disabled `Fieldset` around the group | native `:disabled` (under a `Tooltip.Trigger` `aria-disabled="true"`, the same node): `fill-muted` + `text-disabled`, `cursor: not-allowed` |
| focus-visible | keyboard | in a row the ring is inside the segment (the row scrolls, it clips); in a column the outer ring; the segment is raised above its neighbours |
| invalid | `invalid` or non-empty `error` | group `data-invalid="true"` + `aria-invalid="true"`, an inset danger ring on every segment; the error replaces the hint; the segments shake once when an error arrives |
| required | `required` | red `*` after the label, `aria-required="true"` on the group |
| optional | `optional` | a muted `labels.optional` marker after the label |
| support row reserved | `reserveSupportRow` | the support row stays rendered while empty, so an error arriving shifts nothing |
| overflow | a row wider than its container | the row scrolls inside itself with faded edges (`data-overflow-start` / `data-overflow-end`), never wraps or truncates |

Group attributes: `data-size`, `data-orientation="vertical"` (only when vertical), `data-full-width`. Item attributes: `data-icon-only`, `data-leading-icon`, `data-trailing-icon` (optical padding `padX − 4px` on the icon side). A toggle segment takes the pressed triad (`pressed` / `defaultPressed` / `onPressedChange`); a set of segments where one is active keeps its value in the parent and sets `pressed` on each. A `disabled` segment keeps its size: disabled changes only colors and the cursor.

## Layout & spacing
- Groups in a toolbar: one tier gap between controls; push the primary Button to the end with a flexible spacer.
- A row is a switcher (foundation §9): `max-width: 100%`, labels never wrap or truncate, and segments that do not fit scroll inside the row. Its host gives it a bounded width (`min-width: 0` on a flex child). Use `fullWidth` in narrow columns.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves focus between segments; a disabled one is skipped. |
| `Enter` · `Space` | Presses the segment (native `<button>`). |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The group element is `role="group"`, named by `label` (`aria-labelledby`); without a label give the root `aria-label`. Set `role="toolbar"` on the outer container of several groups.
- Hint and error are linked through `aria-describedby`; an error sets `aria-invalid="true"`, `required` sets `aria-required="true"`.
- Toggle segments expose `aria-pressed`; in a toggle set pass `pressed={false}` to the inactive ones. While an `onPressedChange` promise is pending the segment is `aria-busy`.
- Icon-only segments need `aria-label`; `ButtonGroup.Icon` is `aria-hidden`.
- Under a `Tooltip.Trigger` a disabled `ButtonGroup.Item` is `aria-disabled="true"` with no native `disabled`: it keeps its tab stop and its node, the press and a form submit are blocked.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Related actions joined into one bar with a group name — `aria-label`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier, 28 to 48 px high, set once on the root — `size`. |
| [states.tsx](examples/states.tsx) | A plain segment, a toggled one, a disabled one and a group in error — `pressed`, `disabled`, `invalid`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before the label and square icon-only segments — `ButtonGroup.Icon`, `aria-label`. |
| [orientation.tsx](examples/orientation.tsx) | A row of segments and a column of related options — `orientation`. |
| [full-width.tsx](examples/full-width.tsx) | The group fills its column and the segments share the width equally — `fullWidth`. |
| [saving.tsx](examples/saving.tsx) | Feed filters saved to the profile on the server: a toggle shows its new state at once, and a refused save turns it back and says why — `defaultPressed`, `onPressedChange`, `error`. |
| [controlled.tsx](examples/controlled.tsx) | One of several: the active segment lives in parent state — `pressed`. |
| [in-form.tsx](examples/in-form.tsx) | A task form: the priority toggles are a labelled field checked on submit, an optional reminder, and native submit and reset segments in one group — `label`, `required`, `hint`, `error`, `optional`, `type`. |

## Mistakes
- `size` on each `ButtonGroup.Item` → set `size` once on `Root`.
- `<Button.Root>` inside the group → use `ButtonGroup.Item`; Button segments are not joined.
- Expecting `value` / `onValueChange` → ButtonGroup has none; keep the value in state and set `pressed`, or use SegmentedControl.
- `pressed` only on the active segment of a toggle set → pass `pressed={false}` to the others so they announce as toggles.
- Icon-only segment without `aria-label` → add it.
- `disabled` on a toggle segment for the time of a save → return the request's promise from `onPressedChange`; the segment waits `aria-busy` and turns back on a refusal.
- A `Label` + `Hint` pair wired by hand around a toggle set in a form → `label`, `hint`, `error` on the root.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (`internal/SwitcherScroller`, a row), [Label](../label/COMPONENT.md) (`label`), [Hint](../hint/COMPONENT.md) (`hint`, `error`), [VisuallyHidden](../visually-hidden/COMPONENT.md); `internal/press`
- **See also:** [Button](../button/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), [Tabs](../tabs/COMPONENT.md)

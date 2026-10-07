# Button

**Category:** actions (Действия)

> A button for explicit actions, with variants, tones, sizes and a built-in loading state.

## When to use
- Primary, secondary and destructive actions in forms, toolbars, dialogs, cards and empty states.
- Async actions: `loading` shows a spinner, blocks clicks and keeps the width.
- Compact toolbars: icon-only buttons (only `Button.Icon` inside) are square.
- Action-styled navigation: `asChild` with an `<a>` or a router link.

## When not to use
- Inline text link or quiet navigation in text → use [LinkButton](../link-button/COMPONENT.md).
- Several joined buttons or a toggle row → use [ButtonGroup](../button-group/COMPONENT.md).
- Choosing one value from a few options → use [SegmentedControl](../segmented-control/COMPONENT.md).
- On/off setting → use [Switch](../switch/COMPONENT.md) or [Checkbox](../checkbox/COMPONENT.md).
- A button that opens a list of actions → use [Dropdown](../dropdown/COMPONENT.md) with a Button as its trigger.

## Import
```tsx
import { Button } from "prime-ui-kit";
```

## Anatomy
- `Button.Root` — the `<button>` (or the single child with `asChild`); sets variant, tone, size and passes the size tier to nested icons.
- `Button.Icon` — decorative icon wrapper (`aria-hidden`), sized to the tier.
- `Button.Spinner` — optional explicit spinner position; renders only while `Root` is `loading`.

## API

### Button.Root
`forwardRef` → `HTMLButtonElement`. + native `<button>` props (except `size`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost"` | `"solid"` | Visual treatment. |
| `tone` | `"accent" \| "neutral" \| "danger"` | `"accent"` | Meaning of the action; `danger` for destructive actions. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Control tier: height, padding, text, icon, radius. |
| `fullWidth` | `boolean` | — | Stretches to the container width (`display: flex; width: 100%`). |
| `loading` | `boolean` | `false` | Shows the spinner, sets `aria-busy`, blocks clicks; width does not change. With `asChild` no spinner is added automatically — place `Button.Spinner` yourself. |
| `asChild` | `boolean` | `false` | Merges Button props and styles onto the single child element instead of rendering `<button>`. `disabled`/`loading` become `aria-disabled`; no automatic loading spinner. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type; not forwarded with `asChild`. |
| `disabled` | `boolean` | — | Disabled state; `loading` also disables. |
| `children` | `ReactNode` | — | Label and `Button.Icon`. Only `Button.Icon` children → square icon-only button. |

### Button.Icon
+ native `<span>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="action.copy" />`. `Icon` without `size` takes the button tier. |
| `className` | `string` | — | Extra class on the span. |

### Button.Spinner
+ native `<span>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. Renders nothing unless `Button.Root` has `loading`. Not needed in most cases: `loading` adds a spinner by itself. |

## Variants

### variant × tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `solid` + `accent` | accent fill, accent-fg text, hover `accent-hover` | the one primary action of an area (Save, Publish) | yes |
| `solid` + `neutral` | `fill-muted` fill, primary text | a neutral filled action next to fields (Cancel on canvas) | |
| `solid` + `danger` | danger fill, danger-fg text | confirming a destructive action in a dialog | |
| `soft` + `accent` | `accent-soft` fill, accent text | secondary but highlighted action | |
| `soft` + `neutral` | translucent `fill-subtle` wash, primary text | secondary actions (Cancel, Filters) | |
| `soft` + `danger` | `danger-soft` fill, danger text | secondary destructive action | |
| `outline` + `accent` | transparent, 1px `border-default` inset line, accent text | rare; accent action that must look lighter than solid | |
| `outline` + `neutral` | transparent, 1px inset line, primary text | secondary action that needs an edge (Draft, Back) | |
| `outline` + `danger` | 1px inset line, danger text, `danger-soft` on hover | destructive trigger that opens a confirm | |
| `ghost` + `accent` | transparent, accent text, `fill-subtle` on hover | tertiary accent action in text-heavy areas | |
| `ghost` + `neutral` | transparent, secondary text → primary on hover | toolbar buttons, icon-only buttons | |
| `ghost` + `danger` | transparent, danger text, `danger-soft` on hover | destructive action set apart in a footer (Delete project) | |

`outline` is the only variant with a visible line. With `asChild` and `aria-current="page"`, `ghost`/`soft` show the `fill-subtle-active` selected look.

**Combinations**
- Recommended: one `solid accent` per area; others `soft`/`outline`/`ghost` with `tone="neutral"`; destructive = `tone="danger"`, `ghost`/`outline` as a trigger, `solid` in the confirm.
- Allowed but rare: `outline accent`, `ghost accent`.
- Avoid: two `solid accent` buttons side by side; `tone="danger"` for non-destructive actions; icon-only `solid accent` in toolbars.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px high, 12/16 text, padX 8, icon 14 | dense tables and chips rows | |
| `s` | 32px, 13/20, padX 12, icon 16 | compact toolbars, filters | |
| `m` | 36px, 14/20, padX 16, icon 16 | default UI | yes |
| `l` | 40px, 16/24, padX 20, icon 20 | prominent forms | |
| `xl` | 48px, 16/24, padX 24, icon 20 | hero / marketing CTA, mobile footers | |

A Button lines up exactly with Input, Select, Datepicker trigger, SegmentedControl and Tabs of the same `size`. The icon side gets optical padding `padX − 4px` (never below 8px); icon→label gap is the tier gap.

### Visual flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | button fills the row | narrow forms, cards, mobile footers | off |
| icon-only (children are only `Button.Icon`) | square, width = height | toolbars; needs `aria-label` | — |

**Hierarchy:** one primary (`solid accent`) per area, the rest neutral `soft`/`outline`/`ghost`; a destructive action is `tone="danger"` and sits apart (start of the footer).

## States
| State | Driven by | DOM |
|---|---|---|
| hover / active | pointer | hover fill per variant; active `scale(0.98)` |
| focus-visible | keyboard | outer focus ring with `--prime-focus-offset` |
| disabled | `disabled` | native `disabled`, `data-disabled="true"`, `fill-muted` + `text-disabled`, `cursor: not-allowed`; ghost stays transparent |
| loading | `loading` (native `<button>`) | `data-loading="true"`, `data-disabled="true"`, `aria-busy="true"`; an automatic spinner replaces the leading (or only) icon, otherwise it is centered over the hidden label (`data-loading-overlay="true"`) |
| asChild disabled / loading | `asChild` + `disabled`/`loading` | `aria-disabled="true"`, `pointer-events: none`, click `preventDefault`; no native `disabled`. With `loading` also `aria-busy="true"` and `data-loading="true"`, but no automatic spinner and no `data-loading-overlay` — add `<Button.Spinner />` inside the child to show one |

Other data attributes: `data-variant`, `data-tone`, `data-size`, `data-full-width` (when `fullWidth` is set), `data-icon-only`, `data-leading-icon`, `data-trailing-icon`. `loading` is controlled by the parent (see `controlled.tsx`).

## Layout & spacing
- Buttons in a row: `gap: var(--prime-space-2)`–`var(--prime-space-3)`; toolbar icon buttons `var(--prime-space-1)`.
- Form footer: actions right-aligned, primary last; below 480px stack full width (`fullWidth` or a column flex).
- `max-width: 100%`, label does not wrap (`white-space: nowrap`).

## Accessibility
- Native `<button>`, `type="button"` by default.
- Icon-only buttons need `aria-label`; `Button.Icon` is `aria-hidden`.
- `loading` sets `aria-busy`; disabled buttons are not focusable (native `disabled`); with `asChild` they stay focusable with `aria-disabled`.
- Keyboard: Enter/Space (native). No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | Five size tiers | matching the tier of neighbouring controls |
| [icon-only.tsx](examples/icon-only.tsx) | Square icon-only toolbar at every size | compact toolbars |
| [variants-tones.tsx](examples/variants-tones.tsx) | Every variant × tone | choosing treatment and meaning |
| [states.tsx](examples/states.tsx) | Default, disabled, loading (overlay, with icon, icon-only) | showing state feedback |
| [controlled.tsx](examples/controlled.tsx) | `loading` from parent state on click | async actions |
| [with-icon.tsx](examples/with-icon.tsx) | Leading and trailing `Button.Icon` | icon clarifies the action |
| [composition.tsx](examples/composition.tsx) | Editor toolbar + form footer hierarchy | laying out several actions |
| [surfaces.tsx](examples/surfaces.tsx) | Neutral variants on canvas, card, raised, accent | buttons on non-default backgrounds |
| [full-width.tsx](examples/full-width.tsx) | `fullWidth` stack | narrow forms, mobile footers |
| [as-child.tsx](examples/as-child.tsx) | Button look on `<a>`, disabled links | navigation styled as an action |
| [in-form.tsx](examples/in-form.tsx) | `type="submit"` / `type="reset"` | native forms |

```tsx
import { Button } from "prime-ui-kit";

export function SaveButton() {
  return <Button.Root onClick={() => {}}>Сохранить</Button.Root>;
}
```

## Mistakes
- `<Button.Root><Icon name="action.copy" /></Button.Root>` → wrap in `Button.Icon` so the button becomes square and the icon is sized.
- Icon-only button without `aria-label` → add `aria-label="Копировать"`.
- `tone="error"` / `variant="primary"` → `tone="danger"`, `variant="solid"`.
- Adding `<Button.Spinner />` for every loading button → just set `loading`.
- `<a>` inside `<Button.Root>` → use `asChild` so there is one interactive element.
- Submit button without `type="submit"` → the default is `"button"` and will not submit.

## Related
- [ButtonGroup](../button-group/COMPONENT.md)
- [LinkButton](../link-button/COMPONENT.md)
- [Dropdown](../dropdown/COMPONENT.md)
- [Input](../input/COMPONENT.md)

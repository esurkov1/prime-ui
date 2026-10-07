# Button

**Category:** actions
**Kind:** primitive

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
```
Button.Root        <button> (or the single child with asChild); variant, tone, size; size tier for nested icons
├─ (Spinner)       rendered by Root while loading, aria-hidden
└─ Button.Icon     decorative icon wrapper (aria-hidden), sized to the tier
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Button.Root
`forwardRef` → `HTMLButtonElement`. The `<button>`, or the single child with `asChild`; sets variant, tone and size and passes the tier to nested icons.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost"` | `"solid"` | Visual treatment. |
| `tone` | `"accent" \| "neutral" \| "danger"` | `"accent"` | Meaning of the action; `danger` for destructive actions. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `host tier, else "m"` | Control tier: height 28 · 32 · 36 · 40 · 48, padding, text, icon, radius. Without it the button takes the tier of its host (LoginForm, Popover, a field, a panel with a size), else `m`. |
| `fullWidth` | `boolean` | — | Stretches to the container width. |
| `loading` | `boolean` | `false` | Shows a `Spinner` in place of the leading icon or over the label, sets `aria-busy`, blocks clicks; width does not change. With `asChild` no spinner is added — the child owns its content. |
| `asChild` | `boolean` | `false` | Merges Button props and styles onto the single child element instead of rendering `<button>`. `disabled`/`loading` become `aria-disabled`. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type; not forwarded with `asChild`. |
| `disabled` | `boolean` | — | Disabled state; `loading` also disables. |
| `children` | `ReactNode` | — | Label and `Button.Icon`. Only `Button.Icon` children → square icon-only button; give it `aria-label`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size">` | — | `onClick`, `className`, `aria-*`, `data-*` and the other button attributes. |

### Button.Icon
No ref. Decorative icon wrapper (`aria-hidden`) sized to the button tier.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="action.copy" />`; `Icon` without `size` takes the button tier. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

## Variants

### variant × tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `solid` + `accent` | accent fill, accent-fg text, hover `accent-hover` | the one primary action of an area (Save, Publish) | yes |
| `solid` + `neutral` | `fill-muted` fill, primary text | a neutral filled action next to fields | |
| `solid` + `danger` | danger fill, danger-fg text | confirming a destructive action in a dialog | |
| `soft` + `accent` | `accent-soft` fill, accent text | secondary but highlighted action | |
| `soft` + `neutral` | translucent `fill-subtle` wash, primary text | secondary actions (Cancel, Filters) | |
| `soft` + `danger` | `danger-soft` fill, danger text | secondary destructive action | |
| `outline` + `accent` | transparent, 1px `border-default` inset line, accent text | rare; accent action lighter than solid | |
| `outline` + `neutral` | transparent, 1px inset line, primary text | secondary action that needs an edge (Draft, Back) | |
| `outline` + `danger` | 1px inset line, danger text, `danger-soft` on hover | destructive trigger that opens a confirm | |
| `ghost` + `accent` | transparent, accent text, `fill-subtle` on hover | tertiary accent action in text-heavy areas | |
| `ghost` + `neutral` | transparent, secondary text → primary on hover | toolbar buttons, icon-only buttons | |
| `ghost` + `danger` | transparent, danger text, `danger-soft` on hover | destructive action set apart in a footer | |

`outline` is the only variant with a visible line. With `aria-current="page"` (usually via `asChild` on a router link), `ghost`/`soft` show the `fill-subtle-active` selected look; soft accent keeps its own accent look, so a current item can be marked with accent explicitly (Pagination).

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px high, 12/16 text, padX 8, icon 14 | dense tables and chip rows | |
| `s` | 32px, 13/20, padX 12, icon 16 | compact toolbars, filters | |
| `m` | 36px, 14/20, padX 16, icon 16 | default UI | yes |
| `l` | 40px, 16/24, padX 20, icon 20 | prominent forms | |
| `xl` | 48px, 16/24, padX 24, icon 20 | hero CTA, mobile footers | |

A Button lines up exactly with Input, Select, Datepicker trigger, SegmentedControl and Tabs of the same `size`. The icon side gets optical padding `padX − 4px` (never below 8px); icon→label gap is the tier gap.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | button fills the row | narrow forms, cards, mobile footers | off |
| icon-only (children are only `Button.Icon`) | square, width = height | toolbars; needs `aria-label` | — |

**Hierarchy:** one primary (`solid accent`) per area, the rest neutral `soft`/`outline`/`ghost`; a destructive action is `tone="danger"` and sits apart (start of the footer). Avoid two `solid accent` buttons side by side and `tone="danger"` for non-destructive actions.

## States
| State | Driven by | DOM |
|---|---|---|
| hover / active | pointer | hover fill per variant; active `scale(var(--prime-motion-press-scale))` |
| focus-visible | keyboard | outer focus ring with `--prime-focus-offset` |
| disabled | `disabled` | native `disabled`, `data-disabled="true"`, `fill-muted` + `text-disabled`, `cursor: not-allowed`; ghost stays transparent |
| loading | `loading` (native `<button>`) | `data-loading="true"`, `data-disabled="true"`, `aria-busy="true"`; a `Spinner` (`aria-hidden`) replaces the leading (or only) icon, otherwise it is centered over the hidden label (`data-loading-overlay="true"`) |
| asChild disabled / loading | `asChild` + `disabled`/`loading` | `aria-disabled="true"`, `pointer-events: none`, click `preventDefault`; no native `disabled`, no automatic spinner |

Other data attributes: `data-variant`, `data-tone`, `data-size`, `data-full-width`, `data-icon-only`, `data-leading-icon`, `data-trailing-icon`.

## Layout & spacing
- Buttons in a row: `gap: var(--prime-space-2)`–`var(--prime-space-3)`; toolbar icon buttons `var(--prime-space-1)`.
- Form footer: actions right-aligned, primary last; below 480px stack full width (`fullWidth` or a column flex).
- `max-width: 100%`, the label does not wrap (`white-space: nowrap`).

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` · `Space` | Presses the button (native `<button>`). |
| `Tab` | Moves focus; a disabled button is skipped, with `asChild` it stays focusable with `aria-disabled`. |

### ARIA
- Native `<button>`, `type="button"` by default, so it never submits a form by accident.
- Icon-only buttons need `aria-label`; `Button.Icon` is `aria-hidden`.
- `loading` sets `aria-busy="true"` and blocks the press.
- With `asChild` the disabled state is `aria-disabled="true"` without a native `disabled`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The primary action with a secondary one next to it — `variant`, `tone`. |
| [variants.tsx](examples/variants.tsx) | Every treatment on every tone — `variant`, `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier, 28 to 48 px high — `size`. |
| [states.tsx](examples/states.tsx) | Disabled and loading next to the default; the spinner keeps the width — `disabled`, `loading`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before or after the label, and a square icon-only button — `Button.Icon`, `aria-label`. |
| [as-child.tsx](examples/as-child.tsx) | The button look on a real link; a disabled link blocks navigation — `asChild`, `disabled`. |
| [in-form.tsx](examples/in-form.tsx) | A full-width submit button that shows the request in progress — `type`, `loading`, `fullWidth`. |

## Mistakes
- `<Button.Root><Icon name="action.copy" /></Button.Root>` → wrap in `Button.Icon` so the button becomes square and the icon is sized.
- Icon-only button without `aria-label` → add `aria-label="Копировать"`.
- `tone="error"` / `variant="primary"` → `tone="danger"`, `variant="solid"`.
- Putting a `<Spinner />` inside a loading button → just set `loading`; the button places it.
- `<a>` inside `<Button.Root>` → use `asChild` so there is one interactive element.
- Submit button without `type="submit"` → the default is `"button"` and will not submit.

## Related
- **Built from:** [Spinner](../spinner/COMPONENT.md)
- **See also:** [ButtonGroup](../button-group/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md)

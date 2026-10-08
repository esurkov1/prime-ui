# Button

**Category:** actions
**Kind:** primitive

> A button for explicit actions, with variants, tones, sizes and a built-in loading state.

## When to use
- Primary, secondary and destructive actions in forms, toolbars, dialogs, cards and empty states.
- Async actions: `loading` shows a spinner, blocks clicks and keeps the width; when it ends, a new label («Сохранено») flows in.
- Long actions with known progress (downloads, exports): `progress` fills the button itself.
- Destructive actions without a dialog: `holdToConfirm` needs a held press.
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
├─ (fill)          progress / hold wash under the label, rendered by Root once used, aria-hidden
├─ (Spinner)       rendered by Root while loading, aria-hidden
├─ (label)         text children; a changed label flows in letter by letter
└─ Button.Icon     decorative icon wrapper (aria-hidden), sized to the tier
(hold hint)        visually hidden description beside the button with holdToConfirm
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Button.Root
`ref` → `HTMLButtonElement`. The `<button>`, or the single child with `asChild`; sets variant, tone and size and passes the tier to nested icons.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost"` | `"solid"` | Visual treatment. |
| `tone` | `"accent" \| "neutral" \| "danger" \| "inherit"` | `"accent"` | Meaning of the action; `danger` for destructive actions. `inherit` takes the host's text color for an action on a colored host (a solid Banner); it needs `variant` `ghost`, `soft` or `outline`. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `host tier, else "m"` | Control tier: height 28 · 32 · 36 · 40 · 48, padding, text, icon, radius. Without it the button takes the tier of its host (LoginForm, Popover, a field, a panel with a size), else `m`. |
| `fullWidth` | `boolean` | — | Stretches to the container width. |
| `loading` | `boolean` | `false` | Shows a `Spinner` in place of the leading icon or over the label, sets `aria-busy`, blocks clicks; width does not change. With `asChild` no spinner is added — the child owns its content. |
| `progress` | `number` | — | Progress of a long action started by the button, `0…1`: a wash of the text color grows inside from the start edge, `aria-busy` is set and the button stays pressable (to cancel). Put the number in the label («Скачивание 42%»); remove the prop when done and the fill fades out. |
| `holdToConfirm` | `boolean` | `false` | The action needs a held press: the fill runs for 1.2 s (a gesture clock, kept under reduced motion) and `onConfirm` fires at its end. Releasing, leaving or losing focus earlier rolls it back. Space and Enter hold too; the gesture is described to assistive tech by `labels.holdHint`. |
| `onConfirm` | `() => void` | — | Fires when a `holdToConfirm` press completes; the action goes here, not in `onClick`. |
| `labels` | `Partial<ButtonLabels>` | — | Built-in strings, see Labels. |
| `asChild` | `boolean` | `false` | Merges Button props and styles onto the single child element instead of rendering `<button>`. `disabled`/`loading` become `aria-disabled`. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type; not forwarded with `asChild`. |
| `disabled` | `boolean` | — | Disabled state; `loading` also disables. |
| `children` | `ReactNode` | — | Label and `Button.Icon`. Only `Button.Icon` children → square icon-only button; give it `aria-label`. A changed text label flows into the new one letter by letter while the width glides; a change of digits only («58 с» → «57 с», «42%» → «43%») stays in place. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size">` | — | `onClick`, `className`, `aria-*`, `data-*` and the other button attributes. |

### Button.Icon
`ref` → `HTMLSpanElement`. Decorative icon wrapper (`aria-hidden`) sized to the button tier.

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
| `ghost` + `inherit` | transparent, the host's text color, a `currentColor` wash on hover / press | close or icon action on a colored host (solid Banner, accent strip) | |
| `soft` + `inherit` | `currentColor` wash fill, the host's text color | a labelled action on a colored host | |
| `outline` + `inherit` | 1px inset line in a `currentColor` wash, the host's text color | an action with an edge on a colored host | |

`tone="inherit"` has no `solid` (the type requires `ghost`, `soft` or `outline`); its focus ring and disabled look also derive from the host's text color, so it reads on any host fill in both themes. Never recolor a Button from its host with a CSS override — use `inherit`.

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
| focus-visible | keyboard | outer focus ring with `--prime-focus-offset`; `tone="inherit"` draws it in `currentColor` |
| disabled | `disabled` | native `disabled`, `data-disabled="true"`, `fill-muted` + `text-disabled`, `cursor: not-allowed`; ghost stays transparent |
| loading | `loading` (native `<button>`) | `data-loading="true"`, native `disabled`, `aria-busy="true"`, colors kept (busy, not unavailable), no hover or press; a `Spinner` (`aria-hidden`) replaces the leading (or only) icon, otherwise it is centered over the hidden label (`data-loading-overlay="true"`) |
| progress | `progress` (0…1) | `data-progress="true"`, `aria-busy="true"`, still pressable; a plate of the text color with the button's radius slides in from the start edge (`fast` · standard), so corners match at any value; removing the prop fades it where it is |
| holding | `holdToConfirm` + a held pointer, `Space` or `Enter` | `data-hold="holding"`: the fill runs linearly for 1.2 s (kept under reduced motion — it is a gesture clock), then `onConfirm` and `data-hold="done"` (on release the fill fades in place, `data-hold="idle"`); releasing earlier → `data-hold="cancel"`, the fill rolls back (`fast` · exit) |
| label change | new text children | the old letters leave upward, the new ones rise from below one short step apart (`base` · emphasized, blur `--prime-motion-blur`) while the width glides; digits-only changes and reduced motion change in place |
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
| `Enter` · `Space` | Presses the button (native `<button>`); with `holdToConfirm` the key is held until the fill completes. |
| `Tab` | Moves focus; a disabled button is skipped, with `asChild` it stays focusable with `aria-disabled`. |

### ARIA
- Native `<button>`, `type="button"` by default, so it never submits a form by accident.
- Icon-only buttons need `aria-label`; `Button.Icon` is `aria-hidden`.
- `loading` sets `aria-busy="true"` and blocks the press; `progress` sets `aria-busy` and keeps the button pressable.
- `holdToConfirm` describes the gesture through `aria-describedby` (`labels.holdHint`); `Space` / `Enter` hold like a pointer.
- A changed label is announced once: the animated letters are hidden, the name is the new text.
- With `asChild` the disabled state is `aria-disabled="true"` without a native `disabled`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `holdHint` | `"Удерживайте, чтобы подтвердить"` | Description of a `holdToConfirm` button for assistive tech (`aria-describedby`). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The primary action with a secondary one next to it — `variant`, `tone`. |
| [variants.tsx](examples/variants.tsx) | Every treatment on every tone — `variant`, `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier, 28 to 48 px high — `size`. |
| [states.tsx](examples/states.tsx) | Disabled and loading next to the default; the spinner keeps the width — `disabled`, `loading`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before or after the label, and a square icon-only button — `Button.Icon`, `aria-label`. |
| [download.tsx](examples/download.tsx) | A long download inside the button: the fill shows how far it got, the label counts and then offers the file — `progress`. |
| [hold-to-confirm.tsx](examples/hold-to-confirm.tsx) | A destructive action that needs a held press; letting go early rolls the fill back and does nothing — `holdToConfirm`, `onConfirm`. |
| [label-morph.tsx](examples/label-morph.tsx) | A new label flows into the button letter by letter while the width glides: save, then saved; a step flow — `children`, `loading`. |
| [on-colored-host.tsx](examples/on-colored-host.tsx) | Actions on a colored strip take its text color: a ghost icon close and a soft action — `tone="inherit"`. |
| [as-child.tsx](examples/as-child.tsx) | The button look on a real link; a disabled link blocks navigation — `asChild`, `disabled`. |
| [in-form.tsx](examples/in-form.tsx) | A full-width submit button that shows the request in progress — `type`, `loading`, `fullWidth`. |

## Mistakes
- `<Button.Root><Icon name="action.copy" /></Button.Root>` → wrap in `Button.Icon` so the button becomes square and the icon is sized.
- Icon-only button without `aria-label` → add `aria-label="Копировать"`.
- `tone="error"` / `variant="primary"` → `tone="danger"`, `variant="solid"`.
- Putting a `<Spinner />` inside a loading button → just set `loading`; the button places it.
- `<a>` inside `<Button.Root>` → use `asChild` so there is one interactive element.
- Submit button without `type="submit"` → the default is `"button"` and will not submit.
- A destructive `holdToConfirm` action in `onClick` → it fires on any click; put it in `onConfirm`.
- Rebuilding a progress label with a new word every tick («Загрузка…» / «Скачивание…») → keep the words, change only the number; digits update in place, words morph.

## Related
- **Built from:** [Spinner](../spinner/COMPONENT.md)
- **See also:** [ButtonGroup](../button-group/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md)

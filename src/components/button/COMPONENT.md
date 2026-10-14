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
- Round icon actions — the disk is the control (play, download, cancel or retry of a transfer, a floating main action): `shape="circle"`; over a picture or a video, `variant="shade"`. A transfer it can cancel shows its share as the circle's `progress` ring.
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
├─ (ring)          a circle's progress ring along its inner edge (internal/ring), once used, aria-hidden
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
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost" \| "shade"` | `"solid"` | Visual treatment: fill, soft fill, line or transparent. `shade` — the media shade with a light glyph for a button over a picture or video; with `tone="danger"` — the error disk. |
| `shape` | `"square" \| "circle"` | `"square"` | Outline. `circle` — a disk as wide as it is tall, with only a `Button.Icon` inside; same tiers, tones and variants. Requires `aria-label`. |
| `tone` | `"accent" \| "neutral" \| "success" \| "danger" \| "inherit"` | `"accent"` | Meaning: primary, secondary, done (`success`) or destructive (`danger`). `inherit` takes the host's text color for an action on a colored host; only with `ghost`, `soft` or `outline`. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Control tier: height 28 · 32 · 36 · 40 · 48, padding, text, icon, radius. Without it the button takes the tier of its host (LoginForm, Popover, a field, a panel with a size), else `m`. |
| `fullWidth` | `boolean` | — | Stretches to the container width. |
| `loading` | `boolean` | `false` | Shows a `Spinner` in place of the leading icon or over the label, sets `aria-busy`, blocks clicks; width does not change. With `asChild` no spinner is added — the child owns its content. |
| `pressed` | `boolean` | — | A toggle button: `true` on, `false` off (`aria-pressed`). On takes the selected look, an accent soft fill that glides in and out. Leave it out for an ordinary action; a set of toggles is a ButtonGroup. |
| `progress` | `number \| null` | — | Progress of a long action, `0…1`; `null` — the share is unknown. Sets `aria-busy`, stays pressable (to cancel); a square fills from the start edge, a circle draws a ring. Remove the prop when done. |
| `holdToConfirm` | `boolean` | `false` | The action needs a held press (pointer, `Space` or `Enter`): the fill runs for 1.2 s, then `onConfirm` fires; releasing earlier rolls it back. |
| `onConfirm` | `() => void \| Promise<void>` | — | Fires when a `holdToConfirm` press completes; the action goes here, not in `onClick`. Return the request's promise to keep the button `loading` until it settles. |
| `labels` | `Partial<ButtonLabels>` | — | Built-in strings, see Labels. |
| `asChild` | `boolean` | `false` | Merges Button props and styles onto the single child element instead of rendering `<button>`. `disabled`/`loading` become `aria-disabled`. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type; not forwarded with `asChild`. |
| `disabled` | `boolean` | — | Disabled state; `loading` also disables. |
| `children` | `ReactNode` | — | Label and `Button.Icon`. Only `Button.Icon` children → a square icon-only button that needs `aria-label`. A changed label morphs letter by letter. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size">` | — | `onClick`, `className`, `aria-*`, `data-*` and the other button attributes. |

### Button.Icon
`ref` → `HTMLSpanElement`. Decorative icon wrapper (`aria-hidden`) sized to the button tier.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="action.copy" />`; `Icon` without `size` takes the button tier. A new icon (another `name`) cross-fades in and plays its gesture once (`fast`). |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

## Variants

### variant × tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `solid` + `accent` | accent fill, accent-fg text, hover `accent-hover` | the one primary action of an area (Save, Publish) | yes |
| `solid` + `neutral` | `fill-muted` fill, primary text | a neutral filled action next to fields | |
| `solid` + `danger` | danger fill, danger-fg text | confirming a destructive action in a dialog | |
| `solid` + `success` | success fill, success-fg text; a button turning success glides its fill over `fast` | an action that is done: «Оплачено», «Отправлено» | |
| `soft` + `accent` | `accent-soft` fill, accent text | secondary but highlighted action | |
| `soft` + `neutral` | translucent `fill-subtle` wash, primary text | secondary actions (Cancel, Filters) | |
| `soft` + `danger` | `danger-soft` fill, danger text | secondary destructive action | |
| `soft` / `outline` / `ghost` + `success` | `success-soft` fill or wash, success text | a quieter done state next to other actions | |
| `outline` + `accent` | transparent, 1px `border-default` inset line, accent text | rare; accent action lighter than solid | |
| `outline` + `neutral` | transparent, 1px inset line, primary text | secondary action that needs an edge (Draft, Back) | |
| `outline` + `danger` | 1px inset line, danger text, `danger-soft` on hover | destructive trigger that opens a confirm | |
| `ghost` + `accent` | transparent, accent text, `fill-subtle` on hover | tertiary accent action in text-heavy areas | |
| `ghost` + `neutral` | transparent, secondary text → primary on hover | toolbar buttons, icon-only buttons | |
| `ghost` + `danger` | transparent, danger text, `danger-soft` on hover | destructive action set apart in a footer | |
| `ghost` + `inherit` | transparent, the host's text color, a `currentColor` wash on hover / press | close or icon action on a colored host (solid Banner, accent strip) | |
| `soft` + `inherit` | `currentColor` wash fill, the host's text color | a labelled action on a colored host | |
| `outline` + `inherit` | 1px inset line in a `currentColor` wash, the host's text color | an action with an edge on a colored host | |
| `shade` (+ `accent` / `neutral` / `success`) | the media disk ground (`--prime-color-media-disk`, lighter than the pills' `media-shade`) under a gentle backdrop blur (`--prime-media-disk-blur`), so the frame shows through, and its light glyph (≥ 3:1 even over a white frame); the same in both themes and the same look as the still play mark of a video frame | a button over a picture, a video or a video circle (edit a cover, cancel an upload) | |
| `shade` + `danger` | the danger fill, danger-fg glyph | a failed transfer over media: the retry | |

`tone="inherit"` has no `solid` (the type requires `ghost`, `soft` or `outline`); its focus ring and disabled look also derive from the host's text color, so it reads on any host fill in both themes. Never recolor a Button from its host with a CSS override — use `inherit`.

`outline` is the only variant with a visible line. With `aria-current="page"` (usually via `asChild` on a router link), `ghost`/`soft` show the `fill-subtle-active` selected look; soft accent keeps its own accent look, so a current item can be marked with accent explicitly (Pagination).

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px high, 12/16 text, padX 8, icon 14 | dense tables and chip rows | |
| `s` | 32px, 13/20, padX 12, icon 16 | compact toolbars, filters | |
| `m` | 36px, 14/20, padX 16, icon 16 | default UI | yes (without `size`: the host's tier, else `m`) |
| `l` | 40px, 16/24, padX 20, icon 20 | prominent forms | |
| `xl` | 48px, 16/24, padX 24, icon 20 | hero CTA, mobile footers | |

A Button lines up exactly with Input, Select, Datepicker trigger, SegmentedControl and Tabs of the same `size`. The icon side gets optical padding `padX − 4px` (never below 8px); icon→label gap is the tier gap.

### shape
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `square` | the tier's radius; with only `Button.Icon`, a square | every labelled button, toolbar icon buttons | yes |
| `circle` | a disk: width = the tier height, full radius; the focus ring, the touch area and the press (`press-scale-compact`, 0.96) follow the circle; `progress` draws a ring along the inner edge in the glyph's color | play / download / cancel / retry disks, a floating main action; only `Button.Icon` inside, `aria-label` required | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | button fills the row | narrow forms, cards, mobile footers | off |
| icon-only (children are only `Button.Icon`) | square, width = height | toolbars; needs `aria-label` | — |
| `pressed` | on: accent soft fill and accent text over any variant; off: the variant's own look | a single toggle (favourite, pin, «show archived») | — (not a toggle) |

**Hierarchy:** one primary (`solid accent`) per area, the rest neutral `soft`/`outline`/`ghost`; a destructive action is `tone="danger"` and sits apart (start of the footer). Avoid two `solid accent` buttons side by side and `tone="danger"` for non-destructive actions.

## States
| State | Driven by | DOM |
|---|---|---|
| hover / active | pointer | hover fill per variant; active `scale(var(--prime-motion-press-scale))` |
| focus-visible | keyboard | outer focus ring with `--prime-focus-offset`; `tone="inherit"` draws it in `currentColor` |
| disabled | `disabled`, or a disabled `Fieldset` around it | native `disabled`, `data-disabled="true"`, `fill-muted` + `text-disabled`, `cursor: not-allowed`; ghost stays transparent |
| loading | `loading` (native `<button>`) | `data-loading="true"`, native `disabled`, `aria-busy="true"`, colors kept (busy, not unavailable), no hover or press; a `Spinner` (`aria-hidden`) replaces the leading (or only) icon, otherwise it is centered over the hidden label (`data-loading-overlay="true"`) |
| progress | `progress` (0…1) | `data-progress="true"`, `aria-busy="true"`, still pressable; a plate of the text color with the button's radius slides in from the start edge (`fast` · standard), so corners match at any value; removing the prop fades it where it is |
| progress unknown (square) | `progress={null}` | `data-spinner="true"`, `aria-busy="true"`, still pressable; a `Spinner` takes the leading icon's place as with `loading` |
| progress (circle) | `shape="circle"` + `progress` (0…1 or `null`) | `aria-busy="true"`, still pressable; the kit ring at the line weight along the inner edge, arc in the glyph's color over a 32% track, always turning (3 × `--prime-motion-loop` a turn, slower but never still under reduced motion; never under 8%; `null` a quarter arc); the share glides (`base`); removing the prop fades the ring where it is (`data-shown="false"`, its turn paused) |
| glyph change | a new icon in `Button.Icon` (another `name`) | the old glyph shrinks to 0.6 and fades, the new one grows in (`fast`) and plays its gesture once; reduced motion swaps at once |
| holding | `holdToConfirm` + a held pointer, `Space` or `Enter` | `data-hold="holding"`: the fill runs linearly for 1.2 s (kept under reduced motion — it is a gesture clock), then `onConfirm` and `data-hold="done"` (on release the fill fades in place, `data-hold="idle"`); releasing, leaving the button or losing focus earlier → `data-hold="cancel"`, the fill rolls back (`fast` · exit) |
| confirming | `onConfirm` returned a pending promise | `data-hold="confirming"`: the full fill stays, the button is `loading` (spinner, `aria-busy`, disabled) even after the release; resolve → `data-hold="idle"`, the fill fades; reject → `data-hold="cancel"`, the fill rolls back (say why with a notification) |
| label change | new text children | the old letters leave upward, the new ones rise from below one short step apart (`base` · emphasized, blur `--prime-motion-blur`) while the width glides; digits-only changes and reduced motion change in place |
| pressed | `pressed` | `aria-pressed="true" \| "false"`; on adds `data-pressed="true"` and the selected fill (accent soft), which glides in and out with the color transition (`fast`) |
| asChild disabled / loading | `asChild` + `disabled`/`loading` | `aria-disabled="true"`, `pointer-events: none`, click `preventDefault`; no native `disabled`, no automatic spinner |

Other data attributes: `data-pressed`, `data-variant`, `data-tone`, `data-size`, `data-shape`, `data-full-width`, `data-icon-only`, `data-leading-icon`, `data-trailing-icon`.

## Layout & spacing
- Buttons in a row: `gap: var(--prime-space-2)`–`var(--prime-space-3)`; toolbar icon buttons `var(--prime-space-1)`.
- Form footer: actions right-aligned, primary last; below 480px stack full width (`fullWidth` or a column flex).
- `max-width: 100%`, the label does not wrap (`white-space: nowrap`).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Space` | Presses the button (native `<button>`); with `holdToConfirm` the key is held until the fill completes. |
| `Tab` | Moves focus; a disabled button is skipped, with `asChild` it stays focusable with `aria-disabled`. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Native `<button>`, `type="button"` by default, so it never submits a form by accident.
- Icon-only buttons need `aria-label`; `Button.Icon` is `aria-hidden`.
- `progress` is visual only: put the share in the label or in `aria-describedby` («Скачивание 42%»).
- `shape="circle"` requires `aria-label`; its `progress` ring is `aria-hidden`, the share goes in the label or description («Отменить отправку», described by «Отправка 45%»).
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
| [circle.tsx](examples/circle.tsx) | Round icon buttons in every treatment, and a disk whose ring tracks an export it can cancel — `shape`, `variant`, `tone`, `progress`. |
| [over-media.tsx](examples/over-media.tsx) | Buttons over a listing's cover stand on the media shade; a failed upload turns its disk danger — `variant`, `shape`, `tone`. |
| [toggle.tsx](examples/toggle.tsx) | A toggle in a toolbar: the favourite mark turns the button on with the selected fill and back off — `pressed`. |
| [hold-to-confirm.tsx](examples/hold-to-confirm.tsx) | A destructive action that needs a held press; letting go early rolls the fill back and does nothing, and the delete request keeps the button loading until the server answers — `holdToConfirm`, `onConfirm`. |
| [label-morph.tsx](examples/label-morph.tsx) | A new label flows into the button letter by letter while the width glides: save, then saved; a step flow that turns green once paid — `children`, `loading`, `tone`. |
| [on-colored-host.tsx](examples/on-colored-host.tsx) | Actions on a colored strip take its text color: a ghost icon close and a soft action — `tone="inherit"`. |
| [as-child.tsx](examples/as-child.tsx) | The button look on a real link; a disabled link blocks navigation — `asChild`, `disabled`. |
| [in-form.tsx](examples/in-form.tsx) | A full-width submit button that shows the request in progress after the email passes validation — `type`, `loading`, `fullWidth`. |

## Mistakes
- `<Button.Root><Icon name="action.copy" /></Button.Root>` → wrap in `Button.Icon` so the button becomes square and the icon is sized.
- Icon-only button without `aria-label` → add `aria-label="Копировать"`.
- `tone="error"` / `variant="primary"` → `tone="danger"`, `variant="solid"`.
- A toggle drawn by switching `variant` or `tone` → `pressed`: it sets `aria-pressed` and the selected look; changing the label instead («Закрепить» / «Открепить») is a plain action, without `pressed`.
- Putting a `<Spinner />` inside a loading button → just set `loading`; the button places it.
- `<a>` inside `<Button.Root>` → use `asChild` so there is one interactive element.
- Submit button without `type="submit"` → the default is `"button"` and will not submit.
- A destructive `holdToConfirm` action in `onClick` → it fires on any click; put it in `onConfirm`.
- A round disk drawn by hand (`border-radius: 50%` on a `<button>`, an own ring around it) → `shape="circle"`, with `progress` for the ring.
- A disk over media recolored with a dark CSS fill → `variant="shade"`.
- Rebuilding a progress label with a new word every tick («Загрузка…» / «Скачивание…») → keep the words, change only the number; digits update in place, words morph.

## Related
- **Built from:** [Spinner](../spinner/COMPONENT.md), `internal/ring` (the circle's progress ring), `internal/glyphSwap` (the icon cross-fade), `internal/MorphText` (the label morph)
- **See also:** [ButtonGroup](../button-group/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [ProgressCircle](../progress-circle/COMPONENT.md)

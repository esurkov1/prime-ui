# Input

**Category:** inputs
**Kind:** field

> Single-line text field with label, hint, error and slots for icons, affixes, a clear button and a counter.

## When to use
- Any single-line value: name, e-mail, phone, search query, amount, URL, code.
- Search fields with a leading icon and a clear button.
- Values with a fixed prefix/suffix (`https://`, domain, `₽`, `%`).
- Inline editing in a record card: each field saves itself (`onCommit`) on blur and Enter.
- A value with actions beside it: copy, write, open a profile (`Input.CopyButton`, `Input.Action`); a password with a show toggle (`Input.RevealButton`).
- Free text with suggestions (a combobox): a place, a city, a tag the team typed before — `suggestions`; any other text stays allowed.
- A picker and a text as one field (an icon and a name, a channel and an address): a `Select` inside `Input.Wrapper` is the box's start segment.
- A time of day: `Input.Field type="time"` — the browser's hour and minute segments (arrows step them, `step`, `min`, `max`), a wheel on phones, and no calendar to open.
- As the reference field: Select, Datepicker, TagSelect and Textarea follow the same label / field / support-row contract.

## When not to use
- Multi-line text → use [Textarea](../textarea/COMPONENT.md).
- One-time codes split into cells → use [DigitInput](../digit-input/COMPONENT.md).
- Choosing from a fixed list, where the value must be one of it → use [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md); `suggestions` only help typing free text.
- Dates → use [Datepicker](../datepicker/COMPONENT.md).
- A standalone label or message without an Input field → use [Label](../label/COMPONENT.md) / [Hint](../hint/COMPONENT.md).
- Global search across the app in a dialog → use [CommandMenu](../command-menu/COMPONENT.md).

## Import
```tsx
import { Input } from "prime-ui-kit";
```

## Anatomy
```
Input.Root            label row, field body, support row; provides size / invalid / ids
└─ Input.Wrapper      the visible field (fill, hover, focus ring, invalid ring)
   ├─ Input.Affix          tinted section flush with the edge (start | end)
   ├─ Input.Icon           decorative icon (start | end)
   ├─ Input.InlineAffix    muted text next to the value (start | end)
   ├─ Select.Root          optional start segment: an icon-only picker in the box (no frame)
   ├─ Input.Field          native <input>; a combobox with `suggestions`
   ├─ Input.ClearButton    clear segment (kit-rendered)
   ├─ Input.CopyButton     copy segment; the glyph morphs into a check (kit-rendered)
   ├─ Input.RevealButton   show / hide a password segment, aria-pressed (kit-rendered)
   └─ Input.Action         the consumer's named icon action with a tooltip (button or asChild link)
listbox               `suggestions`: a floating list under the box, as wide as it
Input.Counter         goes into Input.Root `counter` (support row, right side)
```
The trailing side has a fixed CSS `order`, independent of JSX order: value · end inline affix · commit status (`onCommit`) · end icon · segments · end affix. The segments (`ClearButton`, `CopyButton`, `RevealButton`, `Action`) keep their JSX order among themselves and sit edge to edge, full field height, flush with the end edge. A `Select` segment comes first, flush with the start edge. All `side="start"` slots share one order before the value, so among them the JSX order decides — write them as affix, icon, inline affix.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Input.Root
`ref` → `HTMLDivElement` (the field frame). Size, label, support row and the context for `Wrapper` and `Field`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier for height, padding, radius, text, label and hint. Without it the field takes the tier of its host (LoginForm, Popover, a panel with a size), else `m`. Also provided to nested controls via the control-size context. |
| `label` | `ReactNode` | — | Label above the field, rendered as `<label htmlFor>`. Without it, give `Input.Field` an `aria-label`. |
| `required` | `boolean` | `false` | Red `*` after the label (`aria-hidden`) and native `required` on `Input.Field`. |
| `optional` | `boolean` | `false` | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the field. Hidden while `error` is shown. |
| `hintTone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Status color of `hint` («Осталось 12 дней» in `warning`). The words carry the status, the color repeats it; an `error` replaces the hint and its tone. A validation error is `error`, never a `danger` hint. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | `false` | Danger inset ring on the field, `aria-invalid` on the input. A non-empty `error` implies it. |
| `valid` | `boolean` | — | A confirmed value (a matching repeat, a verified code): a success ring and a drawn check at the field's end, `labels.valid` spoken. `invalid` wins. Pass `false` too: the live region exists only with it. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring on `Input.Wrapper` (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay. |
| `counter` | `ReactNode` | — | Right side of the support row, usually `<Input.Counter current max />`. |
| `reserveSupportRow` | `boolean` | `false` | Always render the support row (min height = hint line height), so an appearing error does not shift the layout. |
| `id` | `string` | — | Id of the `<input>` (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`. |
| `strength` | `boolean` | `false` | A password strength meter for new-password fields: a stepped `ProgressBar` under the field and the level word (weak … hard) in the support row. Follows the value of `Input.Field`. |
| `getStrength` | `(value: string) => 0 \| 1 \| 2 \| 3 \| 4` | `getPasswordStrength` | Replaces the kit's estimate of `strength`. Return 0 for empty, 1 weak … 4 hard. |
| `minStrength` | `1 \| 2 \| 3 \| 4` | — | The policy of `strength`: below this level the meter turns danger and the form refuses to submit (`setCustomValidity`), then shows `labels.strengthTooWeak` as the error. |
| `onCommit` | `(value: string) => void \| Promise<void>` | — | Inline save: fires with a changed value on blur and Enter; Escape reverts. Return a Promise: the field shows a spinner and stays editable; a rejection restores the value — show why through `error`. |
| `suggestions` | `readonly string[]` | — | Suggestions for free text (a combobox): a list under the box shows those containing the text; a pick goes into the field as typing would. Any text stays allowed; a value from a list only is `Select`. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the `suggestions` list; the text and the focus stay in the field. |
| `closeOnOutsideClick` | `boolean` | `true` | A press outside the field and the `suggestions` list closes the list. |
| `labels` | `Partial<InputLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | Usually `Input.Wrapper`. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

### Input.Wrapper
`ref` → `HTMLDivElement`. The visible field: fill, hover, focus ring, invalid ring; `data-size` and `data-invalid` come from the root.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | `Field` and the slots: `Icon`, `Affix`, `InlineAffix`; the end segments `ClearButton`, `CopyButton`, `RevealButton`, `Action` in source order. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the `<div>`. |

### Input.Field
`ref` → `HTMLInputElement`. The native `<input>`; `id`, `aria-invalid` and `aria-describedby` come from the root, `disabled` also from a disabled `Fieldset` around it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onValueChange` | `(value: string) => void` | — | Called with the new string; native `onChange` still fires first. |
| `aria-describedby` | `string` | — | Merged with the affix and hint/error ids from the root. |
| `required` | `boolean` | — | Overrides the root's `required` for the native input. |
| `autoComplete` | `string` | `"off"` with the password-manager opt-outs; inside `LoginForm.Form`, left to the browser | A token opts in to autofill and drops the password-manager opt-outs; without one the field stays off. Pass one only on sign-in and sign-up fields and for a new password (`new-password`). |
| `…rest` | `Omit<InputHTMLAttributes<HTMLInputElement>, "size" \| "id">` | — | `value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`, `placeholder`… |

### Input.Icon
`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`), centered between the edge and the text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"start" \| "end"` | — (required) | Side of the value. |
| `children` | `ReactNode` | — (required) | An icon; kit icons without an explicit `size` take the field tier. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the `<span>`. |

### Input.Affix
`ref` → `HTMLDivElement`. Tinted section flush with the edge (`aria-hidden`, its text describes the input); the wrapper drops its padding there.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"start" \| "end"` | — (required) | Edge the section sits on. |
| `children` | `ReactNode` | — (required) | Static text: protocol, domain, country code. |
| `aria-label` | `string` | — | What a screen reader says instead of the text in the input's description. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the `<div>`. |

### Input.InlineAffix
`ref` → `HTMLSpanElement`. Muted unit next to the value (`aria-hidden`, its text describes the input) — the one place of the unit.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"start" \| "end"` | — (required) | Side of the value. |
| `children` | `ReactNode` | — (required) | Short unit: `₽`, `%`, `кг`. |
| `aria-label` | `string` | — | The unit in words for a screen reader («рублей»), said instead of the sign in the input's description. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the `<span>`. |

### Input.ClearButton
`ref` → `HTMLButtonElement`. A full-height clear segment at the end edge, named by `labels.clear`, with `aria-controls` on the input. Render it only while the field has a value.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | — | Clear the value here. Afterwards focus returns to the input unless `event.preventDefault()` was called. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children" \| "aria-label">` | — | The other button attributes. |

### Input.CopyButton
`ref` → `HTMLButtonElement`. Copies the field's value as a full-height segment at the end edge: the copy glyph morphs into a check, the name and tooltip switch to `labels.copied` (`labels.copyError` when the clipboard refuses), a polite live region repeats it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | the field's value | Text to copy instead of the field's current value. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children" \| "aria-label">` | — | `onClick`, `disabled` and the other button attributes. |

### Input.RevealButton
`ref` → `HTMLButtonElement`. A full-height toggle segment that shows a `type="password"` field as text and back (`aria-pressed`, named by `labels.reveal`); the focus, caret and selection stay in the field.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children" \| "aria-label" \| "aria-pressed">` | — | The other button attributes. |

### Input.Action
`ref` → `HTMLButtonElement` (the child with `asChild`). The consumer's icon action at the end edge («Позвонить», «Открыть профиль»): a full-height button segment named by `label`, with a tooltip and the touch hit area.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — (required) | Accessible name and tooltip («Позвонить», «Открыть профиль»). |
| `asChild` | `boolean` | `false` | Renders the one child (an `<a href>`, a router link) with the segment's look; `disabled` becomes `aria-disabled`. |
| `children` | `ReactNode` | — (required) | The glyph (`<Icon name>`), or with `asChild` the element that carries it. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" \| "children">` | — | `onClick`, `disabled` and the other button attributes. |

### Input.Counter
`ref` → `HTMLSpanElement`. Character counter for the support row; shows `14/40` and announces `labels.counter`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `number` | — (required) | Current length. |
| `max` | `number` | — (required) | Limit; `current > max` turns the counter danger (`data-invalid="true"`). |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the `<span>`. |

## Variants
Input has no `variant` or `tone`: there is one field treatment (fill, no visible border).

### size (Input.Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 high, text 12/16, padX 8, radius 6, label 12/16, hint 12/16 | Dense table toolbars, inline filters | |
| `s` | 32 high, text 13/20, padX 8, radius 8, label 12/16, hint 12/16 | Compact panels, side filters | |
| `m` | 36 high, text 14/20, padX 12, radius 8, label 13/20, hint 12/16 | Regular forms and pages | yes (without `size`: the host's tier, else `m`) |
| `l` | 40 high, text 16/24, padX 12, radius 10, label 14/20, hint 13/20 | Spacious forms, onboarding | |
| `xl` | 48 high, text 16/24, padX 16, radius 12, label 14/20, hint 13/20 | Hero search, landing forms | |

**Sizes:** a field of size T lines up with Button, Select, Datepicker trigger, SegmentedControl and Tabs of size T in one row (same height and radius). Label and hint always use the same tier as the field.

### side (Input.Icon / Input.Affix / Input.InlineAffix)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | Before the value. Icon: muted, centered between edge and text (edge → icon = icon → text = field padX). Affix: tinted `fill-subtle` section flush with the edge. Inline affix: muted text before the value | Search icon, `https://`, currency sign before the number | — (required) |
| `end` | After the value. Same treatments at the trailing side; numeric fields with an end inline affix align the value to the end | Lock icon on read-only, domain suffix, units `₽ % кг` | — |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `focusRing` | `false`: no focus ring; the field still switches to the focus fill, caret visible | A single search field where focus is obvious | `true` |
| `reserveSupportRow` | Empty support row of hint height under the field | Fields validated on the fly; neighbouring fields in one grid row | `false` |
| `closeOnOutsideClick` | `false`: a press beside the field keeps the `suggestions` list open | The person copies the value from elsewhere on the page | `true` |
| `closeOnEscape` | `false`: Escape leaves the `suggestions` list open | Rare: the list closes only by a pick, Tab or blur | `true` |
| `required` / `optional` | Red `*` / muted «необязательно» after the label | Mark the minority: required when most are optional, optional when most are required | `false` |

**Combinations**
- Recommended: `Input.Icon side="start"` + `Input.ClearButton` for search; `Input.Affix` on both sides for URLs; `Input.InlineAffix side="end"` with `inputMode="decimal"` for amounts.
- Allowed but rare: an end icon together with the clear button (the icon sits before the button).
- Pointless: `required` and `optional` together; `hint` and `error` together (the error replaces the hint); `invalid` without any message in a form where the user needs to know what is wrong.
- Forbidden: `focusRing={false}` on regular form fields (WCAG 2.4.7).

**Hierarchy:** keep one size for all fields of a form; mark required/optional consistently; a status of the value goes into the hint, not into the field — except a confirmed value (`valid`: a repeated password that matches, a verified email or code), which is a check mark in the field, never a «совпадает» text.

## States
| State | Driven by | DOM |
|---|---|---|
| default / hover | — | hover darkens the fill (not when disabled, read-only or focused) |
| focus | keyboard focus on the input | wrapper gets the focus fill and an inset focus ring (`:has(input:focus-visible)`) |
| no focus ring | `focusRing={false}` | `data-focus-ring="false"` on the wrapper |
| invalid | `invalid` or non-empty `error` | `data-invalid="true"` on root and wrapper, `aria-invalid="true"` on the input, danger inset ring, danger focus ring; the control shakes once when an error arrives (`data-shake` on the frame) |
| valid | `valid` (and not invalid: `invalid` or `error` wins) | `data-valid="true"` on the wrapper, a success inset ring; a check (`aria-hidden`) at the end of the field before the end icon and segments pops in and draws its stroke when the value becomes valid, and closes up in place when it goes; a polite live region says `labels.valid` and is in the input's `aria-describedby` while valid |
| disabled | native `disabled` on `Input.Field`, or a disabled `Fieldset` around it | disabled fill, disabled text and icons, `cursor: not-allowed`, clear button disabled look |
| read-only | native `readOnly` on `Input.Field` | no hover, default cursor |
| reserved support row | `reserveSupportRow` | `data-reserve="true"` on the support row |
| counter over limit | `current > max` | `data-invalid="true"` on `Input.Counter`; the current count rolls its digits to each new value |
| suggesting | `suggestions` + typing, ↓ / ↑ or a click in the field | `role="combobox"`, `aria-expanded="true"` and `aria-controls` on the input; the list fades in under the box (the floating panel's motion) with the matching part of each suggestion marked; the highlight is a fill (`data-highlighted`, `aria-selected`) named by `aria-activedescendant`; closes on a pick, Escape, Tab, blur or a press outside |
| select segment | a `Select` inside `Input.Wrapper` | `data-field-segment` on the select root, `data-segment="true"` on its trigger: a tinted section (`fill-subtle`) flush with the start edge, a stronger fill on hover and while open, its own inset focus ring; the box's ring stays for the text |
| strength | `strength` + the value of `Input.Field` | a stepped `ProgressBar` (4 cells, `aria-label` = `labels.strength`) under the field fills one cell after another, weak · easy · medium · hard, toned danger → warning → accent → success; the level word at the end of the support row flows in letter by letter and is announced (`aria-live`); the support row is reserved |
| below the policy | `strength` + `minStrength` above the level of a non-empty value | the meter and the level word turn danger; `setCustomValidity(labels.strengthTooWeak)` on the input, so the form refuses to submit; after a refused submit the same text is the field's `error` (`aria-invalid`) until the level reaches `minStrength` |
| saving | `onCommit` returned a pending Promise | `aria-busy="true"` on the input; a `Spinner` at the end of the field (`data-commit="pending"`); the field stays editable and focusable, neighbours are untouched; a live region says `labels.saving` |
| saved | the Promise resolved (or `onCommit` returned nothing) | the spinner cross-fades into a success check (`data-commit="saved"`) that fades out after a moment; the live region says `labels.saved` |
| save refused | the Promise rejected | the committed value is put back (unless the person typed on), the status leaves; the owner shows why through `error` |
| password shown | `Input.RevealButton` pressed | `aria-pressed="true"` on the button, `type="text"` on the input, the eye glyph switches to eye-off; caret and selection kept |
| copied | `Input.CopyButton` pressed | the copy glyph cross-fades into a check, the button name becomes `labels.copied` (or `labels.copyError`) |

Size: `data-size` on root and wrapper. Slots: `data-side="start" | "end"`. Segments: `data-field-action`.

Inline save (`onCommit`): the value at focus is the committed one. Blur and Enter commit a changed value (an unchanged one never fires); Escape puts the committed value back through the field's own `onChange`, so a controlled owner receives it, and is consumed — it does not also close the drawer around the field. Return a Promise for a server save: pending shows a spinner, reject restores the value, resolve shows the check.

Strength estimate (`strength`, replaced by `getStrength`): every trait adds a point on its own, in any order — lowercase, uppercase, digits, symbols, 10+ and 14+ characters; 0–2 points weak, 3 easy, 4 medium, 5+ hard, and under 8 characters at most easy. The meter follows `Input.Field` controlled or not.

Strength policy (`minStrength`): a non-empty value below the level is invalid for the form (native constraint validation, `labels.strengthTooWeak`), so a submit stops at the field and its error appears; an empty value is left to `required`. The meter tells the person typing; the server still decides what it accepts.

Suggestions (`suggestions`): the list shows the suggestions that contain the typed text (case-insensitive), and nothing when the text already is the only match. A pick writes the suggestion into the input the way typing does, so `onValueChange` (and `onCommit` on blur) receive it; the text is never restricted to the list.

Controlled: `value` + `onChange` (or `onValueChange`) on `Input.Field`. Uncontrolled: `defaultValue`. Both are native input props.

## Layout & spacing
- Label → field gap: tier `label-gap` (`--prime-space-1` on xs/s, `--prime-space-2` on m–xl). Field → support row: `--prime-space-1`.
- Fields of a form stack in a label-less [Fieldset](../fieldset/COMPONENT.md) (20 apart); the form around the groups spaces them from its actions (32).
- `Input.Root` is `width: 100%` and `min-width: 0`; there is no `fullWidth` prop — the width comes from the parent (grid column, flex item, capped wrapper).
- Use `reserveSupportRow` on fields that share a grid row so their bottoms stay aligned when only one shows an error.
- The value truncates with an ellipsis before icons and affixes; the field height never changes.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Focuses the field, then the segments at its end (clear, copy, reveal, actions). |
| `Enter` · `Space` | On a segment: runs its action (the clear button returns focus to the field). |
| `Enter` | With `onCommit`: saves a changed value; focus stays in the field. |
| `↓` · `↑` | With `suggestions`: opens the list on the first (last) suggestion; in the open list moves the highlight, wrapping. Focus stays in the field. |
| `Alt + ↓` | With `suggestions`: opens the list without highlighting. |
| `Enter` | With `suggestions`: puts the highlighted suggestion into the field and closes the list; with no highlight the typed text stays. |
| `Escape` | With `suggestions`: closes the open list, the text stays; a dialog around the field stays open. |
| `Escape` | With `onCommit`: puts the committed value back. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `label` renders a `<label htmlFor>` bound to the input. Without `label`, set `aria-label` on `Input.Field`. A placeholder never replaces the label.
- Hint and error are linked through `aria-describedby`; the error replaces the hint and sets `aria-invalid="true"`.
- `valid` adds the id of a polite live region holding `labels.valid` to the input's `aria-describedby`: the state is heard when it arrives and on focus, never by colour alone; the check is `aria-hidden`.
- `minStrength` uses native constraint validation: below the level the input's `validationMessage` is `labels.strengthTooWeak`, the form refuses to submit, and the message becomes the field's error (`aria-invalid`).
- `Input.Icon` is decorative (`aria-hidden`). `Input.Affix` and `Input.InlineAffix` are `aria-hidden` in the reading order but describe the input (`aria-describedby`, before the hint): the unit is heard with the field, so the label never repeats it. An `aria-label` on the affix is said instead of its text («рублей» for `₽`).
- `suggestions` make the input a `combobox` (`aria-autocomplete="list"`, `aria-expanded`, `aria-controls` on the open `listbox`, which the label names); the highlight is `aria-activedescendant`, so focus never leaves the field.
- Autofill is off unless you pass `autoComplete`: without a token the input carries `autocomplete="off"` and the opt-outs of 1Password, LastPass, Bitwarden and Dashlane (`data-1p-ignore`, `data-lpignore`, `data-bwignore`, `data-form-type="other"`); a token passes through and drops them. With `suggestions` it stays off. Inside `LoginForm.Form` a field without a token is left to the browser.
- A `Select` inside `Input.Wrapper` is the box's start segment: its trigger is named by the select root's `aria-label` and the picked value («Иконка: Звезда»).
- `Input.ClearButton` is a real button named by `labels.clear`, with `aria-controls` on the input.
- `Input.Action` and `Input.CopyButton` are buttons (or a link with `asChild`) named by their label, with a tooltip; copying announces `labels.copied` through a polite live region.
- `Input.RevealButton` is a toggle: a constant name `labels.reveal`, `aria-pressed` and `aria-controls` on the input; a pointer press keeps the focus in the field.
- With `onCommit` the input carries `aria-busy="true"` while saving; a polite live region says `labels.saving`, then `labels.saved`.
- `Input.Counter` shows `14/40` visually and announces `labels.counter` through `aria-live="polite"`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the label when `optional`. |
| `clear` | `"Очистить"` | Accessible name of `Input.ClearButton`. |
| `copy` | `"Копировать"` | Name and tooltip of the copy button. |
| `copied` | `"Скопировано"` | Name, tooltip and announcement once the value is copied. |
| `copyError` | `"Не удалось скопировать"` | Name, tooltip and announcement when the clipboard refuses. |
| `reveal` | `"Показать пароль"` | Accessible name of `Input.RevealButton`;`aria-pressed` says whether the password is shown. |
| `saving` | `"Сохранение"` | Announced while an `onCommit` save is pending. |
| `saved` | `"Сохранено"` | Announced once an `onCommit` save succeeds. |
| `counter` | `"{current} из {max} символов"` | Screen-reader text of `Input.Counter`; `{current}` and `{max}` are replaced. |
| `strength` | `"Надёжность пароля"` | Accessible name of the `strength` meter and the spoken prefix of the level word. |
| `strengthWeak` | `"Слабый"` | Level word for strength 1. |
| `strengthEasy` | `"Лёгкий"` | Level word for strength 2. |
| `strengthMedium` | `"Средний"` | Level word for strength 3. |
| `strengthHard` | `"Сложный"` | Level word for strength 4. |
| `strengthTooWeak` | `"Пароль недостаточно надёжный"` | Validation message of a `strength` field below `minStrength`, and its error once a submit was refused. |
| `valid` | `"Значение подходит"` | Spoken when the field is `valid`; the check mark itself is `aria-hidden`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A labelled field with a hint under it — `label`, `hint`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; the label and the hint follow the field tier — `size`. |
| [states.tsx](examples/states.tsx) | A default field next to a disabled, a read-only and an invalid one with no message — `disabled`, `readOnly`, `invalid`. |
| [validation.tsx](examples/validation.tsx) | Live validation: an error shakes the field as it arrives, drops in and leaves as soon as the value is fixed; required and optional markers, a hint and a support row that does not shift — `required`, `optional`, `hint`, `error`, `reserveSupportRow`. |
| [with-icon.tsx](examples/with-icon.tsx) | A decorative icon at either end of the value — `Input.Icon`, `side`. |
| [affixes.tsx](examples/affixes.tsx) | A fixed prefix and suffix flush with the edges and a unit next to the value, heard as a word by a screen reader — `Input.Affix`, `Input.InlineAffix`, `aria-label`. |
| [without-focus-ring.tsx](examples/without-focus-ring.tsx) | A single search field where the caret and the lighter fill show focus — `focusRing`. |
| [password-strength.tsx](examples/password-strength.tsx) | A new password with a show toggle and a meter that fills step by step and names the level beside the hint, and a service password measured by the company's own rule — `Input.RevealButton`, `strength`, `getStrength`. |
| [password-policy.tsx](examples/password-policy.tsx) | A password change under a policy: a new password below the required level turns the meter danger and stops the submit, the repeat gets a check once it matches — `strength`, `minStrength`, `valid`. |
| [edge-actions.tsx](examples/edge-actions.tsx) | Actions at the field's end: a mail link with a tooltip beside copying the value, and a profile link on a read-only field — `Input.Action`, `Input.CopyButton`. |
| [inline-edit.tsx](examples/inline-edit.tsx) | Record card fields that save on blur and Enter, revert on Escape and show the server's refusal — `onCommit`, `error`. |
| [suggestions.tsx](examples/suggestions.tsx) | Where a returned order is kept: free text with the places already used as suggestions — `suggestions`. |
| [with-select.tsx](examples/with-select.tsx) | A menu section's icon and name as one field: an icon-only Select is the box's start segment — `Input.Wrapper`, `Select.Root`, `aria-label`. |
| [time.tsx](examples/time.tsx) | A call slot as a time of day: the browser's hour and minute segments, arrows step them, working hours only — `type`, `step`, `min`, `max`. |
| [dismiss.tsx](examples/dismiss.tsx) | A delivery city whose suggestions stay open on a press beside the field while the address is copied from a letter; Escape still closes them — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the value: a clear button and a character counter follow it — `value`, `onValueChange`, `Input.ClearButton`, `Input.Counter`. |
| [in-form.tsx](examples/in-form.tsx) | Company details form: required fields checked on submit, each error leaves as its field is fixed and a saved form turns the button green; neighbours keep their bottoms aligned — `required`, `error`, `reserveSupportRow`. |

## Mistakes
- `<Input.Field placeholder="Email" />` without a label → add `label` on `Input.Root` or `aria-label` on the field.
- `<Input.Root disabled>` → `disabled` goes on `Input.Field`.
- `<Input.Root fullWidth>` → there is no such prop; the root already fills its parent.
- A success icon in `Input.Icon side="end"` or a «Пароли совпадают» hint for a matching value → `valid` on `Input.Root` (ring, check, spoken state).
- Checking `strength` levels yourself and setting `error` → `minStrength`.
- Passing both `hint` and `error` expecting both to show → only the error is shown.
- Rendering `Input.ClearButton` for an empty field → render it only when there is a value.
- Setting `className` with a custom border or background on `Input.Wrapper` → the fill comes from the surface context; fields inside Card/Modal already switch.
- `tone="danger"` / `error` as a boolean → use `invalid` or an `error` message.
- A `Button` placed next to the field for «copy» or «call» → `Input.CopyButton` / `Input.Action` inside `Input.Wrapper`.
- Hand-written blur / Enter / Escape handlers and a `disabled` field while saving → `onCommit` returning the save Promise; the field stays editable.
- `<datalist>` with `list` on `Input.Field` → `suggestions` on `Input.Root`: the kit's list, keyboard and ARIA in both themes.
- A Select and an Input side by side for one value (an icon + a name) → the Select inside `Input.Wrapper`, named by its `aria-label`.
- A text field with a hand-made time mask, or a Datepicker for a time of day → `Input.Field type="time"`.
- Returning `false` from `onCommit` to refuse → reject the Promise (throw) and set `error`.
- `autoComplete="email"` / `"name"` on a search, filter or record field → leave it out: autofill is off unless you pass `autoComplete`; tokens belong on sign-in and sign-up fields (`LoginForm.Form`) and on a new password (`new-password`).

## Related
- **Built from:** [Label](../label/COMPONENT.md) (`label`), [Hint](../hint/COMPONENT.md) (`hint`, `error`), [Tooltip](../tooltip/COMPONENT.md) (`Input.Action`, `Input.CopyButton`), [Spinner](../spinner/COMPONENT.md) (`onCommit`), [ProgressBar](../progress-bar/COMPONENT.md) (`strength`), `Icon` (segments, the `valid` check), [VisuallyHidden](../visually-hidden/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md) (the `suggestions` list)
- **See also:** [Textarea](../textarea/COMPONENT.md), [Select](../select/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md), [TagSelect](../tag-select/COMPONENT.md) — fields with the same contract

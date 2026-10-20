# Datepicker

**Category:** selection
**Kind:** field

> A calendar for picking a date or a date range: a field with a popover (`Datepicker.Root`) or an embedded panel (`Datepicker.Panel`).

## When to use
- One date in a form or a filter (`mode="single"`): due date, shipping date, birthday.
- A period for reports and analytics (`mode="range"`), with presets, time and an explicit Apply.
- A calendar shown right on the page — booking, scheduling (`Datepicker.Panel`).
- An annual day and month without a year (`yearless`).

## When not to use
- Time of day only → use [Input](../input/COMPONENT.md) with `Input.Field type="time"`: the time is typed in hour and minute segments, there is no day to pick (a date with a time is `withTime`).
- A choice between a few fixed periods («7 дней», «30 дней») → use [SegmentedControl](../segmented-control/COMPONENT.md) or [Select](../select/COMPONENT.md).
- A free-text date the user types → use [Input](../input/COMPONENT.md).

## Import
```tsx
import {
  DEFAULT_DATEPICKER_PRESETS,
  Datepicker,
  type DatepickerPreset,
  type DatepickerRange,
  datepickerPresets,
  formatDatepickerValue,
  formatDateValue,
  YEARLESS_YEAR,
} from "prime-ui-kit";
```

## Anatomy
```
Datepicker.Root             field frame: label · field button (TriggerIcon?, value, chevron) · hint / error
├─ Datepicker.TriggerIcon   optional leading glyph (the calendar, or its children)
└─ Popover                  the calendar panel
Datepicker.Panel            the same calendar without a field, the host's own content (no card)

panel                       presets column (range) · 1–2 month grids · prompt · footer
├─ month header             ghost icon-only Buttons (previous / next) around the month title
├─ presets                  Buttons with aria-pressed; a scrolling row above the months when narrow
└─ footer                   date (+ time) pairs · Сбросить / Применить Buttons
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Datepicker.Root
`ref` → `HTMLDivElement` (the field frame). A field (label, hint / error, the field button with the value and a chevron, a leading `Datepicker.TriggerIcon` when given) that opens the calendar panel in a Popover. Takes every calendar option.

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `"single" \| "range"` | — (required) | One date or a period; sets the value type. |
| `value` | `Date \| null  ·  DatepickerRange` | — | Controlled value: a date (`single`) or `{ from, to }` in wall-clock time (`range`); `null` — not set. |
| `defaultValue` | `Date \| null  ·  DatepickerRange` | `null` · `{ from: null, to: null }` | Initial value, uncontrolled. |
| `onValueChange` | `(value) => void` | — | Called when a pick, a preset, Apply or Reset changes the value. |
| `children` | `ReactNode` | — | `Datepicker.TriggerIcon` — the leading glyph of the field button; without it the field shows only the value and the chevron, like a `Select`. |
| `open` | `boolean` | — | Controlled visibility of the panel. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Field click, Escape, an outside press or an applied value. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the calendar and returns focus to the field. |
| `closeOnOutsideClick` | `boolean` | `true` | A press outside the calendar and the field closes it; focus follows the pointer. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Field tier (height 28 · 32 · 36 · 40 · 48) and panel tier (day cell 24 · 28 · 32 · 36 · 40). Without it the tier of its host, else `m`. |
| `label` | `ReactNode` | — | Field label; part of the button's accessible name together with the value. |
| `hint` | `ReactNode` | — | Support text under the field (`aria-describedby`). |
| `hintTone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Status color of `hint` («Осталось 12 дней» in `warning`). The words carry the status, the color repeats it; an `error` replaces the hint and its tone. A validation error is `error`, never a `danger` hint. |
| `error` | `ReactNode` | — | Error message in place of the hint; implies `invalid`. |
| `required` | `boolean` | `false` | Red `*` after the label; the field button is described by `labels.required` (a button takes no `aria-required`). |
| `optional` | `boolean` | — | Muted `labels.optional` after the label. |
| `invalid` | `boolean` | — | Danger ring and `aria-invalid` without a message. |
| `disabled` | `boolean` | `false` | The field cannot be opened. |
| `fullWidth` | `boolean` | `false` | The field stretches to its container; otherwise it fits the text. |
| `align` | `"auto" \| "start" \| "center" \| "end"` | `"auto"` | Popover alignment to the field. `auto` lines the panel up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix it. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring (`data-focus-ring="false"`). |
| `placeholder` | `string` | `labels.placeholder` | Field text without a value for this field. |
| `valuePrefix` | `string` | — | Text before the value, e.g. «С». |
| `id` | `string` | — | Id of the field button; generated when omitted. |
| `name` | `string` | — | Submits the value with a form through hidden inputs: `yyyy-MM-dd` (`yyyy-MM-ddTHH:mm` with `withTime`); a range submits two values under the name, `from` then `to` (empty for an open bound). |
| `aria-label · aria-labelledby · aria-describedby` | `string` | — | Name without a `label` (the value is appended) and extra description ids. |
| `months` | `1 \| 2` | `1` | Months side by side; one when there is no room. |
| `presets` | `DatepickerPreset[] \| false` | `false` | Preset column (`range` only): `DEFAULT_DATEPICKER_PRESETS` (ends with «Всё время») or picks from `datepickerPresets`; a row above the calendar when narrow. |
| `prompt` | `boolean` | `false` | Step prompt under the calendar (`labels.pickStart` / `pickEnd` / `pickDate`). |
| `footer` | `boolean` | `false` | Footer with date fields and Reset / Apply; without it a pick applies at once. |
| `withTime` | `boolean` | `false` | Time fields in the footer (00:00 — 23:59 by default). |
| `isDayDisabled` | `(day: Date) => boolean` | — | Days that cannot be picked. |
| `disableFuture` | `boolean` | `false` | Future days are muted and cannot be picked. |
| `yearless` | `boolean` | `false` | An annual day + month: no year, months wrap around inside `YEARLESS_YEAR`. |
| `resetValue` | `Date \| null  ·  DatepickerRange` | `null` · `{ from: null, to: null }` | Value applied by Reset. |
| `today` | `Date` | today | «Today» for highlighting, presets and `disableFuture`. |
| `locale` | `Locale` | `ru` | date-fns locale of titles, weekdays and day names. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | First day of the week (1 — Monday). |
| `labels` | `Partial<DatepickerLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

### Datepicker.TriggerIcon
`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` with the leading glyph of the field button at the tier icon size, before the value: the calendar by default.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (another `Icon` in place of the calendar), `className` and the other span attributes. |

### Datepicker.Panel
`ref` → `HTMLDivElement`. The calendar without a field, as the host's own content (a Drawer sheet, a Card); 1–2 months by the host's width. Takes `mode`, the value triad and every calendar option.

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `"single" \| "range"` | — (required) | One date or a period; sets the value type. |
| `value` | `Date \| null  ·  DatepickerRange` | — | Controlled value: a date (`single`) or `{ from, to }` in wall-clock time (`range`); `null` — not set. |
| `defaultValue` | `Date \| null  ·  DatepickerRange` | `null` · `{ from: null, to: null }` | Initial value, uncontrolled. |
| `onValueChange` | `(value) => void` | — | Called when a pick, a preset, Apply or Reset changes the value. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Panel tier (day cell 24 · 28 · 32 · 36 · 40). Without it the tier of its host, else `m`. |
| `months` | `1 \| 2` | `1` | Months side by side; one when there is no room. |
| `presets` | `DatepickerPreset[] \| false` | `false` | Preset column (`range` only): `DEFAULT_DATEPICKER_PRESETS` (ends with «Всё время») or picks from `datepickerPresets`; a row above the calendar when narrow. |
| `prompt` | `boolean` | `false` | Step prompt under the calendar (`labels.pickStart` / `pickEnd` / `pickDate`). |
| `footer` | `boolean` | `false` | Footer with date fields and Reset / Apply; without it a pick applies at once. |
| `withTime` | `boolean` | `false` | Time fields in the footer (00:00 — 23:59 by default). |
| `isDayDisabled` | `(day: Date) => boolean` | — | Days that cannot be picked. |
| `disableFuture` | `boolean` | `false` | Future days are muted and cannot be picked. |
| `yearless` | `boolean` | `false` | An annual day + month: no year, months wrap around inside `YEARLESS_YEAR`. |
| `resetValue` | `Date \| null  ·  DatepickerRange` | `null` · `{ from: null, to: null }` | Value applied by Reset. |
| `today` | `Date` | today | «Today» for highlighting, presets and `disableFuture`. |
| `locale` | `Locale` | `ru` | date-fns locale of titles, weekdays and day names. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | First day of the week (1 — Monday). |
| `labels` | `Partial<DatepickerLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className` and the other attributes of the panel. |

### Functions

#### `formatDateValue(date, { withTime })`
`(date: Date, options?: { withTime?: boolean }) => string`

A date as a form submits it, in local time: `yyyy-MM-dd`, with `withTime` `yyyy-MM-ddTHH:mm` (the value of a `name`d field) — never `toISOString()`, which shifts the day to UTC.

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 px field, 24 px day cell | dense filters | |
| `s` | 32 px field, 28 px cell | compact toolbars | |
| `m` | 36 px field, 32 px cell, panel buttons `s` | regular forms | yes |
| `l` | 40 px field, 36 px cell | spacious forms | |
| `xl` | 48 px field, 40 px cell | touch-first screens | |

### mode
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `single` | one picked day with an accent fill | one date | |
| `range` | accent edges and a soft band between them, a preview band while picking the end | periods | |

### Structure
| Value | Looks like | Use when | Default |
|---|---|---|---|
| no `Datepicker.TriggerIcon` | the value and the chevron, like a `Select` field | a field whose label or prefix already says it is a date; a row of select-like fields (a bill line) | yes |
| `<Datepicker.TriggerIcon />` | a muted calendar glyph before the value | a lone date field in a toolbar or a filter row | |
| `Datepicker.TriggerIcon` with an `Icon` child | that glyph in place of the calendar | the date of a specific event (a delivery, a reminder) | |

### months
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `1` | one month; neighbouring days shown muted | single dates, short ranges | yes |
| `2` | two months; one when the viewport (popover) or the parent (panel) is too narrow | ranges across months | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `presets` | a column of preset buttons on the left (a scrolling row above when narrow); the active preset is pressed | analytics periods | `false` |
| `prompt` | muted step line under the grid | infrequent use of ranges | `false` |
| `footer` | dates (dd.MM.yyyy, dd.MM with `yearless`) and «Сбросить» / «Применить» | the user confirms, or with time | `false` |
| `withTime` | HH:mm inputs in the footer | timestamps (with `footer`) | `false` |
| `yearless` | month title without a year, value «15 октября» | annual dates | `false` |
| `fullWidth` | the field fills its container | form columns | `false` |
| `required` / `optional` | red `*` / muted «необязательно» after the label | Mark the minority of the form | `false` / — |
| `align` | popover at the field's start / center / end; `auto` takes the edge with more room | a field near the right edge → `end` | `auto` |
| `closeOnOutsideClick` | `false`: a press beside the calendar keeps it open with its draft | a `footer` draft the person must apply or reset | `true` |
| `closeOnEscape` | `false`: Escape leaves the calendar open | the calendar must close only by Apply or Reset | `true` |

## States
| State | Driven by | DOM |
|---|---|---|
| empty | no value | `data-empty="true"`, `labels.placeholder` (or `placeholder`) in placeholder color |
| open | click, `open` / `defaultOpen` | `data-state="open"`, `field-bg-hover` fill, the chevron turns |
| focus-visible | keyboard | inset focus ring; none with `focusRing` off (`data-focus-ring="false"`) |
| invalid | `invalid`, `error` | `data-invalid`, `aria-invalid`, inset `danger-border` ring; the control shakes once when an error arrives (`data-shake` on the frame) |
| disabled | `disabled` | native `disabled`, `data-disabled`, `field-bg-disabled`, cannot open |
| today | the current day | `aria-current="date"`, accent text |
| selected / band | value | day `aria-pressed` (accent text), `data-edge`; cell `data-band="selected" \| "preview"`, `data-band-start` / `-end` |
| day disabled | `isDayDisabled`, `disableFuture` | native `disabled`, muted |

Panel DOM: `data-size`, `data-embedded`, `data-compact`, `data-layout` (`aside` · `stacked`). The footer row carries `data-time` with `withTime`; a footer field never shrinks below its whole date and time — the fields wrap above the actions, and in a footer narrower than 22rem with time they stand one under the other. The popover follows the overlay contract: an outside press or Escape closes it, focus is trapped while open, the wheel over the panel does not scroll the page. The panel of `Datepicker.Root` mounts only while the popover is open, so every opening starts from the current value; nothing is rendered for it while closed.

Committing: without `footer` a picked day (or the second day of a range) applies at once and closes the popover; with `footer` the pick stays a draft until «Применить», and «Сбросить» sets `resetValue` (else empty) and closes. A preset applies its period at once, with or without `footer`. With `name`, hidden inputs submit `yyyy-MM-dd` (`yyyy-MM-ddTHH:mm` with `withTime`); a range submits `from`, then `to`.

## Layout & spacing
- The field fits its text by default (`width: fit-content`, max 100%); in forms use `fullWidth`.
- Field button: `Datepicker.TriggerIcon` (when given) · `valuePrefix` and the value · the chevron, the field padding between them, as in a `Select` trigger. A range reads `labels.rangeValue` («6 окт — 3 нояб»; `"{from} → {to}"` for an arrow).
- Label → field: the tier `label-gap`; field → field in a form: the gap of a label-less `Fieldset`.
- `align="auto"`: a field near the end of the screen lines up the popover's end edge and the panel grows toward the start, and the other way near the start; a fixed `align` still flips at the screen edge.
- Months gap `--prime-space-6`. `Datepicker.Panel` has no fill, padding or radius — the host is its container; it shows 1–2 months by the host's width with day columns spread across it. An embedded panel measures its parent; narrower than one month → compact cells and footer fields above the buttons. Works in a 320 px column.
- On a coarse pointer the day cells grow to the 44 px touch target (a dense grid cannot grow an invisible hit area past its neighbours); narrower than seven of them, the columns shrink.
- Values are wall-clock local dates; convert time zones in the app.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Space` | On the field opens the calendar; on a day picks it. |
| `←` · `→` | The neighbouring day. |
| `↑` · `↓` | The same day of the neighbouring week. |
| `Home` · `End` | Start and end of the week. |
| `PageUp` · `PageDown` | The same day of the neighbouring month; with Shift — of the year. |
| `Escape` | Closes the calendar and returns focus to the field. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The field is a `<button>` named by the label and the value (or `aria-label` + value); hint and error in `aria-describedby`, an error sets `aria-invalid`.
- The popover is a `role="dialog"` with a focus trap; focus lands on the picked or today's day.
- Every month is a table named by the month; days are buttons with the full date as name, picked ones `aria-pressed`, today `aria-current="date"`.
- One polite live region announces the visible months («Сентябрь 2026 — Октябрь 2026») when they change; the step prompt is a polite live region too; on open the popover focuses the picked (or today's) day (`data-autofocus`); presets are a named group of buttons with `aria-pressed`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `placeholder` | `"Выбрать дату"` | Field text without a value. |
| `pickStart` | `"Выберите начальную дату"` | Step prompt before the start of a range. |
| `pickEnd` | `"Выберите конечную дату"` | Step prompt before the end of a range. |
| `pickDate` | `"Выберите дату"` | Step prompt of a single date. |
| `reset` | `"Сбросить"` | Footer reset button. |
| `apply` | `"Применить"` | Footer apply button. |
| `prevMonth` | `"Предыдущий месяц"` | Name of the previous-month arrow. |
| `nextMonth` | `"Следующий месяц"` | Name of the next-month arrow. |
| `rangeStart` | `"Начало периода"` | Name of the footer start field. |
| `rangeEnd` | `"Конец периода"` | Name of the footer end field. |
| `date` | `"Дата"` | Name of the footer field of a single date. |
| `timeStart` | `"Время начала"` | Name of the start time input. |
| `timeEnd` | `"Время конца"` | Name of the end time input. |
| `time` | `"Время"` | Name of the time input of a single date. |
| `until` | `"до"` | Prefix of a range without a start: «до 6 окт». |
| `rangeValue` | `"{from} — {to}"` | Field text of a range with both ends, `{from}` and `{to}` the formatted days: «6 окт — 3 нояб», or «6 окт → 3 нояб» with `{from} → {to}`. |
| `presetsGroup` | `"Период"` | Accessible name of the presets group (no visible heading). |
| `optional` | `"необязательно"` | Muted marker after the label when `optional`. |
| `required` | `"обязательное поле"` | Read after the field name of a `required` field: its trigger is a button, which takes no `aria-required`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A shipping date field: a click opens one month, a picked day applies at once — `mode`, `label`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: the field is 28 to 48 px high, the day cell of the panel 24 to 40 px — `size`. |
| [states.tsx](examples/states.tsx) | An empty field with the default placeholder, a filled, a disabled and an invalid one, and one whose focus shows without the ring — `disabled`, `invalid`, `focusRing`. |
| [validation.tsx](examples/validation.tsx) | A leave period checked live: the error shakes in, names the broken rule and leaves once the period fits; an optional return date — `required`, `hint`, `error`, `optional`. |
| [with-icon.tsx](examples/with-icon.tsx) | A leading glyph before the value: none by default, the calendar, or another icon in its place — `Datepicker.TriggerIcon`. |
| [range-presets.tsx](examples/range-presets.tsx) | A report period: presets aside, two months, a step prompt, time fields with Reset / Apply, no future days; Reset returns the current month and the panel lines up with the field's end — `presets`, `months`, `prompt`, `footer`, `withTime`, `disableFuture`, `resetValue`, `align`. |
| [inline-panel.tsx](examples/inline-panel.tsx) | A booking calendar embedded in a card: the card is its container, two months when the parent has room, the range applies at once — `Datepicker.Panel`, `months`, `prompt`. |
| [yearless.tsx](examples/yearless.tsx) | An annual price change date: day and month without a year, a value prefix and taken days disabled — `yearless`, `valuePrefix`, `isDayDisabled`. |
| [rental-term.tsx](examples/rental-term.tsx) | A rental term in a bill line: the kind is part of the value, the range reads with an arrow and the field has no glyph, like a select beside it — `valuePrefix`, `labels`. |
| [locale.tsx](examples/locale.tsx) | A delivery window on a partner portal in English: month and weekday names from the date-fns locale, the week from Sunday and the system texts translated — `locale`, `weekStartsOn`, `labels`. |
| [deadline.tsx](examples/deadline.tsx) | A document's expiry date whose hint counts the days left and takes the status tone — `hint`, `hintTone`. |
| [dismiss.tsx](examples/dismiss.tsx) | A shift period with a footer: the calendar keeps the draft on a press beside it and closes by Escape, Reset or Apply — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled.tsx](examples/controlled.tsx) | A report filter owns the period: quick buttons set it from outside, the field shows it — `value`, `onValueChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the panel: a reminder button opens the calendar from code, a picked day closes it — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A leave request form: submit reads the period from the form data and checks it, the error shakes in and leaves once the period is fixed; an optional return date — `name`, `required`, `error`, `optional`. |
| [narrow.tsx](examples/narrow.tsx) | An embedded panel in a 320 px column: one compact month instead of two, the footer fields wrap above the buttons — `months`, `footer`. |

## Mistakes
- Omitting `mode` → it is required (`"single"` or `"range"`).
- `value={new Date()}` with `mode="range"` → pass `{ from, to }`.
- `withTime` without `footer` → add `footer`.
- `presets` on `mode="single"` → presets work only for ranges.
- `hint` for the calendar step line → `hint` is the field hint; the step line is `prompt`.
- A status badge inside the field → put a Badge next to the field or use `hint`.
- An own range text («20 окт → 2 нояб») built with `formatDatepickerValue` and string replacing → set `labels.rangeValue`; the field text and its accessible name follow it.
- Hiding the calendar glyph with CSS → it is a part: leave out `Datepicker.TriggerIcon`.
- Converting values to UTC inside the component → values are wall-clock dates; convert in the app.

## Related
- **Built from:** [Popover](../popover/COMPONENT.md), [Button](../button/COMPONENT.md) (month arrows, presets, Reset / Apply), [ScrollContainer](../scroll-container/COMPONENT.md) (the presets row when narrow), [VisuallyHidden](../visually-hidden/COMPONENT.md) (month announcement), `Icon` (the TriggerIcon calendar, chevron), [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md)
- **See also:** [Input](../input/COMPONENT.md), [Select](../select/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)

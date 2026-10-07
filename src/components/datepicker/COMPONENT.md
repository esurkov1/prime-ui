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
- Time of day only → use [Input](../input/COMPONENT.md) with a time mask.
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
  YEARLESS_YEAR,
} from "prime-ui-kit";
```

## Anatomy
```
Datepicker.Root             field frame: label · field button (calendar icon, value, chevron) · hint / error
└─ Popover                  the calendar panel
Datepicker.Panel            the same panel without a field, styled as a card

panel                       presets column (range) · 1–2 month grids · prompt · footer
├─ month header             ghost icon-only Buttons (previous / next) around the month title
├─ presets                  Buttons with aria-pressed; a scrolling row above the months when narrow
└─ footer                   date (+ time) pairs · Сбросить / Применить Buttons
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Datepicker.Root
`ref` → `HTMLDivElement` (the field frame). A field (label, hint / error, the field button with a calendar icon, the value and a chevron) that opens the calendar panel in a Popover. Takes every calendar option below.

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `"single" \| "range"` | — (required) | One date or a period; sets the value type. |
| `value` | `Date \| null  ·  DatepickerRange` | — | Controlled value: a date (`single`) or `{ from, to }` in wall-clock time (`range`); `null` — not set. |
| `defaultValue` | `Date \| null  ·  DatepickerRange` | `null · { from: null, to: null }` | Initial value, uncontrolled. |
| `onValueChange` | `(value) => void` | — | Called when a pick, a preset, Apply or Reset changes the value. |
| `open` | `boolean` | — | Controlled visibility of the panel. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Field click, Escape, an outside press or an applied value. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Field tier (height 28 · 32 · 36 · 40 · 48) and panel tier (day cell 24 · 28 · 32 · 36 · 40). |
| `label` | `ReactNode` | — | Field label; part of the button's accessible name together with the value. |
| `hint` | `ReactNode` | — | Support text under the field (`aria-describedby`). |
| `error` | `ReactNode` | — | Error message in place of the hint; implies `invalid`. |
| `required` | `boolean` | `false` | Red `*` after the label. |
| `optional` | `boolean` | — | Muted `labels.optional` after the label. |
| `invalid` | `boolean` | — | Danger ring and `aria-invalid` without a message. |
| `disabled` | `boolean` | `false` | The field cannot be opened. |
| `fullWidth` | `boolean` | `false` | The field stretches to its container; otherwise it fits the text. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Popover alignment to the field. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring (`data-focus-ring="false"`). |
| `placeholder` | `string` | `labels.placeholder` | Field text without a value for this field. |
| `valuePrefix` | `string` | — | Text before the value, e.g. «С». |
| `id` | `string` | — | Id of the field button; generated when omitted. |
| `aria-label · aria-labelledby · aria-describedby` | `string` | — | Name without a `label` (the value is appended) and extra description ids. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

### Datepicker.Panel
`ref` → `HTMLDivElement`. The calendar without a field, inline in a page: its own card, 1–2 months by the parent's width. Takes `mode`, `value` / `defaultValue` / `onValueChange` like Root and every calendar option below.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className` and the other attributes of the panel card. |

### Calendar options (Root · Panel)
Shared by `Datepicker.Root` and `Datepicker.Panel`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `months` | `1 \| 2` | `1` | Months side by side; one when there is no room. |
| `presets` | `DatepickerPreset[] \| false` | `false` | Preset column (`range` only): `DEFAULT_DATEPICKER_PRESETS` or picks from `datepickerPresets`; a row above the calendar when narrow. |
| `prompt` | `boolean` | `false` | Step prompt under the calendar (`labels.pickStart` / `pickEnd` / `pickDate`). |
| `footer` | `boolean` | `false` | Footer with date fields and Reset / Apply; without it a pick applies at once. |
| `withTime` | `boolean` | `false` | Time fields in the footer (00:00 — 23:59 by default). |
| `isDayDisabled` | `(day: Date) => boolean` | — | Days that cannot be picked. |
| `disableFuture` | `boolean` | `false` | Future days are muted and cannot be picked. |
| `yearless` | `boolean` | `false` | An annual day + month: no year, months wrap around inside `YEARLESS_YEAR`. |
| `resetValue` | `Date \| null  ·  DatepickerRange` | `null · { from: null, to: null }` | Value applied by Reset. |
| `today` | `Date` | `new Date()` | «Today» for highlighting, presets and `disableFuture`. |
| `locale` | `Locale` | `ru` | date-fns locale of titles, weekdays and day names. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | First day of the week (1 — Monday). |
| `labels` | `Partial<DatepickerLabels>` | — | Built-in strings, see Labels. |

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

### months
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `1` | one month; neighbouring days shown muted | single dates, short ranges | yes |
| `2` | two months; one when the viewport (popover) or the parent (panel) is too narrow | ranges across months | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `presets` | «Период» column on the left (a scrolling row above when narrow); the active preset is pressed | analytics periods | `false` |
| `prompt` | muted step line under the grid | infrequent use of ranges | `false` |
| `footer` | dates (dd.MM.yyyy) and «Сбросить» / «Применить» | the user confirms, or with time | `false` |
| `withTime` | HH:mm inputs in the footer | timestamps (with `footer`) | `false` |
| `yearless` | month title without a year, value «15 октября» | annual dates | `false` |
| `fullWidth` | the field fills its container | form columns | `false` |
| `align` | popover at the field's start / center / end | a field near the right edge → `end` | `start` |

## States
| State | Driven by | DOM |
|---|---|---|
| empty | no value | `data-empty="true"`, `labels.placeholder` (or `placeholder`) in placeholder color |
| open | click, `open` | `data-state="open"`, `field-bg-focus` fill, the chevron turns |
| focus-visible | keyboard | inset focus ring; none with `focusRing={false}` (`data-focus-ring="false"`) |
| invalid | `invalid`, `error` | `data-invalid`, `aria-invalid`, inset `danger-border` ring |
| disabled | `disabled` | native `disabled`, `data-disabled`, `field-bg-disabled`, cannot open |
| today | the current day | `data-today`, `aria-current="date"`, accent text |
| selected / band | value | day `aria-pressed`, `data-edge`; cell `data-band="selected" \| "preview"`, `data-band-start` / `-end` |
| day disabled | `isDayDisabled`, `disableFuture` | native `disabled`, muted |

Panel DOM: `data-size`, `data-embedded`, `data-compact`, `data-layout` (`aside` · `stacked`). The popover follows the overlay contract: an outside press or Escape closes it, focus is trapped while open, the wheel over the panel does not scroll the page.

## Layout & spacing
- The field fits its text by default (`width: fit-content`, max 100%); in forms use `fullWidth`.
- Label → field: the tier `label-gap`; field → field in a form: `--prime-space-5`.
- Months gap `--prime-space-6`. An embedded panel measures its parent; narrower than one month → compact cells and footer fields above the buttons. Works from 320 px.
- Values are wall-clock local dates; convert time zones in the app.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` · `Space` | On the field opens the calendar; on a day picks it. |
| `←` · `→` | The neighbouring day. |
| `↑` · `↓` | The same day of the neighbouring week. |
| `Home` · `End` | Start and end of the week. |
| `PageUp` · `PageDown` | The same day of the neighbouring month; with Shift — of the year. |
| `Escape` | Closes the calendar and returns focus to the field. |

### ARIA
- The field is a `<button>` named by the label and the value (or `aria-label` + value); hint and error in `aria-describedby`, an error sets `aria-invalid`.
- The popover is a `role="dialog"` with a focus trap; focus lands on the picked or today's day.
- Every month is a table named by the month; days are buttons with the full date as name, picked ones `aria-pressed`, today `aria-current="date"`.
- The month title and the step prompt are polite live regions; presets are a named group of buttons with `aria-pressed`.

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
| `presetsTitle` | `"Период"` | Heading and group name of the presets column. |
| `optional` | `"необязательно"` | Muted marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A shipping date field: a click opens one month, a picked day applies at once — `mode`, `label`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: the field is 28 to 48 px high, the day cell of the panel 24 to 40 px — `size`. |
| [states.tsx](examples/states.tsx) | An empty field with the default placeholder, a filled one and a disabled one — `disabled`. |
| [validation.tsx](examples/validation.tsx) | A required leave period with a hint, the same field with an error and an optional return date — `required`, `hint`, `error`, `optional`. |
| [range-presets.tsx](examples/range-presets.tsx) | A report period: presets aside, two months, a step prompt, time fields with Reset / Apply, no future days — `presets`, `months`, `prompt`, `footer`, `withTime`, `disableFuture`. |
| [inline-panel.tsx](examples/inline-panel.tsx) | A booking calendar embedded in the page: its own card, two months when the parent has room, the range applies at once — `Datepicker.Panel`, `months`, `prompt`. |
| [yearless.tsx](examples/yearless.tsx) | An annual price change date: day and month without a year, a value prefix and taken days disabled — `yearless`, `valuePrefix`, `isDayDisabled`. |
| [controlled.tsx](examples/controlled.tsx) | A report filter owns the period: quick buttons set it from outside, the field shows it — `value`, `onValueChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the panel: a reminder button opens the calendar from code, a picked day closes it — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A leave request form: a required period that turns into an error after submit and an optional return date — `required`, `error`, `optional`. |
| [narrow.tsx](examples/narrow.tsx) | An embedded panel in a 320 px column: one compact month instead of two, the footer fields wrap above the buttons — `months`, `footer`. |

## Mistakes
- Omitting `mode` → it is required (`"single"` or `"range"`).
- `value={new Date()}` with `mode="range"` → pass `{ from, to }`.
- `withTime` without `footer` → add `footer`.
- `presets` on `mode="single"` → presets work only for ranges.
- `hint` for the calendar step line → `hint` is the field hint; the step line is `prompt`.
- A status badge inside the field → put a Badge next to the field or use `hint`.
- Converting values to UTC inside the component → values are wall-clock dates; convert in the app.

## Related
- **Built from:** [Popover](../popover/COMPONENT.md), [Button](../button/COMPONENT.md), [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md)
- **See also:** [Input](../input/COMPONENT.md), [Select](../select/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)

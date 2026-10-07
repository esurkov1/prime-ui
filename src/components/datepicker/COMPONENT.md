# Datepicker

**Category:** selection (Выбор)

> A calendar for picking a date or a date range: a field with a popover (`Datepicker.Root`) or an embedded panel (`Datepicker.Panel`).

## When to use
- A single date in a form or a filter (`mode="single"`).
- A period for reports and analytics with ready-made presets, two months and optional time (`mode="range"`).
- A calendar embedded in a page (booking, scheduling) — `Datepicker.Panel`.
- An annual date without a year: birthdays, anniversaries (`yearless`).

## When not to use
- Typing a date with a mask (passport fields, very old dates) → use [Input](../input/COMPONENT.md) instead.
- Choosing a period from a few fixed options only (Неделя / Месяц / Год) → use [SegmentedControl](../segmented-control/COMPONENT.md) or [Select](../select/COMPONENT.md) instead.
- Time only → use [Input](../input/COMPONENT.md) instead.

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
Datepicker.Root             field frame (label · field button · hint/error) + popover with the panel
└─ Datepicker.Badge         status badge inside the field before the chevron (optional child)

Datepicker.Panel            the same calendar panel without a field, styled as a card
  presets column (range + presets) · 1–2 months grid · prompt row · footer (dates, time, Сбросить / Применить)
```

## API

### Datepicker.Panel
| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `"range" \| "single"` | — (required) | Range of dates or one date; defines the value type. |
| `value` | `DatepickerRange` (range) · `Date \| null` (single) | — | Controlled value in wall-clock time; range bounds may be `null`. |
| `defaultValue` | `DatepickerRange` · `Date \| null` | `{ from: null, to: null }` · `null` | Initial value in uncontrolled mode. |
| `onValueChange` | `(value: DatepickerRange) => void` · `(value: Date \| null) => void` | — | Called when a value is applied (immediately, or on «Применить» with `footer`). |
| `resetValue` | `DatepickerRange` · `Date \| null` | empty range · `null` | Value applied by «Сбросить». |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier: day cell = menu item height of the tier; footer controls one tier down. |
| `months` | `1 \| 2` | `1` | Months side by side; falls back to one when there is no room. |
| `presets` | `DatepickerPreset[] \| false` | `false` | Presets column (range only). |
| `prompt` | `boolean` | `false` | Step prompt under the calendar («Выберите начальную дату» / «… конечную дату» / «Выберите дату»). |
| `footer` | `boolean` | `false` | Footer with the picked dates and «Сбросить» / «Применить»; without it a pick applies at once. |
| `withTime` | `boolean` | `false` | Time fields in the footer (default 00:00 — 23:59). |
| `isDayDisabled` | `(day: Date) => boolean` | — | Disabled days (day = local midnight). |
| `disableFuture` | `boolean` | `false` | Days after `today` are muted and disabled. |
| `yearless` | `boolean` | `false` | Day + month only; months cycle inside `YEARLESS_YEAR` (2000). |
| `today` | `Date` | current day | «Today» for highlighting, presets and `disableFuture`. |
| `locale` | date-fns `Locale` | `ru` | Month and weekday names, value format. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | First day of the week (Monday). |
| `labels` | `Partial<DatepickerLabels>` | Russian defaults | System strings, see Accessibility. |
| `className` | `string` | — | Class on the panel root. |

No ref, no other native props.

### Datepicker.Root
All `Datepicker.Panel` props (`className` goes to the field frame), plus:

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `"Выбрать дату"` | Field text without a value. |
| `valuePrefix` | `string` | — | Text before the value, e.g. «С». |
| `open` | `boolean` | — | Controlled popover state. |
| `defaultOpen` | `boolean` | `false` | Initial popover state. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the popover opens or closes. |
| `fullWidth` | `boolean` | `false` | Field stretches to the container; otherwise it fits its text. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Popover alignment to the field. |
| `label` | `ReactNode` | — | Label above the field. |
| `required` | `boolean` | `false` | Red `*` after the label. |
| `optional` | `boolean` | — | Muted `labels.optional` marker. |
| `hint` | `ReactNode` | — | Hint under the field. |
| `error` | `ReactNode` | — | Error in the hint slot; non-empty implies `invalid`. |
| `invalid` | `boolean` | — | Danger ring and `aria-invalid` without a message. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring. |
| `disabled` | `boolean` | `false` | Disables the field; the popover cannot open. |
| `id` | `string` | auto (`useId`) | Id of the field button. |
| `aria-label` | `string` | — | Name without a `label`; the current value is appended («Период: 6 окт — 3 нояб»). |
| `aria-labelledby` | `string` | — | Id(s) that name the field. |
| `aria-describedby` | `string` | — | Extra description ids, merged with hint/error. |
| `children` | `ReactNode` | — | Field adornments: `Datepicker.Badge`. |

### Datepicker.Badge
| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Hue of the soft badge (one tier below the field). |
| `children` | `ReactNode` | — (required) | Badge text; part of the field's accessible name. |
| `className` | `string` | — | Class on the badge. |

### Helpers
| Export | Type | Description |
|---|---|---|
| `DatepickerRange` | `{ from: Date \| null; to: Date \| null }` | Range value; `from: null` = no lower bound. |
| `DatepickerPreset` | `{ key: string; label: string; days: (today: Date) => { from: Date \| null; to: Date } }` | A preset. |
| `datepickerPresets` | object | `today`, `yesterday`, `thisWeek`, `lastWeek`, `thisMonth`, `lastMonth`, `thisYear`, `lastYear`, `allTime(start?, label?)`. Relabel with `{ ...preset, label }`. |
| `DEFAULT_DATEPICKER_PRESETS` | `DatepickerPreset[]` | Сегодня, Вчера, Эта неделя, Этот месяц, Прошлая неделя, Прошлый месяц, Этот год, Прошлый год. |
| `formatDatepickerValue(props)` | `string \| null` | The text the field would show for a value (preset name, «6 окт — 3 нояб», time when needed). `props`: `{ mode: "single", value: Date \| null }` or `{ mode: "range", value: DatepickerRange }` plus the same calendar options as Root (`presets`, `withTime`, `size`, …) so the text matches the field, e.g. `formatDatepickerValue({ mode: "range", value: range })`. |
| `YEARLESS_YEAR` | `2000` | Leap year used for `yearless` values. |

## Variants
No `variant`/`tone`. Axes: `mode`, `size`, `months`, structural flags (`presets`, `prompt`, `footer`, `withTime`, `yearless`), `fullWidth`, `align`, Badge `color`.

### mode
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `single` | one day highlighted; field shows «6 окт» | one date | — (required) |
| `range` | continuous band from start to end (rounded outer ends), hover preview while picking the end | periods, stays, reports | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px field, 24px day cell | dense filters | |
| `s` | 32px field, 28px cell | compact toolbars | |
| `m` | 36px field, 32px cell, footer controls `s` | regular forms | yes |
| `l` | 40px field, 36px cell | spacious forms | |
| `xl` | 48px field, 40px cell | touch-first screens | |

### months
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `1` | one month; adjacent months' days shown muted | single dates, short ranges | yes |
| `2` | two months with a gap; falls back to one when the viewport (popover) or the parent (panel) is too narrow | ranges that cross months | |

### Structural flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `presets` | «Период» column on the left (or a scrolling row above on narrow screens); active preset is pressed | analytics periods | `false` |
| `prompt` | muted step line under the grid | first-time or infrequent use of ranges | `false` |
| `footer` | dates (dd.MM.yyyy) and «Сбросить» / «Применить» | the user should confirm, or with time | `false` |
| `withTime` | HH:mm inputs in the footer | timestamps (requires `footer`) | `false` |
| `yearless` | month title without year, value «15 октября» | annual dates | `false` |
| `fullWidth` | field fills the container | form columns | `false` |
| `align` `start` / `center` / `end` | popover aligned to the field's start / center / end | field near the right edge → `end` | `start` |

### color (Datepicker.Badge)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | neutral soft badge | neutral note | yes |
| `blue` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | soft badge of the hue | status of the date («Не заполнено», «Просрочено») | |

**Combinations**
- `withTime` without `footer` → time fields are not rendered; always combine them.
- `presets` with `mode="single"` → ignored (range only).
- `footer` + `presets` → a preset click still applies at once.
- `yearless` + `disableFuture` → pointless (no year to compare meaningfully).

**Sizes** — field height = `--prime-control-<tier>-height`, aligned with Input, Select, Button of the same tier; the panel uses the same tier.

**Hierarchy** — in forms use `fullWidth` like the other fields; in toolbars keep the content width.

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| empty | no value | trigger `data-empty="true"` | placeholder text |
| hover | pointer | — | field fill darkens 6% |
| open | click / `open` | trigger `data-state="open"` | `field-bg-focus` fill, popover with focus on the selected (or today's) day |
| focus-visible | keyboard | `data-focus-ring="false"` when `focusRing={false}` | inset focus ring |
| invalid | `invalid` or `error` | `data-invalid="true"`, `aria-invalid` | inset `danger-border` ring, error text |
| disabled | `disabled` | `data-disabled="true"`, native `disabled` | `field-bg-disabled`, cannot open |
| full width | `fullWidth` | `data-full-width="true"` | field 100% wide |
| today | — | day `data-today`, `aria-current="date"` | accent text, semibold |
| selected / range band | value | day `aria-pressed`, `data-edge`; cell `data-band="selected" \| "preview"`, `data-band-start`, `data-band-end` | accent edges and a soft band |
| day disabled | `isDayDisabled` / `disableFuture` | native `disabled` | muted |

Panel DOM: `data-size`, `data-embedded`, `data-compact`, `data-layout` (`aside` / `stacked`). The popover follows the overlay contract (outside press / Escape close; focus is trapped while open; wheel over the panel does not scroll the page).
Controlled: `value` + `onValueChange`, `open` + `onOpenChange`. Uncontrolled: `defaultValue`, `defaultOpen`.

## Layout & spacing
- The field fits its text by default (`width: fit-content`, max 100%); in forms use `fullWidth`.
- Label → field: tier `label-gap`; field → field in a form: `--prime-space-5`.
- Months gap `--prime-space-6`. Embedded panel measures its parent; narrower than one month → compact cells and footer fields above the buttons. Works from 320px.

## Accessibility
- Field: `<button>` named by the label + value (+ badge) or by `aria-label` + value; `aria-describedby` with hint/error, `aria-invalid`.
- Popover is a dialog with a focus trap; focus lands on the selected or today's day.
- Grid keyboard: ← / → day, ↑ / ↓ week, Page Up / Page Down month (Shift — year, not in `yearless`), Home / End start / end of week, Enter / Space pick. Escape closes and returns focus to the field.
- Day buttons have full date labels («6 октября 2025»), `aria-pressed` in the selection, `aria-current="date"` for today. Month title is a polite live region.
- `labels` keys (defaults):
  - `pickStart` — «Выберите начальную дату»
  - `pickEnd` — «Выберите конечную дату»
  - `pickDate` — «Выберите дату»
  - `reset` — «Сбросить»
  - `apply` — «Применить»
  - `prevMonth` — «Предыдущий месяц»
  - `nextMonth` — «Следующий месяц»
  - `rangeStart` — «Начало периода»
  - `rangeEnd` — «Конец периода»
  - `date` — «Дата»
  - `timeStart` — «Время начала»
  - `timeEnd` — «Время конца»
  - `time` — «Время»
  - `until` — «до» (range without a start: «до 6 окт»)
  - `presetsTitle` — «Период»
  - `optional` — «необязательно»

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [range-presets.tsx](examples/range-presets.tsx) | Range with presets, two months, `prompt`, `footer`, `withTime`, `disableFuture` | Report periods |
| [badge.tsx](examples/badge.tsx) | `Datepicker.Badge` in an empty field | Flagging a missing date |
| [sizes.tsx](examples/sizes.tsx) | All size tiers | Aligning with other controls |
| [states.tsx](examples/states.tsx) | Empty, filled, error, disabled | Reference for every state |
| [single.tsx](examples/single.tsx) | `mode="single"` applied on click | One-off dates |
| [inline-panel.tsx](examples/inline-panel.tsx) | `Datepicker.Panel` with two months and `prompt` | Calendars embedded in a page |
| [narrow.tsx](examples/narrow.tsx) | Panel in a 320px column | Mobile layouts |
| [in-form.tsx](examples/in-form.tsx) | Required range with error after submit, optional date, in a Card | Date fields in forms |
| [yearless.tsx](examples/yearless.tsx) | `yearless`, `valuePrefix`, `isDayDisabled` | Annual dates |

```tsx
import { Datepicker } from "prime-ui-kit";

export function SaleDate() {
  return <Datepicker.Root mode="single" label="Дата продажи" />;
}
```

## Mistakes
- Omitting `mode` → it is required (`"single"` or `"range"`).
- `value={new Date()}` with `mode="range"` → pass `{ from, to }`.
- `withTime` without `footer` → add `footer`.
- `presets` on `mode="single"` → presets work only for ranges.
- `hint` instead of `prompt` for the step line → `hint` is the field hint under the field; the calendar step line is `prompt`.
- Converting values to UTC inside the component → values are wall-clock local dates; convert in the app.

## Related
[Input](../input/COMPONENT.md) · [Select](../select/COMPONENT.md) · [SegmentedControl](../segmented-control/COMPONENT.md) · [Popover](../popover/COMPONENT.md) · [Badge](../badge/COMPONENT.md)

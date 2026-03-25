# Datepicker

## What it is

A set of pieces for calendar date or range selection: day grid, size-context shell, quick presets, time of day, and a text caption; the grid is built on react-day-picker with prime-ui-kit styling, and locale plus date formatting integrate cleanly via date-fns.

## What it’s for

- **Booking and slots** — the user picks a day and visit time; the calendar and `Datepicker.Time` share one state, with a caption explaining the chosen slot.
- **Analytics and reports** — “from–to” periods with presets like “this week”, “this month”; on wide panels, two months side by side speed up navigation.
- **Content publishing** — scheduled publish date for an article or promo: single date, validation for unavailable days (weekends, past dates).
- **Document workflows** — filter by signing date or contract validity in a popover next to the search field.
- **Logistics and delivery** — shipment window with different start and end times in range mode.
- **Profile settings** — birthday or anniversary in a form with a clear caption and UI locale.

## Use cases

### Basic

Single date in a form; state in React, caption formatted with date-fns.

```tsx
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import * as React from "react";

import { Datepicker } from "prime-ui-kit";

export function ProfileBirthDateField() {
  const [born, setBorn] = React.useState<Date | undefined>();

  return (
    <Datepicker.Shell>
      <Datepicker.Calendar
        locale={enUS}
        mode="single"
        month={new Date(2026, 0, 1)}
        selected={born}
        onSelect={setBorn}
      />
      <Datepicker.Value as="p">
        {born ? format(born, "MMMM d, yyyy", { locale: enUS }) : "Enter your birth date"}
      </Datepicker.Value>
    </Datepicker.Shell>
  );
}
```

### Variants / sizes

Pricing page: compact calendar in a card with limited width.

```tsx
import { enUS } from "date-fns/locale";
import * as React from "react";

import { Datepicker } from "prime-ui-kit";

export function PlanTrialStartPicker() {
  const [start, setStart] = React.useState<Date | undefined>();

  return (
    <Datepicker.Shell size="s">
      <Datepicker.Calendar
        locale={enUS}
        mode="single"
        numberOfMonths={1}
        selected={start}
        size="s"
        onSelect={setStart}
      />
    </Datepicker.Shell>
  );
}
```

### In context (form / modal / sidebar / …)

Report filter panel in a side column: range with two responsive months.

```tsx
import { enUS } from "date-fns/locale";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Datepicker } from "prime-ui-kit";

export function ReportSidebarDateFilter() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <aside style={{ minWidth: 0, width: "100%" }}>
      <Datepicker.Shell>
        <Datepicker.Calendar
          locale={enUS}
          mode="range"
          responsiveMonths
          responsiveBreakpoints={{ twoColumns: 480 }}
          selected={range}
          onSelect={setRange}
        />
      </Datepicker.Shell>
    </aside>
  );
}
```

### Controlled mode

Booking: “today / tomorrow” presets, time, and one `Date` state synced with the API.

```tsx
import { addDays } from "date-fns";
import { enUS } from "date-fns/locale";
import * as React from "react";

import { Datepicker, type DatepickerPresetSingle } from "prime-ui-kit";

const presets: DatepickerPresetSingle[] = [
  { label: "Today", date: new Date() },
  { label: "Tomorrow", date: addDays(new Date(), 1) },
];

export function BookingSlotPicker({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (next: Date | undefined) => void;
}) {
  return (
    <Datepicker.Shell
      presets={<Datepicker.Presets mode="single" presets={presets} onSelect={onChange} />}
    >
      <Datepicker.Calendar
        locale={enUS}
        mode="single"
        selected={value}
        onSelect={onChange}
      />
      <Datepicker.Time value={value} onChange={onChange} />
    </Datepicker.Shell>
  );
}
```

### Composition with Popover

Dropdown calendar on button click, auto-closing after a date is chosen.

```tsx
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import * as React from "react";

import { Button, Datepicker, Popover } from "prime-ui-kit";

export function DatepickerPopoverField() {
  const [value, setValue] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    setValue(date);
    if (date) setOpen(false);
  };

  const label = value ? format(value, "MMMM d, yyyy", { locale: enUS }) : "Pick a date";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          <Button.Icon>
            <CalendarDays aria-hidden strokeWidth={1.75} />
          </Button.Icon>
          {label}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <Popover.Inset padding="none">
          <Datepicker.Shell>
            <Datepicker.Calendar
              locale={enUS}
              mode="single"
              responsiveMonths
              selected={value}
              onSelect={handleSelect}
            />
          </Datepicker.Shell>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

## Anatomy

- **`Datepicker.Shell`** — root wrapper: size provider and month request for presets; optional `presets` slot (bottom bar).
- **`Datepicker.Calendar`** — react-day-picker grid with Prime classes; custom chevrons and month caption with navigation buttons built on `Button`.
- **`Datepicker.Presets`** — `ButtonGroup` for quick single or range choices.
- **`Datepicker.Time`** — one or two `Input` fields with `type="time"`, merging time into selected dates.
- **`Datepicker.Value`** — wrapper around `Typography.Root` with font size tied to datepicker scale.

Exported utilities: **`formatTimeInputValue`**, **`mergeTimeIntoDate`** — align `Date` with native `input type="time"` and back.

## API

### Datepicker.Calendar

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | from Shell context or `m` | No | Cell and typography size. |
| responsiveMonths | boolean | false | No | 1 or 2 months by container width; when `true`, `numberOfMonths` is ignored. |
| responsiveBreakpoints | `{ twoColumns: number }` | `{ twoColumns: 500 }` | No | Width threshold (px) for the second column. |
| weekStartsOn | 0–6 | 1 | No | First day of the week. |
| navLayout | see react-day-picker | `after` | No | Month navigation placement. |
| month | Date | — | No | Currently displayed month (controlled). |
| onMonthChange | `(d: Date) => void` | — | No | Month change; tied to Shell context. |
| numberOfMonths | number | 1 | No | Fixed month count without responsive. |
| mode, selected, onSelect, disabled, locale, classNames, components, style | see DayPickerProps | — | Depends on mode | Selection mode and other react-day-picker props are forwarded to `DayPicker`. |

### Datepicker.Shell

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `m` | No | Size context for child parts. |
| presets | ReactNode | — | No | Bottom bar content (often `Datepicker.Presets`). |
| children | ReactNode | — | Yes | Calendar, time, caption. |
| className | string | — | No | Extra root class. |

### Datepicker.Presets

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| mode | `"single" \| "range"` | — | Yes | Preset type and `onSelect` signature. |
| presets | array with `label` and `date` or `range` | — | Yes | Quick-select buttons. |
| onSelect | function | — | Yes | Called when a preset is chosen. |
| size | `"s" \| "m" \| "l" \| "xl"` | from context | No | Segment size. |
| className | string | — | No | Block class. |
| title | string | — | No | Present in types; not rendered in the component markup. |

### Datepicker.Time

**Single mode** (default): `value`, `onChange`, optional `labels.time`, `size`.

**Range mode**: `mode="range"`, `from`, `to`, `onFromChange`, `onToChange`, optional `labels.from` / `labels.to`, `size`.

Time fields stay disabled until the corresponding anchor date exists.

### Datepicker.Value

Inherits `Typography.Root` props except required typography `size`: here `size` sets the datepicker scale (`s`–`xl`) and maps to caption font size. Supports `as`, `tone`, `weight`, `children`, `className`, and root element attributes.

### Utilities

| Name | Signature | Description |
|------|-----------|-------------|
| formatTimeInputValue | `(date?: Date) => string` | `HH:mm` string for `<input type="time" />` `value`. |
| mergeTimeIntoDate | `(date: Date, timeHHmm: string) => Date` | New date with hours and minutes from the string. |

## Variants

- **Calendar mode** (`mode` on `Calendar`): mainly `single` and `range`; other react-day-picker modes are available via the same props when types allow.
- **Size** (`size` on `Shell` / `Calendar` / parts): `s`, `m`, `l`, `xl` — one control token tier.
- **Presets**: semantic split only between `mode="single"` and `mode="range"`; button set comes from the `presets` array.

## States

- **Date / range selection** — via `selected` and `onSelect` (controlled) or day-picker internal state when uncontrolled.
- **Unavailable days** — `disabled` on `Calendar` (react-day-picker matchers).
- **Time without date** — `Datepicker.Time` disables `input type="time"` until `value` / `from` / `to` exist.
- **Month for presets** — choosing a preset calls context `requestMonth` so the grid jumps to the right month.

## Accessibility (a11y)

- Day grid — react-day-picker markup and roles (e.g. `grid`, `gridcell`); keyboard navigation between days comes from the library.
- Month navigation buttons in the custom caption — native `button` with `aria-label` (labels in code are English; for other product languages, supply your own via day-picker component customization if needed).
- Time fields — `label` + `Input.Field` with `id` from `useId`.
- Presets — separate `button` elements inside the group.

## Limitations and notes

- Range presets are not mixed with single mode in one `Datepicker.Presets`: use a separate instance with `mode="range"`.
- `responsiveMonths` measures the calendar container width; in tight layouts without `min-width: 0`, flex can clip width — account for this in the page grid.
- react-day-picker styles are imported in the component module (`react-day-picker/style.css`); customization beyond Prime classes may need careful `classNames`.
- Time zones and UTC: behavior depends on the `Date` values passed and how `input type="time"` shows local browser time.

## Related components

- **Button** / **ButtonGroup** — month navigation and presets.
- **Input** — time fields.
- **Typography** — base for `Datepicker.Value`.
- **Popover** — typical wrapper for a dropdown calendar on trigger click.

# Datepicker

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Composite pieces for picking a calendar date or range: a size-aware shell, a day grid built on react-day-picker with kit styling, optional quick presets, optional time inputs, and a caption-sized text wrapper. Pass `locale` and formatting from **date-fns** (or compatible) so labels match your UI language.

- **When to use** — booking, scheduling, or any task where users choose one day or a from–to range from a calendar grid.
- **When to use** — filters and reports that pair the grid with quick presets and optional time fields in the same shell.
- **When to use** — forms that need a short caption (`Datepicker.Value`) tied to picker scale and tone.
- **When not to use** — free-text or partial dates (use a plain or masked [Input](../input/COMPONENT.md) instead).
- **When not to use** — always-visible full calendars as default page chrome; open the shell from a trigger in [Popover](../popover/COMPONENT.md), [Modal](../modal/COMPONENT.md), or [Drawer](../drawer/COMPONENT.md).
- **When not to use** — month- or year-only picking without days (use a slimmer control or native inputs).

## Composition

- **`Datepicker.Shell`** — Root wrapper: sets `DatepickerSize` context, owns `requestedMonth` / `requestMonth` for syncing the grid month when presets fire. Optional **`presets`** renders a bottom row after **`children`**.
- **`Datepicker.Calendar`** — Must live under `Shell` (directly or nested) so `size` context resolves. Forwards **react-day-picker** `DayPicker` props; kit adds `responsiveMonths`, `responsiveBreakpoints`, and `size`.
- **`Datepicker.Presets`** — Optional; usually passed as `Shell`’s `presets` prop. Calls `requestMonth` when a preset is chosen so the visible month follows the selection.
- **`Datepicker.Time`** — Optional; place as a child of `Shell` (e.g. under or beside `Calendar`). Single mode merges time into one `Date`; range mode uses `from` / `to` and separate change handlers.
- **`Datepicker.Value`** — Optional caption: `Typography.Root` with picker-scale typography; default `tone` is `muted`.

### Minimal example

```tsx
import { enUS } from "date-fns/locale";
import { Datepicker } from "prime-ui-kit";

export function DatepickerMinimal() {
  return (
    <Datepicker.Shell>
      <Datepicker.Calendar locale={enUS} mode="single" />
    </Datepicker.Shell>
  );
}
```

## Rules

- Prefer **`Datepicker.Shell` inside [Popover](../popover/COMPONENT.md) `Content`** (often with `Popover.Inset` and `padding="none"`) opened from a trigger that shows the current value; the calendar is large and focus-heavy for inline page defaults.
- **Controlled vs uncontrolled** — Drive selection with **`selected`** and **`onSelect`** from react-day-picker (and optional **`month`** / **`onMonthChange`**) when the parent must own state; otherwise rely on day-picker internal state where types allow.
- **`responsiveMonths`** — When `true`, **`numberOfMonths` is ignored**; the kit measures the calendar viewport and switches between one and two columns using **`responsiveBreakpoints.twoColumns`** (default **500** px).
- **Presets** — Use **`mode="single"`** or **`mode="range"`** per instance; do not mix range presets with single calendar mode in one `Presets`. The **`title`** prop exists on the type but **is not rendered** in the component.
- **Time fields** — **`Datepicker.Time`** disables `input type="time"` until the anchor date exists (`value` in single mode; `from` / `to` in range mode). Default labels are Russian (**«Время»**, **«Начало»**, **«Конец»**); override via **`labels`**.
- **Accessibility** — Day grid roles and keyboard navigation come from react-day-picker; month nav uses [Button](../button/COMPONENT.md) with English **`aria-label`** strings in the kit—replace via **`components`** / **`classNames`** on `Calendar` if your product language differs. Ensure the popover trigger has an accessible name. Time row uses **`useId`**-scoped labels on [Input](../input/COMPONENT.md).
- **Styling and layout** — The module imports **`react-day-picker/style.css`**. **`responsiveMonths`** depends on container width; in tight flex layouts without **`min-width: 0`**, width can clip—check popover and grid CSS.
- **Time zones** — Behavior follows local `Date` instances and how the browser shows **`type="time"`**; UTC shifts are the app’s responsibility.

## API

### Datepicker.Calendar

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | from `Shell` context, else `m` | No | Cell typography, nav buttons, and control scale. |
| responsiveMonths | `boolean` | `false` | No | If `true`, `numberOfMonths` is ignored; column count follows viewport width. |
| responsiveBreakpoints | `{ twoColumns: number }` | `{ twoColumns: 500 }` | No | Pixel width at which the layout uses two month columns. |
| weekStartsOn | `0`–`6` | `1` | No | First weekday column (0 = Sunday). |
| navLayout | `DayPicker` nav layout | `"after"` | No | Month navigation placement (react-day-picker). |
| month | `Date` | — | No | Displayed month (controlled when set). |
| onMonthChange | `(d: Date) => void` | — | No | Month changes; also notifies `Shell` month context. |
| numberOfMonths | `number` | `1` | No | Fixed month count when `responsiveMonths` is not `true`. |
| classNames, components, style | `DayPicker` props | — | No | Merged with kit defaults; custom `components` extend kit chevron and month caption. |
| mode, selected, onSelect, disabled, locale, … | `DayPickerProps` | — | Varies | Other react-day-picker props are forwarded to `DayPicker`. |

### Datepicker.Shell

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `m` | No | Size context for `Calendar`, `Presets`, `Time`, and `Value`. |
| presets | `ReactNode` | — | No | Bottom bar (commonly `Datepicker.Presets`). |
| children | `ReactNode` | — | Yes | Main panel content (`Calendar`, `Time`, `Value`, etc.). |
| className | `string` | — | No | Root element class. |

### Datepicker.Presets

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| mode | `"single" \| "range"` | — | Yes | Selects preset shape and `onSelect` signature. |
| presets | `DatepickerPresetSingle[]` or `DatepickerPresetRange[]` | — | Yes | Quick actions; single items use `{ label, date }`, range items use `{ label, range }`. |
| onSelect | `(date: Date \| undefined) => void` or `(range: DateRange \| undefined) => void` | — | Yes | Invoked when a preset button is pressed; updates shell month from the preset anchor. |
| size | `"s" \| "m" \| "l" \| "xl"` | from context | No | [ButtonGroup](../button-group/COMPONENT.md) segment size. |
| className | `string` | — | No | Block wrapper class. |
| title | `string` | — | No | Present in types only; not rendered. |

### Datepicker.Time

**Single** (default — `mode` omitted or `"single"`)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `Date \| undefined` | — | Yes | Anchor date; time field disabled when unset. |
| onChange | `(next: Date) => void` | — | Yes | Called with date merged from `HH:mm` input. |
| labels | `{ time?: string }` | — | No | Overrides default time label. |
| size | `"s" \| "m" \| "l" \| "xl"` | from context | No | Input size. |

**Range** (`mode="range"`)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| mode | `"range"` | — | Yes | Enables two time fields. |
| from | `Date \| undefined` | — | Yes | Start date; start time disabled when unset. |
| to | `Date \| undefined` | — | Yes | End date; end time disabled when unset. |
| onFromChange | `(next: Date) => void` | — | Yes | Merges time into `from`. |
| onToChange | `(next: Date) => void` | — | Yes | Merges time into `to`. |
| labels | `{ from?: string; to?: string }` | — | No | Overrides default range labels. |
| size | `"s" \| "m" \| "l" \| "xl"` | from context | No | Input size. |

### Datepicker.Value

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | from context | No | Масштаб пикера; внутри маппится на [Typography](../typography/COMPONENT.md) `variant`. |
| tone | `Typography` tone | `muted` | No | Передаётся в `Typography.Root`. |
| as, weight, tracking, italic, children, className, … | `Omit<TypographyRootProps, "variant">` | — | No | Как у `Typography.Root`, но кегль задаётся через `size` пикера (см. выше). |

### Utilities

| Name | Signature | Description |
|------|-----------|-------------|
| `formatTimeInputValue` | `(date?: Date) => string` | `HH:mm` for `input type="time"` `value`. |
| `mergeTimeIntoDate` | `(date: Date, timeHHmm: string) => Date` | New `Date` with hours and minutes from the string. |

### Exported types

`DatepickerCalendarProps`, `DatepickerShellProps`, `DatepickerPresetsProps`, `DatepickerTimeProps`, `DatepickerTimeSingleProps`, `DatepickerTimeRangeProps`, `DatepickerValueProps`, `DatepickerSize`, `DatepickerPresetSingle`, `DatepickerPresetRange`, and **`DateRange`** (re-exported from react-day-picker) are exported from the package alongside the component and utilities.

## Related

- [Popover](../popover/COMPONENT.md)
- [Button](../button/COMPONENT.md)
- [ButtonGroup](../button-group/COMPONENT.md)
- [Input](../input/COMPONENT.md)
- [Typography](../typography/COMPONENT.md)
- [Modal](../modal/COMPONENT.md)
- [Drawer](../drawer/COMPONENT.md)

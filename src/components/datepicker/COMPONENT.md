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

## Canonical

- **Exports** — `Datepicker` (`Shell`, `Calendar`, `Presets`, `Time`, `Value`), `formatTimeInputValue`, `mergeTimeIntoDate`, and types including **`DateRange`** (re-exported from react-day-picker).
- **Hierarchy** — `Datepicker.Shell` is the panel root; **`Datepicker.Calendar` must be inside `Shell`** (directly or nested) so `size` context resolves.
- **Selection** — `Calendar` forwards **react-day-picker** `DayPicker` props: `mode="single"` or `mode="range"`, `selected`, `onSelect`, `disabled`, `locale`, etc.
- **Presets** — Pass `Datepicker.Presets` as **`Shell`’s `presets` prop**; `Presets` **`mode`** (`"single"` | `"range"`) must match the calendar **`mode`**.
- **Layout** — `Calendar` supports **`responsiveMonths`** (ignores `numberOfMonths` when `true`) and **`responsiveBreakpoints.twoColumns`** (default **500** px). Default **`weekStartsOn`** is **1** (Monday).
- **Popover** — Typical pattern: `Datepicker.Shell` inside **`Popover.Content`** with **`insetPadding="none"`**.
- **Presets `title`** — Typed on `Datepicker.Presets` but **not rendered** in the UI.
- **Time** — `Datepicker.Time` keeps `input type="time"` **disabled** until the anchor date exists (`value`, or `from` / `to` in range mode).

## Extended

### Playground snippets

Demos match **`playground/sections/DatepickerSection.tsx`** (order and intent). Sources use `@/` imports under **`playground/snippets/datepicker/`**:

| Block | File | What it shows |
|-------|------|----------------|
| **Sizes** | [`sizes.tsx`](../../../playground/snippets/datepicker/sizes.tsx) (+ [`sizes.module.css`](../../../playground/snippets/datepicker/sizes.module.css)) | Four **`Datepicker.Shell`** / **`Calendar`** **`size`** values (**`s`**–**`xl`**), each in its own **`Popover`**. |
| **Variants and modes** | [`variants-modes.tsx`](../../../playground/snippets/datepicker/variants-modes.tsx) (+ [`sizes.module.css`](../../../playground/snippets/datepicker/sizes.module.css)) | **`mode="single"`** vs **`mode="range"`** with separate triggers. |
| **States** | [`states.tsx`](../../../playground/snippets/datepicker/states.tsx) | **`disabled`** by day of week; **`Calendar`** + **`Datepicker.Time`** (time inputs disabled until a date exists). |
| **Responsive months** | [`responsive-months.tsx`](../../../playground/snippets/datepicker/responsive-months.tsx) | **`responsiveMonths`**, **`responsiveBreakpoints`**; preview uses **`examplePreviewBleed`** for container width. |
| **Controlled value** | [`controlled-value.tsx`](../../../playground/snippets/datepicker/controlled-value.tsx) | Controlled **`selected`** / **`onSelect`**; **`Datepicker.Value`**; popover closes after a date is chosen. |
| **Composition** | [`composition.tsx`](../../../playground/snippets/datepicker/composition.tsx) | **`Shell`** **`presets`**, **`Calendar`**, **`Time`**, **`Value`** in one panel; shared parent state. |
| **Full width** | [`full-width.tsx`](../../../playground/snippets/datepicker/full-width.tsx) | Wide **`Popover.Content`** and **`Datepicker.Shell className="min-w-0"`** with **`responsiveMonths`**. |
| **Trigger with icon** | [`popover.tsx`](../../../playground/snippets/datepicker/popover.tsx) | Calendar icon on **`Popover.Trigger`**; close after single-date select. |
| **Range presets + time** | [`range-presets-time.tsx`](../../../playground/snippets/datepicker/range-presets-time.tsx) | **`mode="range"`** on **`Calendar`** and **`Presets`**; **`Datepicker.Time`** with **`mode="range"`**. |

### Scenarios (recipes)

Runnable **`prime-ui-kit`** examples under **`examples/`** (type-checked with the library build). Copy into your app and wire spacing/theme (see [Label](../label/COMPONENT.md) for the label primitive).

| Scenario | File |
|----------|------|
| **Booking (stay + time)** — **`mode="range"`** on **`Calendar`** and **`Presets`**, **`Datepicker.Time`** **`mode="range"`**; presets for short stays and windows | [`booking.tsx`](./examples/booking.tsx) (`BookingDateRangeExample`) |
| **Birthdate** — **`mode="single"`**, **`disabled`** for future days, **`Datepicker.Value`**, default month near a sensible year when empty | [`birthdate.tsx`](./examples/birthdate.tsx) (`BirthdateSingleExample`) |
| **Range (reports / filters)** — **`numberOfMonths={2}`** or **`responsiveMonths`**; presets such as this month / last month / last N days | [`range-report.tsx`](./examples/range-report.tsx) (`ReportRangeExample`) |
| **Full-width form field** — **`Button.Root fullWidth`** as **`Popover.Trigger`**; wide **`Popover.Content`** and **`Shell className="min-w-0"`** | [`full-width-form.tsx`](./examples/full-width-form.tsx) (`FullWidthFormDateExample`) |

Snippet-level demos (internal **`@/`** imports) are listed in **Playground snippets** above.

## LLM note

- Playground order and copy mirror **`playground/sections/DatepickerSection.tsx`**; runnable snippet sources live in **`playground/snippets/datepicker/`**.
- Always compose **`Datepicker.Shell` → `Datepicker.Calendar`** at minimum; never use **`Calendar` without `Shell`** in real UIs if you rely on **`size`** context (default **`m`** on `Shell`).
- For overlays, default to **[Popover](../popover/COMPONENT.md)** with **`insetPadding="none"`** on content unless the design system specifies otherwise.
- **Controlled state:** bind **`selected`** and **`onSelect`** from react-day-picker; for range, state type is **`DateRange | undefined`**.
- **Do not** mix **`Presets` `mode="range"`** with **`Calendar` `mode="single"`** (or the reverse) in one shell.
- **Do not** invent a **`title`** UI for **`Datepicker.Presets`** — it is not implemented.
- Pass **`locale`** from **date-fns** (`import { ru } from "date-fns/locale"`) into **`Calendar`** for localized month/weekday labels.
- Month navigation **`aria-label`** strings on the kit nav buttons are **English**; override via **`Calendar` `components`** if the product language must match.
- **Utilities:** use **`formatTimeInputValue`** / **`mergeTimeIntoDate`** only when integrating custom time inputs; **`Datepicker.Time`** already uses them.

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

- Prefer **`Datepicker.Shell` inside [Popover](../popover/COMPONENT.md) `Content`** (often with `insetPadding="none"` on `Content`) opened from a trigger that shows the current value; the calendar is large and focus-heavy for inline page defaults.
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
- [Label](../label/COMPONENT.md)
- [Typography](../typography/COMPONENT.md)
- [Modal](../modal/COMPONENT.md)
- [Drawer](../drawer/COMPONENT.md)

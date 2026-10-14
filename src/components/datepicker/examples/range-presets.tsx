/** A report period: presets aside, two months, a step prompt, time fields with Reset / Apply, no future days; Reset returns the current month and the panel lines up with the field's end — `presets`, `months`, `prompt`, `footer`, `withTime`, `disableFuture`, `resetValue`, `align`. */
import { Datepicker, type DatepickerRange, DEFAULT_DATEPICKER_PRESETS } from "prime-ui-kit";
import * as React from "react";

const NOW = new Date();
/** The current month up to the end of today: the report's default period. */
const THIS_MONTH: DatepickerRange = {
  from: new Date(NOW.getFullYear(), NOW.getMonth(), 1),
  to: new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 23, 59, 59, 999),
};

export default function DatepickerRangePresetsExample() {
  const [period, setPeriod] = React.useState<DatepickerRange>(THIS_MONTH);
  return (
    <Datepicker.Root
      mode="range"
      label="Период отчёта"
      value={period}
      onValueChange={setPeriod}
      resetValue={THIS_MONTH}
      months={2}
      presets={DEFAULT_DATEPICKER_PRESETS}
      prompt
      footer
      withTime
      disableFuture
      align="end"
      placeholder="Выбрать период"
    />
  );
}

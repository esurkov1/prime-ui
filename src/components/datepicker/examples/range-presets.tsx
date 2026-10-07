/** A report period: presets aside, two months, a step prompt, time fields with Reset / Apply, no future days — `presets`, `months`, `prompt`, `footer`, `withTime`, `disableFuture`. */
import { Datepicker, type DatepickerRange, DEFAULT_DATEPICKER_PRESETS } from "prime-ui-kit";
import * as React from "react";

export default function DatepickerRangePresetsExample() {
  const [period, setPeriod] = React.useState<DatepickerRange>({ from: null, to: null });
  return (
    <Datepicker.Root
      mode="range"
      label="Период отчёта"
      value={period}
      onValueChange={setPeriod}
      months={2}
      presets={DEFAULT_DATEPICKER_PRESETS}
      prompt
      footer
      withTime
      disableFuture
      placeholder="Выбрать период"
    />
  );
}

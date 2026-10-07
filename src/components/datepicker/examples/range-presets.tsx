/** A report period: presets aside, two months, step prompt, time fields and Reset / Apply, future days disabled. Use it for analytics and report filters. */
import { Datepicker, type DatepickerRange, DEFAULT_DATEPICKER_PRESETS } from "prime-ui-kit";
import * as React from "react";

export default function DatepickerRangePresetsExample() {
  const [range, setRange] = React.useState<DatepickerRange>({ from: null, to: null });
  return (
    <Datepicker.Root
      mode="range"
      value={range}
      onValueChange={setRange}
      months={2}
      presets={DEFAULT_DATEPICKER_PRESETS}
      prompt
      footer
      withTime
      disableFuture
      aria-label="Период"
    />
  );
}

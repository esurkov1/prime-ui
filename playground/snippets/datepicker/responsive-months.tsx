import { ru } from "date-fns/locale";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Datepicker } from "@/components/datepicker/Datepicker";
import ExampleSurface from "../../components/ExampleSurface";

export default function DatepickerResponsiveMonthsSnippet() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <ExampleSurface className="examplePreviewBleed">
      <Datepicker.Shell>
        <Datepicker.Calendar
          locale={ru}
          mode="range"
          responsiveBreakpoints={{ twoColumns: 500 }}
          responsiveMonths
          selected={range}
          onSelect={setRange}
        />
      </Datepicker.Shell>
    </ExampleSurface>
  );
}

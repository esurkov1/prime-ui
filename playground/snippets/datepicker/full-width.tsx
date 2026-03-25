import { ru } from "date-fns/locale";
import * as React from "react";

import { Datepicker } from "@/components/datepicker/Datepicker";
import ExampleSurface from "../../components/ExampleSurface";

export default function DatepickerFullWidthSnippet() {
  const [value, setValue] = React.useState<Date | undefined>();

  return (
    <div className="w-full max-w-xl min-w-0">
      <ExampleSurface className="!w-full min-w-0 max-w-none">
        <Datepicker.Shell className="min-w-0">
          <Datepicker.Calendar
            locale={ru}
            mode="single"
            responsiveMonths
            selected={value}
            onSelect={setValue}
          />
        </Datepicker.Shell>
      </ExampleSurface>
    </div>
  );
}

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";

import { Datepicker } from "@/components/datepicker/Datepicker";
import ExampleSurface from "../../components/ExampleSurface";

export default function DatepickerControlledValueSnippet() {
  const [value, setValue] = React.useState<Date | undefined>();

  return (
    <ExampleSurface>
      <Datepicker.Shell>
        <Datepicker.Calendar
          locale={ru}
          mode="single"
          month={new Date(2026, 2, 1)}
          numberOfMonths={1}
          selected={value}
          onSelect={setValue}
        />
        <Datepicker.Value as="p">
          {value
            ? format(value, "d MMMM yyyy, EEEE", { locale: ru })
            : "Дата не выбрана — кликните по ячейке."}
        </Datepicker.Value>
      </Datepicker.Shell>
    </ExampleSurface>
  );
}

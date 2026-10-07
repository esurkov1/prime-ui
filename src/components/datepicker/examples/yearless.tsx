/** An annual day-and-month date (yearless) with a value prefix and taken days disabled via isDayDisabled. Use it for birthdays, anniversaries and yearly schedules. */
import { Datepicker, YEARLESS_YEAR } from "prime-ui-kit";
import * as React from "react";

export default function DatepickerYearlessExample() {
  const [date, setDate] = React.useState<Date | null>(new Date(YEARLESS_YEAR, 9, 15));
  const taken = [new Date(YEARLESS_YEAR, 9, 1).getTime(), new Date(YEARLESS_YEAR, 9, 31).getTime()];
  return (
    <Datepicker.Root
      mode="single"
      yearless
      value={date}
      onValueChange={setDate}
      valuePrefix="С"
      isDayDisabled={(day) => taken.includes(day.getTime())}
      aria-label="Дата изменения цены"
    />
  );
}

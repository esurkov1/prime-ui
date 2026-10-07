/** A single date without a footer: one month, a click on a day applies the value at once. Use it for one-off dates in filters and forms. */
import { Datepicker } from "prime-ui-kit";
import * as React from "react";

export default function DatepickerSingleExample() {
  const [date, setDate] = React.useState<Date | null>(null);
  return (
    <Datepicker.Root
      mode="single"
      value={date}
      onValueChange={setDate}
      placeholder="Дата продажи"
      aria-label="Дата продажи"
    />
  );
}

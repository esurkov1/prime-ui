/** An empty date field with a «Не заполнено» Datepicker.Badge at the trailing edge. Use it to flag a missing date without an error state. */
import { Datepicker } from "prime-ui-kit";
import * as React from "react";

export default function DatepickerBadgeExample() {
  const [day, setDay] = React.useState<Date | null>(null);
  return (
    <Datepicker.Root
      mode="single"
      label="Дата выдачи"
      placeholder="дд.мм.гггг"
      fullWidth
      value={day}
      onValueChange={setDay}
    >
      {day ? null : <Datepicker.Badge color="orange">Не заполнено</Datepicker.Badge>}
    </Datepicker.Root>
  );
}

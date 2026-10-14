/** A delivery window on a partner portal in English: month and weekday names from the date-fns locale, the week from Sunday and the system texts translated — `locale`, `weekStartsOn`, `labels`. */
import { enUS } from "date-fns/locale";
import { Datepicker, type DatepickerLabels, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

const LABELS: Partial<DatepickerLabels> = {
  placeholder: "Pick dates",
  pickStart: "Pick the first day",
  pickEnd: "Pick the last day",
  reset: "Reset",
  apply: "Apply",
  prevMonth: "Previous month",
  nextMonth: "Next month",
  rangeStart: "From",
  rangeEnd: "To",
  until: "until",
};

export default function DatepickerLocaleExample() {
  const [delivery, setDelivery] = React.useState<DatepickerRange>({ from: null, to: null });

  return (
    <Datepicker.Root
      mode="range"
      label="Delivery window"
      value={delivery}
      onValueChange={setDelivery}
      locale={enUS}
      weekStartsOn={0}
      labels={LABELS}
      prompt
      footer
    />
  );
}

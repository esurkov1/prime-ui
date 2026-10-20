/** A rental term in a bill line: the kind is part of the value, the range reads with an arrow and the field has no glyph, like a select beside it — `valuePrefix`, `labels`. */
import { Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

const RENTAL_TERM: DatepickerRange = {
  from: new Date(2026, 9, 20),
  to: new Date(2026, 10, 2),
};
const LABELS = { rangeValue: "{from} → {to}" };

export default function DatepickerRentalTermExample() {
  const [term, setTerm] = React.useState<DatepickerRange>(RENTAL_TERM);

  return (
    <Datepicker.Root
      mode="range"
      aria-label="Срок аренды"
      valuePrefix="Аренда:"
      labels={LABELS}
      value={term}
      onValueChange={setTerm}
    />
  );
}

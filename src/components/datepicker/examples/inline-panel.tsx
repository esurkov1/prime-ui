/** Datepicker.Panel embedded in the page: its own card, two months when the parent has room, the range applies at once. Use it on booking and scheduling pages. */
import { Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

export default function DatepickerInlinePanelExample() {
  const [range, setRange] = React.useState<DatepickerRange>({ from: null, to: null });
  return <Datepicker.Panel mode="range" value={range} onValueChange={setRange} months={2} prompt />;
}

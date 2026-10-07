/** A booking calendar embedded in the page: its own card, two months when the parent has room, the range applies at once — `Datepicker.Panel`, `months`, `prompt`. */
import { Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

export default function DatepickerInlinePanelExample() {
  const [stay, setStay] = React.useState<DatepickerRange>({ from: null, to: null });
  return <Datepicker.Panel mode="range" value={stay} onValueChange={setStay} months={2} prompt />;
}

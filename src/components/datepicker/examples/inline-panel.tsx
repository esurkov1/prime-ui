/** A booking calendar embedded in a card: the card is its container, two months when the parent has room, the range applies at once — `Datepicker.Panel`, `months`, `prompt`. */
import { Card, Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DatepickerInlinePanelExample() {
  const [stay, setStay] = React.useState<DatepickerRange>({ from: null, to: null });
  return (
    <Card.Root className={styles.booking}>
      <Card.Body>
        <Datepicker.Panel mode="range" value={stay} onValueChange={setStay} months={2} prompt />
      </Card.Body>
    </Card.Root>
  );
}

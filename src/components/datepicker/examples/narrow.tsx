/** An embedded panel in a 320 px column: one compact month instead of two, the footer fields wrap above the buttons — `months`, `footer`. */
import { Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DatepickerNarrowExample() {
  const [range, setRange] = React.useState<DatepickerRange>({ from: null, to: null });
  return (
    <div className={styles.phone}>
      <Datepicker.Panel mode="range" value={range} onValueChange={setRange} months={2} footer />
    </div>
  );
}

/** A label above a calendar that has no label of its own, naming it through `id` and `aria-labelledby` — `id`. */
import { Datepicker, Label } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function LabelOverviewExample() {
  const labelId = React.useId();

  return (
    <div className={styles.calendarField}>
      <Label.Root id={labelId}>Дата отгрузки</Label.Root>
      <Datepicker.Panel mode="single" role="group" aria-labelledby={labelId} />
    </div>
  );
}

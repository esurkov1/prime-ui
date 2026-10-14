/** Help text under a calendar that has no hint of its own, linked to it through `id` and `aria-describedby` — `id`. */
import { Datepicker, Hint } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function HintOverviewExample() {
  const hintId = React.useId();

  return (
    <div className={styles.field}>
      <Datepicker.Panel
        mode="single"
        role="group"
        aria-label="Дата отгрузки"
        aria-describedby={hintId}
      />
      <Hint.Root id={hintId}>Склад отгружает по будням, заказ собирают за два дня.</Hint.Root>
    </div>
  );
}

/** Help text under a control without its own `hint` prop, linked to it by `id` and `aria-describedby`. */
import { Hint, Label, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PERIODS = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
];

export default function HintOverviewExample() {
  const labelId = React.useId();
  const hintId = React.useId();

  return (
    <div className={styles.field}>
      <Label.Root id={labelId}>Период отчёта</Label.Root>
      <SegmentedControl.Root
        defaultValue="week"
        aria-labelledby={labelId}
        aria-describedby={hintId}
      >
        {PERIODS.map((period) => (
          <SegmentedControl.Item key={period.value} value={period.value}>
            {period.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <Hint.Root id={hintId}>Отчёт пересчитывается каждую ночь в 03:00 по Москве.</Hint.Root>
    </div>
  );
}

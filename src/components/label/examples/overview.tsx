/** A standalone label above a control without its own `label`, linked through `aria-labelledby`. */
import { Label, SegmentedControl } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LabelOverviewExample() {
  return (
    <div className={styles.field}>
      <Label.Root id="report-period-label">Период отчёта</Label.Root>
      <SegmentedControl.Root defaultValue="week" aria-labelledby="report-period-label">
        <SegmentedControl.Item value="day">День</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
      </SegmentedControl.Root>
    </div>
  );
}

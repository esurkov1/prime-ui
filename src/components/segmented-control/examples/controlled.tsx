/** A controlled group with value and onValueChange driving a caption. Use it when the selection changes other content on the page. */
import { SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const LABELS: Record<string, string> = { day: "за день", week: "за неделю", month: "за месяц" };

export default function SegmentedControlControlledExample() {
  const [period, setPeriod] = React.useState("week");

  return (
    <div className={styles.cell}>
      <SegmentedControl.Root value={period} onValueChange={setPeriod} aria-label="Период отчёта">
        <SegmentedControl.Item value="day">День</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Typography.Root variant="caption" tone="muted">
        Показываем выручку {LABELS[period]}
      </Typography.Root>
    </div>
  );
}

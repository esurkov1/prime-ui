/** The parent owns the choice and updates other content from it — `value`, `onValueChange`. */
import { SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

const REVENUE: Record<string, string> = {
  day: "Выручка за день: 48 200 ₽",
  week: "Выручка за неделю: 312 700 ₽",
  month: "Выручка за месяц: 1 284 000 ₽",
};

export default function SegmentedControlControlledExample() {
  const [period, setPeriod] = React.useState("week");

  return (
    <>
      <SegmentedControl.Root value={period} onValueChange={setPeriod} aria-label="Период отчёта">
        <SegmentedControl.Item value="day">День</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Typography.Root variant="body-m" tone="secondary">
        {REVENUE[period]}
      </Typography.Root>
    </>
  );
}

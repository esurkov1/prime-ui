/** One of several: the active segment lives in parent state and gets `pressed`. */
import { ButtonGroup } from "prime-ui-kit";
import * as React from "react";

type Period = "day" | "week" | "month";

const PERIODS: { value: Period; label: string }[] = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
];

export default function ButtonGroupControlledExample() {
  const [period, setPeriod] = React.useState<Period>("week");

  return (
    <ButtonGroup.Root aria-label="Интервал отчёта">
      {PERIODS.map((item) => (
        <ButtonGroup.Item
          key={item.value}
          pressed={period === item.value}
          onClick={() => setPeriod(item.value)}
        >
          {item.label}
        </ButtonGroup.Item>
      ))}
    </ButtonGroup.Root>
  );
}

/** One-of-several choice: the active segment lives in parent state and gets `pressed`. Use for a small view or period switch that acts like toolbar buttons. */
import { ButtonGroup } from "prime-ui-kit";
import * as React from "react";

type Period = "day" | "week" | "month";

const periods: { value: Period; label: string }[] = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
];

export default function ButtonGroupControlledExample() {
  const [period, setPeriod] = React.useState<Period>("week");

  return (
    <ButtonGroup.Root aria-label="Интервал отчёта">
      {periods.map((item) => (
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

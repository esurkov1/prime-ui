import * as React from "react";

import { ButtonGroup } from "@/components/button-group/ButtonGroup";

type Period = "day" | "week" | "month";

/** Выбранный сегмент хранится в состоянии родителя; у активного элемента `pressed`. */
export default function ButtonGroupControlledSnippet() {
  const [period, setPeriod] = React.useState<Period>("week");

  return (
    <ButtonGroup.Root aria-label="Интервал отчёта">
      <ButtonGroup.Item pressed={period === "day"} type="button" onClick={() => setPeriod("day")}>
        День
      </ButtonGroup.Item>
      <ButtonGroup.Item pressed={period === "week"} type="button" onClick={() => setPeriod("week")}>
        Неделя
      </ButtonGroup.Item>
      <ButtonGroup.Item
        pressed={period === "month"}
        type="button"
        onClick={() => setPeriod("month")}
      >
        Месяц
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}

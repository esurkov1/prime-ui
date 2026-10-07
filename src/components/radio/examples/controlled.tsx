/** The parent owns the chosen plan and shows it in the hint — `value`, `onValueChange`. */
import { Radio } from "prime-ui-kit";
import * as React from "react";

const PLANS = [
  { value: "start", label: "Старт", hint: "До 5 участников, базовые отчёты" },
  { value: "team", label: "Команда", hint: "Общие проекты, SSO и журнал действий" },
  { value: "business", label: "Бизнес", hint: "Выделенная поддержка и хранение данных в РФ" },
];

export default function RadioControlledExample() {
  const [plan, setPlan] = React.useState("team");
  const current = PLANS.find((item) => item.value === plan);

  return (
    <Radio.Group
      label="Тариф рабочего пространства"
      name="plan"
      value={plan}
      onValueChange={setPlan}
      hint={`Будет подключён тариф «${current?.label}»`}
    >
      {PLANS.map((item) => (
        <Radio.Root key={item.value} value={item.value} hint={item.hint}>
          <Radio.Label>{item.label}</Radio.Label>
        </Radio.Root>
      ))}
    </Radio.Group>
  );
}

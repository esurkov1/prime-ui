/** The group fills its column and the segments share the width equally — `fullWidth`. */
import { ButtonGroup } from "prime-ui-kit";
import * as React from "react";

const PLANS = ["Базовый", "Команда", "Бизнес"] as const;

export default function ButtonGroupFullWidthExample() {
  const [plan, setPlan] = React.useState<(typeof PLANS)[number]>("Команда");

  return (
    <ButtonGroup.Root aria-label="Тариф" fullWidth>
      {PLANS.map((item) => (
        <ButtonGroup.Item key={item} pressed={plan === item} onClick={() => setPlan(item)}>
          {item}
        </ButtonGroup.Item>
      ))}
    </ButtonGroup.Root>
  );
}

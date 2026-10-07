/** `fullWidth` stretches the group to its column; horizontal segments share the width equally. Use for plan or mode pickers in narrow forms and cards. */
import { ButtonGroup } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const plans = ["Базовый", "Про", "Бизнес"] as const;

export default function ButtonGroupFullWidthExample() {
  const [plan, setPlan] = React.useState<(typeof plans)[number]>("Про");

  return (
    <div className={styles.column}>
      <ButtonGroup.Root aria-label="Тариф" fullWidth>
        {plans.map((item) => (
          <ButtonGroup.Item key={item} pressed={plan === item} onClick={() => setPlan(item)}>
            {item}
          </ButtonGroup.Item>
        ))}
      </ButtonGroup.Root>
    </div>
  );
}

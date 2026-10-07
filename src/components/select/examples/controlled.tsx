/** A controlled select whose value lives in parent state, named via aria-label on the trigger. Use it when the selection drives other UI. */
import { Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SelectControlledExample() {
  const [plan, setPlan] = React.useState("pro");

  return (
    <div className={styles.narrow}>
      <Select.Root value={plan} onValueChange={setPlan} placeholder="Тариф">
        <Select.Trigger aria-label="Тариф подписки">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="free">Бесплатный</Select.Item>
          <Select.Item value="pro">Профессиональный</Select.Item>
          <Select.Item value="team">Командный</Select.Item>
        </Select.Content>
      </Select.Root>
      <Typography.Root variant="caption" tone="muted" className={styles.caption}>
        Значение в состоянии родителя: <code>{plan}</code>
      </Typography.Root>
    </div>
  );
}

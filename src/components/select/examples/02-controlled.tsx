import { Label, Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Controlled `value` / `onChange`: parent owns the string; map enums or numbers yourself.
 */
export default function SelectExampleControlled() {
  const [tier, setTier] = React.useState("pro");
  const tierLabelId = React.useId();

  return (
    <div className={styles.stack}>
      <div className={styles.field}>
        <Label.Root id={tierLabelId}>Subscription tier</Label.Root>
        <Select.Root value={tier} onChange={setTier} placeholder="Choose a tier">
          <Select.Trigger aria-labelledby={tierLabelId}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="free">Free</Select.Item>
            <Select.Item value="pro">Pro</Select.Item>
            <Select.Item value="team">Team</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <Typography.Root as="p" variant="caption" tone="muted" className={styles.caption}>
        Current value in React state: <span>{tier}</span>
      </Typography.Root>
    </div>
  );
}

import * as React from "react";

import { Select } from "@/components/select/Select";
import { Typography } from "@/components/typography/Typography";

import styles from "./examples.module.css";

/** Controlled `value` / `onChange`; mirrors `playground/snippets/select/controlled.tsx`. */
export default function SelectPatternControlledExample() {
  const [tier, setTier] = React.useState("pro");

  return (
    <div className={`${styles.stack} ${styles.stackNarrow}`}>
      <Select.Root value={tier} onChange={setTier} placeholder="Tier">
        <Select.Trigger aria-label="Subscription tier">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="free">Free</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
          <Select.Item value="team">Team</Select.Item>
        </Select.Content>
      </Select.Root>
      <Typography.Root as="p" variant="caption" tone="muted" className={styles.caption}>
        Current value in parent state: <code>{tier}</code>
      </Typography.Root>
    </div>
  );
}

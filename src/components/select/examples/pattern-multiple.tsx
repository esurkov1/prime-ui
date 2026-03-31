import * as React from "react";

import { Select } from "@/components/select/Select";
import { Typography } from "@/components/typography/Typography";

import styles from "./examples.module.css";

/** Controlled multiselect; mirrors `playground/snippets/select/multiple.tsx` (English labels). */
export default function SelectPatternMultipleExample() {
  const [value, setValue] = React.useState<string[]>(["eng"]);

  return (
    <div className={`${styles.stack} ${styles.stackNarrow}`}>
      <Select.Root multiple value={value} onChange={setValue} placeholder="Choose departments">
        <Select.Trigger aria-label="Departments">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="eng">Engineering</Select.Item>
          <Select.Item value="design">Design</Select.Item>
          <Select.Item value="sales">Sales</Select.Item>
          <Select.Item value="hr">HR</Select.Item>
        </Select.Content>
      </Select.Root>
      <Typography.Root as="p" variant="caption" tone="muted" className={styles.caption}>
        Selected: <code>{value.length ? value.join(", ") : "—"}</code>
      </Typography.Root>
    </div>
  );
}

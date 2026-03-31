import { TagSelect, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Controlled multi-select from `options`; `prime-ui-kit` import for published consumers. */
export default function TagSelectPatternCanonicalExample() {
  const [value, setValue] = React.useState<string[]>(["eng"]);

  return (
    <div className={`${styles.stack} ${styles.stackNarrow}`}>
      <TagSelect.Root
        options={[
          { value: "eng", label: "Engineering", color: "blue" },
          { value: "design", label: "Design", color: "purple" },
          { value: "sales", label: "Sales", color: "green" },
        ]}
        value={value}
        onValueChange={setValue}
        placeholder="Add team…"
        aria-label="Teams"
      />
      <Typography.Root as="p" variant="caption" tone="muted" className={styles.caption}>
        Selected: <code>{value.join(", ") || "—"}</code>
      </Typography.Root>
    </div>
  );
}

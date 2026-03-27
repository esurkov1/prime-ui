import { Button, Tag } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const INITIAL = ["Photo", "Video", "Documents"] as const;

/** Removable tags driven by array state; empty state shows a reset button. */
export default function TagExampleControlled() {
  const [active, setActive] = React.useState<string[]>([...INITIAL]);

  return (
    <div className={styles.chipRow}>
      {active.map((label) => (
        <Tag.Root key={label} onRemove={() => setActive((prev) => prev.filter((x) => x !== label))}>
          {label}
        </Tag.Root>
      ))}
      {active.length === 0 ? (
        <Button.Root
          variant="neutral"
          mode="stroke"
          size="m"
          onClick={() => setActive([...INITIAL])}
        >
          Reset filters
        </Button.Root>
      ) : null}
    </div>
  );
}

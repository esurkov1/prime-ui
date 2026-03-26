import { Tag } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const FILTER_IDS = ["In stock", "Ships today", "4+ stars", "Under $50"] as const;

/**
 * Catalog-style active filters: each chip removes itself from the applied set via `onRemove`.
 */
export default function TagExampleFilterChips() {
  const [applied, setApplied] = React.useState<Set<string>>(
    () => new Set(["In stock", "4+ stars"]),
  );

  const remove = (id: string) => {
    setApplied((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <fieldset className={styles.fieldsetPlain}>
      <legend className={styles.legend}>Active filters</legend>
      <div className={styles.chipRow}>
        {FILTER_IDS.filter((id) => applied.has(id)).map((id) => (
          <Tag.Root key={id} size="m" onRemove={() => remove(id)}>
            {id}
          </Tag.Root>
        ))}
      </div>
    </fieldset>
  );
}

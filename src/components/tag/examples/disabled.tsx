import { Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

/** `disabled` alone and with `onRemove` (remove control is not actionable). */
export default function TagExampleDisabled() {
  return (
    <div className={styles.chipRow}>
      <Tag.Root disabled>Read-only</Tag.Root>
      <Tag.Root disabled onRemove={() => undefined}>
        Cannot remove
      </Tag.Root>
    </div>
  );
}

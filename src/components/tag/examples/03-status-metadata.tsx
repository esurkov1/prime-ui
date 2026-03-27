import { Icon, Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Read-only metadata and status: no `onRemove`, optional leading icon via `Tag.Icon`.
 */
export default function TagExampleStatusMetadata() {
  return (
    <fieldset className={styles.fieldsetPlain}>
      <legend className={styles.legend}>Release</legend>
      <div className={styles.chipRow}>
        <Tag.Root>
          <Tag.Icon>
            <Icon surface="none" name="status.locked" aria-hidden />
          </Tag.Icon>
          <span>Production</span>
        </Tag.Root>
        <Tag.Root>v2.4.1</Tag.Root>
        <Tag.Root>Stable</Tag.Root>
      </div>
    </fieldset>
  );
}

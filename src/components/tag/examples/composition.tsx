import { Icon, Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Leading `Tag.Icon`, label-only, and label with `onRemove`; icon scale follows `size` via context. */
export default function TagExampleComposition() {
  return (
    <div className={styles.chipRow}>
      <Tag.Root>
        <Tag.Icon>
          <Icon name="field.email" />
        </Tag.Icon>
        <span>Newsletter</span>
      </Tag.Root>
      <Tag.Root>Label only</Tag.Root>
      <Tag.Root onRemove={() => undefined}>Removable</Tag.Root>
    </div>
  );
}

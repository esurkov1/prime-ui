import { Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Default, removable (`onRemove`), `disabled`, and disabled with remove (inactive close control). */
export default function TagExampleStates() {
  return (
    <div className={styles.chipRow}>
      <Tag.Root>Default</Tag.Root>
      <Tag.Root onRemove={() => undefined}>With remove</Tag.Root>
      <Tag.Root disabled>Disabled</Tag.Root>
      <Tag.Root disabled onRemove={() => undefined}>
        Disabled, remove inactive
      </Tag.Root>
    </div>
  );
}

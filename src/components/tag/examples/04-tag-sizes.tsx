import { Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Size ladder `s` → `xl` for dense toolbars vs prominent filter rows. */
export default function TagExampleSizes() {
  return (
    <fieldset className={styles.fieldsetPlain}>
      <legend className={styles.legend}>Size scale</legend>
      <div className={styles.chipRow}>
        <Tag.Root size="s">Small</Tag.Root>
        <Tag.Root size="m">Medium</Tag.Root>
        <Tag.Root size="l">Large</Tag.Root>
        <Tag.Root size="xl">Extra large</Tag.Root>
      </div>
    </fieldset>
  );
}

import { Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Size ladder `s` → `xl`; height, radius, type, and icon tier follow control tokens. */
export default function TagExampleSizes() {
  return (
    <div className={styles.chipRow}>
      <Tag.Root size="s">Tag s</Tag.Root>
      <Tag.Root size="m">Tag m</Tag.Root>
      <Tag.Root size="l">Tag l</Tag.Root>
      <Tag.Root size="xl">Tag xl</Tag.Root>
    </div>
  );
}

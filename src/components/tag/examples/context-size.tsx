import { ControlSizeProvider, Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Omit `size` on `Tag.Root` to inherit from `ControlSizeProvider`. */
export default function TagExampleContextSize() {
  return (
    <div className={styles.chipRow}>
      <ControlSizeProvider value="s">
        <Tag.Root>No size — from context s</Tag.Root>
      </ControlSizeProvider>
      <ControlSizeProvider value="l">
        <Tag.Root>No size — from context l</Tag.Root>
      </ControlSizeProvider>
    </div>
  );
}

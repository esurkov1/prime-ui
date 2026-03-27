import { Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Static labels without icon or `onRemove` — typical tech stack or category chips. */
export default function TagExampleBasic() {
  return (
    <div className={styles.chipRow}>
      <Tag.Root>React</Tag.Root>
      <Tag.Root>TypeScript</Tag.Root>
      <Tag.Root>prime-ui-kit</Tag.Root>
    </div>
  );
}

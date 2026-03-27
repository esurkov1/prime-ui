import { Icon, Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Two tags with leading icons and text. */
export default function TagExampleWithIcon() {
  return (
    <div className={styles.chipRow}>
      <Tag.Root>
        <Tag.Icon>
          <Icon surface="none" name="status.locked" />
        </Tag.Icon>
        <span>Secured</span>
      </Tag.Root>
      <Tag.Root>
        <Tag.Icon>
          <Icon surface="none" name="field.email" />
        </Tag.Icon>
        <span>Newsletter</span>
      </Tag.Root>
    </div>
  );
}

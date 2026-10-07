/** All five size tiers (28 · 32 · 36 · 40 · 48) set once on the root. Use to match the group to neighbouring controls; default is `m`. */
import { ButtonGroup, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["xs", "s", "m", "l", "xl"] as const;

export default function ButtonGroupSizesExample() {
  return (
    <div className={styles.sizeRow}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <ButtonGroup.Root size={size} aria-label={`Вид, размер ${size}`}>
            <ButtonGroup.Item pressed>Код</ButtonGroup.Item>
            <ButtonGroup.Item pressed={false}>Превью</ButtonGroup.Item>
          </ButtonGroup.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

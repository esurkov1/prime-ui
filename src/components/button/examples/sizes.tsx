/** All five size tiers in one row (28 · 32 · 36 · 40 · 48). Use to pick the tier that matches neighbouring fields; default is `m`. */
import { Button, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["xs", "s", "m", "l", "xl"] as const;

export default function ButtonSizesExample() {
  return (
    <div className={styles.sizeRow}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <Button.Root size={size}>Сохранить</Button.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

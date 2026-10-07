/** Five badge tiers: 16 · 20 · 24 · 28 · 32 px, default `m`. Use to pick a size that matches the text it sits next to. */
import { Badge, type ControlSize, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function BadgeSizesExample() {
  return (
    <div className={styles.sizes}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <Badge.Root size={size} color="blue">
            Бета
          </Badge.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

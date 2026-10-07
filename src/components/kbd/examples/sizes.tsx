/** Key caps in the five badge tiers: 16 · 20 · 24 · 28 · 32 px, default `m`. Use an explicit size for standalone shortcuts in text and docs. */
import { Kbd, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["xs", "s", "m", "l", "xl"] as const;

export default function KbdSizesExample() {
  return (
    <div className={styles.sizeRow}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <span className={styles.chord}>
            <Kbd.Root size={size}>Ctrl</Kbd.Root>
            <Kbd.Root size={size}>K</Kbd.Root>
          </span>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

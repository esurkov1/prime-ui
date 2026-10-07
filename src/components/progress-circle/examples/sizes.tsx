/** Diameters 24 · 32 · 48 · 64 · 80 on the 4px grid; inner text from caption to title-l, none on xs/s. Always pass `label`; on xs/s show the value outside the ring. */
import { ProgressCircle, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["xs", "s", "m", "l", "xl"] as const;

export default function ProgressCircleSizesExample() {
  return (
    <div className={styles.row}>
      {sizes.map((size) => (
        <div key={size} className={styles.item}>
          <ProgressCircle.Root size={size} value={72} label={`Выполнено, размер ${size}`}>
            {size === "xs" || size === "s" ? null : "72%"}
          </ProgressCircle.Root>
          <Typography.Root as="span" variant="code" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

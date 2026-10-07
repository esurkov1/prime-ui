/** Label sizes match the paired field: xs/s 12/16 · m 13/20 · l/xl 14/20. Always use the size of the field below. */
import { type ControlSize, Label, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function LabelSizesExample() {
  return (
    <div className={styles.sizes}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <Label.Root size={size} required>
            Email
          </Label.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

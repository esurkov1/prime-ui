/** Hint sizes match the paired field: xs/s/m 12/16 · l/xl 13/20, always smaller than the field text. Use the size of the field above. */
import { type ControlSize, Hint, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function HintSizesExample() {
  return (
    <div className={styles.sizes}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <Hint.Root size={size}>Не менее 8 символов</Hint.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

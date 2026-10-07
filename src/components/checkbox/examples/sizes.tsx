/** All five size tiers of a checked checkbox side by side. Use it to pick the tier that matches the neighbouring controls. */
import { Checkbox, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function CheckboxSizesExample() {
  return (
    <div className={styles.sizes}>
      {SIZES.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <Checkbox.Root size={size} defaultChecked>
            <Checkbox.Label>Подпись</Checkbox.Label>
          </Checkbox.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

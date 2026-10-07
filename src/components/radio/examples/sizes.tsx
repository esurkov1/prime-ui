/** All five size tiers of a selected radio side by side. Use it to pick the tier that matches the neighbouring controls. */
import { Radio, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function RadioSizesExample() {
  return (
    <div className={styles.row}>
      {SIZES.map((size) => (
        <div key={size} className={styles.cell}>
          <Radio.Group size={size} defaultValue="on" aria-label={`Размер ${size}`}>
            <Radio.Root value="on">
              <Radio.Label>Подпись</Radio.Label>
            </Radio.Root>
          </Radio.Group>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

/** All five size tiers of an enabled switch side by side (track 24×16 to 44×24). Use it to pick the tier that matches the neighbouring controls. */
import { Switch, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SwitchSizesExample() {
  return (
    <div className={styles.sizesRow}>
      {SIZES.map((size) => (
        <div key={size} className={styles.cell}>
          <Switch.Root size={size} defaultChecked>
            <Switch.Label>Уведомления</Switch.Label>
          </Switch.Root>
          <Typography.Root variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

/** The grid fills its container and wraps by itself: the same 16 presets in a wide and a narrow column, arrows move by visual rows. No column count to tune. */
import { ColorSwatches, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ColorSwatchesWrappingExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.column}>
        <Typography.Root variant="caption" tone="muted">
          Широкая колонка
        </Typography.Root>
        <ColorSwatches.Root defaultValue="#14b8a6" aria-label="Цвет, широкая колонка" />
      </div>
      <div className={styles.narrow}>
        <Typography.Root variant="caption" tone="muted">
          Узкая колонка
        </Typography.Root>
        <ColorSwatches.Root defaultValue="#14b8a6" aria-label="Цвет, узкая колонка" />
      </div>
    </div>
  );
}

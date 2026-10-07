/** Five tiers of the swatch grid: swatch 20 · 24 · 28 · 32 · 40, gap of the tier. Default is m; match the size of the form around it. */
import { COLOR_PRESETS, ColorSwatches, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["xs", "s", "m", "l", "xl"] as const;
const presets = COLOR_PRESETS.slice(0, 8);

export default function ColorSwatchesSizesExample() {
  return (
    <div className={styles.stack}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeRow}>
          <Typography.Root variant="code" tone="muted" className={styles.sizeTag}>
            {size}
          </Typography.Root>
          <ColorSwatches.Root
            size={size}
            presets={presets}
            defaultValue="#5068f5"
            aria-label={`Цвет, размер ${size}`}
          />
        </div>
      ))}
    </div>
  );
}

/** Five tiers in a row: the cell is square with the side equal to the control height (28 · 32 · 36 · 40 · 48). Match the size of the surrounding buttons and inputs. */
import { DigitInput, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function DigitInputSizesExample() {
  return (
    <div className={styles.sizesRow}>
      {SIZES.map((size) => (
        <div key={size} className={styles.cell}>
          <DigitInput.Root
            size={size}
            length={4}
            defaultValue="2048"
            labels={{ group: `Код, ${size}` }}
          />
          <Typography.Root variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

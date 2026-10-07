/** Sizes xs–xl with `label` and `showValue`: the line grows 4 → 8px with the tier (the same scale as Slider). Match the size to the surrounding text. */
import { type ControlSize, ProgressBar } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function ProgressBarSizesExample() {
  return (
    <div className={styles.stack}>
      {sizes.map((size) => (
        <ProgressBar.Root key={size} size={size} value={64} label={`Размер ${size}`} showValue />
      ))}
    </div>
  );
}

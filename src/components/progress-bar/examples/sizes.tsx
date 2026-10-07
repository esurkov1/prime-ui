/** Sizes xs–xl with `label` and `showValue`: the track is 4px for xs–m and 8px for l–xl, the label follows the control tier. Match the size to the surrounding text. */
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

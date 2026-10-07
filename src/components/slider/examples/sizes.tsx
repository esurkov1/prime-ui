/** All five size tiers with a label and value: thumb, label and value text grow with the tier. Use it to match the slider to the form's control size. */
import { Slider } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SliderSizesExample() {
  return (
    <div className={styles.sizesGrid}>
      {SIZES.map((size) => (
        <Slider.Root key={size} size={size} label={`Размер ${size}`} showValue defaultValue={40} />
      ))}
    </div>
  );
}

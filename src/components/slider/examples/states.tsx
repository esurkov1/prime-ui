/** Sliders at the minimum, in the middle, at the maximum and disabled. Use it as a reference for the fill and the disabled look. */
import { Slider } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SliderStatesExample() {
  return (
    <div className={styles.pair}>
      <Slider.Root label="Минимум" showValue defaultValue={0} />
      <Slider.Root label="Середина" showValue defaultValue={50} />
      <Slider.Root label="Максимум" showValue defaultValue={100} />
      <Slider.Root label="Отключено" showValue defaultValue={35} disabled />
    </div>
  );
}

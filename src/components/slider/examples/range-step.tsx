/** Custom min, max and step (including a fractional step) and a slider named only by aria-label. Use it for bounded numeric settings. */
import { Slider } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SliderRangeStepExample() {
  return (
    <div className={styles.column}>
      <Slider.Root label="Этаж" min={1} max={25} defaultValue={7} showValue />
      <Slider.Root
        label="Готовность, шаг 25"
        step={25}
        defaultValue={50}
        showValue
        formatValue={(v) => `${v}%`}
      />
      <Slider.Root
        label="Рейтинг от"
        min={1}
        max={5}
        step={0.5}
        defaultValue={4}
        showValue
        formatValue={(v) => `★ ${v.toFixed(1)}`}
      />
      <Slider.Root min={0} max={100} defaultValue={30} aria-label="Масштаб карты" />
    </div>
  );
}

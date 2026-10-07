/** Every `tone` of the fill: accent by default, neutral for monochrome screens, semantic tones when the value carries meaning (risk, limits). */
import { Slider } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SliderTonesExample() {
  return (
    <div className={styles.pair}>
      <Slider.Root label="Громкость" showValue defaultValue={60} />
      <Slider.Root label="Контраст" tone="neutral" showValue defaultValue={45} />
      <Slider.Root label="Заряд не ниже" tone="success" showValue defaultValue={80} />
      <Slider.Root label="Порог предупреждения" tone="warning" showValue defaultValue={70} />
      <Slider.Root label="Порог блокировки" tone="danger" showValue defaultValue={90} />
      <Slider.Root label="Частота опроса" tone="info" showValue defaultValue={30} />
    </div>
  );
}

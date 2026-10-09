/** Notification levels as a row of upright sliders, minimum at the bottom — `orientation`. */
import { Slider } from "prime-ui-kit";

import styles from "./examples.module.css";

const LEVELS = [
  { id: "orders", label: "Заказы", value: 80 },
  { id: "chat", label: "Чат", value: 55 },
  { id: "system", label: "Система", value: 30 },
];

export default function SliderOrientationExample() {
  return (
    <div className={styles.levels}>
      {LEVELS.map((level) => (
        <Slider
          key={level.id}
          orientation="vertical"
          label={level.label}
          defaultValue={level.value}
          formatValue={(value) => `${value} %`}
          showValue
        />
      ))}
    </div>
  );
}

/** showValue in the label row and formatValue for units (°C, ₽, %) that also become aria-valuetext. Use it whenever the number needs a unit. */
import { Slider } from "prime-ui-kit";

import styles from "./examples.module.css";

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export default function SliderValueFormatExample() {
  return (
    <div className={styles.column}>
      <Slider.Root label="Громкость" showValue defaultValue={64} />
      <Slider.Root
        label="Температура"
        min={16}
        max={30}
        defaultValue={22}
        showValue
        formatValue={(v) => `${v} °C`}
      />
      <Slider.Root
        label="Бюджет в месяц"
        min={0}
        max={200000}
        step={5000}
        defaultValue={45000}
        showValue
        formatValue={(v) => rub.format(v)}
      />
      <Slider.Root
        label="Прозрачность слоя"
        min={0}
        max={1}
        step={0.05}
        defaultValue={0.8}
        showValue
        formatValue={(v) => `${Math.round(v * 100)}%`}
      />
    </div>
  );
}

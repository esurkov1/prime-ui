/** Units in the shown value that are also read by screen readers — `formatValue`, `showValue`. */
import { Slider } from "prime-ui-kit";

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export default function SliderValueFormatExample() {
  return (
    <>
      <Slider
        label="Температура на складе"
        min={2}
        max={25}
        defaultValue={8}
        showValue
        formatValue={(value) => `${value} °C`}
      />
      <Slider
        label="Бюджет кампании в месяц"
        min={0}
        max={200000}
        step={5000}
        defaultValue={45000}
        showValue
        formatValue={(value) => RUB.format(value)}
      />
    </>
  );
}

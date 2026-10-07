/** Options stacked in a column and laid out in a wrapping row — `orientation`. */
import { Radio } from "prime-ui-kit";

const PERIODS = [
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
  { value: "quarter", label: "Квартал" },
];

export default function RadioOrientationExample() {
  return (
    <>
      <Radio.Group label="vertical" name="period-vertical" defaultValue="month">
        {PERIODS.map((period) => (
          <Radio.Root key={period.value} value={period.value}>
            <Radio.Label>{period.label}</Radio.Label>
          </Radio.Root>
        ))}
      </Radio.Group>
      <Radio.Group
        label="horizontal"
        name="period-horizontal"
        defaultValue="month"
        orientation="horizontal"
      >
        {PERIODS.map((period) => (
          <Radio.Root key={period.value} value={period.value}>
            <Radio.Label>{period.label}</Radio.Label>
          </Radio.Root>
        ))}
      </Radio.Group>
    </>
  );
}

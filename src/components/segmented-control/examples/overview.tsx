/** One value out of a few, with a sliding thumb on the chosen segment — `defaultValue`, `aria-label`. */
import { SegmentedControl } from "prime-ui-kit";

export default function SegmentedControlOverviewExample() {
  return (
    <SegmentedControl.Root defaultValue="week" aria-label="Период отчёта">
      <SegmentedControl.Item value="day">День</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}

/** Segments never wrap: in a column narrower than the row it scrolls with edge fades and brings the chosen segment into view. */
import { SegmentedControl } from "prime-ui-kit";

export default function SegmentedControlScrollExample() {
  return (
    <SegmentedControl.Root defaultValue="month" aria-label="Диапазон графика">
      <SegmentedControl.Item value="day">День</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
      <SegmentedControl.Item value="quarter">Квартал</SegmentedControl.Item>
      <SegmentedControl.Item value="halfYear">Полгода</SegmentedControl.Item>
      <SegmentedControl.Item value="year">Год</SegmentedControl.Item>
      <SegmentedControl.Item value="all">Всё время</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}

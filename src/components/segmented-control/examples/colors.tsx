/** A status per option: a dot of its hue before the label and a tinted thumb when chosen — `color`. */
import { SegmentedControl } from "prime-ui-kit";

export default function SegmentedControlColorsExample() {
  return (
    <SegmentedControl.Root defaultValue="paid" aria-label="Статус счёта">
      <SegmentedControl.Item value="paid" color="green">
        Оплачен
      </SegmentedControl.Item>
      <SegmentedControl.Item value="pending" color="orange">
        Ожидает
      </SegmentedControl.Item>
      <SegmentedControl.Item value="overdue" color="red">
        Просрочен
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}

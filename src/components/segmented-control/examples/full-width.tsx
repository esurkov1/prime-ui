/** The group fills its column; segments tend to equal widths and a long label keeps its own — `fullWidth`. */
import { SegmentedControl } from "prime-ui-kit";

export default function SegmentedControlFullWidthExample() {
  return (
    <SegmentedControl.Root fullWidth defaultValue="card" aria-label="Способ оплаты">
      <SegmentedControl.Item value="card">Картой</SegmentedControl.Item>
      <SegmentedControl.Item value="sbp">СБП</SegmentedControl.Item>
      <SegmentedControl.Item value="invoice">По счёту для юрлиц</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}

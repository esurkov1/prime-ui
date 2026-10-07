/** Items with a palette color: a dot before the label and a tinted thumb when selected. Use it for picking a status where each value has its own hue. */
import { SegmentedControl } from "prime-ui-kit";
import * as React from "react";

export default function SegmentedControlColorsExample() {
  const [status, setStatus] = React.useState("ok");
  return (
    <SegmentedControl.Root value={status} onValueChange={setStatus} aria-label="Техсостояние">
      <SegmentedControl.Item value="ok" color="green">
        Исправен
      </SegmentedControl.Item>
      <SegmentedControl.Item value="service" color="orange">
        Нужно ТО
      </SegmentedControl.Item>
      <SegmentedControl.Item value="repair" color="red">
        Нужен ремонт
      </SegmentedControl.Item>
      <SegmentedControl.Item value="in-repair" color="red">
        В ремонте
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}

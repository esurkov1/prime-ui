/** Every size tier; the outer height equals the control height of the same tier — `size`. */
import { SegmentedControl, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SegmentedControlSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <SegmentedControl.Root size={size} defaultValue="week" aria-label="Период">
            <SegmentedControl.Item value="day">День</SegmentedControl.Item>
            <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          </SegmentedControl.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

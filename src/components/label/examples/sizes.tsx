/** Every size; the label takes the size of the field below it — `size`. */
import { Label, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function LabelSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Label.Root size={size}>Рабочая почта</Label.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

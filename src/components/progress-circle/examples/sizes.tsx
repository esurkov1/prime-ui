/** Diameters 24 to 80 px; the center text is not rendered on `xs` and `s` — `size`. */
import { ProgressCircle, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ProgressCircleSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <ProgressCircle size={size} value={72} aria-label="Выполнено">
            72%
          </ProgressCircle>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

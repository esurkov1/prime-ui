/** Diameters 24 to 64 px, the avatar scale; the center text is a quarter of the diameter and not rendered on `xs` — `size`. */
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
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

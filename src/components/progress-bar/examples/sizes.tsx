/** Every tier: the line grows from 4 to 8 px like the Slider track — `size`. */
import { ProgressBar, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ProgressBarSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <ProgressBar size={size} value={64} label="Загрузка" showValue />
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

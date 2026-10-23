/** Every tier: the line grows from 4 to 8 px like the Slider track, ticks stand 16 to 40 px tall — `size`, `variant`. */
import { ProgressBar, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ProgressBarSizesExample() {
  return (
    <>
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
      <div>
        {SIZES.map((size) => (
          <div key={size}>
            <ProgressBar size={size} variant="ticks" value={64} label="Загрузка" showValue />
            <Typography as="span" variant="caption" tone="muted">
              {`ticks · ${size}`}
            </Typography>
          </div>
        ))}
      </div>
    </>
  );
}

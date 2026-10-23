/** Diameters 24 to 96 px, the mark scale with `2xl` above it; the center text is a quarter of the diameter and not rendered on `xs`; ticks grow in number with the ring — `size`, `variant`. */
import { ProgressCircle, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl", "2xl"] as const;

export default function ProgressCircleSizesExample() {
  return (
    <>
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
      <div>
        {SIZES.map((size) => (
          <div key={size}>
            <ProgressCircle size={size} variant="ticks" value={72} aria-label="Выполнено">
              72%
            </ProgressCircle>
            <Typography as="span" variant="caption" tone="muted">
              {`ticks · ${size}`}
            </Typography>
          </div>
        ))}
      </div>
    </>
  );
}

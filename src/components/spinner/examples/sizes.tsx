/** Every size on the icon scale, 14 to 32 px — `size`. */
import { Spinner, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SpinnerSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Spinner size={size} />
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

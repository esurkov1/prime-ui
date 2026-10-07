/** Every badge tier, 16 to 32 px high — `size`. */
import { Kbd, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function KbdSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Kbd size={size}>Ctrl</Kbd>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

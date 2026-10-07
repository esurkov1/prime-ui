/** Every badge tier, 16 to 32 px high — `size`. */
import { Badge, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function BadgeSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Badge.Root size={size} color="blue">
            Бета
          </Badge.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

/** Every diameter, 20 to 64 px; initials take 40% of it — `size`. */
import { Avatar, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl", "2xl"] as const;

export default function AvatarSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Avatar.Root size={size} color="blue" aria-label="Анна Климова">
            <Avatar.Fallback>АК</Avatar.Fallback>
          </Avatar.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

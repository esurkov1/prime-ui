/** Every size tier, 28 to 48 px high — `size`. */
import { Button, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ButtonSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Button.Root size={size}>Сохранить</Button.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

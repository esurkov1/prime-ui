/** Every size tier, matching the field above: 12/16 for xs–m, 13/20 for l and xl — `size`. */
import { Hint, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function HintSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Hint.Root size={size}>Не менее 8 символов</Hint.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

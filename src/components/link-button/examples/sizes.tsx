/** Every size tier; text and icon follow the control tier, xs 12 to xl 18 — `size`. */
import { LinkButton, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function LinkButtonSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <LinkButton href="#details" size={size}>
            Подробнее
          </LinkButton>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

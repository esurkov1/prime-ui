/** Every size tier; buttons are as high as Button and Input of the same tier, 28 to 48 px — `size`. */
import { Pagination, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function PaginationSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Pagination size={size} totalPages={12} defaultValue={4} />
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}

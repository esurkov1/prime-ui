/** The label at every tier, matching the content around it — `size`. */
import { Divider, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function DividerSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Divider size={size}>Раздел</Divider>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

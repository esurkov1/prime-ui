/** Every size tier, 28 to 48 px high, set once on the root — `size`. */
import { ButtonGroup, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ButtonGroupSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <ButtonGroup.Root size={size} aria-label="Вид">
            <ButtonGroup.Item pressed>Код</ButtonGroup.Item>
            <ButtonGroup.Item pressed={false}>Превью</ButtonGroup.Item>
          </ButtonGroup.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

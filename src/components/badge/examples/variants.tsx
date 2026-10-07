/** Every palette hue in every treatment; the text must read without the color — `variant`, `color`. */
import { Badge, type PaletteColor, Typography } from "prime-ui-kit";

const COLORS: PaletteColor[] = [
  "gray",
  "blue",
  "sky",
  "teal",
  "green",
  "yellow",
  "orange",
  "red",
  "pink",
  "purple",
];

const VARIANTS = ["soft", "solid", "outline"] as const;

export default function BadgeVariantsExample() {
  return (
    <>
      {COLORS.map((color) => (
        <div key={color}>
          {VARIANTS.map((variant) => (
            <div key={variant}>
              <Badge.Root variant={variant} color={color}>
                {color}
              </Badge.Root>
              <Typography.Root as="span" variant="caption" tone="muted">
                {variant}
              </Typography.Root>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

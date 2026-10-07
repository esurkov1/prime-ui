/** The fallback fill: a soft tint or a solid hue, in a color that means something — `variant`, `color`. */
import { Icon, Thumbnail, Typography } from "prime-ui-kit";

const COLORS = ["gray", "blue", "green", "orange", "red"] as const;
const VARIANTS = ["soft", "solid"] as const;

export default function ThumbnailVariantsExample() {
  return (
    <>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          {COLORS.map((color) => (
            <div key={color}>
              <Thumbnail.Root variant={variant} color={color}>
                <Thumbnail.Fallback>
                  <Icon name="object.package" />
                </Thumbnail.Fallback>
              </Thumbnail.Root>
              <Typography as="span" variant="caption" tone="muted">
                {variant} · {color}
              </Typography>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

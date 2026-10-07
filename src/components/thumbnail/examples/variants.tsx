/** The fallback fill: a soft tint or a solid hue, in a color that means something — `variant`, `color`. */
import { Package } from "lucide-react";
import { Thumbnail, Typography } from "prime-ui-kit";

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
                  <Package aria-hidden />
                </Thumbnail.Fallback>
              </Thumbnail.Root>
              <Typography.Root as="span" variant="caption" tone="muted">
                {variant} · {color}
              </Typography.Root>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

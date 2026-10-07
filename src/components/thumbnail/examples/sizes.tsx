/** Every height tier, 24 to 64 px; `m` fits a two-line table cell — `size`. */
import { Icon, Thumbnail, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ThumbnailSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Thumbnail.Root size={size} ratio="4:3" color="orange">
            <Thumbnail.Fallback>
              <Icon name="object.package" />
            </Thumbnail.Fallback>
          </Thumbnail.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}

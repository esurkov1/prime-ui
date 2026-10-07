/** No image (an icon or a short label on the fill) and an image that fails and falls back by itself. */
import { Icon, Thumbnail, Typography } from "prime-ui-kit";

export default function ThumbnailStatesExample() {
  return (
    <div>
      <div>
        <Thumbnail.Root ratio="4:3" size="l" color="green">
          <Thumbnail.Fallback>
            <Icon name="object.package" />
          </Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography as="span" variant="caption" tone="muted">
          icon
        </Typography>
      </div>
      <div>
        <Thumbnail.Root ratio="3:4" size="l" color="purple">
          <Thumbnail.Fallback>PDF</Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography as="span" variant="caption" tone="muted">
          label
        </Typography>
      </div>
      <div>
        <Thumbnail.Root ratio="4:3" size="l">
          <Thumbnail.Image src="/missing-image.jpg" />
          <Thumbnail.Fallback>
            <Icon name="object.document" />
          </Thumbnail.Fallback>
        </Thumbnail.Root>
        <Typography as="span" variant="caption" tone="muted">
          error
        </Typography>
      </div>
    </div>
  );
}

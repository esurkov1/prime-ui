import { Gallery, type GalleryProps, galleryLayoutOf } from "@/components/gallery/Gallery";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { defineMessagePart, useMessagePart } from "@/internal/messagePart";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";

import styles from "./MessageMedia.module.css";

export type MessageMediaProps = Omit<GalleryProps, "children">;

/**
 * A photo, a video or an album in a message: a `Gallery` the message shapes. Alone in a message
 * it is the shell itself (the message rounds and clips it and lays the meta on a pill over it);
 * with a caption (`Message.Text` after it) it sits edge to edge at the top of the bubble. The gaps
 * of an album show a neutral surface in both directions.
 */
export function MessageMedia({ className, items, ...rest }: MessageMediaProps) {
  const { overlay, neutralDepth } = useMessagePart();
  const album = items.length > 1;
  return (
    <Gallery
      {...rest}
      items={items}
      data-message-bleed=""
      data-depth={album ? neutralDepth : undefined}
      className={cx(styles.media, className)}
      {...toDataAttributes({ album: album || undefined })}
    >
      {overlay}
    </Gallery>
  );
}
MessageMedia.displayName = "Message.Media";

defineMessagePart(MessageMedia, {
  shell: "media",
  meta: "overlay",
  picture: true,
  bleed: true,
  sized: true,
  estimate: ({ items }: MessageMediaProps) => {
    const { ratio, widthFactor } = galleryLayoutOf(items);
    // The gallery cap at the default root size.
    return (TOKEN_DEFAULTS["--prime-gallery-max-size"] * widthFactor) / ratio;
  },
});

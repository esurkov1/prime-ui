import * as React from "react";

import { Skeleton } from "@/components/skeleton/Skeleton";
import { type ImageStatus, useImageStatus } from "@/hooks/useImageStatus";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { defineMessagePart, useMessagePart } from "@/internal/messagePart";
import textRole from "@/internal/textRole.module.css";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";

import styles from "./MessageSticker.module.css";

export type MessageStickerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "role" | "aria-label"
> & {
  src?: string;
  loading?: boolean;
  "aria-label": string;
  ref?: React.Ref<HTMLDivElement>;
};

/** The picture of a sticker from `src`, decoded before it shows; reports its load. */
function StickerImage({ src, onStatus }: { src: string; onStatus: (status: ImageStatus) => void }) {
  const image = useImageStatus(onStatus, { decode: true });
  return (
    <img
      ref={image.ref}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={styles.content}
      onLoad={image.onLoad}
      onError={image.onError}
    />
  );
}

/**
 * A sticker: a square picture with no bubble, the meta on a pill over its corner. The kit draws a
 * still or animated image from `src` (webp, gif, apng); any other format — a Lottie (.tgs) or a
 * video sticker — is the consumer's own player as children, which the sticker sizes to its box
 * (the kit has no runtime dependencies). A `Skeleton` holds the box until the picture is decoded
 * or `loading` ends, then fades out; a picture that fails shows its name instead.
 */
export function MessageSticker({
  src,
  loading = false,
  className,
  children,
  "aria-label": ariaLabel,
  ref,
  ...rest
}: MessageStickerProps) {
  const { overlay } = useMessagePart();
  const [imageStatus, setImageStatus] = React.useState<ImageStatus>("idle");
  const failed = src !== undefined && imageStatus === "error";
  const pending = loading || (src !== undefined && !failed && imageStatus !== "loaded");
  return (
    <div
      {...rest}
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      aria-busy={pending || undefined}
      className={cx(styles.root, className)}
      {...toDataAttributes({ status: failed ? "error" : pending ? "loading" : "ready" })}
    >
      {src !== undefined ? (
        // Stays mounted after a failure: its status lives in it (an unmount reports `idle`).
        <StickerImage key={src} src={src} onStatus={setImageStatus} />
      ) : (
        <div className={styles.content} aria-hidden="true">
          {children}
        </div>
      )}
      {failed ? (
        <span className={cx(textRole.caption, styles.fallback)} aria-hidden="true">
          {ariaLabel}
        </span>
      ) : null}
      <Skeleton shape="block" className={styles.placeholder} />
      {overlay}
    </div>
  );
}
MessageSticker.displayName = "Message.Sticker";

defineMessagePart(MessageSticker, {
  shell: "media",
  meta: "overlay",
  picture: true,
  sized: true,
  estimate: () => TOKEN_DEFAULTS["--prime-message-sticker"],
});

import * as React from "react";

import { type ImageStatus, useImageStatus } from "@/hooks/useImageStatus";
import { prefersReducedMotion } from "@/hooks/usePresence";

import { createComponentContext } from "./context";
import { cx } from "./cx";
import { toDataAttributes } from "./data-attributes";
import { exitTimeoutMs } from "./motionTiming";

export type ImageSlotImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt?: string;
  ref?: React.Ref<HTMLImageElement>;
};

export type ImageSlotFallbackProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * Image-with-fallback mechanics shared by Avatar and Thumbnail: the root provides the load status,
 * `Image` reports it (`data-status`: loading → loaded | error), `Fallback` shows through while the
 * image loads or after it fails and is hidden from assistive tech once the image has loaded.
 */
export function createImageSlot(
  name: string,
  classNames: { image: string; fallback: string },
): {
  /** Wraps the root's children; holds the status. */
  ImageSlotProvider: (props: { children: React.ReactNode }) => React.ReactElement;
  /** Throws outside the root (for other parts that must sit inside it). */
  useImageSlot: () => ImageStatus;
  /** The root's status setter, for another media part (a video) that reports its own load. */
  useReportStatus: () => (status: ImageStatus) => void;
  Image: (props: ImageSlotImageProps) => React.ReactElement;
  Fallback: (props: ImageSlotFallbackProps) => React.ReactElement;
} {
  type Value = { imageStatus: ImageStatus; setImageStatus: (status: ImageStatus) => void };
  const [Provider, useSlotContext] = createComponentContext<Value>(name);

  function ImageSlotProvider({ children }: { children: React.ReactNode }) {
    const [imageStatus, setImageStatus] = React.useState<ImageStatus>("idle");
    const value = React.useMemo(() => ({ imageStatus, setImageStatus }), [imageStatus]);
    return <Provider value={value}>{children}</Provider>;
  }

  function ImageInner({ src, alt = "", className, onLoad, onError, ...rest }: ImageSlotImageProps) {
    const { setImageStatus } = useSlotContext();
    const image = useImageStatus(setImageStatus, { onLoad, onError });
    return (
      <img
        // Off-screen pictures (a long chat, a gallery) wait until they come near the view, and
        // decoding never blocks a frame; both can be overridden through the props.
        loading="lazy"
        decoding="async"
        src={src}
        alt={alt}
        className={cx(classNames.image, className)}
        onLoad={image.onLoad}
        onError={image.onError}
        {...toDataAttributes({ status: image.status })}
        {...rest}
      />
    );
  }

  /** The last loaded picture while the next one fades in over it: the same look, out of the tree. */
  function LeavingImage({ image }: { image: ImageSlotImageProps }) {
    const { ref: _ref, src, alt: _alt, className, ...rest } = image;
    return (
      <img
        {...rest}
        src={src}
        alt=""
        aria-hidden="true"
        className={cx(classNames.image, className)}
        data-status="loaded"
        data-leaving=""
      />
    );
  }

  /**
   * A new source starts again at `loading` (a new image keyed by it). The last loaded picture
   * stays as a leaving layer under it until the new one has faded in over it (or failed), so a
   * change of photo cross-fades instead of flashing the fallback; reduced motion drops it at once.
   */
  function Image({ onLoad, onError, onTransitionEnd, ...props }: ImageSlotImageProps) {
    const [shown, setShown] = React.useState<ImageSlotImageProps | null>(null);
    const [leaving, setLeaving] = React.useState<ImageSlotImageProps | null>(null);
    const [src, setSrc] = React.useState(props.src);
    // Derived during render: the old picture stays in the same commit the new one mounts.
    if (props.src !== src) {
      setSrc(props.src);
      setLeaving(shown && !prefersReducedMotion() ? shown : null);
      setShown(null);
    }
    const leavingSrc = leaving?.src;
    // A transition that never reports its end (a hidden tab) still lets the old picture go.
    React.useEffect(() => {
      if (!leavingSrc || !shown) return;
      const timer = window.setTimeout(() => setLeaving(null), exitTimeoutMs("slow"));
      return () => window.clearTimeout(timer);
    }, [leavingSrc, shown]);

    return (
      <>
        {leaving ? <LeavingImage image={leaving} /> : null}
        <ImageInner
          key={props.src}
          {...props}
          onLoad={(event) => {
            setShown(props);
            onLoad?.(event);
          }}
          onError={(event) => {
            setLeaving(null);
            onError?.(event);
          }}
          onTransitionEnd={(event) => {
            if (event.propertyName === "opacity" && shown) setLeaving(null);
            onTransitionEnd?.(event);
          }}
        />
      </>
    );
  }
  Image.displayName = `${name}.Image`;

  function Fallback({ className, ...rest }: ImageSlotFallbackProps) {
    const { imageStatus } = useSlotContext();
    return (
      <span
        className={cx(classNames.fallback, className)}
        aria-hidden={imageStatus === "loaded" ? true : undefined}
        {...rest}
      />
    );
  }
  Fallback.displayName = `${name}.Fallback`;

  return {
    ImageSlotProvider,
    useImageSlot: () => useSlotContext().imageStatus,
    useReportStatus: () => useSlotContext().setImageStatus,
    Image,
    Fallback,
  };
}

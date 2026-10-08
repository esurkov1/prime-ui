import * as React from "react";

import { type ImageStatus, useImageStatus } from "@/hooks/useImageStatus";

import { createComponentContext } from "./context";
import { cx } from "./cx";
import { toDataAttributes } from "./data-attributes";

export type ImageSlotImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  /** Empty (default) when the text next to it already names the subject. */
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

  function Image(props: ImageSlotImageProps) {
    // A new source remounts the image and starts again at `loading`.
    return <ImageInner key={props.src} {...props} />;
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
    Image,
    Fallback,
  };
}

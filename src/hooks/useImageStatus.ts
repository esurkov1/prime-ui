import * as React from "react";

/** Load status of an image part as its root sees it; `idle` = no image part mounted. */
export type ImageStatus = "idle" | "loading" | "loaded" | "error";

type MediaHandlers<E extends Element> = {
  onLoad?: React.ReactEventHandler<E>;
  onError?: React.ReactEventHandler<E>;
  /**
   * An `<img>` counts as loaded only once it is decoded (`HTMLImageElement.decode()`), so it never
   * paints half-ready or blank for a frame; a picture already in the cache counts at once (spread
   * `ref` on the image). `onLoad` follows a load event once decoded. Default `false`.
   */
  decode?: boolean;
};

/**
 * Media side of an image-with-fallback component (Avatar, Thumbnail, a MediaViewer page): tracks
 * the `<img>` (or a `<video>`'s first frame) and reports it to the root through `report`, so the
 * root's Fallback shows while loading and after an error. Key the element by `src`: a new source
 * remounts it and starts again at `loading`. Unmounting the media reports `idle`.
 */
export function useImageStatus<E extends Element = HTMLImageElement>(
  report: (status: ImageStatus) => void,
  { onLoad, onError, decode = false }: MediaHandlers<E> = {},
) {
  const [status, setStatus] = React.useState<Exclude<ImageStatus, "idle">>("loading");
  const settled = React.useRef(false);

  React.useLayoutEffect(() => {
    report("loading");
    return () => report("idle");
  }, [report]);

  const loaded = React.useCallback(
    (element: E, event: React.SyntheticEvent<E> | null) => {
      const settle = () => {
        // Decoding settles once: the cached-picture check and the load event may both come.
        if (decode && (settled.current || !element.isConnected)) return;
        settled.current = true;
        setStatus("loaded");
        report("loaded");
        if (event) onLoad?.(event);
      };
      if (decode && element instanceof HTMLImageElement && typeof element.decode === "function") {
        element.decode().then(settle, settle);
      } else {
        settle();
      }
    },
    [decode, onLoad, report],
  );

  const handleLoad = React.useCallback(
    (event: React.SyntheticEvent<E>) => loaded(event.currentTarget, event),
    [loaded],
  );

  const handleError = React.useCallback(
    (event: React.SyntheticEvent<E>) => {
      setStatus("error");
      report("error");
      onError?.(event);
    },
    [onError, report],
  );

  // A decoded picture in the cache may have loaded before its listener: it is ready at once.
  const ref = React.useCallback(
    (element: E | null) => {
      if (
        decode &&
        element instanceof HTMLImageElement &&
        element.complete &&
        element.naturalWidth > 0
      ) {
        loaded(element, null);
      }
    },
    [decode, loaded],
  );

  return { status, onLoad: handleLoad, onError: handleError, ref };
}

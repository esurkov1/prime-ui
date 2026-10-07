import * as React from "react";

/** Load status of an image part as its root sees it; `idle` = no image part mounted. */
export type ImageStatus = "idle" | "loading" | "loaded" | "error";

type ImageHandlers = {
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
};

/**
 * Image side of an image-with-fallback component (Avatar, Thumbnail): tracks the `<img>` load and
 * reports it to the root through `report`, so the root's Fallback shows while loading and after an
 * error. Key the image element by `src`: a new source remounts it and starts again at `loading`.
 * Unmounting the image reports `idle`.
 */
export function useImageStatus(
  report: (status: ImageStatus) => void,
  { onLoad, onError }: ImageHandlers = {},
) {
  const [status, setStatus] = React.useState<Exclude<ImageStatus, "idle">>("loading");

  React.useLayoutEffect(() => {
    report("loading");
    return () => report("idle");
  }, [report]);

  const handleLoad = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("loaded");
      report("loaded");
      onLoad?.(event);
    },
    [onLoad, report],
  );

  const handleError = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("error");
      report("error");
      onError?.(event);
    },
    [onError, report],
  );

  return { status, onLoad: handleLoad, onError: handleError };
}

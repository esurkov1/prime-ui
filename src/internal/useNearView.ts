import * as React from "react";

/**
 * `true` once the element has come near the view of its scroller (half a viewport ahead) and from
 * then on: heavy media (a video's first frame) mounts only then. Without IntersectionObserver it is
 * `true` at once.
 */
export function useNearView(ref: React.RefObject<Element | null>): boolean {
  const [near, setNear] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (near || !node) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: "50%" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near, ref]);
  return near;
}

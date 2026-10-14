import * as React from "react";

import { useScrollRegion } from "@/hooks/useScrollRegion";

/**
 * `true` once the element has come near the view of its scroller (half a view ahead) and from
 * then on: heavy media (a video's first frame) mounts only then. Inside a `ScrollContainer` the
 * scroller is the observer's root, so a tile below the fold of a chat waits for the chat's scroll,
 * not the page's; elsewhere the viewport. Without IntersectionObserver it is `true` at once.
 */
export function useNearView(ref: React.RefObject<Element | null>): boolean {
  const [near, setNear] = React.useState(false);
  const region = useScrollRegion();
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
      { root: region?.element() ?? null, rootMargin: "50%" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near, ref, region]);
  return near;
}

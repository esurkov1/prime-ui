import * as React from "react";

import enterMotion from "./enterMotion.module.css";
import { leaveInPlace } from "./leaveInPlace";

type PartPresenceOptions = {
  /**
   * Whether the host shows the part now. It enters when this turns on after the host's first
   * render; on the first render it is just there.
   */
  present?: boolean;
  /** The axis the part closes up along when it leaves (`leaveInPlace`). */
  axis: "inline" | "block";
};

type PartPresence<E extends HTMLElement> = {
  /** The part's ref: on unmount, whatever caused it, the part closes up in place. */
  ref: React.RefCallback<E>;
  /** The part's enter class (`enterMotion.enter`) while it is a part that arrived. */
  className: string | undefined;
};

/**
 * Presence of an optional part that comes and goes while its host stays (a clear button, a chip
 * row, a remove segment, a change badge): it rises in when it appears (`enterMotion`; the host
 * tunes it with `--enter-*`) and closes up in place when it goes (`leaveInPlace`), so the parts
 * around it glide instead of jumping. Called by the host that owns the condition; spread the
 * result on the part:
 *
 *   const clear = usePartPresence<HTMLButtonElement>({ present: hasValue, axis: "inline" });
 *   {hasValue ? <button ref={clear.ref} className={cx(styles.clear, clear.className)} /> : null}
 *
 * A part that unmounts itself (a chip removed from a list) passes no `present`: only its exit
 * plays. Reduced motion: the part appears with the fade only and leaves at once.
 */
export function usePartPresence<E extends HTMLElement>({
  present = true,
  axis,
}: PartPresenceOptions): PartPresence<E> {
  const [shown, setShown] = React.useState(present);
  const [entering, setEntering] = React.useState(false);
  // Derived during render: the part mounts with its enter class in the same commit.
  if (present !== shown) {
    setShown(present);
    setEntering(present);
  }
  // A ref cleanup runs while the node is still in the document, whatever unmounts it.
  const ref = React.useCallback(
    (node: E | null) => {
      if (!node) return;
      return () => leaveInPlace(node, axis);
    },
    [axis],
  );
  return { ref, className: entering ? enterMotion.enter : undefined };
}

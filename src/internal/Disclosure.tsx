import * as React from "react";

import { useMergedRefs } from "@/hooks/useMergedRefs";

import { cx } from "./cx";
import styles from "./disclosure.module.css";

type DisclosureOptions = {
  open: boolean;
  /**
   * Open on mount plays the opening, as a part that arrives with its host (a new table row's
   * detail). Without it an open disclosure stands open on mount.
   */
  appear?: boolean;
};

type DisclosureParts = {
  /** Props of the element that folds: its class, `data-state`, `data-mounted` and a ref. */
  root: {
    className: string;
    "data-state": "open" | "closed";
    "data-mounted": "" | undefined;
    ref: React.RefCallback<HTMLElement>;
  };
  /** Props of the clip, the one child of the root that holds the content. */
  clip: { className: string };
};

/**
 * The fold of a part that opens and closes in place, for hosts whose root must be their own
 * element (a `<td>` of a detail row, a list item): spread `root` on the element that folds and
 * `clip` on its one child. `Disclosure` is this on two `<div>`s.
 *
 * The transitions switch on one frame after mount (`data-mounted`), so a state the host settles
 * right after mounting (a restored group, the first reaction) stands still; with `appear`, an
 * open one starts closed and opens on that frame instead.
 */
export function useDisclosure({ open, appear = false }: DisclosureOptions): DisclosureParts {
  const [mounted, setMounted] = React.useState(false);
  const nodeRef = React.useRef<HTMLElement | null>(null);

  // `appear`: the closed state has been laid out (read back here), so switching the transitions
  // on together with `open` plays the opening.
  React.useLayoutEffect(() => {
    if (!appear) return;
    nodeRef.current?.getBoundingClientRect();
    setMounted(true);
  }, [appear]);

  React.useEffect(() => {
    if (appear) return;
    if (typeof requestAnimationFrame !== "function") {
      setMounted(true);
      return;
    }
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [appear]);

  const ref = React.useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  const shown = open && (mounted || !appear);
  return {
    root: {
      className: styles.root,
      "data-state": shown ? "open" : "closed",
      "data-mounted": mounted ? "" : undefined,
      ref,
    },
    clip: { className: styles.clip },
  };
}

export type DisclosureProps = React.HTMLAttributes<HTMLDivElement> &
  DisclosureOptions & {
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * A part that opens and closes in place: its height glides (`0fr ↔ 1fr`) while its content fades
 * and slides on the same clock — one stroke both ways. Always mounted; closed, the content keeps
 * its last state and leaves the accessibility tree once the close has played. The host sets the
 * clocks with `--disclosure-*` (see `disclosure.module.css`). An open one on its first render
 * stands open unless `appear`.
 */
export function Disclosure({ open, appear, className, children, ref, ...rest }: DisclosureProps) {
  const { root, clip } = useDisclosure({ open, appear });
  const mergedRef = useMergedRefs<HTMLDivElement>(root.ref, ref);
  return (
    <div
      {...rest}
      ref={mergedRef}
      className={cx(root.className, className)}
      data-state={root["data-state"]}
      data-mounted={root["data-mounted"]}
    >
      <div className={clip.className}>{children}</div>
    </div>
  );
}

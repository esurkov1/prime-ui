import * as React from "react";

import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";

import { cx } from "./cx";
import styles from "./disclosure.module.css";
import { exitTimeoutMs } from "./motionTiming";

type DisclosureOptions = {
  open: boolean;
  /**
   * Open on mount plays the opening, as a part that arrives with its host (a new table row's
   * detail). Without it an open disclosure stands open on mount.
   */
  appear?: boolean;
  /**
   * Find in page reaches the closed content: once closed it stays searchable
   * (`hidden="until-found"`), and a match calls this — the host opens the part, at once, so the
   * browser scrolls to and marks the match in its place. Without it closed content leaves find in
   * page with the accessibility tree.
   */
  onFound?: () => void;
};

type DisclosureParts = {
  /** Props of the element that folds: its class, `data-state`, `data-mounted` and a ref. */
  root: {
    className: string;
    "data-state": "open" | "closed";
    "data-mounted": "" | undefined;
    "data-findable": "" | undefined;
    ref: React.RefCallback<HTMLElement>;
  };
  /** Props of the clip, the one child of the root that holds the content. */
  clip: { className: string; ref: React.RefCallback<HTMLElement> };
  /**
   * Closed and settled under `onFound`: the content is `hidden="until-found"` (out of the tab
   * order and the accessibility tree, still found by find in page), so the host needs no `inert`.
   */
  findable: boolean;
};

/**
 * The fold of a part that opens and closes in place, for hosts whose root must be their own
 * element (a `<td>` of a detail row, a list item): spread `root` on the element that folds and
 * `clip` on its one child. `Disclosure` is this on two `<div>`s.
 *
 * The transitions switch on one frame after mount (`data-mounted`), so a state the host settles
 * right after mounting (a restored group, the first reaction) stands still; with `appear`, an
 * open one starts closed and opens on that frame instead. A part opened by find in page
 * (`onFound`) opens at once: the transitions are off for that frame.
 */
export function useDisclosure({
  open,
  appear = false,
  onFound,
}: DisclosureOptions): DisclosureParts {
  const [mounted, setMounted] = React.useState(false);
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const clipRef = React.useRef<HTMLElement | null>(null);
  /** Closed with its close played: the content may turn `hidden="until-found"`. */
  const [settled, setSettled] = React.useState(!open);
  /** Opened by find in page: no transition in this frame. */
  const [instant, setInstant] = React.useState(false);
  if (open && settled) setSettled(false);
  const onFoundRef = React.useRef(onFound);
  onFoundRef.current = onFound;
  const searchable = onFound !== undefined;
  const findable = searchable && !open && settled;

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

  // The close has played once `visibility` turns (it waits for the close clock); at once when
  // nothing plays.
  React.useEffect(() => {
    if (!searchable || open || settled) return;
    const node = nodeRef.current;
    const done = () => setSettled(true);
    if (!node || !mounted || prefersReducedMotion()) {
      done();
      return;
    }
    const onEnd = (event: TransitionEvent) => {
      if (event.target === node && event.propertyName === "visibility") done();
    };
    node.addEventListener("transitionend", onEnd);
    const id = window.setTimeout(done, exitTimeoutMs("slow"));
    return () => {
      node.removeEventListener("transitionend", onEnd);
      window.clearTimeout(id);
    };
  }, [searchable, open, settled, mounted]);

  React.useLayoutEffect(() => {
    const clip = clipRef.current;
    if (!clip) return;
    if (findable) clip.setAttribute("hidden", "until-found");
    else clip.removeAttribute("hidden");
  }, [findable]);

  React.useEffect(() => {
    const clip = clipRef.current;
    if (!clip || !searchable) return;
    const onMatch = () => {
      setInstant(true);
      onFoundRef.current?.();
    };
    clip.addEventListener("beforematch", onMatch);
    return () => clip.removeEventListener("beforematch", onMatch);
  }, [searchable]);

  // The part stands open: the transitions come back on the next frame.
  React.useEffect(() => {
    if (!instant || !open) return;
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [instant, open]);

  const ref = React.useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);
  const clipNodeRef = React.useCallback((node: HTMLElement | null) => {
    clipRef.current = node;
  }, []);

  const shown = open && (mounted || !appear);
  return {
    root: {
      className: styles.root,
      "data-state": shown ? "open" : "closed",
      "data-mounted": mounted && !instant ? "" : undefined,
      "data-findable": findable ? "" : undefined,
      ref,
    },
    clip: { className: styles.clip, ref: clipNodeRef },
    findable,
  };
}

type DisclosureProps = React.HTMLAttributes<HTMLDivElement> &
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
export function Disclosure({
  open,
  appear,
  onFound,
  className,
  children,
  ref,
  ...rest
}: DisclosureProps) {
  const { root, clip } = useDisclosure({ open, appear, onFound });
  const mergedRef = useMergedRefs<HTMLDivElement>(root.ref, ref);
  return (
    <div
      {...rest}
      ref={mergedRef}
      className={cx(root.className, className)}
      data-state={root["data-state"]}
      data-mounted={root["data-mounted"]}
      data-findable={root["data-findable"]}
    >
      <div ref={clip.ref} className={clip.className}>
        {children}
      </div>
    </div>
  );
}

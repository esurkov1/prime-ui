import * as React from "react";

import enterMotion from "./enterMotion.module.css";
import { leaveInPlace } from "./leaveInPlace";

/*
 * What the document inserted in this task. One observer of the whole document, started when this
 * module loads (before the first mount, so the first page is seen being inserted); a part reads the
 * pending records when it mounts, and the set lives until the task's microtasks run — the parts of
 * one commit all read the same insertions.
 */
let observer: MutationObserver | null = null;
const inserted = new Set<Node>();
let clearQueued = false;

if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
  // Nothing to do on delivery: the records are read synchronously, at mount (`takeRecords`).
  observer = new MutationObserver(() => {});
  observer.observe(document, { childList: true, subtree: true });
}

/**
 * Whether `node` was just inserted on its own into a host already on screen: the document inserted
 * it in this task, and none of its ancestors. A node mounted together with its host (a new page, a
 * region that swaps in, an opening overlay) has an inserted ancestor; a hydrated node was never
 * inserted. Both stay still.
 */
function appearsInShownHost(node: Node): boolean {
  if (!observer) return false;
  for (const record of observer.takeRecords()) {
    for (const added of record.addedNodes) inserted.add(added);
  }
  if (!clearQueued) {
    clearQueued = true;
    queueMicrotask(() => {
      inserted.clear();
      clearQueued = false;
    });
  }
  if (!inserted.has(node)) return false;
  for (let at = node.parentNode; at; at = at.parentNode) {
    if (inserted.has(at)) return false;
  }
  return true;
}

type EnterOnAppear<E extends Element> = {
  /** On the node that appears (the one its host inserts); it may differ from the one that moves. */
  ref: React.RefCallback<E>;
  /** Join `enterMotion.*` while true. */
  entering: boolean;
};

/**
 * Whether a part plays its enter motion (foundation §1 rule 7, §7): only when it appears after its
 * host is on screen — `active` turns on after the first render (an error, a tab opened again), or
 * its node is inserted on its own into a host already shown (a banner after an event, a bar that
 * selection brings, a keyed excerpt that replaces the last). A part that mounts together with its
 * page, region or overlay is just there. Spread `ref` on the node the host inserts:
 *
 *   const appear = useEnterOnAppear<HTMLDivElement>();
 *   <div ref={useMergedRefs(appear.ref, ref)} className={cx(appear.entering && enterMotion.enter)} />
 */
export function useEnterOnAppear<E extends Element>(active = true): EnterOnAppear<E> {
  const [shown, setShown] = React.useState(active);
  const [turnedOn, setTurnedOn] = React.useState(false);
  const [appeared, setAppeared] = React.useState(false);
  // Derived during render: a part that turns on mounts with its enter class in the same commit.
  if (active !== shown) {
    setShown(active);
    setTurnedOn(active);
  }
  // A ref runs in the commit, before paint: the part that appeared gets its class in the first
  // frame. A node that replaces the last (a `key` change) decides again.
  const ref = React.useCallback((node: E | null) => {
    if (node) setAppeared(appearsInShownHost(node));
  }, []);
  return { ref, entering: active && (turnedOn || appeared) };
}

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
 * around it glide instead of jumping. Called by the host that owns the condition; spread the result
 * on the part:
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

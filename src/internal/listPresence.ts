import * as React from "react";

import { leaveInPlace } from "./leaveInPlace";

/** Rows ghosts close up for at most; a larger change glides the rest into place instead. */
const LEAVE_MAX = 20;

/** What changed in a keyed list since the last render. */
export type ListPresence = {
  /** The keys, in order. */
  keys: readonly string[];
  /**
   * Bumps when the rows should glide from where they stood (a move, an addition, a large
   * removal): the layout key of the host's FLIP (`useFlipList`). A plain removal keeps it, so the
   * rows below follow the closing instead.
   */
  settle: number;
  /** Keys new in the data: their rows rise in once. */
  entering: Set<string>;
  /**
   * Keys taken out: their rows close up in place as they unmount. One set for the life of the
   * list, so a row that unmounts reads the change that removed it.
   */
  leaving: Set<string>;
};

type State = ListPresence & { order: string };

/** Applies a new order to `state` in place (the same order changes nothing). */
function update(state: State, keys: readonly string[]): void {
  const order = keys.join("\u0000");
  if (state.order === order) return;
  const before = new Set(state.keys);
  const after = new Set(keys);
  const added = keys.filter((key) => !before.has(key));
  const removed = state.keys.filter((key) => !after.has(key));
  const keptBefore = state.keys.filter((key) => after.has(key));
  const keptAfter = keys.filter((key) => before.has(key));
  const moved = keptBefore.some((key, index) => keptAfter[index] !== key);
  // Only removed: the rows close up in place (the ones below follow the closing). Anything else
  // glides every row from where it stood.
  const closing = !moved && added.length === 0 && removed.length <= LEAVE_MAX;
  state.entering.clear();
  if (state.keys.length > 0 && added.length <= LEAVE_MAX) {
    for (const key of added) state.entering.add(key);
  }
  state.leaving.clear();
  if (closing) for (const key of removed) state.leaving.add(key);
  if (!closing) state.settle += 1;
  state.order = order;
  state.keys = keys;
}

/**
 * Keyed list enter and leave (foundation §7 rule 11) for a host that renders application data as
 * rows (dialogs, records): called with the keys in order on every render, it says which rows are
 * new, which were taken out, and when the rest should glide. Each row reads it with
 * `useListItemPresence`. The first render enters nothing.
 */
export function useListPresence(keys: readonly string[]): ListPresence {
  const ref = React.useRef<State | null>(null);
  if (ref.current === null) {
    ref.current = {
      order: keys.join("\u0000"),
      keys,
      settle: 0,
      entering: new Set(),
      leaving: new Set(),
    };
  } else {
    update(ref.current, keys);
  }
  const { settle, entering, leaving } = ref.current;
  return { keys: ref.current.keys, settle, entering, leaving };
}

/**
 * One row of a `useListPresence` list: whether it entered (join `enterMotion.enter` on its first
 * render), and on unmount, when the data took it out, the element in `node` closes up in place
 * along `axis` (the list's stacking axis: `block` for rows, `inline` for the slots of a row).
 */
export function useListItemPresence(
  list: Pick<ListPresence, "entering" | "leaving">,
  key: string,
  node: React.RefObject<HTMLElement | null>,
  axis: "inline" | "block",
): boolean {
  const [entered] = React.useState(() => list.entering.has(key));
  const { entering, leaving } = list;
  React.useEffect(() => {
    entering.delete(key);
  }, [entering, key]);
  React.useLayoutEffect(() => {
    const element = node.current;
    return () => {
      if (element && leaving.has(key)) {
        leaving.delete(key);
        leaveInPlace(element, axis);
      }
    };
  }, [leaving, key, node, axis]);
  return entered;
}

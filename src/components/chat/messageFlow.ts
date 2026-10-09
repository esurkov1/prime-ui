import type { MessageDirection } from "@/components/message/types";
import type { ScrollRegion } from "@/components/scroll-container/useScrollEdges";

/** A message of the conversation in data order: its value and side. */
export type FlowEntry = { value: string; direction: MessageDirection };

/**
 * The flow of a conversation: which messages are new at its end, decided from the data — never
 * from the DOM, so a row that mounts because it scrolled into view is never taken for a new one.
 *
 * Each render the group plans the list against the last committed one (`plan`): values after the
 * last value it already knew are new at the end; values before it are history loaded above. A new
 * message's row (if it renders) enters (`isFresh` → `data-enter`, one CSS keyframe on its column).
 * When the commit lands (`commit`), the owner hears `onNewMessage` for each, an own message brings
 * the reader to the end, and incoming ones count on the «новых» button while the reader is away.
 * The first commit and a list replaced as a whole (another conversation) are never new — except a
 * single message in a conversation that was empty.
 */
export type MessageFlow = {
  /** Plans the values of this render against the last commit (pure: same input, same plan). */
  plan: (values: readonly string[]) => void;
  /** The message is new at the end in the planned render: its row enters. */
  isFresh: (value: string) => boolean;
  /** The render with these entries committed: arrivals are heard. */
  commit: (entries: readonly FlowEntry[]) => void;
  /** Incoming messages that arrived while the reader was away from the end. */
  unseen: () => number;
  /**
   * A message is new at the end in the commit under way (`Message.Typing` gives way to the reply
   * that replaces it).
   */
  arrivedNow: () => boolean;
  subscribe: (listener: () => void) => () => void;
  clearUnseen: () => void;
};

type FlowOptions = {
  region: () => ScrollRegion | null;
  onNew: (value: string, direction: MessageDirection) => void;
};

function newAtEnd(known: readonly string[] | null, values: readonly string[]): Set<string> {
  const fresh = new Set<string>();
  if (known === null) return fresh;
  const seen = new Set(known);
  let last = -1;
  for (let index = values.length - 1; index >= 0; index--) {
    if (seen.has(values[index] as string)) {
      last = index;
      break;
    }
  }
  if (last === -1) {
    // Nothing known stays: a conversation that was empty takes its first message as new; a list
    // replaced as a whole is another conversation.
    if (known.length === 0 && values.length === 1) fresh.add(values[0] as string);
    return fresh;
  }
  for (let index = last + 1; index < values.length; index++) fresh.add(values[index] as string);
  return fresh;
}

export function createMessageFlow({ region, onNew }: FlowOptions): MessageFlow {
  /** The values of the last commit; `null` before the first one. */
  let committed: readonly string[] | null = null;
  let planned = new Set<string>();
  let unseen = 0;
  const listeners = new Set<() => void>();
  const notify = () => {
    for (const listener of listeners) listener();
  };

  /** The owner hears it; mine brings the reader to the end, theirs counts while they are away. */
  const arrive = (value: string, direction: MessageDirection) => {
    const scroller = region();
    if (direction === "outgoing") {
      if (scroller && !scroller.atEnd()) scroller.scrollToEnd("smooth");
    } else if (scroller && !scroller.atEnd()) {
      unseen += 1;
      notify();
    }
    onNew(value, direction);
  };

  return {
    plan(values) {
      planned = newAtEnd(committed, values);
    },
    isFresh: (value) => planned.has(value),
    commit(entries) {
      const arrivals = entries.filter((entry) => planned.has(entry.value));
      committed = entries.map((entry) => entry.value);
      planned = new Set();
      for (const entry of arrivals) arrive(entry.value, entry.direction);
    },
    unseen: () => unseen,
    arrivedNow: () => planned.size > 0,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    clearUnseen() {
      if (unseen === 0) return;
      unseen = 0;
      notify();
    },
  };
}

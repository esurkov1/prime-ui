import * as React from "react";

import type {
  MessageDirection,
  MessageReactionOption,
  MessageUser,
} from "@/components/message/types";
import type { RangeSelectionHandlers } from "@/internal/useRangeSelection";

/**
 * The contract between a message list (`Chat.Messages`) and the messages in it (`Message.Root`,
 * `Message.Typing`).
 *
 * The list owns what spans messages: the selection, the window of rendered rows, jumps, read
 * receipts, the quick reaction and the reaction bar's options. A message reads it here and never
 * imports the list. Outside a list every value is the inert default: a message stands alone.
 */

/** A message row of a list (`Message.Root` marks its `<article>` with it). */
export const ARTICLE = "[data-message-article]";

/** The quick reaction of a double tap. */
export const DEFAULT_QUICK_REACTION = "👍";

// ─── Selection store ──────────────────────────────────────────────────────────

/** The values of the selected messages, `null` while not selecting. */
export type Selection = readonly string[] | null;

/**
 * The selection of a list, outside React state: each message subscribes to its own state in it
 * (`useMessageSelection`), so a toggle re-renders the messages whose state changed, not the list.
 */
export type SelectionStore = {
  get: () => Selection;
  /** `0` — not selecting, `1` — selecting, not selected, `2` — selected. */
  stateOf: (value: string) => 0 | 1 | 2;
  set: (next: Selection) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createSelectionStore(initial: Selection): SelectionStore {
  let selection = initial;
  let lookup = new Set(initial ?? []);
  const listeners = new Set<() => void>();
  return {
    get: () => selection,
    stateOf: (value) => (selection === null ? 0 : lookup.has(value) ? 2 : 1),
    set(next) {
      if (next === selection) return;
      selection = next;
      lookup = new Set(next ?? []);
      for (const listener of listeners) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

export type MessageListContextValue = {
  /** Inside a list: messages stand in rows of it. `false` — a message on its own. */
  inList: boolean;
  /**
   * A group chat: incoming messages keep a gutter for the author's avatar, the first message of an
   * author's run shows the author's header and the last one the avatar.
   */
  group: boolean;
  /**
   * A message's article mounted (its layout effect): it enters when the list planned it as new at
   * the end, and is watched for `onRead`. Returns the unregister.
   */
  register: (article: HTMLElement, value: string, direction: MessageDirection) => () => void;
  /** A message was new at the end in this commit. */
  arrivedNow: () => boolean;
  /**
   * Brings a message into view and points at it (unless `flash` is `false`: the others blink
   * around it); `focus` moves the focus to it too.
   */
  reveal: (value: string, focus?: boolean, flash?: boolean) => boolean;
  /** The selection; read it through `useMessageSelection` / `useListSelection`. */
  selection: SelectionStore;
  /** Selection mode can be entered (the list owns a selection). */
  selectable: boolean;
  setSelected: (next: Selection) => void;
  /** Selection by click, Shift range and drag over the messages (`internal/useRangeSelection`). */
  range: RangeSelectionHandlers;
  /** The place of a message in the list. */
  indexOf: (article: Element) => number;
  /** What the parts of a message keep while its row is out of the window, by message value. */
  memoryOf: (value: string) => Map<string, unknown>;
  /** A message changes size in place: the scroller keeps the view still while it plays. */
  hold: (() => void) | undefined;
  /** The emoji of a double tap; `false` — off. */
  quickReaction: string | false;
  /** The reactions of the reaction bar; `null` — the message's defaults. */
  reactionOptions: readonly MessageReactionOption[] | null;
  /** The reader: joins a reaction's avatars at once when they put it. */
  reader: MessageUser | undefined;
  /** Says `text` in the list's polite live region. */
  announce: (text: string) => void;
};

const NO_SELECTION = createSelectionStore(null);

const MessageListContext = React.createContext<MessageListContextValue>({
  inList: false,
  group: false,
  register: () => () => {},
  arrivedNow: () => false,
  reveal: () => false,
  selection: NO_SELECTION,
  selectable: false,
  setSelected: () => {},
  range: { onPointerDown: () => {}, onClick: () => {} },
  indexOf: () => -1,
  memoryOf: () => new Map(),
  hold: undefined,
  quickReaction: DEFAULT_QUICK_REACTION,
  reactionOptions: null,
  reader: undefined,
  announce: () => {},
});
MessageListContext.displayName = "MessageListContext";

/** The list provides it to its messages. */
export const MessageListProvider = MessageListContext.Provider;

/**
 * The list's settings. Stable while the list's props are: the selection is not in it, so a toggle
 * or a drag step does not re-render the messages.
 */
export function useMessageList(): MessageListContextValue {
  return React.useContext(MessageListContext);
}

/** This message in selection mode: whether the list is selecting and whether it is selected. */
export function useMessageSelection(value: string): { selecting: boolean; selected: boolean } {
  const { selection } = React.useContext(MessageListContext);
  const read = () => selection.stateOf(value);
  const state = React.useSyncExternalStore(selection.subscribe, read, read);
  return { selecting: state !== 0, selected: state === 2 };
}

/** The whole selection of the list. */
export function useListSelection(): Selection {
  const { selection } = React.useContext(MessageListContext);
  return React.useSyncExternalStore(selection.subscribe, selection.get, selection.get);
}

// ─── Rows ─────────────────────────────────────────────────────────────────────

/** What a message row says about itself from its props alone, before it renders. */
export type MessageRowDescription = {
  value: string | undefined;
  direction: MessageDirection;
  /** The row's height before it is measured (px). */
  estimate: number;
  /** The text a search looks in: the message's text and transcripts. */
  text: string;
};

/**
 * What a top-level child of a list is. Every child is a row (a message, a fragment with one, a
 * date, a service line, the unread band) except the parts that live at the list's end (`tail`:
 * typing, the selection bar). A `message` row describes itself; a `sticky` row is a date that
 * sticks while its day scrolls.
 */
export type RowKind = {
  tail?: boolean;
  sticky?: boolean;
  message?: (props: Record<string, unknown>) => MessageRowDescription;
};

const ROW_KINDS = new WeakMap<object, RowKind>();

/** The parts of the kit declare how a list lays them out (compared by element type). */
export function defineRowKind(type: object, kind: RowKind): void {
  ROW_KINDS.set(type, kind);
}

/** The row kind of an element, if its type declared one. */
export function rowKindOf(node: React.ReactNode): RowKind | undefined {
  return React.isValidElement(node) && typeof node.type !== "string"
    ? ROW_KINDS.get(node.type as object)
    : undefined;
}

/**
 * A message row as the list sees it: its value (the message's own `value`, else the row's key)
 * and its place among the messages of the list (`aria-posinset` / `aria-setsize`).
 */
export type MessageRowInfo = { value: string; position: number; size: number };

const RowContext = React.createContext<MessageRowInfo | null>(null);

/** The list wraps every row in it. */
export const MessageRowProvider = RowContext.Provider;

export function useMessageRow(): MessageRowInfo | null {
  return React.useContext(RowContext);
}

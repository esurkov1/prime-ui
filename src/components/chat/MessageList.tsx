import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import type {
  MessageDirection,
  MessageReactionOption,
  MessageUser,
} from "@/components/message/types";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion, usePresence } from "@/hooks/usePresence";
import { useScrollRegion } from "@/hooks/useScrollRegion";
import { useVirtualRows } from "@/hooks/useVirtualRows";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import {
  ARTICLE,
  createSelectionStore,
  DEFAULT_QUICK_REACTION,
  defineRowKind,
  type MessageListContextValue,
  MessageListProvider,
  type MessageRowInfo,
  MessageRowProvider,
  rowKindOf,
  type Selection,
  useListSelection,
  useMessageList,
} from "@/internal/messageList";
import { MessageHighlightContext } from "@/internal/messagePart";
import { createReadReceipts, type ReadReceipts } from "@/internal/readReceipts";
import { useRangeSelection } from "@/internal/useRangeSelection";

import styles from "./Chat.module.css";
import { createMessageFlow, type MessageFlow } from "./messageFlow";

export type MessageListLabels = {
  /** The count of the selection bar: `{count}`. */
  selectedCount: string;
  /** The button of the selection bar that leaves selection mode. */
  cancel: string;
  /** Name of the button that goes to the newest message. */
  scrollToEnd: string;
  /** Name of that button while new messages wait below: `{count}`. */
  newMessages: string;
};

export const MESSAGE_LIST_LABELS: MessageListLabels = {
  selectedCount: "Выбрано: {count}",
  cancel: "Отмена",
  scrollToEnd: "К последним сообщениям",
  newMessages: "Новых сообщений: {count}. К последним сообщениям",
};

/** What the list's own parts (the selection bar) read: its element and its strings. */
type ListChrome = {
  container: React.RefObject<HTMLDivElement | null>;
  labels: MessageListLabels;
};

const ChromeContext = React.createContext<ListChrome>({
  container: { current: null },
  labels: MESSAGE_LIST_LABELS,
});

// ─── List ─────────────────────────────────────────────────────────────────────

export type MessageListProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * A group chat: incoming messages keep a gutter for the author's avatar, the first message of a
   * run shows its author's header, the last one the avatar. Default `false`.
   */
  group?: boolean;
  /**
   * Selection mode (controlled): the `value`s of the selected messages, `null` while not selecting.
   * Any of the triad lets a message's menu start selection («Выбрать»).
   */
  selected?: Selection;
  /** Initial selection (uncontrolled). Default `null`. */
  defaultSelected?: Selection;
  /** The selection changed: a message toggled, selection started (`[value]`) or ended (`null`). */
  onSelectedChange?: (selected: Selection) => void;
  /** The emoji a double tap (or `L` on a focused message) puts or takes back. Default «👍»; `false` — off. */
  quickReaction?: string | false;
  /**
   * The reactions of the reaction bar (long press, a long hover, `R`): the first seven in its row,
   * the rest behind «⌄». `label` names each for assistive tech.
   */
  reactionOptions?: readonly MessageReactionOption[];
  /**
   * The reader (`{ id, name: "Вы", src }`): a reaction they put shows their avatar among
   * `MessageReaction.users` at once, before the data comes back.
   */
  reader?: MessageUser;
  /**
   * A message was added at the end after the list mounted — sent or received; never the first
   * render, history loaded above or a message put back in the middle. For a sound, a counter,
   * a title badge. The message enters on its own either way.
   */
  onNewMessage?: (value: string, details: { direction: MessageDirection }) => void;
  /**
   * Incoming messages the reader has seen: at least half of each (or half the view) on screen
   * while the page is visible. Batched per frame, each `value` once per mount. Send read receipts
   * from here and set `status="read"` on the other side.
   */
  onRead?: (values: string[]) => void;
  /**
   * The current message of a search or a jump: when it changes the list brings it into view in
   * its scroller and points at it: the other messages step back and forth around it, or, while a
   * search `highlight` is on, stay back while it is current. Focus stays where it is (the search
   * field).
   */
  current?: string | null;
  /** A search query: every match in `Message.Text` and transcripts is marked. */
  highlight?: string;
  /** The messages whose text holds `highlight`, in list order (oldest first), as they change. */
  onMatchesChange?: (values: readonly string[]) => void;
  /** Receives the list's jump: bring a message into view and blink it. */
  revealRef?: React.Ref<((value: string) => void) | null>;
  labels?: Partial<MessageListLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

const articlesOf = (container: HTMLElement | null) =>
  Array.from(container?.querySelectorAll<HTMLElement>(ARTICLE) ?? []);

/** Under reduced motion the others of a jump stand back this long, then come forward. */
const STILL_POINT_MS = 1200;
/** A blink whose end is never seen lets go after this. */
const POINT_LIMIT_MS = 2000;

/** A jump further than this many views lands at once (then settles), nearer ones glide. */
const GLIDE_VIEWS = 2;

/** The element that scrolls the list: its ScrollContainer, or the nearest scrolling ancestor. */
function scrollerOf(list: HTMLElement | null): HTMLElement | null {
  for (let node = list?.parentElement ?? null; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
  }
  return null;
}

// ─── Rows ─────────────────────────────────────────────────────────────────────

type Row = {
  key: string;
  element: React.ReactElement;
  sticky: boolean;
  /** The message of the row, if it holds one. */
  value?: string;
  direction: MessageDirection;
  /** The row's height before it is measured (px): stable per element. */
  estimate: number;
  /** What a search looks in (lower case). */
  text: string;
};

/** A row's size when nothing better is known (a date, a band, an own component). */
const ROW_ESTIMATE = 64;

/** The message element of a row: the row itself or the message inside its fragment. */
function messageIn(element: React.ReactElement): React.ReactElement | null {
  if (rowKindOf(element)?.message) return element;
  if (element.type !== React.Fragment) return null;
  for (const child of React.Children.toArray(
    (element.props as { children?: React.ReactNode }).children,
  )) {
    if (React.isValidElement(child)) {
      const found = messageIn(child);
      if (found) return found;
    }
  }
  return null;
}

/** Parsed once per element: a list re-rendered with the same elements reads nothing again. */
const parsed = new WeakMap<object, Omit<Row, "key" | "element">>();

function rowOf(element: React.ReactElement, key: string): Row {
  let info = parsed.get(element);
  if (!info) {
    const kind = rowKindOf(element);
    const message = messageIn(element);
    const described = message
      ? (rowKindOf(message)?.message?.(message.props as Record<string, unknown>) ?? null)
      : null;
    // An own component standing for a message carries its value as `key` and may pass
    // `direction`; a date or a band is not a message.
    const own = !kind && element.type !== React.Fragment && typeof element.type !== "string";
    const props = element.props as { direction?: MessageDirection };
    info = {
      sticky: kind?.sticky === true,
      value: described ? (described.value ?? key) : own ? key : undefined,
      direction: described?.direction ?? props.direction ?? "incoming",
      // A fragment adds its other rows (the unread band before a message).
      estimate:
        (described?.estimate ?? ROW_ESTIMATE) +
        (message && message !== element
          ? (React.Children.toArray((element.props as { children?: React.ReactNode }).children)
              .length -
              1) *
            ROW_ESTIMATE
          : 0),
      text: described?.text.toLowerCase() ?? "",
    };
    parsed.set(element, info);
  }
  return { key, element, ...info };
}

/** The rows and the tail of the list's children. */
function rowsOf(children: React.ReactNode): { rows: Row[]; tail: React.ReactNode[] } {
  const rows: Row[] = [];
  const tail: React.ReactNode[] = [];
  // `forEach` hands over the owner's own elements (`toArray` would clone each one): a row parsed
  // once stays parsed while the owner keeps its element.
  let index = 0;
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (rowKindOf(child)?.tail) {
      tail.push(child);
      return;
    }
    rows.push(rowOf(child, child.key ?? `.${index}`));
    index += 1;
  });
  return { rows, tail };
}

const sameList = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

/** Extra rows the window renders above and below the view. */
const OVERSCAN = 8;

/**
 * The conversation: a `role="log"` (new messages are announced politely) of `Message.Root` rows,
 * date separators and service lines. One tab stop for the whole list: arrows move between
 * messages, Home / End go to the first / last; Tab goes into the controls of a message. In
 * selection mode it is a multiselectable listbox; Escape leaves it.
 *
 * Inside a ScrollContainer it renders only the rows around the view (`useVirtualRows`): rows in
 * normal flow between two spacers, each measured once and cached by key, sticky dates kept. The
 * scroller keeps what the reader looks at in place when rows above change (ScrollContainer
 * `anchor="end"`); jumps, search, selection ranges, the keyboard and playing media reach or keep
 * rows that are not rendered.
 */
export function MessageList({
  group = false,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  quickReaction = DEFAULT_QUICK_REACTION,
  reactionOptions,
  reader,
  onNewMessage,
  onRead,
  current: currentProp,
  highlight = "",
  onMatchesChange,
  revealRef,
  labels: labelsProp,
  className,
  children,
  onKeyDown,
  onFocus,
  ref,
  ...rest
}: MessageListProps) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(innerRef, ref);
  /**
   * The message the chat points at (CSS, from `data-pointing` on the list and `data-pointed` on
   * the message). A jump blinks it (`a` / `b`, flipped so a repeated jump restarts) and lets go;
   * the current search match keeps the others back.
   * Kept by value, so a row that renders again while pointed at is marked again.
   */
  const pointed = React.useRef<string | null>(null);
  const pointRun = React.useRef(0);
  /** Lets go of the run `run` (any while it is the latest; `"current"` — only a search's mark). */
  const unpoint = React.useCallback((run: number | "current") => {
    const element = innerRef.current;
    if (!element) return;
    if (run === "current" ? element.dataset.pointing !== "current" : run !== pointRun.current)
      return;
    delete element.dataset.pointing;
    for (const article of element.querySelectorAll<HTMLElement>("[data-pointed]")) {
      delete article.dataset.pointed;
    }
    pointed.current = null;
  }, []);
  const point = React.useCallback(
    (article: HTMLElement, mode: "blink" | "current") => {
      const element = innerRef.current;
      if (!element) return;
      for (const other of element.querySelectorAll<HTMLElement>("[data-pointed]")) {
        if (other !== article) delete other.dataset.pointed;
      }
      article.dataset.pointed = "";
      pointed.current = article.dataset.messageValue ?? null;
      const run = ++pointRun.current;
      element.dataset.pointing =
        mode === "current" ? "current" : element.dataset.pointing === "a" ? "b" : "a";
      if (mode === "current") return;
      // The blink's end lets go; under reduced motion (no blink), the time.
      const onEnd = (event: AnimationEvent) => {
        if (!event.animationName?.includes("messagePointing")) return;
        element.removeEventListener("animationend", onEnd);
        unpoint(run);
      };
      element.addEventListener("animationend", onEnd);
      window.setTimeout(
        () => {
          element.removeEventListener("animationend", onEnd);
          unpoint(run);
        },
        prefersReducedMotion() ? STILL_POINT_MS : POINT_LIMIT_MS,
      );
    },
    [unpoint],
  );
  const region = useScrollRegion();
  const regionRef = React.useRef(region);
  regionRef.current = region;
  const handlers = React.useRef({ onNewMessage, onRead });
  handlers.current = { onNewMessage, onRead };

  // ── rows ──
  const { rows, tail } = rowsOf(children);
  const rowsRef = React.useRef(rows);
  rowsRef.current = rows;
  // The list's shape: rows are new elements on every render of the owner, their keys decide.
  const signature = rows.map((row) => `${row.key}\u0000${row.value ?? ""}`).join("\u0001");
  // biome-ignore lint/correctness/useExhaustiveDependencies: the signature stands for the rows
  const messages = React.useMemo(
    () => rowsRef.current.filter((row) => row.value !== undefined),
    [signature],
  );
  const valuesRef = React.useRef<readonly string[]>([]);
  valuesRef.current = messages.map((row) => row.value as string);

  // The search: the messages whose text holds the query, reported when the set changes.
  const query = highlight.trim().toLowerCase();
  const matches = query
    ? rows.flatMap((row) =>
        row.value !== undefined && row.text.includes(query) ? [row.value] : [],
      )
    : [];
  const reported = React.useRef<readonly string[]>([]);
  const onMatchesRef = React.useRef(onMatchesChange);
  onMatchesRef.current = onMatchesChange;
  React.useLayoutEffect(() => {
    if (sameList(reported.current, matches)) return;
    reported.current = matches;
    onMatchesRef.current?.(matches);
  });

  // The flow of new messages and the read receipts live outside React state: a message that
  // arrives renders itself, not the list.
  const [flow] = React.useState<MessageFlow>(() =>
    createMessageFlow({
      region: () => regionRef.current,
      onNew: (value, direction) => handlers.current.onNewMessage?.(value, { direction }),
    }),
  );
  flow.plan(valuesRef.current);
  React.useLayoutEffect(() => {
    flow.commit(messages.map((row) => ({ value: row.value as string, direction: row.direction })));
  }, [flow, messages]);
  const receipts = React.useRef<ReadReceipts | null>(null);
  const receiptsOf = React.useCallback(() => {
    receipts.current ??= createReadReceipts((values) => handlers.current.onRead?.(values));
    return receipts.current;
  }, []);
  React.useEffect(
    () => () => {
      receipts.current?.disconnect();
      receipts.current = null;
    },
    [],
  );
  const register = React.useCallback(
    (article: HTMLElement, value: string, direction: MessageDirection) => {
      if (flow.isFresh(value)) {
        article.dataset.enter = direction;
        // The message column plays it (a direct child of the article).
        const clear = (event: AnimationEvent) => {
          const target = event.target as Element | null;
          if (target !== article && target?.parentElement !== article) return;
          delete article.dataset.enter;
          article.removeEventListener("animationend", clear);
        };
        article.addEventListener("animationend", clear);
      }
      if (value === pointed.current) article.dataset.pointed = "";
      const watch = direction === "incoming" ? receiptsOf() : null;
      watch?.observe(article, value);
      return () => watch?.unobserve(article);
    },
    [flow, receiptsOf],
  );
  // What the parts of a message keep while its row is out of the window (an open transcript).
  const [memories] = React.useState(() => new Map<string, Map<string, unknown>>());
  const memoryOf = React.useCallback(
    (value: string) => {
      let memory = memories.get(value);
      if (!memory) {
        memory = new Map();
        memories.set(value, memory);
      }
      return memory;
    },
    [memories],
  );

  // A size change in place plays on the message clock as one stroke (`bubbleMorph`): the view
  // holds still for it.
  const holdView = React.useMemo(
    () => (region ? () => region.hold("--prime-message-morph-duration") : undefined),
    [region],
  );

  // ── window ──
  const scrollerRef = React.useRef<HTMLElement | null>(null);
  // Found once (a style read up the tree), again only when the group moved to another scroller.
  React.useLayoutEffect(() => {
    if (!region) scrollerRef.current = null;
    else if (!scrollerRef.current?.contains(innerRef.current)) {
      scrollerRef.current = scrollerOf(innerRef.current);
    }
  });
  // biome-ignore lint/correctness/useExhaustiveDependencies: the signature stands for the rows
  const keys = React.useMemo(() => rowsRef.current.map((row) => row.key), [signature]);
  const getKey = React.useCallback((index: number) => keys[index] ?? index, [keys]);
  const estimateSize = React.useCallback(
    (index: number) => rowsRef.current[index]?.estimate ?? ROW_ESTIMATE,
    [],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: the signature stands for the rows
  const stickyRows = React.useMemo(
    () => rowsRef.current.flatMap((row, index) => (row.sticky ? [index] : [])),
    [signature],
  );
  /** Where the list starts in the scroller's content (content above it: a history skeleton). */
  const offset = React.useCallback(() => {
    const element = innerRef.current;
    const scroller = scrollerRef.current;
    if (!element || !scroller) return 0;
    return (
      element.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop
    );
  }, []);
  // Rows the window keeps whatever the scroll: the focused message, a playing one, a jump target.
  const [held, setHeld] = React.useState<{ focus?: string; media?: string; target?: string }>({});
  const keepRow = React.useCallback(
    (reason: "focus" | "media" | "target", value: string | undefined) =>
      setHeld((current) => (current[reason] === value ? current : { ...current, [reason]: value })),
    [],
  );
  const indexOfValue = React.useCallback(
    (value: string) => rowsRef.current.findIndex((row) => row.value === value),
    [],
  );
  const pinned = [held.focus, held.media, held.target]
    .filter((value): value is string => value !== undefined)
    .map(indexOfValue)
    .filter((index) => index >= 0);
  const virtual = useVirtualRows({
    count: rows.length,
    scrollRef: scrollerRef,
    getKey,
    estimateSize,
    offset,
    overscan: OVERSCAN,
    pinned,
    initialAlign: "end",
    sticky: stickyRows,
  });
  const windowed = region !== null;

  // A playing player keeps its row rendered while it scrolls away (it would stop on unmount).
  React.useEffect(() => {
    const element = innerRef.current;
    if (!element) return;
    const messageOf = (event: Event) =>
      (event.target as Element | null)?.closest<HTMLElement>(ARTICLE)?.dataset.messageValue;
    const onPlay = (event: Event) => keepRow("media", messageOf(event));
    const onStop = (event: Event) => {
      const media = event.target as HTMLMediaElement;
      if (media.paused || media.ended) keepRow("media", undefined);
    };
    element.addEventListener("play", onPlay, true);
    element.addEventListener("pause", onStop, true);
    element.addEventListener("ended", onStop, true);
    return () => {
      element.removeEventListener("play", onPlay, true);
      element.removeEventListener("pause", onStop, true);
      element.removeEventListener("ended", onStop, true);
    };
  }, [keepRow]);

  /** The messages in the order of the list (rendered or not). */
  const orderOf = React.useCallback((): readonly string[] => valuesRef.current, []);
  const articleOf = React.useCallback(
    (value: string) =>
      articlesOf(innerRef.current).find((item) => item.dataset.messageValue === value) ?? null,
    [],
  );

  // A jump to a message the window does not render: the scroller goes to its estimated place, the
  // window renders it there (it is held), and once it is in the DOM the jump finishes on it.
  const pending = React.useRef<{ value: string; run: (article: HTMLElement) => void } | null>(null);
  /**
   * Brings a message into view in the list's own scroller (never the page) and runs `then` on
   * it. A near one glides there; a far one lands at once and is centred again once the rows around
   * it have laid out.
   */
  const bringIntoView = React.useCallback(
    (value: string, then?: (article: HTMLElement) => void) => {
      const scroller = regionRef.current;
      const view = scrollerRef.current;
      const article = articleOf(value);
      if (!article) {
        const index = indexOfValue(value);
        if (index < 0) return false;
        if (view) {
          view.scrollTop = offset() + virtual.startOf(index) - view.clientHeight / 2;
        }
        pending.current = { value, run: (found) => then?.(found) };
        keepRow("target", value);
        return true;
      }
      if (scroller) {
        const distance = view
          ? Math.abs(
              article.getBoundingClientRect().top -
                view.getBoundingClientRect().top -
                view.clientHeight / 2,
            )
          : 0;
        const far = view !== null && distance > view.clientHeight * GLIDE_VIEWS;
        scroller.scrollToElement(article, far ? "auto" : "smooth");
        if (far) {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              if (article.isConnected) scroller.scrollToElement(article, "auto");
            }),
          );
        }
      }
      then?.(article);
      return true;
    },
    [articleOf, indexOfValue, offset, virtual.startOf, keepRow],
  );
  // The held target has rendered: finish the jump on it, centred once its neighbours have laid out.
  React.useLayoutEffect(() => {
    const jump = pending.current;
    if (!jump) return;
    const article = articleOf(jump.value);
    if (!article) return;
    pending.current = null;
    const scroller = regionRef.current;
    scroller?.scrollToElement(article, "auto");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (article.isConnected) scroller?.scrollToElement(article, "auto");
        keepRow("target", undefined);
      }),
    );
    jump.run(article);
  });
  const reveal = React.useCallback(
    (value: string, focus = false, flash = true) =>
      bringIntoView(value, (article) => {
        if (focus) article.focus({ preventScroll: true });
        if (flash) point(article, "blink");
      }),
    [bringIntoView, point],
  );
  React.useImperativeHandle(revealRef, () => (value: string) => void reveal(value), [reveal]);
  // The current match of a search keeps the others back while it is current; any other jump
  // blinks the message once. Moving to the next match moves the mark in one step (no flicker between).
  const searching = highlight.trim() !== "";
  React.useEffect(() => {
    if (!currentProp) return;
    let live = true;
    bringIntoView(currentProp, (article) => {
      if (live) point(article, searching ? "current" : "blink");
    });
    return () => {
      live = false;
    };
  }, [currentProp, searching, bringIntoView, point]);
  React.useEffect(() => {
    if (!currentProp || !searching) unpoint("current");
  }, [currentProp, searching, unpoint]);

  /** Focus on a message and the least scroll of the list's own scroller to show it. */
  const focusMessage = React.useCallback(
    (value: string) => {
      const article = articleOf(value);
      if (!article) {
        bringIntoView(value, (found) => found.focus({ preventScroll: true }));
        return;
      }
      article.focus({ preventScroll: true });
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const box = scroller.getBoundingClientRect();
      const rect = article.getBoundingClientRect();
      if (rect.top < box.top) scroller.scrollTop += rect.top - box.top;
      else if (rect.bottom > box.bottom) {
        scroller.scrollTop += Math.min(rect.bottom - box.bottom, rect.top - box.top);
      }
    },
    [articleOf, bringIntoView],
  );

  const selectable = selectedProp !== undefined || onSelectedChange !== undefined;
  const [selected, setSelectedState] = useControllableState<Selection>({
    value: selectedProp,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });
  // Stable for the context: the setter changes with every inline `onSelectedChange`.
  const setSelectedRef = React.useRef(setSelectedState);
  setSelectedRef.current = setSelectedState;
  const setSelected = React.useCallback((next: Selection) => setSelectedRef.current(next), []);
  const [selection] = React.useState(() => createSelectionStore(selected));
  React.useLayoutEffect(() => selection.set(selected), [selection, selected]);

  // The announcer keeps its own state: an announcement never re-renders the messages.
  const announcer = React.useRef<(text: string) => void>(() => {});
  const announce = React.useCallback((text: string) => announcer.current(text), []);
  const labels = useLabels(MESSAGE_LIST_LABELS, labelsProp);
  const selecting = selected !== null;

  /** The selection as of the last commit: a drag commits several times before a render. */
  const latest = React.useRef(selected);
  latest.current = selected;
  const range = useRangeSelection<string>({
    // In the data's order: a range or a drag runs over rows the window does not render too.
    keys: () => orderOf(),
    isSelected: (key) => latest.current?.includes(key) ?? false,
    apply: (keys, on) => {
      const next = new Set(latest.current ?? []);
      for (const key of keys) {
        if (on) next.add(key);
        else next.delete(key);
      }
      latest.current = Array.from(next);
      setSelected(latest.current);
    },
    containerRef: innerRef,
    hit: (element) => {
      const value = element.closest<HTMLElement>(ARTICLE)?.dataset.messageValue;
      const index = value === undefined ? -1 : orderOf().indexOf(value);
      return index < 0 ? null : index;
    },
    touch: true,
    autoScroll: true,
  });

  // Roving tab stop: exactly one message is reachable by Tab — the last focused, else the newest
  // rendered. Every message renders `tabIndex={-1}`; the group lifts one to `0`.
  const stop = React.useRef<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    if (stop.current?.isConnected && stop.current.tabIndex === 0) return;
    const articles = innerRef.current?.querySelectorAll<HTMLElement>(ARTICLE);
    const last = articles?.[articles.length - 1];
    if (!last) return;
    stop.current = last;
    last.tabIndex = 0;
  });

  const indexOf = React.useCallback(
    (article: Element) => orderOf().indexOf((article as HTMLElement).dataset.messageValue ?? ""),
    [orderOf],
  );
  // Stable while nothing the messages read changes: a parent's re-render passes the list by.
  const canSelect = selectable || defaultSelected !== null;
  const value = React.useMemo<MessageListContextValue>(
    () => ({
      inList: true,
      group,
      register,
      arrivedNow: flow.arrivedNow,
      reveal,
      selection,
      selectable: canSelect,
      setSelected,
      range: range.handlers,
      indexOf,
      memoryOf,
      hold: holdView,
      quickReaction,
      reactionOptions: reactionOptions ?? null,
      reader,
      announce,
    }),
    [
      holdView,
      group,
      register,
      flow,
      reveal,
      selection,
      canSelect,
      setSelected,
      range.handlers,
      indexOf,
      memoryOf,
      quickReaction,
      reactionOptions,
      reader,
      announce,
    ],
  );
  const chrome = React.useMemo<ListChrome>(() => ({ container: innerRef, labels }), [labels]);

  // ── render ──
  const positions = React.useMemo(() => {
    const map = new Map<string, MessageRowInfo>();
    messages.forEach((row, index) => {
      map.set(row.key, {
        value: row.value as string,
        position: index + 1,
        size: messages.length,
      });
    });
    return map;
  }, [messages]);
  const renderRow = (index: number) => {
    const row = rows[index] as Row;
    if (row.sticky) {
      return React.cloneElement(row.element as React.ReactElement<{ ref?: unknown }>, {
        key: row.key,
        ref: windowed ? virtual.measure(index) : undefined,
      });
    }
    return (
      <div
        key={row.key}
        ref={windowed ? virtual.measure(index) : undefined}
        className={styles.row}
        data-message-row=""
      >
        <MessageRowProvider value={positions.get(row.key) ?? null}>
          {row.element}
        </MessageRowProvider>
      </div>
    );
  };
  const body: React.ReactNode[] = [];
  if (!windowed) {
    for (let index = 0; index < rows.length; index++) body.push(renderRow(index));
  } else {
    let cursor = 0;
    let gaps = 0;
    for (const { index } of virtual.rows) {
      if (index > cursor) {
        // Spacers keep their nodes while the window moves (keyed by their order, not by a row).
        gaps += 1;
        body.push(
          <div
            key={`gap:${gaps}`}
            className={styles.gap}
            style={{ blockSize: virtual.startOf(index) - virtual.startOf(cursor) }}
            aria-hidden="true"
            data-scroll-skip=""
          />,
        );
      }
      body.push(renderRow(index));
      cursor = index + 1;
    }
    if (cursor < rows.length) {
      body.push(
        <div
          key="gap:end"
          className={styles.gap}
          style={{ blockSize: virtual.totalSize - virtual.startOf(cursor) }}
          aria-hidden="true"
          data-scroll-skip=""
        />,
      );
    }
  }

  return (
    <MessageListProvider value={value}>
      <ChromeContext.Provider value={chrome}>
        {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: the role switches to a multiselectable listbox in selection mode */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: a log whose keys move focus between its messages */}
        <div
          ref={mergedRef}
          role={selecting ? "listbox" : "log"}
          aria-multiselectable={selecting || undefined}
          className={cx(styles.list, className)}
          data-message-list=""
          {...toDataAttributes({ group: group || undefined, selecting: selecting || undefined })}
          onFocus={(event) => {
            onFocus?.(event);
            const article = event.target.closest<HTMLElement>(ARTICLE);
            if (!article || !innerRef.current?.contains(article)) return;
            // The focused message stays rendered while it scrolls away.
            keepRow("focus", article.dataset.messageValue);
            if (article === stop.current) return;
            if (stop.current) stop.current.tabIndex = -1;
            article.tabIndex = 0;
            stop.current = article;
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (selecting && event.key === "Escape") {
              event.preventDefault();
              setSelected(null);
              return;
            }
            const target = event.target as HTMLElement;
            if (!target.matches(ARTICLE)) return;
            const order = orderOf();
            const index = order.indexOf(target.dataset.messageValue ?? "");
            const next =
              event.key === "ArrowDown"
                ? index + 1
                : event.key === "ArrowUp"
                  ? index - 1
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? order.length - 1
                      : null;
            if (next === null || order[next] === undefined) return;
            event.preventDefault();
            focusMessage(order[next]);
          }}
          {...rest}
        >
          {/* First in the list: out of the flow, it never stands where the reader looks. */}
          <Announcer setterRef={announcer} />
          <MessageHighlightContext.Provider value={highlight}>
            {body}
            {React.Children.toArray(tail)}
          </MessageHighlightContext.Provider>
          {region ? <JumpToEnd flow={flow} labels={labels} /> : null}
        </div>
      </ChromeContext.Provider>
    </MessageListProvider>
  );
}

/**
 * The «к последним» button at the bottom-end of a conversation in a `ScrollContainer`: shown while
 * the reader is away from the end, with the count of messages that arrived meanwhile. A press
 * glides to the end. Its own small component: the list never re-renders for it.
 */
function JumpToEnd({ flow, labels }: { flow: MessageFlow; labels: MessageListLabels }) {
  const region = useScrollRegion();
  const atEnd = React.useSyncExternalStore(
    region?.subscribe ?? noSubscribe,
    () => region?.atEnd() ?? true,
    () => true,
  );
  const unseen = React.useSyncExternalStore(flow.subscribe, flow.unseen, flow.unseen);
  React.useEffect(() => {
    if (atEnd) flow.clearUnseen();
  }, [atEnd, flow]);
  const presence = usePresence(!atEnd, { exitDuration: "fast" });
  if (!presence.mounted) return null;
  const count = atEnd ? 0 : unseen;
  return (
    <div className={styles.jump} data-state={presence.state} onAnimationEnd={presence.onExitEnd}>
      <div className={styles.jumpBox}>
        <Button.Root
          variant="soft"
          tone="neutral"
          className={styles.jumpButton}
          aria-label={count > 0 ? formatLabel(labels.newMessages, { count }) : labels.scrollToEnd}
          tabIndex={presence.state === "open" ? undefined : -1}
          onClick={() => region?.scrollToEnd("smooth")}
        >
          <Button.Icon>
            <Icon name="nav.chevronDown" />
          </Button.Icon>
        </Button.Root>
        {count > 0 ? (
          <Badge.Root color="blue" className={styles.jumpCount} aria-hidden="true">
            {count}
          </Badge.Root>
        ) : null}
      </div>
    </div>
  );
}

const noSubscribe = () => () => {};

/** The polite live region of the list (reactions put or taken back by a double tap or `L`). */
function Announcer({ setterRef }: { setterRef: React.RefObject<(text: string) => void> }) {
  const [text, setText] = React.useState("");
  setterRef.current = setText;
  return <VisuallyHidden live="polite">{text}</VisuallyHidden>;
}

// ─── Selection bar ────────────────────────────────────────────────────────────

/**
 * A bar stuck to the bottom of the conversation (the selection bar) keeps the «к последним» button
 * above it: its height goes to the list as `--message-bottom-bar`, which lifts the button (a
 * transform that glides, CSS). Measured by its own observer, so the list never re-renders for it.
 */
function useBottomBar(
  bar: React.RefObject<HTMLElement | null>,
  container: React.RefObject<HTMLElement | null>,
  shown: boolean,
) {
  React.useLayoutEffect(() => {
    const element = bar.current;
    const list = container.current;
    if (!shown || !element || !list) return;
    const write = () =>
      list.style.setProperty("--message-bottom-bar", `${element.getBoundingClientRect().height}px`);
    write();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(write);
    observer?.observe(element);
    return () => {
      observer?.disconnect();
      list.style.removeProperty("--message-bottom-bar");
    };
  }, [bar, container, shown]);
}

export type ChatSelectionBarProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The bar of selection mode, at the bottom of the conversation while it is on: «Выбрано: N», your
 * actions (`children`: Переслать, Удалить…) and «Отмена», which leaves selection. Hidden otherwise.
 */
export function ChatSelectionBar({ className, children, ref, ...rest }: ChatSelectionBarProps) {
  const list = useMessageList();
  const { container, labels } = React.useContext(ChromeContext);
  const selected = useListSelection();
  const barRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(barRef, ref);
  useBottomBar(barRef, container, selected !== null);
  if (selected === null) return null;
  const count = formatLabel(labels.selectedCount, { count: selected.length });
  return (
    <div
      ref={mergedRef}
      role="toolbar"
      aria-label={count}
      className={cx(styles.selectionBar, enterMotion.enter, className)}
      {...rest}
    >
      <span className={styles.selectionCount} aria-live="polite">
        {count}
      </span>
      <span className={styles.selectionActions}>
        {children}
        <Button.Root variant="ghost" tone="neutral" size="s" onClick={() => list.setSelected(null)}>
          {labels.cancel}
        </Button.Root>
      </span>
    </div>
  );
}
ChatSelectionBar.displayName = "Chat.SelectionBar";
defineRowKind(ChatSelectionBar, { tail: true });

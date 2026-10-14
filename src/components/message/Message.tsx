import * as React from "react";

import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { HOVER_QUERY } from "@/hooks/breakpoints";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useScrollRegion } from "@/hooks/useScrollRegion";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { useLongPress } from "@/internal/longPress";
import mediaPill from "@/internal/mediaPill.module.css";
import {
  defineRowKind,
  useMessageList,
  useMessageRow,
  useMessageSelection,
} from "@/internal/messageList";
import {
  type MessagePartContextValue,
  MessagePartProvider,
  type MessagePartSpec,
  messagePartOf,
} from "@/internal/messagePart";
import { exitTimeoutMs } from "@/internal/motionTiming";
import { flattenChildren } from "@/internal/parts";
import statusLoop from "@/internal/statusLoop.module.css";
import {
  type SurfaceDepth,
  SurfaceDepthProvider,
  useNestedSurfaceDepth,
} from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";
import { type AsyncHandler, isPromiseLike, usePendingAction } from "@/internal/usePendingChanges";

import { BubbleHug } from "./bubbleHug";
import { createBubbleMorph, MorphSnapshot } from "./bubbleMorph";
import { formatMessageTime } from "./formatMessageTime";
import styles from "./Message.module.css";
import { MessageContact, MessageLinkPreview, MessageLocation } from "./MessageCards";
import { MessageFile } from "./MessageFile";
import { MessageMedia } from "./MessageMedia";
import {
  applyOptimistic,
  authorNameOf,
  MESSAGE_LABELS,
  MessageAuthor,
  MessageAuthorIcon,
  type MessageAuthorProps,
  MessageAvatar,
  MessageForwarded,
  type MessageLabels,
  MessageMenu,
  type MessageReaction,
  MessageReactions,
  type MessageReactionsProps,
  MessageReply,
  type MessageRootContextValue,
  MessageRootProvider,
  MessageText,
} from "./MessageParts";
import { DEFAULT_REACTION_OPTIONS, ReactionBar } from "./MessageReactionBar";
import { MessageTyping } from "./MessageTyping";
import type { MessageDirection, MessagePosition } from "./types";

export type {
  MessageAuthorIconProps,
  MessageAuthorProps,
  MessageAvatarProps,
  MessageForwardedLabels,
  MessageForwardedProps,
  MessageLabels,
  MessageMenuProps,
  MessageReaction,
  MessageReactionsLabels,
  MessageReactionsProps,
  MessageReplyLabels,
  MessageReplyProps,
  MessageTextProps,
} from "./MessageParts";
export type { MessageTypingLabels, MessageTypingProps } from "./MessageTyping";
export type {
  MessageDirection,
  MessagePosition,
  MessageReactionOption,
  MessageUser,
} from "./types";

/** Delivery of an outgoing message: on its way, sent, read by the recipient, or failed. */
export type MessageStatus = "sending" | "sent" | "read" | "failed";

/**
 * The shell a message stands in, decided by what its content parts declare (`defineMessagePart`):
 * - `bubble` — a speech bubble with padding and the meta in its corner
 *   (text, voice, file, contact, location, link preview, a picture with a caption);
 * - `media` — a picture or an album without a caption is the shape itself: clipped to the
 *   bubble's radius with no backing, the meta on a dark pill over it, reactions under it;
 * - `round` — a video message: a circle, no backing, the meta on a pill over it, reactions under it.
 */
export type MessageShell = "bubble" | "media" | "round";

// ─── Meta ─────────────────────────────────────────────────────────────────────

const STATUS_ICONS = [
  ["sending", "status.pending"],
  ["sent", "status.sent"],
  ["read", "status.read"],
  ["failed", "status.failed"],
] as const;

type MetaProps = {
  time: string | null;
  dateTime?: string;
  edited: boolean;
  status: MessageStatus | undefined;
  labels: MessageLabels;
  /** The invisible copy that holds the meta's room (a spacer): no names, no time element. */
  reserve?: boolean;
  className?: string;
};

/** Time, «изменено» and the delivery ticks; the ticks cross-fade from one state to the next. */
function Meta({ time, dateTime, edited, status, labels, reserve, className }: MetaProps) {
  return (
    <span className={cx(styles.meta, className)} data-message-meta={reserve ? undefined : ""}>
      {edited ? <span className={styles.edited}>{labels.edited}</span> : null}
      {time ? <time dateTime={reserve ? undefined : dateTime}>{time}</time> : null}
      {status && reserve ? (
        // The spacer holds the box only (a fixed size): no glyphs to build per message.
        <span className={styles.status} />
      ) : status ? (
        <span className={styles.status} role="img" aria-label={labels[status]} data-status={status}>
          {STATUS_ICONS.map(([state, name]) => (
            <span key={state} className={styles.tick} data-tick={state} aria-hidden="true">
              <Icon name={name} animated={false} />
            </span>
          ))}
        </span>
      ) : null}
    </span>
  );
}

// ─── Root state ───────────────────────────────────────────────────────────────

const NO_OPTIMISTIC: ReadonlyMap<string, boolean> = new Map();

/**
 * Reactions with optimistic toggles: a slow toggle shows its result at once (in the same frame as
 * the press) and keeps it while the request runs; resolve hands over to the owner's data, reject
 * drops it back. `toggleReaction` is stable (`null` without `onReactionToggle`).
 */
function useOptimisticReactions(
  reactions: readonly MessageReaction[],
  onReactionToggle: AsyncHandler<[emoji: string], unknown> | undefined,
) {
  const [optimistic, setOptimistic] = React.useState(NO_OPTIMISTIC);
  const shown = applyOptimistic(reactions, optimistic);
  const latest = React.useRef({ shown, optimistic, onReactionToggle });
  latest.current = { shown, optimistic, onReactionToggle };
  const toggle = React.useCallback(async (emoji: string) => {
    const { shown, optimistic, onReactionToggle } = latest.current;
    if (!onReactionToggle || optimistic.has(emoji)) return;
    const next = !shown.some((reaction) => reaction.emoji === emoji && reaction.selected);
    const result = onReactionToggle(emoji);
    if (!isPromiseLike(result)) return;
    setOptimistic((current) => new Map(current).set(emoji, next));
    try {
      await result;
    } catch {
      // Rejected: the reactions stay as they were.
    } finally {
      setOptimistic((current) => {
        const rest = new Map(current);
        rest.delete(emoji);
        return rest;
      });
    }
  }, []);
  return { optimistic, shown, toggleReaction: onReactionToggle ? toggle : null };
}

/**
 * How a reaction bar opened: `hover` — a long hover (pointer devices, no focus moves); `touch` — a
 * long press, with the menu; `keyboard` — `R`, focus moves into the bar.
 */
type BarMode = "hover" | "touch" | "keyboard";

/** How long a pointer rests on a message before its reaction bar shows (pointer devices). */
const LONG_HOVER_MS = 500;
/** Time to travel from the message onto its reaction bar before the bar leaves. */
const HOVER_GRACE_MS = 300;

/** Closes the reaction bar open on the page: one bar at a time. */
let activeBar: (() => void) | null = null;

/** The reaction bar of a message: one on the page at a time, mounted from its open to its exit. */
function useReactionBarState(rootRef: React.RefObject<HTMLElement | null>) {
  const [bar, setBarState] = React.useState<BarMode | null>(null);
  const current = React.useRef(bar);
  current.current = bar;
  const closeSelf = React.useRef(() => setBarState(null));
  const setBar = React.useCallback((next: BarMode | null) => {
    if (next !== null && activeBar !== closeSelf.current) {
      activeBar?.();
      activeBar = closeSelf.current;
    }
    if (next === null && activeBar === closeSelf.current) activeBar = null;
    setBarState(next);
  }, []);

  // Mounted from an open until the bar's exit (`exitDuration: "base"`) has played after a close.
  const [mounted, setMounted] = React.useState(false);
  if (bar !== null && !mounted) setMounted(true);
  React.useEffect(() => {
    if (bar !== null || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), exitTimeoutMs("base"));
    return () => window.clearTimeout(timer);
  }, [bar, mounted]);

  const hoverTimer = React.useRef<number | undefined>(undefined);
  const leaveTimer = React.useRef<number | undefined>(undefined);
  const stopScrollWatch = React.useRef<(() => void) | null>(null);
  React.useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(leaveTimer.current);
      stopScrollWatch.current?.();
      if (activeBar === closeSelf.current) activeBar = null;
    },
    [],
  );

  /*
   * A scroll of anything that holds the message (the chat) drops a pending long hover and closes
   * an open bar at once, without its exit: the bar is anchored to a message that is moving away,
   * and a panel left floating over the scroll would stand outside the chat.
   */
  const watchScroll = React.useCallback(() => {
    if (stopScrollWatch.current) return;
    const onScroll = (event: Event) => {
      const root = rootRef.current;
      if (!root || !(event.target instanceof Node) || !event.target.contains(root)) return;
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(leaveTimer.current);
      if (current.current !== null) {
        setBar(null);
        setMounted(false);
      }
      stop();
    };
    const stop = () => {
      document.removeEventListener("scroll", onScroll, true);
      stopScrollWatch.current = null;
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    stopScrollWatch.current = stop;
  }, [rootRef, setBar]);

  React.useEffect(() => {
    if (bar !== null) watchScroll();
  }, [bar, watchScroll]);

  return {
    bar,
    mounted: bar !== null || mounted,
    setBar,
    /** A pointer came to rest on the message: the bar shows after a long hover. */
    hoverStart() {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(leaveTimer.current);
      hoverTimer.current = window.setTimeout(() => setBar("hover"), LONG_HOVER_MS);
      watchScroll();
    },
    /** The pointer left the message or the bar: a hover bar leaves after a grace period. */
    leaveSoon() {
      window.clearTimeout(hoverTimer.current);
      if (current.current === null) stopScrollWatch.current?.();
      if (current.current !== "hover") return;
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => setBar(null), HOVER_GRACE_MS);
    },
    /** A press is not a hover: a pending long hover never opens the bar over what the press opened. */
    cancelHover() {
      if (current.current === null) window.clearTimeout(hoverTimer.current);
    },
    /** The pointer reached the bar: it stays. */
    stay() {
      window.clearTimeout(leaveTimer.current);
    },
    close() {
      const focused = current.current === "keyboard";
      setBar(null);
      if (focused) rootRef.current?.focus({ preventScroll: true });
    },
  };
}

// ─── Content ──────────────────────────────────────────────────────────────────

const isElement = (child: React.ReactElement, type: unknown): boolean => child.type === type;

/**
 * The parts of a message and the shell they ask for: a `round` part makes a circle message, a
 * lone `media` part a picture message, anything else a bubble (`MessagePartSpec.shell`). The
 * author's header, the avatar, the menu and the reactions have places of their own.
 */
function partsOf(children: React.ReactNode) {
  // Fragments opened; strings dropped — what decides the shell is what renders.
  const items = flattenChildren(children).filter(React.isValidElement);
  const avatar = items.find((child) => isElement(child, MessageAvatar));
  const author = items.find((child) => isElement(child, MessageAuthor));
  const menu = items.find((child) => isElement(child, MessageMenu));
  const reactions = items.find((child) => isElement(child, MessageReactions));
  const actions = items.filter((child) => isElement(child, MessageActions));
  const body = items.filter(
    (child) =>
      !(
        isElement(child, MessageAvatar) ||
        isElement(child, MessageAuthor) ||
        isElement(child, MessageMenu) ||
        isElement(child, MessageReactions) ||
        isElement(child, MessageActions)
      ),
  );
  const specs = body.map((child) => messagePartOf(child.type));
  const shell: MessageShell = specs.some((spec) => spec?.shell === "round")
    ? "round"
    : body.length === 1 && specs[0]?.shell === "media"
      ? "media"
      : "bubble";
  return { avatar, author, menu, reactions, actions, body, specs, shell };
}

/** What a chat's search looks in: the text its content parts declare. */
function searchTextOf(
  body: readonly React.ReactElement[],
  specs: readonly (MessagePartSpec | null)[],
): string {
  return body
    .map((element, index) => specs[index]?.text?.(element.props as never) ?? "")
    .filter(Boolean)
    .join("\n");
}

/** Block size of the parts the kit renders around content (px), for the off-screen estimate. */
const PART_ESTIMATE = new Map<unknown, number>([
  [MessageForwarded, 20],
  [MessageReply, 44],
]);

/** The row's size while it is off screen (`contain-intrinsic-size`), from its parts' estimates. */
function estimateOf(
  body: readonly React.ReactElement[],
  specs: readonly (MessagePartSpec | null)[],
  shell: MessageShell,
  reactions: boolean,
  author: boolean,
  actionRows: number,
): number {
  let size = (shell === "bubble" ? 16 : 0) + (author && shell === "bubble" ? 20 : 0);
  body.forEach((element, index) => {
    const spec = specs[index];
    size += spec?.estimate?.(element.props as never) ?? PART_ESTIMATE.get(element.type) ?? 40;
  });
  return Math.round(size + (reactions ? 36 : 0) + actionRows * ACTIONS_ESTIMATE + 8);
}

const NO_REACTIONS: readonly MessageReaction[] = [];

// ─── Actions ──────────────────────────────────────────────────────────────────

export type MessageActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A row of a bot's inline keyboard under the message: `Button.Root` children sharing the row
 * equally, at the message's width (the bubble widens to the keyboard when it is wider). Several
 * make several rows, in the order written. A row too narrow for its buttons wraps them.
 */
function MessageActions({ className, ...rest }: MessageActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}
MessageActions.displayName = "Message.Actions";

/** Block size of one row of `Message.Actions` with its gap (px), for the off-screen estimate. */
const ACTIONS_ESTIMATE = 40;

// ─── Root ─────────────────────────────────────────────────────────────────────

export type MessageRootProps = Omit<React.HTMLAttributes<HTMLElement>, "role"> & {
  value?: string;
  direction?: MessageDirection;
  position?: MessagePosition;
  time?: Date | string;
  formatTime?: (date: Date) => string;
  edited?: boolean;
  status?: MessageStatus;
  onRetry?: AsyncHandler;
  onReactionToggle?: AsyncHandler<[emoji: string], unknown>;
  labels?: Partial<MessageLabels>;
  ref?: React.Ref<HTMLElement>;
};

const isInteractive = (target: EventTarget | null) =>
  target instanceof Element &&
  target.closest('a, button, input, textarea, select, label, [role="slider"], [role="button"]') !==
    null;

/**
 * One message: its parts in order (author, forwarded, reply, content, reactions) in the shell its
 * content declares (`MessageShell`), the meta in the bottom-end corner. The layout is CSS only:
 * the bubble fits its content, the meta's spacer closes the last line, and every size change (the
 * reactions row, a transcript) is a disclosure that glides in layout. The row is a `role="article"`
 * named «{author}, {time}» (an `option` in selection mode); right click, a long press, Enter or
 * Shift+F10 open `Message.Menu` where the pointer is; a double tap puts the chat's quick reaction.
 */
function MessageRoot({
  value: valueProp,
  direction = "incoming",
  position = "single",
  time: timeProp,
  formatTime = formatMessageTime,
  edited = false,
  status,
  onRetry,
  onReactionToggle,
  labels: labelsProp,
  className,
  style,
  children,
  onContextMenu,
  onKeyDown,
  onPointerDown,
  onMouseDown,
  onClick,
  onDoubleClick,
  "aria-label": ariaLabel,
  ref,
  ...rest
}: MessageRootProps) {
  const labels = useLabels(MESSAGE_LABELS, labelsProp);
  const list = useMessageList();
  const row = useMessageRow();
  const autoValue = React.useId();
  const value = valueProp ?? row?.value ?? autoValue;
  const rootRef = React.useRef<HTMLElement>(null);
  const bubbleRef = React.useRef<HTMLDivElement>(null);
  const columnRef = React.useRef<HTMLDivElement>(null);
  const fillRef = React.useRef<HTMLSpanElement>(null);
  // Every size change of the message plays as one stroke (`bubbleMorph`); while it gives way in
  // the conversation, the conversation's own anchoring holds (`hold`).
  const holdRef = React.useRef(list.hold);
  holdRef.current = list.hold;
  const region = useScrollRegion();
  const regionRef = React.useRef(region);
  regionRef.current = region;
  const [morph] = React.useState(() =>
    createBubbleMorph(() => {
      const article = rootRef.current;
      return {
        column: columnRef.current,
        bubble: bubbleRef.current,
        fill: fillRef.current,
        row: article?.closest<HTMLElement>("[data-message-row]") ?? article,
        scroller: regionRef.current?.element() ?? null,
        hold: holdRef.current,
      };
    }),
  );
  /** The event happened on the message itself, not on the row's empty width or a layer. */
  const inMessage = (target: EventTarget | null) =>
    target instanceof Node && (columnRef.current?.contains(target) ?? false);
  const mergedRef = useMergedRefs(rootRef, ref);
  // Registered before paint: the list decides whether this message is new at the end (it enters,
  // with no render) and watches it for read receipts.
  const { register } = list;
  React.useLayoutEffect(() => {
    const article = rootRef.current;
    return article ? register(article, value, direction) : undefined;
  }, [register, value, direction]);
  const neutralDepth = useNestedSurfaceDepth();
  const depth: SurfaceDepth = direction === "outgoing" ? "tinted" : neutralDepth;

  const { selecting, selected } = useMessageSelection(value);
  /** Selection mode: a click or a key toggles this message, Shift sets the range from the anchor. */
  const toggleSelected = (event: { shiftKey: boolean; detail: number }) => {
    const article = rootRef.current;
    if (article) list.range.onClick(list.indexOf(article), event);
  };

  // ── parts ──
  const { avatar, author, menu, reactions, actions, body, specs, shell } = partsOf(children);
  const hasActions = actions.length > 0;
  // A group chat heads the first message of a run with its author and ends the run with the
  // avatar, the gutter kept on every incoming row; a direct chat shows neither. A message on its
  // own is a group of what it is given: the parts it holds, by its place in the run.
  const grouped = list.inList ? list.group : author !== undefined || avatar !== undefined;
  const showAuthor =
    author !== undefined && grouped && (position === "single" || position === "first");
  const showAvatar = position === "single" || position === "last";
  const gutter = direction === "incoming" && (list.inList ? list.group : avatar !== undefined);
  // The part that carries the meta: the circle of a round message, else the last part.
  const metaIndex =
    shell === "round" ? specs.findIndex((spec) => spec?.shell === "round") : body.length - 1;
  const metaSpec = specs[metaIndex] ?? null;
  const metaMode: "inline" | "overlay" | "block" =
    shell !== "bubble" ? "overlay" : (metaSpec?.meta ?? "block");
  // The last bubble of a run curls a tail out of its corner on the author's side — a bubble of
  // fill only: never a picture (with a caption or not) or a circle. An inline keyboard closes the
  // message under the bubble instead.
  const tail =
    shell === "bubble" &&
    (position === "single" || position === "last") &&
    !hasActions &&
    !specs.some((spec) => spec?.picture);
  const sized = specs.some((spec) => spec?.sized);
  const bleedStart = shell === "bubble" && specs[0]?.bleed === true;
  const bleedEnd = shell === "bubble" && specs[body.length - 1]?.bleed === true;

  // ── reactions ──
  const reactionsProps = reactions?.props as MessageReactionsProps | undefined;
  const {
    optimistic,
    shown: ownReactions,
    toggleReaction,
  } = useOptimisticReactions(
    reactions ? (reactions.props as MessageReactionsProps).items : NO_REACTIONS,
    onReactionToggle,
  );
  const hasReactions = ownReactions.length > 0;
  const canQuickReact = toggleReaction !== null && list.quickReaction !== false;
  const quickReact = () => {
    const emoji = list.quickReaction;
    if (!toggleReaction || emoji === false) return;
    const had = ownReactions.some((reaction) => reaction.emoji === emoji && reaction.selected);
    list.announce(formatLabel(had ? labels.reactionRemoved : labels.reactionAdded, { emoji }));
    toggleReaction(emoji);
  };
  // Every message holds the row's place (closed until its first reaction): one element, one key,
  // never remounted — its chips keep their state and the row opens and closes in place.
  const reactionsPart = React.cloneElement(
    (reactions as React.ReactElement<MessageReactionsProps> | undefined) ?? (
      <MessageReactions items={NO_REACTIONS} />
    ),
    { key: "reactions" },
  );

  // ── meta ──
  // A returned promise shows `sending` until it settles; a rejection leaves the message failed.
  const { pending: retrying, run: retry } = usePendingAction(onRetry);
  const shownStatus: MessageStatus | undefined = retrying ? "sending" : status;
  const time = timeProp instanceof Date ? formatTime(timeProp) : (timeProp ?? null);
  const dateTime = timeProp instanceof Date ? timeProp.toISOString() : undefined;
  const hasMeta = time !== null || edited || shownStatus !== undefined;
  const editedLabel = labels.edited;
  // The spacers: invisible copies of the meta that hold its room at the end of the last line of
  // the content (`spacer`) and of the reactions row (`rowSpacer`). Built from the meta's values
  // only, so a render of the message for anything else passes the parts by.
  const reserve = React.useMemo(
    () =>
      hasMeta ? (
        <Meta
          time={time}
          edited={edited}
          status={shownStatus}
          labels={{ ...MESSAGE_LABELS, edited: editedLabel }}
          reserve
        />
      ) : null,
    [hasMeta, time, edited, shownStatus, editedLabel],
  );
  const inline = hasMeta && metaMode === "inline";
  const spacer = React.useMemo(
    () =>
      inline ? (
        <span className={styles.spacer} data-message-spacer="" aria-hidden="true">
          {reserve}
        </span>
      ) : null,
    [inline, reserve],
  );
  const rowSpacer = React.useMemo(
    () =>
      inline ? (
        <span className={styles.rowSpacer} data-message-spacer="" aria-hidden="true">
          {reserve}
        </span>
      ) : null,
    [inline, reserve],
  );
  const meta = React.useMemo(
    () =>
      hasMeta ? (
        <Meta
          {...{ time, dateTime, edited, labels }}
          status={shownStatus}
          className={
            metaMode === "overlay"
              ? cx(textRole.caption, mediaPill.pill, styles.metaOverlay)
              : undefined
          }
        />
      ) : null,
    [hasMeta, time, dateTime, edited, labels, shownStatus, metaMode],
  );
  const overlay = metaMode === "overlay" ? meta : null;
  // One context value per role: the part that carries the meta, and every other part.
  const { memoryOf, hold } = list;
  const memory = React.useMemo(() => memoryOf(value), [memoryOf, value]);
  // A part that changes the message from inside (a transcript) keeps the view still and plays its
  // change as the message's morph.
  const holdPosition = React.useCallback(() => {
    hold?.();
    morph.expect();
  }, [hold, morph]);
  // A press inside a part (a picture's tile) presses the whole message: the bubble with its
  // caption, its tail and reactions, one surface.
  const pressMessage = React.useCallback((pressed: boolean) => {
    const column = columnRef.current;
    if (!column) return;
    if (pressed) column.dataset.pressed = "";
    else delete column.dataset.pressed;
  }, []);
  const carrier = React.useMemo<MessagePartContextValue>(
    () => ({ spacer, overlay, neutralDepth, memory, holdPosition, press: pressMessage }),
    [spacer, overlay, neutralDepth, memory, holdPosition, pressMessage],
  );
  const plain = React.useMemo<MessagePartContextValue>(
    () => ({
      spacer: null,
      overlay: null,
      neutralDepth,
      memory,
      holdPosition,
      press: pressMessage,
    }),
    [neutralDepth, memory, holdPosition, pressMessage],
  );

  // ── menu: opens against the message (`Dropdown.Anchor`) at the point pressed ──
  const [menuOpen, setMenuOpen] = React.useState(false);
  // The menu mounts on its first open and stays for its exit and focus return: a chat of many
  // messages keeps no closed menu per row (its floating layer, media query and listeners).
  const [menuMounted, setMenuMounted] = React.useState(false);
  const [anchor, setAnchor] = React.useState({ x: 0, y: 0 });
  const hasMenu = menu !== undefined && !selecting;

  const openMenuAt = (clientX: number, clientY: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchor({ x: clientX - rect.left, y: clientY - rect.top });
    setMenuMounted(true);
    setMenuOpen(true);
  };
  const openMenuAtBubble = () => {
    const bubble = bubbleRef.current?.getBoundingClientRect();
    if (bubble) openMenuAt(bubble.left, bubble.bottom);
  };

  // ── reaction bar ──
  const reactionBar = useReactionBarState(rootRef);
  const { bar, setBar } = reactionBar;
  // A long hover shows the bar only where the pointer can hover.
  const hoverable = useMediaQuery(HOVER_QUERY);
  const reactionOptions = list.reactionOptions ?? DEFAULT_REACTION_OPTIONS;
  const canReact = toggleReaction !== null && reactionOptions.length > 0 && !selecting;
  // A long press of a finger: the reaction bar above the message and the menu below.
  const longPress = useLongPress({
    enabled: hasMenu || canReact,
    onLongPress: ({ x, y }) => {
      // The long press is ours, not the native text selection it may have started.
      window.getSelection()?.removeAllRanges();
      if (hasMenu) openMenuAt(x, y);
      if (canReact) setBar("touch");
    },
  });
  const pickReaction = (emoji: string) => {
    toggleReaction?.(emoji);
    setMenuOpen(false);
    reactionBar.close();
  };
  const ownSelected = React.useMemo(
    () =>
      new Set(
        ownReactions.filter((reaction) => reaction.selected).map((reaction) => reaction.emoji),
      ),
    [ownReactions],
  );

  const authorName =
    (author ? authorNameOf((author.props as MessageAuthorProps).children) : undefined) ??
    (direction === "outgoing" ? labels.you : undefined);
  const name =
    ariaLabel ??
    (formatLabel(labels.message, { author: authorName, time: time ?? undefined }).replace(
      /^,\s*|,\s*$/g,
      "",
    ) ||
      undefined);

  // Stable while the message's own state is: a render of the row (a hover, the menu, the bar)
  // passes its parts by.
  const { selectable, setSelected } = list;
  const startSelection = React.useMemo(
    () => (selectable ? () => setSelected([value]) : null),
    [selectable, setSelected, value],
  );
  const rootContext = React.useMemo<MessageRootContextValue>(
    () => ({
      toggleReaction,
      optimistic,
      startSelection,
      labels,
      rowSpacer: shell === "bubble" ? rowSpacer : null,
    }),
    [toggleReaction, optimistic, startSelection, labels, rowSpacer, shell],
  );

  const column = (
    // The message itself — the bubble, a picture, a circle and the reactions under it — not the
    // row's empty width: a long hover, a long press, a right click and a double tap start here.
    <div
      ref={columnRef}
      className={cx(styles.column, statusLoop.blink)}
      data-message-column=""
      data-actions={hasActions || undefined}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || !canReact || bar !== null || !hoverable) return;
        reactionBar.hoverStart();
      }}
      onPointerLeave={reactionBar.leaveSoon}
      onPointerDown={reactionBar.cancelHover}
    >
      <SurfaceDepthProvider value={depth}>
        <div
          ref={bubbleRef}
          className={styles.bubble}
          data-message-bubble=""
          data-depth={depth}
          {...toDataAttributes({
            shell,
            meta: hasMeta ? metaMode : undefined,
            reactions: hasReactions || undefined,
            tail: tail || undefined,
            sized: sized || undefined,
            start: bleedStart ? "bleed" : undefined,
            end: bleedEnd ? "bleed" : undefined,
          })}
        >
          {shell === "bubble" ? (
            // The bubble's fill: a layer under the content, so a morph can paint the old box.
            <span ref={fillRef} className={styles.fill} data-morph-skip="" aria-hidden="true" />
          ) : null}
          {showAuthor && shell === "bubble" ? author : null}
          {showAuthor && shell !== "bubble" ? (
            // Over a picture or a circle the header stands on a pill at its top-start corner.
            <div className={cx(textRole.caption, mediaPill.pill, styles.authorPill)}>{author}</div>
          ) : null}
          {body.map((child, index) => (
            <MessagePartProvider
              key={child.key ?? index}
              value={index === metaIndex ? carrier : plain}
            >
              {child}
            </MessagePartProvider>
          ))}
          {shell === "bubble" ? reactionsPart : null}
          {metaMode === "overlay" ? null : meta}
        </div>
        {/* After the bubble, outside its clip: the curl in the bubble's own fill. */}
        {tail ? <span className={styles.bubbleTail} data-depth={depth} aria-hidden="true" /> : null}
      </SurfaceDepthProvider>
      {shell === "bubble" ? null : reactionsPart}
      {actions}
      {/* First the hug, then the morph: the morph's new layout is the hugged one. */}
      <BubbleHug bubble={bubbleRef} />
      <MorphSnapshot morph={morph} />
    </div>
  );

  const article = (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: an article becomes an option in selection mode
    <article
      ref={mergedRef}
      tabIndex={-1}
      {...rest}
      style={style}
      role={selecting ? "option" : undefined}
      aria-selected={selecting ? selected : undefined}
      aria-label={name}
      aria-posinset={row?.position}
      aria-setsize={row?.size}
      data-message-article=""
      data-message-value={value}
      className={cx(styles.root, className)}
      {...toDataAttributes({
        direction,
        position,
        shell,
        avatars: gutter || undefined,
        selecting: selecting || undefined,
        selected: selected || undefined,
        failed: shownStatus === "failed" || undefined,
      })}
      onContextMenu={(event) => {
        onContextMenu?.(event);
        // A link keeps the browser's own menu (open in a new tab, copy the address).
        if (
          event.defaultPrevented ||
          !hasMenu ||
          !inMessage(event.target) ||
          (event.target as Element).closest("a")
        )
          return;
        event.preventDefault();
        longPress.cancel();
        openMenuAt(event.clientX, event.clientY);
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (selecting) {
          // Press and drag (or slide a finger from the check) paints the messages passed over.
          list.range.onPointerDown(list.indexOf(event.currentTarget), event);
          return;
        }
        if (!inMessage(event.target) || isInteractive(event.target)) return;
        longPress.handlers.onPointerDown(event);
      }}
      onPointerMove={longPress.handlers.onPointerMove}
      onPointerUp={longPress.handlers.onPointerUp}
      onPointerCancel={longPress.handlers.onPointerCancel}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        // A double click reacts: the press that makes it double selects no word on the way. A
        // single press still starts a drag selection of the text.
        if (
          event.detail >= 2 &&
          canQuickReact &&
          !selecting &&
          !event.defaultPrevented &&
          inMessage(event.target) &&
          !isInteractive(event.target)
        )
          event.preventDefault();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.target !== event.currentTarget) return;
        if (selecting) {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            toggleSelected({ shiftKey: event.shiftKey, detail: 0 });
          }
          return;
        }
        const plainKey = !event.metaKey && !event.ctrlKey && !event.altKey;
        if (event.code === "KeyL" && plainKey) {
          event.preventDefault();
          quickReact();
          return;
        }
        if (event.code === "KeyR" && plainKey && canReact) {
          event.preventDefault();
          setBar("keyboard");
          return;
        }
        if (
          hasMenu &&
          (event.key === "Enter" ||
            event.key === "ContextMenu" ||
            (event.shiftKey && event.key === "F10"))
        ) {
          event.preventDefault();
          openMenuAtBubble();
        }
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !selecting) return;
        // In selection mode a press anywhere on the row toggles it, links and players included.
        event.preventDefault();
        toggleSelected(event);
      }}
      onDoubleClick={(event) => {
        onDoubleClick?.(event);
        if (
          event.defaultPrevented ||
          selecting ||
          !inMessage(event.target) ||
          isInteractive(event.target)
        )
          return;
        // A double click that selected a word is about the text, not a reaction.
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) return;
        quickReact();
      }}
    >
      {selecting ? (
        <span className={cx(styles.select, enterMotion.enter)} aria-hidden="true">
          <Checkbox.Indicator shape="circle" checked={selected} />
        </span>
      ) : null}
      {gutter ? (
        <div className={cx(styles.gutter, statusLoop.blink)}>{showAvatar ? avatar : null}</div>
      ) : null}
      {status === "failed" && onRetry ? (
        <span className={cx(styles.retry, statusLoop.blink)} data-morph-item="">
          <Button.Root
            variant="ghost"
            tone="danger"
            size="s"
            loading={retrying}
            aria-label={labels.retry}
            onClick={() => retry?.()}
          >
            <Button.Icon>
              <Icon name="action.refresh" />
            </Button.Icon>
          </Button.Root>
        </span>
      ) : null}
      {column}
      {canReact && reactionBar.mounted ? (
        <ReactionBar
          open={bar !== null}
          onOpenChange={(open) => {
            if (!open) reactionBar.close();
          }}
          anchorRef={bubbleRef}
          align={direction === "outgoing" ? "end" : "start"}
          options={reactionOptions}
          selected={ownSelected}
          onPick={pickReaction}
          focusOnOpen={bar === "keyboard"}
          closeOnOutsideClick={reactionsProps?.closeOnOutsideClick ?? true}
          closeOnEscape={reactionsProps?.closeOnEscape ?? true}
          labels={{ bar: labels.reactionBar, more: labels.moreReactions }}
          onPointerEnter={reactionBar.stay}
          onPointerLeave={reactionBar.leaveSoon}
        />
      ) : null}
    </article>
  );

  return (
    <MessageRootProvider value={rootContext}>
      {menu !== undefined ? (
        // The menu opens against the message at the point pressed; focus returns to the message.
        // Wrapped whenever the message has a menu, so selection mode never remounts the message.
        <Dropdown.Root
          open={menuOpen && hasMenu}
          onOpenChange={setMenuOpen}
          anchorPoint={menuOpen && hasMenu ? anchor : null}
        >
          <Dropdown.Anchor>{article}</Dropdown.Anchor>
          {menuMounted ? menu : null}
        </Dropdown.Root>
      ) : (
        article
      )}
    </MessageRootProvider>
  );
}
MessageRoot.displayName = "Message.Root";

// The list reads a message row from its props alone: its value, side, estimated height and text.
defineRowKind(MessageRoot, {
  message: (props) => {
    const { body, specs, shell, reactions, author, actions } = partsOf(
      (props as MessageRootProps).children,
    );
    const reacted =
      ((reactions?.props as MessageReactionsProps | undefined)?.items.length ?? 0) > 0;
    return {
      value: (props as MessageRootProps).value,
      direction: (props as MessageRootProps).direction ?? "incoming",
      estimate: estimateOf(body, specs, shell, reacted, author !== undefined, actions.length),
      text: searchTextOf(body, specs),
    };
  },
});

export const Message = {
  Root: MessageRoot,
  Avatar: MessageAvatar,
  Author: MessageAuthor,
  AuthorIcon: MessageAuthorIcon,
  Forwarded: MessageForwarded,
  Reply: MessageReply,
  Text: MessageText,
  Media: MessageMedia,
  File: MessageFile,
  Location: MessageLocation,
  Contact: MessageContact,
  LinkPreview: MessageLinkPreview,
  Reactions: MessageReactions,
  Actions: MessageActions,
  Menu: MessageMenu,
  Typing: MessageTyping,
};

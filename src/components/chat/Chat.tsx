import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Crossfade } from "@/components/crossfade/Crossfade";
import { Input } from "@/components/input/Input";
import { Message } from "@/components/message/Message";
import type { MessagePosition } from "@/components/message/types";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import hairline from "@/internal/hairline.module.css";
import { useLabels } from "@/internal/labels";
import type { Selection } from "@/internal/messageList";
import { usePartPresence } from "@/internal/partPresence";
import { flattenChildren } from "@/internal/parts";
import { RollingNumber } from "@/internal/RollingNumber";
import textRole from "@/internal/textRole.module.css";

import styles from "./Chat.module.css";
import { ChatPinned } from "./ChatPinned";
import {
  ChatSeparator,
  ChatService,
  ChatServiceChange,
  ChatServiceIcon,
  ChatUnread,
} from "./ChatRows";
import { type ChatContextValue, type ChatLabels, ChatProvider, useChat } from "./chatContext";
import { type GroupMessagesOptions, groupMessages, type MessageListEntry } from "./groupMessages";
import {
  ChatSelectionBar,
  MESSAGE_LIST_LABELS,
  MessageList,
  type MessageListProps,
} from "./MessageList";

export type { ChatPinnedItem, ChatPinnedLabels, ChatPinnedProps } from "./ChatPinned";
export type {
  ChatSeparatorProps,
  ChatServiceChangeLabels,
  ChatServiceChangeProps,
  ChatServiceIconProps,
  ChatServiceProps,
  ChatUnreadLabels,
  ChatUnreadProps,
} from "./ChatRows";
export type { ChatLabels } from "./chatContext";
export type { ChatSelectionBarProps } from "./MessageList";

export const CHAT_LABELS: ChatLabels = {
  ...MESSAGE_LIST_LABELS,
  typing: "печатает…",
  search: "Поиск по переписке",
  // Short, as ChatList's: the field shares a narrow row with the count and two arrows (the field's
  // name says what it searches).
  searchPlaceholder: "Поиск",
  matches: "{index} из {count}",
  matchCount: "{index}/{count}",
  noMatches: "Нет совпадений",
  previousMatch: "Предыдущее совпадение",
  nextMatch: "Следующее совпадение",
  messages: "Переписка",
  unread: "Непрочитанные сообщения",
  loading: "Загрузка сообщений",
};

// ─── Root ─────────────────────────────────────────────────────────────────────

/**
 * How the chat stands in its host: `pane` — inset from its own edges (a `Card`, a page pane);
 * `inline` — flush with the host's content edges (a dialog body, a tab, a `Card.Body`).
 */
export type ChatVariant = "pane" | "inline";

export type ChatRootProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  variant?: ChatVariant;
  selected?: Selection;
  defaultSelected?: Selection;
  onSelectedChange?: (selected: Selection) => void;
  search?: string | null;
  defaultSearch?: string | null;
  minSearchLength?: number;
  onSearchChange?: (search: string | null) => void;
  jumpTo?: string | null;
  typing?: boolean;
  labels?: Partial<ChatLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A chat, assembled: the frame of a conversation that owns its state — the selection, the search
 * and its current match, the typing signal, the jump to a message — and hands it to its parts.
 * A column that fills its host: the header, the search and the pinned bar on top, the messages
 * scrolling in the middle, the footer with the Composer at the bottom. Every part is optional but
 * `Chat.Messages`: a list without the rest is `Chat.Root` with `Chat.Messages` alone.
 */
function ChatRoot({
  variant = "pane",
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  search: searchProp,
  defaultSearch = null,
  minSearchLength = 2,
  onSearchChange,
  jumpTo: jumpToProp = null,
  typing = false,
  labels: labelsProp,
  className,
  children,
  ref,
  ...rest
}: ChatRootProps) {
  const labels = useLabels(CHAT_LABELS, labelsProp);
  const selectable =
    selectedProp !== undefined || defaultSelected !== undefined || onSelectedChange !== undefined;
  const [selectedState, setSelected] = useControllableState<Selection>({
    value: selectedProp,
    defaultValue: defaultSelected ?? null,
    onChange: onSelectedChange,
  });
  const [search, setSearchState] = useControllableState<string | null>({
    value: searchProp,
    defaultValue: defaultSearch,
    onChange: onSearchChange,
  });
  const [matches, setMatches] = React.useState<readonly string[]>([]);
  const [matchIndex, setMatchIndex] = React.useState(0);
  const setSearch = React.useCallback(
    (next: string | null) => {
      // A new query starts at the newest match.
      setMatchIndex(0);
      setSearchState(next);
    },
    [setSearchState],
  );
  const revealRef = React.useRef<((value: string) => void) | null>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const jump = React.useCallback((value: string) => revealRef.current?.(value), []);
  const titleId = React.useId();
  const [hasTitle, setHasTitle] = React.useState(false);

  const searching = search !== null;
  // A query shorter than the minimum is no search yet: nothing is marked, counted or stepped.
  const searched = search !== null && search.trim().length >= minSearchLength ? search : "";
  const match = matches[matches.length - 1 - Math.min(matchIndex, matches.length - 1)];
  const jumpTo = searching ? (match ?? null) : jumpToProp;
  const selected = selectable ? selectedState : undefined;

  const value = React.useMemo<ChatContextValue>(
    () => ({
      selected,
      setSelected,
      search,
      setSearch,
      searched,
      matches,
      setMatches,
      matchIndex,
      setMatchIndex,
      jumpTo,
      typing,
      jump,
      revealRef,
      searchButtonRef,
      titleId,
      hasTitle,
      setHasTitle,
      labels,
    }),
    [
      selected,
      setSelected,
      search,
      setSearch,
      searched,
      matches,
      matchIndex,
      jumpTo,
      typing,
      jump,
      titleId,
      hasTitle,
      labels,
    ],
  );

  return (
    <ChatProvider value={value}>
      <div ref={ref} className={cx(styles.root, className)} data-variant={variant} {...rest}>
        {children}
      </div>
    </ChatProvider>
  );
}
ChatRoot.displayName = "Chat.Root";

// ─── Header ───────────────────────────────────────────────────────────────────

export type ChatHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The top of the chat: who it is with. A row of the leading elements (a back button, an `Avatar`),
 * the title over the badges and the description, and the actions at the end. Children are sorted
 * by type: `Chat.Title`, `Chat.Badges`, `Chat.Description` and `Chat.Actions` take their places,
 * everything else leads the row side by side, in the order written. The header draws nothing of
 * its own: every element in it is a part or a child you put.
 */
function ChatHeader({ className, children, ...rest }: ChatHeaderProps) {
  const lead: React.ReactNode[] = [];
  const text: React.ReactNode[] = [];
  for (const child of flattenChildren(children)) {
    const own =
      React.isValidElement(child) &&
      (child.type === ChatTitle ||
        child.type === ChatBadges ||
        child.type === ChatDescription ||
        child.type === ChatActions);
    (own ? text : lead).push(child);
  }
  return (
    <div className={cx(hairline.bottom, styles.header, className)} {...rest}>
      {lead.length > 0 ? <div className={styles.lead}>{lead}</div> : null}
      {text}
    </div>
  );
}
ChatHeader.displayName = "Chat.Header";

export type ChatTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h2" | "h3" | "h4";
  number?: React.ReactNode;
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * Who the chat is with, one line; it also names the conversation for assistive tech. A record's
 * `number` stands muted after the name and is part of it: the name ellipsizes, the number never.
 */
function ChatTitle({ as: Tag = "h2", number, className, id, children, ...rest }: ChatTitleProps) {
  const { titleId, setHasTitle } = useChat();
  React.useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);
  return (
    <Tag id={id ?? titleId} className={cx(textRole.titleS, styles.title, className)} {...rest}>
      <span className={styles.titleName}>{children}</span>
      {number !== undefined && number !== null ? (
        <>
          {" "}
          <span className={styles.titleNumber}>{number}</span>
        </>
      ) : null}
    </Tag>
  );
}
ChatTitle.displayName = "Chat.Title";

export type ChatBadgesProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The line of the record's badges under the title, the record header of a dialog in the chat's
 * tier: first the pickers (a stage, an assignee: a `Badge.Root` in a `Dropdown.Trigger`), then the
 * plain statuses. One row of `s` chips that never wraps: what does not fit waits behind «+N»
 * (`Badge.Group overflow="count"`), whose tooltip lists it.
 */
function ChatBadges({ className, ...rest }: ChatBadgesProps) {
  return (
    <Badge.Group size="s" overflow="count" className={cx(styles.badges, className)} {...rest} />
  );
}
ChatBadges.displayName = "Chat.Badges";

export type ChatDescriptionProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The status line under the title («в сети», «12 участников»). While the other side types
 * (`Chat.Root typing`) it cross-fades into «печатает…» in the accent, and back.
 */
function ChatDescription({ className, children, ...rest }: ChatDescriptionProps) {
  const { typing, labels } = useChat();
  return (
    <div className={cx(styles.description, className)} {...rest}>
      <Crossfade state={typing ? "typing" : "status"}>
        {typing ? <span className={styles.typing}>{labels.typing}</span> : children}
      </Crossfade>
    </div>
  );
}
ChatDescription.displayName = "Chat.Description";

export type ChatActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The controls at the end of the header, tier `s`: ghost icon buttons (`Chat.SearchButton`, a
 * call, a toggle), a `Select` or a `SegmentedControl`, a ⋯ `Dropdown` last.
 */
function ChatActions({ className, children, ...rest }: ChatActionsProps) {
  return (
    <div className={cx(fieldTierClass, styles.actions, className)} data-size="s" {...rest}>
      <ControlSizeProvider value="s">{children}</ControlSizeProvider>
    </div>
  );
}
ChatActions.displayName = "Chat.Actions";

export type ChatSearchButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-pressed"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/** Opens and closes the search bar: a ghost icon button, pressed while the search is open. */
function ChatSearchButton({ onClick, ref, ...rest }: ChatSearchButtonProps) {
  const { search, setSearch, labels, searchButtonRef } = useChat();
  const mergedRef = useMergedRefs(searchButtonRef, ref);
  const open = search !== null;
  return (
    <Button.Root
      variant="ghost"
      tone="neutral"
      aria-label={labels.search}
      {...rest}
      ref={mergedRef}
      pressed={open}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setSearch(open ? null : "");
      }}
    >
      <Button.Icon>
        <Icon name="action.search" />
      </Button.Icon>
    </Button.Root>
  );
}
ChatSearchButton.displayName = "Chat.SearchButton";

// ─── Search ───────────────────────────────────────────────────────────────────

export type ChatSearchProps = React.HTMLAttributes<HTMLDivElement> & {
  persistent?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The search bar: one control of yours at the start (`children`, a channel `Select`) and the field,
 * whose end — once a query is typed — holds the steps to the older and newer match and, last, the
 * place of the current match as a count badge («2/5», a gray «0/0» when none, each number rolling),
 * once the query is `minSearchLength` long — rising in and closing up as
 * the query comes and goes. Every match in the messages' text and transcripts is marked; the
 * current one is brought into view while the others step back. Shown while the search is open (`Chat.SearchButton` opens it, focusing the field), or
 * always with `persistent`: the field is there from the start, an empty query is no search.
 * Enter and ↑ go to the older match, Shift+Enter and ↓ to the newer one; Escape closes the bar
 * (persistent: clears the query).
 */
/**
 * The count of the search as the `matchCount` template fills it, each number rolling on its own
 * («2» of «2/5» rolls as the reader steps; the template's other text stays put).
 */
function rollingCount(template: string, index: number, count: number): React.ReactNode {
  // One run of text in the badge (its flex gap stays out of «2/5»).
  return (
    <span>
      {template.split(/(\{index\}|\{count\})/).map((part) => {
        if (part === "{index}") return <RollingNumber key={part}>{index}</RollingNumber>;
        if (part === "{count}") return <RollingNumber key={part}>{count}</RollingNumber>;
        return part;
      })}
    </span>
  );
}

function ChatSearch({ persistent = false, className, children, ...rest }: ChatSearchProps) {
  const {
    search,
    setSearch,
    searched,
    matches,
    matchIndex,
    setMatchIndex,
    labels,
    searchButtonRef,
  } = useChat();
  const fieldRef = React.useRef<HTMLInputElement>(null);
  const open = persistent || search !== null;
  const query = search ?? "";
  const typed = searched !== "";
  // The count and the steps come and go with the query, closing up in place.
  const countPresence = usePartPresence<HTMLSpanElement>({ present: typed, axis: "inline" });
  const olderPresence = usePartPresence<HTMLButtonElement>({ present: typed, axis: "inline" });
  const newerPresence = usePartPresence<HTMLButtonElement>({ present: typed, axis: "inline" });
  // The field takes the focus when the reader opens the search, never with a search open on mount
  // (that would scroll the page to the chat), never in a bar that is always there.
  const wasOpen = React.useRef(open);
  React.useEffect(() => {
    if (open && !wasOpen.current) fieldRef.current?.focus();
    wasOpen.current = open;
  }, [open]);
  if (!open) return null;
  const count = matches.length;
  const step = (by: number) => {
    if (count > 1) setMatchIndex((((matchIndex + by) % count) + count) % count);
  };
  const place = typed
    ? count > 0
      ? formatLabel(labels.matches, { index: count - Math.min(matchIndex, count - 1), count })
      : labels.noMatches
    : "";
  return (
    <div className={cx(styles.search, className)} {...rest}>
      {children ? <div className={styles.searchStart}>{children}</div> : null}
      <Input.Root className={styles.searchField}>
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon name="action.search" tone="secondary" />
          </Input.Icon>
          <Input.Field
            ref={fieldRef}
            type="search"
            aria-label={labels.search}
            placeholder={labels.searchPlaceholder}
            value={query}
            // In a bar that is always there an empty query is no search: a `jumpTo` works again.
            onValueChange={(next) => setSearch(persistent && next === "" ? null : next)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                if (persistent) {
                  // An empty bar lets Escape through to the host (a dialog closes).
                  if (search === null) return;
                  event.preventDefault();
                  setSearch(null);
                } else {
                  event.preventDefault();
                  setSearch(null);
                  searchButtonRef.current?.focus();
                }
              }
              if (event.key === "Enter") {
                event.preventDefault();
                step(event.shiftKey ? -1 : 1);
              }
              if ((event.key === "ArrowUp" || event.key === "ArrowDown") && count > 1) {
                event.preventDefault();
                step(event.key === "ArrowUp" ? 1 : -1);
              }
            }}
          />
          {/* Once a query is typed, the field's own end: the steps to the older and newer match
              (unavailable under two matches, still in the tab order with their names), then, last,
              the place of the match as a count badge — «2/5», a gray «0/0» when none (the live
              region says it in words). One order in every state. */}
          {typed ? (
            <Input.Action
              ref={olderPresence.ref}
              className={olderPresence.className}
              label={labels.previousMatch}
              aria-disabled={count < 2 || undefined}
              onClick={() => step(1)}
            >
              <Icon name="nav.chevronUp" />
            </Input.Action>
          ) : null}
          {typed ? (
            <Input.Action
              ref={newerPresence.ref}
              className={newerPresence.className}
              label={labels.nextMatch}
              aria-disabled={count < 2 || undefined}
              onClick={() => step(-1)}
            >
              <Icon name="nav.chevronDown" />
            </Input.Action>
          ) : null}
          {typed ? (
            <span
              ref={countPresence.ref}
              className={cx(styles.searchCount, countPresence.className)}
              aria-hidden="true"
            >
              <Badge.Root color={count > 0 ? "blue" : undefined}>
                {rollingCount(
                  labels.matchCount,
                  count > 0 ? count - Math.min(matchIndex, count - 1) : 0,
                  count,
                )}
              </Badge.Root>
            </span>
          ) : null}
        </Input.Wrapper>
      </Input.Root>
      {/* Mounted with the bar, so the place is announced as it changes. */}
      <VisuallyHidden live="polite">{place}</VisuallyHidden>
    </div>
  );
}
ChatSearch.displayName = "Chat.Search";

// ─── Messages ─────────────────────────────────────────────────────────────────

/** Where a message of `Chat.Messages items` stands, handed to `renderMessage`. */
export type ChatMessageEntry<T = unknown> = {
  /** The place in its author's run; set on the rendered `Message.Root` for you. */
  position: MessagePosition;
  /** The first of a run: the author's header shows here in a group chat. */
  showAuthor: boolean;
  /** The last of a run: the avatar shows here in a group chat. */
  showAvatar: boolean;
  /** Another item of the list by its key (a reply's original), as the list holds it now. */
  find: (key: string) => T | undefined;
};

export type ChatMessagesProps<T = unknown> = Omit<
  MessageListProps,
  | "selected"
  | "defaultSelected"
  | "onSelectedChange"
  | "jumpTo"
  | "highlight"
  | "onMatchesChange"
  | "revealRef"
  | "labels"
> & {
  loading?: boolean;
  hasOlder?: boolean;
  onLoadOlder?: () => void | Promise<void>;
  items?: readonly T[];
  getKey?: (item: T) => string;
  getAuthor?: (item: T) => string;
  getDate?: (item: T) => Date;
  isService?: (item: T) => boolean;
  renderMessage?: (item: T, entry: ChatMessageEntry<T>) => React.ReactElement;
  unread?: string;
  groupWindow?: number;
  now?: Date;
  formatDate?: (date: Date, now: Date, timeZone?: string) => string;
};

type Built = {
  item: unknown;
  position: MessagePosition;
  /** The text of the band above it, `false` without one. */
  unread: string | false;
  element: React.ReactElement;
};

/** The rows of `items`: dates and messages, each element kept while its item and place are. */
function useItemRows<T>(
  props: Pick<
    ChatMessagesProps<T>,
    | "items"
    | "getKey"
    | "getAuthor"
    | "getDate"
    | "isService"
    | "renderMessage"
    | "unread"
    | "groupWindow"
    | "now"
    | "timeZone"
    | "formatDate"
  >,
  /** The text of the «unread» band (`labels.unread`). */
  unreadLabel: string,
): React.ReactElement[] | null {
  const built = React.useRef(new Map<string, Built>());
  const dates = React.useRef(new Map<string, React.ReactElement>());
  /** The items by key as of this render: what `entry.find` reads. */
  const byKey = React.useRef(new Map<string, T>());
  const [find] = React.useState(() => (key: string) => byKey.current.get(key));
  const { items, getKey, getAuthor, getDate, renderMessage, unread } = props;
  if (!items || !getKey || !getAuthor || !getDate || !renderMessage) return null;
  byKey.current = new Map(items.map((item) => [getKey(item), item]));
  const entries: MessageListEntry<T>[] = groupMessages(items, {
    getAuthor,
    getDate,
    getKey: (item) => getKey(item),
    isService: props.isService,
    groupWindow: props.groupWindow,
    now: props.now,
    timeZone: props.timeZone,
    formatDate: props.formatDate,
  } satisfies GroupMessagesOptions<T>);
  const next = new Map<string, Built>();
  const rows = entries.map((entry) => {
    if (entry.type === "date") {
      const id = `${entry.key}\u0000${entry.label}`;
      let element = dates.current.get(id);
      if (!element) {
        element = <ChatSeparator key={entry.key}>{entry.label}</ChatSeparator>;
        dates.current.set(id, element);
      }
      return element;
    }
    const isUnread = entry.key === unread ? unreadLabel : false;
    const cached = built.current.get(entry.key);
    if (
      cached &&
      cached.item === entry.item &&
      cached.position === entry.position &&
      cached.unread === isUnread
    ) {
      next.set(entry.key, cached);
      return cached.element;
    }
    const rendered = renderMessage(entry.item, {
      position: entry.position,
      showAuthor: entry.showAuthor,
      showAvatar: entry.showAvatar,
      find,
    });
    const props = rendered.props as { value?: string; position?: MessagePosition };
    const message =
      rendered.type === Message.Root
        ? React.cloneElement(rendered as React.ReactElement<typeof props>, {
            value: props.value ?? entry.key,
            position: props.position ?? entry.position,
          })
        : rendered;
    const element = isUnread ? (
      <React.Fragment key={entry.key}>
        <ChatUnread labels={{ unread: isUnread }} />
        {message}
      </React.Fragment>
    ) : (
      React.cloneElement(message, { key: entry.key })
    );
    next.set(entry.key, {
      item: entry.item,
      position: entry.position,
      unread: isUnread,
      element,
    });
    return element;
  });
  built.current = next;
  return rows;
}

/** The placeholders of a first load, oldest first: the side and the lines of each bubble. */
const LOADING_ROWS = [
  { direction: "incoming", lines: 1 },
  { direction: "incoming", lines: 2 },
  { direction: "outgoing", lines: 1 },
  { direction: "incoming", lines: 1 },
  { direction: "outgoing", lines: 2 },
  { direction: "outgoing", lines: 1 },
] as const;

/**
 * A conversation on its way: bubbles in the messages' geometry on alternating sides, standing at
 * the end of the list like the messages they stand for (a group chat keeps the avatar's gutter).
 */
function ChatLoading({ group }: { group: boolean }) {
  return (
    <div className={styles.loading} aria-hidden="true">
      {LOADING_ROWS.map((row, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed set of placeholders
          key={index}
          className={styles.loadingRow}
          data-direction={row.direction}
          data-lines={row.lines}
        >
          {group && row.direction === "incoming" ? <Skeleton shape="circle" size="m" /> : null}
          <Skeleton shape="block" className={styles.skeletonBubble} />
        </div>
      ))}
    </div>
  );
}

/**
 * The conversation: the one message list of the kit, in its own scroller. A `role="log"` of rows
 * (new messages are announced politely) with one tab stop — arrows, Home and End move between
 * messages. Rows come from `items` (dates, runs and the unread band added for you) or from
 * children (`Message.Root`, `Chat.Separator`, `Chat.Service`, `Chat.Unread`; `Chat.SelectionBar`
 * and `Message.Typing` close the list). Only the rows around the view render; the list opens at
 * the end and keeps the reader's place.
 */
function ChatMessages<T>({
  group = false,
  loading = false,
  hasOlder = false,
  onLoadOlder,
  items,
  getKey,
  getAuthor,
  getDate,
  isService,
  renderMessage,
  unread,
  groupWindow,
  now,
  timeZone,
  formatDate,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: ChatMessagesProps<T>) {
  const chat = useChat();
  const rows = useItemRows<T>(
    {
      items,
      getKey,
      getAuthor,
      getDate,
      isService,
      renderMessage,
      unread,
      groupWindow,
      now,
      timeZone,
      formatDate,
    },
    chat.labels.unread,
  );
  // The chat's own typing bubble ends the list, unless the list has one of its own (a group chat
  // shows who types).
  const ownTyping = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === Message.Typing,
  );
  const name = ariaLabel ?? (ariaLabelledBy || chat.hasTitle ? undefined : chat.labels.messages);
  const selection =
    chat.selected === undefined
      ? {}
      : { selected: chat.selected, onSelectedChange: chat.setSelected };
  // The list mounts once the first load is done: what it shows then is its first render — no
  // message enters, none is reported new.
  return (
    <>
      <Crossfade
        state={loading ? "loading" : "ready"}
        fill
        className={styles.messages}
        aria-busy={loading || undefined}
      >
        {loading ? (
          <ChatLoading group={group} />
        ) : (
          <ScrollContainer
            anchor="end"
            edges="none"
            onReachStart={hasOlder ? onLoadOlder : undefined}
            className={styles.scroller}
          >
            {hasOlder ? (
              <div className={styles.older} aria-hidden="true">
                <Skeleton shape="block" className={styles.skeletonBubble} />
              </div>
            ) : null}
            <MessageList
              {...rest}
              {...selection}
              aria-label={name}
              aria-labelledby={
                ariaLabelledBy ?? (ariaLabel || !chat.hasTitle ? undefined : chat.titleId)
              }
              group={group}
              timeZone={timeZone}
              jumpTo={chat.jumpTo}
              highlight={chat.searched}
              onMatchesChange={chat.setMatches}
              revealRef={chat.revealRef}
              labels={chat.labels}
            >
              {rows}
              {children}
              {ownTyping ? null : <Message.Typing open={chat.typing} />}
            </MessageList>
          </ScrollContainer>
        )}
      </Crossfade>
      <VisuallyHidden live="polite">{loading ? chat.labels.loading : ""}</VisuallyHidden>
    </>
  );
}
ChatMessages.displayName = "Chat.Messages";

// ─── Footer ───────────────────────────────────────────────────────────────────

export type ChatFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The bottom of the chat, under the messages: the `Composer`. */
function ChatFooter({ className, ...rest }: ChatFooterProps) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}
ChatFooter.displayName = "Chat.Footer";

export const Chat = {
  Root: ChatRoot,
  Header: ChatHeader,
  Title: ChatTitle,
  Badges: ChatBadges,
  Description: ChatDescription,
  Actions: ChatActions,
  SearchButton: ChatSearchButton,
  Search: ChatSearch,
  Pinned: ChatPinned,
  Messages: ChatMessages,
  SelectionBar: ChatSelectionBar,
  Separator: ChatSeparator,
  Service: ChatService,
  ServiceIcon: ChatServiceIcon,
  ServiceChange: ChatServiceChange,
  Unread: ChatUnread,
  Footer: ChatFooter,
};

export type { GroupMessagesOptions, MessageListEntry } from "./groupMessages";
export { formatMessageDate, groupMessages } from "./groupMessages";

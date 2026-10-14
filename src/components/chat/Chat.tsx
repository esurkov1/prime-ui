import * as React from "react";

import { Button } from "@/components/button/Button";
import { Crossfade } from "@/components/crossfade/Crossfade";
import { Input } from "@/components/input/Input";
import { Message } from "@/components/message/Message";
import type { MessagePosition } from "@/components/message/types";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { formatLabel } from "@/internal/formatLabel";
import type { Selection } from "@/internal/messageList";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./Chat.module.css";
import { ChatPinned } from "./ChatPinned";
import { ChatSeparator, ChatService, ChatUnread } from "./ChatRows";
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
  ChatServiceProps,
  ChatUnreadLabels,
  ChatUnreadProps,
} from "./ChatRows";
export type { ChatLabels } from "./chatContext";
export type { ChatSelectionBarProps } from "./MessageList";

const CHAT_LABELS: ChatLabels = {
  ...MESSAGE_LIST_LABELS,
  typing: "печатает…",
  search: "Поиск по переписке",
  searchPlaceholder: "Поиск по сообщениям",
  matches: "{index} из {count}",
  noMatches: "Нет совпадений",
  previousMatch: "Предыдущее совпадение",
  nextMatch: "Следующее совпадение",
  messages: "Переписка",
  unread: "Непрочитанные сообщения",
  loading: "Загрузка сообщений",
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export type ChatRootProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  /**
   * Selection mode (controlled): the `value`s of the selected messages, `null` while not selecting.
   * Any of the triad lets a message's menu start selection («Выбрать»).
   */
  selected?: Selection;
  /** Initial selection (uncontrolled). */
  defaultSelected?: Selection;
  /** The selection changed: a message toggled, selection started (`[value]`) or ended (`null`). */
  onSelectedChange?: (selected: Selection) => void;
  /** The search query (controlled); `null` — the search bar is closed. */
  search?: string | null;
  /** The initial search (uncontrolled). Default `null`. */
  defaultSearch?: string | null;
  /** The search opened, changed its query or closed (`null`). */
  onSearchChange?: (search: string | null) => void;
  /**
   * A message to bring into view and point at (a link, a notification): the others blink around
   * it. A search's current match takes its place while the search is open.
   */
  current?: string | null;
  /** The other side is typing: the header's status turns into «печатает…» and the list ends with the typing bubble. */
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
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  search: searchProp,
  defaultSearch = null,
  onSearchChange,
  current: currentProp = null,
  typing = false,
  labels: labelsProp,
  className,
  children,
  ref,
  ...rest
}: ChatRootProps) {
  const labels = React.useMemo(() => ({ ...CHAT_LABELS, ...labelsProp }), [labelsProp]);
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
  const match = matches[matches.length - 1 - Math.min(matchIndex, matches.length - 1)];
  const current = searching ? (match ?? null) : currentProp;
  const selected = selectable ? selectedState : undefined;

  const value = React.useMemo<ChatContextValue>(
    () => ({
      selected,
      setSelected,
      search,
      setSearch,
      matches,
      setMatches,
      matchIndex,
      setMatchIndex,
      current,
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
      matches,
      matchIndex,
      current,
      typing,
      jump,
      titleId,
      hasTitle,
      labels,
    ],
  );

  return (
    <ChatProvider value={value}>
      <div ref={ref} className={cx(styles.root, className)} {...rest}>
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

/** The children as a flat list: fragments opened, `null`, booleans and empty strings dropped. */
function flattenChildren(nodes: React.ReactNode, prefix = ""): React.ReactNode[] {
  return React.Children.toArray(nodes).flatMap((node) => {
    if (!React.isValidElement(node)) return [node];
    const key = `${prefix}${node.key ?? ""}`;
    if (node.type === React.Fragment) {
      return flattenChildren((node.props as { children?: React.ReactNode }).children, `${key}/`);
    }
    return [prefix ? React.cloneElement(node, { key }) : node];
  });
}

/**
 * The top of the chat: who it is with. A row of the leading elements (a back button, an `Avatar`),
 * the title over the description, and the actions at the end. Children are sorted by type:
 * `Chat.Title`, `Chat.Description` and `Chat.Actions` take their places, everything else leads
 * the row side by side, in the order written.
 */
function ChatHeader({ className, children, ...rest }: ChatHeaderProps) {
  const lead: React.ReactNode[] = [];
  const text: React.ReactNode[] = [];
  for (const child of flattenChildren(children)) {
    const own =
      React.isValidElement(child) &&
      (child.type === ChatTitle || child.type === ChatDescription || child.type === ChatActions);
    (own ? text : lead).push(child);
  }
  return (
    <div className={cx(styles.header, className)} {...rest}>
      {lead.length > 0 ? <div className={styles.lead}>{lead}</div> : null}
      {text}
    </div>
  );
}
ChatHeader.displayName = "Chat.Header";

export type ChatTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  /** Heading level that fits the page outline (the look does not change). Default `h2`. */
  as?: "h2" | "h3" | "h4";
  ref?: React.Ref<HTMLHeadingElement>;
};

/** Who the chat is with, one line; it also names the conversation for assistive tech. */
function ChatTitle({ as: Tag = "h2", className, id, ...rest }: ChatTitleProps) {
  const { titleId, setHasTitle } = useChat();
  React.useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);
  return <Tag id={id ?? titleId} className={cx(styles.title, className)} {...rest} />;
}
ChatTitle.displayName = "Chat.Title";

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

/** The buttons at the end of the header: `Chat.SearchButton`, a call, a `Dropdown` of more. */
function ChatActions({ className, ...rest }: ChatActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
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
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The search bar, shown while the search is open: the field (focused as it opens), the place of
 * the current match («2 из 5», announced), and the steps to the older and newer match. Every match
 * in the messages' text and transcripts is marked; the current one is brought into view while the
 * others step back. Enter goes to the older match, Escape closes.
 */
function ChatSearch({ className, ...rest }: ChatSearchProps) {
  const { search, setSearch, matches, matchIndex, setMatchIndex, labels, searchButtonRef } =
    useChat();
  const fieldRef = React.useRef<HTMLInputElement>(null);
  const open = search !== null;
  // The field takes the focus when the reader opens the search, never with a search open on mount
  // (that would scroll the page to the chat).
  const wasOpen = React.useRef(open);
  React.useEffect(() => {
    if (open && !wasOpen.current) fieldRef.current?.focus();
    wasOpen.current = open;
  }, [open]);
  if (!open) return null;
  const count = matches.length;
  const step = (by: number) => setMatchIndex((((matchIndex + by) % count) + count) % count);
  const older = () => {
    if (count > 1) step(1);
  };
  const newer = () => {
    if (count > 1) step(-1);
  };
  const place = search.trim()
    ? count > 0
      ? formatLabel(labels.matches, { index: count - Math.min(matchIndex, count - 1), count })
      : labels.noMatches
    : "";
  return (
    <div className={cx(styles.search, className)} {...rest}>
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
            value={search}
            onValueChange={setSearch}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setSearch(null);
                searchButtonRef.current?.focus();
              }
              if (event.key === "Enter") {
                event.preventDefault();
                older();
              }
            }}
          />
        </Input.Wrapper>
      </Input.Root>
      <span className={styles.searchCount} aria-live="polite">
        {place}
      </span>
      <Button.Root
        variant="ghost"
        tone="neutral"
        aria-label={labels.previousMatch}
        disabled={count < 2}
        onClick={older}
      >
        <Button.Icon>
          <Icon name="nav.chevronUp" />
        </Button.Icon>
      </Button.Root>
      <Button.Root
        variant="ghost"
        tone="neutral"
        aria-label={labels.nextMatch}
        disabled={count < 2}
        onClick={newer}
      >
        <Button.Icon>
          <Icon name="nav.chevronDown" />
        </Button.Icon>
      </Button.Root>
    </div>
  );
}
ChatSearch.displayName = "Chat.Search";

// ─── Messages ─────────────────────────────────────────────────────────────────

/** Where a message of `Chat.Messages items` stands, handed to `renderMessage`. */
export type ChatMessageEntry = {
  /** The place in its author's run; set on the rendered `Message.Root` for you. */
  position: MessagePosition;
  /** The first of a run: the author's header shows here in a group chat. */
  showAuthor: boolean;
  /** The last of a run: the avatar shows here in a group chat. */
  showAvatar: boolean;
};

export type ChatMessagesProps<T = unknown> = Omit<
  MessageListProps,
  | "group"
  | "selected"
  | "defaultSelected"
  | "onSelectedChange"
  | "current"
  | "highlight"
  | "onMatchesChange"
  | "revealRef"
  | "labels"
> & {
  /**
   * `direct` — a conversation of two; `group` — many authors: the first message of an author's run
   * shows the author's header (`Message.Author`), the last one the avatar (`Message.Avatar`), and
   * incoming messages keep the avatar's gutter. Default `direct`.
   */
  type?: "direct" | "group";
  /**
   * The first load of the conversation: bubble-shaped placeholders stand in the list's place
   * (`aria-busy`, `labels.loading` announced), then cross-fade into the messages.
   */
  loading?: boolean;
  /** Older history exists: a placeholder stands above the first message and `onLoadOlder` runs at the top. */
  hasOlder?: boolean;
  /** The reader reached the top while `hasOlder`: load older messages and prepend them. */
  onLoadOlder?: () => void | Promise<void>;
  /** Messages as application data, in time order: the list adds the dates and runs itself. */
  items?: readonly T[];
  /** A stable key of an item (with `items`): it is also its message's `value`. */
  getKey?: (item: T) => string;
  /** Who wrote an item (an id, with `items`): a change of author starts a new run. */
  getAuthor?: (item: T) => string;
  /** When an item was sent (with `items`): a new day gets a date. */
  getDate?: (item: T) => Date;
  /** An event of the chat, not a message: it stands alone and breaks the runs around it. */
  isService?: (item: T) => boolean;
  /**
   * Renders an item (with `items`): a `Message.Root` (its `value` and `position` are set for you)
   * or a `Chat.Service`. Called again only for items whose data or place changed, or when this
   * function changes — keep it stable (`useCallback`) for a long history.
   */
  renderMessage?: (item: T, entry: ChatMessageEntry) => React.ReactElement;
  /** The key of the first unread item: the «Непрочитанные» band stands above it. */
  unread?: string;
  /** Messages of one author further apart than this many minutes start a new run. Default 5. */
  groupWindow?: number;
  /** «Today» for the dates. Default: now. */
  now?: Date;
  /** The label of a date. Default «Сегодня», «Вчера», «12 марта». */
  formatDate?: (date: Date, now: Date) => string;
};

type Built = {
  item: unknown;
  position: MessagePosition;
  /** The text of the band above it, `false` without one. */
  unread: string | false;
  render: unknown;
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
    | "formatDate"
  >,
  /** The text of the «unread» band (`labels.unread`). */
  unreadLabel: string,
): React.ReactElement[] | null {
  const built = React.useRef(new Map<string, Built>());
  const dates = React.useRef(new Map<string, React.ReactElement>());
  const { items, getKey, getAuthor, getDate, renderMessage, unread } = props;
  if (!items || !getKey || !getAuthor || !getDate || !renderMessage) return null;
  const entries: MessageListEntry<T>[] = groupMessages(items, {
    getAuthor,
    getDate,
    getKey: (item) => getKey(item),
    isService: props.isService,
    groupWindow: props.groupWindow,
    now: props.now,
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
      cached.unread === isUnread &&
      cached.render === renderMessage
    ) {
      next.set(entry.key, cached);
      return cached.element;
    }
    const rendered = renderMessage(entry.item, {
      position: entry.position,
      showAuthor: entry.showAuthor,
      showAvatar: entry.showAvatar,
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
      render: renderMessage,
      element,
    });
    return element;
  });
  built.current = next;
  return rows;
}

/**
 * The conversation: the one message list of the kit, in its own scroller. A `role="log"` of rows
 * (new messages are announced politely) with one tab stop — arrows, Home and End move between
 * messages. Rows come from `items` (dates, runs and the unread band added for you) or from
 * children (`Message.Root`, `Chat.Separator`, `Chat.Service`, `Chat.Unread`; `Chat.SelectionBar`
 * and `Message.Typing` close the list). Only the rows around the view render; the list opens at
 * the end and keeps the reader's place.
 */
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

function ChatMessages<T>({
  type = "direct",
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
          <ChatLoading group={type === "group"} />
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
              group={type === "group"}
              current={chat.current}
              highlight={chat.search ?? ""}
              onMatchesChange={chat.setMatches}
              revealRef={chat.revealRef}
              labels={chat.labels}
            >
              {rows}
              {children}
              {ownTyping ? null : <Message.Typing active={chat.typing} />}
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
  Description: ChatDescription,
  Actions: ChatActions,
  SearchButton: ChatSearchButton,
  Search: ChatSearch,
  Pinned: ChatPinned,
  Messages: ChatMessages,
  SelectionBar: ChatSelectionBar,
  Separator: ChatSeparator,
  Service: ChatService,
  Unread: ChatUnread,
  Footer: ChatFooter,
};

export type { GroupMessagesOptions, MessageListEntry } from "./groupMessages";
export { formatMessageDate, groupMessages } from "./groupMessages";

import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Crossfade } from "@/components/crossfade/Crossfade";
import { Dropdown, type DropdownContentProps } from "@/components/dropdown/Dropdown";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Input } from "@/components/input/Input";
import { List, type ListItemProps } from "@/components/list/List";
import type { MessageStatus } from "@/components/message/Message";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { rowGaps, useVirtualRows } from "@/hooks/useVirtualRows";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatClock } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import { highlightChildren } from "@/internal/HighlightMatch";
import { useLabels } from "@/internal/labels";
import { leaveInPlace } from "@/internal/leaveInPlace";
import { type ControlSize, stepDown } from "@/internal/states";
import { useFlipList } from "@/internal/useFlipList";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./ChatList.module.css";
import { formatChatTime } from "./formatChatTime";

export { formatChatTime } from "./formatChatTime";

// ─── Labels ───────────────────────────────────────────────────────────────────

/** What the last message of a dialog is when it is not text: the word the preview shows. */
export type ChatListMediaKind =
  | "photo"
  | "video"
  | "voice"
  | "videoNote"
  | "file"
  | "location"
  | "contact";

export type ChatListLabels = {
  /** `aria-label` of the list. */
  list: string;
  /** `aria-label` of the search field. */
  search: string;
  /** Placeholder of the search field. */
  searchPlaceholder: string;
  /** Announced while `loading`. */
  loading: string;
  /** The empty state without a search. */
  empty: string;
  /** The empty state of a search; announced. */
  noResults: string;
  /** Announced after a search changes the list; `{count}` — the dialogs found. */
  results: string;
  /** The preview while the other side types (`typing`). */
  typing: string;
  /** The preview while someone in a group types (`typing="Анна"`); `{name}` — who. */
  typingName: string;
  /** Before an unsent draft in the preview. */
  draft: string;
  /** Spoken for the unread count; `{count}` — the number. */
  unread: string;
  /** Spoken for the «@» mark (`mention`). */
  mention: string;
  /** Name of the muted glyph (`muted`). */
  muted: string;
  /** Name of the pin glyph (`pinned`). */
  pinned: string;
  /** Delivery of the reader's last message, as `Message` says it. */
  sending: string;
  sent: string;
  read: string;
  failed: string;
  /** Media words of the preview (`ChatList.ItemDescription kind`). */
  photo: string;
  video: string;
  voice: string;
  videoNote: string;
  file: string;
  location: string;
  contact: string;
  /** `aria-label` of the point the row menu opens from. */
  menu: string;
};

export const CHAT_LIST_LABELS: ChatListLabels = {
  list: "Диалоги",
  search: "Поиск по диалогам",
  searchPlaceholder: "Поиск",
  loading: "Загрузка диалогов",
  empty: "Нет диалогов",
  noResults: "Ничего не найдено",
  results: "Найдено: {count}",
  typing: "печатает…",
  typingName: "{name} печатает…",
  draft: "Черновик:",
  unread: "непрочитанных: {count}",
  mention: "упоминание",
  muted: "Без звука",
  pinned: "Закреплён",
  sending: "Отправляется",
  sent: "Отправлено",
  read: "Прочитано",
  failed: "Не отправлено",
  photo: "Фото",
  video: "Видео",
  voice: "Голосовое сообщение",
  videoNote: "Видеосообщение",
  file: "Файл",
  location: "Геопозиция",
  contact: "Контакт",
  menu: "Действия с диалогом",
};

// ─── Contexts ─────────────────────────────────────────────────────────────────

type Point = { x: number; y: number };

type ChatListContextValue = {
  labels: ChatListLabels;
  size: ControlSize;
  query: string;
  now: Date;
  formatTime: (date: Date, now: Date) => string;
  value: string | null;
  /** The row that holds the list's one Tab stop. */
  tabKey: string | null;
  select: (key: string) => void;
  /** Arrows, Home / End and the menu keys of a row. */
  keyDown: (event: React.KeyboardEvent<HTMLElement>, key: string) => void;
  focused: (key: string) => void;
  openMenu: (key: string, point: Point | null) => void;
  register: (key: string, node: HTMLElement | null) => void;
  /** Rows new in the data since the last render: they rise in once. */
  entering: Set<string>;
  /** Rows taken out of the data: they close up in place as they unmount. */
  leaving: Set<string>;
};

const ChatListContext = React.createContext<ChatListContextValue | null>(null);

type RowContextValue = {
  key: string;
  /** The virtual window measures the row (its `<li>`). */
  measure?: (node: HTMLElement | null) => void;
};

const RowContext = React.createContext<RowContextValue | null>(null);

function useChatList(part: string): [ChatListContextValue, RowContextValue] {
  const list = React.useContext(ChatListContext);
  const row = React.useContext(RowContext);
  if (!list || !row) throw new Error(`${part} is rendered by ChatList.Root renderItem`);
  return [list, row];
}

// ─── Parts of an item ─────────────────────────────────────────────────────────

export type ChatListItemIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Before the name: an `Avatar.Root` (sized by the row). After it: a small `Icon`. */
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The avatar of the dialog before `ChatList.ItemText`; after it, a glyph beside the name (a
 * verified mark, a bot). Drawn by `ChatList.Item`.
 */
function ChatListItemIcon(_props: ChatListItemIconProps): React.ReactNode {
  return null;
}
ChatListItemIcon.displayName = "ChatList.ItemIcon";

export type ChatListItemTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The name of the dialog: one line, truncated; the search query is marked in it. */
function ChatListItemText(_props: ChatListItemTextProps): React.ReactNode {
  return null;
}
ChatListItemText.displayName = "ChatList.ItemText";

export type ChatListItemDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Who wrote the last message: «Вы», a member of a group. Shown as «{author}: » before it. */
  author?: string;
  /** The last message is not text: its word («Фото», «Голосовое сообщение») leads the preview. */
  kind?: ChatListMediaKind;
  /** Length of a voice or video message, seconds: «Голосовое сообщение 0:42». */
  duration?: number;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The preview of the last message, one line: the author, the media word and the text (a caption,
 * a file name). The search query is marked in the text. Drawn by `ChatList.Item`.
 */
function ChatListItemDescription(_props: ChatListItemDescriptionProps): React.ReactNode {
  return null;
}
ChatListItemDescription.displayName = "ChatList.ItemDescription";

export type ChatListItemMenuProps = Omit<
  DropdownContentProps,
  "side" | "align" | "matchTriggerWidth"
>;

/**
 * The menu of a dialog: your `Dropdown.Item`s (Закрепить, Без звука, Отметить прочитанным,
 * Удалить — the last one `tone="danger"`). Opens where the pointer is on right click, on a long
 * press, and from the keyboard (Shift+F10, the menu key).
 */
function ChatListItemMenu({ children, ...rest }: ChatListItemMenuProps) {
  return <Dropdown.Content {...rest}>{children}</Dropdown.Content>;
}
ChatListItemMenu.displayName = "ChatList.ItemMenu";

const isPart = <P,>(
  node: React.ReactNode,
  type: React.ElementType,
): node is React.ReactElement<P> => React.isValidElement(node) && node.type === type;

/** The children as a flat list: fragments opened. */
function flatten(nodes: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(nodes).flatMap((node) =>
    React.isValidElement<{ children?: React.ReactNode }>(node) && node.type === React.Fragment
      ? flatten(node.props.children)
      : [node],
  );
}

type ItemParts = {
  avatar: React.ReactElement<ChatListItemIconProps> | null;
  text: React.ReactElement<ChatListItemTextProps> | null;
  glyphs: React.ReactElement<ChatListItemIconProps>[];
  description: React.ReactElement<ChatListItemDescriptionProps> | null;
  menu: React.ReactElement<ChatListItemMenuProps> | null;
};

/** The parts of an item by type: an icon before the name is the avatar, after it a glyph. */
function partsOf(children: React.ReactNode): ItemParts {
  const parts: ItemParts = { avatar: null, text: null, glyphs: [], description: null, menu: null };
  for (const node of flatten(children)) {
    if (isPart<ChatListItemIconProps>(node, ChatListItemIcon)) {
      if (parts.text === null && parts.avatar === null) parts.avatar = node;
      else parts.glyphs.push(node);
    } else if (isPart<ChatListItemTextProps>(node, ChatListItemText)) parts.text = node;
    else if (isPart<ChatListItemDescriptionProps>(node, ChatListItemDescription))
      parts.description = node;
    else if (isPart<ChatListItemMenuProps>(node, ChatListItemMenu)) parts.menu = node;
  }
  return parts;
}

/**
 * A small part of a row that may come and go while the row stays (a count, a glyph): it rises in
 * when it appears in a mounted row and closes up in place when it goes.
 */
function Pop({
  live,
  className,
  children,
}: {
  live: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [enter] = React.useState(live);
  React.useLayoutEffect(() => {
    const node = ref.current;
    return () => {
      // A row that leaves takes its parts with it: the copy is placed only when the row stays.
      if (node) leaveInPlace(node, "inline");
    };
  }, []);
  return (
    <span ref={ref} className={cx(styles.pop, enter && enterMotion.enter, className)}>
      {children}
    </span>
  );
}

const STATUS_ICONS = [
  ["sending", "status.pending"],
  ["sent", "status.sent"],
  ["read", "status.read"],
  ["failed", "status.failed"],
] as const;

// ─── Item ─────────────────────────────────────────────────────────────────────

/** The rows that glide to a new order: every row that is not leaving, keyed by its key. */
const flipRows = (list: HTMLElement) =>
  list.querySelectorAll<HTMLElement>("li:not([data-leaving]) > [data-dnd-item]");
const flipRowKey = (row: HTMLElement) => row.dataset.dndItem;

/** How long a finger rests on a row before its menu opens. */
const LONG_PRESS_MS = 500;
/** A finger that moves further than this (px) scrolls instead of pressing. */
const LONG_PRESS_SLOP = 8;

type ChatListItemOwnProps = {
  /** When the last message was sent: a `Date` (shown with the root's `formatTime`) or the text to show. */
  time?: Date | string;
  /** Delivery of the reader's own last message: ✓ sent, ✓✓ read, the clock, or failed. */
  status?: MessageStatus;
  /** Unread messages: the count at the end of the row. Default 0. */
  unread?: number;
  /** The reader is mentioned among the unread: an «@» beside the count. */
  mention?: boolean;
  /** Notifications are off: a muted glyph beside the name and a gray count. */
  muted?: boolean;
  /** Pinned by the reader: a pin at the end of the row while nothing is unread. */
  pinned?: boolean;
  /**
   * The other side types: the preview turns into «печатает…» in the accent, and back. A name
   * («Анна») for a group: «Анна печатает…».
   */
  typing?: boolean | string;
  /** The reader's unsent text: the preview shows «Черновик:» and the text. */
  draft?: string;
  /**
   * `ChatList.ItemIcon` (the avatar; after the name — a glyph), `ChatList.ItemText`,
   * `ChatList.ItemDescription`, `ChatList.ItemMenu`.
   */
  children?: React.ReactNode;
};

export type ChatListItemProps = ChatListItemOwnProps &
  Omit<ListItemProps, keyof ChatListItemOwnProps | "value" | "current" | "asChild" | "disabled">;

/**
 * A dialog: a `List.Item` row (a button, or a link with `href`) with the avatar, the name and the
 * time on the first line, the preview and the counts on the second. Its key and `current` come
 * from `ChatList.Root`.
 */
function ChatListItem({
  time,
  status,
  unread = 0,
  mention = false,
  muted = false,
  pinned = false,
  typing = false,
  draft,
  className,
  children,
  onClick,
  onKeyDown,
  onFocus,
  onContextMenu,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ref,
  ...rest
}: ChatListItemProps) {
  const [list, row] = useChatList("ChatList.Item");
  const { key } = row;
  const { labels, query } = list;
  const parts = partsOf(children);
  const hasMenu = parts.menu !== null;

  const nodeRef = React.useRef<HTMLElement | null>(null);
  const { register } = list;
  const { measure } = row;
  const own = React.useCallback(
    (node: HTMLElement | null) => {
      nodeRef.current = node;
      register(key, node);
      // The window measures the row's `<li>`: its height is the row's place in the list.
      measure?.(node?.parentElement ?? null);
    },
    [register, measure, key],
  );
  const mergedRef = useMergedRefs<HTMLElement>(own, ref);

  // A row new in the data rises in once; one the owner took out closes up in place.
  const [enter] = React.useState(() => list.entering.has(key));
  const { entering, leaving } = list;
  React.useEffect(() => {
    entering.delete(key);
  }, [entering, key]);
  React.useLayoutEffect(() => {
    const node = nodeRef.current;
    const item = node?.parentElement;
    return () => {
      if (item && leaving.has(key)) {
        leaving.delete(key);
        leaveInPlace(item, "block");
      }
    };
  }, [leaving, key]);

  // Parts that come and go while the row stays rise in; on the first render they are just there.
  const mounted = React.useRef(false);
  React.useEffect(() => {
    mounted.current = true;
  }, []);
  const live = mounted.current;

  // ── long press ──
  const press = React.useRef<{ timer: number; x: number; y: number } | null>(null);
  const pressed = React.useRef(false);
  const cancelPress = () => {
    if (press.current) window.clearTimeout(press.current.timer);
    press.current = null;
  };
  React.useEffect(
    () => () => {
      if (press.current) window.clearTimeout(press.current.timer);
    },
    [],
  );

  // ── first line ──
  const glyphSize = stepDown(list.size, 2);
  const textProps = parts.text?.props;
  const title = (
    <List.ItemText {...textProps} className={cx(styles.title, textProps?.className)}>
      <span className={styles.name}>{highlightChildren(textProps?.children, query)}</span>
      {parts.glyphs.map((glyph, index) => {
        const { children: glyphChildren, className: glyphClass, ...glyphRest } = glyph.props;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: glyphs keep their written order
          <React.Fragment key={index}>
            {" "}
            <span {...glyphRest} className={cx(styles.glyph, glyphClass)}>
              {glyphChildren}
            </span>
          </React.Fragment>
        );
      })}
      {muted ? " " : null}
      {muted ? (
        <Pop live={live} className={styles.glyph}>
          <Icon name="status.muted" size={glyphSize} label={labels.muted} animated={false} />
        </Pop>
      ) : null}
    </List.ItemText>
  );

  const formatted = time instanceof Date ? list.formatTime(time, list.now) : time;
  const meta =
    formatted || status ? (
      <List.ItemMeta className={styles.meta}>
        {status ? (
          <span
            className={styles.status}
            role="img"
            aria-label={labels[status]}
            data-status={status}
          >
            {STATUS_ICONS.map(([state, name]) => (
              <span key={state} className={styles.tick} data-tick={state} aria-hidden="true">
                <Icon name={name} size={glyphSize} animated={false} />
              </span>
            ))}
          </span>
        ) : null}
        {status && formatted ? " " : null}
        {formatted ? (
          <time dateTime={time instanceof Date ? time.toISOString() : undefined}>{formatted}</time>
        ) : null}
      </List.ItemMeta>
    ) : null;

  // ── second line ──
  const description = parts.description;
  const descProps = description?.props;
  const typingText =
    typeof typing === "string" ? formatLabel(labels.typingName, { name: typing }) : labels.typing;
  // The last draft stays drawn while it fades out.
  const lastDraft = React.useRef(draft);
  if (draft) lastDraft.current = draft;
  const draftText = draft || lastDraft.current;
  const shown: "typing" | "draft" | "preview" = typing ? "typing" : draft ? "draft" : "preview";
  const hasSecondLine = description !== null || draftText !== undefined || typing !== false;
  let preview: React.ReactNode = null;
  if (descProps) {
    const {
      author,
      kind,
      duration,
      children: descChildren,
      className: _className,
      ref: _ref,
      ...descRest
    } = descProps;
    const hasText = descChildren !== undefined && descChildren !== null && descChildren !== "";
    preview = (
      <span
        {...descRest}
        className={styles.layer}
        data-layer="preview"
        aria-hidden={shown !== "preview" || undefined}
      >
        {author ? <span className={styles.author}>{`${author}:`}</span> : null}
        {author ? " " : null}
        {kind ? (
          <span className={styles.kind}>
            {labels[kind]}
            {duration !== undefined ? ` ${formatClock(duration)}` : null}
            {hasText ? ", " : null}
          </span>
        ) : null}
        {hasText ? highlightChildren(descChildren, query) : null}
      </span>
    );
  }
  const secondLine = hasSecondLine ? (
    <List.ItemDescription
      ref={descProps?.ref}
      className={cx(styles.preview, descProps?.className)}
      data-shown={shown}
    >
      {preview}
      {draftText ? (
        <span
          className={styles.layer}
          data-layer="draft"
          aria-hidden={shown !== "draft" || undefined}
        >
          <span className={styles.draft}>{labels.draft}</span> {draftText}
        </span>
      ) : null}
      <span
        className={styles.layer}
        data-layer="typing"
        aria-hidden={shown !== "typing" || undefined}
      >
        {typingText}
      </span>
    </List.ItemDescription>
  ) : null;

  // ── counts ──
  const count = unread > 0;
  const pin = pinned && !count && !mention;
  // Beside two lines the cell stays even when empty: a count that goes closes up in place.
  const badges =
    count || mention || pin || hasSecondLine ? (
      <List.ItemMeta className={styles.badges}>
        {mention ? (
          <Pop live={live}>
            <Badge.Root color="blue" variant="solid" className={styles.mention} aria-hidden="true">
              @
            </Badge.Root>
            <VisuallyHidden>{labels.mention}</VisuallyHidden>
          </Pop>
        ) : null}
        {mention && count ? " " : null}
        {count ? (
          <Pop live={live}>
            <Badge.Root
              color={muted ? "gray" : "blue"}
              variant={muted ? "soft" : "solid"}
              className={styles.count}
              aria-hidden="true"
            >
              {unread}
            </Badge.Root>
            <VisuallyHidden>{formatLabel(labels.unread, { count: unread })}</VisuallyHidden>
          </Pop>
        ) : null}
        {pin ? (
          <Pop live={live} className={styles.glyph}>
            <Icon name="action.pin" size={glyphSize} label={labels.pinned} animated={false} />
          </Pop>
        ) : null}
      </List.ItemMeta>
    ) : null;

  const avatarProps = parts.avatar?.props;

  return (
    <List.Item
      {...rest}
      ref={mergedRef}
      current={list.value === key}
      tabIndex={list.tabKey === key ? 0 : -1}
      className={cx(styles.item, enter && enterMotion.enter, className)}
      data-dnd-item={key}
      aria-keyshortcuts={hasMenu ? "Shift+F10" : undefined}
      {...toDataAttributes({
        unread: count || undefined,
        muted: muted || undefined,
        menu: hasMenu || undefined,
      })}
      onClick={(event) => {
        // The long press that opened the menu is not a click on the row.
        if (pressed.current) {
          pressed.current = false;
          event.preventDefault();
          return;
        }
        onClick?.(event);
        if (!event.defaultPrevented) list.select(key);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (event.target === event.currentTarget) list.focused(key);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (hasMenu && (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10"))) {
          event.preventDefault();
          list.openMenu(key, null);
          return;
        }
        list.keyDown(event, key);
      }}
      onContextMenu={(event) => {
        onContextMenu?.(event);
        if (event.defaultPrevented || !hasMenu) return;
        event.preventDefault();
        cancelPress();
        list.openMenu(key, { x: event.clientX, y: event.clientY });
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        pressed.current = false;
        if (!hasMenu || event.pointerType !== "touch") return;
        const { clientX: x, clientY: y } = event;
        cancelPress();
        press.current = {
          x,
          y,
          timer: window.setTimeout(() => {
            press.current = null;
            pressed.current = true;
            list.openMenu(key, { x, y });
          }, LONG_PRESS_MS),
        };
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const start = press.current;
        if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > LONG_PRESS_SLOP)
          cancelPress();
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        cancelPress();
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        cancelPress();
      }}
    >
      {avatarProps ? <List.ItemIcon {...avatarProps} /> : null}
      {title}
      {secondLine}
      {meta}
      {badges}
    </List.Item>
  );
}
ChatListItem.displayName = "ChatList.Item";

// ─── Root ─────────────────────────────────────────────────────────────────────

/** From this many dialogs only the rows around the view render. */
const VIRTUAL_FROM = 100;
/** Rows ghosts close up for at most; a larger change glides the rest into place instead. */
const LEAVE_MAX = 20;
/** Placeholder rows while the list loads. */
const SKELETON_ROWS = 6;
/** Rows share one measured height until each is measured itself. */
const ONE_GROUP = () => 0;

export type ChatListRootProps<T = unknown> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "children"
> & {
  /** Dialogs as application data, in the order to show (pinned first, then by the last message). */
  items: readonly T[];
  /** A stable key of a dialog: the `value` of its row. */
  getKey: (item: T) => string;
  /** Renders a dialog: a `ChatList.Item` with its parts. */
  renderItem: (item: T) => React.ReactElement;
  /** The open dialog (controlled); `null` — none. */
  value?: string | null;
  /** The dialog open at first (uncontrolled). Default `null`. */
  defaultValue?: string | null;
  /** The reader opened a dialog: a click, a tap, Enter or Space on its row. */
  onValueChange?: (value: string) => void;
  /** The search query (controlled). Any of the triad shows the search field. */
  search?: string;
  /** The initial query (uncontrolled). */
  defaultSearch?: string;
  /** The query changed: filter `items` by it (the list marks the matches). */
  onSearchChange?: (search: string) => void;
  /** The first load: placeholder rows in the rows' geometry, then a cross-fade into the dialogs. */
  loading?: boolean;
  /** More dialogs exist: a placeholder row ends the list and `onLoadMore` runs near the end. */
  hasMore?: boolean;
  /** The reader scrolled near the end while `hasMore`: load the next dialogs and append them. */
  onLoadMore?: () => void | Promise<void>;
  /** The empty state without a search. Default: «Нет диалогов». */
  empty?: React.ReactNode;
  /** Row tier: height, text, avatar, the search field. Default `m`. */
  size?: ControlSize;
  /** «Now» for the times. Default: the moment of the render. */
  now?: Date;
  /** Display of a `Date` time. Default `formatChatTime`: «14:32», «пн», «12 мар». */
  formatTime?: (date: Date, now: Date) => string;
  labels?: Partial<ChatListLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

type MotionState = {
  order: string;
  keys: readonly string[];
  settle: number;
  entering: Set<string>;
  leaving: Set<string>;
};

/** What changed in the order of the dialogs: new rows rise in, a removal closes up, a move glides. */
function nextMotion(prev: MotionState | null, keys: readonly string[], order: string): MotionState {
  if (prev === null) {
    return { order, keys, settle: 0, entering: new Set(), leaving: new Set() };
  }
  if (prev.order === order) return prev;
  const before = new Set(prev.keys);
  const after = new Set(keys);
  const added = keys.filter((key) => !before.has(key));
  const removed = prev.keys.filter((key) => !after.has(key));
  const keptBefore = prev.keys.filter((key) => after.has(key));
  const keptAfter = keys.filter((key) => before.has(key));
  const moved = keptBefore.some((key, index) => keptAfter[index] !== key);
  // Only removed: the rows close up in place (the ones below follow the closing). Anything else
  // glides every row from where it stood.
  const closing = !moved && added.length === 0 && removed.length <= LEAVE_MAX;
  return {
    order,
    keys,
    settle: closing ? prev.settle : prev.settle + 1,
    entering: prev.keys.length > 0 && added.length <= LEAVE_MAX ? new Set(added) : new Set(),
    leaving: closing ? new Set(removed) : new Set(),
  };
}

/**
 * The conversation list of a messenger: the dialogs as data, each drawn by `renderItem` as a
 * `ChatList.Item`, the open one `value`. An optional search field on top, rows that glide to their
 * new places when the order changes, a long list rendered only around the view, placeholder rows
 * while loading and more dialogs loaded near the end. Draws no surface: put it in a pane.
 */
function ChatListRoot<T>({
  items,
  getKey,
  renderItem,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  search: searchProp,
  defaultSearch,
  onSearchChange,
  loading = false,
  hasMore = false,
  onLoadMore,
  empty,
  size = "m",
  now: nowProp,
  formatTime = formatChatTime,
  labels: labelsProp,
  className,
  ref,
  ...rest
}: ChatListRootProps<T>) {
  const labels = useLabels(CHAT_LIST_LABELS, labelsProp);
  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange: (next) => {
      if (next !== null) onValueChange?.(next);
    },
  });
  const searchable =
    searchProp !== undefined || defaultSearch !== undefined || onSearchChange !== undefined;
  const [query, setQuery] = useControllableState<string>({
    value: searchProp,
    defaultValue: defaultSearch ?? "",
    onChange: onSearchChange,
  });
  const now = nowProp ?? new Date();

  const keys = items.map(getKey);
  const order = keys.join("\u0000");
  const keyIndex = new Map(keys.map((key, index) => [key, index] as const));

  // ── motion of the order ──
  const motionRef = React.useRef<MotionState | null>(null);
  const motion = nextMotion(motionRef.current, keys, order);
  motionRef.current = motion;
  const [listEl, setListEl] = React.useState<HTMLUListElement | null>(null);
  useFlipList({
    container: listEl,
    nodes: flipRows,
    keyOf: flipRowKey,
    layoutKey: order,
    settle: motion.settle,
  });

  // ── focus ──
  const rowsRef = React.useRef(new Map<string, HTMLElement>());
  const register = React.useCallback((key: string, node: HTMLElement | null) => {
    if (node) rowsRef.current.set(key, node);
    else rowsRef.current.delete(key);
  }, []);
  const [focusKey, setFocusKey] = React.useState<string | null>(null);
  const tabKey =
    focusKey !== null && keyIndex.has(focusKey)
      ? focusKey
      : value !== null && keyIndex.has(value)
        ? value
        : (keys[0] ?? null);
  const pendingFocus = React.useRef<string | null>(null);
  const scrollRef = React.useRef<HTMLElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const mergedRootRef = useMergedRefs(rootRef, ref);

  /** Brings a row into view in the list's own scroller. */
  const reveal = React.useCallback((node: HTMLElement) => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const box = scroller.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    if (rect.top < box.top) scroller.scrollTop -= box.top - rect.top;
    else if (rect.bottom > box.bottom) scroller.scrollTop += rect.bottom - box.bottom;
  }, []);

  const focusRow = React.useCallback((key: string) => {
    setFocusKey(key);
    pendingFocus.current = key;
    const node = rowsRef.current.get(key);
    if (node) {
      pendingFocus.current = null;
      node.focus({ preventScroll: true });
    }
  }, []);

  // A row moved to by the keyboard that was not rendered yet takes the focus once it is.
  React.useLayoutEffect(() => {
    const key = pendingFocus.current;
    if (key === null) return;
    const node = rowsRef.current.get(key);
    if (!node) return;
    pendingFocus.current = null;
    node.focus({ preventScroll: true });
    reveal(node);
  });

  const latest = React.useRef({ keys, focusRow, reveal });
  latest.current = { keys, focusRow, reveal };
  const keyDown = React.useCallback((event: React.KeyboardEvent<HTMLElement>, key: string) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const { keys, focusRow, reveal } = latest.current;
    const index = keys.indexOf(key);
    const last = keys.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown") next = Math.min(index + 1, last);
    else if (event.key === "ArrowUp") {
      if (index === 0 && searchRef.current) {
        event.preventDefault();
        searchRef.current.focus();
        return;
      }
      next = Math.max(index - 1, 0);
    } else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null || index < 0) return;
    event.preventDefault();
    const target = keys[next];
    if (target === undefined) return;
    focusRow(target);
    const node = rowsRef.current.get(target);
    if (node) reveal(node);
  }, []);

  const select = React.useCallback(
    (key: string) => {
      setFocusKey(key);
      setValue(key);
    },
    [setValue],
  );

  // ── row menu ──
  const [menu, setMenu] = React.useState<({ key: string } & Point) | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const openMenu = React.useCallback((key: string, point: Point | null) => {
    const root = rootRef.current?.getBoundingClientRect();
    const node = rowsRef.current.get(key);
    if (!root) return;
    let at = point;
    if (!at) {
      // From the keyboard: under the row, at its start.
      const rect = node?.getBoundingClientRect();
      if (!rect) return;
      at = { x: rect.left, y: rect.bottom };
    }
    setFocusKey(key);
    setMenu({ key, x: at.x - root.left, y: at.y - root.top });
    setMenuOpen(true);
  }, []);
  const menuItem = menu ? items[keyIndex.get(menu.key) ?? -1] : undefined;
  const lastMenu = React.useRef<React.ReactElement | null>(null);
  if (menuItem !== undefined) {
    const element = renderItem(menuItem) as React.ReactElement<{ children?: React.ReactNode }>;
    lastMenu.current = partsOf(element.props.children).menu ?? lastMenu.current;
  }

  // ── virtual window ──
  const virtualized = !loading && items.length > VIRTUAL_FROM;
  const pinned = [tabKey, menu?.key]
    .map((key) => (key == null ? -1 : (keyIndex.get(key) ?? -1)))
    .filter((index) => index >= 0);
  // A new order is a new accessor: the window re-reads every row's measured height by its key.
  const getVirtualKey = React.useMemo(() => {
    const ordered = order.split("\u0000");
    return (index: number) => ordered[index] ?? index;
  }, [order]);
  const estimate = React.useMemo(() => {
    const line = size === "xs" || size === "s" ? "caption" : "body-s";
    return (
      readCssLengthPx(`--prime-control-${size}-height`, 36) +
      readCssLengthPx(`--prime-text-${line}-line-height`, 18) +
      readCssLengthPx("--prime-space-1", 4)
    );
  }, [size]);
  const estimateSize = React.useCallback(() => estimate, [estimate]);
  // Where the list starts in the scroller's content (its padding, a row above): layout offsets,
  // which scrolling leaves alone.
  const offset = React.useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller || !listEl) return 0;
    let top = 0;
    let node: HTMLElement | null = listEl;
    while (node && node !== scroller && scroller.contains(node)) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    // The chain stepped past the scroller (it is not positioned): both are measured from there.
    return node === scroller ? top : top - scroller.offsetTop;
  }, [listEl]);
  const virtual = useVirtualRows({
    count: virtualized ? items.length : 0,
    scrollRef,
    getKey: getVirtualKey,
    estimateSize,
    getGroup: ONE_GROUP,
    offset,
    pinned,
  });

  const context: ChatListContextValue = {
    labels,
    size,
    query,
    now,
    formatTime,
    value,
    tabKey,
    select,
    keyDown,
    focused: setFocusKey,
    openMenu,
    register,
    entering: motion.entering,
    leaving: motion.leaving,
  };

  const row = (index: number, measure?: (node: HTMLElement | null) => void) => {
    const item = items[index] as T;
    const key = keys[index] as string;
    return (
      <RowContext key={key} value={{ key, measure }}>
        {renderItem(item)}
      </RowContext>
    );
  };

  let rows: React.ReactNode;
  if (virtualized) {
    const laid = rowGaps(virtual);
    const spacer = (height: number) =>
      height > 0 ? <li className={styles.spacer} style={{ height }} aria-hidden="true" /> : null;
    rows = (
      <>
        {laid.rows.map(({ index, gap }) => (
          <React.Fragment key={keys[index]}>
            {spacer(gap)}
            {row(index, virtual.measure(index))}
          </React.Fragment>
        ))}
        {spacer(laid.end)}
      </>
    );
  } else {
    rows = items.map((_, index) => row(index));
  }

  const searching = query.trim() !== "";
  const state = loading ? "loading" : items.length === 0 ? "empty" : "ready";
  const placeholders = (count: number) => (
    <List.Root size={size} className={styles.list} inert aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder rows
        <List.Item key={index} tabIndex={-1} className={cx(styles.item, styles.placeholder)}>
          <List.ItemIcon>
            <Skeleton shape="circle" />
          </List.ItemIcon>
          <List.ItemText>
            <Skeleton className={styles.placeholderName} />
          </List.ItemText>
          <List.ItemDescription>
            <Skeleton size={stepDown(size)} className={styles.placeholderPreview} />
          </List.ItemDescription>
          <List.ItemMeta>
            <Skeleton size={stepDown(size)} className={styles.placeholderTime} />
          </List.ItemMeta>
        </List.Item>
      ))}
    </List.Root>
  );

  let body: React.ReactNode;
  if (state === "loading") body = placeholders(SKELETON_ROWS);
  else if (state === "empty") {
    body = searching ? (
      <EmptyPage.Root layout="compact" size={size}>
        <EmptyPage.Icon>
          <Icon name="action.search" />
        </EmptyPage.Icon>
        <EmptyPage.Title>{labels.noResults}</EmptyPage.Title>
      </EmptyPage.Root>
    ) : (
      (empty ?? (
        <EmptyPage.Root layout="compact" size={size}>
          <EmptyPage.Icon>
            <Icon name="object.message" />
          </EmptyPage.Icon>
          <EmptyPage.Title>{labels.empty}</EmptyPage.Title>
        </EmptyPage.Root>
      ))
    );
  } else {
    body = (
      <>
        <List.Root ref={setListEl} size={size} aria-label={labels.list} className={styles.list}>
          {rows}
        </List.Root>
        {hasMore ? placeholders(1) : null}
      </>
    );
  }

  const announcement = loading
    ? labels.loading
    : searching
      ? items.length > 0
        ? formatLabel(labels.results, { count: items.length })
        : labels.noResults
      : "";

  return (
    <ControlSizeProvider value={size}>
      <ChatListContext value={context}>
        <div
          {...rest}
          ref={mergedRootRef}
          className={cx(styles.root, className)}
          {...toDataAttributes({ size })}
        >
          {searchable ? (
            <div className={styles.search}>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Icon side="start">
                    <Icon name="action.search" tone="secondary" />
                  </Input.Icon>
                  <Input.Field
                    ref={searchRef}
                    type="search"
                    aria-label={labels.search}
                    placeholder={labels.searchPlaceholder}
                    value={query}
                    onValueChange={setQuery}
                    onKeyDown={(event) => {
                      if (event.key === "Escape" && query !== "") {
                        event.preventDefault();
                        setQuery("");
                      }
                      if (event.key === "ArrowDown" && tabKey !== null && state === "ready") {
                        event.preventDefault();
                        focusRow(tabKey);
                      }
                    }}
                  />
                  {query !== "" ? <Input.ClearButton onClick={() => setQuery("")} /> : null}
                </Input.Wrapper>
              </Input.Root>
            </div>
          ) : null}
          <ScrollContainer
            ref={scrollRef}
            className={styles.scroller}
            aria-busy={loading || undefined}
            onReachEnd={hasMore && onLoadMore && !loading ? onLoadMore : undefined}
          >
            <Crossfade state={state}>{body}</Crossfade>
          </ScrollContainer>
          <VisuallyHidden live="polite">{announcement}</VisuallyHidden>
          {menu ? (
            <Dropdown.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Dropdown.Trigger>
                {/* The menu opens where the pointer is: a point inside the list anchors it, out of
                  the tab order. Focus that returns here after Escape goes on to the row. */}
                <button
                  type="button"
                  className={styles.anchor}
                  style={
                    {
                      "--anchor-x": `${menu.x}px`,
                      "--anchor-y": `${menu.y}px`,
                    } as React.CSSProperties
                  }
                  tabIndex={-1}
                  aria-label={labels.menu}
                  onFocus={() => rowsRef.current.get(menu.key)?.focus({ preventScroll: true })}
                />
              </Dropdown.Trigger>
              {lastMenu.current}
            </Dropdown.Root>
          ) : null}
        </div>
      </ChatListContext>
    </ControlSizeProvider>
  );
}
ChatListRoot.displayName = "ChatList.Root";

// ─── Public API ───────────────────────────────────────────────────────────────

export const ChatList = {
  Root: ChatListRoot,
  Item: ChatListItem,
  ItemIcon: ChatListItemIcon,
  ItemText: ChatListItemText,
  ItemDescription: ChatListItemDescription,
  ItemMenu: ChatListItemMenu,
};

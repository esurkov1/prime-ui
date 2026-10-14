import * as React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { Dropdown, type DropdownContentProps } from "@/components/dropdown/Dropdown";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { Disclosure } from "@/internal/Disclosure";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatLabel } from "@/internal/formatLabel";
import { HighlightMatch } from "@/internal/HighlightMatch";
import { InteractiveElement } from "@/internal/interactiveElement";
import { useLabels } from "@/internal/labels";
import { useMessageList } from "@/internal/messageList";
import { defineMessagePart, useMessageHighlight, useMessagePart } from "@/internal/messagePart";
import { exitTimeoutMs } from "@/internal/motionTiming";
import { hueOf } from "@/internal/palette";
import palette from "@/internal/palette.module.css";
import { RollingNumber } from "@/internal/RollingNumber";
import { RichText } from "@/internal/richText";
import type { PaletteColor } from "@/internal/states";

import styles from "./Message.module.css";
import type { MessageUser } from "./types";

export type MessageLabels = {
  /** The name of the message for assistive tech: who and when. */
  message: string;
  /** The author of an outgoing message. */
  you: string;
  /** Marks an edited message in its meta. */
  edited: string;
  /** The name of a `||spoiler||` in the text while it is hidden. */
  spoiler: string;
  sending: string;
  sent: string;
  read: string;
  failed: string;
  /** The retry button beside a failed message. */
  retry: string;
  /** The menu item that starts selection mode with this message. */
  select: string;
  /** Announced when the quick reaction is put: `{emoji}`. */
  reactionAdded: string;
  /** Announced when the quick reaction is taken back: `{emoji}`. */
  reactionRemoved: string;
  /** The name of the reaction bar. */
  reactionBar: string;
  /** The «⌄» of the reaction bar that shows every reaction. */
  moreReactions: string;
};

export const MESSAGE_LABELS: MessageLabels = {
  message: "{author}, {time}",
  you: "Вы",
  edited: "изменено",
  spoiler: "Скрытый текст",
  sending: "Отправляется",
  sent: "Отправлено",
  read: "Прочитано",
  failed: "Не отправлено",
  retry: "Повторить отправку",
  select: "Выбрать",
  reactionAdded: "Реакция {emoji} поставлена",
  reactionRemoved: "Реакция {emoji} снята",
  reactionBar: "Реакции",
  moreReactions: "Все реакции",
};

// ─── Root context ─────────────────────────────────────────────────────────────

export type MessageRootContextValue = {
  /** Puts or takes back a reaction through `onReactionToggle`; `null` — reactions are read-only. */
  toggleReaction: ((emoji: string) => void) | null;
  /** Reactions whose request is running, with the state they are shown in meanwhile. */
  optimistic: ReadonlyMap<string, boolean>;
  /** The menu of this message may start selection with it. */
  startSelection: (() => void) | null;
  labels: MessageLabels;
  /**
   * The meta's room at the end of the reactions row, while the row ends a bubble (the meta then
   * sits on the row's last line); `null` under a picture or a circle.
   */
  rowSpacer: React.ReactNode;
};

const RootContext = React.createContext<MessageRootContextValue>({
  toggleReaction: null,
  optimistic: new Map(),
  startSelection: null,
  labels: MESSAGE_LABELS,
  rowSpacer: null,
});

/** `Message.Root` provides it to its parts. */
export const MessageRootProvider = RootContext.Provider;

// ─── Avatar / Author ──────────────────────────────────────────────────────────

export type MessageAvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The author's picture in the gutter beside an incoming bubble of a group chat (`Chat.Messages
 * type="group"`): put an `Avatar` in it on every message; the message shows it on the last of a
 * run and keeps the gutter empty on the others.
 */
export function MessageAvatar({ className, ...rest }: MessageAvatarProps) {
  return <div className={cx(styles.avatar, className)} aria-hidden="true" {...rest} />;
}
MessageAvatar.displayName = "Message.Avatar";

export type MessageAuthorProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> & {
  /**
   * The author's hue: one per person in a group chat. Default: a hue stable per name
   * (`hueOf(name)`); pass `hueOf(user.id)` to keep it per person.
   */
  color?: PaletteColor;
  /** The member's own title in this chat, muted after the name («Админ», «Бухгалтерия»). */
  tag?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** The name of the author when it is plain text (it names the message and picks the hue). */
export function authorNameOf(children: React.ReactNode): string | undefined {
  const parts = React.Children.toArray(children).filter(
    (child) => !(React.isValidElement(child) && child.type === MessageAuthorIcon),
  );
  return parts.length > 0 && parts.every((part) => typeof part === "string")
    ? (parts as string[]).join("")
    : undefined;
}

/**
 * The author's header at the top of the first bubble of a run in a group chat: the name in the
 * author's hue (it ellipsizes first), an optional `Message.AuthorIcon` after it and the `tag` after
 * them. Over a picture or a circle it stands on a pill at its top-start corner.
 */
export function MessageAuthor({ color, tag, className, children, ...rest }: MessageAuthorProps) {
  const items = React.Children.toArray(children);
  const icons = items.filter(
    (child) => React.isValidElement(child) && child.type === MessageAuthorIcon,
  );
  const name = items.filter((child) => !icons.includes(child));
  const text = authorNameOf(children);
  const hue = color ?? (text ? hueOf(text) : "blue");
  return (
    <div
      data-message-fit="row"
      className={cx(styles.author, palette.hue, className)}
      {...toDataAttributes({ color: hue })}
      {...rest}
    >
      <span className={styles.authorName} data-message-selectable="">
        {name}
      </span>
      {icons}
      {tag ? (
        <span className={styles.authorTag} data-message-selectable="">
          {tag}
        </span>
      ) : null}
    </div>
  );
}
MessageAuthor.displayName = "Message.Author";

export type MessageAuthorIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * A small mark after the author's name (`<Icon name="…" />`: a crown of the chat's owner, a check
 * of a verified member). Decorative: say what it means in the `tag` or the name if it matters.
 */
export function MessageAuthorIcon({ className, ...rest }: MessageAuthorIconProps) {
  return <span className={cx(styles.authorIcon, className)} aria-hidden="true" {...rest} />;
}
MessageAuthorIcon.displayName = "Message.AuthorIcon";

// ─── Text ─────────────────────────────────────────────────────────────────────

export type MessageTextProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /**
   * The text. A string renders its Markdown subset (**bold**, _italic_, ~~strike~~, `code`,
   * ``` blocks, [links](url), bare URLs, `> ` quotes) as elements, never as HTML.
   */
  children: React.ReactNode;
  /** Render a string as is, without its Markdown. Default `false`. */
  plain?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The text of a message, wrapping anywhere; the meta stands at the end of its last line (its
 * spacer closes the last line). Marks the matches of the chat's search (`Chat.Search`).
 */
export function MessageText({ plain = false, className, children, ...rest }: MessageTextProps) {
  const { spacer } = useMessagePart();
  const { labels } = React.useContext(RootContext);
  const highlight = useMessageHighlight().trim();
  return (
    <div
      data-message-selectable=""
      data-message-fit=""
      className={cx(styles.text, className)}
      {...rest}
    >
      {typeof children === "string" && !plain ? (
        <RichText
          source={children}
          end={spacer}
          highlight={highlight}
          labels={{ spoiler: labels.spoiler }}
        />
      ) : (
        <p className={styles.paragraph}>
          {typeof children === "string" && highlight ? (
            <HighlightMatch text={children} query={highlight} all />
          ) : (
            children
          )}
          {spacer}
        </p>
      )}
    </div>
  );
}
MessageText.displayName = "Message.Text";

/** Lines of about this many characters at the bubble's width cap (an estimate, never measured). */
const CHARS_PER_LINE = 38;
const LINE_PX = 20;

defineMessagePart(MessageText, {
  shell: "fill",
  meta: "inline",
  text: ({ children }: MessageTextProps) => (typeof children === "string" ? children : ""),
  estimate: ({ children }: MessageTextProps) => {
    const text = typeof children === "string" ? children : "";
    const lines = text
      .split("\n")
      .reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / CHARS_PER_LINE)), 0);
    return Math.max(1, lines) * LINE_PX;
  },
});

// ─── Reply / Forwarded ────────────────────────────────────────────────────────

export type MessageReplyLabels = {
  /** Read before the quote: what it is. */
  reply: string;
};

export const MESSAGE_REPLY_LABELS: MessageReplyLabels = { reply: "Ответ на сообщение" };

export type MessageReplyProps = Omit<React.HTMLAttributes<HTMLElement>, "color" | "onClick"> & {
  /** Who wrote the quoted message. */
  author: React.ReactNode;
  /** The author's hue (the same as their `Message.Author`). Default `blue`. */
  color?: PaletteColor;
  /**
   * The `value` of the quoted message: a press brings it into view in the group and flashes it,
   * moving the focus to it. Makes the quote a button.
   */
  target?: string;
  /**
   * A press on the quote (after `target` is shown): load the original when it is not in the list
   * yet. Makes the quote a button.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  labels?: Partial<MessageReplyLabels>;
  ref?: React.Ref<HTMLElement>;
};

/** The quoted message this one answers: the author's name over one line of its text. */
export function MessageReply({
  author,
  color = "blue",
  target,
  onClick,
  labels,
  className,
  children,
  ref,
  ...rest
}: MessageReplyProps) {
  const { reply } = useLabels(MESSAGE_REPLY_LABELS, labels);
  const { reveal } = useMessageList();
  const body = (
    <>
      <VisuallyHidden>{`${reply}: `}</VisuallyHidden>
      <span className={styles.replyAuthor}>{author}</span>
      <span className={styles.replyText} data-message-selectable="">
        {children}
      </span>
    </>
  );
  const props = {
    ...rest,
    ref: ref as React.Ref<HTMLElement>,
    "data-message-fit": "",
    className: cx(styles.reply, palette.hue, className),
    ...toDataAttributes({ color }),
  };
  // A quote that jumps to its original is a button; one that only shows the quote is static.
  return onClick || target !== undefined ? (
    <InteractiveElement
      {...props}
      element="button"
      onClick={(event) => {
        if (target !== undefined) reveal(target, true);
        onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      }}
    >
      {body}
    </InteractiveElement>
  ) : (
    <InteractiveElement {...props} element="static">
      {body}
    </InteractiveElement>
  );
}
MessageReply.displayName = "Message.Reply";

export type MessageForwardedLabels = {
  /** The header of a forwarded message; `{author}` is the original author. */
  forwarded: string;
};

export const MESSAGE_FORWARDED_LABELS: MessageForwardedLabels = {
  forwarded: "Переслано от {author}",
};

export type MessageForwardedProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Who wrote the original message. */
  from: string;
  labels?: Partial<MessageForwardedLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/** «Переслано от Анны»: the header of a forwarded message, the original author in bold. */
export function MessageForwarded({ from, labels, className, ...rest }: MessageForwardedProps) {
  const { forwarded } = useLabels(MESSAGE_FORWARDED_LABELS, labels);
  const [before, after = ""] = forwarded.split("{author}");
  return (
    <div className={cx(styles.forwarded, className)} data-message-fit="" {...rest}>
      <Icon name="action.forward" animated={false} />
      <span data-message-selectable="">
        {before}
        <strong>{from}</strong>
        {after}
      </span>
    </div>
  );
}
MessageForwarded.displayName = "Message.Forwarded";

// ─── Reactions ────────────────────────────────────────────────────────────────

export type MessageReaction = {
  emoji: string;
  /** Everyone who put it, the reader included. */
  count: number;
  /** The reader's own reaction: filled with the accent, a press takes it back. */
  selected?: boolean;
  /**
   * Who put it, in the order they put it (the reader joins at the end). While they fit (up to 3)
   * the chip shows their avatars instead of the count; with 4 or more, the first two and a «+N»
   * circle. Without it the chip shows the count.
   */
  users?: readonly MessageUser[];
};

/**
 * The reactions as shown while toggles are pending: each pending emoji in its new state; the
 * reader (`Chat.Messages reader`) joins or leaves its `users` with it.
 */
export function applyOptimistic(
  reactions: readonly MessageReaction[],
  optimistic: ReadonlyMap<string, boolean>,
  reader?: MessageUser,
): readonly MessageReaction[] {
  if (optimistic.size === 0) return reactions;
  const withReader = (users: readonly MessageUser[] | undefined, selected: boolean) => {
    if (!reader || !users) return users;
    const others = users.filter((user) => user.id !== reader.id);
    return selected ? [...others, reader] : others;
  };
  const shown = reactions.map((reaction) => {
    const selected = optimistic.get(reaction.emoji);
    if (selected === undefined || selected === Boolean(reaction.selected)) return reaction;
    return {
      ...reaction,
      selected,
      count: reaction.count + (selected ? 1 : -1),
      users: withReader(reaction.users, selected),
    };
  });
  for (const [emoji, selected] of optimistic) {
    if (selected && !reactions.some((reaction) => reaction.emoji === emoji)) {
      shown.push({ emoji, count: 1, selected: true, users: withReader([], true) });
    }
  }
  return shown.filter((reaction) => reaction.count > 0);
}

/** Circles a chip holds at most: up to 3 avatars, or 2 and a «+N». */
const STACK = 3;

/** The avatars a chip shows, or `null` when it shows the count. */
function stackOf(reaction: MessageReaction): readonly MessageUser[] | null {
  const users = reaction.users;
  if (!users) return null;
  const shown = reaction.count <= STACK ? reaction.count : STACK - 1;
  return users.length >= shown ? users.slice(0, shown) : null;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export type MessageReactionsLabels = {
  /** The name of a reaction chip without `users`: `{emoji}`, `{count}`. */
  reaction: string;
  /** The name of a chip with `users`: `{emoji}`, `{count}`, `{users}` — their names. */
  reactionUsers: string;
  /** The last name in `{users}` when not everyone is listed: `{count}` — how many more. */
  moreUsers: string;
  /** The name of the row. */
  reactions: string;
};

export const MESSAGE_REACTIONS_LABELS: MessageReactionsLabels = {
  reaction: "{emoji}: {count}",
  reactionUsers: "{emoji} {count}: {users}",
  moreUsers: "ещё {count}",
  reactions: "Реакции",
};

function reactionName(reaction: MessageReaction, labels: MessageReactionsLabels): string {
  const users = reaction.users;
  if (!users || users.length === 0) {
    return formatLabel(labels.reaction, { emoji: reaction.emoji, count: reaction.count });
  }
  const names = users.slice(0, reaction.count).map((user) => user.name);
  const rest = reaction.count - names.length;
  if (rest > 0) names.push(formatLabel(labels.moreUsers, { count: rest }));
  return formatLabel(labels.reactionUsers, {
    emoji: reaction.emoji,
    count: reaction.count,
    users: names.join(", "),
  });
}

type Shown<T> = { item: T; leaving: boolean };

/**
 * Items that leave stay drawn, at their place, until `done(key)`: their exit is a transition on
 * `data-leaving`. An item that comes back while it leaves simply stops leaving (the transition
 * runs back). State changes only when the set of keys changes — never per frame. Under reduced
 * motion nothing stays.
 */
function useLeaving<T>(items: readonly T[], keyOf: (item: T) => string, animate = true) {
  const signature = items.map(keyOf).join("\u0000");
  const committed = React.useRef(items);
  const [state, setState] = React.useState<{
    signature: string;
    leaving: { item: T; index: number }[];
  }>({ signature, leaving: [] });
  let { leaving } = state;
  if (state.signature !== signature) {
    const keys = new Set(items.map(keyOf));
    const removed =
      !animate || prefersReducedMotion()
        ? []
        : committed.current
            .map((item, index) => ({ item, index }))
            .filter((entry) => !keys.has(keyOf(entry.item)));
    const removedKeys = new Set(removed.map((entry) => keyOf(entry.item)));
    leaving = [
      ...state.leaving.filter(
        (entry) => !keys.has(keyOf(entry.item)) && !removedKeys.has(keyOf(entry.item)),
      ),
      ...removed,
    ];
    setState({ signature, leaving });
  }
  React.useLayoutEffect(() => {
    committed.current = items;
  });
  const keyRef = React.useRef(keyOf);
  keyRef.current = keyOf;
  const done = React.useCallback(
    (key: string) =>
      setState((current) => ({
        ...current,
        leaving: current.leaving.filter((entry) => keyRef.current(entry.item) !== key),
      })),
    [],
  );
  const list: Shown<T>[] = items.map((item) => ({ item, leaving: false }));
  for (const entry of [...leaving].sort((a, b) => a.index - b.index)) {
    list.splice(Math.min(entry.index, list.length), 0, { item: entry.item, leaving: true });
  }
  return { list, done };
}

/** Calls `done` once the leaving part's exit transition ends (or its timeout passes). */
function useExit(leaving: boolean, done: () => void, timeout: number) {
  const doneRef = React.useRef(done);
  doneRef.current = done;
  React.useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => doneRef.current(), timeout);
    return () => window.clearTimeout(id);
  }, [leaving, timeout]);
  return (event: React.TransitionEvent) => {
    if (leaving && event.target === event.currentTarget) doneRef.current();
  };
}

/**
 * One reactor in a chip's stack. One who joins after the chip mounted fades and scales in from
 * 0.9 while the stack widens; one who leaves fades out while it narrows.
 */
function StackAvatar({
  user,
  ready,
  leaving,
  onLeft,
}: {
  user: MessageUser;
  /** The stack has mounted: an avatar that mounts from now on joins it. */
  ready: React.RefObject<boolean>;
  leaving: boolean;
  onLeft: (id: string) => void;
}) {
  const [fresh] = React.useState(() => ready.current);
  const onTransitionEnd = useExit(leaving, () => onLeft(user.id), exitTimeoutMs("base"));
  return (
    <Avatar.Root
      color={user.color}
      className={styles.stackAvatar}
      onTransitionEnd={onTransitionEnd}
      {...toDataAttributes({ fresh: fresh || undefined, leaving: leaving || undefined })}
    >
      {user.src ? <Avatar.Image src={user.src} /> : null}
      <Avatar.Fallback>{initialsOf(user.name)}</Avatar.Fallback>
    </Avatar.Root>
  );
}

/** «+N» at the end of a stack: fades in like an avatar when it appears after the chip mounted. */
function StackOverflow({ count, ready }: { count: number; ready: React.RefObject<boolean> }) {
  const [fresh] = React.useState(() => ready.current);
  return (
    <Avatar.Overflow
      className={cx(styles.stackAvatar, styles.stackOverflow)}
      data-fresh={fresh || undefined}
    >
      +<RollingNumber>{count}</RollingNumber>
    </Avatar.Overflow>
  );
}

/**
 * The end of a chip: the avatars of who reacted or the count, side by side in two grid columns —
 * the shown one `1fr`, the other `0fr` and faded, so a switch cross-fades and glides the width.
 * The stack's width follows its number of circles (`--circles`) and the count's its number of
 * digits (`--digits`), both as transitions: a reactor joining widens the chip smoothly, a count
 * that only changes value rolls its digits and never moves the chip.
 */
function ReactionTail({ reaction }: { reaction: MessageReaction }) {
  const stack = stackOf(reaction);
  // The avatars keep their last faces while they fade out.
  const lastStack = React.useRef(stack);
  if (stack) lastStack.current = stack;
  const faces = stack ?? lastStack.current ?? [];
  const overflow = stack ? reaction.count - stack.length : 0;
  const circles = faces.length + (overflow > 0 ? 1 : 0);
  // A face leaves with its exit only when the stack narrows; when «+N» takes its circle (3 → 2 + N)
  // it goes at once and the «+N» fades in at its place.
  const lastCircles = React.useRef(circles);
  const { list, done } = useLeaving(faces, (user) => user.id, circles < lastCircles.current);
  React.useLayoutEffect(() => {
    lastCircles.current = circles;
  });
  // Faces of the chip's first render stand still; later arrivals enter.
  const ready = React.useRef(false);
  React.useEffect(() => {
    ready.current = true;
  }, []);
  return (
    <span className={styles.tail} data-show={stack ? "avatars" : "count"} aria-hidden="true">
      <span
        className={styles.tailPart}
        data-part="avatars"
        style={{ "--circles": circles } as React.CSSProperties}
      >
        {list.length > 0 ? (
          <Avatar.Group size="xs" role="presentation" className={styles.stack}>
            {list.map(({ item: user, leaving }) => (
              <StackAvatar
                key={user.id}
                user={user}
                ready={ready}
                leaving={leaving}
                onLeft={done}
              />
            ))}
            {overflow > 0 ? <StackOverflow count={overflow} ready={ready} /> : null}
          </Avatar.Group>
        ) : null}
      </span>
      <span
        className={styles.tailPart}
        data-part="count"
        style={{ "--digits": String(reaction.count).length } as React.CSSProperties}
      >
        <RollingNumber>{reaction.count}</RollingNumber>
      </span>
    </span>
  );
}

type ReactionChipProps = {
  reaction: MessageReaction;
  labels: MessageReactionsLabels;
  pending: boolean;
  toggle: ((emoji: string) => void) | null;
};

/**
 * A chip in its slot: a part of the message's morph (`bubbleMorph`). New on the message, it fades
 * and scales in from 0.9 where it stands while the bubble takes its room; taken away, it fades out
 * where it stood while the chips after it glide into its place — one stroke.
 */
function ReactionChip({ reaction, labels, pending, toggle }: ReactionChipProps) {
  const { emoji } = reaction;
  return (
    <span className={styles.chipSlot} data-morph-item="">
      <button
        type="button"
        data-message-chip=""
        data-morph-pop=""
        data-reaction={emoji}
        className={styles.reaction}
        aria-label={reactionName(reaction, labels)}
        aria-pressed={reaction.selected ?? false}
        aria-busy={pending || undefined}
        disabled={!toggle}
        {...toDataAttributes({
          selected: reaction.selected || undefined,
          pending: pending || undefined,
          stack: stackOf(reaction) ? true : undefined,
        })}
        onClick={() => toggle?.(emoji)}
      >
        <span className={styles.emoji} aria-hidden="true">
          {emoji}
        </span>
        <ReactionTail reaction={reaction} />
      </button>
    </span>
  );
}

export type MessageReactionsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The reactions to the message; a press on a chip calls `Message.Root onReactionToggle`. */
  items: readonly MessageReaction[];
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  labels?: Partial<MessageReactionsLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Reactions at the bottom of the bubble (under a picture or a circle): an emoji with the avatars
 * of who reacted (`users`) or its count; the reader's own one is filled with the accent. A press
 * goes to `Message.Root onReactionToggle`. Every message holds the row's place, closed: the first
 * reaction opens it and the last one taken back closes it, each in one layout.
 */
export function MessageReactions({
  items,
  // Read by `Message.Root` for the reaction bar it opens.
  closeOnOutsideClick: _closeOnOutsideClick,
  closeOnEscape: _closeOnEscape,
  labels: labelsProp,
  className,
  ...rest
}: MessageReactionsProps) {
  const labels = useLabels(MESSAGE_REACTIONS_LABELS, labelsProp);
  const { toggleReaction, optimistic, rowSpacer } = React.useContext(RootContext);
  const { reader } = useMessageList();
  const shown = applyOptimistic(items, optimistic, reader);
  return (
    <Disclosure
      open={shown.length > 0}
      className={styles.reactionsSlot}
      data-message-reactions=""
      data-morph-skip=""
    >
      {/* biome-ignore lint/a11y/useSemanticElements: a row of chips under a message, not a form fieldset */}
      <div
        role="group"
        aria-label={labels.reactions}
        className={cx(styles.reactions, className)}
        {...rest}
      >
        {shown.map((reaction) => (
          <ReactionChip
            key={reaction.emoji}
            reaction={reaction}
            labels={labels}
            pending={optimistic.has(reaction.emoji)}
            toggle={toggleReaction}
          />
        ))}
        {rowSpacer}
      </div>
    </Disclosure>
  );
}
MessageReactions.displayName = "Message.Reactions";

// ─── Menu ─────────────────────────────────────────────────────────────────────

export type MessageMenuProps = Omit<DropdownContentProps, "side" | "align" | "matchTriggerWidth">;

/**
 * The context menu of the message: your `Dropdown.Item`s (Ответить, Копировать, Переслать,
 * Изменить, Удалить — the last one `tone="danger"`). The kit adds «Выбрать» (when the group has
 * a selection); reactions live on the reaction bar, not in the menu. Opens at the pointer
 * on right click, on a long press, and from the keyboard (Enter, Shift+F10, the menu key).
 */
export function MessageMenu({ children, ...rest }: MessageMenuProps) {
  const { startSelection, labels } = React.useContext(RootContext);
  return (
    <Dropdown.Content {...rest}>
      {children}
      {startSelection ? (
        <>
          <Dropdown.Separator />
          <Dropdown.Item onSelect={startSelection}>
            <Dropdown.ItemIcon>
              <Icon name="status.success" />
            </Dropdown.ItemIcon>
            {labels.select}
          </Dropdown.Item>
        </>
      ) : null}
    </Dropdown.Content>
  );
}
MessageMenu.displayName = "Message.Menu";

import * as React from "react";

import { Spinner } from "@/components/spinner/Spinner";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useResizeEffect } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { ControlSizeProvider, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { useChipTier } from "@/internal/chipTier";
import chipTier from "@/internal/chipTier.module.css";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { formatLabel } from "@/internal/formatLabel";
import { GlyphSwap } from "@/internal/glyphSwap";
import { iconSlotClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { useMediaSlotHost } from "@/internal/mediaSlot";
import { namedRole } from "@/internal/namedRole";
import palette from "@/internal/palette.module.css";
import { usePartPresence } from "@/internal/partPresence";
import { splitParts } from "@/internal/parts";
import { RollingNumber } from "@/internal/RollingNumber";
import {
  type ControlSize,
  chipAvatarSize,
  type PaletteColor,
  type Tone,
  type Variant,
} from "@/internal/states";
import { touchTargetBlockClass } from "@/internal/touchTarget";
import { isPromiseLike } from "@/internal/usePendingChanges";

import styles from "./Badge.module.css";
import { markEdgeIcons } from "./edgeIcons";

export type BadgeLabels = {
  /** Accessible name of the remove button; include the badge text, e.g. «Убрать фильтр «Москва»». */
  remove: string;
  /** Spoken when the `onRemove` promise rejects and the badge stays. */
  removeFailed: string;
};

export const BADGE_LABELS: BadgeLabels = { remove: "Удалить", removeFailed: "Не удалось удалить" };

/** A status the badge states (`tone`) or a category hue it carries (`color`), never both. */
type BadgeHueProps =
  | { color?: PaletteColor; tone?: never }
  | { tone: Extract<Tone, "neutral" | "success" | "warning" | "danger" | "info">; color?: never };

export type BadgeRootProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "onClick" | "color"> &
  BadgeHueProps & {
    variant?: Exclude<Variant, "ghost">;
    size?: ControlSize;
    shape?: "chip" | "square";
    fullWidth?: boolean;
    onRemove?: () => void | Promise<void>;
    loading?: boolean;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    labels?: Partial<BadgeLabels>;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLSpanElement>;
  };

export type BadgeIconProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

export type BadgeAvatarProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

export type BadgeDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

export type BadgeDotProps = {
  color?: PaletteColor;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "color">;

export type BadgeActionProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick" | "children"
> & {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  persistent?: boolean;
  disabled?: boolean;
  pressed?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

export type BadgeGroupLabels = {
  /** The visible text of the badge that stands for the badges that did not fit. */
  more: string;
  /** What assistive tech reads for that badge: how many values are not shown (its tooltip lists them). */
  moreCount: string;
};

export const BADGE_GROUP_LABELS: BadgeGroupLabels = {
  more: "+{count}",
  moreCount: "Ещё {count}",
};

export type BadgeGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: ControlSize;
  overflow?: "wrap" | "count";
  labels?: Partial<BadgeGroupLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/** The `size` of the `Badge.Group` around a badge: the tier of every badge in it. */
const GroupSizeContext = React.createContext<ControlSize | undefined>(undefined);

/** A chip with `Badge.Description` stands on two lines: its avatar spans both. */
const StackedContext = React.createContext(false);

const isText = (item: React.ReactNode): item is string | number =>
  typeof item === "string" || typeof item === "number";

/**
 * Next to icons, dots or inside a body (a flex row), each run of text goes into one block `.text`
 * span so a long label ellipsizes; the run's outer spaces stay outside it, so the accessible name
 * keeps them («НЕ billing», not «НЕbilling»).
 */
function wrapText(items: React.ReactNode[]): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let run = "";
  const flush = () => {
    if (run === "") return;
    const [, lead, core, trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(run) ?? ["", "", run, ""];
    if (lead) out.push(lead);
    if (core) {
      out.push(
        <span key={`text-${out.length}`} className={styles.text}>
          {core}
        </span>,
      );
    }
    if (trail) out.push(trail);
    run = "";
  };
  for (const item of items) {
    if (isText(item)) run += String(item);
    else {
      flush();
      out.push(item);
    }
  }
  flush();
  return out;
}

function BadgeRoot({
  color,
  tone,
  variant = "soft",
  size: sizeProp,
  shape = "chip",
  fullWidth = false,
  onRemove,
  pressed: pressedProp,
  defaultPressed,
  onPressedChange,
  loading = false,
  labels,
  disabled: disabledProp,
  children,
  className,
  ref,
  ...rest
}: BadgeRootProps) {
  const groupSize = React.useContext(GroupSizeContext);
  const { size, tier } = useChipTier(sizeProp ?? groupSize);
  const disabled = useInheritedDisabled(disabledProp);
  // A status tone takes its own role colors; `neutral` is the gray hue, as is no hue at all.
  const hue: PaletteColor | undefined =
    tone === undefined ? (color ?? "gray") : tone === "neutral" ? "gray" : undefined;
  // Whatever unmounts the badge (its owner took it out after the remove segment, a list changed),
  // it closes up in place and the badges after it glide.
  const presence = usePartPresence<HTMLSpanElement>({ axis: "inline" });
  // A badge inside a layer's trigger (`Dropdown.Trigger`, `Popover.Trigger`) is handed the trigger's
  // props: they belong to the body button, which then is the opener and the layer's anchor.
  const trigger = rest["aria-expanded"] !== undefined;
  const rootRef = useMergedRefs(presence.ref, trigger ? undefined : ref);
  const triggerRef = useMergedRefs(trigger ? ref : undefined);
  const triggerProps: Record<string, unknown> = {};
  if (trigger) {
    for (const key of Object.keys(rest)) {
      if (/^(on[A-Z]|aria-)/.test(key) || key === "data-state" || key === "id") {
        triggerProps[key] = (rest as Record<string, unknown>)[key];
        delete (rest as Record<string, unknown>)[key];
      }
    }
  }
  // A toggle when any part of the pressed triad is given: the body is a button over the badge.
  const toggle =
    pressedProp !== undefined || defaultPressed !== undefined || onPressedChange !== undefined;
  const [pressed, setPressed] = useControllableState({
    value: pressedProp,
    defaultValue: defaultPressed ?? false,
    onChange: onPressedChange,
  });
  /** A promise from `onRemove` is pending: the badge waits, the segment spins. */
  const [removing, setRemoving] = React.useState(false);
  const [failure, setFailure] = React.useState("");

  const busy = removing || loading;

  const remove = () => {
    if (busy || !onRemove) return;
    setFailure("");
    const outcome = onRemove();
    if (!isPromiseLike(outcome)) return;
    setRemoving(true);
    outcome.then(
      () => setRemoving(false),
      () => {
        setRemoving(false);
        setFailure(labels?.removeFailed ?? BADGE_LABELS.removeFailed);
      },
    );
  };

  // Badge.Action lives at the end of the badge, outside the text body; one per badge.
  const { parts: actions, rest: other } = splitParts<BadgeActionProps>(children, BadgeAction);
  // A person's avatar leads the chip, whatever order it is written in.
  const { parts: avatars, rest: named } = splitParts<BadgeAvatarProps>(other, BadgeAvatar);
  const avatar = avatars[0] ?? null;
  // A detail line under the name (a role, an e-mail) makes the chip two lines high.
  const { parts: descriptions, rest: parts } = splitParts<BadgeDescriptionProps>(
    named,
    BadgeDescription,
  );
  const description = descriptions[0] ?? null;
  const stacked = description !== null;
  // Two lines: the name and the description, one block between the avatar and the chevron. The
  // hidden comma keeps the two apart in the accessible name («Анна Котова, Юрист»).
  const lines = stacked ? (
    <span key="lines" className={styles.lines}>
      <span className={styles.name}>{wrapText(parts)}</span>
      <VisuallyHidden>,</VisuallyHidden> {description}
    </span>
  ) : null;
  // A trigger badge shows the chevron of an opener at its end, turned by the layer's open state.
  const content = [
    ...(lines ? [lines] : parts),
    ...(trigger
      ? [
          <BadgeIcon key="trigger-chevron" className={styles.chevron}>
            <Icon name="nav.chevronDown" />
          </BadgeIcon>,
        ]
      : []),
  ];
  const actionElement = actions[0] ?? null;
  const trailing = Boolean(onRemove || actionElement);
  const iconOnly =
    !trailing &&
    !trigger &&
    !avatar &&
    content.length > 0 &&
    content.every((child) => React.isValidElement(child) && child.type === BadgeIcon);
  // The end edge belongs to the remove segment or Badge.Action when there is one.
  const edges = markEdgeIcons(content, (type) => type === BadgeIcon || type === BadgeDot, {
    endTaken: trailing,
  });
  // A read-only badge of plain text is one element: the root itself lays the text out as a block
  // and ellipsizes it. Anything richer is a flex row, so its text runs are wrapped.
  const textOnly = !trailing && !toggle && !trigger && !avatar && edges.children.every(isText);
  const body = (
    <ControlSizeProvider value={tier}>
      <StackedContext value={stacked}>
        {typeof children === "number" ? (
          // A count rolls its digits to the new value (foundation §7 rule 8).
          <RollingNumber>{children}</RollingNumber>
        ) : textOnly ? (
          edges.children
        ) : (
          <>
            {avatar}
            {wrapText(edges.children)}
          </>
        )}
      </StackedContext>
    </ControlSizeProvider>
  );

  return (
    <span
      {...rest}
      ref={rootRef}
      // An icon-only badge named by `aria-label` is an image of that name.
      role={iconOnly ? namedRole(rest, "img") : rest.role}
      className={cx(
        styles.root,
        chipTier.tier,
        hue !== undefined && palette.hue,
        presence.className,
        className,
      )}
      aria-disabled={disabled || undefined}
      aria-busy={busy || undefined}
      {...toDataAttributes({
        color: hue,
        tone,
        variant,
        size,
        tier,
        shape: shape === "square" ? "square" : undefined,
        "full-width": fullWidth || undefined,
        "icon-only": iconOnly || undefined,
        "text-only": (textOnly && edges.children.length > 0) || undefined,
        "icon-start": edges.start || undefined,
        avatar: avatar ? true : undefined,
        stacked: stacked || undefined,
        "icon-end": edges.end || undefined,
        removable: onRemove ? true : undefined,
        pending: busy || undefined,
        pressable: toggle || trigger || undefined,
        pressed: (toggle && pressed) || undefined,
        // A pressed action stays shown: its state must be seen, not only revealed on hover.
        action: actionElement
          ? actionElement.props.persistent || actionElement.props.pressed
            ? "persistent"
            : "reveal"
          : undefined,
        disabled: disabled || undefined,
      })}
    >
      {trigger ? (
        <button
          {...triggerProps}
          ref={triggerRef}
          type="button"
          className={styles.body}
          disabled={disabled}
        >
          {body}
        </button>
      ) : toggle ? (
        <button
          type="button"
          className={styles.body}
          aria-pressed={pressed}
          disabled={disabled}
          onClick={() => setPressed(!pressed)}
        >
          {body}
        </button>
      ) : trailing ? (
        <span className={styles.body}>{body}</span>
      ) : (
        // A read-only badge is one element: its content sits in the root.
        body
      )}
      {actionElement}
      {onRemove ? (
        <button
          type="button"
          className={cx(styles.remove, touchTargetBlockClass)}
          aria-label={labels?.remove ?? BADGE_LABELS.remove}
          aria-disabled={busy || undefined}
          onClick={remove}
          disabled={disabled}
        >
          <GlyphSwap layerClassName={iconSlotClass}>
            {busy ? <Spinner aria-hidden="true" /> : <Icon name="action.close" />}
          </GlyphSwap>
        </button>
      ) : null}
      {/* Mounted once a removal waits (empty), so its refusal is spoken when it comes. */}
      {onRemove && (removing || failure) ? (
        <VisuallyHidden live="polite">{failure}</VisuallyHidden>
      ) : null}
    </span>
  );
}

BadgeRoot.displayName = "Badge.Root";

function BadgeIcon({ children, className, ...rest }: BadgeIconProps) {
  // `data-edge` comes from Badge.Root when the icon sits at an edge of the badge.
  return (
    <span className={cx(styles.icon, iconSlotClass, className)} {...rest}>
      {children}
    </span>
  );
}

BadgeIcon.displayName = "Badge.Icon";

/**
 * The person of a chip (an assignee, an author): an `Avatar.Root` — or your component that renders
 * one — at the start, sized by the chip (internal/mediaSlot: 2 px inside a one-line chip's height,
 * both text lines of a chip with `Badge.Description`). Decorative: the name beside it is the text.
 */
function BadgeAvatar({ children, className, ...rest }: BadgeAvatarProps) {
  const tier = useOptionalControlSize() ?? "m";
  const stacked = React.useContext(StackedContext);
  const { provide } = useMediaSlotHost({
    avatar: chipAvatarSize[stacked ? "stacked" : "line"][tier],
  });
  return (
    <span {...rest} className={cx(styles.avatar, className)} aria-hidden="true">
      {provide(children)}
    </span>
  );
}

BadgeAvatar.displayName = "Badge.Avatar";

/**
 * The second line of a chip under its text (a person's role, e-mail or department): quieter, one
 * line, ellipsized. Its presence makes the chip two lines high.
 */
function BadgeDescription({ className, ...rest }: BadgeDescriptionProps) {
  return <span {...rest} className={cx(styles.description, className)} />;
}

BadgeDescription.displayName = "Badge.Description";

/**
 * A status dot in the current text color, or in the solid step of a palette hue (`color`). Inside
 * a badge it takes the badge tier; standalone (a marker on an icon, before a label) it takes the
 * tier of the surrounding control.
 */
function BadgeDot({ color, className, ...rest }: BadgeDotProps) {
  const size = useOptionalControlSize() ?? "m";
  // `data-edge` comes from Badge.Root when the dot sits at an edge of the badge.
  return (
    <span
      className={cx(styles.dot, color !== undefined && palette.hue, className)}
      aria-hidden="true"
      {...toDataAttributes({ size, color })}
      {...rest}
    />
  );
}

BadgeDot.displayName = "Badge.Dot";

/**
 * An action at the end of the badge («−» to hide a value): a full-height segment revealed on hover
 * and focus. The text slides toward the start and the segment comes in, inside room the badge always
 * reserves, so the badge never changes width and its neighbours never move.
 */
function BadgeAction({
  label,
  onClick,
  persistent: _persistent,
  disabled: disabledProp,
  pressed,
  children,
  className,
  ...rest
}: BadgeActionProps) {
  const disabled = useInheritedDisabled(disabledProp);
  return (
    <button
      {...rest}
      type="button"
      className={cx(styles.action, touchTargetBlockClass, iconSlotClass, className)}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      {children ?? <Icon name="action.remove" />}
    </button>
  );
}

BadgeAction.displayName = "Badge.Action";

/**
 * The text a person reads in a badge, without what assistive tech skips (a chip's avatar, a
 * glyph): what the «+N» tooltip lists for a badge that did not fit, a picker's trigger included.
 */
function badgeText(badge: HTMLElement): string {
  const walker = document.createTreeWalker(badge, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node instanceof Element && node.getAttribute("aria-hidden") === "true"
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  let text = "";
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) text += node.nodeValue ?? "";
  }
  return text.replace(/\s+/g, " ").trim();
}

/**
 * How many of `widths` stand in `available` px a `gap` apart; when not all of them do, the rest
 * goes into a «+N» badge `moreWidth` wide at the end. At least one stays shown (it ellipsizes).
 */
function fitCount(widths: number[], gap: number, available: number, moreWidth: number): number {
  const total = widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);
  if (total <= available) return widths.length;
  let used = moreWidth;
  let count = 0;
  for (const width of widths) {
    if (used + width + gap > available) break;
    used += width + gap;
    count += 1;
  }
  return Math.max(1, count);
}

/**
 * A row of badges as one value (the tags of a record, the stages a deal went through): the badges
 * wrap onto more lines, a chip gap apart. `size` sets the tier of every badge in it; without it the
 * badges follow the host, as a lone badge does. `overflow="count"` keeps the row on one line: as
 * many badges as fit the container, the rest behind a focusable «+N» badge: assistive tech
 * reads how many, its tooltip (the badge's description) lists them.
 */
function BadgeGroup({
  size,
  overflow = "wrap",
  labels: labelsProp,
  className,
  children,
  ref,
  ...rest
}: BadgeGroupProps) {
  const { tier } = useChipTier(size);
  const labels = useLabels(BADGE_GROUP_LABELS, labelsProp);
  const counting = overflow === "count";
  const groupRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(groupRef, ref);
  const moreRef = React.useRef<HTMLSpanElement>(null);
  const items = React.Children.toArray(children);
  // How many badges stand in the row; the rest wait behind «+N».
  const [shown, setShown] = React.useState(items.length);
  // What the badges behind «+N» say, read from the row (a picker's trigger reads as its badge).
  const [hiddenText, setHiddenText] = React.useState("");
  const hidden = counting ? Math.max(0, items.length - shown) : 0;

  const fitRow = React.useCallback(() => {
    const group = groupRef.current;
    const more = moreRef.current;
    if (!group || !more) return;
    const badges = Array.from(group.children).filter(
      (child): child is HTMLElement => child !== more && child instanceof HTMLElement,
    );
    // Measured at their natural width: no badge shrinks while the row is being measured.
    group.setAttribute("data-measuring", "");
    const widths = badges.map((badge) => badge.getBoundingClientRect().width);
    const moreWidth = more.getBoundingClientRect().width;
    const style = getComputedStyle(group);
    const gap = Number.parseFloat(style.columnGap) || 0;
    const available =
      group.clientWidth -
      (Number.parseFloat(style.paddingInlineStart) || 0) -
      (Number.parseFloat(style.paddingInlineEnd) || 0);
    group.removeAttribute("data-measuring");
    const count = fitCount(widths, gap, available, moreWidth + gap);
    badges.forEach((badge, index) => {
      badge.toggleAttribute("data-overflowed", index >= count);
    });
    setShown(count);
    setHiddenText(badges.slice(count).map(badgeText).filter(Boolean).join(", "));
  }, []);

  // The first layout and every change of the badges; then every resize of the row or a badge.
  React.useLayoutEffect(() => {
    if (counting) fitRow();
  });
  useResizeEffect(groupRef, fitRow, { enabled: counting, children: true });

  return (
    <GroupSizeContext value={size}>
      <div
        {...rest}
        ref={mergedRef}
        // A named group is a `group` for assistive tech; an unnamed one is plain layout.
        role={namedRole(rest, "group")}
        className={cx(styles.group, className)}
        data-tier={tier}
        data-overflow={overflow}
      >
        {children}
        {counting ? (
          <Tooltip.Root>
            <Tooltip.Trigger>
              <BadgeRoot ref={moreRef} data-overflowed={hidden === 0 ? "" : undefined}>
                <span aria-hidden="true">{formatLabel(labels.more, { count: hidden })}</span>
                <VisuallyHidden>{formatLabel(labels.moreCount, { count: hidden })}</VisuallyHidden>
              </BadgeRoot>
            </Tooltip.Trigger>
            <Tooltip.Content>{hiddenText}</Tooltip.Content>
          </Tooltip.Root>
        ) : null}
      </div>
    </GroupSizeContext>
  );
}

BadgeGroup.displayName = "Badge.Group";

export const Badge = {
  Root: BadgeRoot,
  Group: BadgeGroup,
  Icon: BadgeIcon,
  Avatar: BadgeAvatar,
  Description: BadgeDescription,
  Dot: BadgeDot,
  Action: BadgeAction,
};

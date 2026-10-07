import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, PaletteColor, Variant } from "@/internal/states";

import styles from "./Badge.module.css";
import { markEdgeIcons } from "./edgeIcons";
import { useBadgeTier } from "./tier";

export type BadgeLabels = {
  /** Accessible name of the remove button; include the badge text, e.g. «Убрать фильтр «Москва»». */
  remove: string;
};

const BADGE_LABELS: BadgeLabels = { remove: "Удалить" };

export type BadgeRootProps = {
  /** Palette hue. Default `gray`. */
  color?: PaletteColor;
  /** Treatment. Default `soft`. */
  variant?: Exclude<Variant, "ghost">;
  /** Badge tier; without it the badge follows the surrounding control one tier down. */
  size?: ControlSize;
  /** Shows the remove segment at the end (an applied filter, a selected value). */
  onRemove?: () => void;
  /**
   * Makes the body a button covering the whole badge (a toggle chip, a filter value). Receives the
   * click, so Alt / Shift clicks can mean something else.
   */
  onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Toggle state of a pressable badge: `aria-pressed` and `data-pressed`. */
  pressed?: boolean;
  labels?: Partial<BadgeLabels>;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export type BadgeIconProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

export type BadgeDotProps = {
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export type BadgeActionProps = {
  /** Accessible name and tooltip of the action («Скрыть billing»). */
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Keeps the action shown, not only on hover and focus (e.g. while the state it sets is on). */
  persistent?: boolean;
  disabled?: boolean;
  /** Toggle state of the action: `aria-pressed`. */
  pressed?: boolean;
  /** The glyph; a minus by default. Sized to the tier icon. */
  children?: React.ReactNode;
  className?: string;
};

const RemoveGlyph = (
  <svg className={styles.glyph} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4.5 4.5l7 7M11.5 4.5l-7 7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const MinusGlyph = (
  <svg className={styles.glyph} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 8h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const BadgeRoot = React.forwardRef<HTMLSpanElement, BadgeRootProps>(
  (
    {
      color = "gray",
      variant = "soft",
      size: sizeProp,
      onRemove,
      onPress,
      pressed,
      labels,
      disabled,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const { size, tier } = useBadgeTier(sizeProp);

    // Badge.Action lives at the end of the badge, outside the text body.
    let actionProps: BadgeActionProps | null = null;
    let action: React.ReactNode = null;
    const content: React.ReactNode[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === BadgeAction) {
        action = child;
        actionProps = child.props as BadgeActionProps;
      } else {
        content.push(child);
      }
    });
    const trailing = Boolean(onRemove || actionProps);
    const iconOnly =
      !trailing &&
      content.length > 0 &&
      content.every((child) => React.isValidElement(child) && child.type === BadgeIcon);
    // The end edge belongs to the remove segment or Badge.Action when there is one.
    const edges = markEdgeIcons(content, (type) => type === BadgeIcon || type === BadgeDot, {
      endTaken: trailing,
    });
    const body = <ControlSizeProvider value={tier}>{edges.children}</ControlSizeProvider>;
    const persistent = (actionProps as BadgeActionProps | null)?.persistent;

    return (
      <span
        ref={ref}
        className={cx(styles.root, className)}
        aria-disabled={disabled || undefined}
        {...toDataAttributes({
          color,
          variant,
          size,
          tier,
          "icon-only": iconOnly || undefined,
          "icon-start": edges.start || undefined,
          "icon-end": edges.end || undefined,
          removable: onRemove ? true : undefined,
          pressable: onPress ? true : undefined,
          pressed: onPress && pressed !== undefined ? pressed : undefined,
          action: actionProps ? (persistent ? "persistent" : "reveal") : undefined,
          disabled: disabled || undefined,
        })}
        {...rest}
      >
        {onPress ? (
          <button
            type="button"
            className={styles.body}
            aria-pressed={pressed}
            disabled={disabled}
            onClick={onPress}
          >
            {body}
          </button>
        ) : trailing ? (
          <span className={styles.body}>{body}</span>
        ) : (
          // A read-only badge is one element: its content sits in the root.
          body
        )}
        {action}
        {onRemove ? (
          <button
            type="button"
            className={styles.remove}
            aria-label={labels?.remove ?? BADGE_LABELS.remove}
            onClick={onRemove}
            disabled={disabled}
          >
            {RemoveGlyph}
          </button>
        ) : null}
      </span>
    );
  },
);

BadgeRoot.displayName = "BadgeRoot";

function BadgeIcon({ children, className, ...rest }: BadgeIconProps) {
  // `data-edge` comes from Badge.Root when the icon sits at an edge of the badge.
  return (
    <span className={cx(styles.icon, className)} {...rest}>
      {children}
    </span>
  );
}

BadgeIcon.displayName = "BadgeIcon";

function BadgeDot({ className, ...rest }: BadgeDotProps) {
  // `data-edge` comes from Badge.Root when the dot sits at an edge of the badge.
  return <span className={cx(styles.dot, className)} aria-hidden="true" {...rest} />;
}

BadgeDot.displayName = "BadgeDot";

/**
 * An action at the end of the badge («−» to hide a value): a full-height segment revealed on hover
 * and focus. The text slides toward the start and the segment comes in, inside room the badge always
 * reserves, so the badge never changes width and its neighbours never move.
 */
function BadgeAction({
  label,
  onClick,
  persistent: _persistent,
  disabled,
  pressed,
  children,
  className,
}: BadgeActionProps) {
  return (
    <button
      type="button"
      className={cx(styles.action, className)}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      {children ?? MinusGlyph}
    </button>
  );
}

BadgeAction.displayName = "BadgeAction";

export const Badge = { Root: BadgeRoot, Icon: BadgeIcon, Dot: BadgeDot, Action: BadgeAction };

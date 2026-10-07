import * as React from "react";

import { Icon } from "@/icons";
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
    const items = React.Children.toArray(children);
    const actionElement = items.find(isAction) ?? null;
    const content = items.filter((child) => !isAction(child));
    const trailing = Boolean(onRemove || actionElement);
    const iconOnly =
      !trailing &&
      content.length > 0 &&
      content.every((child) => React.isValidElement(child) && child.type === BadgeIcon);
    // The end edge belongs to the remove segment or Badge.Action when there is one.
    const edges = markEdgeIcons(content, (type) => type === BadgeIcon || type === BadgeDot, {
      endTaken: trailing,
    });
    const body = <ControlSizeProvider value={tier}>{edges.children}</ControlSizeProvider>;

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
          action: actionElement
            ? actionElement.props.persistent
              ? "persistent"
              : "reveal"
            : undefined,
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
        {actionElement}
        {onRemove ? (
          <button
            type="button"
            className={styles.remove}
            aria-label={labels?.remove ?? BADGE_LABELS.remove}
            onClick={onRemove}
            disabled={disabled}
          >
            <Icon name="action.close" />
          </button>
        ) : null}
      </span>
    );
  },
);

BadgeRoot.displayName = "Badge.Root";

function BadgeIcon({ children, className, ...rest }: BadgeIconProps) {
  // `data-edge` comes from Badge.Root when the icon sits at an edge of the badge.
  return (
    <span className={cx(styles.icon, className)} {...rest}>
      {children}
    </span>
  );
}

BadgeIcon.displayName = "Badge.Icon";

function BadgeDot({ className, ...rest }: BadgeDotProps) {
  // `data-edge` comes from Badge.Root when the dot sits at an edge of the badge.
  return <span className={cx(styles.dot, className)} aria-hidden="true" {...rest} />;
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
      {children ?? <Icon name="action.remove" />}
    </button>
  );
}

BadgeAction.displayName = "Badge.Action";

function isAction(child: React.ReactNode): child is React.ReactElement<BadgeActionProps> {
  return React.isValidElement(child) && child.type === BadgeAction;
}

export const Badge = { Root: BadgeRoot, Icon: BadgeIcon, Dot: BadgeDot, Action: BadgeAction };

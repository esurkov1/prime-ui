import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Icon, type IconName } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { type ControlSize, type PaletteColor, stepDown, type Tone } from "@/internal/states";

import styles from "./Notification.module.css";

export type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type NotificationLabels = {
  /** `aria-label` of the close button. */
  close: string;
  /** Accessible names of the toast regions, one per position. */
  regionTopLeft: string;
  regionTopCenter: string;
  regionTopRight: string;
  regionBottomLeft: string;
  regionBottomCenter: string;
  regionBottomRight: string;
};

export const NOTIFICATION_LABELS: NotificationLabels = {
  close: "Закрыть уведомление",
  regionTopLeft: "Уведомления сверху слева",
  regionTopCenter: "Уведомления сверху по центру",
  regionTopRight: "Уведомления сверху справа",
  regionBottomLeft: "Уведомления снизу слева",
  regionBottomCenter: "Уведомления снизу по центру",
  regionBottomRight: "Уведомления снизу справа",
};

export const REGION_LABEL_KEY: Record<NotificationPosition, keyof NotificationLabels> = {
  "top-left": "regionTopLeft",
  "top-center": "regionTopCenter",
  "top-right": "regionTopRight",
  "bottom-left": "regionBottomLeft",
  "bottom-center": "regionBottomCenter",
  "bottom-right": "regionBottomRight",
};

/** Labels provided by `NotificationProvider`; a standalone card uses the defaults. */
export const NotificationLabelsContext =
  React.createContext<NotificationLabels>(NOTIFICATION_LABELS);

export type NotificationTone = Extract<Tone, "info" | "success" | "warning" | "danger">;

export type NotificationAction = {
  label: string;
  onClick: () => void;
};

/** What a toast shows; shared by `notify()` and the static `NotificationCard`. */
type NotificationContent = {
  /** Semantic color and default icon. Default `info`. `danger` and `warning` are announced assertively. */
  tone?: NotificationTone;
  title: string;
  description?: string;
  /** Default `m`. */
  size?: ControlSize;
  /** Replaces the tone icon (an `Icon`). */
  icon?: React.ReactNode;
  /** A small counter next to the title. */
  badge?: string | number;
  /** One action button under the text. */
  action?: NotificationAction;
};

export type NotificationOptions = NotificationContent & {
  /** Default: the provider's `position`. */
  position?: NotificationPosition;
  /** Auto-close delay in ms. Default `5000`. */
  duration?: number;
  /** No timer and no countdown line; closes only by the button, swipe or `dismiss`. */
  persistent?: boolean;
  /** Shows the close button. Default `true`. */
  closable?: boolean;
};

export type NotificationRecord = NotificationOptions & {
  id: string;
  tone: NotificationTone;
  position: NotificationPosition;
  size: ControlSize;
  duration: number;
  persistent: boolean;
  closable: boolean;
  createdAt: number;
};

const TONE_ICON: Record<NotificationTone, IconName> = {
  info: "status.info",
  success: "status.success",
  warning: "status.warning",
  danger: "status.danger",
};

const TONE_BADGE_COLOR: Record<NotificationTone, PaletteColor> = {
  info: "blue",
  success: "green",
  warning: "orange",
  danger: "red",
};

/** Native attributes of the card `<article>`; `title` is the notification title, not the attribute. */
type CardDomProps = Omit<React.HTMLAttributes<HTMLElement>, "title" | "children" | "role"> & {
  ref?: React.Ref<HTMLElement>;
};

type CardViewProps = NotificationContent &
  CardDomProps & {
    className?: string;
    /** Close button handler; no button without it. */
    onClose?: () => void;
    /** The auto-close countdown line; none when undefined. */
    countdown?: Countdown;
    stackDepth?: number;
    stackExpanded?: boolean;
  };

type Countdown = {
  duration: number;
  paused: boolean;
  /** The line ran out: the toast expires. */
  onEnd: () => void;
};

function CardView({
  tone = "info",
  title,
  description,
  size = "m",
  icon,
  badge,
  action,
  className,
  onClose,
  countdown,
  stackDepth = 0,
  stackExpanded = false,
  ...rest
}: CardViewProps) {
  const labels = React.useContext(NotificationLabelsContext);
  const liveRole = tone === "danger" || tone === "warning" ? "alert" : "status";

  return (
    <article
      {...rest}
      className={cx(styles.card, className)}
      role={liveRole}
      aria-live={liveRole === "alert" ? "assertive" : "polite"}
      {...toDataAttributes({
        tone,
        size,
        persistent: countdown === undefined,
        "stack-depth": stackDepth,
        "stack-expanded": stackExpanded,
      })}
    >
      <div className={styles.iconWrap} aria-hidden="true">
        {icon ?? <Icon name={TONE_ICON[tone]} />}
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.title}>{title}</p>
          {badge !== undefined ? (
            <Badge.Root size="xs" color={TONE_BADGE_COLOR[tone]}>
              {badge}
            </Badge.Root>
          ) : null}
        </header>
        {description ? <p className={styles.description}>{description}</p> : null}
        {action ? (
          <div className={styles.actionRow}>
            <Button.Root
              variant="soft"
              tone="neutral"
              size={stepDown(size)}
              onClick={action.onClick}
            >
              {action.label}
            </Button.Root>
          </div>
        ) : null}
      </div>
      {onClose ? (
        <Button.Root
          variant="ghost"
          tone="neutral"
          size={stepDown(size, 2)}
          aria-label={labels.close}
          onClick={onClose}
        >
          <Button.Icon>
            <Icon name="action.close" />
          </Button.Icon>
        </Button.Root>
      ) : null}
      {countdown ? (
        <div className={styles.progressTrack} aria-hidden="true">
          {/* A CSS animation: no per-frame JS; it stops in place while paused. */}
          <span
            className={styles.progressValue}
            style={{
              animationDuration: `${countdown.duration}ms`,
              animationPlayState: countdown.paused ? "paused" : "running",
            }}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) countdown.onEnd();
            }}
          />
        </div>
      ) : null}
    </article>
  );
}

export type NotificationCardProps = NotificationContent &
  CardDomProps & {
    /** Shows the close button and is called on its click. */
    onDismiss?: () => void;
  };

/**
 * A toast card without a timer: for an inline confirmation, docs and mockups. In an app toasts
 * come from `useNotifications().notify()`.
 */
export function NotificationCard({ onDismiss, ...props }: NotificationCardProps) {
  return <CardView {...props} onClose={onDismiss} />;
}

function subscribeVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

/** The tab is in the background: countdowns stop and resume where they stopped. */
function useDocumentHidden(): boolean {
  return React.useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "hidden",
    () => false,
  );
}

type ToastCardProps = {
  item: NotificationRecord;
  paused: boolean;
  onDismiss: (id: string) => void;
  stackDepth: number;
  stackExpanded: boolean;
};

/**
 * A live toast in a provider stack: the card with its countdown. The countdown stops while
 * `paused` (hover, focus, swipe) and while the document is hidden.
 */
export function ToastCard({ item, paused, onDismiss, stackDepth, stackExpanded }: ToastCardProps) {
  const hidden = useDocumentHidden();
  const timed = !item.persistent && item.duration > 0;
  return (
    <CardView
      tone={item.tone}
      title={item.title}
      description={item.description}
      size={item.size}
      icon={item.icon}
      badge={item.badge}
      action={item.action}
      onClose={item.closable ? () => onDismiss(item.id) : undefined}
      countdown={
        timed
          ? { duration: item.duration, paused: paused || hidden, onEnd: () => onDismiss(item.id) }
          : undefined
      }
      stackDepth={stackDepth}
      stackExpanded={stackExpanded}
    />
  );
}

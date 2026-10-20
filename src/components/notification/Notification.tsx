import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Icon, type IconName } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { iconSlotClass } from "@/internal/iconBox";
import { type ControlSize, compactTier, stepDown, type Tone } from "@/internal/states";

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
  /** Runs the action; a toast of `notify()` then leaves with the reason `action`. */
  onClick: () => void;
};

/**
 * Why a toast left: its timer ran out (`timeout`), the close button (`close`), a swipe (`swipe`),
 * its action button (`action`), a `dismiss()` / `dismissAll()` call (`dismiss`), or a newer toast
 * pushed it out of a full stack (`overflow`).
 */
export type NotificationDismissReason =
  | "timeout"
  | "close"
  | "swipe"
  | "action"
  | "dismiss"
  | "overflow";

/** What a toast shows; shared by `notify()` and the static `NotificationCard`. */
type NotificationContent = {
  tone?: NotificationTone;
  title: string;
  description?: string;
  size?: ControlSize;
  icon?: React.ReactNode;
  badge?: string | number;
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
  /**
   * The toast left, with the reason. Called once. The place to commit an action the toast offered
   * to undo («Удалено» with «Отменить»): every reason but `action`.
   */
  onDismiss?: (reason: NotificationDismissReason) => void;
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

/** Native attributes of the card `<article>`; `title` is the notification title, not the attribute. */
type CardDomProps = Omit<React.HTMLAttributes<HTMLElement>, "title" | "children" | "role"> & {
  ref?: React.Ref<HTMLElement>;
};

type CardViewProps = NotificationContent &
  CardDomProps & {
    className?: string;
    /** Close button handler; no button without it. */
    onClose?: () => void;
    /** Runs after the action's own `onClick`: a live toast leaves. */
    onAction?: () => void;
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
  size: sizeProp,
  icon,
  badge,
  action,
  className,
  onClose,
  onAction,
  countdown,
  stackDepth = 0,
  stackExpanded = false,
  ...rest
}: CardViewProps) {
  const labels = React.useContext(NotificationLabelsContext);
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const liveRole = tone === "danger" || tone === "warning" ? "alert" : "status";

  return tier.provide(
    <article
      {...rest}
      className={cx(fieldTierClass, styles.card, className)}
      role={liveRole}
      aria-live={liveRole === "alert" ? "assertive" : "polite"}
      data-depth="floating"
      {...toDataAttributes({
        tone,
        size,
        persistent: countdown === undefined,
        "stack-depth": stackDepth,
        "stack-expanded": stackExpanded,
      })}
    >
      <div className={cx(styles.iconWrap, iconSlotClass)} aria-hidden="true">
        {icon ?? <Icon name={TONE_ICON[tone]} />}
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.title}>{title}</p>
          {badge !== undefined ? (
            <Badge.Root size="xs" tone={tone}>
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
              onClick={() => {
                action.onClick();
                onAction?.();
              }}
            >
              {action.label}
            </Button.Root>
          </div>
        ) : null}
      </div>
      {onClose ? (
        <div className={styles.closeWrap}>
          <Button.Root
            variant="ghost"
            tone="neutral"
            size={compactTier(size)}
            aria-label={labels.close}
            onClick={onClose}
          >
            <Button.Icon>
              <Icon name="action.close" />
            </Button.Icon>
          </Button.Root>
        </div>
      ) : null}
      {countdown ? (
        <div className={styles.progressTrack} aria-hidden="true">
          <CountdownLine {...countdown} />
        </div>
      ) : null}
    </article>,
  );
}

/**
 * The countdown line: a linear clock of the toast's `duration` on the compositor (no per-frame
 * JS). It stops in place while `paused` and resumes from there; the toast expires when it runs
 * out. Reduced motion keeps it: it is the time left, not a motion.
 *
 * The compositor draws the line by real time, while the animation's own `currentTime` follows the
 * main thread's frames, which lag behind it while the page is busy (the stack expanding under the
 * pointer). Paused at that `currentTime`, the line would jump back; it is paused at the real time
 * elapsed since it last started, where it is on screen.
 */
function CountdownLine({ duration, paused, onEnd }: Countdown) {
  const lineRef = React.useRef<HTMLSpanElement>(null);
  const clockRef = React.useRef<Animation | null>(null);
  /** `performance.now()` minus the time the line has run: the real start of its current run. */
  const startedAtRef = React.useRef(0);
  const latest = React.useRef({ paused, onEnd });
  React.useLayoutEffect(() => {
    latest.current = { paused, onEnd };
  });

  React.useLayoutEffect(() => {
    const line = lineRef.current;
    // No Web Animations (a DOM without them, such as jsdom): no clock, the toast stays.
    if (!line || typeof line.animate !== "function") return;
    const clock = line.animate([{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], {
      duration,
      easing: "linear",
      fill: "forwards",
    });
    startedAtRef.current = performance.now();
    if (latest.current.paused) clock.pause();
    clock.onfinish = () => latest.current.onEnd();
    clockRef.current = clock;
    return () => {
      clockRef.current = null;
      clock.cancel();
    };
  }, [duration]);

  React.useLayoutEffect(() => {
    const clock = clockRef.current;
    if (!clock) return;
    if (paused) {
      if (clock.playState !== "running") return;
      const elapsed = Math.min(duration, performance.now() - startedAtRef.current);
      clock.pause();
      clock.currentTime = elapsed;
    } else if (clock.playState === "paused") {
      startedAtRef.current = performance.now() - Number(clock.currentTime ?? 0);
      clock.play();
    }
  }, [paused, duration]);

  return <span ref={lineRef} className={styles.progressValue} />;
}

export type NotificationCardProps = NotificationContent &
  CardDomProps & {
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
  onDismiss: (id: string, reason: NotificationDismissReason) => void;
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
      onClose={item.closable ? () => onDismiss(item.id, "close") : undefined}
      onAction={() => onDismiss(item.id, "action")}
      countdown={
        timed
          ? {
              duration: item.duration,
              paused: paused || hidden,
              onEnd: () => onDismiss(item.id, "timeout"),
            }
          : undefined
      }
      stackDepth={stackDepth}
      stackExpanded={stackExpanded}
    />
  );
}

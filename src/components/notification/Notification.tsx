import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./Notification.module.css";

function isDocumentHidden(): boolean {
  return typeof document !== "undefined" && document.visibilityState === "hidden";
}

// Countdown lives in the card so progress re-renders never reach the stack item. It stops while
// `paused` (hover, focus, swipe) and while the document is hidden; after either it resumes from
// where it stopped instead of counting the time away.
function useCountdown(
  item: NotificationRecord,
  paused: boolean,
  onExpire: (id: string) => void,
): number {
  const [progress, setProgress] = React.useState(1);
  const remainingRef = React.useRef(item.duration);
  const lastTsRef = React.useRef<number | null>(null);
  const pausedRef = React.useRef(paused);
  const onExpireRef = React.useRef(onExpire);

  pausedRef.current = paused;
  onExpireRef.current = onExpire;

  React.useEffect(() => {
    if (item.persistent || item.duration <= 0) return;

    remainingRef.current = item.duration;
    lastTsRef.current = null;
    setProgress(1);

    let frame: number;
    let cancelled = false;

    const tick = (now: number) => {
      if (cancelled) return;
      const hidden = isDocumentHidden();
      if (lastTsRef.current !== null && !pausedRef.current && !hidden) {
        const delta = now - lastTsRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - delta);
        setProgress(remainingRef.current / item.duration);
        if (remainingRef.current <= 0) {
          onExpireRef.current(item.id);
          return;
        }
      }
      lastTsRef.current = hidden ? null : now;
      frame = requestAnimationFrame(tick);
    };

    // Browsers throttle frames in background tabs: restart the delta so the hidden time is not
    // charged against the toast when the tab comes back.
    const onVisibilityChange = () => {
      lastTsRef.current = null;
    };

    frame = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [item.id, item.duration, item.persistent]);

  return progress;
}

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
  /** Accessible names of the toast regions, per position. */
  regions: Record<NotificationPosition, string>;
};

export const DEFAULT_NOTIFICATION_LABELS: NotificationLabels = {
  close: "Закрыть уведомление",
  regions: {
    "top-left": "Уведомления сверху слева",
    "top-center": "Уведомления сверху по центру",
    "top-right": "Уведомления сверху справа",
    "bottom-left": "Уведомления снизу слева",
    "bottom-center": "Уведомления снизу по центру",
    "bottom-right": "Уведомления снизу справа",
  },
};

/** Labels provided by `NotificationProvider`; a standalone card uses the defaults. */
export const NotificationLabelsContext = React.createContext<NotificationLabels>(
  DEFAULT_NOTIFICATION_LABELS,
);

export type NotificationAction = {
  label: string;
  onClick: () => void;
};

export type NotificationOptions = {
  /** Semantic color and default icon. Default `info`. `danger` and `warning` are announced assertively. */
  tone?: Extract<Tone, "info" | "success" | "warning" | "danger">;
  title: string;
  description?: string;
  size?: ControlSize;
  position?: NotificationPosition;
  duration?: number;
  persistent?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  closable?: boolean;
  action?: NotificationAction;
};

export type NotificationRecord = NotificationOptions & {
  id: string;
  tone: NonNullable<NotificationOptions["tone"]>;
  position: NotificationPosition;
  size: ControlSize;
  duration: number;
  persistent: boolean;
  closable: boolean;
  createdAt: number;
};

export type NotificationCardProps = {
  item: NotificationRecord;
  className?: string;
  paused: boolean;
  onDismiss: (id: string) => void;
  stackDepth?: number;
  stackExpanded?: boolean;
};

/** Action button sits one tier below the card (pairing rule for nested controls). */
const actionButtonSize: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "s",
  l: "m",
  xl: "l",
};

const defaultIconByTone: Record<
  NotificationRecord["tone"],
  React.ComponentType<{ className?: string }>
> = {
  success: CheckCircle2,
  danger: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export function NotificationCard({
  item,
  className,
  paused,
  onDismiss,
  stackDepth = 0,
  stackExpanded = false,
}: NotificationCardProps) {
  const progress = useCountdown(item, paused, onDismiss);
  const labels = React.useContext(NotificationLabelsContext);
  const DefaultIcon = defaultIconByTone[item.tone];
  const liveRole = item.tone === "danger" || item.tone === "warning" ? "alert" : "status";

  return (
    <article
      className={cx(styles.card, className)}
      role={liveRole}
      aria-live={liveRole === "alert" ? "assertive" : "polite"}
      {...toDataAttributes({
        tone: item.tone,
        size: item.size,
        persistent: item.persistent,
        "stack-depth": stackDepth,
        "stack-expanded": stackExpanded,
      })}
    >
      <div className={styles.iconWrap} aria-hidden="true">
        {item.icon ?? <DefaultIcon className={styles.icon} />}
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.title}>{item.title}</p>
          {item.badge !== undefined ? <span className={styles.badge}>{item.badge}</span> : null}
        </header>
        {item.description ? <p className={styles.description}>{item.description}</p> : null}
        {item.action ? (
          <div className={styles.actionRow}>
            <Button.Root
              variant="soft"
              tone="neutral"
              type="button"
              size={actionButtonSize[item.size]}
              onClick={item.action.onClick}
            >
              {item.action.label}
            </Button.Root>
          </div>
        ) : null}
      </div>
      {item.closable ? (
        <button
          type="button"
          className={styles.closeButton}
          aria-label={labels.close}
          onClick={() => onDismiss(item.id)}
        >
          <X aria-hidden="true" />
        </button>
      ) : null}
      {!item.persistent ? (
        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressValue} style={{ transform: `scaleX(${progress})` }} />
        </div>
      ) : null}
    </article>
  );
}

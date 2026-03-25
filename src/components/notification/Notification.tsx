import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { InputSize } from "@/internal/states";

import styles from "./Notification.module.css";

// ─── useCountdown ─────────────────────────────────────────────────────────────
// Хук живёт здесь, чтобы ре-рендеры прогресс-бара не поднимались до motion.li.

export function useCountdown(
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
      if (lastTsRef.current !== null && !pausedRef.current) {
        const delta = now - lastTsRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - delta);
        setProgress(remainingRef.current / item.duration);
        if (remainingRef.current <= 0) {
          onExpireRef.current(item.id);
          return;
        }
      }
      lastTsRef.current = now;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [item.id, item.duration, item.persistent]);

  return progress;
}

export type NotificationType = "success" | "error" | "warning" | "info";
export type NotificationSize = "s" | "m" | "l";
export type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type NotificationAction = {
  label: string;
  onClick: () => void;
};

export type NotificationOptions = {
  type: NotificationType;
  title: string;
  description?: string;
  size?: NotificationSize;
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
  position: NotificationPosition;
  size: NotificationSize;
  duration: number;
  persistent: boolean;
  closable: boolean;
  createdAt: number;
};

type NotificationCardProps = {
  item: NotificationRecord;
  className?: string;
  paused: boolean;
  onDismiss: (id: string) => void;
  stackDepth?: number;
  stackExpanded?: boolean;
};

const actionButtonSize: Record<NotificationSize, InputSize> = {
  s: "s",
  m: "s",
  l: "m",
};

const defaultIconByType: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: XCircle,
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
  const DefaultIcon = defaultIconByType[item.type];
  const liveRole = item.type === "error" || item.type === "warning" ? "alert" : "status";

  return (
    <article
      className={cx(styles.card, className)}
      role={liveRole}
      aria-live={liveRole === "alert" ? "assertive" : "polite"}
      {...toDataAttributes({
        type: item.type,
        size: item.size,
        persistent: item.persistent,
        stackDepth,
        stackExpanded,
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
              type="button"
              size={actionButtonSize[item.size]}
              variant="neutral"
              mode="stroke"
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
          aria-label="Dismiss notification"
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

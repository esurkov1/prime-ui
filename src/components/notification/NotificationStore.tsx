import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import * as React from "react";

import { Portal } from "@/internal/Portal";
import { primitiveTokens } from "../../../tokens/primitives";

import {
  NotificationCard,
  type NotificationOptions,
  type NotificationPosition,
  type NotificationRecord,
  type NotificationType,
} from "./Notification";
import styles from "./Notification.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationProviderProps = {
  children: React.ReactNode;
  position?: NotificationPosition;
  max?: number;
};

type StoreValue = {
  items: NotificationRecord[];
  notify: (options: NotificationOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

// dismissing — внутренний флаг; не попадает в публичный StoreValue.items
type NotificationEntry = NotificationRecord & { dismissing?: true };

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_DURATION = 5000;
const PEEK_VISIBLE = 3;
const PEEK_PX = 8;

// Значения из design-token: primitiveTokens.motion.*
// Framer-motion принимает duration в секундах и ease как массив чисел
function _msToS(ms: string): number {
  return Number.parseFloat(ms) / 1000;
}
function _parseBezier(s: string): [number, number, number, number] {
  const m = s.match(/cubic-bezier\(([^)]+)\)/);
  const p = m ? m[1].split(",").map(Number.parseFloat) : [0.2, 0, 0, 1];
  return [p[0], p[1], p[2], p[3]] as [number, number, number, number];
}

const EASE = _parseBezier(primitiveTokens.motion.easing.standard);
const DUR_SLOW = _msToS(primitiveTokens.motion.duration.slow); // 500ms → 0.5s
const DUR_MEDIUM = _msToS(primitiveTokens.motion.duration.medium); // 350ms → 0.35s
const DUR_FAST = _msToS(primitiveTokens.motion.duration.fast); // 200ms → 0.2s
const TWEEN_SLOW = { type: "tween", duration: DUR_SLOW, ease: EASE } as const;

// DISMISS_CLEANUP_MS: чуть больше exit-анимации (medium = 350ms)
const DISMISS_CLEANUP_MS = Math.round(DUR_MEDIUM * 1000) + 100;
const POSITIONS: readonly NotificationPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const TYPES: readonly NotificationType[] = ["success", "error", "warning", "info"];

// ─── Context ──────────────────────────────────────────────────────────────────

const StoreContext = React.createContext<StoreValue | null>(null);

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ?? `ntf-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

function isTop(position: NotificationPosition): boolean {
  return position.startsWith("top");
}

// ─── NotificationStack ────────────────────────────────────────────────────────

function NotificationStack({
  position,
  items,
  onDismiss,
}: {
  position: NotificationPosition;
  items: NotificationEntry[];
  onDismiss: (id: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const collapseTimerRef = React.useRef<number | null>(null);
  const top = isTop(position);

  const handleHover = React.useCallback((hovered: boolean) => {
    if (collapseTimerRef.current !== null) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    if (hovered) {
      setExpanded(true);
    } else {
      collapseTimerRef.current = window.setTimeout(() => setExpanded(false), 100);
    }
  }, []);

  React.useEffect(
    () => () => {
      if (collapseTimerRef.current !== null) clearTimeout(collapseTimerRef.current);
    },
    [],
  );

  // Только активные (не dismissing) элементы участвуют в визуальном расчёте
  const visible = items.filter((n) => !n.dismissing);

  return (
    <motion.ol
      layout
      className={styles.stack}
      aria-label={`Notifications at ${position}`}
      data-expanded={String(expanded)}
      data-stacked={visible.length > 1 ? "true" : undefined}
      transition={{ layout: TWEEN_SLOW }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <AnimatePresence>
        {visible.map((item, index) => (
          <NotificationStackItem
            key={item.id}
            item={item}
            index={index}
            expanded={expanded}
            paused={expanded}
            top={top}
            hidden={!expanded && index >= PEEK_VISIBLE}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </motion.ol>
  );
}

// React.memo: не перерендериваем, пока props не изменились.
// Это критично — без мемо каждый setProgress в NotificationCard (60fps) поднимался бы
// до motion.li layout и засыпал LayoutGroup уведомлениями.
const NotificationStackItem = React.memo(function NotificationStackItem({
  item,
  index,
  expanded,
  paused,
  top,
  hidden,
  onDismiss,
}: {
  item: NotificationRecord;
  index: number;
  expanded: boolean;
  paused: boolean;
  top: boolean;
  hidden: boolean;
  onDismiss: (id: string) => void;
}) {
  const scale = expanded ? 1 : Math.max(1 - index * 0.04, 0.88);
  const opacity = expanded ? 1 : index === 0 ? 1 : index === 1 ? 0.7 : 0.45;
  const y = expanded ? 0 : (top ? 1 : -1) * index * PEEK_PX;

  const rotateEnter = top ? -45 : 45;
  const rotateExit = top ? 25 : -25;

  // layoutDependency: layout измеряется только при реальных изменениях позиции/состояния,
  // а не на каждом ре-рендере от внешних причин.
  const layoutDep = `${item.id}-${index}-${String(expanded)}-${String(hidden)}`;

  return (
    <motion.li
      className={styles.item}
      data-stack-index={index}
      layout
      layoutDependency={layoutDep}
      initial={{ opacity: 0, y: top ? -16 : 16, rotateX: rotateEnter, transformPerspective: 700 }}
      animate={{
        opacity: hidden ? 0 : opacity,
        y,
        scale,
        rotateX: 0,
        transformPerspective: 700,
        zIndex: 100 - index,
      }}
      exit={{
        opacity: 0,
        rotateX: rotateExit,
        transformPerspective: 700,
        transition: {
          opacity: { type: "tween", duration: DUR_MEDIUM, ease: EASE },
          rotateX: { type: "tween", duration: DUR_MEDIUM, ease: EASE },
        },
      }}
      transition={{
        opacity: { type: "tween", duration: DUR_FAST, ease: EASE },
        y: TWEEN_SLOW,
        scale: TWEEN_SLOW,
        rotateX: TWEEN_SLOW,
        layout: TWEEN_SLOW,
      }}
      style={{
        transformOrigin: top ? "top center" : "bottom center",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <NotificationCard
        item={item}
        paused={paused}
        onDismiss={onDismiss}
        stackDepth={index}
        stackExpanded={expanded}
      />
    </motion.li>
  );
});

// ─── NotificationToaster ──────────────────────────────────────────────────────
// Получает entries напрямую от провайдера — включая dismissing-элементы,
// чтобы стек оставался смонтированным во время exit-анимации.

function NotificationToaster({
  entries,
  onDismiss,
}: {
  entries: NotificationEntry[];
  onDismiss: (id: string) => void;
}) {
  const grouped = React.useMemo(() => {
    const map = new Map<NotificationPosition, Map<NotificationType, NotificationEntry[]>>();
    for (const entry of entries) {
      if (!map.has(entry.position)) map.set(entry.position, new Map());
      const byType = map.get(entry.position);
      if (!byType) continue;
      if (!byType.has(entry.type)) byType.set(entry.type, []);
      byType.get(entry.type)?.push(entry);
    }
    for (const byType of map.values()) {
      for (const list of byType.values()) {
        list.sort((a, b) => b.createdAt - a.createdAt);
      }
    }
    return map;
  }, [entries]);

  return (
    <Portal>
      <div className={styles.viewport}>
        {POSITIONS.map((pos) => {
          const byType = grouped.get(pos);
          if (!byType?.size) return null;

          const [vertical, horizontal] = pos.split("-") as [
            "top" | "bottom",
            "left" | "center" | "right",
          ];

          const stacks = TYPES.map((type) => ({ type, items: byType.get(type) ?? [] })).filter(
            (s) => s.items.length > 0,
          );

          return (
            <section
              key={pos}
              className={`${styles.zone} ${styles[vertical]} ${styles[horizontal]}`}
            >
              <LayoutGroup id={`zone-${pos}`}>
                {stacks.map((s) => (
                  <NotificationStack
                    key={s.type}
                    position={pos}
                    items={s.items}
                    onDismiss={onDismiss}
                  />
                ))}
              </LayoutGroup>
            </section>
          );
        })}
      </div>
    </Portal>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function NotificationProvider({
  children,
  position = "top-right",
  max = 5,
}: NotificationProviderProps) {
  const [entries, setEntries] = React.useState<NotificationEntry[]>([]);

  const dismiss = React.useCallback((id: string) => {
    // Фаза 1: помечаем как dismissing → AnimatePresence запускает exit-анимацию
    setEntries((prev) => prev.map((n) => (n.id === id ? { ...n, dismissing: true } : n)));
    // Фаза 2: удаляем из стейта после завершения анимации
    window.setTimeout(() => {
      setEntries((prev) => prev.filter((n) => n.id !== id));
    }, DISMISS_CLEANUP_MS);
  }, []);

  const dismissAll = React.useCallback(() => {
    setEntries((prev) => prev.map((n) => ({ ...n, dismissing: true as const })));
    window.setTimeout(() => setEntries([]), DISMISS_CLEANUP_MS);
  }, []);

  const notify = React.useCallback(
    (options: NotificationOptions): string => {
      const id = newId();
      const record: NotificationEntry = {
        ...options,
        id,
        size: options.size ?? "m",
        position: options.position ?? position,
        duration: options.duration ?? DEFAULT_DURATION,
        persistent: options.persistent ?? false,
        closable: options.closable ?? true,
        createdAt: Date.now(),
      };

      setEntries((prev) => {
        const sameStack = prev.filter(
          (n) => n.position === record.position && n.type === record.type && !n.dismissing,
        );
        const otherStacks = prev.filter(
          (n) => n.position !== record.position || n.type !== record.type,
        );
        return [...otherStacks, ...[record, ...sameStack].slice(0, max)];
      });

      return id;
    },
    [position, max],
  );

  // Публичный items не содержит dismissing-элементов
  const publicItems = React.useMemo(() => entries.filter((n) => !n.dismissing), [entries]);

  const value = React.useMemo(
    () => ({ items: publicItems, notify, dismiss, dismissAll }),
    [publicItems, notify, dismiss, dismissAll],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <NotificationToaster entries={entries} onDismiss={dismiss} />
    </StoreContext.Provider>
  );
}

export function useNotifications(): Pick<StoreValue, "notify" | "dismiss" | "dismissAll"> {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return { notify: ctx.notify, dismiss: ctx.dismiss, dismissAll: ctx.dismissAll };
}

export function useNotificationStore(): StoreValue {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useNotificationStore must be used within NotificationProvider");
  return ctx;
}

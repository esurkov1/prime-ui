import * as React from "react";

import { exitTimeoutMs, prefersReducedMotion } from "@/hooks/usePresence";
import { remToPx } from "@/internal/layoutPxFromPrimitives";
import { Portal } from "@/internal/Portal";
import { primitiveTokens } from "../../../tokens/primitives";

import {
  DEFAULT_NOTIFICATION_LABELS,
  NotificationCard,
  type NotificationLabels,
  NotificationLabelsContext,
  type NotificationOptions,
  type NotificationPosition,
  type NotificationRecord,
} from "./Notification";
import styles from "./Notification.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationProviderProps = {
  children: React.ReactNode;
  /** Default position for `notify()` calls without one. Default `top-right`. */
  position?: NotificationPosition;
  /** Max visible toasts per stack (position × tone). Default 5. */
  max?: number;
  /** Built-in strings (close button, region names); `regions` merges per position. */
  labels?: {
    close?: string;
    regions?: Partial<NotificationLabels["regions"]>;
  };
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
/** Cards visible in a collapsed stack; older ones are hidden and click-through. */
const PEEK_VISIBLE = 3;
/** Collapsed stack: scale step per depth and its floor (front 1, then 0.95, 0.9). */
const SCALE_STEP = 0.05;
const MIN_SCALE = 0.9;
/** Collapsed stack: opacity of the front card and the two peeking behind it. */
const PEEK_OPACITY = [1, 0.72, 0.48] as const;
/** Hover intent: the stack collapses this long after the pointer leaves it. */
const COLLAPSE_DELAY_MS = 100;
/** z-index of the front card inside its stack; older cards sit below it. */
const Z_FRONT = 100;

/** Swipe: a flick faster than this (px/ms) dismisses regardless of distance. */
const SWIPE_VELOCITY = 0.11;
/** Swipe against the dismiss direction: resistance grows with distance (damped, never a hard stop). */
const SWIPE_DAMPING_BASE = 1.5;
const SWIPE_DAMPING_RANGE = 20;

/** Vertical offset of each peeking card in a collapsed stack and the gap of an expanded one: `space.2`. */
function space2Px(): number {
  return remToPx(primitiveTokens.space[2]);
}

/** Swipe distance that dismisses a toast: `space.12`. */
function swipeThresholdPx(): number {
  return remToPx(primitiveTokens.space[12]);
}

type SwipeDirection = { axis: "x" | "y"; sign: 1 | -1 };

/** Toasts swipe out toward the nearest viewport edge: sideways in corners, vertically in the center. */
function swipeDirection(position: NotificationPosition): SwipeDirection {
  if (position.endsWith("left")) return { axis: "x", sign: -1 };
  if (position.endsWith("right")) return { axis: "x", sign: 1 };
  return { axis: "y", sign: isTop(position) ? -1 : 1 };
}

const INTERACTIVE_SELECTOR = "button, a, input, select, textarea, [role='button']";

const POSITIONS: readonly NotificationPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const TONES: readonly NotificationRecord["tone"][] = ["success", "danger", "warning", "info"];

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
// Motion without a layout library: every card is absolutely positioned at the stack's anchor edge
// (top or bottom); its offset, scale and opacity are computed here from measured heights and set
// as CSS custom properties, which CSS transitions with the motion tokens. Enter / exit / swipe live
// on an inner wrapper so they never fight the positioning transform; they are transitions too
// (enter via `@starting-style`), so rapid adds and dismissals retarget mid-flight.

type ItemLayout = {
  index: number;
  y: number;
  scale: number;
  opacity: number;
  hidden: boolean;
};

const RESTING_LAYOUT: ItemLayout = { index: 0, y: 0, scale: 1, opacity: 1, hidden: false };

function NotificationStack({
  position,
  items,
  onDismiss,
  onExited,
}: {
  position: NotificationPosition;
  items: NotificationEntry[];
  onDismiss: (id: string) => void;
  onExited: (id: string) => void;
}) {
  const labels = React.useContext(NotificationLabelsContext);
  const [expanded, setExpanded] = React.useState(false);
  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const collapseTimerRef = React.useRef<number | null>(null);
  const lastLayoutRef = React.useRef(new Map<string, ItemLayout>());
  const listRef = React.useRef<HTMLOListElement>(null);
  const hoveredRef = React.useRef(false);
  const focusedRef = React.useRef(false);
  const top = isTop(position);
  const step = React.useMemo(space2Px, []);

  // Expanded while hovered or while focus is inside (keyboard users see every card they tab to).
  const syncExpanded = React.useCallback(() => {
    if (collapseTimerRef.current !== null) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    if (hoveredRef.current || focusedRef.current) {
      setExpanded(true);
    } else {
      collapseTimerRef.current = window.setTimeout(() => setExpanded(false), COLLAPSE_DELAY_MS);
    }
  }, []);

  const handleHover = React.useCallback(
    (hovered: boolean) => {
      hoveredRef.current = hovered;
      syncExpanded();
    },
    [syncExpanded],
  );

  // A focused card that gets removed takes focus with it without a `blur` event: re-check after
  // every commit (cheap: a ref read and one `contains`).
  React.useLayoutEffect(() => {
    if (!focusedRef.current) return;
    if (listRef.current?.contains(document.activeElement)) return;
    focusedRef.current = false;
    syncExpanded();
  });

  React.useEffect(
    () => () => {
      if (collapseTimerRef.current !== null) clearTimeout(collapseTimerRef.current);
    },
    [],
  );

  const reportHeight = React.useCallback((id: string, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  // Forget heights of unmounted cards.
  React.useEffect(() => {
    setHeights((prev) => {
      const ids = new Set(items.map((n) => n.id));
      const stale = Object.keys(prev).filter((id) => !ids.has(id));
      if (stale.length === 0) return prev;
      const next = { ...prev };
      for (const id of stale) delete next[id];
      return next;
    });
  }, [items]);

  // Only active cards take part in the layout; a dismissed card keeps its last place while it fades.
  const active = items.filter((n) => !n.dismissing);
  const sign = top ? 1 : -1;
  const layouts = new Map<string, ItemLayout>();
  let flowHeight = 0;
  active.forEach((item, index) => {
    const hidden = !expanded && index >= PEEK_VISIBLE;
    layouts.set(item.id, {
      index,
      y: sign * (expanded ? flowHeight : index * step),
      scale: expanded ? 1 : Math.max(1 - index * SCALE_STEP, MIN_SCALE),
      opacity: hidden ? 0 : expanded ? 1 : PEEK_OPACITY[index],
      hidden,
    });
    flowHeight += (heights[item.id] ?? 0) + step;
  });

  const frontHeight = active.length > 0 ? (heights[active[0].id] ?? 0) : 0;
  const stackHeight =
    active.length === 0
      ? 0
      : expanded
        ? flowHeight - step
        : frontHeight + Math.min(active.length - 1, PEEK_VISIBLE - 1) * step;

  React.useLayoutEffect(() => {
    for (const [id, layout] of layouts) lastLayoutRef.current.set(id, layout);
    const ids = new Set(items.map((n) => n.id));
    for (const id of lastLayoutRef.current.keys()) {
      if (!ids.has(id)) lastLayoutRef.current.delete(id);
    }
  });

  return (
    <ol
      ref={listRef}
      className={styles.stack}
      aria-label={labels.regions[position]}
      data-expanded={String(expanded)}
      style={{ "--ntf-stack-height": `${stackHeight}px` } as React.CSSProperties}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onFocus={() => {
        focusedRef.current = true;
        syncExpanded();
      }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        focusedRef.current = false;
        syncExpanded();
      }}
    >
      {items.map((item) => {
        const closing = item.dismissing === true;
        const layout = layouts.get(item.id) ?? lastLayoutRef.current.get(item.id) ?? RESTING_LAYOUT;
        return (
          <NotificationStackItem
            key={item.id}
            item={item}
            position={position}
            index={layout.index}
            y={layout.y}
            scale={layout.scale}
            opacity={layout.opacity}
            hidden={layout.hidden}
            closing={closing}
            expanded={expanded}
            onDismiss={onDismiss}
            onExited={onExited}
            onHeight={reportHeight}
          />
        );
      })}
    </ol>
  );
}

// React.memo: the card's 60fps countdown re-renders stay inside NotificationCard; the item only
// re-renders when its place in the stack changes.
const NotificationStackItem = React.memo(function NotificationStackItem({
  item,
  position,
  index,
  y,
  scale,
  opacity,
  hidden,
  closing,
  expanded,
  onDismiss,
  onExited,
  onHeight,
}: {
  item: NotificationRecord;
  position: NotificationPosition;
  index: number;
  y: number;
  scale: number;
  opacity: number;
  hidden: boolean;
  closing: boolean;
  expanded: boolean;
  onDismiss: (id: string) => void;
  onExited: (id: string) => void;
  onHeight: (id: string, height: number) => void;
}) {
  const ref = React.useRef<HTMLLIElement>(null);
  const { id } = item;

  // Measure before paint so offsets are right on the first frame; follow later size changes.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    onHeight(id, el.offsetHeight);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => onHeight(id, el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, onHeight]);

  const state = closing ? "closed" : "open";
  const { axis, sign } = swipeDirection(position);
  const dragRef = React.useRef<{ pointerId: number; origin: number; startedAt: number } | null>(
    null,
  );
  const [swiping, setSwiping] = React.useState(false);

  // Distance toward the dismiss edge (positive) for a pointer at `client`; the opposite way is damped.
  const swipeAmount = (client: number, origin: number): number => {
    const toward = (client - origin) * sign;
    if (toward >= 0) return toward;
    return toward / (SWIPE_DAMPING_BASE + Math.abs(toward) / SWIPE_DAMPING_RANGE);
  };

  // Transform is written straight onto the wrapper: no re-render, no style recalc of the stack.
  const writeOffset = (el: HTMLElement, amount: number) => {
    el.style.transform = `translate${axis.toUpperCase()}(${amount * sign}px)`;
  };

  const pointerCoord = (event: React.PointerEvent) =>
    axis === "x" ? event.clientX : event.clientY;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // One pointer at a time (extra touches are ignored); primary button only; controls stay clickable.
    if (closing || hidden || dragRef.current !== null || event.button !== 0) return;
    if ((event.target as Element).closest(INTERACTIVE_SELECTOR)) return;
    const el = event.currentTarget;
    try {
      el.setPointerCapture(event.pointerId);
    } catch {
      // Pointer already released (synthetic or cancelled) — the drag still works without capture.
    }
    dragRef.current = {
      pointerId: event.pointerId,
      origin: pointerCoord(event),
      startedAt: performance.now(),
    };
    el.dataset.swipe = "drag";
    setSwiping(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    writeOffset(event.currentTarget, swipeAmount(pointerCoord(event), drag.origin));
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;
    setSwiping(false);
    const el = event.currentTarget;
    if (el.hasPointerCapture?.(event.pointerId)) el.releasePointerCapture(event.pointerId);

    const amount = cancelled ? 0 : swipeAmount(pointerCoord(event), drag.origin);
    const elapsed = Math.max(performance.now() - drag.startedAt, 1);
    const velocity = amount / elapsed;
    if (amount > 0 && (amount >= swipeThresholdPx() || velocity > SWIPE_VELOCITY)) {
      // Keep going the way the finger went, off the edge, while the store fades the card out.
      el.dataset.swipe = "out";
      el.style.transform = `translate${axis.toUpperCase()}(calc(${amount * sign}px + ${sign * 100}%))`;
      onDismiss(id);
      return;
    }
    // Glide back to rest (instant under reduced motion — the tokens collapse to 0).
    el.style.transform = "";
    if (amount === 0 || prefersReducedMotion()) delete el.dataset.swipe;
    else el.dataset.swipe = "return";
  };

  return (
    <li
      ref={ref}
      className={styles.item}
      data-stack-index={index}
      data-hidden={hidden ? "true" : undefined}
      data-state={state}
      style={
        {
          "--ntf-y": `${y}px`,
          "--ntf-scale": scale,
          "--ntf-opacity": opacity,
          zIndex: Z_FRONT - index,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.motion}
        data-state={state}
        data-swipe-axis={axis}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => endDrag(event, false)}
        onPointerCancel={(event) => endDrag(event, true)}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (closing) onExited(id);
          else if (event.currentTarget.dataset.swipe === "return") {
            delete event.currentTarget.dataset.swipe;
          }
        }}
      >
        <NotificationCard
          item={item}
          paused={expanded || closing || swiping}
          onDismiss={onDismiss}
          stackDepth={index}
          stackExpanded={expanded}
        />
      </div>
    </li>
  );
});

// ─── NotificationToaster ──────────────────────────────────────────────────────
// Получает entries напрямую от провайдера — включая dismissing-элементы,
// чтобы карточка оставалась смонтированной во время exit-анимации.

function NotificationToaster({
  entries,
  onDismiss,
  onExited,
}: {
  entries: NotificationEntry[];
  onDismiss: (id: string) => void;
  onExited: (id: string) => void;
}) {
  const grouped = React.useMemo(() => {
    const map = new Map<
      NotificationPosition,
      Map<NotificationRecord["tone"], NotificationEntry[]>
    >();
    for (const entry of entries) {
      if (!map.has(entry.position)) map.set(entry.position, new Map());
      const byTone = map.get(entry.position);
      if (!byTone) continue;
      if (!byTone.has(entry.tone)) byTone.set(entry.tone, []);
      byTone.get(entry.tone)?.push(entry);
    }
    for (const byTone of map.values()) {
      for (const list of byTone.values()) {
        list.sort((a, b) => b.createdAt - a.createdAt);
      }
    }
    return map;
  }, [entries]);

  return (
    <Portal>
      <div className={styles.viewport}>
        {POSITIONS.map((pos) => {
          const byTone = grouped.get(pos);
          if (!byTone?.size) return null;

          const [vertical, horizontal] = pos.split("-") as [
            "top" | "bottom",
            "left" | "center" | "right",
          ];

          const stacks = TONES.map((tone) => ({ tone, items: byTone.get(tone) ?? [] })).filter(
            (s) => s.items.length > 0,
          );

          return (
            <section
              key={pos}
              className={`${styles.zone} ${styles[vertical]} ${styles[horizontal]}`}
            >
              {stacks.map((s) => (
                <NotificationStack
                  key={s.tone}
                  position={pos}
                  items={s.items}
                  onDismiss={onDismiss}
                  onExited={onExited}
                />
              ))}
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
  labels: labelsProp,
}: NotificationProviderProps) {
  const labels = React.useMemo<NotificationLabels>(
    () => ({
      close: labelsProp?.close ?? DEFAULT_NOTIFICATION_LABELS.close,
      regions: { ...DEFAULT_NOTIFICATION_LABELS.regions, ...labelsProp?.regions },
    }),
    [labelsProp?.close, labelsProp?.regions],
  );
  const [entries, setEntries] = React.useState<NotificationEntry[]>([]);

  const entriesRef = React.useRef(entries);
  entriesRef.current = entries;
  const exitTimersRef = React.useRef(new Map<string, number>());

  React.useEffect(() => {
    const timers = exitTimersRef.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    };
  }, []);

  // Phase 2: drop the entry once its exit transition ended (or the token-based timeout fired).
  const remove = React.useCallback((id: string) => {
    const timer = exitTimersRef.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      exitTimersRef.current.delete(id);
    }
    setEntries((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Phase 1: mark as dismissing so the card plays its exit; under reduced motion remove at once.
  const startExit = React.useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      const target = new Set(ids);
      if (prefersReducedMotion()) {
        for (const id of ids) {
          const timer = exitTimersRef.current.get(id);
          if (timer !== undefined) clearTimeout(timer);
          exitTimersRef.current.delete(id);
        }
        setEntries((prev) => prev.filter((n) => !target.has(n.id)));
        return;
      }
      setEntries((prev) =>
        prev.map((n) => (target.has(n.id) && !n.dismissing ? { ...n, dismissing: true } : n)),
      );
      // Exit (fade + slide off the edge, or the swipe continuing) runs on `fast`, quicker than enter.
      const timeout = exitTimeoutMs("fast");
      for (const id of ids) {
        if (exitTimersRef.current.has(id)) continue;
        exitTimersRef.current.set(
          id,
          window.setTimeout(() => remove(id), timeout),
        );
      }
    },
    [remove],
  );

  const dismiss = React.useCallback((id: string) => startExit([id]), [startExit]);

  const dismissAll = React.useCallback(
    () => startExit(entriesRef.current.filter((n) => !n.dismissing).map((n) => n.id)),
    [startExit],
  );

  const notify = React.useCallback(
    (options: NotificationOptions): string => {
      const id = newId();
      const record: NotificationEntry = {
        ...options,
        id,
        tone: options.tone ?? "info",
        size: options.size ?? "m",
        position: options.position ?? position,
        duration: options.duration ?? DEFAULT_DURATION,
        persistent: options.persistent ?? false,
        closable: options.closable ?? true,
        createdAt: Date.now(),
      };

      setEntries((prev) => {
        const sameStack = prev.filter(
          (n) => n.position === record.position && n.tone === record.tone && !n.dismissing,
        );
        // Other stacks and cards still playing their exit stay as they are.
        const rest = prev.filter(
          (n) => n.position !== record.position || n.tone !== record.tone || n.dismissing,
        );
        return [...rest, ...[record, ...sameStack].slice(0, max)];
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
      <NotificationLabelsContext.Provider value={labels}>
        {children}
        <NotificationToaster entries={entries} onDismiss={dismiss} onExited={remove} />
      </NotificationLabelsContext.Provider>
    </StoreContext.Provider>
  );
}

/** `notify`, `dismiss`, `dismissAll` and the live `items` list of the nearest `NotificationProvider`. */
export function useNotifications(): StoreValue {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import {
  type PositionAlign,
  type PositionSide,
  readCssLengthPx,
  usePosition,
} from "@/hooks/usePosition";
import { usePresence } from "@/hooks/usePresence";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { mergeRefs } from "@/internal/mergeRefs";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import type { ControlSize } from "@/internal/states";

import styles from "./Tooltip.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TooltipSide = PositionSide;
export type TooltipAlign = PositionAlign;

const DEFAULT_DELAY_MS = 400;
const DEFAULT_SKIP_DELAY_MS = 300;
/**
 * Grace period after the pointer leaves the trigger: long enough to cross the gap onto the chip
 * (WCAG 1.4.13 "hoverable"), short enough to read as an immediate close.
 */
const CLOSE_GRACE_MS = 100;

// ─── Group: one open tooltip at a time, warm skip-delay ───────────────────────

type CloseHandler = () => void;

/**
 * Tooltips of one group (a Provider, or the kit-wide default) share a "warm" window: once a
 * tooltip has been shown, the next one opens at once and without animation, and the previous one
 * disappears instantly. Moving along a toolbar then feels like one tooltip changing its text.
 */
type TooltipGroup = {
  delayDuration: number;
  isWarm: () => boolean;
  /** Registers the newly opened tooltip and closes the previous one instantly. */
  opened: (close: CloseHandler) => void;
  /** Called on close: starts the warm window. */
  closed: (close: CloseHandler) => void;
};

function createTooltipGroup(delayDuration: number, skipDelayDuration: number): TooltipGroup {
  let current: CloseHandler | null = null;
  let warmUntil = 0;
  return {
    delayDuration,
    isWarm: () => current !== null || Date.now() < warmUntil,
    opened: (close) => {
      if (current && current !== close) current();
      current = close;
    },
    closed: (close) => {
      if (current === close) current = null;
      warmUntil = Date.now() + skipDelayDuration;
    },
  };
}

const defaultGroup = createTooltipGroup(DEFAULT_DELAY_MS, DEFAULT_SKIP_DELAY_MS);
const TooltipGroupContext = React.createContext<TooltipGroup>(defaultGroup);

// ─── Provider ─────────────────────────────────────────────────────────────────

export type TooltipProviderProps = {
  /** Show delay in ms for every Tooltip.Root inside. */
  delayDuration?: number;
  /** Window in ms after a tooltip closes during which the next one opens instantly. */
  skipDelayDuration?: number;
  children: React.ReactNode;
};

function TooltipProvider({
  delayDuration = DEFAULT_DELAY_MS,
  skipDelayDuration = DEFAULT_SKIP_DELAY_MS,
  children,
}: TooltipProviderProps) {
  const group = React.useMemo(
    () => createTooltipGroup(delayDuration, skipDelayDuration),
    [delayDuration, skipDelayDuration],
  );
  return <TooltipGroupContext.Provider value={group}>{children}</TooltipGroupContext.Provider>;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type TooltipRootContextValue = {
  isOpen: boolean;
  /** Opened inside a warm window, or replaced by a sibling: no enter / exit animation. */
  instant: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  /** Opens after the delay (or at once when warm). */
  scheduleOpen: () => void;
  /** Closes after the hover grace period, so the pointer can move onto the chip. */
  scheduleClose: () => void;
  /** Cancels a pending open or close (pointer reached the chip). */
  cancelPending: () => void;
  close: () => void;
};

const [TooltipRootProvider, useTooltipRootContext] =
  createComponentContext<TooltipRootContextValue>("Tooltip");

export type TooltipRootProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Show delay in ms for this tooltip; defaults to the Provider's (400). */
  delayDuration?: number;
};

function TooltipRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration: delayProp,
}: TooltipRootProps) {
  const group = React.useContext(TooltipGroupContext);
  const delayDuration = delayProp ?? group.delayDuration;

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [instant, setInstant] = React.useState(false);

  const triggerRef = React.useRef<HTMLElement | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const contentId = React.useId();

  const cancelPending = React.useCallback(() => clearTimeout(timerRef.current), []);

  // Stable identity for the group: the latest setters are read through a ref.
  const closeInstantlyRef = React.useRef<CloseHandler>(() => {});
  closeInstantlyRef.current = () => {
    clearTimeout(timerRef.current);
    setInstant(true);
    setIsOpen(false);
  };
  const closeInstantly = React.useCallback<CloseHandler>(() => closeInstantlyRef.current(), []);

  const show = React.useCallback(
    (asInstant: boolean) => {
      setInstant(asInstant);
      setIsOpen(true);
    },
    [setIsOpen],
  );

  const scheduleOpen = React.useCallback(() => {
    clearTimeout(timerRef.current);
    if (group.isWarm() || delayDuration <= 0) {
      show(group.isWarm());
      return;
    }
    timerRef.current = setTimeout(() => show(false), delayDuration);
  }, [delayDuration, group, show]);

  const close = React.useCallback(() => {
    clearTimeout(timerRef.current);
    setInstant(false);
    setIsOpen(false);
  }, [setIsOpen]);

  const scheduleClose = React.useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(close, CLOSE_GRACE_MS);
  }, [close]);

  // Group bookkeeping follows the actual state, so controlled tooltips take part too.
  React.useEffect(() => {
    if (!isOpen) return;
    group.opened(closeInstantly);
    return () => group.closed(closeInstantly);
  }, [isOpen, group, closeInstantly]);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  /* WAI-ARIA tooltip: Escape hides it, focus stays on the trigger. */
  useEscapeKey({ enabled: isOpen, onEscape: close });

  const value = React.useMemo(
    () => ({
      isOpen,
      instant,
      triggerRef,
      contentId,
      scheduleOpen,
      scheduleClose,
      cancelPending,
      close,
    }),
    [isOpen, instant, contentId, scheduleOpen, scheduleClose, cancelPending, close],
  );

  return <TooltipRootProvider value={value}>{children}</TooltipRootProvider>;
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

export type TooltipTriggerProps = {
  /** One focusable element: a Button, or a `tabIndex={0}` wrapper around a disabled control. */
  children: React.ReactElement;
};

type TriggerChildProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };

// Not `Slot`: the tooltip id is appended to the child's own `aria-describedby`, not replaced by it.
function TooltipTrigger({ children }: TooltipTriggerProps) {
  const { isOpen, triggerRef, contentId, scheduleOpen, scheduleClose, close } =
    useTooltipRootContext();
  const props = children.props as TriggerChildProps;
  /* A press hides the tooltip and the focus it causes must not reopen it (until the pointer leaves). */
  const pressedRef = React.useRef(false);
  const ref = React.useMemo(() => mergeRefs(props.ref, triggerRef), [props.ref, triggerRef]);

  return React.cloneElement(children as React.ReactElement<TriggerChildProps>, {
    ref,
    "aria-describedby":
      [props["aria-describedby"], isOpen ? contentId : undefined].filter(Boolean).join(" ") ||
      undefined,
    ...toDataAttributes({ state: isOpen ? "open" : "closed" }),
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
      props.onPointerEnter?.(e);
      // Touch has no hover: a tap must not leave a tooltip behind. Focus still opens it.
      if (e.pointerType === "touch") return;
      if (!pressedRef.current) scheduleOpen();
    },
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
      props.onPointerLeave?.(e);
      pressedRef.current = false;
      scheduleClose();
    },
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      props.onPointerDown?.(e);
      pressedRef.current = true;
      close();
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      props.onFocus?.(e);
      if (!pressedRef.current) scheduleOpen();
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      props.onBlur?.(e);
      pressedRef.current = false;
      close();
    },
  });
}

// ─── Arrow ────────────────────────────────────────────────────────────────────

/** Closest the arrow centre may come to a chip corner: the chip radius + half the arrow. */
function arrowInset(chip: HTMLElement): number {
  const radius = Number.parseFloat(getComputedStyle(chip).borderTopLeftRadius) || 0;
  return radius + readCssLengthPx("--prime-tooltip-arrow-width", 10) / 2;
}

/** Arrow shapes per resolved side: base on the chip edge, a softened tip toward the trigger. */
const ARROW_PATH: Record<TooltipSide, { viewBox: string; d: string }> = {
  top: { viewBox: "0 0 10 5", d: "M0 0H10L5.8 4.4Q5 5.2 4.2 4.4Z" },
  bottom: { viewBox: "0 0 10 5", d: "M0 5H10L5.8 0.6Q5 -0.2 4.2 0.6Z" },
  left: { viewBox: "0 0 5 10", d: "M0 0V10L4.4 5.8Q5.2 5 4.4 4.2Z" },
  right: { viewBox: "0 0 5 10", d: "M5 0V10L0.6 5.8Q-0.2 5 0.6 4.2Z" },
};

// ─── Content ─────────────────────────────────────────────────────────────────

export type TooltipContentProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "id" | "role" | "onPointerEnter" | "onPointerLeave"
> & {
  children: React.ReactNode;
  /** Text and padding tier; also the size context of controls inside (a Kbd). */
  size?: ControlSize;
  side?: TooltipSide;
  align?: TooltipAlign;
  ref?: React.Ref<HTMLDivElement>;
};

function TooltipContent({
  children,
  size = "m",
  side = "top",
  align = "center",
  className,
  style,
  ref,
  ...rest
}: TooltipContentProps) {
  const { isOpen, instant, triggerRef, contentId, scheduleClose, cancelPending } =
    useTooltipRootContext();
  const overlayPortalLayer = useOverlayPortalLayer();
  const contentRef = React.useRef<HTMLElement | null>(null);
  const presence = usePresence(isOpen, { exitDuration: "fast" });
  // A tooltip replaced by its neighbour leaves at once instead of fading under the new one.
  const mounted = presence.mounted && (isOpen || !instant);
  // Placed before paint, so the chip never shows up in the wrong place.
  const position = usePosition(mounted, triggerRef, contentRef, {
    side,
    align,
    offsetToken: "--prime-tooltip-offset",
    arrowInset,
  });
  const mergedRef = React.useMemo(
    () => mergeRefs<HTMLDivElement>(position.attachLayer, ref),
    [position.attachLayer, ref],
  );

  if (!mounted) return null;

  const arrow = ARROW_PATH[position.side];

  return (
    <Portal>
      <div
        {...rest}
        ref={mergedRef}
        id={contentId}
        role="tooltip"
        data-overlay-portal-layer={overlayPortalLayer}
        className={cx(styles.content, overlayMotion.floating, className)}
        style={style}
        onAnimationEnd={presence.onExitEnd}
        onPointerEnter={cancelPending}
        onPointerLeave={scheduleClose}
        {...toDataAttributes({
          state: presence.state,
          size,
          /* Resolved side: flips to the opposite one when the requested side does not fit. */
          side: position.side,
          align,
          instant: instant ? true : undefined,
        })}
      >
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        <svg
          className={styles.arrow}
          viewBox={arrow.viewBox}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d={arrow.d} />
        </svg>
      </div>
    </Portal>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

TooltipProvider.displayName = "Tooltip.Provider";
TooltipRoot.displayName = "Tooltip.Root";
TooltipTrigger.displayName = "Tooltip.Trigger";
TooltipContent.displayName = "Tooltip.Content";

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};

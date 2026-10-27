import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { type PositionAlign, type PositionSide, readCssLengthPx } from "@/hooks/usePosition";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { ReachableDisabledProvider, useInheritedDisabled } from "@/internal/disabledContext";
import { FloatingPanel, FloatingTrigger } from "@/internal/overlay/FloatingPanel";
import { focusFromKeyboard, hasNativeTabStop } from "@/internal/overlay/focus";
import tooltipSurface from "@/internal/overlay/tooltipSurface.module.css";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import type { SlotPartProps } from "@/internal/slot";
import { type ControlSize, OVERLAY_CONTENT_SIZE } from "@/internal/states";

import styles from "./Tooltip.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TooltipSide = PositionSide;
/**
 * The anchored-layer vocabulary. A tooltip centres on its trigger by default (foundation §8);
 * `auto` lines it up with the trigger edge that has more room beyond it, as a growing panel does.
 */
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
  delayDuration?: number;
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

/** A plain button: a native one without a role of its own, or `role="button"`. */
const BUTTON = 'button:not([role]), [role="button"]';

export type TooltipTriggerProps = SlotPartProps;

/**
 * Wraps one element. A focusable one (Button, link) is the trigger as is; a non-interactive one
 * (Badge, Avatar, ProgressCircle, an `Icon` with `label`) becomes a tab stop. A disabled kit
 * control — by its own `disabled` or a disabled `Fieldset` around it — stays reachable itself
 * (`ReachableDisabledProvider`: a tab stop that takes hover, `aria-disabled`), so the trigger never
 * re-parents it and it keeps its state (a label morph, focus) as `disabled` flips. Only a control
 * the DOM shows natively out of reach (a plain `<button disabled>`, a link out of the Tab order) is
 * wrapped in a focusable host that takes hover and Tab for it (around a button the host is the
 * button: `role="button"`, `aria-disabled`, named by the control). The tooltip id joins the child's
 * own `aria-describedby`; the child's handlers run first. Props a wrapping trigger adds pass on to
 * the child.
 */
function TooltipTrigger(props: TooltipTriggerProps) {
  const { children } = props;
  const { isOpen, triggerRef, contentId, scheduleOpen, scheduleClose, close } =
    useTooltipRootContext("Tooltip.Trigger");
  /* A press hides the tooltip and the focus it causes must not reopen it (until the pointer leaves). */
  const pressedRef = React.useRef(false);
  const childProps = children.props as { disabled?: unknown; tabIndex?: unknown; id?: unknown };
  // A disabled Fieldset around the trigger disables the kit control inside it: read on the DOM,
  // since only the element knows whether it took the inherited state.
  const inheritedDisabled = useInheritedDisabled();
  const [domDisabled, setDomDisabled] = React.useState(false);
  const disabledChild = childProps.disabled === true || (inheritedDisabled && domDisabled);
  // Whether the disabled control still takes focus and hover by itself (a kit control under
  // `ReachableDisabledProvider`). Assumed until the DOM shows otherwise, so a kit control is never
  // moved into a host; once a control shows itself out of reach, it is hosted while disabled.
  const [reachable, setReachable] = React.useState(true);
  const hosted = disabledChild && !reachable;
  // A child that is no tab stop of its own (a Badge, an Avatar) is made one, so keyboard users
  // reach the tooltip too. Measured on the DOM: only the element knows whether it is focusable.
  const [ownTabStop, setOwnTabStop] = React.useState(true);
  // Around a disabled button the host is that button for assistive tech; around another role (a
  // tab in a tablist) the control keeps its own role and the host only takes focus and hover.
  const [buttonHost, setButtonHost] = React.useState(false);
  React.useLayoutEffect(() => {
    const node = triggerRef.current;
    if (!node) return;
    const host = node.hasAttribute("data-disabled-host");
    const control = host ? node.firstElementChild : node;
    // Read on the trigger's own element only: inside a host the child's outer element may be
    // another one (a field's frame around its control), and a reading there would unhost it.
    if (!host) {
      setDomDisabled(
        inheritedDisabled && control?.matches(":disabled, [aria-disabled='true']") === true,
      );
    }
    setButtonHost(host && control?.matches(BUTTON) === true);
    if (disabledChild && !host && control instanceof HTMLElement && outOfReach(control)) {
      setReachable(false);
    }
    if (!hosted) setOwnTabStop(childProps.tabIndex !== undefined || hasNativeTabStop(node));
  });
  const madeFocusable = hosted || !ownTabStop;
  // The host names itself after the control it stands for.
  const generatedId = React.useId();
  const controlId = typeof childProps.id === "string" ? childProps.id : generatedId;

  return (
    // Around both branches, so the tree above the child never changes with them.
    <ReachableDisabledProvider>
      <FloatingTrigger
        {...props}
        triggerProps={{
          ref: triggerRef,
          "aria-describedby": isOpen ? contentId : undefined,
          ...toDataAttributes({ state: isOpen ? "open" : "closed" }),
          ...(madeFocusable ? { tabIndex: 0, className: styles.focusHost } : null),
          onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
            // Touch has no hover: a tap must not leave a tooltip behind. Keyboard focus still opens it.
            if (e.pointerType === "touch") return;
            if (!pressedRef.current) scheduleOpen();
          },
          onPointerLeave: () => {
            pressedRef.current = false;
            scheduleClose();
          },
          onPointerDown: () => {
            pressedRef.current = true;
            close();
          },
          onFocus: (e: React.FocusEvent<HTMLElement>) => {
            // Only keyboard focus shows it: not the focus a click causes, nor a layer moving focus
            // in or back after a click (a ⋯ in a drawer's header).
            if (!pressedRef.current && focusFromKeyboard(e.currentTarget)) scheduleOpen();
          },
          onBlur: () => {
            pressedRef.current = false;
            close();
          },
        }}
      >
        {hosted ? (
          // Around a button the host is the one button assistive tech meets: disabled, named by the
          // control, which itself is out of reach (no pointer events, no focus) and out of the tree.
          <span
            className={styles.disabledHost}
            data-disabled-host=""
            {...(buttonHost
              ? { role: "button", "aria-disabled": "true", "aria-labelledby": controlId }
              : null)}
          >
            {buttonHost
              ? React.cloneElement(
                  children as React.ReactElement<{ id?: string }>,
                  {
                    id: controlId,
                    "aria-hidden": true,
                  } as { id: string },
                )
              : children}
          </span>
        ) : (
          children
        )}
      </FloatingTrigger>
    </ReachableDisabledProvider>
  );
}

/**
 * A disabled control that takes no focus by itself: natively disabled or taken out of the Tab
 * order (`tabindex="-1"`). An element with no tab stop of its own (a choice row's `<label>`, an
 * item's frame) is not: the trigger makes it one, like a Badge. An item of a roving group (a
 * segment, a tab) marks itself `data-reachable-disabled`: its `tabIndex={-1}` is the roving model,
 * not a lost reach — its own group moves focus, it takes hover and stays `aria-disabled`, so it is
 * never hosted.
 */
function outOfReach(control: HTMLElement): boolean {
  if (control.matches(":disabled")) return true;
  return (
    control.hasAttribute("tabindex") &&
    control.tabIndex < 0 &&
    !control.hasAttribute("data-reachable-disabled")
  );
}

// ─── Arrow ────────────────────────────────────────────────────────────────────

/** Closest the arrow centre may come to a chip corner: the chip radius + half the arrow. */
function arrowInset(chip: HTMLElement): number {
  const radius = Number.parseFloat(getComputedStyle(chip).borderTopLeftRadius) || 0;
  return radius + readCssLengthPx("--prime-tooltip-arrow-width", 10, chip) / 2;
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
  size?: ControlSize;
  side?: TooltipSide;
  align?: TooltipAlign;
  ref?: React.Ref<HTMLDivElement>;
};

function TooltipContent({
  children,
  size = OVERLAY_CONTENT_SIZE,
  side = "top",
  align = "center",
  className,
  ...rest
}: TooltipContentProps) {
  const { isOpen, instant, triggerRef, contentId, scheduleClose, cancelPending, close } =
    useTooltipRootContext("Tooltip.Content");
  // A passive layer: placed before paint, never takes focus or presses; Escape hides it and focus
  // stays on the trigger (WAI-ARIA tooltip). Replaced by its neighbour, it leaves at once.
  const floating = useFloatingLayer({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) close();
    },
    triggerRef,
    side,
    align,
    offsetToken: "--prime-tooltip-offset",
    arrowInset,
    dismiss: "none",
    // WCAG 1.4.13: Escape always hides a tooltip; a press elsewhere closes it through blur.
    closeOnEscape: true,
    closeOnOutsideClick: true,
    skipExit: instant,
  });

  const arrow = ARROW_PATH[floating.side];

  return (
    <FloatingPanel
      {...rest}
      floating={floating}
      size={size}
      surface={false}
      id={contentId}
      role="tooltip"
      className={cx(tooltipSurface.chip, styles.content, className)}
      onPointerEnter={cancelPending}
      onPointerLeave={scheduleClose}
      {...toDataAttributes({ align, instant: instant ? true : undefined })}
    >
      {children}
      <svg
        className={styles.arrow}
        viewBox={arrow.viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d={arrow.d} />
      </svg>
    </FloatingPanel>
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

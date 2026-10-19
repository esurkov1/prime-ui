import * as React from "react";
import {
  DEFAULT_ALIGN,
  DEFAULT_SIDE,
  type PositionAlign,
  type PositionSide,
} from "@/hooks/usePosition";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import {
  FloatingPanel,
  FloatingTrigger,
  type FloatingWidth,
} from "@/internal/overlay/FloatingPanel";
import { focusFromKeyboard, getFocusable } from "@/internal/overlay/focus";
import { useAnchorName } from "@/internal/overlay/useAnchorName";
import { floatingTriggerProps, useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { useOpenState } from "@/internal/overlay/useOpenState";
import { Slot, type SlotPartProps } from "@/internal/slot";
import { type ControlSize, OVERLAY_CONTENT_SIZE } from "@/internal/states";

import styles from "./Popover.module.css";

/** What opens the panel: a press on the trigger, or hovering and keyboard-focusing it. */
export type PopoverOpenOn = "click" | "hover";

/** Hover intent: the pointer rests on the trigger this long (the tooltip delay) before it opens. */
const HOVER_OPEN_DELAY_MS = 400;
/**
 * Grace after the pointer leaves the trigger or the panel: the bridge across the gap between them,
 * so the pointer can travel into the panel (WCAG 1.4.13 "hoverable").
 */
const HOVER_CLOSE_DELAY_MS = 300;

/** How a hover panel came open: a press pins it until a dismiss; hover and focus follow intent. */
type HoverOpener = "hover" | "focus" | "click";

/** The hover-intent controller of `openOn="hover"`, shared by the trigger and the panel. */
type HoverIntent = {
  /** The pointer enters the trigger or the panel. */
  enter: () => void;
  /** The pointer leaves the trigger or the panel. */
  leave: () => void;
  /** Keyboard focus reached the trigger. */
  focus: () => void;
  /** Focus left the trigger or the panel for `next`. */
  blur: (next: EventTarget | null) => void;
  /** A press on the trigger. */
  press: () => void;
  /** The panel element while mounted. */
  panel: () => HTMLElement | null;
  /** `Popover.Content` hands over the ref of its panel element. */
  bindPanel: (ref: React.RefObject<HTMLElement | null>) => void;
};

type PopoverContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
  openOnArrow: boolean;
  /** Set by `Popover.Anchor`: focus stays in the anchor (a field driving the panel) on open. */
  anchoredRef: React.RefObject<boolean>;
  /** Set with `openOn="hover"`. */
  hover: HoverIntent | null;
};

const [PopoverProvider, usePopoverContext] = createComponentContext<PopoverContextValue>("Popover");

export type PopoverRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  openOnArrow?: boolean;
  openOn?: PopoverOpenOn;
  children: React.ReactNode;
};

/**
 * Hover intent of a hover panel: opens after the delay when the pointer rests on the trigger (not
 * on touch) or keyboard focus lands on it; stays open while the pointer is over the trigger or the
 * panel, or focus is in either; closes after the grace once neither holds. A press opens it at once
 * and pins it until a dismiss (Escape, an outside press, `Popover.Close`) — the touch path.
 */
function useHoverIntent(
  enabled: boolean,
  isOpen: boolean,
  setOpen: (open: boolean) => void,
  triggerRef: React.RefObject<HTMLElement | null>,
): HoverIntent | null {
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelHolderRef = React.useRef<React.RefObject<HTMLElement | null> | null>(null);
  const pointerInsideRef = React.useRef(false);
  const openerRef = React.useRef<HoverOpener | null>(null);
  const openRef = React.useRef(isOpen);
  openRef.current = isOpen;
  if (!isOpen) openerRef.current = null;
  // Closing with focus inside the panel: the focus the close hands back to the trigger (during
  // this commit) is no keyboard visit and must not reopen it.
  const returningRef = React.useRef(false);
  const wasOpenRef = React.useRef(isOpen);
  if (wasOpenRef.current && !isOpen) {
    returningRef.current =
      typeof document !== "undefined" &&
      panelHolderRef.current?.current?.contains(document.activeElement) === true;
  }
  wasOpenRef.current = isOpen;
  React.useEffect(() => {
    if (!isOpen) returningRef.current = false;
  }, [isOpen]);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  return React.useMemo(() => {
    if (!enabled) return null;
    const panel = () => panelHolderRef.current?.current ?? null;
    // Focus keeps the panel: inside it, or on the trigger that focus opened it from (focus left
    // on the trigger by an earlier press does not hold a panel the pointer opened).
    const focusHeld = () => {
      const active = document.activeElement;
      if (active === null) return false;
      if (panel()?.contains(active)) return true;
      return openerRef.current === "focus" && triggerRef.current?.contains(active) === true;
    };
    const openBy = (opener: HoverOpener) => {
      clearTimeout(timerRef.current);
      if (openRef.current) return;
      timerRef.current = setTimeout(() => {
        openerRef.current = opener;
        setOpen(true);
      }, HOVER_OPEN_DELAY_MS);
    };
    const closeSoon = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!openRef.current || openerRef.current === "click") return;
        if (pointerInsideRef.current || focusHeld()) return;
        setOpen(false);
      }, HOVER_CLOSE_DELAY_MS);
    };
    return {
      panel,
      bindPanel: (ref) => {
        panelHolderRef.current = ref;
      },
      enter: () => {
        pointerInsideRef.current = true;
        openBy("hover");
      },
      leave: () => {
        pointerInsideRef.current = false;
        closeSoon();
      },
      focus: () => {
        if (!returningRef.current) openBy("focus");
      },
      blur: (next) => {
        const inside =
          next instanceof Node &&
          (triggerRef.current?.contains(next) === true || panel()?.contains(next) === true);
        if (inside) return;
        if (!openRef.current) {
          // Focus left before the delay ran out; a resting pointer still opens it.
          if (!pointerInsideRef.current) clearTimeout(timerRef.current);
          return;
        }
        if (openerRef.current !== "click" && !pointerInsideRef.current) {
          clearTimeout(timerRef.current);
          setOpen(false);
        }
      },
      press: () => {
        clearTimeout(timerRef.current);
        if (openRef.current && openerRef.current === "click") {
          setOpen(false);
          return;
        }
        openerRef.current = "click";
        setOpen(true);
      },
    };
  }, [enabled, setOpen, triggerRef]);
}

function PopoverRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  openOnArrow = false,
  openOn = "click",
  children,
}: PopoverRootProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
  const id = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const anchoredRef = React.useRef(false);
  const hover = useHoverIntent(openOn === "hover", isOpen, setOpen, triggerRef);

  const value = React.useMemo(
    () => ({
      isOpen,
      setOpen,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
      triggerRef,
      closeOnOutsideClick,
      closeOnEscape,
      openOnArrow,
      anchoredRef,
      hover,
    }),
    [isOpen, setOpen, id, closeOnOutsideClick, closeOnEscape, openOnArrow, hover],
  );

  return <PopoverProvider value={value}>{children}</PopoverProvider>;
}
PopoverRoot.displayName = "Popover.Root";

export type PopoverTriggerProps = SlotPartProps;

/**
 * Wraps the element that opens the panel (usually a Button): it receives the ref, the ARIA and the
 * click. Props a wrapping trigger adds (`Tooltip.Trigger`) pass on to the child.
 */
function PopoverTrigger(props: PopoverTriggerProps) {
  const { isOpen, setOpen, triggerId, contentId, triggerRef, openOnArrow, hover } =
    usePopoverContext("Popover.Trigger");
  // The child's own id wins (a field label's htmlFor points at it).
  return (
    <FloatingTrigger
      {...props}
      triggerProps={{
        ref: triggerRef,
        id: triggerId,
        "aria-haspopup": "dialog",
        "aria-controls": isOpen ? contentId : undefined,
        ...floatingTriggerProps({ open: isOpen, setOpen, openOnArrow }),
        ...(hover ? hoverTriggerProps(hover, isOpen) : null),
      }}
    />
  );
}

/**
 * The trigger of a hover panel: hover and keyboard focus open it after the delay, a press opens
 * it at once, and Tab from the open trigger moves into the panel — the panel follows its trigger in
 * the Tab order although it is portaled. Focus coming back from the panel does not reopen it.
 */
function hoverTriggerProps(hover: HoverIntent, isOpen: boolean) {
  const fromPanel = (node: EventTarget | null) =>
    node instanceof Node && hover.panel()?.contains(node) === true;
  return {
    onClick: hover.press,
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      // Touch has no hover: a tap is the press that opens it.
      if (event.pointerType !== "touch") hover.enter();
    },
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "touch") hover.leave();
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      if (!fromPanel(event.relatedTarget) && focusFromKeyboard(event.currentTarget)) hover.focus();
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => hover.blur(event.relatedTarget),
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      const panel = hover.panel();
      if (event.key !== "Tab" || event.shiftKey || !isOpen || !panel) return;
      const first = getFocusable(panel)[0];
      if (!first) return;
      event.preventDefault();
      first.focus();
    },
  };
}
PopoverTrigger.displayName = "Popover.Trigger";

export type PopoverAnchorProps = SlotPartProps;

/**
 * An anchor that is not a trigger: positions the panel against an element (a whole toolbar) and keeps
 * presses on it from closing the panel, but adds no click handler and no ARIA. Open state is driven
 * by `Popover.Root open`, and focus stays where it is when it opens (a search field in the anchor
 * keeps typing) unless `Popover.Content initialFocus` asks for it. Use it instead of
 * `Popover.Trigger`, not with it.
 */
function PopoverAnchor({ children }: PopoverAnchorProps) {
  const { triggerRef, anchoredRef } = usePopoverContext("Popover.Anchor");
  anchoredRef.current = true;
  return <Slot ref={triggerRef}>{children}</Slot>;
}
PopoverAnchor.displayName = "Popover.Anchor";

export type PopoverCloseProps = SlotPartProps;

/**
 * Closes the panel on click (focus returns to the trigger), unless the child's own handler calls
 * `preventDefault()`.
 */
function PopoverClose({ children }: PopoverCloseProps) {
  const { setOpen } = usePopoverContext("Popover.Close");
  return <Slot onClick={() => setOpen(false)}>{children}</Slot>;
}
PopoverClose.displayName = "Popover.Close";

export type PopoverContentProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  side?: PositionSide;
  align?: PositionAlign;
  size?: ControlSize;
  width?: FloatingWidth;
  trapFocus?: boolean;
  initialFocus?: boolean;
  flush?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function PopoverContent({
  side = DEFAULT_SIDE,
  align = DEFAULT_ALIGN,
  size = OVERLAY_CONTENT_SIZE,
  width = "auto",
  trapFocus = false,
  initialFocus,
  flush = false,
  className,
  children,
  ...rest
}: PopoverContentProps) {
  const {
    isOpen,
    setOpen,
    triggerRef,
    contentId,
    closeOnOutsideClick,
    closeOnEscape,
    anchoredRef,
    hover,
  } = usePopoverContext("Popover.Content");

  // Overlay contract (foundation §8): focus moves into the panel on open (not with an Anchor) and
  // returns to the trigger on Escape, Tab out and Popover.Close; an outside press only closes it.
  const floating = useFloatingLayer({
    open: isOpen,
    onOpenChange: setOpen,
    triggerRef,
    side,
    align,
    matchAnchorWidth: width === "trigger" || width === "min-trigger",
    closeOnEscape,
    closeOnOutsideClick,
    // A hover panel leaves focus on its trigger: Tab moves in.
    focusOnOpen: initialFocus ?? (!anchoredRef.current && !hover),
    trap: trapFocus,
    tabExit: "edges",
    // A panel driven by typing in its anchor stays next to the field; a hover panel stays next
    // to its trigger, where the pointer travels into it.
    sheet: !anchoredRef.current && !hover,
  });
  React.useLayoutEffect(() => {
    hover?.bindPanel(floating.contentRef);
  }, [hover, floating.contentRef]);

  const [titleId, setTitleId] = React.useState<string | null>(null);
  const [descriptionId, setDescriptionId] = React.useState<string | null>(null);
  const fallbackId = `${contentId}-title`;
  const fallbackDescriptionId = `${contentId}-description`;
  const slots = React.useMemo(
    () => ({ fallbackId, fallbackDescriptionId, setTitleId, setDescriptionId }),
    [fallbackId, fallbackDescriptionId],
  );
  const anchorName = useAnchorName(isOpen, titleId !== null, triggerRef);

  return (
    <FloatingPanel
      {...rest}
      floating={floating}
      size={size}
      width={width}
      scroll
      id={contentId}
      role="dialog"
      aria-modal={false}
      {...anchorName}
      aria-labelledby={titleId ?? anchorName["aria-labelledby"]}
      aria-describedby={descriptionId ?? undefined}
      tabIndex={-1}
      data-flush={flush || undefined}
      className={cx(fieldTierClass, styles.content, className)}
      {...(hover ? hoverPanelProps(hover, triggerRef, rest) : null)}
    >
      <PopoverSlotsContext.Provider value={slots}>{children}</PopoverSlotsContext.Provider>
    </FloatingPanel>
  );
}
PopoverContent.displayName = "Popover.Content";

/**
 * The panel of a hover panel: the pointer over it keeps it open, focus leaving both it and the
 * trigger closes it, and Shift+Tab from its first stop goes back to the trigger with the panel
 * still open (the trigger is the stop before it).
 */
function hoverPanelProps(
  hover: HoverIntent,
  triggerRef: React.RefObject<HTMLElement | null>,
  own: React.HTMLAttributes<HTMLDivElement>,
) {
  return {
    onPointerEnter: (event: React.PointerEvent<HTMLDivElement>) => {
      own.onPointerEnter?.(event);
      if (event.pointerType !== "touch") hover.enter();
    },
    onPointerLeave: (event: React.PointerEvent<HTMLDivElement>) => {
      own.onPointerLeave?.(event);
      if (event.pointerType !== "touch") hover.leave();
    },
    onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
      own.onBlur?.(event);
      hover.blur(event.relatedTarget);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      own.onKeyDown?.(event);
      if (event.defaultPrevented || event.key !== "Tab" || !event.shiftKey) return;
      const first = getFocusable(event.currentTarget)[0];
      if (document.activeElement !== first && document.activeElement !== event.currentTarget)
        return;
      event.preventDefault();
      triggerRef.current?.focus();
    },
  };
}

// ─── Header / Title / Description / Actions ─────────────────────────────────

type PopoverSlots = {
  fallbackId: string;
  fallbackDescriptionId: string;
  setTitleId: (id: string | null) => void;
  setDescriptionId: (id: string | null) => void;
};

const PopoverSlotsContext = React.createContext<PopoverSlots | null>(null);

/**
 * Registers a Title / Description with the id it renders — its own `id`, else one of the panel —
 * so the dialog is named / described by exactly that element.
 */
function useSlotId(id: string | undefined, kind: "title" | "description"): string | undefined {
  const slots = React.useContext(PopoverSlotsContext);
  const resolved = id ?? (kind === "title" ? slots?.fallbackId : slots?.fallbackDescriptionId);
  const register = kind === "title" ? slots?.setTitleId : slots?.setDescriptionId;
  React.useLayoutEffect(() => {
    if (!register || !resolved) return;
    register(resolved);
    return () => register(null);
  }, [register, resolved]);
  return resolved;
}

export type PopoverHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Title + description with a tight 4px step. */
function PopoverHeader({ className, ...rest }: PopoverHeaderProps) {
  return <div className={cx(styles.header, className)} {...rest} />;
}
PopoverHeader.displayName = "Popover.Header";

export type PopoverTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

/** Heading of the panel; names the dialog (`aria-labelledby`). */
function PopoverTitle({ className, id, ...rest }: PopoverTitleProps) {
  const resolvedId = useSlotId(id, "title");
  return <h2 id={resolvedId} className={cx(styles.title, className)} {...rest} />;
}
PopoverTitle.displayName = "Popover.Title";

export type PopoverDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

/** Secondary text of the panel; describes the dialog (`aria-describedby`). */
function PopoverDescription({ className, id, ...rest }: PopoverDescriptionProps) {
  const resolvedId = useSlotId(id, "description");
  return <p id={resolvedId} className={cx(styles.description, className)} {...rest} />;
}
PopoverDescription.displayName = "Popover.Description";

export type PopoverActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Buttons at the bottom of the panel: at the end, `gap: 8`; stacked full width in a bottom sheet. */
function PopoverActions({ className, ...rest }: PopoverActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}
PopoverActions.displayName = "Popover.Actions";

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Actions: PopoverActions,
  Close: PopoverClose,
};

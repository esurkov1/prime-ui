import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import type { PositionAlign, PositionSide } from "@/hooks/usePosition";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { FloatingPanel, FloatingTrigger } from "@/internal/overlay/FloatingPanel";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { Slot } from "@/internal/slot";
import type { ControlSize } from "@/internal/states";

import styles from "./Popover.module.css";

type PopoverContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
  /** Set by `Popover.Anchor`: focus stays in the anchor (a field driving the panel) on open. */
  anchoredRef: React.RefObject<boolean>;
};

const [PopoverProvider, usePopoverContext] = createComponentContext<PopoverContextValue>("Popover");

export type PopoverRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** A pointerdown outside the panel and its trigger closes it. Default `true`. */
  closeOnOutsideClick?: boolean;
  /** Escape closes the panel. Default `true`. */
  closeOnEscape?: boolean;
  children: React.ReactNode;
};

function PopoverRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  children,
}: PopoverRootProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const anchoredRef = React.useRef(false);

  const value = React.useMemo(
    () => ({
      isOpen,
      setOpen,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
      triggerRef,
      closeOnOutsideClick,
      closeOnEscape,
      anchoredRef,
    }),
    [isOpen, setOpen, id, closeOnOutsideClick, closeOnEscape],
  );

  return <PopoverProvider value={value}>{children}</PopoverProvider>;
}
PopoverRoot.displayName = "Popover.Root";

export type PopoverTriggerProps = {
  /** The element that opens the panel (usually a Button); it receives ref, ARIA and the click handler. */
  children: React.ReactElement;
  ref?: React.Ref<HTMLElement>;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

/** Other props (handlers, ARIA, `ref`) are forwarded to the child, e.g. from a wrapping `Tooltip.Trigger`. */
function PopoverTrigger({ children, ...forwarded }: PopoverTriggerProps) {
  const { isOpen, setOpen, triggerId, contentId, triggerRef } = usePopoverContext();
  // The child's own id wins (a field label's htmlFor points at it).
  return (
    <FloatingTrigger
      {...forwarded}
      triggerProps={{
        ref: triggerRef,
        id: triggerId,
        "aria-expanded": isOpen,
        "aria-haspopup": "dialog",
        "aria-controls": contentId,
        "data-state": isOpen ? "open" : "closed",
        onClick: () => setOpen((value) => !value),
      }}
    >
      {children}
    </FloatingTrigger>
  );
}
PopoverTrigger.displayName = "Popover.Trigger";

export type PopoverAnchorProps = {
  /** The element the panel is positioned against and that does not count as "outside" for dismissal. */
  children: React.ReactElement;
};

/**
 * An anchor that is not a trigger: positions the panel against an element (a whole toolbar) and keeps
 * presses on it from closing the panel, but adds no click handler and no ARIA. Open state is driven
 * by `Popover.Root open`, and focus stays where it is when it opens (a search field in the anchor
 * keeps typing). Use it instead of `Popover.Trigger`, not with it.
 */
function PopoverAnchor({ children }: PopoverAnchorProps) {
  const { triggerRef, anchoredRef } = usePopoverContext();
  anchoredRef.current = true;
  return <Slot ref={triggerRef}>{children}</Slot>;
}
PopoverAnchor.displayName = "Popover.Anchor";

export type PopoverCloseProps = {
  /** One element (usually a Button inside the panel); a click closes the panel. */
  children: React.ReactElement;
};

/**
 * Closes the panel on click (focus returns to the trigger), unless the child's own handler calls
 * `preventDefault()`.
 */
function PopoverClose({ children }: PopoverCloseProps) {
  const { setOpen } = usePopoverContext();
  return <Slot onClick={() => setOpen(false)}>{children}</Slot>;
}
PopoverClose.displayName = "Popover.Close";

export type PopoverContentProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  side?: PositionSide;
  align?: PositionAlign;
  /** Tier of the text, padding and the controls inside. */
  size?: ControlSize;
  /** The panel is exactly as wide as the trigger (text wraps). */
  matchTriggerWidth?: boolean;
  /** Tab cycles inside the panel (forms). Without it Tab past the edges leaves to the trigger and closes. */
  trapFocus?: boolean;
  /**
   * No inner padding and no gap: rows reach the panel edges (lists with full-width dividers, filter
   * panels). The content lays out its own spacing and uses inset focus rings.
   */
  flush?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function PopoverContent({
  side = "bottom",
  align = "start",
  size = "m",
  matchTriggerWidth = false,
  trapFocus = false,
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
    triggerId,
    closeOnOutsideClick,
    closeOnEscape,
    anchoredRef,
  } = usePopoverContext();

  // Overlay contract (foundation §8): focus moves into the panel on open (not with an Anchor) and
  // returns to the trigger on Escape, Tab out and Popover.Close; an outside press only closes it.
  const floating = useFloatingLayer({
    open: isOpen,
    onOpenChange: setOpen,
    triggerRef,
    side,
    align,
    matchAnchorWidth: matchTriggerWidth,
    closeOnEscape,
    closeOnOutsideClick,
    focusOnOpen: !anchoredRef.current,
    trap: trapFocus,
    tabExit: "edges",
    // A panel driven by typing in its anchor stays next to the field.
    sheet: !anchoredRef.current,
  });

  const titleId = `${contentId}-title`;
  const descriptionId = `${contentId}-description`;
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const slots = React.useMemo(
    () => ({ titleId, descriptionId, setHasTitle, setHasDescription }),
    [titleId, descriptionId],
  );

  return (
    <FloatingPanel
      {...rest}
      floating={floating}
      size={size}
      scroll
      id={contentId}
      role="dialog"
      aria-modal={false}
      aria-labelledby={hasTitle ? titleId : triggerRef.current?.id || triggerId}
      aria-describedby={hasDescription ? descriptionId : undefined}
      tabIndex={-1}
      data-match-trigger-width={matchTriggerWidth || undefined}
      data-flush={flush || undefined}
      className={cx(styles.content, className)}
    >
      <PopoverSlotsContext.Provider value={slots}>{children}</PopoverSlotsContext.Provider>
    </FloatingPanel>
  );
}
PopoverContent.displayName = "Popover.Content";

// ─── Header / Title / Description / Actions ─────────────────────────────────

type PopoverSlots = {
  titleId: string;
  descriptionId: string;
  setHasTitle: (value: boolean) => void;
  setHasDescription: (value: boolean) => void;
};

const PopoverSlotsContext = React.createContext<PopoverSlots | null>(null);

/** Registers a Title / Description so the dialog is named / described by it. */
function useSlotId(id: string | undefined, kind: "title" | "description") {
  const slots = React.useContext(PopoverSlotsContext);
  const register = kind === "title" ? slots?.setHasTitle : slots?.setHasDescription;
  React.useLayoutEffect(() => {
    if (!register || id) return;
    register(true);
    return () => register(false);
  }, [register, id]);
  return id ?? (kind === "title" ? slots?.titleId : slots?.descriptionId);
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

/** Buttons at the bottom of the panel: at the end, `gap: 8`; stacked full width on a narrow screen. */
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

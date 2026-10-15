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
import { useAnchorName } from "@/internal/overlay/useAnchorName";
import { floatingTriggerProps, useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { useOpenState } from "@/internal/overlay/useOpenState";
import { Slot, type SlotPartProps } from "@/internal/slot";
import { type ControlSize, OVERLAY_CONTENT_SIZE } from "@/internal/states";

import styles from "./Popover.module.css";

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
};

const [PopoverProvider, usePopoverContext] = createComponentContext<PopoverContextValue>("Popover");

export type PopoverRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  openOnArrow?: boolean;
  children: React.ReactNode;
};

function PopoverRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  openOnArrow = false,
  children,
}: PopoverRootProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
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
      openOnArrow,
      anchoredRef,
    }),
    [isOpen, setOpen, id, closeOnOutsideClick, closeOnEscape, openOnArrow],
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
  const { isOpen, setOpen, triggerId, contentId, triggerRef, openOnArrow } =
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
      }}
    />
  );
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
    focusOnOpen: initialFocus ?? !anchoredRef.current,
    trap: trapFocus,
    tabExit: "edges",
    // A panel driven by typing in its anchor stays next to the field.
    sheet: !anchoredRef.current,
  });

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
    >
      <PopoverSlotsContext.Provider value={slots}>{children}</PopoverSlotsContext.Provider>
    </FloatingPanel>
  );
}
PopoverContent.displayName = "Popover.Content";

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

import * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { type PositionAlign, type PositionSide, usePosition } from "@/hooks/usePosition";
import { usePresence } from "@/hooks/usePresence";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import surface from "@/internal/floatingSurface.module.css";
import { mergeRefs } from "@/internal/mergeRefs";
import { DropdownLayerContext, useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import { Slot } from "@/internal/slot";
import type { ControlSize } from "@/internal/states";

import styles from "./Popover.module.css";

type PopoverContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  /** Closes the panel; focus goes back to the trigger when it was inside the panel. */
  dismiss: () => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
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
  const contentRef = React.useRef<HTMLElement | null>(null);

  const dismiss = React.useCallback(() => {
    const active = document.activeElement;
    if (!active || active === document.body || contentRef.current?.contains(active)) {
      triggerRef.current?.focus({ preventScroll: true });
    }
    setOpen(false);
  }, [setOpen]);

  const value = React.useMemo(
    () => ({
      isOpen,
      setOpen,
      dismiss,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
      triggerRef,
      contentRef,
      closeOnOutsideClick,
      closeOnEscape,
    }),
    [isOpen, setOpen, dismiss, id, closeOnOutsideClick, closeOnEscape],
  );

  return <PopoverProvider value={value}>{children}</PopoverProvider>;
}
PopoverRoot.displayName = "Popover.Root";

export type PopoverTriggerProps = {
  /** The element that opens the panel (usually a Button); it receives ref, ARIA and the click handler. */
  children: React.ReactElement;
};

function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { isOpen, setOpen, triggerId, contentId, triggerRef } = usePopoverContext();
  // The child's own id wins (a field label's htmlFor points at it).
  return (
    <Slot
      ref={triggerRef}
      id={triggerId}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      aria-controls={contentId}
      data-state={isOpen ? "open" : "closed"}
      onClick={() => setOpen((value) => !value)}
    >
      {children}
    </Slot>
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
 * by `Popover.Root open`. Use it instead of `Popover.Trigger`, not with it.
 */
function PopoverAnchor({ children }: PopoverAnchorProps) {
  const { triggerRef } = usePopoverContext();
  return <Slot ref={triggerRef}>{children}</Slot>;
}
PopoverAnchor.displayName = "Popover.Anchor";

export type PopoverCloseProps = {
  /** One element (usually a Button inside the panel); a click closes the panel. */
  children: React.ReactElement;
};

/** Closes the panel on click, unless the child's own handler calls `preventDefault()`. */
function PopoverClose({ children }: PopoverCloseProps) {
  const { dismiss } = usePopoverContext();
  return (
    <Slot
      onClick={(event: React.MouseEvent) => {
        if (!event.defaultPrevented) dismiss();
      }}
    >
      {children}
    </Slot>
  );
}
PopoverClose.displayName = "Popover.Close";

export type PopoverContentProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  side?: PositionSide;
  align?: PositionAlign;
  /** Tier of the text, padding and the controls inside. */
  size?: ControlSize;
  /** The panel is exactly as wide as the trigger (text wraps). */
  matchTriggerWidth?: boolean;
  /** Keep Tab inside the panel (forms); focus returns to the trigger on close. */
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
  ref,
  ...rest
}: PopoverContentProps) {
  const {
    isOpen,
    setOpen,
    dismiss,
    triggerRef,
    contentRef,
    contentId,
    triggerId,
    closeOnOutsideClick,
    closeOnEscape,
  } = usePopoverContext();
  const overlayPortalLayer = useOverlayPortalLayer();
  const aboveDropdown = React.useContext(DropdownLayerContext);
  const presence = usePresence(isOpen, { exitDuration: "fast" });

  // Keeps its position while the exit animation plays.
  const position = usePosition(presence.mounted, triggerRef, contentRef, {
    side,
    align,
    matchAnchorWidth: matchTriggerWidth,
  });
  const trapRef = useFocusTrap<HTMLDivElement>({
    enabled: isOpen && trapFocus,
    restoreFocus: true,
  });
  const mergedRef = React.useMemo(
    () => mergeRefs<HTMLDivElement>(position.attachLayer, trapRef, ref),
    [position.attachLayer, trapRef, ref],
  );

  // Overlay contract (foundation §8): Escape returns focus to the trigger; an outside press only
  // closes the panel and focus follows the pointer.
  useEscapeKey({ enabled: isOpen && closeOnEscape, onEscape: dismiss });
  useOutsideClick({
    refs: [triggerRef, contentRef],
    enabled: isOpen,
    onOutsideClick: () => {
      if (closeOnOutsideClick) setOpen(false);
    },
  });

  const titleId = `${contentId}-title`;
  const descriptionId = `${contentId}-description`;
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const slots = React.useMemo(
    () => ({ titleId, descriptionId, setHasTitle, setHasDescription }),
    [titleId, descriptionId],
  );

  if (!presence.mounted) return null;

  return (
    <Portal>
      <ControlSizeProvider value={size}>
        <PopoverSlotsContext.Provider value={slots}>
          <ScrollContainer
            {...rest}
            ref={mergedRef}
            id={contentId}
            role="dialog"
            aria-modal={false}
            aria-labelledby={hasTitle ? titleId : triggerRef.current?.id || triggerId}
            aria-describedby={hasDescription ? descriptionId : undefined}
            data-react-aria-top-layer="true"
            data-overlay-portal-layer={overlayPortalLayer}
            data-overlay-stack={aboveDropdown ? "above-dropdown" : undefined}
            data-side={position.side}
            data-state={presence.state}
            data-size={size}
            data-match-trigger-width={matchTriggerWidth || undefined}
            data-flush={flush || undefined}
            className={cx(
              surface.surface,
              surface.popoverLayer,
              styles.content,
              overlayMotion.floating,
              className,
            )}
            onAnimationEnd={presence.onExitEnd}
          >
            {children}
          </ScrollContainer>
        </PopoverSlotsContext.Provider>
      </ControlSizeProvider>
    </Portal>
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

export type PopoverHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/** Title + description with a tight 4px step. */
function PopoverHeader({ className, ...rest }: PopoverHeaderProps) {
  return <div className={cx(styles.header, className)} {...rest} />;
}
PopoverHeader.displayName = "Popover.Header";

export type PopoverTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

/** Heading of the panel; names the dialog (`aria-labelledby`). */
function PopoverTitle({ className, id, ...rest }: PopoverTitleProps) {
  const resolvedId = useSlotId(id, "title");
  return <h2 id={resolvedId} className={cx(styles.title, className)} {...rest} />;
}
PopoverTitle.displayName = "Popover.Title";

export type PopoverDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Secondary text of the panel; describes the dialog (`aria-describedby`). */
function PopoverDescription({ className, id, ...rest }: PopoverDescriptionProps) {
  const resolvedId = useSlotId(id, "description");
  return <p id={resolvedId} className={cx(styles.description, className)} {...rest} />;
}
PopoverDescription.displayName = "Popover.Description";

export type PopoverActionsProps = React.HTMLAttributes<HTMLDivElement>;

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

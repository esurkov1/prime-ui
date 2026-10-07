import * as React from "react";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import type { PositionAlign, PositionSide } from "@/hooks/usePosition";
import { usePresence } from "@/hooks/usePresence";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { mergeRefs } from "@/internal/mergeRefs";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import type { ControlSize } from "@/internal/states";

import styles from "./Popover.module.css";
import { usePopoverPosition } from "./usePopoverPosition";

type Ctx = {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  closeOnOutsideClick: boolean;
};

const [PopoverProvider, usePopoverContext] = createComponentContext<Ctx>("Popover");

export type PopoverRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** A pointerdown outside the panel and its trigger closes it. Default `true`. */
  closeOnOutsideClick?: boolean;
  children: React.ReactNode;
};

function PopoverRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  children,
}: PopoverRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = React.useId();
  const triggerId = `${id}-trigger`;
  const contentId = `${id}-content`;
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);
  const onToggle = React.useCallback(() => setIsOpen((v) => !v), [setIsOpen]);

  const value = React.useMemo(
    () => ({ isOpen, onClose, onToggle, triggerId, contentId, triggerRef, closeOnOutsideClick }),
    [isOpen, onClose, onToggle, triggerId, contentId, closeOnOutsideClick],
  );

  return <PopoverProvider value={value}>{children}</PopoverProvider>;
}
PopoverRoot.displayName = "PopoverRoot";

export type PopoverTriggerProps = {
  /** The element that opens the panel (usually a Button); it receives ref, ARIA and the click handler. */
  children: React.ReactElement;
};

function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { isOpen, onToggle, triggerId, contentId, triggerRef } = usePopoverContext();
  const toggleRef = React.useRef(onToggle);
  toggleRef.current = onToggle;

  const setNode = React.useCallback(
    (el: HTMLElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = el;
    },
    [triggerRef],
  );

  // biome-ignore lint/suspicious/noExplicitAny: cloneElement на произвольный элемент
  const child = children as React.ReactElement<any>;
  const childRef =
    (child.props as { ref?: React.Ref<HTMLElement | null> }).ref ??
    (child as unknown as { ref?: React.Ref<HTMLElement | null> }).ref;
  const mergedRef = React.useMemo(() => mergeRefs(childRef, setNode), [childRef, setNode]);
  const userClick = child.props?.onClick as React.MouseEventHandler<HTMLElement> | undefined;

  return React.cloneElement(child, {
    ref: mergedRef,
    // Keep the child's own id (a field label's htmlFor points at it); fall back to the generated one.
    id: (child.props?.id as string | undefined) ?? triggerId,
    "aria-expanded": isOpen,
    "data-state": isOpen ? "open" : "closed",
    "aria-haspopup": "dialog",
    "aria-controls": contentId,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      userClick?.(e);
      toggleRef.current();
    },
  });
}
PopoverTrigger.displayName = "PopoverTrigger";

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
  const setNode = React.useCallback(
    (el: HTMLElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = el;
    },
    [triggerRef],
  );
  // biome-ignore lint/suspicious/noExplicitAny: cloneElement на произвольный элемент
  const child = children as React.ReactElement<any>;
  const childRef =
    (child.props as { ref?: React.Ref<HTMLElement | null> }).ref ??
    (child as unknown as { ref?: React.Ref<HTMLElement | null> }).ref;
  const mergedRef = React.useMemo(() => mergeRefs(childRef, setNode), [childRef, setNode]);
  return React.cloneElement(child, { ref: mergedRef });
}
PopoverAnchor.displayName = "PopoverAnchor";

export type PopoverInsetPadding = "none" | "x1" | "x2" | "x3";
export type PopoverInsetGap = "none" | "pad" | "x2" | "x3" | "x4";

export type PopoverContentProps = {
  align?: PositionAlign;
  side?: PositionSide;
  sameMinWidthAsTrigger?: boolean;
  size?: ControlSize;
  trapFocus?: boolean;
  /** Дополнение к внутренним полям как у Dropdown (`padding` = `--dd-pad` + inset). */
  insetPadding?: PopoverInsetPadding;
  /** Вертикальный зазор между прямыми дочерними блоками; `pad` = как у внутренних полей (`--dd-pad`). */
  insetGap?: PopoverInsetGap;
  /**
   * Поднять панель над выпадающим списком того же слоя (dropdown 1200 > popover 1000).
   * Используйте, если триггер внутри Select/TagSelect listbox или другого dropdown.
   */
  stackAboveDropdown?: boolean;
  /**
   * No inner padding and no gap: rows reach the panel edges (lists with full-width dividers, filter
   * panels). The content lays out its own spacing and uses inset focus rings.
   */
  flush?: boolean;
  children: React.ReactNode;
  className?: string;
};

function PopoverContent({
  align = "start",
  side = "bottom",
  sameMinWidthAsTrigger = false,
  size = "m",
  trapFocus = false,
  insetPadding = "none",
  insetGap = "pad",
  stackAboveDropdown = false,
  flush = false,
  children,
  className,
}: PopoverContentProps) {
  const { isOpen, onClose, triggerRef, contentId, triggerId, closeOnOutsideClick } =
    usePopoverContext();
  const overlayPortalLayer = useOverlayPortalLayer();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const presence = usePresence(isOpen, { exitDuration: "fast" });

  const layout = usePopoverPosition({
    // Keeps its position while the exit animation plays.
    open: presence.mounted,
    triggerRef,
    contentRef,
    side,
    align,
    sameMinWidthAsTrigger,
  });

  const trapRef = useFocusTrap<HTMLDivElement>({
    enabled: isOpen && trapFocus,
    restoreFocus: true,
  });
  const ref = React.useMemo(() => mergeRefs(contentRef, trapRef), [trapRef]);

  // Overlay contract: Escape closes the panel and returns focus to the trigger when it was inside
  // the panel. An outside press only closes it: focus follows the pointer (foundation §8).
  const dismiss = React.useCallback(() => {
    const active = document.activeElement;
    if (!active || active === document.body || contentRef.current?.contains(active)) {
      triggerRef.current?.focus({ preventScroll: true });
    }
    onClose();
  }, [onClose, triggerRef]);
  useEscapeKey({ enabled: isOpen, onEscape: dismiss });
  useOutsideClick({
    refs: [triggerRef, contentRef],
    enabled: isOpen,
    onOutsideClick: () => {
      if (closeOnOutsideClick) onClose();
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
            ref={ref}
            id={contentId}
            role="dialog"
            aria-modal={false}
            aria-labelledby={hasTitle ? titleId : triggerRef.current?.id || triggerId}
            aria-describedby={hasDescription ? descriptionId : undefined}
            data-react-aria-top-layer="true"
            data-overlay-portal-layer={overlayPortalLayer}
            data-overlay-stack={stackAboveDropdown ? "above-dropdown" : undefined}
            data-side={layout?.resolvedSide ?? side}
            data-state={presence.state}
            data-size={size}
            data-inset-padding={insetPadding}
            data-inset-gap={insetGap}
            data-flush={flush || undefined}
            className={cx(styles.popoverScroll, overlayMotion.floating, className)}
            style={layout?.style}
            onAnimationEnd={presence.onExitEnd}
          >
            {children}
          </ScrollContainer>
        </PopoverSlotsContext.Provider>
      </ControlSizeProvider>
    </Portal>
  );
}
PopoverContent.displayName = "PopoverContent";

// ─── Header / Title / Description / Actions ─────────────────────────────────

type PopoverSlots = {
  titleId: string;
  descriptionId: string;
  setHasTitle: (v: boolean) => void;
  setHasDescription: (v: boolean) => void;
};

const PopoverSlotsContext = React.createContext<PopoverSlots | null>(null);

export type PopoverHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/** Заголовок + описание с плотным шагом (4px) внутри панели. */
function PopoverHeader({ className, ...rest }: PopoverHeaderProps) {
  return <div className={cx(styles.header, className)} {...rest} />;
}
PopoverHeader.displayName = "PopoverHeader";

export type PopoverTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

/** Заголовок панели; становится доступным именем диалога (`aria-labelledby`). */
function PopoverTitle({ className, id, ...rest }: PopoverTitleProps) {
  const slots = React.useContext(PopoverSlotsContext);
  const setHasTitle = slots?.setHasTitle;
  React.useLayoutEffect(() => {
    if (!setHasTitle || id) return;
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle, id]);
  return <h2 id={id ?? slots?.titleId} className={cx(styles.title, className)} {...rest} />;
}
PopoverTitle.displayName = "PopoverTitle";

export type PopoverDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

function PopoverDescription({ className, id, ...rest }: PopoverDescriptionProps) {
  const slots = React.useContext(PopoverSlotsContext);
  const setHasDescription = slots?.setHasDescription;
  React.useLayoutEffect(() => {
    if (!setHasDescription || id) return;
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription, id]);
  return (
    <p id={id ?? slots?.descriptionId} className={cx(styles.description, className)} {...rest} />
  );
}
PopoverDescription.displayName = "PopoverDescription";

export type PopoverActionsProps = React.HTMLAttributes<HTMLDivElement>;

/** Кнопки внизу панели: справа, `gap: 8`; на узкой панели — в колонку на всю ширину. */
function PopoverActions({ className, ...rest }: PopoverActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}
PopoverActions.displayName = "PopoverActions";

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Actions: PopoverActions,
};

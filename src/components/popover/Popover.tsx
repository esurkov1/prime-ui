import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { isPortaledSelectListboxOwnedByContainer, useOutsideClick } from "@/hooks/useOutsideClick";
import type { PositionAlign, PositionSide } from "@/hooks/usePosition";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { mergeRefs } from "@/internal/mergeRefs";
import { Portal } from "@/internal/Portal";
import type { DropdownSize } from "@/internal/states";

import styles from "./Popover.module.css";
import { usePopoverPosition } from "./usePopoverPosition";

export type PopoverSize = DropdownSize;

type Ctx = {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const [PopoverProvider, usePopoverContext] = createComponentContext<Ctx>("Popover");

export type PopoverRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

function PopoverRoot({ open, defaultOpen = false, onOpenChange, children }: PopoverRootProps) {
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
    () => ({ isOpen, onClose, onToggle, triggerId, contentId, triggerRef }),
    [isOpen, onClose, onToggle, triggerId, contentId],
  );

  return <PopoverProvider value={value}>{children}</PopoverProvider>;
}
PopoverRoot.displayName = "PopoverRoot";

export type PopoverTriggerProps = {
  children: React.ReactElement;
  asChild?: boolean;
};

function PopoverTrigger({ children, asChild: _asChild = true }: PopoverTriggerProps) {
  void _asChild;
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
    id: triggerId,
    "aria-expanded": isOpen,
    "aria-haspopup": "dialog",
    "aria-controls": contentId,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      userClick?.(e);
      toggleRef.current();
    },
  });
}
PopoverTrigger.displayName = "PopoverTrigger";

export type PopoverContentProps = {
  align?: PositionAlign;
  side?: PositionSide;
  sameMinWidthAsTrigger?: boolean;
  size?: PopoverSize;
  trapFocus?: boolean;
  children: React.ReactNode;
  className?: string;
};

function PopoverContent({
  align = "start",
  side = "bottom",
  sameMinWidthAsTrigger = false,
  size = "m",
  trapFocus = false,
  children,
  className,
}: PopoverContentProps) {
  const { isOpen, onClose, triggerRef, contentId, triggerId } = usePopoverContext();
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const layout = usePopoverPosition({
    open: isOpen,
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

  useEscapeKey({ enabled: isOpen, onEscape: onClose });
  useOutsideClick({
    refs: [triggerRef, contentRef],
    enabled: isOpen,
    onOutsideClick: onClose,
    shouldSuppressOutsideClick: (target) =>
      isPortaledSelectListboxOwnedByContainer(target, contentRef.current),
  });

  if (!isOpen) return null;

  return (
    <Portal>
      <ControlSizeProvider value={size}>
        <div
          ref={ref}
          id={contentId}
          role="dialog"
          aria-modal={false}
          aria-labelledby={triggerId}
          data-react-aria-top-layer="true"
          data-side={layout?.resolvedSide ?? side}
          data-size={size}
          className={cx(styles.content, className)}
          style={layout?.style}
        >
          {children}
        </div>
      </ControlSizeProvider>
    </Portal>
  );
}
PopoverContent.displayName = "PopoverContent";

export type PopoverInsetPadding = "none" | "x1" | "x2" | "x3";
export type PopoverInsetGap = "none" | "x2" | "x3" | "x4";

export type PopoverInsetProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  /** Доп. отступы от внутреннего края `Popover.Content`. По умолчанию `x2`. */
  padding?: PopoverInsetPadding;
  /** Вертикальный зазор между прямыми дочерними блоками. По умолчанию `x3`. */
  gap?: PopoverInsetGap;
};

function PopoverInset({
  children,
  className,
  padding = "x2",
  gap = "x3",
  ...rest
}: PopoverInsetProps) {
  return (
    <div
      className={cx(styles.inset, className)}
      data-inset-gap={gap}
      data-inset-padding={padding}
      {...rest}
    >
      {children}
    </div>
  );
}
PopoverInset.displayName = "PopoverInset";

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Inset: PopoverInset,
};

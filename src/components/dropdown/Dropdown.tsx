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
import { toDataAttributes } from "@/internal/data-attributes";
import { remToPx } from "@/internal/layoutPxFromPrimitives";
import { mergeRefs } from "@/internal/mergeRefs";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import type { ControlSize, Tone } from "@/internal/states";
import { primitiveTokens } from "../../../tokens/primitives";

import styles from "./Dropdown.module.css";
import { handleMenuNavigationKeyDown } from "./menuKeyboard";
import { useDropdownPosition } from "./useDropdownPosition";

const DropdownContentSizeContext = React.createContext<ControlSize>("m");

function useDropdownContentSize(): ControlSize {
  return React.useContext(DropdownContentSizeContext);
}

/** Иконка пункта = `--prime-control-<tier>-icon` (foundation §6): 14 · 16 · 16 · 20 · 20. */
const DROPDOWN_ICON_BY_SIZE = {
  xs: 14,
  s: 16,
  m: 16,
  l: 20,
  xl: 20,
} as const satisfies Record<ControlSize, keyof typeof primitiveTokens.icon>;

function dropdownItemIconPx(menuSize: ControlSize): number {
  return remToPx(primitiveTokens.icon[DROPDOWN_ICON_BY_SIZE[menuSize]]);
}

type Ctx = {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  triggerId: string;
  menuId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  closeOnOutsideClick: boolean;
};

const [DropdownProvider, useDropdownContext] = createComponentContext<Ctx>("Dropdown");

export type DropdownRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** A pointerdown outside the panel and its trigger closes it. Default `true`. */
  closeOnOutsideClick?: boolean;
  children: React.ReactNode;
};

function DropdownRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  children,
}: DropdownRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = React.useId();
  const triggerId = `${id}-trigger`;
  const menuId = `${id}-menu`;
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);
  const onToggle = React.useCallback(() => setIsOpen((v) => !v), [setIsOpen]);

  const value = React.useMemo(
    () => ({ isOpen, onClose, onToggle, triggerId, menuId, triggerRef, closeOnOutsideClick }),
    [isOpen, onClose, onToggle, triggerId, menuId, closeOnOutsideClick],
  );

  return <DropdownProvider value={value}>{children}</DropdownProvider>;
}
DropdownRoot.displayName = "DropdownRoot";

export type DropdownTriggerProps = {
  /** The element that opens the panel (usually a Button); it receives ref, ARIA and the click handler. */
  children: React.ReactElement;
};

function DropdownTrigger({ children }: DropdownTriggerProps) {
  const { isOpen, onToggle, triggerId, menuId, triggerRef } = useDropdownContext();
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
    "data-state": isOpen ? "open" : "closed",
    "aria-haspopup": "menu",
    "aria-controls": menuId,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      userClick?.(e);
      toggleRef.current();
    },
  });
}
DropdownTrigger.displayName = "DropdownTrigger";

export type DropdownContentProps = {
  align?: PositionAlign;
  side?: PositionSide;
  sameMinWidthAsTrigger?: boolean;
  size?: ControlSize;
  children: React.ReactNode;
  className?: string;
};

function DropdownContent({
  align = "start",
  side = "bottom",
  sameMinWidthAsTrigger = false,
  size = "m",
  children,
  className,
}: DropdownContentProps) {
  const { isOpen, onClose, triggerRef, menuId, triggerId, closeOnOutsideClick } =
    useDropdownContext();
  const overlayPortalLayer = useOverlayPortalLayer();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const presence = usePresence(isOpen, { exitDuration: "fast" });

  const layout = useDropdownPosition({
    // Keeps its position while the exit animation plays.
    open: presence.mounted,
    triggerRef,
    contentRef,
    side,
    align,
    sameMinWidthAsTrigger,
  });

  const trapRef = useFocusTrap<HTMLDivElement>({ enabled: isOpen, restoreFocus: true });
  const ref = React.useMemo(() => mergeRefs(contentRef, trapRef), [trapRef]);

  useEscapeKey({ enabled: isOpen, onEscape: onClose });
  useOutsideClick({
    refs: [triggerRef, contentRef],
    enabled: isOpen,
    onOutsideClick: () => {
      if (closeOnOutsideClick) onClose();
    },
  });

  if (!presence.mounted) return null;

  return (
    <Portal>
      <DropdownContentSizeContext.Provider value={size}>
        <ControlSizeProvider value={size}>
          <ScrollContainer
            ref={ref}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            data-react-aria-top-layer="true"
            data-overlay-portal-layer={overlayPortalLayer}
            data-side={layout?.resolvedSide ?? side}
            data-state={presence.state}
            data-size={size}
            className={cx(styles.content, overlayMotion.floating, className)}
            style={layout?.style}
            onAnimationEnd={presence.onExitEnd}
            onKeyDown={(e) => handleMenuNavigationKeyDown(e, e.currentTarget)}
          >
            {children}
          </ScrollContainer>
        </ControlSizeProvider>
      </DropdownContentSizeContext.Provider>
    </Portal>
  );
}
DropdownContent.displayName = "DropdownContent";

export type DropdownItemProps = {
  onSelect?: () => void;
  disabled?: boolean;
  /** `danger` — destructive action (delete, revoke). Default `neutral`. */
  tone?: Extract<Tone, "neutral" | "danger">;
  children: React.ReactNode;
  className?: string;
};

function DropdownItem({
  onSelect,
  disabled,
  tone = "neutral",
  children,
  className,
}: DropdownItemProps) {
  const { onClose } = useDropdownContext();

  const activate = () => {
    if (disabled) return;
    onSelect?.();
    onClose();
  };

  return (
    <button
      type="button"
      role="menuitem"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cx(styles.item, className)}
      {...toDataAttributes({ tone, disabled: disabled || undefined })}
      onClick={activate}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          activate();
        }
      }}
    >
      {children}
    </button>
  );
}
DropdownItem.displayName = "DropdownItem";

export type DropdownItemIconProps = {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
} & Record<string, unknown>;

const DropdownItemIcon = React.forwardRef<HTMLElement, DropdownItemIconProps>(
  ({ as: As = "span", className, children, "aria-hidden": ariaHidden, ...rest }, ref) => {
    const menuSize = useDropdownContentSize();
    const { size: explicitSize, ...iconRest } = rest as Record<string, unknown> & { size?: number };
    const iconSize = typeof explicitSize === "number" ? explicitSize : dropdownItemIconPx(menuSize);
    const Comp = As as React.ElementType;
    return (
      <Comp
        ref={ref}
        className={cx(styles.itemIcon, className as string | undefined)}
        {...iconRest}
        size={iconSize}
        aria-hidden={ariaHidden ?? true}
      >
        {children}
      </Comp>
    );
  },
);
DropdownItemIcon.displayName = "DropdownItemIcon";

export type DropdownItemShortcutProps = React.HTMLAttributes<HTMLElement>;

/** Сочетание клавиш справа в пункте (стиль Kbd, приглушённый). Только подсказка — не обработчик. */
function DropdownItemShortcut({ className, ...rest }: DropdownItemShortcutProps) {
  return <kbd className={cx(styles.itemShortcut, className)} {...rest} />;
}
DropdownItemShortcut.displayName = "DropdownItemShortcut";

export type DropdownGroupProps = React.HTMLAttributes<HTMLDivElement>;

function DropdownGroup({ className, ...rest }: DropdownGroupProps) {
  // biome-ignore lint/a11y/useSemanticElements: role="group" внутри role="menu"
  return <div role="group" className={cx(styles.group, className)} {...rest} />;
}
DropdownGroup.displayName = "DropdownGroup";

export type DropdownGroupLabelProps = { children: React.ReactNode; className?: string };

function DropdownGroupLabel({ children, className }: DropdownGroupLabelProps) {
  return (
    <div role="presentation" className={cx(styles.groupLabel, className)}>
      {children}
    </div>
  );
}
DropdownGroupLabel.displayName = "DropdownGroupLabel";

export type DropdownSeparatorProps = { className?: string };

function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return <hr className={cx(styles.separator, className)} />;
}
DropdownSeparator.displayName = "DropdownSeparator";

export type DropdownBlockProps = React.HTMLAttributes<HTMLDivElement>;

function DropdownBlock({ className, ...rest }: DropdownBlockProps) {
  return <div className={cx(styles.block, className)} {...rest} />;
}
DropdownBlock.displayName = "DropdownBlock";

export type DropdownHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function DropdownHeader({ className, ...rest }: DropdownHeaderProps) {
  return <div className={cx(styles.header, className)} {...rest} />;
}
DropdownHeader.displayName = "DropdownHeader";

export type DropdownHeaderRowProps = React.HTMLAttributes<HTMLDivElement>;

function DropdownHeaderRow({ className, ...rest }: DropdownHeaderRowProps) {
  return <div className={cx(styles.headerRow, className)} {...rest} />;
}
DropdownHeaderRow.displayName = "DropdownHeaderRow";

export type DropdownHeaderLeadingProps = React.HTMLAttributes<HTMLDivElement>;

function DropdownHeaderLeading({ className, ...rest }: DropdownHeaderLeadingProps) {
  return <div className={cx(styles.headerLeading, className)} {...rest} />;
}
DropdownHeaderLeading.displayName = "DropdownHeaderLeading";

export type DropdownHeaderMainProps = React.HTMLAttributes<HTMLDivElement>;

function DropdownHeaderMain({ className, ...rest }: DropdownHeaderMainProps) {
  return <div className={cx(styles.headerMain, className)} {...rest} />;
}
DropdownHeaderMain.displayName = "DropdownHeaderMain";

export type DropdownHeaderTitleProps = React.HTMLAttributes<HTMLDivElement>;

function DropdownHeaderTitle({ className, ...rest }: DropdownHeaderTitleProps) {
  return <div className={cx(styles.headerTitle, className)} {...rest} />;
}
DropdownHeaderTitle.displayName = "DropdownHeaderTitle";

export type DropdownHeaderDescriptionProps = React.HTMLAttributes<HTMLDivElement> & {
  truncate?: boolean;
};

function DropdownHeaderDescription({
  className,
  truncate,
  ...rest
}: DropdownHeaderDescriptionProps) {
  return (
    <div
      className={cx(
        styles.headerDescription,
        truncate ? styles.headerDescriptionTruncate : undefined,
        className,
      )}
      {...rest}
    />
  );
}
DropdownHeaderDescription.displayName = "DropdownHeaderDescription";

export type DropdownHeaderTrailingProps = React.HTMLAttributes<HTMLDivElement> & {
  alignSelf?: "start" | "center";
};

function DropdownHeaderTrailing({
  className,
  alignSelf = "start",
  ...rest
}: DropdownHeaderTrailingProps) {
  return (
    <div
      data-trailing-align={alignSelf === "center" ? "center" : undefined}
      className={cx(styles.headerTrailing, className)}
      {...rest}
    />
  );
}
DropdownHeaderTrailing.displayName = "DropdownHeaderTrailing";

export const Dropdown = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Block: DropdownBlock,
  Header: DropdownHeader,
  HeaderRow: DropdownHeaderRow,
  HeaderLeading: DropdownHeaderLeading,
  HeaderMain: DropdownHeaderMain,
  HeaderTitle: DropdownHeaderTitle,
  HeaderDescription: DropdownHeaderDescription,
  HeaderTrailing: DropdownHeaderTrailing,
  Item: DropdownItem,
  ItemIcon: DropdownItemIcon,
  ItemShortcut: DropdownItemShortcut,
  Group: DropdownGroup,
  GroupLabel: DropdownGroupLabel,
  Separator: DropdownSeparator,
};

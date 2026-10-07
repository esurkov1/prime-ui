import * as React from "react";

import { Divider } from "@/components/divider/Divider";
import { Kbd } from "@/components/kbd/Kbd";
import { DropdownLayerContext } from "@/components/popover/layer";
import surface from "@/components/popover/surface.module.css";
import { useAnchoredPosition } from "@/components/popover/useAnchoredPosition";
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
import { mergeRefs } from "@/internal/mergeRefs";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import { rovingIndex } from "@/internal/rovingFocus";
import { Slot } from "@/internal/slot";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./Dropdown.module.css";
import menu from "./menu.module.css";

type DropdownContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  triggerId: string;
  menuId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
};

const [DropdownProvider, useDropdownContext] =
  createComponentContext<DropdownContextValue>("Dropdown");

export type DropdownRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** A pointerdown outside the menu and its trigger closes it. Default `true`. */
  closeOnOutsideClick?: boolean;
  /** Escape closes the menu. Default `true`. */
  closeOnEscape?: boolean;
  children: React.ReactNode;
};

function DropdownRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  children,
}: DropdownRootProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const value = React.useMemo(
    () => ({
      isOpen,
      setOpen,
      triggerId: `${id}-trigger`,
      menuId: `${id}-menu`,
      triggerRef,
      closeOnOutsideClick,
      closeOnEscape,
    }),
    [isOpen, setOpen, id, closeOnOutsideClick, closeOnEscape],
  );

  return <DropdownProvider value={value}>{children}</DropdownProvider>;
}
DropdownRoot.displayName = "Dropdown.Root";

export type DropdownTriggerProps = {
  /** The element that opens the menu (usually a Button); it receives ref, ARIA and the click handler. */
  children: React.ReactElement;
};

function DropdownTrigger({ children }: DropdownTriggerProps) {
  const { isOpen, setOpen, triggerId, menuId, triggerRef } = useDropdownContext();
  return (
    <Slot
      ref={triggerRef}
      id={triggerId}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      aria-controls={menuId}
      data-state={isOpen ? "open" : "closed"}
      onClick={() => setOpen((value) => !value)}
    >
      {children}
    </Slot>
  );
}
DropdownTrigger.displayName = "Dropdown.Trigger";

const ENABLED_ITEM = '[role="menuitem"]:not([data-disabled="true"])';

/** Arrow keys, Home and End move focus between the enabled items, wrapping around. */
function moveFocus(event: React.KeyboardEvent<HTMLElement>) {
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ENABLED_ITEM));
  const current = items.indexOf(document.activeElement as HTMLElement);
  const next = rovingIndex(event.key, current, items.length, "vertical");
  if (next === null) return;
  event.preventDefault();
  items[next]?.focus();
}

export type DropdownContentProps = Omit<React.HTMLAttributes<HTMLElement>, "role"> & {
  side?: PositionSide;
  align?: PositionAlign;
  /** Row tier: item height, text, icon. */
  size?: ControlSize;
  /** The menu is at least as wide as the trigger. */
  matchTriggerWidth?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function DropdownContent({
  side = "bottom",
  align = "start",
  size = "m",
  matchTriggerWidth = false,
  className,
  children,
  onKeyDown,
  ref,
  ...rest
}: DropdownContentProps) {
  const { isOpen, setOpen, triggerRef, menuId, triggerId, closeOnOutsideClick, closeOnEscape } =
    useDropdownContext();
  const overlayPortalLayer = useOverlayPortalLayer();
  const contentRef = React.useRef<HTMLElement | null>(null);
  const presence = usePresence(isOpen, { exitDuration: "fast" });

  // Keeps its position while the exit animation plays.
  const position = useAnchoredPosition(presence.mounted, triggerRef, contentRef, {
    side,
    align,
    matchAnchorWidth: matchTriggerWidth,
  });
  // The trap restores focus to the trigger on Escape; an outside press skips the restore (§8).
  const trapRef = useFocusTrap<HTMLDivElement>({ enabled: isOpen, restoreFocus: true });
  const mergedRef = React.useMemo(
    () => mergeRefs<HTMLDivElement>(position.attachLayer, trapRef, ref),
    [position.attachLayer, trapRef, ref],
  );

  useEscapeKey({ enabled: isOpen && closeOnEscape, onEscape: () => setOpen(false) });
  useOutsideClick({
    refs: [triggerRef, contentRef],
    enabled: isOpen,
    onOutsideClick: () => {
      if (closeOnOutsideClick) setOpen(false);
    },
  });

  if (!presence.mounted) return null;

  return (
    <Portal>
      <ControlSizeProvider value={size}>
        <DropdownLayerContext.Provider value>
          <ScrollContainer
            {...rest}
            ref={mergedRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerRef.current?.id || triggerId}
            data-react-aria-top-layer="true"
            data-overlay-portal-layer={overlayPortalLayer}
            data-side={position.side}
            data-state={presence.state}
            data-size={size}
            className={cx(
              surface.surface,
              surface.dropdownLayer,
              menu.tier,
              menu.menu,
              overlayMotion.floating,
              className,
            )}
            onAnimationEnd={presence.onExitEnd}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (!event.defaultPrevented) moveFocus(event);
            }}
          >
            {children}
          </ScrollContainer>
        </DropdownLayerContext.Provider>
      </ControlSizeProvider>
    </Portal>
  );
}
DropdownContent.displayName = "Dropdown.Content";

export type DropdownItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "onSelect"
> & {
  /** Runs the action; the menu closes after it. */
  onSelect?: () => void;
  disabled?: boolean;
  /** `danger` — destructive action (delete, revoke). */
  tone?: Extract<Tone, "neutral" | "danger">;
  ref?: React.Ref<HTMLButtonElement>;
};

function DropdownItem({
  onSelect,
  disabled = false,
  tone = "neutral",
  className,
  onClick,
  onKeyDown,
  ...rest
}: DropdownItemProps) {
  const { setOpen } = useDropdownContext();

  const activate = () => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
  };

  return (
    <button
      {...rest}
      type="button"
      role="menuitem"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cx(menu.item, styles.item, className)}
      {...toDataAttributes({ tone, disabled: disabled || undefined })}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) activate();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        activate();
      }}
    />
  );
}
DropdownItem.displayName = "Dropdown.Item";

export type DropdownItemIconProps = React.HTMLAttributes<HTMLSpanElement>;

/** Leading glyph of an item at the menu's icon size (a kit `Icon` follows it). */
function DropdownItemIcon({ className, ...rest }: DropdownItemIconProps) {
  return <span aria-hidden="true" className={cx(menu.itemIcon, className)} {...rest} />;
}
DropdownItemIcon.displayName = "Dropdown.ItemIcon";

export type DropdownItemShortcutProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children: React.ReactNode;
};

/** Key hint at the end of an item (a Kbd one tier below the menu). A hint only — not a handler. */
function DropdownItemShortcut({ className, ...rest }: DropdownItemShortcutProps) {
  return <Kbd className={cx(menu.shortcut, styles.shortcut, className)} {...rest} />;
}
DropdownItemShortcut.displayName = "Dropdown.ItemShortcut";

export type DropdownGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  /** Visible heading of the group; names it for screen readers. */
  label?: React.ReactNode;
};

function DropdownGroup({ label, className, children, ...rest }: DropdownGroupProps) {
  const labelId = React.useId();
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" inside role="menu"; <fieldset> is not allowed there
    <div
      role="group"
      aria-labelledby={label != null ? labelId : undefined}
      className={cx(menu.group, className)}
      {...rest}
    >
      {label != null ? (
        <div id={labelId} role="presentation" className={menu.groupLabel}>
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}
DropdownGroup.displayName = "Dropdown.Group";

export type DropdownSeparatorProps = { className?: string };

/** A full-bleed hairline between items or groups. */
function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return <Divider className={cx(menu.separator, className)} />;
}
DropdownSeparator.displayName = "Dropdown.Separator";

export type DropdownTitleProps = React.HTMLAttributes<HTMLDivElement>;

/** Heading line of `Dropdown.Header` (a name, a plan). */
function DropdownTitle({ className, ...rest }: DropdownTitleProps) {
  return <div className={cx(styles.title, className)} {...rest} />;
}
DropdownTitle.displayName = "Dropdown.Title";

export type DropdownDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

/** Muted line under `Dropdown.Title` (an email, a quota); truncates with an ellipsis. */
function DropdownDescription({ className, ...rest }: DropdownDescriptionProps) {
  return <div className={cx(styles.description, className)} {...rest} />;
}
DropdownDescription.displayName = "Dropdown.Description";

export type DropdownHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const isText = (node: React.ReactNode) =>
  React.isValidElement(node) && (node.type === DropdownTitle || node.type === DropdownDescription);

/**
 * A non-interactive row at the top of the menu (who is signed in, the current plan): an avatar or
 * icon, `Dropdown.Title` + `Dropdown.Description` stacked in one column, and a trailing badge or
 * button — in the order written.
 */
function DropdownHeader({ className, children, ...rest }: DropdownHeaderProps) {
  const nodes = React.Children.toArray(children);
  const text = nodes.filter(isText);
  const textAt = nodes.findIndex(isText);
  return (
    <div className={cx(styles.header, className)} {...rest}>
      {nodes.map((node, index) => {
        if (index === textAt) {
          return (
            <div key="text" className={styles.headerText}>
              {text}
            </div>
          );
        }
        return isText(node) ? null : node;
      })}
    </div>
  );
}
DropdownHeader.displayName = "Dropdown.Header";

export const Dropdown = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Header: DropdownHeader,
  Title: DropdownTitle,
  Description: DropdownDescription,
  Group: DropdownGroup,
  Item: DropdownItem,
  ItemIcon: DropdownItemIcon,
  ItemShortcut: DropdownItemShortcut,
  Separator: DropdownSeparator,
};

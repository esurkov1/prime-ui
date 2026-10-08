import * as React from "react";

import { Divider } from "@/components/divider/Divider";
import { Kbd } from "@/components/kbd/Kbd";
import { useControllableState } from "@/hooks/useControllableState";
import type { PositionAlign, PositionSide } from "@/hooks/usePosition";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { MenuGroup, type MenuGroupProps } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { FloatingPanel, FloatingTrigger } from "@/internal/overlay/FloatingPanel";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { rovingIndex } from "@/internal/rovingFocus";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./Dropdown.module.css";

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
  ref?: React.Ref<HTMLElement>;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

/** Other props (handlers, ARIA, `ref`) are forwarded to the child, e.g. from a wrapping `Tooltip.Trigger`. */
function DropdownTrigger({ children, ...forwarded }: DropdownTriggerProps) {
  const { isOpen, setOpen, triggerId, menuId, triggerRef } = useDropdownContext();
  return (
    <FloatingTrigger
      {...forwarded}
      triggerProps={{
        ref: triggerRef,
        id: triggerId,
        "aria-expanded": isOpen,
        "aria-haspopup": "menu",
        "aria-controls": menuId,
        "data-state": isOpen ? "open" : "closed",
        onClick: () => setOpen((value) => !value),
      }}
    >
      {children}
    </FloatingTrigger>
  );
}
DropdownTrigger.displayName = "Dropdown.Trigger";

const ENABLED_ITEM =
  ':is([role="menuitem"], [role="menuitemcheckbox"]):not([data-disabled="true"])';

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
  ...rest
}: DropdownContentProps) {
  const { isOpen, setOpen, triggerRef, menuId, triggerId, closeOnOutsideClick, closeOnEscape } =
    useDropdownContext();

  // WAI-ARIA menu button: focus goes to the first item; Escape, a pick and Tab return it to the
  // trigger (Tab then moves on); an outside press leaves focus where the pointer put it.
  const floating = useFloatingLayer({
    open: isOpen,
    onOpenChange: setOpen,
    triggerRef,
    side,
    align,
    matchAnchorWidth: matchTriggerWidth,
    closeOnEscape,
    closeOnOutsideClick,
    focusOnOpen: true,
    tabExit: "always",
    sheet: true,
  });

  return (
    <FloatingPanel
      {...rest}
      floating={floating}
      size={size}
      scroll
      id={menuId}
      role="menu"
      aria-labelledby={triggerRef.current?.id || triggerId}
      className={cx(menu.tier, menu.menu, className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) moveFocus(event);
      }}
    >
      {children}
    </FloatingPanel>
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
  ...rest
}: DropdownItemProps) {
  const { setOpen } = useDropdownContext();

  // Enter and Space reach here as the native button click.
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
    />
  );
}
DropdownItem.displayName = "Dropdown.Item";

export type DropdownCheckboxItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "onSelect" | "onChange" | "defaultChecked"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * A toggle inside the menu (show a column, turn a filter on, pick a view): the label where an item
 * has it and a check mark at the end while checked, `role="menuitemcheckbox"`. Toggling keeps the
 * menu open, so several can be set in a row.
 */
function DropdownCheckboxItem({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
  onClick,
  children,
  ...rest
}: DropdownCheckboxItemProps) {
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <button
      {...rest}
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cx(menu.item, styles.item, className)}
      {...toDataAttributes({ disabled: disabled || undefined, checked: checked || undefined })}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) setChecked(!checked);
      }}
    >
      {children}
      <span className={menu.check} aria-hidden="true">
        {checked ? <Icon name="action.check" /> : null}
      </span>
    </button>
  );
}
DropdownCheckboxItem.displayName = "Dropdown.CheckboxItem";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type DropdownItemIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Leading glyph of an item at the menu's icon size (a kit `Icon` follows it). */
function DropdownItemIcon({ className, ...rest }: DropdownItemIconProps) {
  return <span aria-hidden="true" className={cx(menu.itemIcon, className)} {...rest} />;
}
DropdownItemIcon.displayName = "Dropdown.ItemIcon";

export type DropdownItemShortcutProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

/** Key hint at the end of an item (a Kbd one tier below the menu). A hint only — not a handler. */
function DropdownItemShortcut({ className, ...rest }: DropdownItemShortcutProps) {
  return <Kbd className={cx(menu.shortcut, styles.shortcut, className)} {...rest} />;
}
DropdownItemShortcut.displayName = "Dropdown.ItemShortcut";

export type DropdownGroupProps = MenuGroupProps;

function DropdownGroup(props: DropdownGroupProps) {
  return <MenuGroup {...props} />;
}
DropdownGroup.displayName = "Dropdown.Group";

export type DropdownSeparatorProps = Omit<DivProps, "children">;

/** A full-bleed hairline between items or groups. */
function DropdownSeparator({ className, ...rest }: DropdownSeparatorProps) {
  return <Divider {...rest} className={cx(menu.separator, className)} />;
}
DropdownSeparator.displayName = "Dropdown.Separator";

export type DropdownTitleProps = DivProps;

/** Heading line of `Dropdown.Header` (a name, a plan). */
function DropdownTitle({ className, ...rest }: DropdownTitleProps) {
  return <div className={cx(styles.title, className)} {...rest} />;
}
DropdownTitle.displayName = "Dropdown.Title";

export type DropdownDescriptionProps = DivProps;

/** Muted line under `Dropdown.Title` (an email, a quota); truncates with an ellipsis. */
function DropdownDescription({ className, ...rest }: DropdownDescriptionProps) {
  return <div className={cx(styles.description, className)} {...rest} />;
}
DropdownDescription.displayName = "Dropdown.Description";

export type DropdownHeaderProps = DivProps;

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
  CheckboxItem: DropdownCheckboxItem,
  ItemIcon: DropdownItemIcon,
  ItemShortcut: DropdownItemShortcut,
  Separator: DropdownSeparator,
};

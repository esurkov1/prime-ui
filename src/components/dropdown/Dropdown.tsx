import * as React from "react";

import { Divider } from "@/components/divider/Divider";
import { Kbd } from "@/components/kbd/Kbd";
import { useControllableState } from "@/hooks/useControllableState";
import {
  type AnchorPoint,
  DEFAULT_ALIGN,
  DEFAULT_SIDE,
  type PositionAlign,
  type PositionSide,
} from "@/hooks/usePosition";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { InteractiveElement } from "@/internal/interactiveElement";
import { MenuGroup, type MenuGroupProps } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { FloatingPanel, FloatingTrigger } from "@/internal/overlay/FloatingPanel";
import { useAnchorName } from "@/internal/overlay/useAnchorName";
import { floatingTriggerProps, useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { useOpenState } from "@/internal/overlay/useOpenState";
import { rovingIndex } from "@/internal/rovingFocus";
import { Slot, type SlotPartProps, slotChild } from "@/internal/slot";
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
  anchorPoint: AnchorPoint | null;
};

const [DropdownProvider, useDropdownContext] =
  createComponentContext<DropdownContextValue>("Dropdown");

export type DropdownRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  anchorPoint?: AnchorPoint | null;
  children: React.ReactNode;
};

function DropdownRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  anchorPoint = null,
  children,
}: DropdownRootProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
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
      anchorPoint,
    }),
    [isOpen, setOpen, id, closeOnOutsideClick, closeOnEscape, anchorPoint],
  );

  return <DropdownProvider value={value}>{children}</DropdownProvider>;
}
DropdownRoot.displayName = "Dropdown.Root";

export type DropdownTriggerProps = SlotPartProps;

/**
 * Wraps the element that opens the menu (usually a Button): it receives the ref, the ARIA, the
 * click and the arrow keys (WAI-ARIA menu button). Props a wrapping trigger adds
 * (`Tooltip.Trigger`) pass on to the child.
 */
function DropdownTrigger(props: DropdownTriggerProps) {
  const { isOpen, setOpen, triggerId, menuId, triggerRef } = useDropdownContext("Dropdown.Trigger");
  return (
    <FloatingTrigger
      {...props}
      triggerProps={{
        ref: triggerRef,
        id: triggerId,
        "aria-haspopup": "menu",
        "aria-controls": isOpen ? menuId : undefined,
        ...floatingTriggerProps({ open: isOpen, setOpen, openOnArrow: true }),
      }}
    />
  );
}
DropdownTrigger.displayName = "Dropdown.Trigger";

export type DropdownAnchorProps = SlotPartProps;

/**
 * An anchor that is not a trigger: the element a context menu opens against (a row, a list) with
 * `Dropdown.Root anchorPoint`, the open state driven by `Dropdown.Root open`. It adds no click
 * handler and no ARIA; presses on it do not close the menu, and focus returns to it on close.
 */
function DropdownAnchor({ children }: DropdownAnchorProps) {
  const { triggerRef } = useDropdownContext("Dropdown.Anchor");
  return <Slot ref={triggerRef}>{children}</Slot>;
}
DropdownAnchor.displayName = "Dropdown.Anchor";

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
  size?: ControlSize;
  matchTriggerWidth?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function DropdownContent({
  side = DEFAULT_SIDE,
  align = DEFAULT_ALIGN,
  size = "m",
  matchTriggerWidth = false,
  className,
  children,
  onKeyDown,
  ...rest
}: DropdownContentProps) {
  const { isOpen, setOpen, triggerRef, menuId, closeOnOutsideClick, closeOnEscape, anchorPoint } =
    useDropdownContext("Dropdown.Content");

  // WAI-ARIA menu button: focus goes to the first item; Escape, a pick and Tab return it to the
  // trigger (Tab then moves on); an outside press leaves focus where the pointer put it.
  const floating = useFloatingLayer({
    open: isOpen,
    onOpenChange: setOpen,
    triggerRef,
    side,
    align,
    anchorPoint,
    matchAnchorWidth: matchTriggerWidth,
    closeOnEscape,
    closeOnOutsideClick,
    focusOnOpen: ENABLED_ITEM,
    tabExit: "always",
    sheet: true,
  });
  const name = useAnchorName(isOpen, false, triggerRef);

  return (
    <FloatingPanel
      {...rest}
      {...name}
      floating={floating}
      size={size}
      scroll
      id={menuId}
      role="menu"
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
  onSelect?: () => void;
  disabled?: boolean;
  tone?: Extract<Tone, "neutral" | "danger">;
  asChild?: boolean;
  /** The item element: `<button>`, or the `asChild` element. */
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Lays out an item's content: leading `ItemIcon`s, the label, a `Dropdown.ItemDescription` under it
 * and a trailing `ItemShortcut`. With a description the label names the item (`aria-labelledby`)
 * and the description describes it (`aria-describedby`), so the reason under a disabled item is
 * read with it, not as part of its name.
 */
function useItemContent(children: React.ReactNode) {
  const labelId = React.useId();
  const descriptionId = React.useId();
  const nodes = React.Children.toArray(children);
  const isType = (node: React.ReactNode, type: unknown) =>
    React.isValidElement(node) && node.type === type;
  const description = nodes.filter((node) => isType(node, DropdownItemDescription));
  if (description.length === 0) return { content: children, aria: null };
  const leading = nodes.filter((node) => isType(node, DropdownItemIcon));
  const trailing = nodes.filter((node) => isType(node, DropdownItemShortcut));
  const label = nodes.filter(
    (node) =>
      !isType(node, DropdownItemDescription) &&
      !isType(node, DropdownItemIcon) &&
      !isType(node, DropdownItemShortcut),
  );
  return {
    content: (
      <>
        {leading}
        <span className={styles.itemBody}>
          <span id={labelId} className={styles.itemLabel}>
            {label}
          </span>
          <span id={descriptionId} className={styles.itemDescriptionSlot}>
            {description}
          </span>
        </span>
        {trailing}
      </>
    ),
    aria: { "aria-labelledby": labelId, "aria-describedby": descriptionId },
  };
}

/**
 * An item is no tab stop (`tabIndex -1`): the menu moves focus between items with the arrow keys
 * (roving focus), and Tab leaves the menu. A disabled item runs no handler at all, the consumer's
 * `onClick` included (`InteractiveElement`).
 */
function DropdownItem({
  onSelect,
  disabled = false,
  tone = "neutral",
  asChild = false,
  className,
  onClick,
  children,
  ref,
  ...rest
}: DropdownItemProps) {
  const { setOpen } = useDropdownContext("Dropdown.Item");
  const child = asChild ? slotChild(children, "Dropdown.Item") : null;
  const { content, aria } = useItemContent(child ? child.props.children : children);

  const itemProps = {
    ...rest,
    ...aria,
    ref,
    role: "menuitem",
    tabIndex: -1,
    disabled,
    className: cx(menu.item, styles.item, className),
    ...toDataAttributes({ tone, disabled: disabled || undefined }),
    // Enter and Space reach here as the native click (Enter only on a link).
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      if (event.defaultPrevented) return;
      onSelect?.();
      setOpen(false);
    },
  };

  if (child) {
    // A link keeps its native click: a modified click opens a new tab and the menu still closes.
    return (
      <InteractiveElement {...itemProps} element="slot">
        {React.cloneElement(child, undefined, content)}
      </InteractiveElement>
    );
  }
  return (
    <InteractiveElement {...itemProps} element="button">
      {content}
    </InteractiveElement>
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
  ref,
  ...rest
}: DropdownCheckboxItemProps) {
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const { content, aria } = useItemContent(children);

  return (
    <InteractiveElement
      {...rest}
      {...aria}
      ref={ref}
      element="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={-1}
      disabled={disabled}
      className={cx(menu.item, styles.item, className)}
      {...toDataAttributes({ disabled: disabled || undefined, checked: checked || undefined })}
      onClick={(event) => {
        onClick?.(event as React.MouseEvent<HTMLButtonElement>);
        if (!event.defaultPrevented) setChecked(!checked);
      }}
    >
      {content}
      <span className={menu.check} aria-hidden="true">
        {checked ? <Icon name="action.check" /> : null}
      </span>
    </InteractiveElement>
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

export type DropdownItemDescriptionProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "id"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * Muted second line of an item, under its label: what the action does, or why a disabled item is
 * unavailable («Доступно владельцу проекта»). Wraps instead of widening the menu past its limit.
 */
function DropdownItemDescription({ className, ...rest }: DropdownItemDescriptionProps) {
  return <span className={cx(styles.itemDescription, className)} {...rest} />;
}
DropdownItemDescription.displayName = "Dropdown.ItemDescription";

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
  Anchor: DropdownAnchor,
  Content: DropdownContent,
  Header: DropdownHeader,
  Title: DropdownTitle,
  Description: DropdownDescription,
  Group: DropdownGroup,
  Item: DropdownItem,
  CheckboxItem: DropdownCheckboxItem,
  ItemIcon: DropdownItemIcon,
  ItemDescription: DropdownItemDescription,
  ItemShortcut: DropdownItemShortcut,
  Separator: DropdownSeparator,
};

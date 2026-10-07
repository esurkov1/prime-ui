import * as React from "react";

import menu from "@/components/dropdown/menu.module.css";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Kbd } from "@/components/kbd/Kbd";
import { Modal } from "@/components/modal/Modal";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { mergeRefs } from "@/internal/mergeRefs";
import type { ControlSize } from "@/internal/states";

import styles from "./CommandMenu.module.css";

export type CommandMenuLabels = {
  /** Default placeholder and accessible name of `CommandMenu.Input`. */
  search: string;
  /** `CommandMenu.Empty`: nothing matches the query. */
  empty: string;
  /** Second line of `CommandMenu.Empty`; `""` hides it. */
  emptyHint: string;
};

const COMMAND_MENU_LABELS: CommandMenuLabels = {
  search: "Поиск",
  empty: "Ничего не найдено",
  emptyHint: "Попробуйте изменить запрос",
};

// ─── Item registry and filtering ─────────────────────────────────────────────

type ItemEntry = {
  order: number;
  /** `value` and `keywords`, lower-cased: what the query is matched against. */
  haystack: string;
  disabled: boolean;
  groupId: string;
};

type ItemRegistration = Omit<ItemEntry, "order">;

type CommandMenuContextValue = {
  labels: CommandMenuLabels;
  search: string;
  setSearch: (search: string) => void;
  listboxId: string;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  registerItem: (id: string, item: ItemRegistration) => () => void;
  /** Ids of the enabled items that match the query, in render order. */
  visibleIds: string[];
  groupOf: (id: string) => string | undefined;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const [CommandMenuProvider, useCommandMenuContext] =
  createComponentContext<CommandMenuContextValue>("CommandMenu");

const CommandMenuGroupContext = React.createContext("");

const optionId = (id: string) => `${id}-option`;

function CommandMenuState({
  labels,
  children,
}: {
  labels: CommandMenuLabels;
  children: React.ReactNode;
}) {
  const listboxId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const itemsRef = React.useRef(new Map<string, ItemEntry>());
  const orderRef = React.useRef(new Map<string, number>());
  const [version, bump] = React.useReducer((n: number) => n + 1, 0);
  const [search, setSearch] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // The state lives as long as the open dialog: every opening starts with an empty query and
  // focus in the search field.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const registerItem = React.useCallback((id: string, item: ItemRegistration) => {
    let order = orderRef.current.get(id);
    if (order === undefined) {
      order = orderRef.current.size;
      orderRef.current.set(id, order);
    }
    itemsRef.current.set(id, { ...item, order });
    bump();
    return () => {
      itemsRef.current.delete(id);
      bump();
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `version` changes when items (de)register
  const visibleIds = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...itemsRef.current.entries()]
      .filter(([, item]) => !item.disabled && item.haystack.includes(query))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([id]) => id);
  }, [search, version]);

  const groupOf = React.useCallback((id: string) => itemsRef.current.get(id)?.groupId, []);

  // The active option stays on screen while the list filters: the first match otherwise.
  React.useLayoutEffect(() => {
    setActiveId((prev) => (prev && visibleIds.includes(prev) ? prev : (visibleIds[0] ?? null)));
  }, [visibleIds]);

  const value = React.useMemo(
    () => ({
      labels,
      search,
      setSearch,
      listboxId,
      activeId,
      setActiveId,
      registerItem,
      visibleIds,
      groupOf,
      inputRef,
    }),
    [labels, search, listboxId, activeId, registerItem, visibleIds, groupOf],
  );

  return <CommandMenuProvider value={value}>{children}</CommandMenuProvider>;
}

// ─── Root ────────────────────────────────────────────────────────────────────

export type CommandMenuRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Escape closes the palette. Default `true`. */
  closeOnEscape?: boolean;
  /** A click on the scrim closes the palette. Default `true`. */
  closeOnOutsideClick?: boolean;
  /** Tier of the rows and the search row: item height, text, icon. */
  size?: ControlSize;
  labels?: Partial<CommandMenuLabels>;
  /** Name of the dialog when there is no `CommandMenu.Title`. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  className?: string;
  children: React.ReactNode;
};

function CommandMenuRoot({
  open,
  defaultOpen,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  size = "m",
  labels: labelsProp,
  className,
  children,
  ...aria
}: CommandMenuRootProps) {
  const labels = React.useMemo(() => ({ ...COMMAND_MENU_LABELS, ...labelsProp }), [labelsProp]);
  return (
    <Modal.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      closeOnEscape={closeOnEscape}
      closeOnOutsideClick={closeOnOutsideClick}
    >
      <Modal.Content
        {...aria}
        className={cx(styles.content, className)}
        overlayClassName={styles.overlay}
      >
        {/* `display: contents`: carries the tier variables without breaking the panel's flex column. */}
        <div className={cx(menu.tier, styles.tier)} data-size={size}>
          <ControlSizeProvider value={size}>
            <CommandMenuState labels={labels}>{children}</CommandMenuState>
          </ControlSizeProvider>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
CommandMenuRoot.displayName = "CommandMenu.Root";

// ─── Title / Description ─────────────────────────────────────────────────────

export type CommandMenuTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "id">;

/** Visible heading above the search row; names the dialog. */
function CommandMenuTitle({ className, ...rest }: CommandMenuTitleProps) {
  return <Modal.Title className={cx(styles.title, className)} {...rest} />;
}
CommandMenuTitle.displayName = "CommandMenu.Title";

export type CommandMenuDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

/** Secondary line under the title; describes the dialog. */
function CommandMenuDescription({ className, ...rest }: CommandMenuDescriptionProps) {
  return <Modal.Description className={cx(styles.description, className)} {...rest} />;
}
CommandMenuDescription.displayName = "CommandMenu.Description";

// ─── Input ───────────────────────────────────────────────────────────────────

export type CommandMenuInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "role"
> & {
  /** Called with the new query; native `onChange` still fires. */
  onValueChange?: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
};

/**
 * The search row: a search icon and the query field. It is the permanent focus of the palette, so
 * it draws no focus ring (foundation §7); arrows, Home, End and Enter drive the list from it.
 */
function CommandMenuInput({
  className,
  onKeyDown,
  value: valueProp,
  onChange,
  onValueChange,
  placeholder,
  "aria-label": ariaLabel,
  ref,
  ...rest
}: CommandMenuInputProps) {
  const { labels, search, setSearch, listboxId, activeId, setActiveId, visibleIds, inputRef } =
    useCommandMenuContext();
  const controlled = valueProp !== undefined;
  const mergedRef = React.useMemo(() => mergeRefs(inputRef, ref), [inputRef, ref]);

  React.useEffect(() => {
    if (controlled) setSearch(String(valueProp));
  }, [controlled, valueProp, setSearch]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || visibleIds.length === 0) return;
    const index = activeId ? visibleIds.indexOf(activeId) : -1;
    const last = visibleIds.length - 1;
    const next: Record<string, number> = {
      ArrowDown: index < 0 || index === last ? 0 : index + 1,
      ArrowUp: index <= 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (event.key in next) {
      event.preventDefault();
      setActiveId(visibleIds[next[event.key]] ?? null);
    } else if (event.key === "Enter" && activeId) {
      event.preventDefault();
      document.getElementById(optionId(activeId))?.click();
    }
  };

  return (
    <div className={cx(menu.searchRow, styles.inputRow)} data-focus-ring="false">
      <Icon name="action.search" size="m" />
      <input
        {...rest}
        ref={mergedRef}
        type="search"
        role="combobox"
        placeholder={placeholder ?? labels.search}
        aria-label={ariaLabel ?? (rest["aria-labelledby"] ? undefined : labels.search)}
        aria-expanded="true"
        aria-controls={listboxId}
        aria-activedescendant={activeId ? optionId(activeId) : undefined}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className={cx(menu.searchInput, styles.input, className)}
        value={controlled ? valueProp : search}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
          if (!controlled) setSearch(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
CommandMenuInput.displayName = "CommandMenu.Input";

// ─── List / Group ────────────────────────────────────────────────────────────

export type CommandMenuListProps = Omit<React.HTMLAttributes<HTMLElement>, "role" | "id"> & {
  ref?: React.Ref<HTMLElement>;
};

/** The scrolling `role="listbox"` of results under the search row. */
function CommandMenuList({ className, ...rest }: CommandMenuListProps) {
  const { listboxId } = useCommandMenuContext();
  return (
    <ScrollContainer
      {...rest}
      id={listboxId}
      role="listbox"
      className={cx(styles.list, className)}
    />
  );
}
CommandMenuList.displayName = "CommandMenu.List";

export type CommandMenuGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  /** Visible heading of the group; names it for screen readers. */
  label?: React.ReactNode;
};

/** A labelled section of items; hidden while none of its items match the query. */
function CommandMenuGroup({ label, className, children, ...rest }: CommandMenuGroupProps) {
  const groupId = React.useId();
  const { visibleIds, groupOf } = useCommandMenuContext();
  const hasVisible = visibleIds.some((id) => groupOf(id) === groupId);
  const labelId = `${groupId}-label`;

  return (
    <CommandMenuGroupContext.Provider value={groupId}>
      {/* biome-ignore lint/a11y/useSemanticElements: role="group" inside role="listbox"; <fieldset> is not allowed there */}
      <div
        {...rest}
        role="group"
        aria-labelledby={label != null ? labelId : undefined}
        hidden={hasVisible ? undefined : true}
        className={cx(menu.group, styles.group, className)}
      >
        {label != null ? (
          <div id={labelId} className={menu.groupLabel}>
            {label}
          </div>
        ) : null}
        {children}
      </div>
    </CommandMenuGroupContext.Provider>
  );
}
CommandMenuGroup.displayName = "CommandMenu.Group";

// ─── Item and its parts ──────────────────────────────────────────────────────

export type CommandMenuItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "id" | "onSelect"
> & {
  /** Text matched with `keywords`; with `""` the item shows only while the query is empty or `keywords` match. */
  value: string;
  /** Extra words for the query (synonyms, English names). */
  keywords?: string;
  /** Runs the command: a click, or Enter while the item is active. */
  onSelect?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
};

function CommandMenuItem({
  className,
  value,
  keywords = "",
  disabled = false,
  onSelect,
  onClick,
  onPointerMove,
  ref,
  ...rest
}: CommandMenuItemProps) {
  const id = React.useId();
  const groupId = React.useContext(CommandMenuGroupContext);
  const { registerItem, activeId, setActiveId, visibleIds } = useCommandMenuContext();
  const nodeRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = React.useMemo(() => mergeRefs(nodeRef, ref), [ref]);

  React.useLayoutEffect(
    () =>
      registerItem(id, {
        haystack: `${value} ${keywords}`.trim().toLowerCase(),
        disabled,
        groupId,
      }),
    [id, value, keywords, disabled, groupId, registerItem],
  );

  const visible = visibleIds.includes(id);
  const active = activeId === id;

  React.useEffect(() => {
    if (active) nodeRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [active]);

  return (
    <button
      {...rest}
      ref={mergedRef}
      type="button"
      id={optionId(id)}
      role="option"
      tabIndex={-1}
      aria-selected={active}
      hidden={visible ? undefined : true}
      disabled={disabled}
      className={cx(menu.item, styles.item, className)}
      {...toDataAttributes({ highlighted: active || undefined, disabled: disabled || undefined })}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!event.defaultPrevented && visible) setActiveId(id);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !visible) return;
        setActiveId(id);
        onSelect?.();
      }}
    />
  );
}
CommandMenuItem.displayName = "CommandMenu.Item";

export type CommandMenuItemIconProps = React.HTMLAttributes<HTMLSpanElement>;

/** Leading glyph of an item at the tier icon size (a kit `Icon` follows it). */
function CommandMenuItemIcon({ className, ...rest }: CommandMenuItemIconProps) {
  return <span aria-hidden="true" className={cx(menu.itemIcon, className)} {...rest} />;
}
CommandMenuItemIcon.displayName = "CommandMenu.ItemIcon";

export type CommandMenuItemTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Second line (path, details): caption, muted. */
  description?: React.ReactNode;
};

/** Item text: a title with an ellipsis and an optional description line. */
function CommandMenuItemText({
  description,
  children,
  className,
  ...rest
}: CommandMenuItemTextProps) {
  return (
    <span className={cx(styles.itemText, className)} {...rest}>
      <span className={styles.itemLabel}>{children}</span>
      {description ? <span className={styles.itemDescription}>{description}</span> : null}
    </span>
  );
}
CommandMenuItemText.displayName = "CommandMenu.ItemText";

export type CommandMenuItemShortcutProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children: React.ReactNode;
};

/** Key hint at the end of an item (a Kbd one tier below). A hint only — not a handler. */
function CommandMenuItemShortcut({ className, ...rest }: CommandMenuItemShortcutProps) {
  return <Kbd.Root className={cx(menu.shortcut, className)} {...rest} />;
}
CommandMenuItemShortcut.displayName = "CommandMenu.ItemShortcut";

// ─── Empty / Footer ──────────────────────────────────────────────────────────

export type CommandMenuEmptyProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role">;

/**
 * Shown only while nothing matches the query: `labels.empty` and `labels.emptyHint`; `children`
 * is an action under them.
 */
function CommandMenuEmpty({ children, ...rest }: CommandMenuEmptyProps) {
  const { visibleIds, labels } = useCommandMenuContext();
  if (visibleIds.length > 0) return null;
  return (
    <EmptyPage.Root layout="compact" role="status" {...rest}>
      <EmptyPage.Title>{labels.empty}</EmptyPage.Title>
      {labels.emptyHint ? <EmptyPage.Description>{labels.emptyHint}</EmptyPage.Description> : null}
      {children ? <EmptyPage.Actions>{children}</EmptyPage.Actions> : null}
    </EmptyPage.Root>
  );
}
CommandMenuEmpty.displayName = "CommandMenu.Empty";

export type CommandMenuFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Bottom row of key hints, hairline above. */
function CommandMenuFooter({ className, ...rest }: CommandMenuFooterProps) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}
CommandMenuFooter.displayName = "CommandMenu.Footer";

export type CommandMenuFooterHintProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Keys (text or icons), each in its own Kbd. */
  keys: React.ReactNode[];
};

/** A footer hint: keys and what they do («↑ ↓ Навигация»). */
function CommandMenuFooterHint({ keys, children, className, ...rest }: CommandMenuFooterHintProps) {
  return (
    <span className={cx(styles.footerHint, className)} {...rest}>
      {keys.map((key, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a static list of keys
        <Kbd.Root key={index}>{key}</Kbd.Root>
      ))}
      <span className={styles.footerHintLabel}>{children}</span>
    </span>
  );
}
CommandMenuFooterHint.displayName = "CommandMenu.FooterHint";

export const CommandMenu = {
  Root: CommandMenuRoot,
  Title: CommandMenuTitle,
  Description: CommandMenuDescription,
  Input: CommandMenuInput,
  List: CommandMenuList,
  Group: CommandMenuGroup,
  Item: CommandMenuItem,
  ItemIcon: CommandMenuItemIcon,
  ItemText: CommandMenuItemText,
  ItemShortcut: CommandMenuItemShortcut,
  Empty: CommandMenuEmpty,
  Footer: CommandMenuFooter,
  FooterHint: CommandMenuFooterHint,
};

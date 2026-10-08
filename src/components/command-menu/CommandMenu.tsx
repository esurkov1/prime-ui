import * as React from "react";

import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Kbd } from "@/components/kbd/Kbd";
import { Modal } from "@/components/modal/Modal";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { highlightChildren } from "@/internal/HighlightMatch";
import { type Store, useCreateStore, useStoreSlice } from "@/internal/listbox";
import { MenuGroup } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
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
  /** The active option; items subscribe to their own slice of it. */
  active: Store<string | null>;
  registerItem: (id: string, item: ItemRegistration) => () => void;
  /** Items that match the query (disabled ones too). */
  visible: ReadonlySet<string>;
  /** Enabled matching items in render order: what the arrows walk. */
  navigable: string[];
  groupOf: (id: string) => string | undefined;
};

const [CommandMenuProvider, useCommandMenuContext] =
  createComponentContext<CommandMenuContextValue>("CommandMenu");

const CommandMenuGroupContext = React.createContext("");

const optionId = (id: string) => `${id}-option`;

/** Lives as long as the open dialog: the item registry, the matches and the active option. */
function CommandMenuState({
  labels,
  search,
  setSearch,
  children,
}: {
  labels: CommandMenuLabels;
  search: string;
  setSearch: (search: string) => void;
  children: React.ReactNode;
}) {
  const listboxId = React.useId();
  const itemsRef = React.useRef(new Map<string, ItemEntry>());
  const orderRef = React.useRef(new Map<string, number>());
  const [version, bump] = React.useReducer((n: number) => n + 1, 0);
  const active = useCreateStore<string | null>(null);

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
  const { visible, navigable } = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = [...itemsRef.current.entries()]
      .filter(([, item]) => item.haystack.includes(query))
      .sort(([, a], [, b]) => a.order - b.order);
    return {
      visible: new Set(matches.map(([id]) => id)),
      navigable: matches.filter(([, item]) => !item.disabled).map(([id]) => id),
    };
  }, [search, version]);

  const groupOf = React.useCallback((id: string) => itemsRef.current.get(id)?.groupId, []);

  // The active option stays on screen while the list filters: the first match otherwise.
  React.useLayoutEffect(() => {
    const current = active.get();
    if (current === null || !navigable.includes(current)) active.set(navigable[0] ?? null);
  }, [navigable, active]);

  const value = React.useMemo(
    () => ({
      labels,
      search,
      setSearch,
      listboxId,
      active,
      registerItem,
      visible,
      navigable,
      groupOf,
    }),
    [labels, search, setSearch, listboxId, active, registerItem, visible, navigable, groupOf],
  );

  return <CommandMenuProvider value={value}>{children}</CommandMenuProvider>;
}

// ─── Root ────────────────────────────────────────────────────────────────────

export type CommandMenuRootProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue"
> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The query (controlled); together with `onValueChange`. Cleared when the palette closes. */
  value?: string;
  /** The initial query, uncontrolled. Default `""`. */
  defaultValue?: string;
  /** Called with the new query (typing, and `""` when the palette closes). */
  onValueChange?: (value: string) => void;
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
  children: React.ReactNode;
  /** The dialog panel. */
  ref?: React.Ref<HTMLDivElement>;
};

function CommandMenuRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  value,
  defaultValue = "",
  onValueChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  size = "m",
  labels: labelsProp,
  className,
  children,
  ...rest
}: CommandMenuRootProps) {
  const labels = React.useMemo(() => ({ ...COMMAND_MENU_LABELS, ...labelsProp }), [labelsProp]);
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [search, setSearch] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  // Every opening starts with an empty query.
  const wasOpenRef = React.useRef(isOpen);
  React.useEffect(() => {
    if (wasOpenRef.current && !isOpen) setSearch("");
    wasOpenRef.current = isOpen;
  }, [isOpen, setSearch]);

  return (
    <Modal.Root
      open={isOpen}
      onOpenChange={setOpen}
      closeOnEscape={closeOnEscape}
      closeOnOutsideClick={closeOnOutsideClick}
    >
      <Modal.Content
        {...rest}
        className={cx(styles.content, className)}
        overlayClassName={styles.overlay}
      >
        {/* `display: contents`: carries the tier variables without breaking the panel's flex column. */}
        <div className={cx(menu.tier, styles.tier)} data-size={size}>
          <ControlSizeProvider value={size}>
            <CommandMenuState labels={labels} search={search} setSearch={setSearch}>
              {children}
            </CommandMenuState>
          </ControlSizeProvider>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
CommandMenuRoot.displayName = "CommandMenu.Root";

// ─── Title / Description ─────────────────────────────────────────────────────

export type CommandMenuTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "id"> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

/** Visible heading above the search row; names the dialog. */
function CommandMenuTitle({ className, ...rest }: CommandMenuTitleProps) {
  return <Modal.Title className={cx(styles.title, className)} {...rest} />;
}
CommandMenuTitle.displayName = "CommandMenu.Title";

export type CommandMenuDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "id"> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

/** Secondary line under the title; describes the dialog. */
function CommandMenuDescription({ className, ...rest }: CommandMenuDescriptionProps) {
  return <Modal.Description className={cx(styles.description, className)} {...rest} />;
}
CommandMenuDescription.displayName = "CommandMenu.Description";

// ─── Input ───────────────────────────────────────────────────────────────────

export type CommandMenuInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "role" | "value" | "defaultValue"
> & {
  ref?: React.Ref<HTMLInputElement>;
};

/**
 * The search row: a search icon and the query field (the query is `CommandMenu.Root` `value`). It
 * is the permanent focus of the palette, so it draws no focus ring (foundation §7); focus lands
 * here on open; arrows, Home, End and Enter drive the list from it.
 */
function CommandMenuInput({
  className,
  onKeyDown,
  onChange,
  placeholder,
  "aria-label": ariaLabel,
  ...rest
}: CommandMenuInputProps) {
  const { labels, search, setSearch, listboxId, active, navigable } = useCommandMenuContext();
  const activeId = useStoreSlice(active, (id) => id);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || navigable.length === 0) return;
    const current = active.get();
    const index = current ? navigable.indexOf(current) : -1;
    const last = navigable.length - 1;
    const next: Record<string, number> = {
      ArrowDown: index < 0 || index === last ? 0 : index + 1,
      ArrowUp: index <= 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (event.key in next) {
      event.preventDefault();
      active.set(navigable[next[event.key]] ?? null);
    } else if (event.key === "Enter" && current) {
      event.preventDefault();
      document.getElementById(optionId(current))?.click();
    }
  };

  return (
    <div className={cx(menu.searchRow, styles.inputRow)} data-focus-ring="false">
      <Icon name="action.search" size="m" />
      <input
        {...rest}
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
        data-autofocus=""
        className={cx(menu.searchInput, styles.input, className)}
        value={search}
        onChange={(event) => {
          onChange?.(event);
          setSearch(event.target.value);
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
  ref?: React.Ref<HTMLDivElement>;
};

/** A labelled section of items; hidden while none of its items match the query. */
function CommandMenuGroup({ className, ...rest }: CommandMenuGroupProps) {
  const groupId = React.useId();
  const { visible, groupOf } = useCommandMenuContext();
  const hasVisible = [...visible].some((id) => groupOf(id) === groupId);

  return (
    <CommandMenuGroupContext.Provider value={groupId}>
      <MenuGroup
        {...rest}
        hidden={hasVisible ? undefined : true}
        className={cx(styles.group, className)}
      />
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
  /** Unavailable right now: shown muted with `aria-disabled`, skipped by the arrows, not runnable. */
  disabled?: boolean;
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
  children,
  ...rest
}: CommandMenuItemProps) {
  const id = React.useId();
  const groupId = React.useContext(CommandMenuGroupContext);
  const { registerItem, active: activeStore, visible, search } = useCommandMenuContext();
  const nodeRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRefs(nodeRef, ref);

  React.useLayoutEffect(
    () =>
      registerItem(id, {
        haystack: `${value} ${keywords}`.trim().toLowerCase(),
        disabled,
        groupId,
      }),
    [id, value, keywords, disabled, groupId, registerItem],
  );

  const shown = visible.has(id);
  // Only this item's slice of the active option: moving it re-renders two rows.
  const active = useStoreSlice(activeStore, (current) => current === id);
  const usable = shown && !disabled;

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
      aria-disabled={disabled || undefined}
      hidden={shown ? undefined : true}
      className={cx(menu.item, styles.item, className)}
      {...toDataAttributes({ highlighted: active || undefined, disabled: disabled || undefined })}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!event.defaultPrevented && usable && !active) activeStore.set(id);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !usable) return;
        activeStore.set(id);
        onSelect?.();
      }}
    >
      {highlightChildren(children, search)}
    </button>
  );
}
CommandMenuItem.displayName = "CommandMenu.Item";

export type CommandMenuItemIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Leading glyph of an item at the tier icon size (a kit `Icon` follows it). */
function CommandMenuItemIcon({ className, ...rest }: CommandMenuItemIconProps) {
  return <span aria-hidden="true" className={cx(menu.itemIcon, className)} {...rest} />;
}
CommandMenuItemIcon.displayName = "CommandMenu.ItemIcon";

export type CommandMenuItemTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Second line (path, details): caption, muted. */
  description?: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Item text: a title with an ellipsis and an optional description line. */
function CommandMenuItemText({
  description,
  children,
  className,
  ...rest
}: CommandMenuItemTextProps) {
  const { search } = useCommandMenuContext();
  return (
    <span className={cx(styles.itemText, className)} {...rest}>
      <span className={styles.itemLabel}>{highlightChildren(children, search)}</span>
      {description ? (
        <span className={styles.itemDescription}>{highlightChildren(description, search)}</span>
      ) : null}
    </span>
  );
}
CommandMenuItemText.displayName = "CommandMenu.ItemText";

export type CommandMenuItemShortcutProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

/** Key hint at the end of an item (a Kbd one tier below). A hint only — not a handler. */
function CommandMenuItemShortcut({ className, ...rest }: CommandMenuItemShortcutProps) {
  return <Kbd className={cx(menu.shortcut, className)} {...rest} />;
}
CommandMenuItemShortcut.displayName = "CommandMenu.ItemShortcut";

// ─── Empty / Footer ──────────────────────────────────────────────────────────

export type CommandMenuEmptyProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Shown only while nothing matches the query: `labels.empty` and `labels.emptyHint`; `children`
 * is an action under them.
 */
function CommandMenuEmpty({ children, ...rest }: CommandMenuEmptyProps) {
  const { visible, labels } = useCommandMenuContext();
  if (visible.size > 0) return null;
  return (
    <EmptyPage.Root layout="compact" role="status" {...rest}>
      <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
      {labels.emptyHint ? <EmptyPage.Description>{labels.emptyHint}</EmptyPage.Description> : null}
      {children ? <EmptyPage.Actions>{children}</EmptyPage.Actions> : null}
    </EmptyPage.Root>
  );
}
CommandMenuEmpty.displayName = "CommandMenu.Empty";

export type CommandMenuFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Bottom row of key hints, hairline above. */
function CommandMenuFooter({ className, ...rest }: CommandMenuFooterProps) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}
CommandMenuFooter.displayName = "CommandMenu.Footer";

export type CommandMenuFooterHintProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Keys (text or icons), each in its own Kbd. */
  keys: React.ReactNode[];
  ref?: React.Ref<HTMLSpanElement>;
};

/** A footer hint: keys and what they do («↑ ↓ Навигация»). */
function CommandMenuFooterHint({ keys, children, className, ...rest }: CommandMenuFooterHintProps) {
  return (
    <span className={cx(styles.footerHint, className)} {...rest}>
      {keys.map((key, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a static list of keys
        <Kbd key={index}>{key}</Kbd>
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

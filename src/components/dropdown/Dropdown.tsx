import * as React from "react";

import { Avatar, type AvatarRootProps } from "@/components/avatar/Avatar";
import { Divider } from "@/components/divider/Divider";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Kbd } from "@/components/kbd/Kbd";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Thumbnail, type ThumbnailRootProps } from "@/components/thumbnail/Thumbnail";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import {
  type AnchorPoint,
  DEFAULT_ALIGN,
  DEFAULT_SIDE,
  type PositionAlign,
  type PositionSide,
} from "@/hooks/usePosition";
import { Icon } from "@/icons";
import { AUTOFILL_OFF } from "@/internal/autofill";
import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldInputTextClass, fieldTierClass } from "@/internal/fieldClasses";
import { highlightChildren } from "@/internal/HighlightMatch";
import { iconSlotClass } from "@/internal/iconBox";
import { InteractiveElement } from "@/internal/interactiveElement";
import { useLabels } from "@/internal/labels";
import {
  handleListboxKeyDown,
  isComposingKey,
  type ListboxRegistry,
  revealHighlighted,
  type Store,
  useCreateStore,
  useListboxItem,
  useListboxRegistry,
  useListboxView,
  useStoreSlice,
} from "@/internal/listbox";
import { MenuGroup, type MenuGroupProps } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { nodeText } from "@/internal/nodeText";
import {
  FloatingPanel,
  FloatingTrigger,
  type PanelMeasure,
} from "@/internal/overlay/FloatingPanel";
import { useAnchorName } from "@/internal/overlay/useAnchorName";
import { floatingTriggerProps, useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { useOpenState } from "@/internal/overlay/useOpenState";
import { rovingIndex } from "@/internal/rovingFocus";
import { Slot, type SlotPartProps, slotChild } from "@/internal/slot";
import { type ControlSize, OVERLAY_CONTENT_SIZE, type Tone, tierMappings } from "@/internal/states";
import textRole from "@/internal/textRole.module.css";
import textTone from "@/internal/textTone.module.css";

import styles from "./Dropdown.module.css";

export type DropdownLabels = {
  /** Default placeholder and accessible name of `Dropdown.Search`. */
  search: string;
  /** Shown under the search while no item matches the query. */
  empty: string;
};

export const DROPDOWN_LABELS: DropdownLabels = {
  search: "Поиск",
  empty: "Ничего не найдено",
};

type DropdownContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  triggerId: string;
  menuId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
  anchorPoint: AnchorPoint | null;
  labels: DropdownLabels;
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
  labels?: Partial<DropdownLabels>;
  children: React.ReactNode;
};

function DropdownRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  anchorPoint = null,
  labels: labelsProp,
  children,
}: DropdownRootProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
  const labels = useLabels(DROPDOWN_LABELS, labelsProp);
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
      labels,
    }),
    [isOpen, setOpen, id, closeOnOutsideClick, closeOnEscape, anchorPoint, labels],
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
  ':is([role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]):not([data-disabled="true"], [hidden])';

/** The field `Dropdown.Search` renders: focus lands on it when the menu opens. */
const SEARCH_FIELD = "[data-dropdown-search]";

/** Arrow keys, Home and End move focus between the enabled items, wrapping around. */
function moveFocus(event: React.KeyboardEvent<HTMLElement>) {
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ENABLED_ITEM));
  const current = items.indexOf(document.activeElement as HTMLElement);
  const next = rovingIndex(event.key, current, items.length, "vertical");
  if (next === null) return;
  event.preventDefault();
  items[next]?.focus();
}

/**
 * The menu's own state: the query of `Dropdown.Search`, the items it leaves on screen (the
 * listbox registry: matches, persistent items, the empty state) and, while there is a search,
 * the highlighted item (`aria-activedescendant` of the field; focus stays in it).
 */
type DropdownMenuContextValue = {
  searchable: boolean;
  query: string;
  setQuery: (query: string) => void;
  /** The query has text: items filter, separators step aside. */
  searching: boolean;
  registry: ListboxRegistry;
  highlight: Store<string | undefined>;
  listRef: React.RefObject<HTMLElement | null>;
};

const [DropdownMenuProvider, useDropdownMenuContext] =
  createComponentContext<DropdownMenuContextValue>("Dropdown.Content");

/** The members of a `Dropdown.Group`: the group hides while a query leaves none of them. */
const DropdownGroupContext = React.createContext<Set<string> | null>(null);

/** The shown, enabled items of the list in their order: what the highlight walks. */
function navigableItems(list: HTMLElement | null): HTMLElement[] {
  return list ? Array.from(list.querySelectorAll<HTMLElement>(ENABLED_ITEM)) : [];
}

export type DropdownContentProps = Omit<React.HTMLAttributes<HTMLElement>, "role"> & {
  side?: PositionSide;
  align?: PositionAlign;
  size?: ControlSize;
  width?: "auto" | PanelMeasure;
  maxRows?: number;
  matchTriggerWidth?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

const isSearchPart = (node: React.ReactNode) =>
  React.isValidElement(node) && node.type === DropdownSearch;

function DropdownContent({
  side = DEFAULT_SIDE,
  align = DEFAULT_ALIGN,
  size = OVERLAY_CONTENT_SIZE,
  width = "auto",
  maxRows,
  matchTriggerWidth = false,
  className,
  style,
  children,
  onKeyDown,
  ...rest
}: DropdownContentProps) {
  const {
    isOpen,
    setOpen,
    triggerRef,
    menuId,
    closeOnOutsideClick,
    closeOnEscape,
    anchorPoint,
    labels,
  } = useDropdownContext("Dropdown.Content");

  const nodes = React.Children.toArray(children);
  const search = nodes.find(isSearchPart);
  const searchable = search !== undefined;
  const items = searchable ? nodes.filter((node) => !isSearchPart(node)) : children;

  // WAI-ARIA menu button: focus goes to the first item (the search field when there is one);
  // Escape, a pick and Tab return it to the trigger (Tab then moves on); an outside press leaves
  // focus where the pointer put it.
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
    focusOnOpen: searchable ? SEARCH_FIELD : ENABLED_ITEM,
    tabExit: "always",
    sheet: true,
  });
  const name = useAnchorName(isOpen, false, triggerRef);

  const [query, setQuery] = React.useState("");
  const registry = useListboxRegistry();
  const highlight = useCreateStore<string | undefined>(undefined);
  const listRef = React.useRef<HTMLElement | null>(null);
  const searching = searchable && query.trim() !== "";
  const view = useListboxView(registry, query, searching);

  // Every opening starts with an empty query.
  React.useLayoutEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  // The highlight follows the query to its first match (an item that stays whatever the query —
  // «Новый чат» — only when nothing matches), and stays on screen while the list changes.
  const lastQuery = React.useRef(query);
  const matchCount = view.matchCount;
  React.useLayoutEffect(() => {
    if (!searchable || !isOpen || !floating.mounted) return;
    const shown = navigableItems(listRef.current);
    const current = highlight.get();
    const queryChanged = lastQuery.current !== query;
    lastQuery.current = query;
    if (!queryChanged && current !== undefined && shown.some((item) => item.id === current)) return;
    const match =
      searching && matchCount > 0
        ? shown.find((item) => !item.hasAttribute("data-persistent"))
        : null;
    highlight.set((match ?? shown[0])?.id);
  }, [searchable, isOpen, floating.mounted, query, searching, matchCount, highlight]);

  const menuContext = React.useMemo(
    () => ({ searchable, query, setQuery, searching, registry, highlight, listRef }),
    [searchable, query, searching, registry, highlight],
  );

  const rows =
    maxRows !== undefined && maxRows > 0
      ? {
          "data-rows": "",
          style: { ...style, "--menu-rows": Math.floor(maxRows) } as React.CSSProperties,
        }
      : { style };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    // The search field drives the highlight itself; focus never leaves it for an item.
    if (!event.defaultPrevented && !(event.target as Element).matches(SEARCH_FIELD)) {
      moveFocus(event);
    }
  };

  if (!searchable) {
    return (
      <DropdownMenuProvider value={menuContext}>
        <FloatingPanel
          {...rest}
          {...name}
          {...rows}
          floating={floating}
          size={size}
          width={width}
          scroll
          id={menuId}
          role="menu"
          className={cx(fieldTierClass, menu.tier, menu.menu, className)}
          onKeyDown={handleKeyDown}
        >
          {children}
        </FloatingPanel>
      </DropdownMenuProvider>
    );
  }

  // With a search the panel holds the field, the scrolling menu under it and the empty state.
  return (
    <DropdownMenuProvider value={menuContext}>
      <FloatingPanel
        {...rest}
        {...rows}
        floating={floating}
        size={size}
        width={width}
        className={cx(fieldTierClass, menu.tier, menu.menu, menu.searchPanel, className)}
        onKeyDown={handleKeyDown}
      >
        {search}
        <ScrollContainer
          {...name}
          ref={listRef}
          id={menuId}
          role="menu"
          edges="shadow"
          className={menu.panelList}
          hidden={view.visible.size === 0 ? true : undefined}
        >
          {items}
        </ScrollContainer>
        {searching && view.matchCount === 0 ? (
          <EmptyPage.Root layout="compact" size={size} role="status">
            <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
          </EmptyPage.Root>
        ) : null}
      </FloatingPanel>
    </DropdownMenuProvider>
  );
}
DropdownContent.displayName = "Dropdown.Content";

export type DropdownSearchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "role" | "value" | "defaultValue"
> & {
  ref?: React.Ref<HTMLInputElement>;
};

/**
 * The search row at the top of the menu: a search icon and the query field. Focus lands here on
 * open and stays here: the arrows move the highlight over the shown items, Enter runs the
 * highlighted one; Space, Home and End edit the text. It is the permanent focus of the panel, so
 * it draws no ring (foundation §7).
 */
function DropdownSearch({
  className,
  placeholder,
  onChange,
  onKeyDown,
  "aria-label": ariaLabel,
  ...rest
}: DropdownSearchProps) {
  const { labels, menuId } = useDropdownContext("Dropdown.Search");
  const { query, setQuery, highlight, listRef } = useDropdownMenuContext("Dropdown.Search");
  const highlighted = useStoreSlice(highlight, (id) => id);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || isComposingKey(event)) return;
    // In the field Space, Home and End edit the text.
    if ([" ", "Home", "End"].includes(event.key)) return;
    const ids = navigableItems(listRef.current).map((item) => item.id);
    const moved = handleListboxKeyDown(event, {
      ids,
      highlight,
      // The item's own activation: `onSelect` and close, a toggle, a link's navigation.
      activate: (id) => document.getElementById(id)?.click(),
    });
    if (moved !== null) revealHighlighted(document.getElementById(moved));
  };

  return (
    <div className={cx(menu.searchRow, menu.panelSearch, fieldInputTextClass)}>
      <Icon name="action.search" size="s" />
      <input
        {...rest}
        type="search"
        placeholder={placeholder ?? labels.search}
        aria-label={ariaLabel ?? (rest["aria-labelledby"] ? undefined : labels.search)}
        aria-controls={menuId}
        aria-activedescendant={highlighted}
        {...AUTOFILL_OFF}
        autoCorrect="off"
        spellCheck={false}
        data-dropdown-search=""
        className={cx(menu.searchInput, className)}
        value={query}
        onChange={(event) => {
          onChange?.(event);
          setQuery(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
DropdownSearch.displayName = "Dropdown.Search";

/** What a search does to an item (`Dropdown.Item`, `Dropdown.CheckboxItem`). */
type SearchItemProps = {
  keywords?: string;
  persistent?: boolean;
};

export type DropdownItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "onSelect"
> &
  SearchItemProps & {
    onSelect?: () => void;
    selected?: boolean;
    disabled?: boolean;
    tone?: Extract<Tone, "neutral" | "danger">;
    asChild?: boolean;
    /** The item element: `<button>`, or the `asChild` element. */
    ref?: React.Ref<HTMLButtonElement>;
  };

const isType = (node: React.ReactNode, type: unknown) =>
  React.isValidElement(node) && node.type === type;

/**
 * Lays out an item's content: leading `ItemIcon`s, the label (it truncates first), a
 * `Dropdown.ItemDescription` under it, then a trailing `ItemMeta` and `ItemShortcut`. With a
 * description or a meta the label names the item (`aria-labelledby`) and they describe it
 * (`aria-describedby`): the reason under a disabled item, the time of a thread are read with it,
 * not as part of its name. While a query is typed the matching part of the label and the
 * description is marked.
 */
function useItemContent(children: React.ReactNode, query: string) {
  const labelId = React.useId();
  const descriptionId = React.useId();
  const metaId = React.useId();
  const tier = useOptionalControlSize() ?? OVERLAY_CONTENT_SIZE;
  // A person's or an object's picture leads the row at the row's media size, decorative: the label
  // names the item.
  const nodes = React.Children.toArray(children).map((node) =>
    React.isValidElement<AvatarRootProps | ThumbnailRootProps>(node) &&
    (node.type === Avatar.Root || node.type === Thumbnail.Root)
      ? React.cloneElement(node, {
          size: node.props.size ?? tierMappings.rowMedia[tier],
          className: cx(styles.media, node.props.className),
          "aria-hidden": true,
        } as Partial<AvatarRootProps & ThumbnailRootProps>)
      : node,
  );
  const leading = nodes.filter(
    (node) =>
      isType(node, DropdownItemIcon) || isType(node, Avatar.Root) || isType(node, Thumbnail.Root),
  );
  const description = nodes.filter((node) => isType(node, DropdownItemDescription));
  const meta = nodes.filter((node) => isType(node, DropdownItemMeta));
  const shortcut = nodes.filter((node) => isType(node, DropdownItemShortcut));
  const label = nodes.filter(
    (node) =>
      !leading.includes(node) &&
      !description.includes(node) &&
      !meta.includes(node) &&
      !shortcut.includes(node),
  );
  const text = `${nodeText(label)} ${nodeText(description)}`;
  const labelNode = highlightChildren(label, query);

  if (description.length === 0 && meta.length === 0) {
    return {
      text,
      aria: null,
      content: (
        <>
          {leading}
          <span className={styles.itemLabel}>{labelNode}</span>
          {shortcut}
        </>
      ),
    };
  }
  const described = [description.length > 0 && descriptionId, meta.length > 0 && metaId];
  const labelSpan = (
    <span id={labelId} className={styles.itemLabel}>
      {labelNode}
    </span>
  );
  return {
    text,
    aria: {
      "aria-labelledby": labelId,
      "aria-describedby": described.filter(Boolean).join(" "),
    },
    content: (
      <>
        {leading}
        {description.length > 0 ? (
          <span className={styles.itemBody}>
            {labelSpan}
            <span id={descriptionId} className={styles.itemSlot}>
              {description.map((node) =>
                React.isValidElement<{ children?: React.ReactNode }>(node)
                  ? React.cloneElement(
                      node,
                      undefined,
                      highlightChildren(node.props.children, query),
                    )
                  : node,
              )}
            </span>
          </span>
        ) : (
          labelSpan
        )}
        {meta.length > 0 ? (
          <span id={metaId} className={styles.itemSlot}>
            {meta}
          </span>
        ) : null}
        {shortcut}
      </>
    ),
  };
}

/**
 * An item of the menu as the search sees it: registered with its text (label, description,
 * `keywords`), hidden while a query does not match it (a `persistent` item always shows), lit
 * while highlighted from the search field, and its group told that it belongs there.
 */
function useSearchItem(
  id: string,
  text: string,
  { keywords = "", persistent = false, disabled }: SearchItemProps & { disabled: boolean },
) {
  const { searchable, searching, query, registry, highlight } =
    useDropdownMenuContext("Dropdown.Item");
  const group = React.useContext(DropdownGroupContext);
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const haystack = `${text} ${keywords}`.trim().toLocaleLowerCase();

  useListboxItem(
    registry,
    id,
    { label: text, haystack, disabled, persistent, onActivate: () => nodeRef.current?.click() },
    nodeRef,
  );
  React.useLayoutEffect(() => {
    if (!group) return;
    group.add(id);
    return () => {
      group.delete(id);
    };
  }, [group, id]);

  const { visible } = useListboxView(registry, query, searching);
  const shown = !searching || visible.has(id);
  const highlighted = useStoreSlice(highlight, (current) => searchable && current === id);

  return {
    nodeRef,
    shown,
    props: {
      id,
      hidden: shown ? undefined : true,
      ...toDataAttributes({
        highlighted: highlighted || undefined,
        persistent: persistent || undefined,
      }),
      // The pointer moves the highlight too, so the keyboard goes on from where it is.
      onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
        if (!event.defaultPrevented && searchable && shown && !disabled && !highlighted) {
          highlight.set(id);
        }
      },
    },
  };
}

/**
 * An item is no tab stop (`tabIndex -1`): the menu moves focus between items with the arrow keys
 * (roving focus), and Tab leaves the menu. A disabled item runs no handler at all, the consumer's
 * `onClick` included (`InteractiveElement`).
 */
function DropdownItem({
  onSelect,
  selected,
  disabled = false,
  tone = "neutral",
  asChild = false,
  keywords,
  persistent,
  id: idProp,
  className,
  onClick,
  onPointerMove,
  children,
  ref,
  ...rest
}: DropdownItemProps) {
  const { setOpen } = useDropdownContext("Dropdown.Item");
  const { query } = useDropdownMenuContext("Dropdown.Item");
  const autoId = React.useId();
  const child = asChild ? slotChild(children, "Dropdown.Item") : null;
  const { content, aria, text } = useItemContent(child ? child.props.children : children, query);
  const search = useSearchItem(idProp ?? autoId, text, { keywords, persistent, disabled });
  const mergedRef = useMergedRefs(search.nodeRef, ref);

  const itemProps = {
    ...rest,
    ...aria,
    ...search.props,
    ref: mergedRef,
    // A choice of one (a person, a status): the chosen item is checked, the others are not.
    role: selected === undefined ? "menuitem" : "menuitemradio",
    "aria-checked": selected,
    tabIndex: -1,
    disabled,
    // A danger row takes its ink from the tone ladder; a disabled row keeps the disabled ink.
    className: cx(
      menu.item,
      menu.focusRow,
      tone === "danger" && !disabled && cx(textTone.tone, menu.tonedRow),
      styles.item,
      className,
    ),
    ...toDataAttributes({
      tone,
      disabled: disabled || undefined,
      checked: selected || undefined,
    }),
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      onPointerMove?.(event as React.PointerEvent<HTMLButtonElement>);
      search.props.onPointerMove(event);
    },
    // Enter and Space reach here as the native click (Enter only on a link).
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      if (event.defaultPrevented) return;
      onSelect?.();
      setOpen(false);
    },
  };

  const check =
    selected === undefined ? null : (
      <span className={menu.check} aria-hidden="true">
        {selected ? <Icon name="action.check" /> : null}
      </span>
    );
  if (child) {
    // A link keeps its native click: a modified click opens a new tab and the menu still closes.
    return (
      <InteractiveElement {...itemProps} element="slot">
        {React.cloneElement(
          child,
          undefined,
          <>
            {content}
            {check}
          </>,
        )}
      </InteractiveElement>
    );
  }
  return (
    <InteractiveElement {...itemProps} element="button">
      {content}
      {check}
    </InteractiveElement>
  );
}
DropdownItem.displayName = "Dropdown.Item";

export type DropdownCheckboxItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "onSelect" | "onChange" | "defaultChecked"
> &
  SearchItemProps & {
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
  keywords,
  persistent,
  id: idProp,
  className,
  onClick,
  onPointerMove,
  children,
  ref,
  ...rest
}: DropdownCheckboxItemProps) {
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const { query } = useDropdownMenuContext("Dropdown.CheckboxItem");
  const autoId = React.useId();
  const { content, aria, text } = useItemContent(children, query);
  const search = useSearchItem(idProp ?? autoId, text, { keywords, persistent, disabled });
  const mergedRef = useMergedRefs(search.nodeRef, ref);

  return (
    <InteractiveElement
      {...rest}
      {...aria}
      {...search.props}
      ref={mergedRef}
      element="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={-1}
      disabled={disabled}
      className={cx(menu.item, menu.focusRow, styles.item, className)}
      {...toDataAttributes({ disabled: disabled || undefined, checked: checked || undefined })}
      onPointerMove={(event) => {
        onPointerMove?.(event as React.PointerEvent<HTMLButtonElement>);
        search.props.onPointerMove(event);
      }}
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
  return (
    <span aria-hidden="true" className={cx(menu.itemIcon, iconSlotClass, className)} {...rest} />
  );
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

export type DropdownItemMetaProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * A muted meta at the end of an item, on the label's line (the time of a thread, a count): it
 * never shrinks or wraps — the label truncates first. It describes the item; the label names it.
 */
function DropdownItemMeta({ className, ...rest }: DropdownItemMetaProps) {
  return <span className={cx(menu.itemMeta, className)} {...rest} />;
}
DropdownItemMeta.displayName = "Dropdown.ItemMeta";

export type DropdownItemDescriptionProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "id"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * Muted second line of an item, under its label: what the action does, or why a disabled item is
 * unavailable («Доступно владельцу проекта»). Wraps instead of widening the menu past its limit.
 */
function DropdownItemDescription({ className, ...rest }: DropdownItemDescriptionProps) {
  return <span className={cx(menu.itemDescription, className)} {...rest} />;
}
DropdownItemDescription.displayName = "Dropdown.ItemDescription";

export type DropdownGroupProps = MenuGroupProps;

/** A labelled group of items; hidden while a query leaves none of them. */
function DropdownGroup(props: DropdownGroupProps) {
  const [members] = React.useState(() => new Set<string>());
  const { registry, query, searching } = useDropdownMenuContext("Dropdown.Group");
  // Re-renders when the items register or the query changes.
  const { visible } = useListboxView(registry, query, searching);
  const shown = !searching || [...members].some((id) => visible.has(id));
  return (
    <DropdownGroupContext.Provider value={members}>
      <MenuGroup {...props} hidden={shown ? props.hidden : true} />
    </DropdownGroupContext.Provider>
  );
}
DropdownGroup.displayName = "Dropdown.Group";

export type DropdownSeparatorProps = Omit<DivProps, "children">;

/** A full-bleed hairline between items or groups; it steps aside while a query filters them. */
function DropdownSeparator({ className, ...rest }: DropdownSeparatorProps) {
  const { searching } = useDropdownMenuContext("Dropdown.Separator");
  if (searching) return null;
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
  return <div className={cx(textRole.caption, styles.description, className)} {...rest} />;
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
  Search: DropdownSearch,
  Header: DropdownHeader,
  Title: DropdownTitle,
  Description: DropdownDescription,
  Group: DropdownGroup,
  Item: DropdownItem,
  CheckboxItem: DropdownCheckboxItem,
  ItemIcon: DropdownItemIcon,
  ItemDescription: DropdownItemDescription,
  ItemMeta: DropdownItemMeta,
  ItemShortcut: DropdownItemShortcut,
  Separator: DropdownSeparator,
};

import * as React from "react";
import { Avatar } from "@/components/avatar/Avatar";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Divider } from "@/components/divider/Divider";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Kbd } from "@/components/kbd/Kbd";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import {
  type AnchorPoint,
  DEFAULT_ALIGN,
  DEFAULT_SIDE,
  type PositionAlign,
  type PositionSide,
} from "@/hooks/usePosition";
import { Search } from "@/icons/glyphs/search";

import { AUTOFILL_OFF } from "@/internal/autofill";
import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldInputTextClass, fieldTierClass } from "@/internal/fieldClasses";
import { highlightChildren } from "@/internal/HighlightMatch";
import { HeaderLineContent } from "@/internal/headerRow";
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
import { type ListRowLines, ListRowMark, listRowStyles } from "@/internal/listRow";
import {
  MenuGroup,
  type MenuGroupProps,
  MenuRowCheck,
  menuRowProps,
  menuRowTier,
} from "@/internal/MenuGroup";
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
import { type ControlSize, OVERLAY_CONTENT_SIZE, type Tone } from "@/internal/states";
import textRole from "@/internal/textRole.module.css";

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
          className={cx(fieldTierClass, menu.tier, menu.menu, menu.list, className)}
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
          className={cx(menu.list, menu.panelList)}
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
      <Search size="s" />
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

/** The row an item part stands in: its panel's tier and whether it has a description. */
type DropdownItemContextValue = { panel: ControlSize; lines: ListRowLines };

const DropdownItemContext = React.createContext<DropdownItemContextValue>({
  panel: OVERLAY_CONTENT_SIZE,
  lines: "line",
});

/**
 * Lays out an item's content in the list row's places: the leading mark (`ItemIcon`, an
 * `Avatar.Root` or a `Thumbnail.Root`), the label (it truncates first) with a
 * `Dropdown.ItemDescription` under it, then the end: `ItemMeta`, `ItemShortcut` and the check.
 * With a description or a meta the label names the item (`aria-labelledby`) and they describe it
 * (`aria-describedby`): the reason under a disabled item, the time of a thread are read with it,
 * not as part of its name. While a query is typed the matching part of the label and the
 * description is marked.
 */
function useItemContent(
  children: React.ReactNode,
  query: string,
  { start = null, end = null }: { start?: React.ReactNode; end?: React.ReactNode } = {},
) {
  const labelId = React.useId();
  const descriptionId = React.useId();
  const metaId = React.useId();
  const panel = useOptionalControlSize() ?? OVERLAY_CONTENT_SIZE;
  const nodes = React.Children.toArray(children);
  const description = nodes.filter((node) => isType(node, DropdownItemDescription));
  const lines: ListRowLines = description.length > 0 ? "two" : "line";
  const isPicture = (node: React.ReactNode) =>
    isType(node, Avatar.Root) || isType(node, Thumbnail.Root);
  const leading = nodes.filter((node) => isType(node, DropdownItemIcon) || isPicture(node));
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
  const named = description.length > 0 || meta.length > 0;
  const described = [description.length > 0 && descriptionId, meta.length > 0 && metaId];

  const content = (
    <DropdownItemContext value={{ panel, lines }}>
      {start}
      {leading.map((node, index) =>
        // A person's or an object's picture leads the row at the row's mark size, decorative:
        // the label names the item.
        isPicture(node) ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: the leading marks keep their order
          <ListRowMark key={index} size={menuRowTier(panel)} lines={lines}>
            {node}
          </ListRowMark>
        ) : (
          node
        ),
      )}
      <span className={listRowStyles.body}>
        <span id={named ? labelId : undefined} className={listRowStyles.title}>
          {highlightChildren(label, query)}
        </span>
        {description.length > 0 ? (
          <span id={descriptionId} className={styles.itemSlot}>
            {description.map((node) =>
              React.isValidElement<{ children?: React.ReactNode }>(node)
                ? React.cloneElement(node, undefined, highlightChildren(node.props.children, query))
                : node,
            )}
          </span>
        ) : null}
      </span>
      {meta.length > 0 || shortcut.length > 0 || end !== null ? (
        <span className={listRowStyles.end}>
          {meta.length > 0 ? (
            <span id={metaId} className={styles.itemSlot}>
              {meta}
            </span>
          ) : null}
          {shortcut}
          {end}
        </span>
      ) : null}
    </DropdownItemContext>
  );
  return {
    text,
    lines,
    panel,
    aria: named
      ? {
          "aria-labelledby": labelId,
          "aria-describedby": described.filter(Boolean).join(" "),
        }
      : null,
    content,
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
    highlighted,
    props: {
      id,
      hidden: shown ? undefined : true,
      ...toDataAttributes({ persistent: persistent || undefined }),
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
  // A choice of one (a person, a status): the chosen item has the check at the end, the place held
  // on the others; the row is not filled.
  const { content, aria, text, lines, panel } = useItemContent(
    child ? child.props.children : children,
    query,
    { end: selected === undefined ? null : <MenuRowCheck checked={selected} /> },
  );
  const search = useSearchItem(idProp ?? autoId, text, { keywords, persistent, disabled });
  const mergedRef = useMergedRefs(search.nodeRef, ref);
  const row = menuRowProps({
    size: menuRowTier(panel),
    lines,
    highlighted: search.highlighted,
    disabled,
    danger: tone === "danger",
    focusFill: true,
    className: cx(styles.item, className),
  });

  const itemProps = {
    ...rest,
    ...aria,
    ...search.props,
    ...row,
    ref: mergedRef,
    role: selected === undefined ? "menuitem" : "menuitemradio",
    "aria-checked": selected,
    tabIndex: -1,
    disabled,
    "data-tone": tone,
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
  const panel = useOptionalControlSize() ?? OVERLAY_CONTENT_SIZE;
  // A choice of several: the checkbox column at the start, a checked row in the accent's tone.
  const { content, aria, text, lines } = useItemContent(children, query, {
    start: (
      <span className={listRowStyles.indicator}>
        <Checkbox.Indicator checked={checked} disabled={disabled} size={menuRowTier(panel)} />
      </span>
    ),
  });
  const search = useSearchItem(idProp ?? autoId, text, { keywords, persistent, disabled });
  const mergedRef = useMergedRefs(search.nodeRef, ref);

  return (
    <InteractiveElement
      {...rest}
      {...aria}
      {...search.props}
      {...menuRowProps({
        size: menuRowTier(panel),
        lines,
        highlighted: search.highlighted,
        disabled,
        checked,
        focusFill: true,
        className: cx(styles.item, className),
      })}
      ref={mergedRef}
      element="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={-1}
      disabled={disabled}
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
    </InteractiveElement>
  );
}
DropdownCheckboxItem.displayName = "Dropdown.CheckboxItem";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type DropdownItemIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The leading mark of an item: a glyph of the row's tier, bare beside one line, on a tile beside a
 * description (a kit `Icon` follows it).
 */
function DropdownItemIcon({ children, ...rest }: DropdownItemIconProps) {
  const { panel, lines } = React.useContext(DropdownItemContext);
  return (
    <ListRowMark {...rest} size={menuRowTier(panel)} lines={lines}>
      {children}
    </ListRowMark>
  );
}
DropdownItemIcon.displayName = "Dropdown.ItemIcon";

export type DropdownItemShortcutProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

/** Key hint at the end of an item (a Kbd one tier below the menu). A hint only — not a handler. */
function DropdownItemShortcut({ className, ...rest }: DropdownItemShortcutProps) {
  return <Kbd className={cx(styles.shortcut, className)} {...rest} />;
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
  return <span className={cx(listRowStyles.meta, className)} {...rest} />;
}
DropdownItemMeta.displayName = "Dropdown.ItemMeta";

export type DropdownItemDescriptionProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "id"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * Muted second line of an item, under its label: what the action does, or why a disabled item is
 * unavailable («Доступно владельцу проекта»). One line cut with an ellipsis; a `StatusDot` first.
 */
function DropdownItemDescription({ className, children, ...rest }: DropdownItemDescriptionProps) {
  return (
    <span className={cx(listRowStyles.description, className)} {...rest}>
      <HeaderLineContent>{children}</HeaderLineContent>
    </span>
  );
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

import * as React from "react";

import { Button } from "@/components/button/Button";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Kbd } from "@/components/kbd/Kbd";
import { Modal } from "@/components/modal/Modal";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useStateSwap } from "@/hooks/useStateSwap";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { highlightChildren } from "@/internal/HighlightMatch";
import { type Store, useCreateStore, useLoadMore, useStoreSlice } from "@/internal/listbox";
import { MenuGroup } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { focusInto } from "@/internal/overlay/focus";
import type { ControlSize } from "@/internal/states";
import swapMotion from "@/internal/swapMotion.module.css";
import { isPromiseLike } from "@/internal/usePendingChanges";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./CommandMenu.module.css";

export type CommandMenuLabels = {
  /** Default placeholder and accessible name of `CommandMenu.Input`. */
  search: string;
  /** `CommandMenu.Empty`: nothing matches the query. */
  empty: string;
  /** Second line of `CommandMenu.Empty`; `""` hides it. */
  emptyHint: string;
  /** Announced while `loading` or `loadingMore`. */
  loading: string;
  /** The retry button of the load error (`onRetry`). */
  retry: string;
};

const COMMAND_MENU_LABELS: CommandMenuLabels = {
  search: "Поиск",
  empty: "Ничего не найдено",
  emptyHint: "Попробуйте изменить запрос",
  loading: "Загрузка…",
  retry: "Повторить",
};

/** Skeleton rows while the first results load / while more load at the end. */
const LOADING_ROWS = 5;
const LOADING_MORE_ROWS = 2;

// ─── Item registry and filtering ─────────────────────────────────────────────

type ItemEntry = {
  order: number;
  /** `value` and `keywords`, lower-cased: what the query is matched against. */
  haystack: string;
  disabled: boolean;
  groupId: string;
  /** An item inside `CommandMenu.Empty`: shown with it, never counted as a match. */
  persistent: boolean;
};

type ItemRegistration = Omit<ItemEntry, "order">;

/** What the list shows besides its items: the first results loading, a load error, or items. */
type RegionState = "loading" | "error" | "ready";

type LoadProps = {
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: (() => void | Promise<void>) | undefined;
  loadError: React.ReactNode;
  /** Runs `onRetry` once at a time (the button and Enter share it); undefined without `onRetry`. */
  onRetry: (() => void) | undefined;
  /** A promise from `onRetry` is pending: the retry button is loading. */
  retrying: boolean;
};

type CommandMenuContextValue = LoadProps & {
  labels: CommandMenuLabels;
  size: ControlSize;
  search: string;
  setSearch: (search: string) => void;
  listboxId: string;
  /** The active option; items subscribe to their own slice of it. */
  active: Store<string | null>;
  registerItem: (id: string, item: ItemRegistration) => () => void;
  /** Items shown (matches, and the items of a shown `Empty`), disabled ones too. */
  visible: ReadonlySet<string>;
  /** Items that match the query, without the items of `Empty`. */
  matchCount: number;
  /** Enabled shown items in render order: what the arrows walk. */
  navigable: string[];
  groupOf: (id: string) => string | undefined;
  region: RegionState;
  /** The list's own scroller (the load-more observer root). */
  listRef: React.RefObject<HTMLElement | null>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** Asks for more once per round (the keyboard reached the last item). */
  requestMore: () => void;
};

const [CommandMenuProvider, useCommandMenuContext] =
  createComponentContext<CommandMenuContextValue>("CommandMenu");

const CommandMenuGroupContext = React.createContext("");
/** Items rendered inside `CommandMenu.Empty` (a «Создать …» action) do not count as matches. */
const CommandMenuEmptyContext = React.createContext(false);

const optionId = (id: string) => `${id}-option`;

const hasContent = (node: React.ReactNode) => node != null && node !== false && node !== "";

/** Lives as long as the open dialog: the item registry, the matches and the active option. */
function CommandMenuState({
  labels,
  size,
  search,
  setSearch,
  filter,
  load,
  children,
}: {
  labels: CommandMenuLabels;
  size: ControlSize;
  search: string;
  setSearch: (search: string) => void;
  filter: boolean;
  load: LoadProps;
  children: React.ReactNode;
}) {
  const listboxId = React.useId();
  const itemsRef = React.useRef(new Map<string, ItemEntry>());
  const orderRef = React.useRef(new Map<string, number>());
  const [version, bump] = React.useReducer((n: number) => n + 1, 0);
  const active = useCreateStore<string | null>(null);
  const listRef = React.useRef<HTMLElement | null>(null);

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
  const { visible, navigable, matchCount } = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const shown = [...itemsRef.current.entries()]
      .filter(([, item]) => item.persistent || !filter || item.haystack.includes(query))
      .sort(([, a], [, b]) => a.order - b.order);
    return {
      visible: new Set(shown.map(([id]) => id)),
      navigable: shown.filter(([, item]) => !item.disabled).map(([id]) => id),
      matchCount: shown.filter(([, item]) => !item.persistent).length,
    };
  }, [search, filter, version]);

  const groupOf = React.useCallback((id: string) => itemsRef.current.get(id)?.groupId, []);

  // The active option stays on screen while the list filters: the first match otherwise.
  React.useLayoutEffect(() => {
    const current = active.get();
    if (current === null || !navigable.includes(current)) active.set(navigable[0] ?? null);
  }, [navigable, active]);

  const hasError = hasContent(load.loadError);
  const region: RegionState = hasError
    ? "error"
    : load.loading && matchCount === 0
      ? "loading"
      : "ready";

  const { sentinelRef, request: requestMore } = useLoadMore({
    enabled:
      region === "ready" &&
      load.hasMore &&
      Boolean(load.onLoadMore) &&
      !load.loading &&
      !load.loadingMore,
    onLoadMore: load.onLoadMore,
    scrollRef: listRef,
    rearm: version,
  });

  const value = React.useMemo(
    () => ({
      ...load,
      labels,
      size,
      search,
      setSearch,
      listboxId,
      active,
      registerItem,
      visible,
      matchCount,
      navigable,
      groupOf,
      region,
      listRef,
      sentinelRef,
      requestMore,
    }),
    [
      load,
      labels,
      size,
      search,
      setSearch,
      listboxId,
      active,
      registerItem,
      visible,
      matchCount,
      navigable,
      groupOf,
      region,
      sentinelRef,
      requestMore,
    ],
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
  /** The query (controlled); together with `onSearchChange`. Cleared when the palette closes. */
  search?: string;
  /** The initial query, uncontrolled. Default `""`. */
  defaultSearch?: string;
  /** Called with the new query (typing, and `""` when the palette closes). */
  onSearchChange?: (search: string) => void;
  /**
   * The palette filters its items by the query. `false` when the results come from a server:
   * every item shows, highlighting of the query stays.
   */
  filter?: boolean;
  /** The first results are loading: skeleton rows while no item matches; `aria-busy`. */
  loading?: boolean;
  /** More results are loading at the end: skeleton rows after the items. */
  loadingMore?: boolean;
  /** More results exist: reaching the end of the list calls `onLoadMore`. */
  hasMore?: boolean;
  /** Asked once per round when the end of the list scrolls into view or the arrows reach it. */
  onLoadMore?: () => void | Promise<void>;
  /** The results failed to load: replaces the list with the message in `role="alert"`. */
  loadError?: React.ReactNode;
  /**
   * A retry button (`labels.retry`) under `loadError`; Enter in the search field runs it too.
   * Return the request's promise: the button is loading and takes no second press until it
   * settles; resolve — swap `loadError` for the results; reject — the error stays.
   */
  onRetry?: () => void | Promise<void>;
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
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  filter = true,
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  loadError,
  onRetry,
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
    value: searchProp,
    defaultValue: defaultSearch,
    onChange: onSearchChange,
  });
  const [retrying, setRetrying] = React.useState(false);
  const retryingRef = React.useRef(false);
  const retry = React.useMemo(
    () =>
      onRetry
        ? () => {
            if (retryingRef.current) return;
            const outcome = onRetry();
            if (!isPromiseLike(outcome)) return;
            retryingRef.current = true;
            setRetrying(true);
            const done = () => {
              retryingRef.current = false;
              setRetrying(false);
            };
            outcome.then(done, done);
          }
        : undefined,
    [onRetry],
  );
  const load = React.useMemo<LoadProps>(
    () => ({ loading, loadingMore, hasMore, onLoadMore, loadError, onRetry: retry, retrying }),
    [loading, loadingMore, hasMore, onLoadMore, loadError, retry, retrying],
  );

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
            <CommandMenuState
              labels={labels}
              size={size}
              search={search}
              setSearch={setSearch}
              filter={filter}
              load={load}
            >
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
 * The search row: a search icon and the query field (the query is `CommandMenu.Root` `search`). It
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
  const {
    labels,
    search,
    setSearch,
    listboxId,
    active,
    navigable,
    region,
    onRetry,
    loading,
    loadingMore,
    requestMore,
  } = useCommandMenuContext();
  const activeId = useStoreSlice(active, (id) => id);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (region === "error") {
      if (event.key === "Enter" && onRetry) {
        event.preventDefault();
        onRetry();
      }
      return;
    }
    if (navigable.length === 0) return;
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
      // The keyboard reached the end: ask for more, as the sentinel does for scrolling.
      if (next[event.key] === last) requestMore();
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
        aria-busy={loading || loadingMore || undefined}
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

/** Skeleton rows in the option geometry; decorative (the list carries `aria-busy`). */
function SkeletonRows({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <div
      // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder rows
      key={index}
      aria-hidden="true"
      className={cx(menu.item, menu.skeletonRow, styles.item)}
      data-skeleton=""
    >
      <Skeleton />
    </div>
  ));
}

/**
 * The scrolling `role="listbox"` of results under the search row. It also draws the load states:
 * skeleton rows while the first results load, a load error with a retry, skeleton rows at the end
 * while more load; the states cross-fade.
 */
function CommandMenuList({ className, children, ref, ...rest }: CommandMenuListProps) {
  const {
    listboxId,
    labels,
    size,
    region,
    loading,
    loadingMore,
    hasMore,
    loadError,
    onRetry,
    retrying,
    listRef,
    sentinelRef,
  } = useCommandMenuContext();
  const mergedRef = useMergedRefs(listRef, ref);
  // The first render stays still; every later state fades in (foundation §1 rule 7).
  const swapped = useStateSwap(region);
  const swapClass = swapped ? swapMotion.swapIn : undefined;

  // The retry button leaves with the error: focus goes back to the search field, not the page.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on every region swap
  React.useEffect(() => {
    const dialog = listRef.current?.closest<HTMLElement>('[role="dialog"]');
    if (!swapped || !dialog || dialog.dataset.state === "closed") return;
    if (!dialog.contains(document.activeElement)) focusInto(dialog);
  }, [region, swapped, listRef]);

  return (
    <>
      <ScrollContainer
        {...rest}
        ref={mergedRef}
        id={listboxId}
        role="listbox"
        aria-busy={loading || loadingMore || undefined}
        hidden={region === "error" ? true : undefined}
        className={cx(styles.list, className)}
      >
        <div key={swapped ? region : undefined} className={cx(styles.region, swapClass)}>
          {/* Items render while loading too: they register, and the first match ends the state. */}
          {children}
          {region === "loading" ? <SkeletonRows count={LOADING_ROWS} /> : null}
          {region === "ready" && hasMore ? (
            <div ref={sentinelRef} aria-hidden="true" className={menu.loadSentinel} />
          ) : null}
          {region === "ready" && loadingMore ? <SkeletonRows count={LOADING_MORE_ROWS} /> : null}
        </div>
      </ScrollContainer>
      {region === "error" ? (
        <EmptyPage.Root layout="compact" size={size} role="alert" className={swapClass}>
          <EmptyPage.Title as="p">{loadError}</EmptyPage.Title>
          {onRetry ? (
            <EmptyPage.Actions>
              <Button.Root variant="soft" tone="neutral" loading={retrying} onClick={onRetry}>
                <Button.Icon>
                  <Icon name="action.refresh" />
                </Button.Icon>
                {labels.retry}
              </Button.Root>
            </EmptyPage.Actions>
          ) : null}
        </EmptyPage.Root>
      ) : null}
      <VisuallyHidden aria-live="polite">
        {loading || loadingMore ? labels.loading : ""}
      </VisuallyHidden>
    </>
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
  const persistent = React.useContext(CommandMenuEmptyContext);
  const { registerItem, active: activeStore, visible, search } = useCommandMenuContext();
  const nodeRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRefs(nodeRef, ref);

  React.useLayoutEffect(
    () =>
      registerItem(id, {
        haystack: `${value} ${keywords}`.trim().toLowerCase(),
        disabled,
        groupId,
        persistent,
      }),
    [id, value, keywords, disabled, groupId, persistent, registerItem],
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
 * Shown only while nothing matches the query and nothing loads: `labels.empty` and
 * `labels.emptyHint`; `children` is an action under them — a button, or a `CommandMenu.Item`
 * («Создать «…»») that the arrows and Enter reach and that never counts as a match.
 */
function CommandMenuEmpty({ children, ...rest }: CommandMenuEmptyProps) {
  const { matchCount, labels, region } = useCommandMenuContext();
  if (matchCount > 0 || region !== "ready") return null;
  return (
    <EmptyPage.Root layout="compact" role="status" {...rest}>
      <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
      {labels.emptyHint ? <EmptyPage.Description>{labels.emptyHint}</EmptyPage.Description> : null}
      {children ? (
        <EmptyPage.Actions>
          <CommandMenuEmptyContext.Provider value={true}>
            {children}
          </CommandMenuEmptyContext.Provider>
        </EmptyPage.Actions>
      ) : null}
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

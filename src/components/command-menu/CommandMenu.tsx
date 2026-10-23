import * as React from "react";

import { Button } from "@/components/button/Button";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Kbd } from "@/components/kbd/Kbd";
import { Modal } from "@/components/modal/Modal";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { AUTOFILL_OFF } from "@/internal/autofill";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldInputTextClass, fieldTierClass } from "@/internal/fieldClasses";
import { highlightChildren } from "@/internal/HighlightMatch";
import { hasContent } from "@/internal/hasContent";
import { iconSlotClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import {
  handleListboxKeyDown,
  type ListboxRegistry,
  revealHighlighted,
  type Store,
  useCreateStore,
  useListboxItem,
  useListboxRegistry,
  useListboxView,
  useStoreSlice,
} from "@/internal/listbox";
import { MenuGroup } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { RegionSwap } from "@/internal/RegionSwap";
import type { ControlSize } from "@/internal/states";
import { usePendingAction } from "@/internal/usePendingChanges";

import styles from "./CommandMenu.module.css";

export type CommandMenuLabels = {
  /** Default placeholder and accessible name of `CommandMenu.Input`. */
  search: string;
  /** `CommandMenu.Empty`: nothing matches the query. */
  empty: string;
  /** Announced while `loading` or `loadingMore`. */
  loading: string;
  /** The retry button of the load error (`onRetry`). */
  retry: string;
};

export const COMMAND_MENU_LABELS: CommandMenuLabels = {
  search: "Поиск",
  empty: "Ничего не найдено",
  loading: "Загрузка…",
  retry: "Повторить",
};

/** Skeleton rows while the first results load / while more load at the end. */
const LOADING_ROWS = 5;
const LOADING_MORE_ROWS = 2;

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
  filter: boolean;
  listboxId: string;
  /** The items of the palette (`@/internal/listbox`): the query view, Enter, the highlight's node. */
  registry: ListboxRegistry;
  /** The active option; items subscribe to their own slice of it. */
  active: Store<string | undefined>;
  region: RegionState;
  /** The list's own scroller (the load-more observer root). */
  listRef: React.RefObject<HTMLElement | null>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** Asks for more once per round (the keyboard reached the last item). */
  requestMore: () => void;
};

const [CommandMenuProvider, useCommandMenuContext] =
  createComponentContext<CommandMenuContextValue>("CommandMenu");

/** The items of a `CommandMenu.Group`: the group hides while none of them is shown. */
const CommandMenuGroupContext = React.createContext<Set<string> | null>(null);

const optionId = (id: string) => `${id}-option`;

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
  const registry = useListboxRegistry();
  const view = useListboxView(registry, search, filter);
  const active = useCreateStore<string | undefined>(undefined);
  const listRef = React.useRef<HTMLElement | null>(null);

  // The active option stays on screen while the list filters: the first match otherwise.
  React.useLayoutEffect(() => {
    const current = active.get();
    if (current === undefined || !view.navigable.includes(current)) {
      active.set(view.navigable[0]);
    }
  }, [view, active]);

  const region: RegionState = hasContent(load.loadError)
    ? "error"
    : load.loading && view.matchCount === 0
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
    round: view,
  });

  const value = React.useMemo(
    () => ({
      ...load,
      labels,
      size,
      search,
      setSearch,
      filter,
      listboxId,
      registry,
      active,
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
      filter,
      listboxId,
      registry,
      active,
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
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  filter?: boolean;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void | Promise<void>;
  loadError?: React.ReactNode;
  onRetry?: () => void | Promise<void>;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  size?: ControlSize;
  labels?: Partial<CommandMenuLabels>;
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
  size: sizeProp,
  labels: labelsProp,
  className,
  children,
  ...rest
}: CommandMenuRootProps) {
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const labels = useLabels(COMMAND_MENU_LABELS, labelsProp);
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
  const { pending: retrying, run: retry } = usePendingAction(onRetry);
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
      <Modal.Content {...rest} size="l" placement="top" className={cx(styles.content, className)}>
        {/* `display: contents`: carries the tier variables without breaking the panel's flex column. */}
        <div className={cx(fieldTierClass, menu.tier, styles.tier)} data-size={size}>
          {tier.provide(
            <CommandMenuState
              labels={labels}
              size={size}
              search={search}
              setSearch={setSearch}
              filter={filter}
              load={load}
            >
              {children}
            </CommandMenuState>,
          )}
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
    filter,
    listboxId,
    registry,
    active,
    region,
    onRetry,
    loading,
    loadingMore,
    requestMore,
  } = useCommandMenuContext();
  const activeId = useStoreSlice(active, (id) => id);
  const { navigable } = useListboxView(registry, search, filter);

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
    // Space types into the query: only Enter runs the active command.
    if (event.key === " ") return;
    const moved = handleListboxKeyDown(event, {
      ids: navigable,
      highlight: active,
      activate: (id) => registry.activate(id),
    });
    if (moved === null) return;
    revealHighlighted(registry.nodeOf(moved));
    // The keyboard reached the end: ask for more, as the sentinel does for scrolling.
    if (moved === navigable.at(-1)) requestMore();
  };

  return (
    // The palette's search is a field of tier `l` (its text and height), whatever the rows' tier.
    <div
      className={cx(menu.searchRow, fieldTierClass, fieldInputTextClass, styles.inputRow)}
      data-size="l"
    >
      <Icon name="action.search" />
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
        {...AUTOFILL_OFF}
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
      className={cx(menu.item, menu.itemPalette, menu.skeletonRow)}
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
  // A swap keeps the leaving list on screen a moment: the new one keeps the refs.
  const mergedRef = useMergedRefs(listRef, ref);
  const setSentinelRef = useMergedRefs(sentinelRef);
  const regionRef = React.useRef<HTMLDivElement>(null);

  // The retry button leaves with the error: focus goes back to the search field, not the list.
  const returnToSearch = () => {
    const dialog = regionRef.current?.closest<HTMLElement>('[role="dialog"]');
    if (!dialog || dialog.dataset.state === "closed") return;
    const inside = dialog.contains(document.activeElement);
    if (inside && !regionRef.current?.contains(document.activeElement)) return;
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
  };

  return (
    <>
      {/* A load state swap cross-fades the region (foundation §1 rule 7). */}
      <RegionSwap ref={regionRef} state={region} fill onSwap={returnToSearch}>
        {region === "error" ? (
          <EmptyPage.Root layout="compact" size={size} role="alert">
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
        ) : (
          <ScrollContainer
            {...rest}
            ref={mergedRef}
            // An open layer: the end of the list never scrolls the page behind the dialog.
            overscrollBehavior="contain"
            id={listboxId}
            role="listbox"
            aria-busy={loading || loadingMore || undefined}
            className={cx(styles.list, className)}
          >
            {/* Items render while loading too: they register, and the first match ends it. */}
            {children}
            {region === "loading" ? <SkeletonRows count={LOADING_ROWS} /> : null}
            {region === "ready" && hasMore ? (
              <div ref={setSentinelRef} aria-hidden="true" className={menu.loadSentinel} />
            ) : null}
            {region === "ready" && loadingMore ? <SkeletonRows count={LOADING_MORE_ROWS} /> : null}
          </ScrollContainer>
        )}
      </RegionSwap>
      <VisuallyHidden live="polite">{loading || loadingMore ? labels.loading : ""}</VisuallyHidden>
    </>
  );
}
CommandMenuList.displayName = "CommandMenu.List";

export type CommandMenuGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  label?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** A labelled section of items; hidden while none of its items match the query. */
function CommandMenuGroup({ className, ...rest }: CommandMenuGroupProps) {
  const [members] = React.useState(() => new Set<string>());
  const { registry, search, filter } = useCommandMenuContext();
  // Re-renders when the items register or the query changes.
  const { visible } = useListboxView(registry, search, filter);
  const hasVisible = [...members].some((id) => visible.has(id));

  return (
    <CommandMenuGroupContext.Provider value={members}>
      <MenuGroup {...rest} hidden={hasVisible ? undefined : true} className={className} />
    </CommandMenuGroupContext.Provider>
  );
}
CommandMenuGroup.displayName = "CommandMenu.Group";

// ─── Item and its parts ──────────────────────────────────────────────────────

export type CommandMenuItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "id" | "onSelect"
> & {
  value: string;
  keywords?: string;
  disabled?: boolean;
  persistent?: boolean;
  onSelect?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
};

function CommandMenuItem({
  className,
  value,
  keywords = "",
  disabled = false,
  persistent = false,
  onSelect,
  onClick,
  onPointerMove,
  ref,
  children,
  ...rest
}: CommandMenuItemProps) {
  const id = React.useId();
  const group = React.useContext(CommandMenuGroupContext);
  const { registry, active: activeStore, search, filter } = useCommandMenuContext();
  const nodeRef = React.useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRefs(nodeRef, ref);
  const haystack = `${value} ${keywords}`.trim().toLowerCase();

  useListboxItem(
    registry,
    id,
    {
      label: value,
      haystack,
      disabled,
      persistent,
      onActivate: () => {
        activeStore.set(id);
        onSelect?.();
      },
    },
    nodeRef,
  );
  React.useLayoutEffect(() => {
    if (!group) return;
    group.add(id);
    return () => {
      group.delete(id);
    };
  }, [group, id]);

  const { visible } = useListboxView(registry, search, filter);
  const shown = visible.has(id);
  // Only this item's slice of the active option: moving it re-renders two rows.
  const active = useStoreSlice(activeStore, (current) => current === id);

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
      className={cx(menu.item, menu.itemPalette, className)}
      {...toDataAttributes({ highlighted: active || undefined, disabled: disabled || undefined })}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!event.defaultPrevented && shown && !disabled && !active) activeStore.set(id);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && shown) registry.activate(id);
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
  return (
    <span aria-hidden="true" className={cx(menu.itemIcon, iconSlotClass, className)} {...rest} />
  );
}
CommandMenuItemIcon.displayName = "CommandMenu.ItemIcon";

export type CommandMenuItemTextProps = React.HTMLAttributes<HTMLSpanElement> & {
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
        <span className={cx(menu.itemDescription, styles.itemDescription)}>
          {highlightChildren(description, search)}
        </span>
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

export type CommandMenuEmptyProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "role" | "children"
> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Shown only while nothing matches the query and nothing loads: `labels.empty`, text only. An action for the query («Создать «…»») is a `persistent`
 * `CommandMenu.Item` at the end of the list, never a child of `Empty`.
 */
function CommandMenuEmpty(props: CommandMenuEmptyProps) {
  const { registry, search, filter, labels, region, size } = useCommandMenuContext();
  const { matchCount } = useListboxView(registry, search, filter);
  if (matchCount > 0 || region !== "ready") return null;
  return (
    <EmptyPage.Root layout="compact" size={size} role="status" {...props}>
      <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
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

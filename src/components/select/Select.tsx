import * as React from "react";

import { Button } from "@/components/button/Button";
import { Divider } from "@/components/divider/Divider";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Spinner } from "@/components/spinner/Spinner";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useStateSwap } from "@/hooks/useStateSwap";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldTriggerClass } from "@/internal/fieldClasses";
import {
  enabledOptions,
  handleListboxKeyDown,
  optionDomId,
  type Store,
  useCreateStore,
  useLoadMore,
  useStoreSlice,
  useTypeahead,
} from "@/internal/listbox";
import { MenuGroup, type MenuGroupProps } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { FloatingPanel } from "@/internal/overlay/FloatingPanel";
import { focusInto } from "@/internal/overlay/focus";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import type { ControlSize } from "@/internal/states";
import swapMotion from "@/internal/swapMotion.module.css";
import { touchTargetBlockClass } from "@/internal/touchTarget";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";
import { VisuallyHidden, visuallyHiddenClass } from "@/internal/VisuallyHidden";

import styles from "./Select.module.css";
import {
  isActionValue,
  SelectAction,
  SelectItem,
  SelectItemDescription,
  SelectItemIcon,
  SelectItemMeta,
  SelectItemText,
  sizeMedia,
  splitItemChildren,
} from "./SelectItem";
import {
  createItemRegistry,
  normalize,
  type SelectContextValue,
  type SelectLabels,
  SelectProvider,
  useSelectContext,
} from "./selectContext";

export type {
  SelectActionProps,
  SelectItemDescriptionProps,
  SelectItemIconProps,
  SelectItemMetaProps,
  SelectItemProps,
  SelectItemTextProps,
} from "./SelectItem";
export type { SelectLabels } from "./selectContext";

const SELECT_LABELS: SelectLabels = {
  search: "Поиск",
  empty: "Ничего не найдено",
  emptyHint: "Попробуйте изменить запрос",
  loading: "Загрузка…",
  retry: "Повторить",
  clear: "Очистить",
  optional: "необязательно",
  changeFailed: "Не удалось сохранить выбор",
};

// ─── Root ────────────────────────────────────────────────────────────────────

type SelectRootBase = FieldRootDomProps &
  FieldFrameProps & {
    size?: ControlSize;
    disabled?: boolean;
    placeholder?: string;
    /** Danger ring and `aria-invalid`; a non-empty `error` implies it. */
    invalid?: boolean;
    /** Id of the trigger; generated when omitted. */
    id?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Clear segment in the trigger (and `Delete` / `Backspace` on it) while a value is selected. */
    clearable?: boolean;
    /** Form field name: hidden inputs submit the value (one per value with `multiple`). */
    name?: string;
    /** The search query (`Select.Content searchable`), controlled; cleared when the list closes. */
    search?: string;
    /** The initial query, uncontrolled. Default `""`. */
    defaultSearch?: string;
    /** Called with the new query: typing, and `""` when the list closes. */
    onSearchChange?: (search: string) => void;
    /**
     * The list filters its items by the query. `false` when the results come from a server: every
     * item shows, highlighting of the query stays.
     */
    filter?: boolean;
    /**
     * Options are loading: a Spinner instead of the chevron, `aria-busy`, skeleton rows in the list
     * while no item matches (items on screen stay).
     */
    loading?: boolean;
    /** More options are loading at the end: skeleton rows after the items. */
    loadingMore?: boolean;
    /** More options exist: reaching the end of the list calls `onLoadMore`. */
    hasMore?: boolean;
    /** Asked once per round when the end of the list scrolls into view or the highlight reaches it. */
    onLoadMore?: () => void | Promise<void>;
    /** The options failed to load: replaces the list with the message in `role="alert"`. */
    loadError?: React.ReactNode;
    /** A retry button (`labels.retry`) under `loadError`; Enter in the open list runs it too. */
    onRetry?: () => void;
    labels?: Partial<SelectLabels>;
    className?: string;
    children: React.ReactNode;
  };

type SelectSingleProps = {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  /**
   * Picked value; `""` after clearing. Return the save's promise: the value shows at once with a
   * Spinner on the trigger and picks wait; resolve keeps it, reject rolls it back and announces
   * `labels.changeFailed`.
   */
  onValueChange?: (value: string) => void | Promise<void>;
};

type SelectMultipleProps = {
  /** `string[]` value, checkboxes in the list, the list stays open on a pick. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  /** The new list; a promise as in single mode. */
  onValueChange?: (value: string[]) => void | Promise<void>;
};

export type SelectRootProps = SelectRootBase & (SelectSingleProps | SelectMultipleProps);

function SelectRoot(props: SelectRootProps) {
  const {
    size = "m",
    label,
    required = false,
    optional,
    hint,
    error,
    invalid,
    focusRing = true,
    disabled: disabledProp = false,
    placeholder,
    id,
    open,
    defaultOpen = false,
    onOpenChange,
    clearable = false,
    name,
    search,
    defaultSearch = "",
    onSearchChange,
    filter = true,
    loading = false,
    loadingMore = false,
    hasMore = false,
    onLoadMore,
    loadError,
    onRetry,
    labels: labelsProp,
    className,
    children,
    multiple: _multiple,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    ...rest
  } = props;
  const multiple = props.multiple === true;
  const disabled = useInheritedDisabled(disabledProp);
  const labels = React.useMemo(() => ({ ...SELECT_LABELS, ...labelsProp }), [labelsProp]);
  const ids = useFieldFrame(id, { hint, error, invalid });

  const [stored, setStored] = useControllableState<string | string[] | undefined>({
    value: props.value,
    defaultValue: props.defaultValue ?? (multiple ? [] : undefined),
  });
  // A value the owner is still saving is drawn ahead of its answer.
  const changes = usePendingChanges(stored, takeNext);
  const value = changes.shown;
  const saving = changes.pending.length > 0;
  const [announcement, setAnnouncement] = React.useState("");
  const onValueChange = props.onValueChange as
    | ((value: string | string[]) => void | Promise<void>)
    | undefined;

  /** Hands the new value to the owner; a promise holds it pending, picks wait until it settles. */
  const commit = (next: string | string[]) => {
    if (saving || Object.is(next, value)) return;
    const outcome = onValueChange?.(next);
    if (!isPromiseLike(outcome)) {
      setStored(next);
      return;
    }
    setAnnouncement("");
    changes.track(next, outcome, {
      onResolve: () => setStored(next),
      onReject: () => setAnnouncement(labels.changeFailed),
    });
  };
  const commitRef = React.useRef(commit);
  commitRef.current = commit;

  const selected = React.useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value],
  );

  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const highlight = useCreateStore<string | undefined>(undefined);
  const [registry] = React.useState(createItemRegistry);
  const [query, setQuery] = useControllableState({
    value: search,
    defaultValue: defaultSearch,
    onChange: onSearchChange,
  });
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  // Closing (also from outside, through `open`) resets the search.
  const wasOpenRef = React.useRef(isOpen);
  React.useEffect(() => {
    if (wasOpenRef.current && !isOpen) setQuery("");
    wasOpenRef.current = isOpen;
  }, [isOpen, setQuery]);

  const pick = React.useCallback(
    (optionValue: string) => {
      if (multiple) {
        const list = Array.isArray(value) ? value : [];
        commitRef.current(
          list.includes(optionValue)
            ? list.filter((item) => item !== optionValue)
            : [...list, optionValue],
        );
        return;
      }
      commitRef.current(optionValue);
      // Focus goes back to the trigger (the floating layer's close policy).
      setOpen(false);
    },
    [multiple, value, setOpen],
  );

  const clear = React.useCallback(() => commitRef.current(multiple ? [] : ""), [multiple]);

  const context = React.useMemo<SelectContextValue>(
    () => ({
      size,
      invalid: ids.invalid,
      focusRing,
      required,
      disabled,
      placeholder,
      multiple,
      selected,
      registry,
      pick,
      clear,
      clearable,
      loading,
      saving,
      loadingMore,
      hasMore,
      onLoadMore,
      loadError,
      onRetry,
      filter,
      isOpen,
      setOpen,
      highlight,
      query,
      setQuery,
      triggerId: ids.controlId,
      listboxId: `${ids.controlId}-listbox`,
      describedBy: ids.describedBy,
      triggerRef,
      labels,
    }),
    [
      size,
      ids.invalid,
      ids.controlId,
      ids.describedBy,
      focusRing,
      required,
      disabled,
      placeholder,
      multiple,
      selected,
      registry,
      pick,
      clear,
      clearable,
      loading,
      saving,
      loadingMore,
      hasMore,
      onLoadMore,
      loadError,
      onRetry,
      filter,
      isOpen,
      setOpen,
      highlight,
      query,
      setQuery,
      labels,
    ],
  );

  return (
    <FieldFrame
      {...rest}
      size={size}
      ids={ids}
      label={label}
      required={required}
      optional={optional}
      hint={hint}
      error={error}
      disabled={disabled}
      optionalLabel={labels.optional}
      className={className}
    >
      <SelectProvider value={context}>
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </SelectProvider>
      {name
        ? (selected.length > 0 || multiple ? selected : [""]).map((item) => (
            <input key={item} type="hidden" name={name} value={item} disabled={disabled} />
          ))
        : null}
      <VisuallyHidden role="status" aria-live="polite">
        {announcement}
      </VisuallyHidden>
    </FieldFrame>
  );
}
SelectRoot.displayName = "Select.Root";

const takeNext = (_current: string | string[] | undefined, next: string | string[]) => next;

// ─── Trigger ─────────────────────────────────────────────────────────────────

export type SelectTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "id" | "type" | "role"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

function SelectTrigger({
  className,
  children,
  onClick,
  onKeyDown,
  "aria-describedby": ariaDescribedBy,
  ref,
  ...rest
}: SelectTriggerProps) {
  const {
    isOpen,
    setOpen,
    triggerId,
    listboxId,
    disabled,
    size,
    invalid,
    focusRing,
    required,
    describedBy,
    triggerRef,
    loading,
    saving,
    clearable,
    selected,
    clear,
    labels,
  } = useSelectContext();
  const mergedRef = useMergedRefs(triggerRef, ref);
  // Only a `Select.TriggerIcon`, no `Select.Value`: a compact trigger (the glyph and the chevron)
  // for a dense row; the value is still spoken from a hidden `Select.Value`.
  const parts = React.Children.toArray(children);
  const iconOnly =
    parts.some((node) => React.isValidElement(node) && node.type === SelectTriggerIcon) &&
    !parts.some((node) => React.isValidElement(node) && node.type === SelectValue);
  // Options loading and a value saving look the same: a Spinner in place of the chevron.
  const busy = loading || saving;
  const showClear = clearable && selected.length > 0 && !disabled && !busy;

  return (
    <button
      {...rest}
      ref={mergedRef}
      id={triggerId}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-invalid={invalid || undefined}
      aria-required={required || undefined}
      aria-describedby={[ariaDescribedBy, describedBy].filter(Boolean).join(" ") || undefined}
      aria-busy={busy || undefined}
      disabled={disabled}
      className={cx(fieldTriggerClass, styles.trigger, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(!isOpen);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (["ArrowDown", "ArrowUp", " ", "Enter"].includes(event.key)) {
          event.preventDefault();
          if (!isOpen) setOpen(true);
        } else if (showClear && (event.key === "Delete" || event.key === "Backspace")) {
          event.preventDefault();
          clear();
        }
      }}
      {...toDataAttributes({
        state: isOpen ? "open" : "closed",
        size,
        invalid: invalid || undefined,
        loading: busy || undefined,
        disabled: disabled || undefined,
        "focus-ring": focusRing ? undefined : false,
        "icon-only": iconOnly || undefined,
      })}
    >
      <span className={styles.triggerMain}>
        {children}
        {iconOnly ? <SelectValue className={visuallyHiddenClass} /> : null}
      </span>
      {showClear ? (
        // A segment, not a button: interactive content inside a <button> is invalid. The keyboard
        // clears with Delete / Backspace on the trigger. A touch target in height, like the clear
        // segment of a field (`FieldAction`).
        <span
          className={cx(styles.clear, touchTargetBlockClass)}
          aria-hidden="true"
          title={labels.clear}
          data-select-clear=""
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation();
            clear();
          }}
        >
          <Icon name="action.close" />
        </span>
      ) : null}
      <span className={styles.chevron} aria-hidden="true">
        {busy ? <Spinner aria-hidden="true" /> : <Icon name="nav.chevronDown" />}
      </span>
    </button>
  );
}
SelectTrigger.displayName = "Select.Trigger";

// ─── Value / TriggerIcon ─────────────────────────────────────────────────────

/** What `renderValue` receives: the selected option. */
export type SelectValueItem = { value: string; label: string };

export type SelectValueProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /**
   * Single mode: renders the selected option in the trigger with the same parts as the row —
   * leading `Avatar.Root` / `Thumbnail.Root`, `Select.ItemText`, `Select.ItemDescription`, and a
   * trailing `Badge.Root` / `Select.ItemMeta` at the end. Not called while empty (the placeholder
   * shows) and not used in `multiple` mode.
   */
  renderValue?: (item: SelectValueItem) => React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** The picked label (labels joined in `multiple`), or the placeholder. */
function SelectValue({ renderValue, className, ...rest }: SelectValueProps) {
  const { selected, registry, placeholder, multiple, size } = useSelectContext();
  // Labels come from the items; re-read when they register.
  const text = useStoreSlice(registry.version, () => selected.map(registry.labelOf).join(", "));

  if (selected.length > 0 && renderValue && !multiple) {
    const value = selected[0] ?? "";
    const parts = splitItemChildren(renderValue({ value, label: text }));
    return (
      <span
        {...rest}
        className={cx(styles.value, className)}
        {...toDataAttributes({
          rich: parts.rich || undefined,
          media: parts.leading.length > 0 || parts.meta.length > 0 || undefined,
        })}
      >
        {sizeMedia(parts.leading, size)}
        <span className={styles.valueBody}>{parts.body}</span>
        {/* Trailing meta (a role Badge, `Select.ItemMeta`) as in the option row: at the end. */}
        {parts.meta}
      </span>
    );
  }

  return (
    <span
      {...rest}
      className={cx(styles.value, className)}
      {...toDataAttributes({ placeholder: selected.length === 0 || undefined })}
    >
      {selected.length > 0 ? text : placeholder}
    </span>
  );
}
SelectValue.displayName = "Select.Value";

export type SelectTriggerIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** A leading glyph in the trigger, before the value (decorative). */
function SelectTriggerIcon({ className, ...rest }: SelectTriggerIconProps) {
  return <span aria-hidden="true" className={cx(styles.triggerIcon, className)} {...rest} />;
}
SelectTriggerIcon.displayName = "Select.TriggerIcon";

// ─── Content ─────────────────────────────────────────────────────────────────

/** What the list shows besides its items: the first options loading, a load error, or items. */
type RegionState = "loading" | "error" | "ready";

/** Skeleton rows while the first options load / while more load at the end. */
const LOADING_ROWS = 4;
const LOADING_MORE_ROWS = 2;

const hasContent = (node: React.ReactNode) => node != null && node !== false && node !== "";

/** Skeleton rows in the option geometry; decorative (the list carries `aria-busy`). */
function SkeletonRows({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <div
      // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder rows
      key={index}
      aria-hidden="true"
      className={cx(menu.item, menu.skeletonRow)}
      data-skeleton=""
    >
      <Skeleton />
    </div>
  ));
}

export type SelectContentProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "hidden" | "onKeyDown" | "onAnimationEnd"
> & {
  /**
   * A search field on top of the list; items filter by label, description and `keywords` (or the
   * owner loads them: `Select.Root` `search`, `filter={false}`).
   */
  searchable?: boolean;
  children: React.ReactNode;
  /** The floating panel. */
  ref?: React.Ref<HTMLDivElement>;
};

function SelectContent({ searchable = false, className, children, ...rest }: SelectContentProps) {
  const {
    isOpen,
    setOpen,
    pick,
    triggerId,
    listboxId,
    triggerRef,
    highlight,
    multiple,
    size,
    query,
    setQuery,
    loading,
    saving,
    loadingMore,
    hasMore,
    onLoadMore,
    loadError,
    onRetry,
    filter,
    labels,
    registry,
  } = useSelectContext();

  const listboxRef = React.useRef<HTMLElement | null>(null);
  // `Select.Action` children stand under the scroller; everything else is the list.
  const items: React.ReactNode[] = [];
  const actions: React.ReactNode[] = [];
  for (const child of React.Children.toArray(children)) {
    (React.isValidElement(child) && child.type === SelectAction ? actions : items).push(child);
  }
  const actionsId = `${listboxId}-actions`;
  // Focus moves to the search (or the list) on open and back to the trigger after Escape, a pick
  // in single mode and Tab (which then moves on from the trigger); an outside press only closes.
  const floating = useFloatingLayer({
    open: isOpen,
    onOpenChange: setOpen,
    triggerRef,
    matchAnchorWidth: true,
    focusOnOpen: true,
    tabExit: "always",
    sheet: true,
  });

  const highlighted = useStoreSlice(highlight, (value) => value);
  const version = useStoreSlice(registry.version, (value) => value);
  const isEmpty = !registry.anyMatch(filter ? normalize(query) : "");
  const typeahead = useTypeahead();

  const region: RegionState = hasContent(loadError)
    ? "error"
    : loading && isEmpty
      ? "loading"
      : "ready";
  // The first render stays still; every later load state fades in (foundation §1 rule 7).
  const swapped = useStateSwap(region);
  const swapClass = swapped ? swapMotion.swapIn : undefined;

  const { sentinelRef, request: requestMore } = useLoadMore({
    enabled: region === "ready" && hasMore && Boolean(onLoadMore) && !loading && !loadingMore,
    onLoadMore,
    scrollRef: listboxRef,
    rearm: version,
  });

  // The highlight reached the last option (arrows, End, pointer): ask for more, as scrolling does.
  React.useEffect(() => {
    if (highlighted === undefined) return;
    if (enabledOptions(listboxRef.current).at(-1)?.dataset.value === highlighted) requestMore();
  }, [highlighted, requestMore]);

  // A swap hides or remounts the focused list: focus stays in the panel (the search, the list or
  // the retry button).
  const panelRef = floating.contentRef;
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on every region swap
  React.useEffect(() => {
    const panel = panelRef.current;
    if (isOpen && swapped && panel && !panel.contains(document.activeElement)) focusInto(panel);
  }, [region, swapped, isOpen, panelRef]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (region === "error") {
      // On the retry button Enter is its own click.
      if (event.key === "Enter" && onRetry && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        onRetry();
      }
      return;
    }
    const inSearch = event.target instanceof HTMLInputElement;
    // In the search field Space, Home and End edit the text.
    if (inSearch && [" ", "Home", "End"].includes(event.key)) return;
    // The options, then the actions under the scroller: the arrows walk both.
    const stops = enabledOptions(panelRef.current);
    const printable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (printable && !inSearch && (event.key !== " " || typeahead.isTyping())) {
      event.preventDefault();
      const match = typeahead.find(event.key, stops, highlight.get());
      if (match) {
        highlight.set(match.dataset.value);
        match.scrollIntoView?.({ block: "nearest" });
      }
      return;
    }
    handleListboxKeyDown(event, {
      items: stops,
      highlight,
      onSelect: (value) => {
        if (isActionValue(value)) document.getElementById(optionDomId(listboxId, value))?.click();
        else pick(value);
      },
    });
  };

  // Closed, the items still render (hidden, in place) so the trigger knows their labels.
  if (!floating.mounted) return <div hidden>{items}</div>;

  const activeDescendant =
    isOpen && highlighted !== undefined ? optionDomId(listboxId, highlighted) : undefined;

  return (
    <FloatingPanel
      {...rest}
      floating={floating}
      size={size}
      className={cx(menu.tier, menu.menu, styles.content, className)}
      onKeyDown={handleKeyDown}
      {...toDataAttributes({ searching: query !== "" || undefined })}
    >
      {searchable ? (
        // The permanent focus of the panel: no ring, the caret is the indicator (foundation §7).
        <div className={cx(menu.searchRow, styles.search)} data-focus-ring="false">
          <Icon name="action.search" size="s" />
          <input
            type="text"
            className={menu.searchInput}
            value={query}
            placeholder={labels.search}
            aria-label={labels.search}
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            data-autofocus=""
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      ) : null}
      <ScrollContainer
        // A load state swap remounts the list, so its new content fades in.
        key={swapped ? region : undefined}
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-multiselectable={multiple || undefined}
        aria-labelledby={triggerId}
        aria-activedescendant={searchable ? undefined : activeDescendant}
        aria-busy={loading || loadingMore || saving || undefined}
        aria-owns={actions.length > 0 && region !== "error" ? actionsId : undefined}
        tabIndex={-1}
        hidden={region === "error" ? true : undefined}
        data-autofocus={searchable || region === "error" ? undefined : ""}
        className={cx(styles.listbox, swapClass)}
      >
        {/* Items render while loading too: they register, and the first match ends the state. */}
        {items}
        {region === "loading" ? <SkeletonRows count={LOADING_ROWS} /> : null}
        {region === "ready" && hasMore ? (
          <div ref={sentinelRef} aria-hidden="true" className={menu.loadSentinel} />
        ) : null}
        {region === "ready" && loadingMore ? <SkeletonRows count={LOADING_MORE_ROWS} /> : null}
      </ScrollContainer>
      {region === "ready" && isEmpty ? (
        <EmptyPage.Root layout="compact" role="status">
          <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
          {query !== "" && labels.emptyHint ? (
            <EmptyPage.Description>{labels.emptyHint}</EmptyPage.Description>
          ) : null}
        </EmptyPage.Root>
      ) : null}
      {actions.length > 0 && region !== "error" ? (
        // Owned by the listbox (`aria-owns`): its options for assistive tech, pinned under the
        // scroller and the empty state for the eye.
        // biome-ignore lint/a11y/useSemanticElements: a group of options inside a listbox, not a form fieldset
        <div id={actionsId} role="group" className={styles.actions}>
          {actions}
        </div>
      ) : null}
      {region === "error" ? (
        <EmptyPage.Root layout="compact" size={size} role="alert" className={swapClass}>
          <EmptyPage.Title as="p">{loadError}</EmptyPage.Title>
          {onRetry ? (
            <EmptyPage.Actions>
              <Button.Root variant="soft" tone="neutral" onClick={onRetry}>
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
      <HighlightOnOpen listboxRef={listboxRef} panelRef={panelRef} highlight={highlight} />
    </FloatingPanel>
  );
}
SelectContent.displayName = "Select.Content";

/**
 * Lives inside the open panel, after the list: on open it highlights (and shows) the first
 * selected option; while searching, the first match (the first `Select.Action` when nothing
 * matches, so Enter runs it); closing clears the highlight.
 */
function HighlightOnOpen({
  listboxRef,
  panelRef,
  highlight,
}: {
  listboxRef: React.RefObject<HTMLElement | null>;
  panelRef: React.RefObject<HTMLElement | null>;
  highlight: Store<string | undefined>;
}) {
  const { isOpen, query, selected, registry } = useSelectContext();
  const selectedRef = React.useRef(selected);
  selectedRef.current = selected;
  const version = useStoreSlice(registry.version, (value) => value);

  React.useLayoutEffect(() => {
    if (!isOpen) return;
    const options = enabledOptions(listboxRef.current);
    const first = options.find((item) => selectedRef.current.includes(item.dataset.value ?? ""));
    highlight.set(first?.dataset.value);
    first?.scrollIntoView?.({ block: "nearest" });
    return () => highlight.set(undefined);
  }, [isOpen, listboxRef, highlight]);

  // The panel lists the options first, then the actions.
  React.useLayoutEffect(() => {
    if (query !== "") highlight.set(enabledOptions(panelRef.current)[0]?.dataset.value);
  }, [query, panelRef, highlight]);

  // Results that arrive later (a server search) take the highlight when it has none among them.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `version` changes when options (de)register
  React.useLayoutEffect(() => {
    if (query === "") return;
    const options = enabledOptions(listboxRef.current);
    if (!options.some((item) => item.dataset.value === highlight.get())) {
      highlight.set((options[0] ?? enabledOptions(panelRef.current)[0])?.dataset.value);
    }
  }, [version, query, listboxRef, panelRef, highlight]);

  return null;
}

// ─── Group / Separator ───────────────────────────────────────────────────────

export type SelectGroupProps = MenuGroupProps;

/** Options under a heading; hidden while the search leaves none of them. */
function SelectGroup({ className, ...rest }: SelectGroupProps) {
  return <MenuGroup {...rest} className={cx(styles.group, className)} />;
}
SelectGroup.displayName = "Select.Group";

export type SelectSeparatorProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** A full-bleed hairline between groups; hidden while searching. */
function SelectSeparator({ className, ...rest }: SelectSeparatorProps) {
  return <Divider {...rest} className={cx(menu.separator, styles.separator, className)} />;
}
SelectSeparator.displayName = "Select.Separator";

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  TriggerIcon: SelectTriggerIcon,
  Content: SelectContent,
  Item: SelectItem,
  ItemIcon: SelectItemIcon,
  ItemText: SelectItemText,
  ItemDescription: SelectItemDescription,
  ItemMeta: SelectItemMeta,
  Group: SelectGroup,
  Separator: SelectSeparator,
  Action: SelectAction,
};

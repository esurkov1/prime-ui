import * as React from "react";

import { Button } from "@/components/button/Button";
import { Divider } from "@/components/divider/Divider";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { InputSegmentContext } from "@/components/input/Input";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Spinner } from "@/components/spinner/Spinner";
import { VisuallyHidden, visuallyHiddenClass } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { AUTOFILL_OFF } from "@/internal/autofill";
import { useHostTier } from "@/internal/ControlSizeContext";
import chipTier from "@/internal/chipTier.module.css";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  type FieldFocusRingProps,
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldTierClass, fieldTriggerClass } from "@/internal/fieldClasses";
import { GlyphSwap } from "@/internal/glyphSwap";
import { hasContent } from "@/internal/hasContent";
import { useLabels } from "@/internal/labels";
import {
  handleListboxKeyDown,
  optionDomId,
  revealHighlighted,
  useCreateStore,
  useListboxRegistry,
  useListboxView,
  useStoreSlice,
  useTypeahead,
} from "@/internal/listbox";
import { MenuGroup, type MenuGroupProps } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { FloatingPanel } from "@/internal/overlay/FloatingPanel";
import { floatingTriggerProps, useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { useOpenState } from "@/internal/overlay/useOpenState";
import palette from "@/internal/palette.module.css";
import { usePartPresence } from "@/internal/partPresence";
import { RegionSwap } from "@/internal/RegionSwap";
import type { ControlSize } from "@/internal/states";
import { touchTargetBlockClass } from "@/internal/touchTarget";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

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
  type SelectContextValue,
  type SelectLabels,
  SelectProvider,
  type SelectVariant,
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
export type { SelectLabels, SelectVariant } from "./selectContext";

export const SELECT_LABELS: SelectLabels = {
  search: "Поиск",
  empty: "Ничего не найдено",
  loading: "Загрузка…",
  retry: "Повторить",
  clear: "Очистить",
  optional: "необязательно",
  changeFailed: "Не удалось сохранить выбор",
};

// ─── Root ────────────────────────────────────────────────────────────────────

type SelectRootBase = FieldRootDomProps &
  FieldFrameProps &
  FieldFocusRingProps & {
    size?: ControlSize;
    variant?: SelectVariant;
    disabled?: boolean;
    placeholder?: string;
    invalid?: boolean;
    id?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    clearable?: boolean;
    name?: string;
    search?: string;
    defaultSearch?: string;
    onSearchChange?: (search: string) => void;
    filter?: boolean;
    loading?: boolean;
    loadingMore?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void | Promise<void>;
    loadError?: React.ReactNode;
    onRetry?: () => void;
    labels?: Partial<SelectLabels>;
    className?: string;
    children: React.ReactNode;
  };

type SelectSingleProps = {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void | Promise<void>;
};

type SelectMultipleProps = {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void | Promise<void>;
};

export type SelectRootProps = SelectRootBase & (SelectSingleProps | SelectMultipleProps);

function SelectRoot(props: SelectRootProps) {
  const {
    size: sizeProp,
    variant = "field",
    label,
    required = false,
    optional,
    hint,
    hintTone,
    error,
    invalid,
    focusRing,
    disabled: disabledProp = false,
    placeholder,
    id,
    open,
    defaultOpen = false,
    onOpenChange,
    closeOnEscape = true,
    closeOnOutsideClick = true,
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
    "aria-label": ariaLabel,
    ...rest
  } = props;
  const multiple = props.multiple === true;
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(SELECT_LABELS, labelsProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid, required });

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

  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange, disabled });
  const highlight = useCreateStore<string | undefined>(undefined);
  const registry = useListboxRegistry();
  const [query, setQuery] = useControllableState({
    value: search,
    defaultValue: defaultSearch,
    onChange: onSearchChange,
  });
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  // Inside `Input.Wrapper` the select is the field's start segment: no frame of its own.
  const inSegment = React.useContext(InputSegmentContext);
  const segment = React.useMemo(
    () => (inSegment ? { label: ariaLabel } : null),
    [inSegment, ariaLabel],
  );

  // A status chip stands in a row with no label of its own: the root's `aria-label` names it.
  const statusLabel = variant === "status" && !label ? ariaLabel : undefined;

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
      variant,
      invalid: ids.invalid,
      focusRing,
      required: ids.required,
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
      closeOnEscape,
      closeOnOutsideClick,
      highlight,
      query,
      setQuery,
      triggerId: ids.controlId,
      listboxId: `${ids.controlId}-listbox`,
      describedBy: ids.describedBy,
      triggerRef,
      labels,
      segment,
      statusLabel,
    }),
    [
      size,
      variant,
      ids.invalid,
      ids.controlId,
      ids.describedBy,
      focusRing,
      ids.required,
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
      closeOnEscape,
      closeOnOutsideClick,
      highlight,
      query,
      setQuery,
      labels,
      segment,
      statusLabel,
    ],
  );

  const body = (
    <>
      <SelectProvider value={context}>{children}</SelectProvider>
      {name
        ? (selected.length > 0 || multiple ? selected : [""]).map((item) => (
            <input key={item} type="hidden" name={name} value={item} disabled={disabled} />
          ))
        : null}
      <VisuallyHidden live="polite">{announcement}</VisuallyHidden>
    </>
  );

  if (segment) {
    return tier.provide(
      <div
        {...rest}
        className={cx(styles.segment, className)}
        data-field-segment=""
        data-size={size}
      >
        {body}
      </div>,
    );
  }

  return tier.provide(
    <FieldFrame
      {...rest}
      aria-label={statusLabel === undefined ? ariaLabel : undefined}
      size={size}
      ids={ids}
      label={label}
      required={required}
      optional={optional}
      hint={hint}
      hintTone={hintTone}
      error={error}
      disabled={disabled}
      optionalLabel={labels.optional}
      className={className}
    >
      {body}
    </FieldFrame>,
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
    registry,
    segment,
    variant,
    statusLabel,
  } = useSelectContext();
  const mergedRef = useMergedRefs(triggerRef, ref);
  // `status`: a chip in the picked option's hue (gray with none), at the chip tier of the size.
  const status = variant === "status" && !segment;
  const hue = status && selected.length > 0 ? registry.colorOf(selected[0]) : undefined;
  // A segment is named by the root's `aria-label` with the picked value after it.
  useListboxView(registry);
  const valueText = selected.map(registry.labelOf).join(", ");
  const ownName = segment?.label ?? statusLabel;
  const segmentName = ownName ? (valueText ? `${ownName}: ${valueText}` : ownName) : undefined;
  // Only a `Select.TriggerIcon`, no `Select.Value`: a compact trigger (the glyph and the chevron)
  // for a dense row; the value is still spoken from a hidden `Select.Value`.
  const parts = React.Children.toArray(children);
  const iconOnly =
    parts.some((node) => React.isValidElement(node) && node.type === SelectTriggerIcon) &&
    !parts.some((node) => React.isValidElement(node) && node.type === SelectValue);
  // Options loading and a value saving look the same: a Spinner in place of the chevron.
  const busy = loading || saving;
  const showClear = clearable && selected.length > 0 && !disabled && !busy;
  const clearPresence = usePartPresence<HTMLSpanElement>({ present: showClear, axis: "inline" });
  const toggle = floatingTriggerProps({ open: isOpen, setOpen, openOnArrow: true });

  return (
    <button
      {...rest}
      ref={mergedRef}
      id={triggerId}
      type="button"
      role="combobox"
      aria-expanded={toggle["aria-expanded"]}
      aria-haspopup="listbox"
      aria-controls={isOpen ? listboxId : undefined}
      aria-invalid={invalid || undefined}
      aria-required={required || undefined}
      aria-describedby={[ariaDescribedBy, describedBy].filter(Boolean).join(" ") || undefined}
      aria-busy={busy || undefined}
      aria-label={segmentName ?? rest["aria-label"]}
      disabled={disabled}
      className={cx(
        segment
          ? styles.segmentTrigger
          : status
            ? cx(palette.hue, chipTier.tier, styles.statusTrigger)
            : cx(fieldTriggerClass, styles.trigger),
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle.onClick();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        toggle.onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          if (!isOpen) setOpen(true);
        } else if (showClear && (event.key === "Delete" || event.key === "Backspace")) {
          event.preventDefault();
          clear();
        }
      }}
      {...toDataAttributes({
        state: toggle["data-state"],
        size,
        invalid: invalid || undefined,
        loading: busy || undefined,
        disabled: disabled || undefined,
        "focus-ring": focusRing,
        "icon-only": iconOnly || undefined,
        segment: segment ? true : undefined,
        variant: status ? "status" : undefined,
        color: hue,
        tier: status ? size : undefined,
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
          ref={clearPresence.ref}
          className={cx(styles.clear, touchTargetBlockClass, clearPresence.className)}
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
        <GlyphSwap>
          {busy ? <Spinner aria-hidden="true" /> : <Icon name="nav.chevronDown" />}
        </GlyphSwap>
      </span>
    </button>
  );
}
SelectTrigger.displayName = "Select.Trigger";

// ─── Value / TriggerIcon ─────────────────────────────────────────────────────

/** What `renderValue` receives: the selected option. */
export type SelectValueItem = { value: string; label: string };

export type SelectValueProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  renderValue?: (item: SelectValueItem) => React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** The picked label (labels joined in `multiple`), or the placeholder. */
function SelectValue({ renderValue, className, ...rest }: SelectValueProps) {
  const { selected, registry, placeholder, multiple, size } = useSelectContext();
  // Labels come from the items; the view re-renders the value when they register.
  useListboxView(registry);
  const text = selected.map(registry.labelOf).join(", ");

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
  searchable?: boolean;
  children: React.ReactNode;
  /** The floating panel. */
  ref?: React.Ref<HTMLDivElement>;
};

function SelectContent({ searchable = false, className, children, ...rest }: SelectContentProps) {
  const {
    isOpen,
    setOpen,
    closeOnEscape,
    closeOnOutsideClick,
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
  // A swap keeps the leaving list on screen a moment: the new one keeps the ref.
  const setListboxRef = useMergedRefs(listboxRef);
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
    closeOnEscape,
    closeOnOutsideClick,
    matchAnchorWidth: true,
    focusOnOpen: true,
    tabExit: "always",
    sheet: true,
  });

  const highlighted = useStoreSlice(highlight, (value) => value);
  const view = useListboxView(registry, query, filter);
  const isEmpty = view.matchCount === 0;
  const typeahead = useTypeahead();

  const region: RegionState = hasContent(loadError)
    ? "error"
    : loading && isEmpty
      ? "loading"
      : "ready";

  const { sentinelRef, request: requestMore } = useLoadMore({
    enabled: region === "ready" && hasMore && Boolean(onLoadMore) && !loading && !loadingMore,
    onLoadMore,
    scrollRef: listboxRef,
    round: view,
  });
  const setSentinelRef = useMergedRefs(sentinelRef);

  // The highlight reached the last option (arrows, End, pointer): ask for more, as scrolling does.
  const lastOption = view.navigable.filter((id) => !isActionValue(id)).at(-1);
  React.useEffect(() => {
    if (highlighted !== undefined && highlighted === lastOption) requestMore();
  }, [highlighted, lastOption, requestMore]);

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
    const ids = view.navigable;
    const printable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (printable && !inSearch && (event.key !== " " || typeahead.isTyping())) {
      event.preventDefault();
      const match = typeahead.find(event.key, ids, highlight.get(), registry.labelOf);
      if (match !== undefined) {
        highlight.set(match);
        revealHighlighted(registry.nodeOf(match));
      }
      return;
    }
    const moved = handleListboxKeyDown(event, {
      ids,
      highlight,
      activate: (value) => registry.activate(value),
    });
    if (moved !== null) revealHighlighted(registry.nodeOf(moved));
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
      className={cx(fieldTierClass, menu.tier, menu.menu, styles.content, className)}
      onKeyDown={handleKeyDown}
      {...toDataAttributes({ searching: query !== "" || undefined })}
    >
      {searchable ? (
        // The permanent focus of the panel: no ring, the caret is the indicator (foundation §7).
        <div className={cx(menu.searchRow, styles.search)}>
          <Icon name="action.search" size="s" />
          <input
            type="search"
            className={menu.searchInput}
            value={query}
            placeholder={labels.search}
            aria-label={labels.search}
            aria-controls={region === "error" ? undefined : listboxId}
            aria-activedescendant={activeDescendant}
            aria-autocomplete="list"
            {...AUTOFILL_OFF}
            spellCheck={false}
            data-autofocus=""
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      ) : null}
      {/* A load state swap cross-fades the region (foundation §1 rule 7); focus stays in it. */}
      <RegionSwap state={region} fill>
        {region === "error" ? (
          <EmptyPage.Root layout="compact" size={size} role="alert">
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
        ) : (
          <>
            <ScrollContainer
              ref={setListboxRef}
              id={listboxId}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-labelledby={triggerId}
              aria-activedescendant={searchable ? undefined : activeDescendant}
              aria-busy={loading || loadingMore || saving || undefined}
              aria-owns={actions.length > 0 ? actionsId : undefined}
              tabIndex={-1}
              data-autofocus={searchable ? undefined : ""}
              className={styles.listbox}
            >
              {/* Items render while loading too: they register, and the first match ends it. */}
              {items}
              {region === "loading" ? <SkeletonRows count={LOADING_ROWS} /> : null}
              {region === "ready" && hasMore ? (
                <div ref={setSentinelRef} aria-hidden="true" className={menu.loadSentinel} />
              ) : null}
              {region === "ready" && loadingMore ? (
                <SkeletonRows count={LOADING_MORE_ROWS} />
              ) : null}
            </ScrollContainer>
            {region === "ready" && isEmpty ? (
              <EmptyPage.Root layout="compact" size={size} role="status">
                <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
              </EmptyPage.Root>
            ) : null}
            {actions.length > 0 ? (
              // Owned by the listbox (`aria-owns`): its options for assistive tech, pinned under
              // the scroller and the empty state for the eye.
              // biome-ignore lint/a11y/useSemanticElements: a group of options inside a listbox, not a form fieldset
              <div id={actionsId} role="group" className={styles.actions}>
                {actions}
              </div>
            ) : null}
          </>
        )}
      </RegionSwap>
      <VisuallyHidden live="polite">{loading || loadingMore ? labels.loading : ""}</VisuallyHidden>
      <HighlightOnOpen />
    </FloatingPanel>
  );
}
SelectContent.displayName = "Select.Content";

/**
 * Lives inside the open panel, after the list: on open it highlights (and shows) the first
 * selected option; while searching, the first match (the first `Select.Action` when nothing
 * matches, so Enter runs it); closing clears the highlight.
 */
function HighlightOnOpen() {
  const { isOpen, query, filter, selected, registry, highlight } = useSelectContext();
  // Re-renders when the items (un)register: results of a server search arrive.
  const view = useListboxView(registry, query, filter);
  const latest = React.useRef({ query, filter, selected });
  latest.current = { query, filter, selected };

  // Read in the effect: the panel's items register in the same commit, just before it.
  React.useLayoutEffect(() => {
    if (!isOpen) return;
    const { query: text, filter: filtered, selected: picked } = latest.current;
    const first = registry.view(text, filtered).navigable.find((id) => picked.includes(id));
    highlight.set(first);
    if (first !== undefined) revealHighlighted(registry.nodeOf(first));
    return () => highlight.set(undefined);
  }, [isOpen, registry, highlight]);

  // While searching, the first match: the options come first, then the actions.
  const latestView = React.useRef(view);
  latestView.current = view;
  React.useLayoutEffect(() => {
    if (query !== "") highlight.set(latestView.current.navigable[0]);
  }, [query, highlight]);

  // Results that arrive later (a server search) take the highlight when it has none among them.
  React.useLayoutEffect(() => {
    if (query === "") return;
    const current = highlight.get();
    if (current === undefined || isActionValue(current) || !view.navigable.includes(current)) {
      highlight.set(view.navigable[0]);
    }
  }, [view, query, highlight]);

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

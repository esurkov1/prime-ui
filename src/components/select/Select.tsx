import * as React from "react";

import { Divider } from "@/components/divider/Divider";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Spinner } from "@/components/spinner/Spinner";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import {
  enabledOptions,
  handleListboxKeyDown,
  optionDomId,
  type Store,
  useCreateStore,
  useStoreSlice,
  useTypeahead,
} from "@/internal/listbox";
import { MenuGroup, type MenuGroupProps } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { FloatingPanel } from "@/internal/overlay/FloatingPanel";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import type { ControlSize } from "@/internal/states";

import styles from "./Select.module.css";
import {
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
  clear: "Очистить",
  optional: "необязательно",
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
    /** Spinner instead of the chevron, `aria-busy`, a status row in the list. */
    loading?: boolean;
    labels?: Partial<SelectLabels>;
    className?: string;
    children: React.ReactNode;
  };

type SelectSingleProps = {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  /** Picked value; `""` after clearing. */
  onValueChange?: (value: string) => void;
};

type SelectMultipleProps = {
  /** `string[]` value, checkboxes in the list, the list stays open on a pick. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
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
    disabled = false,
    placeholder,
    id,
    open,
    defaultOpen = false,
    onOpenChange,
    clearable = false,
    loading = false,
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
  const labels = React.useMemo(() => ({ ...SELECT_LABELS, ...labelsProp }), [labelsProp]);
  const ids = useFieldFrame(id, { hint, error, invalid });

  const [value, setValue] = useControllableState<string | string[] | undefined>({
    value: props.value,
    defaultValue: props.defaultValue ?? (multiple ? [] : undefined),
    onChange: props.onValueChange as ((value: string | string[] | undefined) => void) | undefined,
  });
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
  const [query, setQuery] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  // Closing (also from outside, through `open`) resets the search.
  if (!isOpen && query !== "") setQuery("");

  const pick = React.useCallback(
    (optionValue: string) => {
      if (multiple) {
        setValue((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return list.includes(optionValue)
            ? list.filter((item) => item !== optionValue)
            : [...list, optionValue];
        });
        return;
      }
      setValue(optionValue);
      // Focus goes back to the trigger (the floating layer's close policy).
      setOpen(false);
    },
    [multiple, setValue, setOpen],
  );

  const clear = React.useCallback(() => setValue(multiple ? [] : ""), [multiple, setValue]);

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
      isOpen,
      setOpen,
      highlight,
      query,
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
    </FieldFrame>
  );
}
SelectRoot.displayName = "Select.Root";

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
    clearable,
    selected,
    clear,
    labels,
  } = useSelectContext();
  const mergedRef = useMergedRefs(triggerRef, ref);
  const showClear = clearable && selected.length > 0 && !disabled && !loading;

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
      aria-busy={loading || undefined}
      disabled={disabled}
      className={cx(styles.trigger, className)}
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
        loading: loading || undefined,
        disabled: disabled || undefined,
        "focus-ring": focusRing ? undefined : false,
      })}
    >
      <span className={styles.triggerMain}>{children}</span>
      {showClear ? (
        // A segment, not a button: interactive content inside a <button> is invalid. The keyboard
        // clears with Delete / Backspace on the trigger.
        <span
          className={styles.clear}
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
        {loading ? <Spinner aria-hidden="true" /> : <Icon name="nav.chevronDown" />}
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
   * Single mode: renders the selected option in the trigger, e.g. with the same `Thumbnail.Root`,
   * `Select.ItemText` and `Select.ItemDescription` parts as the row. Not called while empty (the
   * placeholder shows) and not used in `multiple` mode.
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
        {...toDataAttributes({ rich: parts.rich || undefined })}
      >
        {sizeMedia(parts.leading, size)}
        <span className={styles.valueBody}>{parts.body}</span>
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

export type SelectContentProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "hidden" | "onKeyDown" | "onAnimationEnd"
> & {
  /** A search field on top of the list; items filter by label, description and `keywords`. */
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
    labels,
    registry,
  } = useSelectContext();

  const listboxRef = React.useRef<HTMLElement | null>(null);
  // Focus moves to the search (or the list) on open and back to the trigger after Escape, a pick
  // in single mode and Tab (which then moves on from the trigger); an outside press only closes.
  const floating = useFloatingLayer({
    open: isOpen,
    onOpenChange: setOpen,
    triggerRef,
    side: "bottom",
    align: "start",
    matchAnchorWidth: true,
    focusOnOpen: true,
    tabExit: "always",
  });

  const highlighted = useStoreSlice(highlight, (value) => value);
  const isEmpty = useStoreSlice(registry.version, () => !registry.anyMatch(normalize(query)));
  const typeahead = useTypeahead();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const inSearch = event.target instanceof HTMLInputElement;
    // In the search field Space, Home and End edit the text.
    if (inSearch && [" ", "Home", "End"].includes(event.key)) return;
    const items = enabledOptions(listboxRef.current);
    const printable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (printable && !inSearch && (event.key !== " " || typeahead.isTyping())) {
      event.preventDefault();
      const match = typeahead.find(event.key, items, highlight.get());
      if (match) {
        highlight.set(match.dataset.value);
        match.scrollIntoView?.({ block: "nearest" });
      }
      return;
    }
    handleListboxKeyDown(event, { items, highlight, onSelect: pick });
  };

  // Closed, the items still render (hidden, in place) so the trigger knows their labels.
  if (!floating.mounted) return <div hidden>{children}</div>;

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
      {loading ? (
        <div className={styles.status} role="status">
          <Spinner aria-hidden="true" />
          {labels.loading}
        </div>
      ) : null}
      <ScrollContainer
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-multiselectable={multiple || undefined}
        aria-labelledby={triggerId}
        aria-activedescendant={searchable ? undefined : activeDescendant}
        aria-busy={loading || undefined}
        tabIndex={-1}
        data-autofocus={searchable ? undefined : ""}
        className={styles.listbox}
      >
        {children}
      </ScrollContainer>
      {isEmpty && !loading ? (
        <EmptyPage.Root layout="compact" role="status">
          <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
          {query !== "" && labels.emptyHint ? (
            <EmptyPage.Description>{labels.emptyHint}</EmptyPage.Description>
          ) : null}
        </EmptyPage.Root>
      ) : null}
      <HighlightOnOpen listboxRef={listboxRef} highlight={highlight} />
    </FloatingPanel>
  );
}
SelectContent.displayName = "Select.Content";

/**
 * Lives inside the open panel, after the list: on open it highlights (and shows) the first
 * selected option; while searching, the first match; closing clears the highlight.
 */
function HighlightOnOpen({
  listboxRef,
  highlight,
}: {
  listboxRef: React.RefObject<HTMLElement | null>;
  highlight: Store<string | undefined>;
}) {
  const { isOpen, query, selected } = useSelectContext();
  const selectedRef = React.useRef(selected);
  selectedRef.current = selected;

  React.useLayoutEffect(() => {
    if (!isOpen) return;
    const options = enabledOptions(listboxRef.current);
    const first = options.find((item) => selectedRef.current.includes(item.dataset.value ?? ""));
    highlight.set(first?.dataset.value);
    first?.scrollIntoView?.({ block: "nearest" });
    return () => highlight.set(undefined);
  }, [isOpen, listboxRef, highlight]);

  React.useLayoutEffect(() => {
    if (query !== "") highlight.set(enabledOptions(listboxRef.current)[0]?.dataset.value);
  }, [query, listboxRef, highlight]);

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
};

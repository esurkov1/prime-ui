import * as React from "react";

import { Checkbox } from "@/components/checkbox/Checkbox";
import { Divider } from "@/components/divider/Divider";
import menu from "@/components/dropdown/menu.module.css";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { DropdownLayerContext } from "@/components/popover/layer";
import surface from "@/components/popover/surface.module.css";
import { useAnchoredPosition } from "@/components/popover/useAnchoredPosition";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Spinner } from "@/components/spinner/Spinner";
import { Thumbnail, type ThumbnailRootProps } from "@/components/thumbnail/Thumbnail";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { usePresence } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
import { mergeRefs } from "@/internal/mergeRefs";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import type { ControlSize } from "@/internal/states";

import styles from "./Select.module.css";
import { enabledOptions, handleListboxKeyDown } from "./selectListbox";

export type SelectLabels = {
  /** Placeholder and accessible name of the search field (`Select.Content searchable`). */
  search: string;
  /** Empty state: no items or nothing matches. */
  empty: string;
  /** Second line of the empty state while searching; `""` hides it. */
  emptyHint: string;
  /** Status row while `loading`. */
  loading: string;
  /** Tooltip of the clear segment (`clearable`). */
  clear: string;
  /** Muted marker after the label when `optional`. */
  optional: string;
};

const SELECT_LABELS: SelectLabels = {
  search: "Поиск",
  empty: "Ничего не найдено",
  emptyHint: "Попробуйте изменить запрос",
  loading: "Загрузка…",
  clear: "Очистить",
  optional: "необязательно",
};

/** A pause after which the typeahead buffer starts over. */
const TYPEAHEAD_RESET_MS = 500;

/** Checkbox one tier below the list (foundation §6 pairing), like the old inline box. */
const CHECKBOX_SIZE: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "s",
  l: "m",
  xl: "l",
};

/** Thumbnail tier for a Select tier: the media of a rich row stays inside the row height. */
const MEDIA_SIZE: Record<ControlSize, ControlSize> = { xs: "xs", s: "xs", m: "s", l: "s", xl: "m" };

/** `id` of an option for `aria-activedescendant` (no spaces: a valid id). */
const optionDomId = (listboxId: string, value: string) =>
  `${listboxId}-opt-${value.replace(/\s+/g, "_")}`;

const normalize = (text: string) => text.trim().toLocaleLowerCase();

/** Plain text of a node tree (a title made of nodes still has a label). */
function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node))
    return textOf(node.props.children);
  return "";
}

// ─── Context ─────────────────────────────────────────────────────────────────

type SelectContextValue = {
  size: ControlSize;
  invalid: boolean;
  focusRing: boolean;
  required: boolean;
  disabled: boolean;
  placeholder: string | undefined;
  multiple: boolean;
  /** Selected values: one or none in single mode. */
  selected: string[];
  /** Labels of the options by value, registered by the items. */
  labelsByValue: Record<string, string>;
  registerLabel: (value: string, label: string) => void;
  pick: (value: string) => void;
  clear: () => void;
  clearable: boolean;
  loading: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  highlightedValue: string | undefined;
  setHighlightedValue: (value: string | undefined) => void;
  query: string;
  setQuery: (query: string) => void;
  triggerId: string;
  listboxId: string;
  describedBy: string | undefined;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  labels: SelectLabels;
};

const [SelectProvider, useSelectContext] = createComponentContext<SelectContextValue>("Select");

// ─── Root ────────────────────────────────────────────────────────────────────

type SelectRootBase = FieldFrameProps & {
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
  const [highlightedValue, setHighlightedValue] = React.useState<string | undefined>();
  const [query, setQuery] = React.useState("");
  const [labelsByValue, setLabelsByValue] = React.useState<Record<string, string>>({});
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  // Closing (also from outside, through `open`) resets the search.
  React.useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const registerLabel = React.useCallback((optionValue: string, optionLabel: string) => {
    setLabelsByValue((prev) =>
      prev[optionValue] === optionLabel ? prev : { ...prev, [optionValue]: optionLabel },
    );
  }, []);

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
      labelsByValue,
      registerLabel,
      pick,
      clear,
      clearable,
      loading,
      isOpen,
      setOpen,
      highlightedValue,
      setHighlightedValue,
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
      labelsByValue,
      registerLabel,
      pick,
      clear,
      clearable,
      loading,
      isOpen,
      setOpen,
      highlightedValue,
      query,
      labels,
    ],
  );

  return (
    <FieldFrame
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
  const mergedRef = React.useMemo(() => mergeRefs(triggerRef, ref), [triggerRef, ref]);
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

export type SelectValueProps = {
  /**
   * Single mode: renders the selected option in the trigger, e.g. with the same `Thumbnail.Root`,
   * `Select.ItemText` and `Select.ItemDescription` parts as the row. Not called while empty (the
   * placeholder shows) and not used in `multiple` mode.
   */
  renderValue?: (item: SelectValueItem) => React.ReactNode;
  className?: string;
};

/** The picked label (labels joined in `multiple`), or the placeholder. */
function SelectValue({ renderValue, className }: SelectValueProps) {
  const { selected, labelsByValue, placeholder, multiple, size } = useSelectContext();
  const labelOf = (value: string) => labelsByValue[value] ?? value;

  if (selected.length > 0 && renderValue && !multiple) {
    const value = selected[0] ?? "";
    const parts = splitItemChildren(renderValue({ value, label: labelOf(value) }));
    return (
      <span
        className={cx(styles.value, className)}
        {...toDataAttributes({ rich: parts.rich || undefined })}
      >
        {sizeMedia(parts.leading, size)}
        <span className={styles.valueBody}>{parts.body}</span>
      </span>
    );
  }

  const display = selected.length > 0 ? selected.map(labelOf).join(", ") : placeholder;
  return (
    <span
      className={cx(styles.value, className)}
      {...toDataAttributes({ placeholder: selected.length === 0 || undefined })}
    >
      {display}
    </span>
  );
}
SelectValue.displayName = "Select.Value";

export type SelectTriggerIconProps = React.HTMLAttributes<HTMLSpanElement>;

/** A leading glyph in the trigger, before the value (decorative). */
function SelectTriggerIcon({ className, ...rest }: SelectTriggerIconProps) {
  return <span aria-hidden="true" className={cx(styles.triggerIcon, className)} {...rest} />;
}
SelectTriggerIcon.displayName = "Select.TriggerIcon";

// ─── Rich option parts (row and trigger) ─────────────────────────────────────

export type SelectItemIconProps = React.HTMLAttributes<HTMLSpanElement>;

/** A leading glyph of an option (decorative). */
function SelectItemIcon({ className, ...rest }: SelectItemIconProps) {
  return <span aria-hidden="true" className={cx(menu.itemIcon, className)} {...rest} />;
}
SelectItemIcon.displayName = "Select.ItemIcon";

export type SelectItemTextProps = { children: React.ReactNode; className?: string };

/** Title of a rich option; its text is the option label (trigger, typeahead, search). */
function SelectItemText({ children, className }: SelectItemTextProps) {
  return <span className={cx(styles.itemTitle, className)}>{children}</span>;
}
SelectItemText.displayName = "Select.ItemText";

export type SelectItemDescriptionProps = { children: React.ReactNode; className?: string };

/** Muted second line under `Select.ItemText`; searchable. Makes the row two-line. */
function SelectItemDescription({ children, className }: SelectItemDescriptionProps) {
  return <span className={cx(styles.itemDescription, className)}>{children}</span>;
}
SelectItemDescription.displayName = "Select.ItemDescription";

export type SelectItemMetaProps = { children: React.ReactNode; className?: string };

/** Trailing meta of an option (price, count): muted, tabular, before the check. */
function SelectItemMeta({ children, className }: SelectItemMetaProps) {
  return <span className={cx(styles.itemMeta, className)}>{children}</span>;
}
SelectItemMeta.displayName = "Select.ItemMeta";

type ItemParts = {
  /** `Select.ItemIcon` and `Thumbnail.Root`, before the text. */
  leading: React.ReactNode[];
  /** Title, description and plain text, in one column. */
  body: React.ReactNode[];
  /** `Select.ItemMeta`, after the text. */
  meta: React.ReactNode[];
  /** Two-line layout: a description or a media tile is present. */
  rich: boolean;
  /** Text of `Select.ItemText`, else of the plain text children. */
  title: string;
  description: string;
};

/** Sorts the direct children of an item (fragments flattened) into the row slots by part type. */
function splitItemChildren(children: React.ReactNode): ItemParts {
  const parts: ItemParts = {
    leading: [],
    body: [],
    meta: [],
    rich: false,
    title: "",
    description: "",
  };
  let plain = "";
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      plain += textOf(child);
      parts.body.push(child);
    } else if (child.type === React.Fragment) {
      const inner = splitItemChildren(child.props.children);
      parts.leading.push(...inner.leading);
      parts.body.push(...inner.body);
      parts.meta.push(...inner.meta);
      parts.rich ||= inner.rich;
      parts.title ||= inner.title;
      parts.description ||= inner.description;
      plain += inner.title;
    } else if (child.type === SelectItemIcon) {
      parts.leading.push(child);
    } else if (child.type === Thumbnail.Root) {
      parts.leading.push(child);
      parts.rich = true;
    } else if (child.type === SelectItemMeta) {
      parts.meta.push(child);
    } else {
      if (child.type === SelectItemText) parts.title = textOf(child.props.children);
      if (child.type === SelectItemDescription) {
        parts.description = textOf(child.props.children);
        parts.rich = true;
      }
      parts.body.push(child);
    }
  }
  parts.title = (parts.title || plain).trim();
  return parts;
}

/** A `Thumbnail.Root` in a row or the trigger: sized to the tier unless it sets `size`. */
function sizeMedia(leading: React.ReactNode[], size: ControlSize): React.ReactNode[] {
  return leading.map((node) =>
    React.isValidElement<ThumbnailRootProps>(node) && node.type === Thumbnail.Root
      ? React.cloneElement(node, {
          size: node.props.size ?? MEDIA_SIZE[size],
          className: cx(styles.media, node.props.className),
          "aria-hidden": true,
        } as Partial<ThumbnailRootProps>)
      : node,
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

export type SelectContentProps = {
  /** A search field on top of the list; items filter by label, description and `keywords`. */
  searchable?: boolean;
  className?: string;
  children: React.ReactNode;
};

function SelectContent({ searchable = false, className, children }: SelectContentProps) {
  const {
    isOpen,
    setOpen,
    pick,
    triggerId,
    listboxId,
    triggerRef,
    highlightedValue,
    setHighlightedValue,
    selected,
    multiple,
    size,
    query,
    setQuery,
    loading,
    labels,
  } = useSelectContext();

  const overlayPortalLayer = useOverlayPortalLayer();
  const contentRef = React.useRef<HTMLElement | null>(null);
  const listboxRef = React.useRef<HTMLElement | null>(null);
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const position = useAnchoredPosition(isOpen, triggerRef, contentRef, {
    side: "bottom",
    align: "start",
    matchAnchorWidth: true,
  });
  // The panel stays in the DOM while closed (items register the labels shown in the trigger);
  // presence only drives display and motion.
  const presence = usePresence(isOpen, { exitDuration: "fast" });

  const selectedRef = React.useRef(selected);
  selectedRef.current = selected;

  // Items hide themselves while searching: count what rendered.
  const [isEmpty, setIsEmpty] = React.useState(false);
  React.useLayoutEffect(() => {
    const empty = (listboxRef.current?.querySelector('[role="option"]') ?? null) === null;
    setIsEmpty((prev) => (prev === empty ? prev : empty));
  });

  // On open: focus the search (or the list) and highlight the selected option.
  React.useEffect(() => {
    if (!isOpen) {
      setHighlightedValue(undefined);
      return;
    }
    const frame = requestAnimationFrame(() => {
      (searchRef.current ?? listboxRef.current)?.focus({ preventScroll: true });
      const options = enabledOptions(listboxRef.current);
      const first = options.find((item) => selectedRef.current.includes(item.dataset.value ?? ""));
      setHighlightedValue(first?.dataset.value);
      first?.scrollIntoView?.({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, setHighlightedValue]);

  // Searching moves the highlight to the first match.
  React.useEffect(() => {
    if (!isOpen || query === "") return;
    setHighlightedValue(enabledOptions(listboxRef.current)[0]?.dataset.value);
  }, [isOpen, query, setHighlightedValue]);

  const closeAndReturnFocus = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, [setOpen, triggerRef]);

  useEscapeKey({ enabled: isOpen, onEscape: closeAndReturnFocus });
  // Focus follows the pointer (foundation §8): no return to the trigger.
  useOutsideClick({
    refs: [triggerRef, contentRef],
    enabled: isOpen,
    onOutsideClick: () => setOpen(false),
  });

  // Typeahead by title: the buffer starts over after a pause.
  const typeahead = React.useRef({ buffer: "", timer: 0 });
  React.useEffect(() => () => window.clearTimeout(typeahead.current.timer), []);

  const handleTypeahead = (key: string) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.buffer += key.toLocaleLowerCase();
    state.timer = window.setTimeout(() => {
      state.buffer = "";
    }, TYPEAHEAD_RESET_MS);
    const options = enabledOptions(listboxRef.current);
    const start = options.findIndex((item) => item.dataset.value === highlightedValue);
    // The same letter repeated cycles through the options on it; otherwise match the prefix.
    const repeated = [...state.buffer].every((char) => char === state.buffer[0]);
    const prefix = repeated ? key.toLocaleLowerCase() : state.buffer;
    const from = repeated ? start + 1 : Math.max(start, 0);
    const match = [...options.slice(from), ...options.slice(0, from)].find((item) =>
      (item.dataset.label ?? "").toLocaleLowerCase().startsWith(prefix),
    );
    if (match) {
      setHighlightedValue(match.dataset.value);
      match.scrollIntoView?.({ block: "nearest" });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const inSearch = event.target instanceof HTMLInputElement;
    // In the search field Space, Home and End edit the text.
    if (inSearch && [" ", "Home", "End"].includes(event.key)) return;
    const printable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (printable && !inSearch && (event.key !== " " || typeahead.current.buffer !== "")) {
      event.preventDefault();
      handleTypeahead(event.key);
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    handleListboxKeyDown(event, {
      items: enabledOptions(listboxRef.current),
      highlightedValue,
      setHighlightedValue,
      onSelect: (value) => {
        pick(value);
        if (!multiple) triggerRef.current?.focus({ preventScroll: true });
      },
      onClose: closeAndReturnFocus,
    });
  };

  const activeDescendant =
    isOpen && highlightedValue !== undefined ? optionDomId(listboxId, highlightedValue) : undefined;

  return (
    <Portal>
      <DropdownLayerContext.Provider value>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: keys bubble up from the search field and the listbox */}
        <div
          ref={position.attachLayer}
          aria-hidden={!isOpen}
          data-react-aria-top-layer="true"
          data-overlay-portal-layer={overlayPortalLayer}
          className={cx(
            surface.surface,
            surface.dropdownLayer,
            menu.tier,
            menu.menu,
            styles.content,
            overlayMotion.floating,
            className,
          )}
          hidden={!presence.mounted}
          onKeyDown={handleKeyDown}
          onAnimationEnd={presence.onExitEnd}
          {...toDataAttributes({
            side: position.side,
            size,
            searching: query !== "" || undefined,
            state: presence.state,
          })}
        >
          {searchable ? (
            // The permanent focus of the panel: no ring, the caret is the indicator (foundation §7).
            <div className={cx(menu.searchRow, styles.search)} data-focus-ring="false">
              <Icon name="action.search" size="s" />
              <input
                ref={searchRef}
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
            className={styles.listbox}
          >
            {children}
          </ScrollContainer>
          {isEmpty && !loading ? (
            <EmptyPage.Root layout="compact" role="status">
              <EmptyPage.Title>{labels.empty}</EmptyPage.Title>
              {query !== "" && labels.emptyHint ? (
                <EmptyPage.Description>{labels.emptyHint}</EmptyPage.Description>
              ) : null}
            </EmptyPage.Root>
          ) : null}
        </div>
      </DropdownLayerContext.Provider>
    </Portal>
  );
}
SelectContent.displayName = "Select.Content";

// ─── Item ────────────────────────────────────────────────────────────────────

export type SelectItemProps = {
  value: string;
  /** Text shown in the trigger and used by typeahead; defaults to `Select.ItemText`, then plain text. */
  label?: string;
  /** Extra words for the search (`Select.Content searchable`). */
  keywords?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

function SelectItem({
  value,
  label,
  keywords,
  disabled,
  className,
  children,
  ref,
}: SelectItemProps) {
  const {
    multiple,
    size,
    selected,
    highlightedValue,
    setHighlightedValue,
    pick,
    registerLabel,
    listboxId,
    query,
  } = useSelectContext();

  const parts = splitItemChildren(children);
  const resolvedLabel = label || parts.title || value;
  const isSelected = selected.includes(value);
  const isHighlighted = highlightedValue === value;

  React.useEffect(() => {
    registerLabel(value, resolvedLabel);
  }, [value, resolvedLabel, registerLabel]);

  const search = normalize(query);
  if (
    search !== "" &&
    !normalize(`${resolvedLabel} ${parts.description} ${keywords ?? ""}`).includes(search)
  ) {
    return null;
  }

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: focus stays on the listbox / search (aria-activedescendant)
    // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled on the listbox
    <div
      ref={ref}
      id={optionDomId(listboxId, value)}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      className={cx(menu.item, styles.item, className)}
      onClick={() => {
        if (!disabled) pick(value);
      }}
      onMouseMove={() => {
        if (!disabled && !isHighlighted) setHighlightedValue(value);
      }}
      {...toDataAttributes({
        value,
        label: resolvedLabel,
        selected: isSelected,
        highlighted: isHighlighted,
        disabled: Boolean(disabled),
        rich: parts.rich || undefined,
      })}
    >
      {multiple ? (
        <Checkbox.Indicator checked={isSelected} disabled={disabled} size={CHECKBOX_SIZE[size]} />
      ) : null}
      {sizeMedia(parts.leading, size)}
      <span className={styles.itemText}>{parts.body}</span>
      {parts.meta}
      {multiple ? null : (
        <span className={styles.check} aria-hidden="true">
          {isSelected ? <Icon name="action.check" /> : null}
        </span>
      )}
    </div>
  );
}
SelectItem.displayName = "Select.Item";

// ─── Group / Separator ───────────────────────────────────────────────────────

export type SelectGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  /** Visible heading of the group; names it for screen readers. */
  label?: React.ReactNode;
};

/** Options under a heading; hidden while the search leaves none of them. */
function SelectGroup({ label, className, children, ...rest }: SelectGroupProps) {
  const labelId = React.useId();
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" inside role="listbox"; <fieldset> is not allowed there
    <div
      {...rest}
      role="group"
      aria-labelledby={label != null ? labelId : undefined}
      className={cx(menu.group, styles.group, className)}
    >
      {label != null ? (
        <div id={labelId} className={menu.groupLabel}>
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}
SelectGroup.displayName = "Select.Group";

export type SelectSeparatorProps = { className?: string };

/** A full-bleed hairline between groups; hidden while searching. */
function SelectSeparator({ className }: SelectSeparatorProps) {
  return <Divider className={cx(menu.separator, styles.separator, className)} />;
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

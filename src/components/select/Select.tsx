import * as React from "react";
import { Badge } from "@/components/badge/Badge";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Thumbnail, type ThumbnailRootProps } from "@/components/thumbnail/Thumbnail";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { usePosition } from "@/hooks/usePosition";
import { usePresence } from "@/hooks/usePresence";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldIds,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import { getScrollContainers } from "@/internal/scrollAncestors";
import type { ControlSize, PaletteColor } from "@/internal/states";

import styles from "./Select.module.css";
import { CheckIcon, ChevronIcon, ClearIcon, SearchIcon, Spinner } from "./selectIcons";
import { handleSelectListboxKeyDown, queryEnabledSelectOptions } from "./selectListbox";

/** Стабильные опции `usePosition` — не создавать новый объект на каждом рендере Select.Content. */
const SELECT_LISTBOX_POSITION_OPTS = {
  side: "bottom" as const,
  align: "start" as const,
};

export type SelectLabels = {
  /** Placeholder and accessible name of the search field (`Select.Content searchable`). */
  search: string;
  /** Empty state: no items or nothing matches. */
  empty: string;
  /** Second line of the empty state while searching. */
  emptyHint: string;
  /** Status row while `loading`. */
  loading: string;
  /** Tooltip of the clear button (`clearable`). */
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

/** `id` опции для `aria-activedescendant` (без пробелов — валидный id). */
function optionDomId(listboxId: string, value: string): string {
  return `${listboxId}-opt-${value.replace(/\s+/g, "_")}`;
}

/** Пауза, после которой буфер typeahead начинается заново. */
const TYPEAHEAD_RESET_MS = 500;

function normalizeQuery(q: string): string {
  return q.trim().toLocaleLowerCase();
}

// ─── Context ─────────────────────────────────────────────────────────────────

type SelectedLabelBinding = { value: string; label: string };

type SelectContextValue = {
  size: ControlSize;
  invalid: boolean;
  focusRing: boolean;
  required: boolean;
  isOpen: boolean;
  /** When `true`, value is `string[]`, list stays open on pick, options toggle, listbox is `aria-multiselectable`. */
  multiple: boolean;
  selectedValue: string | undefined;
  /** Label shown in trigger; only applies while `binding.value === selectedValue` (single mode). */
  selectedLabelBinding: SelectedLabelBinding | undefined;
  /** Multi mode: current selection order. */
  selectedValues: string[];
  /** Multi mode: resolved labels for `Select.Value` join. */
  labelsByValue: Record<string, string>;
  onSelect: (value: string, label: string) => void;
  onClose: () => void;
  onOpen: () => void;
  highlightedValue: string | undefined;
  setHighlightedValue: (v: string | undefined) => void;
  triggerId: string;
  listboxId: string;
  /** Hint / error ids of the field frame. */
  describedBy: string | undefined;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  disabled?: boolean;
  placeholder?: string;
  onInitLabel: (value: string, label: string) => void;
  /** Строка поиска `Select.Content searchable`; пустая — фильтра нет. */
  query: string;
  setQuery: (q: string) => void;
  loading: boolean;
  clearable: boolean;
  hasValue: boolean;
  clear: () => void;
  labels: SelectLabels;
};

const [SelectProvider, useSelectContext] = createComponentContext<SelectContextValue>("Select");

// ─── SelectRoot ───────────────────────────────────────────────────────────────

type SelectRootBase = FieldFrameProps & {
  size?: ControlSize;
  disabled?: boolean;
  placeholder?: string;
  /** Danger ring and `aria-invalid`; a non-empty `error` implies it. */
  invalid?: boolean;
  /** Id of the control (trigger or native `<select>`); generated when omitted. */
  id?: string;
  labels?: Partial<SelectLabels>;
  className?: string;
  children: React.ReactNode;
};

type SelectSingleValueProps = {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  /** Picked value; `""` after clearing. */
  onValueChange?: (value: string) => void;
};

type SelectMultipleValueProps = {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type SelectComboboxProps = {
  native?: false;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Clear button in the trigger (and `Delete` / `Backspace` on it) while a value is selected. */
  clearable?: boolean;
  /** Spinner instead of the chevron, `aria-busy`, a status row in the list. */
  loading?: boolean;
};

/**
 * Native mode: the system `<select>`. It has no `Select.Trigger`, so naming attributes and
 * `name` go on Root.
 */
type SelectNativeProps = Pick<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "name" | "aria-label" | "aria-labelledby" | "aria-describedby"
> & {
  native: true;
};

export type SelectRootProps = SelectRootBase &
  (SelectSingleValueProps | SelectMultipleValueProps) &
  (SelectComboboxProps | SelectNativeProps);

type FieldBinding = {
  size: ControlSize;
  ids: FieldIds;
  focusRing: boolean;
  required: boolean;
  labels: SelectLabels;
};

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
    disabled,
    id,
    labels: labelsProp,
    className,
  } = props;
  const labels = React.useMemo(() => ({ ...SELECT_LABELS, ...labelsProp }), [labelsProp]);
  const ids = useFieldFrame(
    id,
    { hint, error, invalid },
    props.native === true ? props["aria-describedby"] : undefined,
  );
  const field: FieldBinding = { size, ids, focusRing, required, labels };

  let control: React.ReactNode;
  if (props.native === true) {
    control =
      props.multiple === true ? (
        <SelectNativeMultiRoot {...props} field={field} />
      ) : (
        <SelectNativeRoot {...props} field={field} />
      );
  } else {
    control =
      props.multiple === true ? (
        <SelectComboboxMultiRoot {...props} field={field} />
      ) : (
        <SelectComboboxRoot {...props} field={field} />
      );
  }

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
      {control}
    </FieldFrame>
  );
}
SelectRoot.displayName = "Select.Root";

/** Общее состояние открытия / поиска / подсветки обоих combobox-режимов. */
function useComboboxShell(
  { open, defaultOpen, onOpenChange }: SelectComboboxProps,
  controlId: string,
) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [highlightedValue, setHighlightedValue] = React.useState<string | undefined>(undefined);
  const [query, setQuery] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  /* Закрытие (в том числе снаружи, через `open`) сбрасывает строку поиска. */
  React.useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);
  const onOpen = React.useCallback(() => setIsOpen(true), [setIsOpen]);

  return {
    isOpen,
    setIsOpen,
    highlightedValue,
    setHighlightedValue,
    query,
    setQuery,
    triggerId: controlId,
    listboxId: `${controlId}-listbox`,
    triggerRef,
    onClose,
    onOpen,
  };
}

type ComboboxRootInternalProps<V> = SelectRootBase &
  SelectComboboxProps & {
    value?: V;
    defaultValue?: V;
    onValueChange?: (value: V) => void;
    field: FieldBinding;
  };

function SelectComboboxRoot({
  value,
  defaultValue,
  onValueChange,
  disabled,
  placeholder,
  clearable = false,
  loading = false,
  open,
  defaultOpen,
  onOpenChange,
  field,
  children,
}: ComboboxRootInternalProps<string>) {
  const { size, ids, focusRing, required, labels } = field;
  const handleChange = React.useCallback(
    (v: string | undefined) => {
      if (v !== undefined) onValueChange?.(v);
    },
    [onValueChange],
  );

  const [selectedValue, setSelectedValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: handleChange,
  });

  const [selectedLabelBinding, setSelectedLabelBinding] = React.useState<
    SelectedLabelBinding | undefined
  >(undefined);
  const shell = useComboboxShell({ open, defaultOpen, onOpenChange }, ids.controlId);
  const { setIsOpen } = shell;

  // Sync ref so onInitLabel doesn't go stale
  const selectedValueRef = React.useRef(selectedValue);
  selectedValueRef.current = selectedValue;

  const onInitLabel = React.useCallback((val: string, label: string) => {
    if (val === selectedValueRef.current) {
      setSelectedLabelBinding({ value: val, label });
    }
  }, []);

  const onSelect = React.useCallback(
    (val: string, label: string) => {
      setSelectedValue(val);
      setSelectedLabelBinding({ value: val, label });
      setIsOpen(false);
    },
    [setSelectedValue, setIsOpen],
  );

  const hasValue = selectedValue !== undefined && selectedValue !== "";
  const clear = React.useCallback(() => {
    setSelectedValue("");
    setSelectedLabelBinding(undefined);
  }, [setSelectedValue]);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      size,
      invalid: ids.invalid,
      focusRing,
      required,
      isOpen: shell.isOpen,
      multiple: false,
      selectedValue,
      selectedLabelBinding,
      selectedValues: [],
      labelsByValue: {},
      onSelect,
      onClose: shell.onClose,
      onOpen: shell.onOpen,
      highlightedValue: shell.highlightedValue,
      setHighlightedValue: shell.setHighlightedValue,
      triggerId: shell.triggerId,
      listboxId: shell.listboxId,
      describedBy: ids.describedBy,
      triggerRef: shell.triggerRef,
      disabled,
      placeholder,
      onInitLabel,
      query: shell.query,
      setQuery: shell.setQuery,
      loading,
      clearable,
      hasValue,
      clear,
      labels,
    }),
    [
      size,
      ids.invalid,
      focusRing,
      ids.describedBy,
      required,
      shell.isOpen,
      selectedValue,
      selectedLabelBinding,
      onSelect,
      shell.onClose,
      shell.onOpen,
      shell.highlightedValue,
      shell.setHighlightedValue,
      shell.triggerId,
      shell.listboxId,
      shell.triggerRef,
      disabled,
      placeholder,
      onInitLabel,
      shell.query,
      shell.setQuery,
      loading,
      clearable,
      hasValue,
      clear,
      labels,
    ],
  );

  return (
    <SelectProvider value={contextValue}>
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </SelectProvider>
  );
}

function SelectComboboxMultiRoot({
  value,
  defaultValue,
  onValueChange,
  disabled,
  placeholder,
  clearable = false,
  loading = false,
  open,
  defaultOpen,
  onOpenChange,
  field,
  children,
}: ComboboxRootInternalProps<string[]>) {
  const { size, ids, focusRing, required, labels } = field;
  const [selectedValues, setSelectedValues] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });

  const [labelsByValue, setLabelsByValue] = React.useState<Record<string, string>>({});
  const shell = useComboboxShell({ open, defaultOpen, onOpenChange }, ids.controlId);

  const onInitLabel = React.useCallback((val: string, label: string) => {
    setLabelsByValue((prev) => {
      if (prev[val] === label) return prev;
      return { ...prev, [val]: label };
    });
  }, []);

  const onSelect = React.useCallback(
    (val: string, label: string) => {
      setLabelsByValue((prev) => ({ ...prev, [val]: label }));
      setSelectedValues((prev) => {
        if (prev.includes(val)) {
          return prev.filter((x) => x !== val);
        }
        return [...prev, val];
      });
    },
    [setSelectedValues],
  );

  const hasValue = selectedValues.length > 0;
  const clear = React.useCallback(() => {
    setSelectedValues([]);
  }, [setSelectedValues]);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      size,
      invalid: ids.invalid,
      focusRing,
      required,
      isOpen: shell.isOpen,
      multiple: true,
      selectedValue: undefined,
      selectedLabelBinding: undefined,
      selectedValues,
      labelsByValue,
      onSelect,
      onClose: shell.onClose,
      onOpen: shell.onOpen,
      highlightedValue: shell.highlightedValue,
      setHighlightedValue: shell.setHighlightedValue,
      triggerId: shell.triggerId,
      listboxId: shell.listboxId,
      describedBy: ids.describedBy,
      triggerRef: shell.triggerRef,
      disabled,
      placeholder,
      onInitLabel,
      query: shell.query,
      setQuery: shell.setQuery,
      loading,
      clearable,
      hasValue,
      clear,
      labels,
    }),
    [
      size,
      ids.invalid,
      focusRing,
      ids.describedBy,
      required,
      shell.isOpen,
      selectedValues,
      labelsByValue,
      onSelect,
      shell.onClose,
      shell.onOpen,
      shell.highlightedValue,
      shell.setHighlightedValue,
      shell.triggerId,
      shell.listboxId,
      shell.triggerRef,
      disabled,
      placeholder,
      onInitLabel,
      shell.query,
      shell.setQuery,
      loading,
      clearable,
      hasValue,
      clear,
      labels,
    ],
  );

  return (
    <SelectProvider value={contextValue}>
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </SelectProvider>
  );
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────

export type SelectTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "id" | "type" | "role"
>;

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    { className, children, onClick, onKeyDown, "aria-describedby": ariaDescribedBy, ...rest },
    forwardedRef,
  ) => {
    const {
      isOpen,
      onOpen,
      onClose,
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
      hasValue,
      clear,
      labels,
    } = useSelectContext();

    const setRefs = React.useCallback(
      (el: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
        if (typeof forwardedRef === "function") {
          forwardedRef(el);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
        }
      },
      [forwardedRef, triggerRef],
    );

    const showClear = clearable && hasValue && !disabled && !loading;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!disabled) {
        if (isOpen) onClose();
        else onOpen();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (["ArrowDown", "ArrowUp", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        if (!isOpen) onOpen();
        return;
      }
      if (showClear && (e.key === "Delete" || e.key === "Backspace")) {
        e.preventDefault();
        clear();
      }
    };

    return (
      <button
        ref={setRefs}
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
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...toDataAttributes({
          state: isOpen ? "open" : "closed",
          size,
          invalid: invalid || undefined,
          loading: loading || undefined,
          disabled: disabled || undefined,
          "focus-ring": focusRing ? undefined : false,
        })}
        {...rest}
      >
        <span className={styles.triggerMain}>{children}</span>
        {showClear ? (
          // Не кнопка: вложенные интерактивные элементы в <button> недопустимы.
          // Клавиатура — Delete / Backspace на триггере.
          <span
            className={styles.triggerClear}
            aria-hidden
            title={labels.clear}
            data-select-clear=""
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
          >
            <ClearIcon />
          </span>
        ) : null}
        <span className={styles.triggerChevronSlot} aria-hidden>
          {loading ? <Spinner className={styles.spinner} /> : <ChevronIcon />}
        </span>
      </button>
    );
  },
);
SelectTrigger.displayName = "Select.Trigger";

// ─── SelectValue ─────────────────────────────────────────────────────────────

/** What `Select.Value` passes to its render function: the selected option. */
export type SelectValueItem = { value: string; label: string };

export type SelectValueProps = {
  className?: string;
  /**
   * Single mode: renders the selected option in the trigger, e.g. with the same
   * `Thumbnail.Root` / `Select.ItemText` / `Select.ItemDescription` parts as the row.
   * Not called while empty (the placeholder shows) and ignored in `multiple` mode.
   */
  children?: (item: SelectValueItem) => React.ReactNode;
};

function SelectValue({ className, children }: SelectValueProps) {
  const ctx = useSelectContext();
  if (ctx.multiple) {
    const { selectedValues, labelsByValue, placeholder } = ctx;
    const display =
      selectedValues.length === 0
        ? placeholder
        : selectedValues.map((v) => labelsByValue[v] ?? v).join(", ");
    return (
      <span
        className={cx(styles.triggerValue, className)}
        {...toDataAttributes({ placeholder: display == null || display === "" })}
      >
        {display}
      </span>
    );
  }
  const { selectedLabelBinding, selectedValue, placeholder } = ctx;
  const empty = selectedValue === undefined || selectedValue === "";
  /* Подпись из items валидна только для текущего value; иначе — raw value или placeholder до onInitLabel */
  const label =
    selectedLabelBinding && selectedLabelBinding.value === selectedValue
      ? selectedLabelBinding.label
      : selectedValue;
  if (children && !empty) {
    const parts = partitionRichChildren(children({ value: selectedValue, label: label ?? "" }));
    return (
      <span
        className={cx(styles.triggerValue, className)}
        {...toDataAttributes({ rich: parts.rich || undefined })}
      >
        {renderMedia(parts.media, ctx.size)}
        <span className={styles.valueBody}>{parts.body}</span>
      </span>
    );
  }
  const display = empty ? placeholder : label;
  return (
    <span
      className={cx(styles.triggerValue, className)}
      {...toDataAttributes({ placeholder: display == null || display === "" })}
    >
      {display}
    </span>
  );
}
SelectValue.displayName = "SelectValue";

// ─── SelectTriggerIcon ────────────────────────────────────────────────────────

export type SelectTriggerIconProps = React.HTMLAttributes<HTMLSpanElement>;

function SelectTriggerIcon({ className, children, ...rest }: SelectTriggerIconProps) {
  return (
    <span className={cx(styles.triggerIcon, className)} {...rest}>
      {children}
    </span>
  );
}
SelectTriggerIcon.displayName = "SelectTriggerIcon";

// ─── SelectBadge ──────────────────────────────────────────────────────────────

export type SelectBadgeProps = {
  /** Palette hue of the soft badge. Default `gray`. */
  color?: PaletteColor;
  children: React.ReactNode;
  className?: string;
};

/**
 * Status inside the trigger: a soft Badge one tier below the field, at the trailing edge before
 * the clear button and the chevron. The value truncates before it; the trigger height is unchanged.
 */
function SelectBadge({ color = "gray", children, className }: SelectBadgeProps) {
  return (
    <Badge.Root color={color} variant="soft" className={cx(styles.badge, className)}>
      {children}
    </Badge.Root>
  );
}
SelectBadge.displayName = "Select.Badge";

// ─── Rich option parts (row and trigger) ──────────────────────────────────────

/** Thumbnail tier for a Select tier: the media of a rich row stays inside the row height. */
const MEDIA_SIZE: Record<ControlSize, ControlSize> = { xs: "xs", s: "xs", m: "s", l: "s", xl: "m" };

/** A `Thumbnail.Root` as the leading media of a rich option: sized to the tier unless it sets `size`. */
function renderMedia(media: React.ReactNode[], size: ControlSize): React.ReactNode[] {
  return media.map((node) =>
    React.isValidElement<ThumbnailRootProps>(node)
      ? React.cloneElement(node, {
          size: node.props.size ?? MEDIA_SIZE[size],
          className: cx(styles.itemMedia, node.props.className),
          "aria-hidden": true,
        } as Partial<ThumbnailRootProps>)
      : node,
  );
}

export type SelectItemTextProps = {
  children: React.ReactNode;
  className?: string;
};

/** Title of a rich option; its text is the option label (trigger, typeahead, search). */
function SelectItemText({ children, className }: SelectItemTextProps) {
  return <span className={cx(styles.itemTitle, className)}>{children}</span>;
}
SelectItemText.displayName = "Select.ItemText";

export type SelectItemDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

/** Muted second line under `Select.ItemText`; searchable. */
function SelectItemDescription({ children, className }: SelectItemDescriptionProps) {
  return <span className={cx(styles.itemDescription, className)}>{children}</span>;
}
SelectItemDescription.displayName = "Select.ItemDescription";

export type SelectItemMetaProps = {
  children: React.ReactNode;
  className?: string;
};

/** Trailing meta of an option (price, count): muted, tabular, right-aligned, before the check. */
function SelectItemMeta({ children, className }: SelectItemMetaProps) {
  return <span className={cx(styles.itemMeta, className)}>{children}</span>;
}
SelectItemMeta.displayName = "Select.ItemMeta";

type RichParts = {
  media: React.ReactNode[];
  body: React.ReactNode[];
  meta: React.ReactNode[];
  /** Two-line layout: a description or a media tile is present. */
  rich: boolean;
  title: React.ReactNode | undefined;
  description: React.ReactNode | undefined;
};

/** Splits rich parts out of children (fragments are flattened; parts must be direct children). */
function partitionRichChildren(children: React.ReactNode): RichParts {
  const parts: RichParts = {
    media: [],
    body: [],
    meta: [],
    rich: false,
    title: undefined,
    description: undefined,
  };
  let index = 0;
  const visit = (node: React.ReactNode) => {
    React.Children.forEach(node, (raw) => {
      if (raw == null || raw === false) return;
      /* Свои ключи: части рендерятся массивами в разных слотах. */
      const child = React.isValidElement(raw)
        ? React.cloneElement(raw, { key: raw.key ?? `prime-select-part-${index++}` })
        : raw;
      if (React.isValidElement(child)) {
        const props = child.props as { children?: React.ReactNode };
        if (child.type === React.Fragment) {
          visit(props.children);
          return;
        }
        if (child.type === Thumbnail.Root) {
          parts.media.push(child);
          parts.rich = true;
          return;
        }
        if (child.type === SelectItemMeta) {
          parts.meta.push(child);
          return;
        }
        if (child.type === SelectItemText) parts.title = props.children;
        if (child.type === SelectItemDescription) {
          parts.description = props.children;
          parts.rich = true;
        }
      }
      parts.body.push(child);
    });
  };
  visit(children);
  return parts;
}

// ─── SelectContent ────────────────────────────────────────────────────────────

export type SelectContentProps = {
  className?: string;
  /** Поле поиска вверху панели; пункты фильтруются по подписи и `keywords`. */
  searchable?: boolean;
  children: React.ReactNode;
};

function SelectContent({ className, searchable = false, children }: SelectContentProps) {
  const {
    isOpen,
    onClose,
    onSelect,
    triggerId,
    listboxId,
    triggerRef,
    highlightedValue,
    setHighlightedValue,
    selectedValue,
    selectedValues,
    multiple,
    size,
    query,
    setQuery,
    loading,
    labels,
  } = useSelectContext();

  const selectedValueRef = React.useRef(selectedValue);
  selectedValueRef.current = selectedValue;
  const selectedValuesRef = React.useRef(selectedValues);
  selectedValuesRef.current = selectedValues;
  const multipleRef = React.useRef(multiple);
  multipleRef.current = multiple;

  const overlayPortalLayer = useOverlayPortalLayer();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const listboxRef = React.useRef<HTMLElement | null>(null);
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const { resolvedSide, update } = usePosition(
    triggerRef,
    contentRef,
    SELECT_LISTBOX_POSITION_OPTS,
  );

  /** `update` из `usePosition` меняет identity при смене deps — не подписывать на него эффекты позиции (риск цикла при открытом списке). */
  const updateRef = React.useRef(update);
  updateRef.current = update;

  const getItems = React.useCallback(() => queryEnabledSelectOptions(listboxRef.current), []);

  /* Пустое состояние: после рендера считаем видимые опции (пункты сами скрываются по поиску). */
  const [isEmpty, setIsEmpty] = React.useState(false);
  React.useLayoutEffect(() => {
    const count = listboxRef.current?.querySelectorAll('[role="option"]').length ?? 0;
    setIsEmpty((prev) => (prev === (count === 0) ? prev : count === 0));
  });

  /* Позиционирование только когда список открыт */
  React.useLayoutEffect(() => {
    if (!isOpen) return;
    updateRef.current();
    const rafId = requestAnimationFrame(() => updateRef.current());
    return () => cancelAnimationFrame(rafId);
  }, [isOpen]);

  /* Подсветка при открытии — только по `isOpen`, чтобы тумблер мультивыбора не сбрасывал highlight */
  React.useEffect(() => {
    if (!isOpen) {
      setHighlightedValue(undefined);
      return;
    }

    const rafId = requestAnimationFrame(() => {
      const focusTarget = searchRef.current ?? listboxRef.current;
      if (!focusTarget) return;
      focusTarget.focus({ preventScroll: true });
      const items = queryEnabledSelectOptions(listboxRef.current);
      if (multipleRef.current) {
        const sv = selectedValuesRef.current;
        const firstSelected = sv.find((v) => items.some((i) => i.dataset.value === v));
        setHighlightedValue(firstSelected ?? undefined);
      } else {
        const sv = selectedValueRef.current;
        const selected = items.find((i) => i.dataset.value === sv);
        if (selected && sv) {
          setHighlightedValue(sv);
          selected.scrollIntoView?.({ block: "nearest" });
        }
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, [isOpen, setHighlightedValue]);

  /* Поиск: подсветка уходит на первый найденный пункт. */
  React.useEffect(() => {
    if (!isOpen || query === "") return;
    const first = queryEnabledSelectOptions(listboxRef.current)[0];
    setHighlightedValue(first?.dataset.value);
  }, [isOpen, query, setHighlightedValue]);

  /* Как у Dropdown/Popover: пересчёт fixed при scroll предков триггера, resize, смене размера панели. */
  React.useEffect(() => {
    if (!isOpen) return;

    let rafCoalesce = 0;
    const schedule = () => {
      cancelAnimationFrame(rafCoalesce);
      rafCoalesce = requestAnimationFrame(() => updateRef.current());
    };

    window.addEventListener("resize", schedule);
    const scrollTargets = getScrollContainers(triggerRef.current);
    for (const t of scrollTargets) {
      t.addEventListener("scroll", schedule, { passive: true });
    }
    const vv = window.visualViewport;
    vv?.addEventListener("resize", schedule);

    const panel = contentRef.current;
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && panel) {
      ro = new ResizeObserver(schedule);
      ro.observe(panel);
    }

    return () => {
      cancelAnimationFrame(rafCoalesce);
      window.removeEventListener("resize", schedule);
      for (const t of scrollTargets) {
        t.removeEventListener("scroll", schedule);
      }
      vv?.removeEventListener("resize", schedule);
      ro?.disconnect();
    };
  }, [isOpen, triggerRef]);

  const closeAndReturnFocus = React.useCallback(() => {
    onClose();
    triggerRef.current?.focus({ preventScroll: true });
  }, [onClose, triggerRef]);

  useEscapeKey({ enabled: isOpen, onEscape: closeAndReturnFocus });
  useOutsideClick({
    refs: [triggerRef, contentRef],
    enabled: isOpen,
    /* Focus follows the pointer (foundation §8): no return to the trigger. */
    onOutsideClick: onClose,
  });
  // The listbox stays in the DOM (labels for the trigger); presence only drives display + motion.
  const presence = usePresence(isOpen, { exitDuration: "fast" });

  /* Typeahead по подписи (заголовку): буфер символов сбрасывается после паузы. */
  const typeahead = React.useRef({ buffer: "", timer: 0 });
  React.useEffect(() => () => window.clearTimeout(typeahead.current.timer), []);

  const handleTypeahead = React.useCallback(
    (key: string) => {
      const state = typeahead.current;
      window.clearTimeout(state.timer);
      state.buffer += key.toLocaleLowerCase();
      state.timer = window.setTimeout(() => {
        state.buffer = "";
      }, TYPEAHEAD_RESET_MS);
      const items = getItems();
      const start = items.findIndex((i) => i.dataset.value === highlightedValue);
      /* Один и тот же символ подряд — по кругу по пунктам на эту букву; иначе — по префиксу. */
      const repeated = [...state.buffer].every((c) => c === state.buffer[0]);
      const query = repeated ? key.toLocaleLowerCase() : state.buffer;
      const from = repeated ? start + 1 : Math.max(start, 0);
      const pool = [...items.slice(from), ...items.slice(0, from)];
      const match = pool.find((i) => (i.dataset.label ?? "").toLocaleLowerCase().startsWith(query));
      if (match) {
        setHighlightedValue(match.dataset.value);
        match.scrollIntoView?.({ block: "nearest" });
      }
    },
    [getItems, highlightedValue, setHighlightedValue],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      /* В поле поиска пробел, Home и End — редактирование текста, а не навигация. */
      if (e.target instanceof HTMLInputElement && [" ", "Home", "End"].includes(e.key)) return;
      const printable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
      if (
        printable &&
        !(e.target instanceof HTMLInputElement) &&
        (e.key !== " " || typeahead.current.buffer !== "")
      ) {
        e.preventDefault();
        handleTypeahead(e.key);
        return;
      }
      if (e.key === "Tab") {
        onClose();
        return;
      }
      handleSelectListboxKeyDown(e, {
        items: getItems(),
        highlightedValue,
        setHighlightedValue,
        onSelect: (value, label) => {
          onSelect(value, label);
          if (!multiple) triggerRef.current?.focus({ preventScroll: true });
        },
        onClose: closeAndReturnFocus,
      });
    },
    [
      getItems,
      highlightedValue,
      setHighlightedValue,
      onSelect,
      onClose,
      closeAndReturnFocus,
      multiple,
      triggerRef,
      handleTypeahead,
    ],
  );

  const activeDescendant =
    isOpen && highlightedValue !== undefined ? optionDomId(listboxId, highlightedValue) : undefined;
  const showEmpty = isEmpty && !loading;

  return (
    <Portal>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: клавиши всплывают от поиска и listbox */}
      <div
        ref={contentRef}
        aria-hidden={!isOpen}
        data-react-aria-top-layer="true"
        data-overlay-portal-layer={overlayPortalLayer}
        className={cx(styles.content, overlayMotion.floating, className)}
        onKeyDown={handleKeyDown}
        onAnimationEnd={presence.onExitEnd}
        style={{ display: presence.mounted ? undefined : "none" }}
        {...toDataAttributes({
          side: resolvedSide,
          size,
          searching: query !== "",
          state: presence.state,
        })}
      >
        {searchable ? (
          // The search field is the permanent focus of the panel: no ring (foundation §7).
          <div className={styles.search} data-focus-ring="false">
            <SearchIcon className={styles.searchIcon} />
            <input
              ref={searchRef}
              type="text"
              className={styles.searchInput}
              value={query}
              placeholder={labels.search}
              aria-label={labels.search}
              aria-controls={listboxId}
              aria-activedescendant={activeDescendant}
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        ) : null}
        {loading ? (
          <div className={styles.status} role="status">
            <Spinner className={styles.spinner} />
            <span>{labels.loading}</span>
          </div>
        ) : null}
        <ScrollContainer
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-multiselectable={multiple ? true : undefined}
          aria-labelledby={triggerId}
          aria-activedescendant={searchable ? undefined : activeDescendant}
          aria-busy={loading || undefined}
          tabIndex={-1}
          className={styles.listbox}
        >
          {children}
        </ScrollContainer>
        {showEmpty ? (
          <div className={styles.empty} role="status">
            <span className={styles.emptyText}>{labels.empty}</span>
            {query !== "" && labels.emptyHint ? (
              <span className={styles.emptyHint}>{labels.emptyHint}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </Portal>
  );
}
SelectContent.displayName = "SelectContent";

// ─── SelectItemIcon (объявлен до SelectItem — partition по типу + маркеру) ────

export type SelectItemIconProps = React.HTMLAttributes<HTMLSpanElement>;

function SelectItemIcon({ className, children, ...rest }: SelectItemIconProps) {
  return (
    <span className={cx(styles.itemIcon, className)} {...rest}>
      {children}
    </span>
  );
}
SelectItemIcon.displayName = "SelectItemIcon";
/** Не только `child.type === SelectItemIcon`: при двух копиях модуля в бандле ссылки разные — иконка попадала в `itemText` и схлопывался `gap`. */
const SELECT_ITEM_ICON_MARKER = "__primeSelectItemIcon" as const;
Object.assign(SelectItemIcon, { [SELECT_ITEM_ICON_MARKER]: true });

function isSelectItemIconType(type: unknown): boolean {
  if (type === SelectItemIcon) return true;
  if (typeof type === "function") {
    const fn = type as unknown as Record<string, unknown>;
    if (fn[SELECT_ITEM_ICON_MARKER] === true) return true;
    if (fn.displayName === "SelectItemIcon") return true;
  }
  return false;
}

function selectItemTextFromRest(rest: React.ReactNode[]): string | undefined {
  const parts: string[] = [];
  for (const node of rest) {
    if (typeof node === "string" || typeof node === "number") {
      const s = String(node).trim();
      if (s.length > 0) parts.push(s);
    }
  }
  return parts.length > 0 ? parts.join(" ") : undefined;
}

/** Option label: explicit `label`, then `Select.ItemText`, then plain text children, then `value`. */
function resolveItemLabel(
  label: string | undefined,
  children: React.ReactNode,
  value: string,
): string {
  if (label) return label;
  const { title } = partitionRichChildren(children);
  const titleText = title === undefined ? "" : extractPlainTextFromNode(title).trim();
  if (titleText) return titleText;
  const { rest } = partitionSelectItemChildren(children);
  return selectItemTextFromRest(rest) ?? (typeof children === "string" ? children : value);
}

function partitionSelectItemChildren(children: React.ReactNode) {
  const icons: React.ReactElement[] = [];
  const rest: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && isSelectItemIconType(child.type)) {
      icons.push(child);
    } else if (child != null && child !== false) {
      rest.push(child);
    }
  });

  return { icons, rest };
}

// ─── SelectItem ───────────────────────────────────────────────────────────────

export type SelectItemProps = {
  value: string;
  /** Explicit label for display in trigger; falls back to string children, then value */
  label?: string;
  /** Дополнительные слова для поиска (`Select.Content searchable`). */
  keywords?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, label, keywords, disabled, className, children }, ref) => {
    const {
      multiple,
      size,
      selectedValue,
      selectedValues,
      highlightedValue,
      setHighlightedValue,
      onSelect,
      onInitLabel,
      listboxId,
      query,
    } = useSelectContext();

    const { icons, rest } = partitionSelectItemChildren(children);
    const parts = partitionRichChildren(rest);

    const isSelected = multiple ? selectedValues.includes(value) : selectedValue === value;
    const isHighlighted = highlightedValue === value;
    const resolvedLabel = resolveItemLabel(label, children, value);
    const descriptionText =
      parts.description === undefined ? "" : extractPlainTextFromNode(parts.description);

    // biome-ignore lint/correctness/useExhaustiveDependencies: перезапуск при внешнем `selectedValue` (single); в multi в контексте всегда `undefined`
    React.useEffect(() => {
      onInitLabel(value, resolvedLabel);
    }, [value, resolvedLabel, onInitLabel, selectedValue]);

    const q = normalizeQuery(query);
    if (
      q !== "" &&
      !normalizeQuery(`${resolvedLabel} ${descriptionText} ${keywords ?? ""}`).includes(q)
    ) {
      return null;
    }

    const handleClick = () => {
      if (!disabled) onSelect(value, resolvedLabel);
    };

    const handleMouseMove = () => {
      if (!disabled && !isHighlighted) setHighlightedValue(value);
    };

    return (
      // biome-ignore lint/a11y/useFocusableInteractive: фокус остаётся на listbox / поиске (aria-activedescendant)
      // biome-ignore lint/a11y/useKeyWithClickEvents: клавиатура обрабатывается на listbox
      <div
        ref={ref}
        id={optionDomId(listboxId, value)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        className={cx(styles.item, className)}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        {...toDataAttributes({
          value,
          label: resolvedLabel,
          selected: isSelected,
          highlighted: isHighlighted,
          disabled: Boolean(disabled),
          size,
          rich: parts.rich || undefined,
        })}
      >
        {multiple ? (
          <span className={styles.itemCheckbox} aria-hidden="true">
            {isSelected ? <CheckIcon /> : null}
          </span>
        ) : null}
        {icons.map((icon, index) =>
          React.cloneElement(icon, {
            key: icon.key ?? `prime-select-item-icon-${String(index)}`,
          }),
        )}
        {renderMedia(parts.media, size)}
        <span className={styles.itemText}>{parts.body}</span>
        {parts.meta}
        {multiple ? null : (
          <span className={styles.itemCheckSlot} aria-hidden="true">
            {isSelected ? <CheckIcon /> : null}
          </span>
        )}
      </div>
    );
  },
);
SelectItem.displayName = "SelectItem";

// ─── SelectGroup ──────────────────────────────────────────────────────────────

export type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>;

function SelectGroup({ className, ...rest }: SelectGroupProps) {
  // biome-ignore lint/a11y/useSemanticElements: role="group" is correct for ARIA listbox groups; <fieldset> is not valid inside role="listbox"
  return <div role="group" className={cx(styles.group, className)} {...rest} />;
}
SelectGroup.displayName = "SelectGroup";

// ─── SelectGroupLabel ─────────────────────────────────────────────────────────

export type SelectGroupLabelProps = React.HTMLAttributes<HTMLDivElement>;

function SelectGroupLabel({ className, ...rest }: SelectGroupLabelProps) {
  const { size } = useSelectContext();
  return (
    <div className={cx(styles.groupLabel, className)} {...rest} {...toDataAttributes({ size })} />
  );
}
SelectGroupLabel.displayName = "SelectGroupLabel";

// ─── SelectSeparator ─────────────────────────────────────────────────────────

export type SelectSeparatorProps = React.HTMLAttributes<HTMLHRElement>;

function SelectSeparator({ className, ...rest }: SelectSeparatorProps) {
  return <hr className={cx(styles.separator, className)} {...rest} />;
}
SelectSeparator.displayName = "SelectSeparator";

// ─── Native <select> (Select.Root native) ───────────────────────────────────

type NativeOptionsWalkResult = {
  nodes: React.ReactNode[];
  firstEnabledValue: string | undefined;
};

function extractPlainTextFromNode(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractPlainTextFromNode).join("");
  if (React.isValidElement(node)) {
    const p = node.props as { children?: React.ReactNode };
    if (p != null && typeof p === "object" && "children" in p) {
      return extractPlainTextFromNode(p.children);
    }
  }
  return "";
}

function renderNativeOptionElement(
  el: React.ReactElement<SelectItemProps>,
  keyIndex: number,
): React.ReactNode {
  const { value, label, disabled, children } = el.props;
  const resolvedLabel = resolveItemLabel(label, children, value);
  return (
    <option key={`prime-select-native-opt-${keyIndex}`} value={value} disabled={disabled}>
      {resolvedLabel}
    </option>
  );
}

function walkNativeOptions(node: React.ReactNode): NativeOptionsWalkResult {
  const nodes: React.ReactNode[] = [];
  let firstEnabledValue: string | undefined;
  let keyIndex = 0;

  const visit = (n: React.ReactNode) => {
    React.Children.forEach(n, (child) => {
      if (child == null || child === false) return;
      if (!React.isValidElement(child)) return;
      if (child.type === React.Fragment) {
        visit((child.props as { children?: React.ReactNode }).children);
        return;
      }
      if (child.type === SelectItem) {
        const p = child.props as SelectItemProps;
        if (!p.disabled && firstEnabledValue === undefined) {
          firstEnabledValue = p.value;
        }
        nodes.push(
          renderNativeOptionElement(child as React.ReactElement<SelectItemProps>, keyIndex),
        );
        keyIndex += 1;
        return;
      }
      if (child.type === SelectGroup) {
        const ogKey = keyIndex;
        let groupLabel = "";
        const groupNodes: React.ReactNode[] = [];
        React.Children.forEach((child.props as { children?: React.ReactNode }).children, (gc) => {
          if (!React.isValidElement(gc)) return;
          if (gc.type === SelectGroupLabel) {
            groupLabel = extractPlainTextFromNode(
              (gc.props as { children?: React.ReactNode }).children,
            );
          } else if (gc.type === SelectItem) {
            const gp = gc.props as SelectItemProps;
            if (!gp.disabled && firstEnabledValue === undefined) {
              firstEnabledValue = gp.value;
            }
            groupNodes.push(
              renderNativeOptionElement(gc as React.ReactElement<SelectItemProps>, keyIndex),
            );
            keyIndex += 1;
          }
        });
        nodes.push(
          <optgroup key={`prime-select-native-og-${ogKey}`} label={groupLabel || "\u00A0"}>
            {groupNodes}
          </optgroup>,
        );
        return;
      }
      if (child.type === SelectSeparator) {
        return;
      }
      const wrapProps = child.props as { children?: React.ReactNode };
      if (wrapProps.children != null) {
        visit(wrapProps.children);
      }
    });
  };

  visit(node);
  return { nodes, firstEnabledValue };
}

type NativeRootInternalProps<V> = SelectRootBase &
  Omit<SelectNativeProps, "native"> & {
    value?: V;
    defaultValue?: V;
    onValueChange?: (value: V) => void;
    field: FieldBinding;
  };

function nativeSelectProps(
  {
    name,
    disabled,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  }: Pick<SelectRootBase, "disabled"> & Omit<SelectNativeProps, "native">,
  { size, ids, focusRing, required }: FieldBinding,
) {
  return {
    id: ids.controlId,
    name,
    required: required || undefined,
    disabled,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ids.describedBy,
    "aria-invalid": ids.invalid || undefined,
    className: styles.nativeSelect,
    ...toDataAttributes({
      size,
      invalid: ids.invalid || undefined,
      disabled: disabled || undefined,
      "focus-ring": focusRing ? undefined : false,
    }),
  };
}

function SelectNativeRoot(props: NativeRootInternalProps<string>) {
  const { value, defaultValue, onValueChange, placeholder, children, field } = props;
  const handleChange = React.useCallback(
    (v: string | undefined) => {
      if (v !== undefined) onValueChange?.(v);
    },
    [onValueChange],
  );

  const [selectedValue, setSelectedValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: handleChange,
  });

  const { nodes: optionNodes, firstEnabledValue } = React.useMemo(
    () => walkNativeOptions(children),
    [children],
  );

  const hasPlaceholder = placeholder != null && placeholder !== "";
  const selectValue =
    selectedValue === undefined ? (hasPlaceholder ? "" : (firstEnabledValue ?? "")) : selectedValue;

  return (
    <ControlSizeProvider value={field.size}>
      <span className={styles.nativeWrap}>
        <select
          {...nativeSelectProps(props, field)}
          value={selectValue}
          onChange={(e) => setSelectedValue(e.target.value === "" ? undefined : e.target.value)}
        >
          {hasPlaceholder ? <option value="">{placeholder}</option> : null}
          {optionNodes}
        </select>
        <span className={styles.nativeChevron} data-size={field.size} aria-hidden>
          <ChevronIcon />
        </span>
      </span>
    </ControlSizeProvider>
  );
}

function SelectNativeMultiRoot(props: NativeRootInternalProps<string[]>) {
  const { value, defaultValue, onValueChange, children, field } = props;
  const [selectedValues, setSelectedValues] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });

  const { nodes: optionNodes } = React.useMemo(() => walkNativeOptions(children), [children]);

  return (
    <ControlSizeProvider value={field.size}>
      <select
        {...nativeSelectProps(props, field)}
        data-multiple="true"
        multiple
        value={selectedValues}
        onChange={(e) => setSelectedValues(Array.from(e.target.selectedOptions, (o) => o.value))}
      >
        {optionNodes}
      </select>
    </ControlSizeProvider>
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  TriggerIcon: SelectTriggerIcon,
  Badge: SelectBadge,
  Content: SelectContent,
  Item: SelectItem,
  ItemIcon: SelectItemIcon,
  ItemText: SelectItemText,
  ItemDescription: SelectItemDescription,
  ItemMeta: SelectItemMeta,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
};

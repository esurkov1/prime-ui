import * as React from "react";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { usePosition } from "@/hooks/usePosition";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import { Portal } from "@/internal/Portal";
import type { SelectSize } from "@/internal/states";

import styles from "./Select.module.css";
import { handleSelectListboxKeyDown, queryEnabledSelectOptions } from "./selectListbox";

/** Стабильные опции `usePosition` — не создавать новый объект на каждом рендере Select.Content. */
const SELECT_LISTBOX_POSITION_OPTS = {
  side: "bottom" as const,
  align: "start" as const,
};

// ─── Context ─────────────────────────────────────────────────────────────────

type SelectedLabelBinding = { value: string; label: string };

type SelectContextValue = {
  size: SelectSize;
  hasError: boolean;
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
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  disabled?: boolean;
  placeholder?: string;
  onInitLabel: (value: string, label: string) => void;
};

const [SelectProvider, useSelectContext] = createComponentContext<SelectContextValue>("Select");

// ─── SelectRoot ───────────────────────────────────────────────────────────────

type SelectRootBase = {
  size?: SelectSize;
  disabled?: boolean;
  placeholder?: string;
  hasError?: boolean;
  children: React.ReactNode;
};

export type SelectRootProps =
  | (SelectRootBase & {
      multiple?: false;
      native?: false;
      value?: string;
      defaultValue?: string;
      onChange?: (value: string) => void;
    })
  | (SelectRootBase & {
      multiple: true;
      native?: false;
      value?: string[];
      defaultValue?: string[];
      onChange?: (value: string[]) => void;
    })
  | (SelectRootBase & {
      multiple?: false;
      native: true;
      value?: string;
      defaultValue?: string;
      onChange?: (value: string) => void;
    })
  | (SelectRootBase & {
      multiple: true;
      native: true;
      value?: string[];
      defaultValue?: string[];
      onChange?: (value: string[]) => void;
    });

function SelectRoot(props: SelectRootProps) {
  if (props.multiple === true) {
    if (props.native === true) {
      return <SelectNativeMultiRoot {...props} />;
    }
    return <SelectComboboxMultiRoot {...props} />;
  }
  if (props.native === true) {
    return <SelectNativeRoot {...props} />;
  }
  return <SelectComboboxRoot {...props} />;
}
SelectRoot.displayName = "SelectRoot";

type SelectComboboxSingleRootProps = SelectRootBase & {
  multiple?: false;
  native?: false;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

function SelectComboboxRoot({
  size = "m",
  value,
  defaultValue,
  onChange,
  disabled,
  placeholder,
  hasError = false,
  children,
}: SelectComboboxSingleRootProps) {
  const handleChange = React.useCallback(
    (v: string | undefined) => {
      if (v !== undefined) onChange?.(v);
    },
    [onChange],
  );

  const [selectedValue, setSelectedValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: handleChange,
  });

  const [selectedLabelBinding, setSelectedLabelBinding] = React.useState<
    SelectedLabelBinding | undefined
  >(undefined);
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedValue, setHighlightedValue] = React.useState<string | undefined>(undefined);

  const generatedId = React.useId();
  const triggerId = `${generatedId}-trigger`;
  const listboxId = `${generatedId}-listbox`;
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

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
    [setSelectedValue],
  );

  const onClose = React.useCallback(() => setIsOpen(false), []);
  const onOpen = React.useCallback(() => setIsOpen(true), []);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      size,
      hasError,
      isOpen,
      multiple: false,
      selectedValue,
      selectedLabelBinding,
      selectedValues: [],
      labelsByValue: {},
      onSelect,
      onClose,
      onOpen,
      highlightedValue,
      setHighlightedValue,
      triggerId,
      listboxId,
      triggerRef,
      disabled,
      placeholder,
      onInitLabel,
    }),
    [
      size,
      hasError,
      isOpen,
      selectedValue,
      selectedLabelBinding,
      onSelect,
      onClose,
      onOpen,
      highlightedValue,
      triggerId,
      listboxId,
      disabled,
      placeholder,
      onInitLabel,
    ],
  );

  return (
    <SelectProvider value={contextValue}>
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </SelectProvider>
  );
}
SelectComboboxRoot.displayName = "SelectComboboxRoot";

function SelectComboboxMultiRoot({
  size = "m",
  value,
  defaultValue,
  onChange,
  disabled,
  placeholder,
  hasError = false,
  children,
}: Omit<Extract<SelectRootProps, { multiple: true }>, "native" | "multiple">) {
  const handleChange = React.useCallback(
    (next: string[]) => {
      onChange?.(next);
    },
    [onChange],
  );

  const [selectedValues, setSelectedValues] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: handleChange,
  });

  const [labelsByValue, setLabelsByValue] = React.useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedValue, setHighlightedValue] = React.useState<string | undefined>(undefined);

  const generatedId = React.useId();
  const triggerId = `${generatedId}-trigger`;
  const listboxId = `${generatedId}-listbox`;
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

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

  const onClose = React.useCallback(() => setIsOpen(false), []);
  const onOpen = React.useCallback(() => setIsOpen(true), []);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      size,
      hasError,
      isOpen,
      multiple: true,
      selectedValue: undefined,
      selectedLabelBinding: undefined,
      selectedValues,
      labelsByValue,
      onSelect,
      onClose,
      onOpen,
      highlightedValue,
      setHighlightedValue,
      triggerId,
      listboxId,
      triggerRef,
      disabled,
      placeholder,
      onInitLabel,
    }),
    [
      size,
      hasError,
      isOpen,
      selectedValues,
      labelsByValue,
      onSelect,
      onClose,
      onOpen,
      highlightedValue,
      triggerId,
      listboxId,
      disabled,
      placeholder,
      onInitLabel,
    ],
  );

  return (
    <SelectProvider value={contextValue}>
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </SelectProvider>
  );
}
SelectComboboxMultiRoot.displayName = "SelectComboboxMultiRoot";

// ─── SelectTrigger ────────────────────────────────────────────────────────────

export type SelectTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "id" | "type" | "role"
>;

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, onClick, onKeyDown, ...rest }, forwardedRef) => {
    const { isOpen, onOpen, onClose, triggerId, listboxId, disabled, size, hasError, triggerRef } =
      useSelectContext();

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
        disabled={disabled}
        className={cx(styles.trigger, className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...toDataAttributes({ open: isOpen, size, "has-error": hasError })}
        {...rest}
      >
        <span className={styles.triggerMain}>{children}</span>
        <span className={styles.triggerChevronSlot} aria-hidden>
          <span className={styles.triggerChevron} />
        </span>
      </button>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

// ─── SelectValue ─────────────────────────────────────────────────────────────

export type SelectValueProps = {
  className?: string;
};

function SelectValue({ className }: SelectValueProps) {
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
  /* Подпись из items валидна только для текущего value; иначе — raw value или placeholder до onInitLabel */
  const display =
    selectedLabelBinding && selectedLabelBinding.value === selectedValue
      ? selectedLabelBinding.label
      : (selectedValue ?? placeholder);
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

// ─── SelectContent ────────────────────────────────────────────────────────────

export type SelectContentProps = {
  className?: string;
  children: React.ReactNode;
};

function SelectContent({ className, children }: SelectContentProps) {
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
  } = useSelectContext();

  const selectedValueRef = React.useRef(selectedValue);
  selectedValueRef.current = selectedValue;
  const selectedValuesRef = React.useRef(selectedValues);
  selectedValuesRef.current = selectedValues;
  const multipleRef = React.useRef(multiple);
  multipleRef.current = multiple;

  const overlayPortalLayer = useOverlayPortalLayer();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const { resolvedSide, update } = usePosition(
    triggerRef,
    contentRef,
    SELECT_LISTBOX_POSITION_OPTS,
  );

  /** `update` из `usePosition` меняет identity при смене deps — не подписывать на него эффекты позиции (риск цикла при открытом списке). */
  const updateRef = React.useRef(update);
  updateRef.current = update;

  const getItems = React.useCallback(() => queryEnabledSelectOptions(contentRef.current), []);

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

    const bootstrap = () => {
      requestAnimationFrame(() => {
        const el = contentRef.current;
        if (!el) return;
        el.focus({ preventScroll: true });
        const items = queryEnabledSelectOptions(el);
        if (multipleRef.current) {
          const sv = selectedValuesRef.current;
          const firstSelected = sv.find((v) => items.some((i) => i.dataset.value === v));
          setHighlightedValue(firstSelected ?? undefined);
        } else {
          const sv = selectedValueRef.current;
          const selectedIndex = items.findIndex((i) => i.dataset.value === sv);
          if (selectedIndex >= 0 && sv) {
            setHighlightedValue(sv);
          }
        }
      });
    };

    bootstrap();
  }, [isOpen, setHighlightedValue]);

  React.useEffect(() => {
    if (!isOpen) return;

    const reposition = () => {
      requestAnimationFrame(() => updateRef.current());
    };

    window.addEventListener("resize", reposition);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("resize", reposition);
      vv?.removeEventListener("resize", reposition);
    };
  }, [isOpen]);

  useEscapeKey({ enabled: isOpen, onEscape: onClose });
  useOutsideClick({ refs: [triggerRef, contentRef], enabled: isOpen, onOutsideClick: onClose });

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      handleSelectListboxKeyDown(e, {
        items: getItems(),
        highlightedValue,
        setHighlightedValue,
        onSelect,
        onClose,
      });
    },
    [getItems, highlightedValue, setHighlightedValue, onSelect, onClose],
  );

  return (
    <Portal>
      <ScrollContainer
        ref={contentRef}
        id={listboxId}
        role="listbox"
        aria-multiselectable={multiple ? true : undefined}
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        tabIndex={-1}
        data-react-aria-top-layer="true"
        data-overlay-portal-layer={overlayPortalLayer}
        className={cx(styles.content, className)}
        onKeyDown={handleKeyDown}
        style={{ display: isOpen ? undefined : "none" }}
        {...toDataAttributes({ side: resolvedSide, size })}
      >
        {children}
      </ScrollContainer>
    </Portal>
  );
}
SelectContent.displayName = "SelectContent";

// ─── SelectItemIcon (объявлен до SelectItem — partition по child.type) ───────

export type SelectItemIconProps = React.HTMLAttributes<HTMLSpanElement>;

function SelectItemIcon({ className, children, ...rest }: SelectItemIconProps) {
  return (
    <span className={cx(styles.itemIcon, className)} {...rest}>
      {children}
    </span>
  );
}
SelectItemIcon.displayName = "SelectItemIcon";

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

function partitionSelectItemChildren(children: React.ReactNode) {
  const icons: React.ReactElement[] = [];
  const rest: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === SelectItemIcon) {
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
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, label, disabled, className, children }, ref) => {
    const {
      multiple,
      size,
      selectedValue,
      selectedValues,
      highlightedValue,
      setHighlightedValue,
      onSelect,
      onInitLabel,
    } = useSelectContext();

    const { icons, rest } = partitionSelectItemChildren(children);

    const isSelected = multiple ? selectedValues.includes(value) : selectedValue === value;
    const isHighlighted = highlightedValue === value;
    const resolvedLabel =
      label ??
      selectItemTextFromRest(rest) ??
      (typeof children === "string" ? children : undefined) ??
      value;

    // biome-ignore lint/correctness/useExhaustiveDependencies: перезапуск при внешнем `selectedValue` (single); в multi в контексте всегда `undefined`
    React.useEffect(() => {
      onInitLabel(value, resolvedLabel);
    }, [value, resolvedLabel, onInitLabel, selectedValue]);

    const handleClick = () => {
      if (!disabled) onSelect(value, resolvedLabel);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        onSelect(value, resolvedLabel);
      }
    };

    const handleMouseEnter = () => {
      if (!disabled) setHighlightedValue(value);
    };

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        tabIndex={-1}
        className={cx(styles.item, className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        {...toDataAttributes({
          value,
          label: resolvedLabel,
          selected: isSelected,
          highlighted: isHighlighted,
          disabled: Boolean(disabled),
          size,
        })}
      >
        {icons.map((icon, index) =>
          React.cloneElement(icon, {
            key: icon.key ?? `prime-select-item-icon-${String(index)}`,
          }),
        )}
        <span className={styles.itemText}>{rest}</span>
        {isSelected ? (
          <span className={styles.itemCheckSlot} aria-hidden="true">
            <span className={styles.itemCheck} />
          </span>
        ) : null}
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
  const { rest } = partitionSelectItemChildren(children);
  const resolvedLabel =
    label ??
    selectItemTextFromRest(rest) ??
    (typeof children === "string" ? children : undefined) ??
    value;
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

type SelectNativeRootProps = Omit<
  Exclude<Extract<SelectRootProps, { native: true }>, { multiple: true }>,
  "native"
>;

function SelectNativeRoot({
  size = "m",
  value,
  defaultValue,
  onChange,
  disabled,
  placeholder,
  hasError = false,
  children,
}: SelectNativeRootProps) {
  const handleChange = React.useCallback(
    (v: string | undefined) => {
      if (v !== undefined) onChange?.(v);
    },
    [onChange],
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

  const handleNativeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value;
      setSelectedValue(v === "" ? undefined : v);
    },
    [setSelectedValue],
  );

  return (
    <ControlSizeProvider value={size}>
      <select
        className={styles.nativeSelect}
        disabled={disabled}
        value={selectValue}
        onChange={handleNativeChange}
        {...toDataAttributes({ size, "has-error": hasError })}
      >
        {hasPlaceholder ? <option value="">{placeholder}</option> : null}
        {optionNodes}
      </select>
    </ControlSizeProvider>
  );
}
SelectNativeRoot.displayName = "SelectNativeRoot";

function SelectNativeMultiRoot({
  size = "m",
  value,
  defaultValue,
  onChange,
  disabled,
  hasError = false,
  children,
}: Omit<Extract<SelectRootProps, { multiple: true; native: true }>, "native" | "multiple">) {
  const handleChange = React.useCallback(
    (next: string[]) => {
      onChange?.(next);
    },
    [onChange],
  );

  const [selectedValues, setSelectedValues] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: handleChange,
  });

  const { nodes: optionNodes } = React.useMemo(() => walkNativeOptions(children), [children]);

  const handleNativeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = Array.from(e.target.selectedOptions, (o) => o.value);
      setSelectedValues(next);
    },
    [setSelectedValues],
  );

  return (
    <ControlSizeProvider value={size}>
      <select
        className={styles.nativeSelect}
        data-multiple="true"
        disabled={disabled}
        multiple
        value={selectedValues}
        onChange={handleNativeChange}
        {...toDataAttributes({ size, "has-error": hasError })}
      >
        {optionNodes}
      </select>
    </ControlSizeProvider>
  );
}
SelectNativeMultiRoot.displayName = "SelectNativeMultiRoot";

// ─── Namespace export ─────────────────────────────────────────────────────────

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  TriggerIcon: SelectTriggerIcon,
  Content: SelectContent,
  Item: SelectItem,
  ItemIcon: SelectItemIcon,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
};

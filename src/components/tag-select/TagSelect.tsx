import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { usePosition } from "@/hooks/usePosition";
import { usePresence } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
import surface from "@/internal/floatingSurface.module.css";
import { formatLabel } from "@/internal/formatLabel";
import { enabledOptions, handleListboxKeyDown } from "@/internal/listbox";
import menu from "@/internal/menu.module.css";
import { DropdownLayerContext, useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import type { ControlSize, PaletteColor } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import { TagOptionMenu } from "./TagOptionMenu";
import styles from "./TagSelect.module.css";
import { useChipOverflow } from "./useChipOverflow";

export type TagSelectOption = {
  value: string;
  label: string;
  color?: PaletteColor;
  disabled?: boolean;
};

export type TagSelectOptionUpdate = { label?: string; color?: PaletteColor };

export type TagSelectLabels = {
  /** Line above the list; `""` hides it. */
  panelHint: string;
  /** Action text before the preview of a new tag (`creatable`). */
  create: string;
  /** Accessible name of a chip's remove button; `{label}` is the tag text. */
  remove: string;
  /** Accessible name of the «+N» chip; `{count}` is the number of hidden tags. */
  more: string;
  /** Screen-reader announcement after a tag is removed; `{label}` is the tag text. */
  removed: string;
  /** Accessible name of a row's «⋯» menu; `{label}` is the tag text. */
  edit: string;
  /** Accessible name of the tag name field in the menu. */
  name: string;
  /** Delete button in the menu. */
  delete: string;
  /** Heading of the color list in the menu. */
  colors: string;
  /** Names of the palette colors in the menu. */
  colorNames: Record<PaletteColor, string>;
  /** Muted marker after the label when `optional`. */
  optional: string;
};

const TAG_SELECT_LABELS: TagSelectLabels = {
  panelHint: "Выберите вариант или создайте новый",
  create: "Создать",
  remove: "Удалить {label}",
  more: "Показать ещё {count}",
  removed: "Удалено: {label}",
  edit: "Изменить тег {label}",
  name: "Название тега",
  delete: "Удалить",
  colors: "Цвета",
  colorNames: {
    gray: "По умолчанию",
    red: "Красный",
    orange: "Оранжевый",
    yellow: "Жёлтый",
    green: "Зелёный",
    blue: "Синий",
    purple: "Фиолетовый",
    pink: "Розовый",
    sky: "Голубой",
    teal: "Бирюзовый",
  },
  optional: "необязательно",
};

/** Checkbox one tier below the list (foundation §6 pairing). */
const CHECKBOX_SIZE: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "s",
  l: "m",
  xl: "l",
};

const CREATE_VALUE = "__prime_tag_select_create__";

const optionDomId = (listboxId: string, value: string) =>
  `${listboxId}-opt-${value.replace(/\s+/g, "_")}`;

/** Matches of the query, the selected ones first: they can be unticked from here too. */
function listOptions(options: TagSelectOption[], query: string, selected: string[]) {
  const q = query.trim().toLowerCase();
  const matched = q
    ? options.filter(
        (o) =>
          !o.disabled && (o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)),
      )
    : options;
  return [
    ...matched.filter((o) => selected.includes(o.value)),
    ...matched.filter((o) => !selected.includes(o.value)),
  ];
}

/** The Create row: a typed text that is neither picked nor an existing option. */
function canCreate(
  creatable: boolean,
  text: string,
  selected: string[],
  options: TagSelectOption[],
) {
  if (!creatable || !text || selected.includes(text)) return false;
  const lower = text.toLowerCase();
  return !options.some(
    (o) => o.value === text || o.label.toLowerCase() === lower || o.value.toLowerCase() === lower,
  );
}

export type TagSelectProps = FieldFrameProps & {
  /** Available tags: value, label and chip color. */
  options: TagSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Allow adding a value that is not in `options`. */
  creatable?: boolean;
  /** A new value was created (Create row or Enter), not picked from `options`. */
  onCreate?: (value: string) => void;
  /** Chip color of values without an option color, including created ones. */
  defaultColor?: PaletteColor;
  /** Enables the «⋯» row menu: tag name and color. `value` never changes. */
  onOptionUpdate?: (value: string, updates: TagSelectOptionUpdate) => void;
  /** Enables «Удалить» in the row menu; the value is also removed from the selection. */
  onOptionDelete?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** Danger ring and `aria-invalid`; a non-empty `error` implies it. */
  invalid?: boolean;
  /** Field tier; the list uses the same tier, chips one tier down. */
  size?: ControlSize;
  /** Id of the text input; generated when omitted. */
  id?: string;
  labels?: Partial<TagSelectLabels>;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

/**
 * A multi-value field shown as tag chips: pick from a list, type to filter, create new values.
 * At rest one row (extra chips fold into «+N»); focused or open it shows every chip.
 */
export function TagSelect({
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  creatable = false,
  onCreate,
  defaultColor = "gray",
  onOptionUpdate,
  onOptionDelete,
  disabled = false,
  placeholder = "",
  invalid: invalidProp,
  focusRing = true,
  size = "m",
  label,
  required = false,
  optional,
  hint,
  error,
  id: idProp,
  labels: labelsProp,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: TagSelectProps) {
  const labels = React.useMemo(
    () => ({
      ...TAG_SELECT_LABELS,
      ...labelsProp,
      colorNames: { ...TAG_SELECT_LABELS.colorNames, ...labelsProp?.colorNames },
    }),
    [labelsProp],
  );
  const ids = useFieldFrame(idProp, { hint, error, invalid: invalidProp });
  const inputId = ids.controlId;
  const listboxId = `${inputId}-listbox`;

  const [selected, setSelected] = useControllableState<string[]>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [inputValue, setInputValue] = React.useState("");
  /** Focus inside the field (input or a chip): it expands and shows every chip. */
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const [highlightedValue, setHighlightedValue] = React.useState<string | undefined>();
  const [menuValue, setMenuValue] = React.useState<string | null>(null);
  /** Values created here, kept as options until the parent adds them to `options`. */
  const [created, setCreated] = React.useState<TagSelectOption[]>([]);
  /** Where focus goes after a chip is removed from the keyboard: a chip index, or -1 for the input. */
  const pendingChipFocus = React.useRef<number | null>(null);

  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const chipsRef = React.useRef<HTMLElement | null>(null);
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listboxRef = React.useRef<HTMLElement | null>(null);

  const overlayPortalLayer = useOverlayPortalLayer();
  const position = usePosition(open, triggerRef, listboxRef, {
    side: "bottom",
    align: "start",
    matchAnchorWidth: true,
  });
  const presence = usePresence(open, { exitDuration: "fast" });

  // The parent added a created value to `options`: drop the local copy.
  React.useEffect(() => {
    setCreated((prev) => {
      const next = prev.filter((c) => !options.some((o) => o.value === c.value));
      return next.length === prev.length ? prev : next;
    });
  }, [options]);

  const allOptions = React.useMemo(() => {
    const extra = created.filter((c) => !options.some((o) => o.value === c.value));
    return extra.length ? [...options, ...extra] : options;
  }, [options, created]);

  const inputTrim = inputValue.trim();
  const listed = React.useMemo(
    () => listOptions(allOptions, inputValue, selected),
    [allOptions, inputValue, selected],
  );
  const showCreate = canCreate(creatable, inputTrim, selected, allOptions);
  const hasPanelContent = listed.length > 0 || showCreate;
  const manageable = Boolean(onOptionUpdate || onOptionDelete);

  const navigable = React.useMemo(
    () => [
      ...(showCreate ? [CREATE_VALUE] : []),
      ...listed.filter((o) => !o.disabled).map((o) => o.value),
    ],
    [listed, showCreate],
  );

  React.useEffect(() => {
    setHighlightedValue((prev) =>
      !open || navigable.length === 0
        ? undefined
        : prev && navigable.includes(prev)
          ? prev
          : navigable[0],
    );
  }, [open, navigable]);

  React.useEffect(() => {
    if (open && !hasPanelContent) setOpen(false);
  }, [open, hasPanelContent, setOpen]);

  React.useEffect(() => {
    if (!open) setMenuValue(null);
  }, [open]);

  // A row menu is its own (topmost) layer: Escape and presses in it never reach this panel.
  useEscapeKey({ enabled: open && menuValue === null, onEscape: () => setOpen(false) });
  useOutsideClick({
    refs: [triggerRef, listboxRef],
    enabled: open,
    onOutsideClick: () => setOpen(false),
  });

  const handleOptionUpdate = onOptionUpdate
    ? (optionValue: string, updates: TagSelectOptionUpdate) => {
        if (!options.some((o) => o.value === optionValue)) {
          setCreated((prev) =>
            prev.map((o) => (o.value === optionValue ? { ...o, ...updates } : o)),
          );
        }
        onOptionUpdate(optionValue, updates);
      }
    : undefined;

  const handleOptionDelete = onOptionDelete
    ? (optionValue: string) => {
        setSelected((prev) => prev.filter((x) => x !== optionValue));
        setCreated((prev) => prev.filter((o) => o.value !== optionValue));
        onOptionDelete(optionValue);
      }
    : undefined;

  const pick = (rawValue: string) => {
    if (rawValue === CREATE_VALUE) {
      const text = inputTrim;
      if (!text) return;
      if (!selected.includes(text)) {
        onCreate?.(text);
        setSelected((prev) => (prev.includes(text) ? prev : [...prev, text]));
      }
      setCreated((prev) =>
        prev.some((o) => o.value === text) || options.some((o) => o.value === text)
          ? prev
          : [...prev, { value: text, label: text, color: defaultColor }],
      );
    } else {
      setSelected((prev) =>
        prev.includes(rawValue) ? prev.filter((x) => x !== rawValue) : [...prev, rawValue],
      );
    }
    setInputValue("");
  };

  const chips = selected.map((v) => {
    const option = allOptions.find((o) => o.value === v);
    return { value: v, label: option?.label ?? v, color: option?.color ?? defaultColor };
  });

  const removeChip = (chip: { value: string; label: string }) => {
    setSelected((prev) => prev.filter((x) => x !== chip.value));
    setAnnouncement(formatLabel(labels.removed, { label: chip.label }));
  };

  const chipElements = () =>
    Array.from(chipsRef.current?.querySelectorAll<HTMLElement>("[data-chip-value]") ?? []);

  // After a keyboard removal: focus the neighbour chip or the input.
  React.useLayoutEffect(() => {
    const target = pendingChipFocus.current;
    if (target === null) return;
    pendingChipFocus.current = null;
    const now = chipElements();
    const chip = target >= 0 ? (now[target] ?? now[now.length - 1]) : undefined;
    (chip ?? inputRef.current)?.focus();
  });

  /** Expanded (focus inside or open): every chip on wrapped rows, no «+N». */
  const expanded = !disabled && (focusWithin || open);
  /** At rest with chips and no query the input folds away; an empty field keeps the placeholder. */
  const inputCollapsed = !expanded && inputTrim.length === 0 && selected.length > 0;
  const visibleCount = useChipOverflow({
    rowRef: chipsRef,
    measureRef,
    inputRef,
    count: chips.length,
    inputCollapsed,
  });
  const visibleChips = expanded ? chips : chips.slice(0, visibleCount);
  const hiddenChips = expanded ? [] : chips.slice(visibleCount);

  // Expanded: keep the input (last in the scrolling row) in view.
  React.useEffect(() => {
    const row = chipsRef.current;
    if (expanded && row) row.scrollTop = row.scrollHeight;
  }, [expanded]);

  const listboxKeys = (event: React.KeyboardEvent<HTMLElement>) =>
    handleListboxKeyDown(event, {
      items: enabledOptions(listboxRef.current),
      highlightedValue,
      setHighlightedValue,
      onSelect: pick,
      onClose: () => setOpen(false),
    });

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const input = event.currentTarget;

    if (event.key === "Backspace" && !inputValue && chips.length > 0) {
      event.preventDefault();
      const last = chips[chips.length - 1];
      if (last) removeChip(last);
      return;
    }
    // ArrowLeft at the start of the input moves to the last chip.
    if (
      event.key === "ArrowLeft" &&
      input.selectionStart === 0 &&
      input.selectionEnd === 0 &&
      chips.length > 0
    ) {
      event.preventDefault();
      chipElements().at(-1)?.focus();
      return;
    }
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) return;
    if (!open) {
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && hasPanelContent) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (navigable.length === 0) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(highlightedValue ?? navigable[0] ?? "");
      return;
    }
    listboxKeys(event);
  };

  const onChipKeyDown = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (event.target !== event.currentTarget) return;
    const all = chipElements();
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      all[Math.max(0, index - 1)]?.focus();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      (all[index + 1] ?? inputRef.current)?.focus();
    } else if ((event.key === "Delete" || event.key === "Backspace") && !disabled) {
      event.preventDefault();
      const chip = chips[index];
      if (!chip) return;
      // Backspace goes to the previous chip, Delete to the next; with no chips left, to the input.
      const next = event.key === "Backspace" ? index - 1 : index;
      pendingChipFocus.current = chips.length > 1 ? Math.max(0, next) : -1;
      removeChip(chip);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const inside = (node: unknown) =>
      node instanceof Node &&
      (triggerRef.current?.contains(node) || listboxRef.current?.contains(node));
    if (inside(event.relatedTarget)) return;
    window.requestAnimationFrame(() => {
      if (inside(document.activeElement)) return;
      setFocusWithin(false);
      setInputValue("");
    });
  };

  const renderChip = (
    chip: { value: string; label: string; color: PaletteColor },
    index?: number,
  ) => {
    const live = index !== undefined;
    return (
      <Badge.Root
        key={chip.value}
        color={chip.color}
        disabled={disabled}
        className={styles.chip}
        labels={{ remove: formatLabel(labels.remove, { label: chip.label }) }}
        // Reached with the arrow keys from the input (not a tab stop); Delete / Backspace remove.
        tabIndex={live && !disabled ? -1 : undefined}
        data-chip-value={live ? chip.value : undefined}
        onKeyDown={live ? (event) => onChipKeyDown(event, index) : undefined}
        onRemove={live ? () => removeChip(chip) : () => {}}
        // Removing keeps focus in the field and does not open the list.
        onMouseDown={(event) => {
          if ((event.target as Element).closest("button")) event.preventDefault();
        }}
        onClick={(event) => {
          if ((event.target as Element).closest("button")) event.stopPropagation();
        }}
      >
        <span className={styles.chipLabel}>{chip.label}</span>
      </Badge.Root>
    );
  };

  const optionRow = (option: TagSelectOption) => {
    const isSelected = selected.includes(option.value);
    const content = (
      <>
        <Checkbox.Indicator
          checked={isSelected}
          disabled={option.disabled}
          size={CHECKBOX_SIZE[size]}
        />
        <Badge.Root
          color={option.color ?? defaultColor}
          disabled={option.disabled}
          className={styles.chip}
        >
          <span className={styles.chipLabel}>{option.label}</span>
        </Badge.Root>
      </>
    );
    const rowProps = {
      id: optionDomId(listboxId, option.value),
      role: "option",
      tabIndex: -1,
      "aria-selected": isSelected,
      onMouseMove: () => {
        if (!option.disabled) setHighlightedValue(option.value);
      },
      ...toDataAttributes({
        value: option.value,
        label: option.label,
        highlighted: highlightedValue === option.value,
        selected: isSelected,
        disabled: Boolean(option.disabled),
      }),
    } as const;
    const preventBlur = (event: React.MouseEvent) => {
      if (!option.disabled) event.preventDefault();
    };

    if (!manageable) {
      return (
        <button
          key={option.value}
          type="button"
          {...rowProps}
          disabled={option.disabled}
          className={cx(menu.item, styles.option)}
          onMouseDown={preventBlur}
          onClick={() => !option.disabled && pick(option.value)}
        >
          {content}
        </button>
      );
    }
    return (
      <div
        key={option.value}
        {...rowProps}
        aria-disabled={option.disabled || undefined}
        className={cx(menu.item, styles.option, styles.optionManaged)}
      >
        <button
          type="button"
          tabIndex={-1}
          className={styles.optionPick}
          disabled={option.disabled}
          onMouseDown={preventBlur}
          onClick={() => !option.disabled && pick(option.value)}
        >
          {content}
        </button>
        {option.disabled ? null : (
          <TagOptionMenu
            value={option.value}
            label={option.label}
            color={option.color ?? defaultColor}
            open={menuValue === option.value}
            onOpenChange={(next) => setMenuValue(next ? option.value : null)}
            onUpdate={handleOptionUpdate}
            onDelete={handleOptionDelete}
            labels={labels}
            disabled={disabled}
          />
        )}
      </div>
    );
  };

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
      <ControlSizeProvider value={size}>
        {/* One tab stop: the input[role=combobox]; a click on the field focuses the input. */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: a multi-value field around its combobox */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled on the input and the chips */}
        <div
          ref={triggerRef}
          className={styles.control}
          onClick={(event) => {
            if (disabled) return;
            // A click on a chip focuses the chip (for the keyboard); elsewhere the input.
            if (!(event.target as Element).closest("[data-chip-value]")) inputRef.current?.focus();
            if (hasPanelContent) setOpen(true);
          }}
          onFocus={() => setFocusWithin(true)}
          onBlur={handleBlur}
          {...toDataAttributes({
            size,
            expanded: expanded || undefined,
            state: open ? "open" : "closed",
            disabled: disabled || undefined,
            invalid: ids.invalid || undefined,
            "focus-ring": focusRing ? undefined : false,
          })}
        >
          <ScrollContainer ref={chipsRef} fade={expanded} className={styles.chips}>
            {visibleChips.map((chip, index) => renderChip(chip, index))}
            {hiddenChips.length > 0 ? (
              // A real button; the click bubbles to the field, which expands and opens the list.
              <Badge.Root
                disabled={disabled}
                className={styles.chipMore}
                title={hiddenChips.map((chip) => chip.label).join(", ")}
                onPress={() => inputRef.current?.focus()}
              >
                <span aria-hidden="true">+{hiddenChips.length}</span>
                <VisuallyHidden>
                  {formatLabel(labels.more, { count: hiddenChips.length })}
                </VisuallyHidden>
              </Badge.Root>
            ) : null}
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-invalid={ids.invalid || undefined}
              aria-required={required || undefined}
              aria-describedby={ids.describedBy}
              aria-activedescendant={
                open && highlightedValue ? optionDomId(listboxId, highlightedValue) : undefined
              }
              disabled={disabled}
              placeholder={selected.length === 0 ? placeholder : undefined}
              className={styles.input}
              data-collapsed={inputCollapsed || undefined}
              value={inputValue}
              onChange={(event) => {
                const next = event.target.value;
                setInputValue(next);
                setOpen(
                  listOptions(allOptions, next, selected).length > 0 ||
                    canCreate(creatable, next.trim(), selected, allOptions),
                );
              }}
              onKeyDown={onInputKeyDown}
              onFocus={() => {
                if (!disabled && hasPanelContent) setOpen(true);
              }}
            />
          </ScrollContainer>
          <VisuallyHidden role="status" aria-live="polite">
            {announcement}
          </VisuallyHidden>

          {/* An invisible row of every chip: the widths behind «+N». */}
          <div ref={measureRef} className={styles.measure} aria-hidden inert>
            {chips.map((chip) => renderChip(chip))}
            <Badge.Root className={styles.chipMore}>+{Math.max(chips.length, 9)}</Badge.Root>
          </div>

          <span className={styles.chevron} aria-hidden="true">
            <Icon name="nav.chevronDown" />
          </span>
        </div>

        <Portal>
          <DropdownLayerContext.Provider value>
            <ScrollContainer
              ref={position.attachLayer}
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-hidden={!open}
              tabIndex={-1}
              hidden={!presence.mounted}
              data-react-aria-top-layer="true"
              data-overlay-portal-layer={overlayPortalLayer}
              className={cx(
                surface.surface,
                surface.dropdownLayer,
                menu.tier,
                menu.menu,
                styles.panel,
                overlayMotion.floating,
              )}
              onKeyDown={listboxKeys}
              onAnimationEnd={presence.onExitEnd}
              {...toDataAttributes({ side: position.side, size, state: presence.state })}
            >
              {labels.panelHint ? <div className={styles.panelHint}>{labels.panelHint}</div> : null}
              {showCreate ? (
                <button
                  id={optionDomId(listboxId, CREATE_VALUE)}
                  type="button"
                  role="option"
                  aria-selected={false}
                  tabIndex={-1}
                  className={cx(menu.item, styles.option)}
                  {...toDataAttributes({
                    value: CREATE_VALUE,
                    label: inputTrim,
                    highlighted: highlightedValue === CREATE_VALUE,
                    disabled: false,
                  })}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => setHighlightedValue(CREATE_VALUE)}
                  onClick={() => pick(CREATE_VALUE)}
                >
                  <span className={styles.createIcon} aria-hidden="true">
                    <Icon name="action.add" />
                  </span>
                  <span className={styles.createLabel}>{labels.create}</span>
                  <Badge.Root color={defaultColor} className={styles.chip}>
                    <span className={styles.chipLabel}>{inputTrim}</span>
                  </Badge.Root>
                </button>
              ) : null}
              {listed.map(optionRow)}
            </ScrollContainer>
          </DropdownLayerContext.Provider>
        </Portal>
      </ControlSizeProvider>
    </FieldFrame>
  );
}
TagSelect.displayName = "TagSelect";

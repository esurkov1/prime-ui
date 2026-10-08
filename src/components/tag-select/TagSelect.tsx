import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
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
import { formatLabel } from "@/internal/formatLabel";
import {
  enabledOptions,
  handleListboxKeyDown,
  optionDomId,
  type Store,
  useCreateStore,
  useStoreSlice,
} from "@/internal/listbox";
import menu from "@/internal/menu.module.css";
import { FloatingPanel } from "@/internal/overlay/FloatingPanel";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { type ControlSize, type PaletteColor, stepDown } from "@/internal/states";
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

const CREATE_VALUE = "__prime_tag_select_create__";

type Chip = { value: string; label: string; color: PaletteColor };

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

export type TagSelectProps = FieldRootDomProps &
  FieldFrameProps & {
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
  ...rest
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
  const highlight = useCreateStore<string | undefined>(undefined);
  const [menuValue, setMenuValue] = React.useState<string | null>(null);
  /**
   * Values created here, kept as options until the parent adds them to `options` (then the copy
   * is ignored by `allOptions`).
   */
  const [created, setCreated] = React.useState<TagSelectOption[]>([]);
  /** Where focus goes after a chip is removed from the keyboard: a chip index, or -1 for the input. */
  const pendingChipFocus = React.useRef<number | null>(null);

  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const chipsRef = React.useRef<HTMLElement | null>(null);
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

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
  /** The list shows while open and there is something to show. */
  const shown = open && hasPanelContent;

  const navigable = React.useMemo(
    () => [
      ...(showCreate ? [CREATE_VALUE] : []),
      ...listed.filter((o) => !o.disabled).map((o) => o.value),
    ],
    [listed, showCreate],
  );

  // The highlight stays on its option while the list filters; the first one otherwise.
  React.useLayoutEffect(() => {
    const current = highlight.get();
    if (!shown || navigable.length === 0) highlight.set(undefined);
    else if (current === undefined || !navigable.includes(current)) highlight.set(navigable[0]);
  }, [shown, navigable, highlight]);

  // Closing the list closes a row menu with it.
  if (!open && menuValue !== null) setMenuValue(null);

  // Focus stays in the input: the list never takes it and gives nothing back on close. Escape and
  // presses inside a row menu (its own topmost layer) never reach the list.
  const floating = useFloatingLayer({
    open: shown,
    onOpenChange: setOpen,
    triggerRef,
    side: "bottom",
    align: "start",
    matchAnchorWidth: true,
  });
  const listboxRef = floating.contentRef;
  const activeDescendant = useStoreSlice(highlight, (value) =>
    shown && value ? optionDomId(listboxId, value) : undefined,
  );

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

  const chips = React.useMemo<Chip[]>(() => {
    const byValue = new Map(allOptions.map((o) => [o.value, o]));
    return selected.map((v) => {
      const option = byValue.get(v);
      return { value: v, label: option?.label ?? v, color: option?.color ?? defaultColor };
    });
  }, [selected, allOptions, defaultColor]);

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
    chips,
    inputCollapsed,
  });
  const visibleChips = expanded ? chips : chips.slice(0, visibleCount);
  const hiddenChips = expanded ? [] : chips.slice(visibleCount);

  // Expanded: keep the input (last in the scrolling row) in view.
  React.useEffect(() => {
    const row = chipsRef.current;
    if (expanded && row) row.scrollTop = row.scrollHeight;
  }, [expanded]);

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
    // Space, Home and End edit the text (a tag may have several words); Escape is the layer
    // stack's.
    if (!["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) return;
    if (!shown) {
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && hasPanelContent) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (navigable.length === 0) return;
    if (event.key === "Enter") {
      event.preventDefault();
      pick(highlight.get() ?? navigable[0] ?? "");
      return;
    }
    handleListboxKeyDown(event, {
      items: enabledOptions(listboxRef.current),
      highlight,
      onSelect: pick,
    });
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

  // Focus left the field (not for a chip, the input or the list): collapse and drop the query.
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (
      next instanceof Node &&
      (triggerRef.current?.contains(next) || listboxRef.current?.contains(next))
    ) {
      return;
    }
    setFocusWithin(false);
    setInputValue("");
  };

  const optionRow = (option: TagSelectOption) => {
    const isSelected = selected.includes(option.value);
    const pickOption = () => {
      if (!option.disabled) pick(option.value);
    };
    const content = (
      <>
        <Checkbox.Indicator checked={isSelected} disabled={option.disabled} size={stepDown(size)} />
        <Badge.Root
          color={option.color ?? defaultColor}
          disabled={option.disabled}
          className={styles.chip}
        >
          <span className={styles.chipLabel}>{option.label}</span>
        </Badge.Root>
      </>
    );

    return (
      <OptionRow
        key={option.value}
        id={optionDomId(listboxId, option.value)}
        value={option.value}
        label={option.label}
        selected={isSelected}
        disabled={Boolean(option.disabled)}
        highlight={highlight}
        managed={manageable}
        onPick={pickOption}
      >
        {manageable ? (
          <>
            <button
              type="button"
              tabIndex={-1}
              className={styles.optionPick}
              disabled={option.disabled}
              onMouseDown={(event) => {
                if (!option.disabled) event.preventDefault();
              }}
              onClick={pickOption}
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
          </>
        ) : (
          content
        )}
      </OptionRow>
    );
  };

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
      <ControlSizeProvider value={size}>
        {/* One tab stop: the input[role=combobox]; a click on the field focuses the input. */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: a multi-value field around its combobox */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled on the input and the chips */}
        <div
          ref={triggerRef}
          className={styles.control}
          onMouseDown={(event) => {
            // A press on the field itself keeps focus in the input: no blur, no collapse.
            const target = event.target as Element;
            if (target !== inputRef.current && !target.closest("[data-chip-value], button")) {
              event.preventDefault();
            }
          }}
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
            state: shown ? "open" : "closed",
            disabled: disabled || undefined,
            invalid: ids.invalid || undefined,
            "focus-ring": focusRing ? undefined : false,
          })}
        >
          <ScrollContainer ref={chipsRef} fade={expanded} className={styles.chips}>
            {visibleChips.map((chip, index) => (
              <Badge.Root
                key={chip.value}
                color={chip.color}
                disabled={disabled}
                className={styles.chip}
                labels={{ remove: formatLabel(labels.remove, { label: chip.label }) }}
                // Reached with the arrow keys from the input (not a tab stop); Delete / Backspace remove.
                tabIndex={disabled ? undefined : -1}
                data-chip-value={chip.value}
                onKeyDown={(event) => onChipKeyDown(event, index)}
                onRemove={() => removeChip(chip)}
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
            ))}
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
              aria-expanded={shown}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-invalid={ids.invalid || undefined}
              aria-required={required || undefined}
              aria-describedby={ids.describedBy}
              aria-activedescendant={activeDescendant}
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
          <MeasureRow
            ref={measureRef}
            chips={chips}
            disabled={disabled}
            removeLabel={labels.remove}
          />

          <span className={styles.chevron} aria-hidden="true">
            <Icon name="nav.chevronDown" />
          </span>
        </div>

        <FloatingPanel
          floating={floating}
          size={size}
          tier="dropdown"
          scroll
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          tabIndex={-1}
          className={cx(menu.tier, menu.menu, styles.panel)}
        >
          {labels.panelHint ? <div className={styles.panelHint}>{labels.panelHint}</div> : null}
          {showCreate ? (
            <OptionRow
              id={optionDomId(listboxId, CREATE_VALUE)}
              value={CREATE_VALUE}
              label={inputTrim}
              selected={false}
              disabled={false}
              highlight={highlight}
              managed={false}
              onPick={() => pick(CREATE_VALUE)}
            >
              <span className={styles.createIcon} aria-hidden="true">
                <Icon name="action.add" />
              </span>
              <span className={styles.createLabel}>{labels.create}</span>
              <Badge.Root color={defaultColor} className={styles.chip}>
                <span className={styles.chipLabel}>{inputTrim}</span>
              </Badge.Root>
            </OptionRow>
          ) : null}
          {listed.map(optionRow)}
        </FloatingPanel>
      </ControlSizeProvider>
    </FieldFrame>
  );
}
TagSelect.displayName = "TagSelect";

type OptionRowProps = {
  id: string;
  value: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  highlight: Store<string | undefined>;
  /** A row with its own pick button and «⋯» menu (a `div`); else the row is the pick button. */
  managed: boolean;
  onPick: () => void;
  children: React.ReactNode;
};

/** A list row; it subscribes to its own slice of the highlight, so moving it re-renders two rows. */
function OptionRow({
  id,
  value,
  label,
  selected,
  disabled,
  highlight,
  managed,
  onPick,
  children,
}: OptionRowProps) {
  const highlighted = useStoreSlice(highlight, (current) => current === value);
  const props = {
    id,
    role: "option",
    tabIndex: -1,
    "aria-selected": selected,
    onMouseMove: () => {
      if (!disabled && !highlighted) highlight.set(value);
    },
    ...toDataAttributes({ value, label, highlighted, selected, disabled }),
  } as const;

  if (managed) {
    return (
      <div
        {...props}
        aria-disabled={disabled || undefined}
        className={cx(menu.item, styles.option, styles.optionManaged)}
      >
        {children}
      </div>
    );
  }
  return (
    <button
      type="button"
      {...props}
      disabled={disabled}
      className={cx(menu.item, styles.option)}
      // Keeps focus in the input.
      onMouseDown={(event) => {
        if (!disabled) event.preventDefault();
      }}
      onClick={onPick}
    >
      {children}
    </button>
  );
}

type MeasureRowProps = {
  chips: Chip[];
  disabled: boolean;
  removeLabel: string;
  ref: React.Ref<HTMLDivElement>;
};

/** Every chip plus a «+N» sample, invisible: the widths behind «+N». Re-renders only with the chips. */
const MeasureRow = React.memo(function MeasureRow({
  chips,
  disabled,
  removeLabel,
  ref,
}: MeasureRowProps) {
  return (
    <div ref={ref} className={styles.measure} aria-hidden inert>
      {chips.map((chip) => (
        <Badge.Root
          key={chip.value}
          color={chip.color}
          disabled={disabled}
          className={styles.chip}
          labels={{ remove: formatLabel(removeLabel, { label: chip.label }) }}
          onRemove={noop}
        >
          <span className={styles.chipLabel}>{chip.label}</span>
        </Badge.Root>
      ))}
      <Badge.Root className={styles.chipMore}>+{Math.max(chips.length, 9)}</Badge.Root>
    </div>
  );
});

function noop() {}

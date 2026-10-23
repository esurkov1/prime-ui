import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { AUTOFILL_OFF } from "@/internal/autofill";
import { useHostTier } from "@/internal/ControlSizeContext";
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
import { fieldSurfaceClass, fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import {
  isComposingKey,
  type ListboxRegistry,
  optionDomId,
  revealHighlighted,
  type Store,
  useCreateStore,
  useListboxItem,
  useListboxRegistry,
  useStoreSlice,
} from "@/internal/listbox";
import { ListRowControls, ListRowMark, listRowStyles } from "@/internal/listRow";
import { menuRowProps, menuRowTier } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { FloatingPanel } from "@/internal/overlay/FloatingPanel";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { useOpenState } from "@/internal/overlay/useOpenState";
import { rovingIndex } from "@/internal/rovingFocus";
import type { ControlSize, PaletteColor } from "@/internal/states";
import { isPromiseLike, usePendingChanges, usePendingKeys } from "@/internal/usePendingChanges";

import { TagOptionMenu } from "./TagOptionMenu";
import styles from "./TagSelect.module.css";
import { useChipOverflow } from "./useChipOverflow";
import { VirtualOptions, type VirtualOptionsHandle } from "./VirtualOptions";

export type TagSelectOption = {
  value: string;
  label: string;
  color?: PaletteColor;
  disabled?: boolean;
};

export type TagSelectOptionUpdate = { label?: string; color?: PaletteColor };

export type TagSelectLabels = {
  /** Action text before the preview of a new tag (`creatable`). */
  create: string;
  /** Accessible name of a chip's remove button; `{label}` is the tag text. */
  remove: string;
  /** Accessible name of the «+N» chip; `{count}` is the number of hidden tags. */
  more: string;
  /** Screen-reader announcement after a tag is removed; `{label}` is the tag text. */
  removed: string;
  /** Screen-reader announcement when the `onCreate` promise rejects; `{label}` is the tag text. */
  createFailed: string;
  /** Screen-reader announcement when the `onOptionUpdate` promise rejects; `{label}` is the tag text. */
  updateFailed: string;
  /** Accessible name of a row's «⋯» menu; `{label}` is the tag text. */
  edit: string;
  /** Accessible name of the tag name field in the menu. */
  name: string;
  /** Delete button in the menu. */
  delete: string;
  /** Accessible name of the color swatch grid in the menu. */
  colors: string;
  /** Names of the palette colors in the menu. */
  colorNames: Record<PaletteColor, string>;
  /** Muted marker after the label when `optional`. */
  optional: string;
};

export const TAG_SELECT_LABELS: TagSelectLabels = {
  create: "Создать",
  remove: "Удалить {label}",
  more: "Показать ещё {count}",
  removed: "Удалено: {label}",
  createFailed: "Не удалось создать тег «{label}»",
  updateFailed: "Не удалось изменить тег «{label}»",
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
/** Listed options above which the panel renders only the options around the view. */
const VIRTUAL_FROM = 100;

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
  FieldFrameProps &
  FieldFocusRingProps & {
    options: TagSelectOption[];
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    creatable?: boolean;
    onCreate?: (value: string) => void | Promise<void>;
    fallbackColor?: PaletteColor;
    onOptionUpdate?: (value: string, updates: TagSelectOptionUpdate) => void | Promise<void>;
    onOptionDelete?: (value: string) => void | Promise<void>;
    disabled?: boolean;
    name?: string;
    placeholder?: string;
    invalid?: boolean;
    size?: ControlSize;
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
  closeOnEscape = true,
  closeOnOutsideClick = true,
  creatable = false,
  onCreate,
  fallbackColor = "gray",
  onOptionUpdate,
  onOptionDelete,
  disabled: disabledProp = false,
  name,
  placeholder = "",
  invalid: invalidProp,
  focusRing,
  size: sizeProp,
  label,
  required = false,
  optional,
  hint,
  hintTone,
  error,
  id: idProp,
  labels: labelsProp,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: TagSelectProps) {
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const disabled = useInheritedDisabled(disabledProp);
  const merged = useLabels(TAG_SELECT_LABELS, labelsProp);
  // The color names merge one level deeper: a partial `colorNames` keeps the other hues.
  const labels = React.useMemo(
    () => ({
      ...merged,
      colorNames: { ...TAG_SELECT_LABELS.colorNames, ...labelsProp?.colorNames },
    }),
    [merged, labelsProp?.colorNames],
  );
  const ids = useFieldFrame(idProp, { label, hint, error, invalid: invalidProp, required });
  const inputId = ids.controlId;
  const listboxId = `${inputId}-listbox`;

  const [selected, setSelected] = useControllableState<string[]>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useOpenState({
    open: openProp,
    defaultOpen,
    onOpenChange,
    disabled,
  });

  const [inputValue, setInputValue] = React.useState("");
  /** Focus inside the field (input or a chip): it expands and shows every chip. */
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const highlight = useCreateStore<string | undefined>(undefined);
  /** The rows on screen: Enter activates through it, a keyboard move reveals the row. */
  const registry = useListboxRegistry();
  const [menuValue, setMenuValue] = React.useState<string | null>(null);
  /**
   * Values created here, kept as options until the parent adds them to `options` (then the copy
   * is ignored by `allOptions`).
   */
  const [created, setCreated] = React.useState<TagSelectOption[]>([]);
  /** Options whose `onOptionDelete` Promise is pending: the row waits, nothing changes yet. */
  const { pending: deleting, track: trackDelete } = usePendingKeys<string>();
  /** Values whose `onCreate` Promise is pending: the chip stands, busy, until the answer. */
  const { pending: creating, track: trackCreate } = usePendingKeys<string>();
  /** Where focus goes after a chip is removed from the keyboard: a chip index, or -1 for the input. */
  const pendingChipFocus = React.useRef<number | null>(null);

  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const chipsRef = React.useRef<HTMLElement | null>(null);
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const knownOptions = React.useMemo(() => {
    const extra = created.filter((c) => !options.some((o) => o.value === c.value));
    return extra.length ? [...options, ...extra] : options;
  }, [options, created]);
  // Renames and recolors the owner is still saving are drawn ahead of its answer.
  const optionChanges = usePendingChanges(knownOptions, updateOption);
  const allOptions = optionChanges.shown;
  const updating = React.useMemo(
    () => new Set(optionChanges.pending.map((change) => change.value)),
    [optionChanges.pending],
  );

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
    closeOnEscape,
    closeOnOutsideClick,
    matchAnchorWidth: true,
  });
  const listboxRef = floating.contentRef;
  const scrollerRef = React.useRef<HTMLElement | null>(null);
  const virtualRef = React.useRef<VirtualOptionsHandle | null>(null);
  // A long list renders a window of options; the highlighted one (`aria-activedescendant` points
  // at it) and the one whose menu is open stay rendered wherever the list scrolls.
  const virtualized = listed.length > VIRTUAL_FROM;
  const pinnedHighlight = useStoreSlice(highlight, (value) => (virtualized ? value : undefined));
  const pinnedOptions = React.useMemo(() => {
    if (!virtualized) return [];
    return listed.flatMap((option, index) =>
      option.value === pinnedHighlight || option.value === menuValue ? [index] : [],
    );
  }, [virtualized, listed, pinnedHighlight, menuValue]);
  const getOptionKey = React.useCallback((index: number) => listed[index]?.value ?? "", [listed]);
  /** The highlight moved from the keyboard: its option comes into view in the list's own scroller. */
  const revealOption = (value: string) => {
    const index = virtualized ? listed.findIndex((option) => option.value === value) : -1;
    if (index >= 0) virtualRef.current?.reveal(index);
    else revealHighlighted(registry.nodeOf(value));
  };
  const activeDescendant = useStoreSlice(highlight, (value) =>
    shown && value ? optionDomId(listboxId, value) : undefined,
  );

  const handleOptionUpdate = onOptionUpdate
    ? (optionValue: string, updates: TagSelectOptionUpdate) => {
        const change: OptionChange = { value: optionValue, updates };
        // A value created here is kept here until the owner lists it in `options`.
        const applyHere = () => {
          if (!options.some((o) => o.value === optionValue)) {
            setCreated((prev) => prev.map((o) => updateOption(o, change)));
          }
        };
        const label = allOptions.find((o) => o.value === optionValue)?.label ?? optionValue;
        const result = onOptionUpdate(optionValue, updates);
        if (!isPromiseLike(result)) {
          applyHere();
          return;
        }
        optionChanges.track(change, result, {
          onResolve: applyHere,
          onReject: () => setAnnouncement(formatLabel(labels.updateFailed, { label })),
        });
      }
    : undefined;

  const applyOptionDelete = (optionValue: string) => {
    setSelected((prev) => prev.filter((x) => x !== optionValue));
    setCreated((prev) => prev.filter((o) => o.value !== optionValue));
  };

  const handleOptionDelete = onOptionDelete
    ? (optionValue: string) => {
        const result = trackDelete(optionValue, onOptionDelete(optionValue));
        if (!isPromiseLike(result)) {
          applyOptionDelete(optionValue);
          return;
        }
        // The busy «⋯» turns disabled: focus waits in the input, where a confirmation the owner
        // opens gives it back.
        inputRef.current?.focus();
        result.then(
          () => {
            // Focus left on the row that leaves goes to the input.
            if (registry.nodeOf(optionValue)?.contains(document.activeElement)) {
              inputRef.current?.focus();
            }
            applyOptionDelete(optionValue);
          },
          () => {},
        );
      }
    : undefined;

  const pick = (rawValue: string) => {
    if (deleting.has(rawValue)) return;
    if (rawValue === CREATE_VALUE) {
      const text = inputTrim;
      if (!text) return;
      if (!selected.includes(text)) {
        const result = trackCreate(text, onCreate?.(text));
        setSelected((prev) => (prev.includes(text) ? prev : [...prev, text]));
        if (isPromiseLike(result)) {
          result.then(
            () => {},
            () => {
              // Refused: the new value goes again, from the selection and from the list.
              setSelected((prev) => prev.filter((x) => x !== text));
              setCreated((prev) => prev.filter((o) => o.value !== text));
              setAnnouncement(formatLabel(labels.createFailed, { label: text }));
            },
          );
        }
      }
      setCreated((prev) =>
        prev.some((o) => o.value === text) || options.some((o) => o.value === text)
          ? prev
          : [...prev, { value: text, label: text, color: fallbackColor }],
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
      return { value: v, label: option?.label ?? v, color: option?.color ?? fallbackColor };
    });
  }, [selected, allOptions, fallbackColor]);

  const removeChip = (chip: { value: string; label: string }) => {
    // A tag still being created waits for its answer.
    if (creating.has(chip.value)) return;
    setSelected((prev) => prev.filter((x) => x !== chip.value));
    setAnnouncement(formatLabel(labels.removed, { label: chip.label }));
  };

  const chipElements = () =>
    Array.from(
      // A chip on its way out (`data-leaving`) is a copy that only closes up.
      chipsRef.current?.querySelectorAll<HTMLElement>("[data-chip-value]:not([data-leaving])") ??
        [],
    );

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
    // Shift+F10 or the context menu key opens the «⋯» menu of the highlighted row.
    if ((event.key === "F10" && event.shiftKey) || event.key === "ContextMenu") {
      const current = highlight.get();
      const row = allOptions.find((option) => option.value === current);
      if (!shown || !manageable || !row || row.disabled || deleting.has(row.value)) return;
      event.preventDefault();
      setMenuValue(row.value);
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
      // Enter of a composing input method confirms its text, not an option.
      if (isComposingKey(event)) return;
      event.preventDefault();
      registry.activate(highlight.get() ?? navigable[0] ?? "");
      return;
    }
    const next = rovingIndex(
      event.key,
      navigable.indexOf(highlight.get() ?? ""),
      navigable.length,
      "vertical",
    );
    const target = next === null ? undefined : navigable[next];
    if (target === undefined) return;
    event.preventDefault();
    highlight.set(target);
    revealOption(target);
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
      if (!chip || creating.has(chip.value)) return;
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

  const setSize = listed.length + (showCreate ? 1 : 0);
  // The option rows stand a tier below the panel (`s` in an `m` field).
  const rowTier = menuRowTier(size);
  const optionRow = (
    option: TagSelectOption,
    windowed?: { index: number; measure: (node: HTMLElement | null) => void },
  ) => {
    const isSelected = selected.includes(option.value);
    const pending = deleting.has(option.value);
    const saving = updating.has(option.value);
    const pickOption = () => {
      if (!option.disabled) pick(option.value);
    };
    const content = (
      <>
        <span className={listRowStyles.indicator}>
          <Checkbox.Indicator checked={isSelected} disabled={option.disabled} size={rowTier} />
        </span>
        <Badge.Root
          color={option.color ?? fallbackColor}
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
        registry={registry}
        managed={manageable}
        pending={pending}
        size={rowTier}
        onPick={pickOption}
        ref={windowed?.measure}
        posInSet={windowed ? windowed.index + 1 + (showCreate ? 1 : 0) : undefined}
        setSize={windowed ? setSize : undefined}
      >
        {manageable ? (
          <>
            <button
              type="button"
              tabIndex={-1}
              className={cx(listRowStyles.hit, styles.optionPick)}
              disabled={option.disabled || pending}
              data-interactive={option.disabled || pending ? undefined : ""}
              onMouseDown={(event) => {
                if (!option.disabled) event.preventDefault();
              }}
              onClick={pickOption}
            >
              {content}
            </button>
            {option.disabled ? null : (
              // The row's own control, beside its pick button: as tall as the row minus 8.
              <ListRowControls size={rowTier} lines="line">
                <TagOptionMenu
                  value={option.value}
                  label={option.label}
                  color={option.color ?? fallbackColor}
                  open={menuValue === option.value && !pending}
                  onOpenChange={(next) => setMenuValue(next ? option.value : null)}
                  onUpdate={handleOptionUpdate}
                  onDelete={handleOptionDelete}
                  labels={labels}
                  disabled={disabled}
                  pending={pending}
                  saving={saving}
                />
              </ListRowControls>
            )}
          </>
        ) : (
          content
        )}
      </OptionRow>
    );
  };

  return tier.provide(
    <FieldFrame
      {...rest}
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
      {/* One tab stop: the input[role=combobox]; a click on the field focuses the input. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: a multi-value field around its combobox */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled on the input and the chips */}
      <div
        ref={triggerRef}
        className={cx(fieldTierClass, fieldSurfaceClass, styles.control)}
        onMouseDown={(event) => {
          // A press on the field itself keeps focus in the input: no blur, no collapse.
          const target = event.target as Element;
          if (target !== inputRef.current && !target.closest("[data-chip-value], button")) {
            event.preventDefault();
          }
        }}
        onClick={(event) => {
          if (disabled) return;
          const target = event.target as Element;
          // A chip's remove button keeps focus in the field and does not open the list.
          if (target.closest("[data-chip-value] button")) return;
          // A click on a chip focuses the chip (for the keyboard); elsewhere the input.
          if (!target.closest("[data-chip-value]")) inputRef.current?.focus();
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
          "focus-ring": focusRing,
        })}
      >
        <ScrollContainer
          ref={chipsRef}
          // Collapsed: one row that never scrolls (the rest is the «+N» chip); expanded: up to
          // three rows, then it scrolls with faded edges.
          edges={expanded ? "fade" : "none"}
          lock={!expanded}
          className={styles.chips}
        >
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
              loading={creating.has(chip.value)}
              onKeyDown={(event) => onChipKeyDown(event, index)}
              onRemove={() => removeChip(chip)}
              // Removing keeps focus in the field (the field ignores the click itself).
              onMouseDown={(event) => {
                if ((event.target as Element).closest("button")) event.preventDefault();
              }}
            >
              <span className={styles.chipLabel}>{chip.label}</span>
            </Badge.Root>
          ))}
          {hiddenChips.length > 0 ? (
            // A real button around the chip; the click bubbles to the field, which expands and
            // opens the list.
            <button
              type="button"
              className={styles.chipMoreButton}
              disabled={disabled}
              title={hiddenChips.map((chip) => chip.label).join(", ")}
              onClick={() => inputRef.current?.focus()}
            >
              <Badge.Root color="gray" disabled={disabled} className={styles.chipMore}>
                <span aria-hidden="true">+{hiddenChips.length}</span>
                <VisuallyHidden>
                  {formatLabel(labels.more, { count: hiddenChips.length })}
                </VisuallyHidden>
              </Badge.Root>
            </button>
          ) : null}
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={shown}
            aria-controls={shown ? listboxId : undefined}
            aria-autocomplete="list"
            {...AUTOFILL_OFF}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-invalid={ids.invalid || undefined}
            aria-required={ids.required || undefined}
            aria-keyshortcuts={manageable ? "Shift+F10" : undefined}
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
        {name
          ? selected.map((item) => (
              <input key={item} type="hidden" name={name} value={item} disabled={disabled} />
            ))
          : null}
        <VisuallyHidden live="polite">{announcement}</VisuallyHidden>

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
        scroll
        id={listboxId}
        role="listbox"
        aria-multiselectable="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : (ariaLabelledBy ?? ids.labelledBy)}
        tabIndex={-1}
        ref={scrollerRef}
        className={cx(fieldTierClass, menu.tier, menu.menu, menu.list, styles.panel)}
      >
        {showCreate ? (
          <OptionRow
            id={optionDomId(listboxId, CREATE_VALUE)}
            value={CREATE_VALUE}
            label={inputTrim}
            selected={false}
            disabled={false}
            highlight={highlight}
            registry={registry}
            managed={false}
            size={rowTier}
            onPick={() => pick(CREATE_VALUE)}
          >
            <ListRowMark size={rowTier} lines="line">
              <Icon name="action.add" />
            </ListRowMark>
            <span className={styles.createLabel}>{labels.create}</span>
            <Badge.Root color={fallbackColor} className={styles.chip}>
              <span className={styles.chipLabel}>{inputTrim}</span>
            </Badge.Root>
          </OptionRow>
        ) : null}
        {virtualized ? (
          <VirtualOptions
            ref={virtualRef}
            count={listed.length}
            getKey={getOptionKey}
            scrollRef={scrollerRef}
            pinned={pinnedOptions}
            size={size}
            renderOption={(index, measure) => {
              const option = listed[index];
              return option ? optionRow(option, { index, measure }) : null;
            }}
          />
        ) : (
          listed.map((option) => optionRow(option))
        )}
      </FloatingPanel>
    </FieldFrame>,
  );
}
TagSelect.displayName = "TagSelect";

/** A rename or recolor of option `value`. */
type OptionChange = { value: string; updates: TagSelectOptionUpdate };

function updateOption(option: TagSelectOption, change: OptionChange): TagSelectOption;
function updateOption(options: TagSelectOption[], change: OptionChange): TagSelectOption[];
function updateOption(
  target: TagSelectOption | TagSelectOption[],
  change: OptionChange,
): TagSelectOption | TagSelectOption[] {
  const one = (option: TagSelectOption) =>
    option.value === change.value ? { ...option, ...change.updates } : option;
  return Array.isArray(target) ? target.map(one) : one(target);
}

type OptionRowProps = {
  id: string;
  value: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  highlight: Store<string | undefined>;
  registry: ListboxRegistry;
  /** A row with its own pick button and «⋯» menu (a `div`); else the row is the pick button. */
  managed: boolean;
  /** Its deletion is pending: busy, not pickable. */
  pending?: boolean;
  /** The row's tier (a tier below the panel). */
  size: ControlSize;
  onPick: () => void;
  /** A windowed list: measures the row, and its place among every option. */
  ref?: ((node: HTMLElement | null) => void) | undefined;
  posInSet?: number | undefined;
  setSize?: number | undefined;
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
  registry,
  managed,
  pending = false,
  size,
  onPick,
  ref,
  posInSet,
  setSize,
  children,
}: OptionRowProps) {
  const highlighted = useStoreSlice(highlight, (current) => current === value);
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const setRefs = useMergedRefs(nodeRef, ref);
  useListboxItem(
    registry,
    value,
    {
      label,
      haystack: label.toLowerCase(),
      disabled: disabled || pending,
      onActivate: onPick,
    },
    nodeRef,
  );
  const props = {
    id,
    ref: setRefs,
    role: "option",
    "aria-posinset": posInSet,
    "aria-setsize": setSize,
    tabIndex: -1,
    "aria-selected": selected,
    "aria-busy": pending || undefined,
    onMouseMove: () => {
      if (!disabled && !highlighted) highlight.set(value);
    },
    ...toDataAttributes({ value, pending: pending || undefined }),
  } as const;
  // A choice of several: a checked row in the accent's tone.
  const row = {
    size,
    highlighted,
    disabled,
    checked: selected,
    className: styles.option,
  };

  if (managed) {
    // The row holds its pick button (the hit element) and the «⋯» menu beside it.
    return (
      <div
        {...props}
        {...menuRowProps({ ...row, hit: false })}
        aria-disabled={disabled || undefined}
      >
        {children}
      </div>
    );
  }
  return (
    <button
      type="button"
      {...props}
      {...menuRowProps(row)}
      disabled={disabled}
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
    // The clip keeps the row (wider than the field with many tags) out of the scroll width of
    // every scroller around the field; the row itself keeps its full width to measure.
    <div className={styles.measureClip} aria-hidden inert>
      <div ref={ref} className={styles.measure}>
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
        <Badge.Root color="gray" className={styles.chipMore}>
          +{Math.max(chips.length, 9)}
        </Badge.Root>
      </div>
    </div>
  );
});

function noop() {}

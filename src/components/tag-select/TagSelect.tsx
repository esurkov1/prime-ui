import * as React from "react";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { DropdownLayerContext } from "@/components/popover/layer";
import { Popover } from "@/components/popover/Popover";
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
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import { getScrollContainers } from "@/internal/scrollAncestors";
import type { ControlSize, PaletteColor } from "@/internal/states";
import {
  handleListboxKeyDown as handleSelectListboxKeyDown,
  enabledOptions as queryEnabledSelectOptions,
} from "../select/selectListbox";

const CheckIcon = ({ className }: { className?: string }) => (
  <Icon name="action.check" className={className} />
);
const ChevronIcon = () => <Icon name="nav.chevronDown" />;

import styles from "./TagSelect.module.css";

export type TagSelectOption = {
  value: string;
  label: string;
  color?: PaletteColor;
  disabled?: boolean;
};

const CREATE_VALUE = "__prime_tag_select_create__";

function tagOptionDomId(listboxId: string, value: string): string {
  return `${listboxId}-opt-${value.replace(/\s+/g, "_")}`;
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M12 6v12M6 12h12"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Сколько чипов помещается в одну строку поля; остальные — в чип «+N».
 * Ширины берутся из невидимого ряда `measureRef` (все чипы + образец «+N»).
 */
function useChipOverflow({
  rowRef,
  measureRef,
  inputRef,
  count,
  inputCollapsed,
}: {
  rowRef: React.RefObject<HTMLDivElement | null>;
  measureRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  count: number;
  inputCollapsed: boolean;
}): number {
  const [visible, setVisible] = React.useState(count);

  const recompute = React.useCallback(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;
    const nodes = Array.from(measure.children) as HTMLElement[];
    const more = nodes.pop();
    const widths = nodes.map((n) => n.offsetWidth);
    const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
    const input = inputRef.current;
    const inputReserve =
      input && !inputCollapsed ? Number.parseFloat(getComputedStyle(input).minWidth) || 0 : 0;
    const available = row.clientWidth - inputReserve;
    const total = widths.reduce((sum, w, i) => sum + w + (i > 0 ? gap : 0), 0);
    let next = widths.length;
    if (total > available) {
      const moreW = (more?.offsetWidth ?? 0) + gap;
      let used = 0;
      next = 0;
      for (const w of widths) {
        const add = w + (next > 0 ? gap : 0);
        if (used + add + moreW > available) break;
        used += add;
        next += 1;
      }
      /* Хотя бы один чип: он сжимается с многоточием, «+N» не сжимается. */
      next = Math.max(1, next);
    }
    setVisible((prev) => (prev === next ? prev : next));
  }, [rowRef, measureRef, inputRef, inputCollapsed]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: пересчёт при смене набора чипов
  React.useLayoutEffect(() => {
    recompute();
  }, [recompute, count]);

  React.useEffect(() => {
    const row = rowRef.current;
    if (!row || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => recompute());
    ro.observe(row);
    return () => ro.disconnect();
  }, [rowRef, recompute]);

  return Math.min(visible, count);
}

export type TagSelectLabels = {
  /** Line above the list; `""` hides it. */
  panelHint: string;
  /** Action text before the preview of a new tag (`creatable`). */
  create: string;
  /** Accessible name of a chip's remove button; `{label}` is the tag text. */
  remove: string;
  /** Accessible name of the «+N» button; `{count}` is the number of hidden tags. */
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

/** Палитра цветов в меню тега (как в Notion): по одному варианту на каждый `PaletteColor`. */
const TAG_COLOR_ORDER: PaletteColor[] = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "sky",
  "teal",
];

function withLabel(template: string, label: string): string {
  return template.replace("{label}", label);
}

export type TagSelectOptionUpdate = { label?: string; color?: PaletteColor };

export type TagSelectRootProps = FieldFrameProps & {
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
  /** Chip color of values without an option color, including created ones. Default `gray`. */
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

function normalizeList(
  selected: string[],
  options: TagSelectOption[],
  defaultTagColor: PaletteColor,
): { value: string; label: string; color: PaletteColor }[] {
  return selected.map((v) => {
    const o = options.find((x) => x.value === v);
    return {
      value: v,
      label: o?.label ?? v,
      color: o?.color ?? defaultTagColor,
    };
  });
}

function filterOptions(options: TagSelectOption[], query: string): TagSelectOption[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return options;
  return options.filter((o) => {
    if (o.disabled) return false;
    return o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q);
  });
}

/**
 * Строки списка: совпадение по поиску, сначала выбранные (отмечены — снятие галочки убирает тег),
 * затем остальные. Выбранные в списке нужны: при многих тегах часть из них свёрнута в «+N», и
 * снять их можно и отсюда.
 */
function optionsForList(
  options: TagSelectOption[],
  query: string,
  selected: string[],
): TagSelectOption[] {
  const matched = filterOptions(options, query);
  return [
    ...matched.filter((o) => selected.includes(o.value)),
    ...matched.filter((o) => !selected.includes(o.value)),
  ];
}

function shouldShowCreate(
  creatable: boolean,
  inputTrim: string,
  selected: string[],
  options: TagSelectOption[],
): boolean {
  if (!creatable || inputTrim.length === 0) return false;
  if (selected.includes(inputTrim)) return false;
  const lower = inputTrim.toLowerCase();
  const exists = options.some(
    (o) =>
      o.value === inputTrim || o.label.toLowerCase() === lower || o.value.toLowerCase() === lower,
  );
  return !exists;
}

/**
 * Опции из `props.options` + созданные через creatable (полные строки справочника в состоянии,
 * без localStorage — до обновления страницы или пока родитель не подставит то же в `options`).
 */
function mergeOptionsWithCreated(
  options: TagSelectOption[],
  created: readonly TagSelectOption[],
): TagSelectOption[] {
  const existing = new Set(options.map((o) => o.value));
  const extra = created.filter((c) => !existing.has(c.value));
  return extra.length === 0 ? options : [...options, ...extra];
}

type TagOptionManagePopoverProps = {
  option: TagSelectOption;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultColor: PaletteColor;
  onUpdate?: (value: string, updates: TagSelectOptionUpdate) => void;
  onDelete?: (value: string) => void;
  labels: TagSelectLabels;
  disabled: boolean;
};

function TagOptionManagePopover({
  option,
  open,
  onOpenChange,
  defaultColor,
  onUpdate,
  onDelete,
  labels,
  disabled,
}: TagOptionManagePopoverProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const resolvedColor = option.color ?? defaultColor;
  const [draftLabel, setDraftLabel] = React.useState(option.label);

  React.useEffect(() => {
    if (open) {
      setDraftLabel(option.label);
    }
  }, [open, option.label]);

  React.useEffect(() => {
    if (!open || !onUpdate) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, onUpdate]);

  const commitLabel = () => {
    const next = draftLabel.trim();
    if (next.length > 0 && next !== option.label) {
      onUpdate?.(option.value, { label: next });
    }
    if (next.length === 0) {
      setDraftLabel(option.label);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <button
          type="button"
          className={styles.optionMenuTrigger}
          aria-label={withLabel(labels.edit, option.label)}
          disabled={disabled}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: декоративная иконка, имя — у кнопки */}
          <svg
            className={styles.optionMenuDots}
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden
          >
            <circle cx="4" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="12" cy="8" r="1.5" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="end" size="s" className={styles.managePopoverSurface}>
        <fieldset
          className={styles.managePopoverShell}
          onKeyDown={(e) => {
            /* Иначе клавиши всплывают к listbox (портал в body, но предок в React — ScrollContainer) и переключают выбор */
            e.stopPropagation();
          }}
        >
          {onUpdate ? (
            <div className={styles.manageField}>
              <Input.Root size="s">
                <Input.Wrapper>
                  <Input.Field
                    ref={inputRef}
                    value={draftLabel}
                    onValueChange={setDraftLabel}
                    onBlur={commitLabel}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        commitLabel();
                        onOpenChange(false);
                      }
                    }}
                    aria-label={labels.name}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          ) : null}
          {onDelete ? (
            <Button.Root
              variant="ghost"
              tone="danger"
              type="button"
              size="s"
              className={styles.manageDelete}
              onClick={() => {
                onDelete(option.value);
                onOpenChange(false);
              }}
            >
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: декоративная иконка у кнопки с текстом */}
              <svg className={styles.manageDeleteIcon} viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M4 4h8M6 4V3h4v1m2 0v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4h10zM6 7v4M10 7v4"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {labels.delete}
            </Button.Root>
          ) : null}
          {onUpdate ? (
            <>
              <hr className={styles.manageSeparator} />
              <span className={styles.manageColorsHeading}>{labels.colors}</span>
              <div className={styles.manageColorList}>
                {TAG_COLOR_ORDER.map((color) => {
                  const selected = resolvedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      aria-pressed={selected}
                      className={styles.manageColorRow}
                      onClick={() => {
                        onUpdate(option.value, { color });
                      }}
                    >
                      <span
                        className={styles.manageColorSwatch}
                        aria-hidden
                        {...toDataAttributes({ color })}
                      />
                      <span className={styles.manageColorLabel}>{labels.colorNames[color]}</span>
                      {selected ? (
                        <CheckIcon className={styles.manageCheck} />
                      ) : (
                        <span className={styles.manageCheckPlaceholder} aria-hidden />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}
        </fieldset>
      </Popover.Content>
    </Popover.Root>
  );
}

function TagSelectRoot({
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
}: TagSelectRootProps) {
  const labels = React.useMemo(
    () => ({
      ...TAG_SELECT_LABELS,
      ...labelsProp,
      colorNames: { ...TAG_SELECT_LABELS.colorNames, ...labelsProp?.colorNames },
    }),
    [labelsProp],
  );
  const ids = useFieldFrame(idProp, { hint, error, invalid: invalidProp });
  const invalid = ids.invalid;
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
  /** Фокус внутри поля (ввод или чип): поле раскрывается и показывает все теги. */
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  /** Куда перевести фокус после удаления чипа с клавиатуры: индекс чипа или -1 — ввод. */
  const pendingChipFocus = React.useRef<number | null>(null);
  const [highlightedValue, setHighlightedValue] = React.useState<string | undefined>(undefined);
  const [manageOpenValue, setManageOpenValue] = React.useState<string | null>(null);
  /** Созданные через creatable (как обычные опции: label, color, редактирование в меню ⋯) */
  const [createdOptions, setCreatedOptions] = React.useState<TagSelectOption[]>([]);

  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const chipsRef = React.useRef<HTMLDivElement | null>(null);
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listboxRef = React.useRef<HTMLDivElement | null>(null);

  const overlayPortalLayer = useOverlayPortalLayer();

  const { resolvedSide, update } = usePosition(triggerRef, listboxRef, {
    side: "bottom",
    align: "start",
  });

  const updateRef = React.useRef(update);
  updateRef.current = update;

  const inputTrim = inputValue.trim();
  const mergedOptions = React.useMemo(
    () => mergeOptionsWithCreated(options, createdOptions),
    [options, createdOptions],
  );

  /** Когда родитель добавил тот же `value` в `options`, убираем дубликат из локального списка. */
  React.useEffect(() => {
    setCreatedOptions((prev) => {
      const next = prev.filter((c) => !options.some((o) => o.value === c.value));
      return next.length === prev.length ? prev : next;
    });
  }, [options]);
  const filteredForPick = React.useMemo(
    () => optionsForList(mergedOptions, inputValue, selected),
    [mergedOptions, inputValue, selected],
  );
  const showCreate = shouldShowCreate(creatable, inputTrim, selected, mergedOptions);

  const manageable = Boolean(onOptionUpdate || onOptionDelete);
  const handleOptionUpdate = React.useMemo(() => {
    if (!onOptionUpdate) return undefined;
    return (value: string, updates: TagSelectOptionUpdate) => {
      if (!options.some((o) => o.value === value)) {
        setCreatedOptions((prev) =>
          prev.map((o) => (o.value === value ? { ...o, ...updates } : o)),
        );
      }
      onOptionUpdate(value, updates);
    };
  }, [onOptionUpdate, options]);
  const handleOptionDelete = React.useMemo(() => {
    if (!onOptionDelete) return undefined;
    return (value: string) => {
      setSelected((prev) => prev.filter((x) => x !== value));
      setCreatedOptions((prev) => prev.filter((o) => o.value !== value));
      onOptionDelete(value);
    };
  }, [onOptionDelete, setSelected]);

  /** Панель только если есть опции в списке или строка создания (после ввода). */
  const hasPanelContent = filteredForPick.length > 0 || showCreate;

  const flatOptionValues = React.useMemo(() => {
    const v: string[] = [];
    if (showCreate) v.push(CREATE_VALUE);
    for (const o of filteredForPick) {
      if (!o.disabled) v.push(o.value);
    }
    return v;
  }, [filteredForPick, showCreate]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updateRef.current();
    const raf = requestAnimationFrame(() => updateRef.current());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

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

    const panel = listboxRef.current;
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && panel) {
      ro = new ResizeObserver(schedule);
      ro.observe(panel);
      /* Поле раскрывается / сворачивается — панель едет за ним. */
      if (triggerRef.current) ro.observe(triggerRef.current);
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
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setHighlightedValue(undefined);
      return;
    }
    if (flatOptionValues.length === 0) {
      setHighlightedValue(undefined);
      return;
    }
    setHighlightedValue((prev) =>
      prev && flatOptionValues.includes(prev) ? prev : flatOptionValues[0],
    );
  }, [open, flatOptionValues]);

  React.useEffect(() => {
    if (!open) return;
    if (!hasPanelContent) setOpen(false);
  }, [open, hasPanelContent, setOpen]);

  React.useEffect(() => {
    if (!open) setManageOpenValue(null);
  }, [open]);

  useEscapeKey({ enabled: open && manageOpenValue === null, onEscape: () => setOpen(false) });
  // The manage Popover opened from a row is its own (topmost) layer, so clicks inside it never
  // reach this panel's outside-click handler.
  useOutsideClick({
    refs: [triggerRef, listboxRef],
    enabled: open,
    onOutsideClick: () => setOpen(false),
  });
  const presence = usePresence(open, { exitDuration: "fast" });

  const toggleValue = React.useCallback(
    (value: string) => {
      setSelected((prev) => {
        if (prev.includes(value)) {
          return prev.filter((x) => x !== value);
        }
        return [...prev, value];
      });
    },
    [setSelected],
  );

  const handleSelectFromList = React.useCallback(
    (rawValue: string) => {
      if (rawValue === CREATE_VALUE) {
        const v = inputTrim;
        if (v.length === 0) return;
        setSelected((prev) => {
          if (prev.includes(v)) return prev;
          onCreate?.(v);
          return [...prev, v];
        });
        setCreatedOptions((prev) => {
          if (prev.some((o) => o.value === v) || options.some((o) => o.value === v)) {
            return prev;
          }
          return [...prev, { value: v, label: v, color: defaultColor }];
        });
        setInputValue("");
        return;
      }
      toggleValue(rawValue);
      setInputValue("");
    },
    [defaultColor, inputTrim, onCreate, options, setSelected, toggleValue],
  );

  const getItems = React.useCallback(() => queryEnabledSelectOptions(listboxRef.current), []);

  const removeValue = React.useCallback(
    (value: string, labelText: string) => {
      setSelected((prev) => prev.filter((x) => x !== value));
      setAnnouncement(withLabel(labels.removed, labelText));
    },
    [labels.removed, setSelected],
  );

  const chipElements = () =>
    Array.from(chipsRef.current?.querySelectorAll<HTMLElement>("[data-chip-value]") ?? []);

  /* После удаления с клавиатуры — фокус на соседний чип или в ввод. */
  React.useLayoutEffect(() => {
    const target = pendingChipFocus.current;
    if (target === null) return;
    pendingChipFocus.current = null;
    const chipsNow = chipElements();
    const chip = target >= 0 ? (chipsNow[target] ?? chipsNow[chipsNow.length - 1]) : undefined;
    (chip ?? inputRef.current)?.focus();
  });

  const onListboxKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleSelectListboxKeyDown(e, {
      items: getItems(),
      highlightedValue,
      setHighlightedValue,
      onSelect: (v) => {
        handleSelectFromList(v);
      },
      onClose: () => setOpen(false),
    });
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace" && inputValue.length === 0 && selected.length > 0) {
      e.preventDefault();
      const last = chips[chips.length - 1];
      if (last) removeValue(last.value, last.label);
      return;
    }

    /* Стрелка влево с начала ввода — к последнему тегу. */
    const input = e.currentTarget;
    if (
      e.key === "ArrowLeft" &&
      input.selectionStart === 0 &&
      input.selectionEnd === 0 &&
      selected.length > 0
    ) {
      e.preventDefault();
      chipElements().at(-1)?.focus();
      return;
    }

    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (filteredForPick.length > 0 || showCreate) {
            setOpen(true);
          }
        }
        return;
      }
      if (flatOptionValues.length === 0) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const hv = highlightedValue ?? flatOptionValues[0];
        if (hv === CREATE_VALUE) {
          handleSelectFromList(CREATE_VALUE);
        } else if (hv) {
          const o = mergedOptions.find((x) => x.value === hv);
          if (o && !o.disabled) {
            handleSelectFromList(o.value);
          }
        }
        return;
      }

      handleSelectListboxKeyDown(e as unknown as React.KeyboardEvent<HTMLDivElement>, {
        items: getItems(),
        highlightedValue,
        setHighlightedValue,
        onSelect: (v) => handleSelectFromList(v),
        onClose: () => setOpen(false),
      });
    }
  };

  const chips = normalizeList(selected, mergedOptions, defaultColor);
  /** Раскрыто (фокус внутри или открыт список): все теги в несколько строк, без «+N». */
  const expanded = !disabled && (focusWithin || open);
  /** Сворачивать инпут только если уже есть теги и фильтр пуст (пустое поле без тегов — инпут с плейсхолдером на всю ширину). */
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

  /* Раскрылось — ввод виден (он последний в прокручиваемом ряду). */
  React.useEffect(() => {
    if (!expanded) return;
    const row = chipsRef.current;
    if (row) row.scrollTop = row.scrollHeight;
  }, [expanded]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleControlBlur = React.useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const inside = (node: unknown) =>
      node instanceof Node &&
      (triggerRef.current?.contains(node) || listboxRef.current?.contains(node));
    if (inside(e.relatedTarget)) return;
    window.requestAnimationFrame(() => {
      if (inside(document.activeElement)) return;
      setFocusWithin(false);
      setInputValue("");
    });
  }, []);

  const onChipKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (e.target !== e.currentTarget) return;
    const all = chipElements();
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      all[Math.max(0, index - 1)]?.focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      (all[index + 1] ?? inputRef.current)?.focus();
    } else if ((e.key === "Delete" || e.key === "Backspace") && !disabled) {
      e.preventDefault();
      const chip = chips[index];
      if (!chip) return;
      /* Backspace — к предыдущему тегу, Delete — к следующему; без тегов — в ввод. */
      const nextIndex = e.key === "Backspace" ? index - 1 : index;
      pendingChipFocus.current = chips.length > 1 ? Math.max(0, nextIndex) : -1;
      removeValue(chip.value, chip.label);
    }
  };

  const renderChip = (
    c: { value: string; label: string; color: PaletteColor },
    measure = false,
    index = 0,
  ) => (
    <Badge.Root
      key={c.value}
      color={c.color}
      disabled={disabled}
      className={styles.chip}
      labels={{ remove: withLabel(labels.remove, c.label) }}
      /* Фокус по стрелкам из ввода (не таб-остановка); Delete / Backspace удаляют. */
      tabIndex={measure || disabled ? undefined : -1}
      data-chip-value={measure ? undefined : c.value}
      onKeyDown={measure ? undefined : (e) => onChipKeyDown(e, index)}
      onRemove={() => {
        if (!measure) removeValue(c.value, c.label);
      }}
      /* Удаление не уводит фокус из поля и не открывает список. */
      onMouseDown={(e) => {
        if ((e.target as Element).closest("button")) e.preventDefault();
      }}
      onClick={(e) => {
        if ((e.target as Element).closest("button")) e.stopPropagation();
      }}
    >
      <span className={styles.chipLabel}>{c.label}</span>
    </Badge.Root>
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
      <ControlSizeProvider value={size}>
        {/* Составной контрол: единственная таб-остановка — input[role=combobox]; клик по полю ведёт к фокусу ввода. */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: мультивыбор с внутренним combobox */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: клавиатура обрабатывается на input и listbox */}
        <div
          ref={triggerRef}
          className={styles.control}
          onClick={(e) => {
            if (disabled) return;
            /* Клик по чипу ставит фокус на чип (для клавиатуры), по остальному полю — в ввод. */
            if (!(e.target as Element).closest("[data-chip-value]")) focusInput();
            if (hasPanelContent) setOpen(true);
          }}
          onFocus={() => setFocusWithin(true)}
          onBlur={handleControlBlur}
          {...toDataAttributes({
            size,
            expanded: expanded || undefined,
            state: open ? "open" : "closed",
            disabled: disabled || undefined,
            invalid: invalid || undefined,
            "focus-ring": focusRing ? undefined : false,
          })}
        >
          <div ref={chipsRef} className={styles.chips}>
            {visibleChips.map((c, index) => renderChip(c, false, index))}
            {hiddenChips.length > 0 ? (
              /* Настоящая кнопка: клик всплывает к полю — оно раскрывается и открывает список. */
              <button
                type="button"
                className={styles.moreButton}
                disabled={disabled}
                aria-label={labels.more.replace("{count}", String(hiddenChips.length))}
                title={hiddenChips.map((c) => c.label).join(", ")}
              >
                <Badge.Root disabled={disabled} className={styles.chipMore} aria-hidden>
                  +{hiddenChips.length}
                </Badge.Root>
              </button>
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
              aria-invalid={invalid || undefined}
              aria-required={required || undefined}
              aria-describedby={ids.describedBy}
              aria-activedescendant={
                open && highlightedValue ? tagOptionDomId(listboxId, highlightedValue) : undefined
              }
              disabled={disabled}
              placeholder={selected.length === 0 ? placeholder : undefined}
              className={cx(styles.input, inputCollapsed && styles.inputCollapsed)}
              value={inputValue}
              onChange={(e) => {
                const next = e.target.value;
                setInputValue(next);
                const nextTrim = next.trim();
                const nextMerged = mergeOptionsWithCreated(options, createdOptions);
                const nextPick = optionsForList(nextMerged, next, selected);
                const nextShowCreate = shouldShowCreate(creatable, nextTrim, selected, nextMerged);
                if (nextPick.length > 0 || nextShowCreate) {
                  setOpen(true);
                } else {
                  setOpen(false);
                }
              }}
              onKeyDown={onInputKeyDown}
              onFocus={() => {
                if (!disabled && hasPanelContent) setOpen(true);
              }}
            />
          </div>
          <span className={styles.srOnly} role="status" aria-live="polite">
            {announcement}
          </span>

          {/* Невидимый ряд всех чипов — ширины для расчёта «+N». */}
          <div ref={measureRef} className={styles.measure} aria-hidden inert>
            {chips.map((c) => renderChip(c, true))}
            <Badge.Root className={styles.chipMore}>+{Math.max(chips.length, 9)}</Badge.Root>
          </div>

          <span className={styles.chevronSlot} aria-hidden>
            <ChevronIcon />
          </span>
        </div>

        <Portal>
          <DropdownLayerContext.Provider value>
            <ScrollContainer
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-hidden={!open}
              tabIndex={-1}
              data-react-aria-top-layer="true"
              data-overlay-portal-layer={overlayPortalLayer}
              className={cx(styles.panel, overlayMotion.floating)}
              onKeyDown={onListboxKeyDown}
              onAnimationEnd={presence.onExitEnd}
              style={{ display: presence.mounted ? undefined : "none" }}
              {...toDataAttributes({ side: resolvedSide, size, state: presence.state })}
            >
              {labels.panelHint ? <div className={styles.hint}>{labels.panelHint}</div> : null}

              {showCreate ? (
                <button
                  key={CREATE_VALUE}
                  id={tagOptionDomId(listboxId, CREATE_VALUE)}
                  type="button"
                  role="option"
                  aria-selected={false}
                  tabIndex={-1}
                  className={styles.option}
                  {...toDataAttributes({
                    value: CREATE_VALUE,
                    label: inputTrim,
                    highlighted: highlightedValue === CREATE_VALUE,
                    disabled: false,
                  })}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onMouseMove={() => setHighlightedValue(CREATE_VALUE)}
                  onClick={() => handleSelectFromList(CREATE_VALUE)}
                >
                  <span className={styles.optionLead} aria-hidden>
                    <PlusIcon />
                  </span>
                  <span className={styles.createLabel}>{labels.create}</span>
                  <Badge.Root color={defaultColor} className={styles.chip}>
                    <span className={styles.chipLabel}>{inputTrim}</span>
                  </Badge.Root>
                </button>
              ) : null}

              {filteredForPick.map((o) => {
                const chip = (
                  <Badge.Root
                    color={o.color ?? defaultColor}
                    disabled={o.disabled}
                    className={styles.chip}
                  >
                    <span className={styles.chipLabel}>{o.label}</span>
                  </Badge.Root>
                );
                const isSelected = selected.includes(o.value);
                const checkbox = (
                  <span className={styles.optionCheckbox} aria-hidden>
                    {isSelected ? <CheckIcon /> : null}
                  </span>
                );
                const rowData = toDataAttributes({
                  value: o.value,
                  label: o.label,
                  highlighted: highlightedValue === o.value,
                  selected: isSelected,
                  disabled: Boolean(o.disabled),
                });
                if (manageable) {
                  return (
                    <div
                      key={o.value}
                      id={tagOptionDomId(listboxId, o.value)}
                      role="option"
                      tabIndex={-1}
                      aria-selected={isSelected}
                      aria-disabled={o.disabled || undefined}
                      className={cx(styles.option, styles.optionManaged)}
                      {...rowData}
                      onMouseMove={() => !o.disabled && setHighlightedValue(o.value)}
                    >
                      <button
                        type="button"
                        tabIndex={-1}
                        className={styles.optionSelect}
                        disabled={o.disabled}
                        onMouseDown={(e) => {
                          if (!o.disabled) e.preventDefault();
                        }}
                        onClick={() => !o.disabled && handleSelectFromList(o.value)}
                      >
                        {checkbox}
                        {chip}
                      </button>
                      {!o.disabled ? (
                        <TagOptionManagePopover
                          option={o}
                          open={manageOpenValue === o.value}
                          onOpenChange={(next) => setManageOpenValue(next ? o.value : null)}
                          defaultColor={defaultColor}
                          onUpdate={handleOptionUpdate}
                          onDelete={handleOptionDelete}
                          labels={labels}
                          disabled={disabled}
                        />
                      ) : null}
                    </div>
                  );
                }
                return (
                  <button
                    key={o.value}
                    id={tagOptionDomId(listboxId, o.value)}
                    type="button"
                    role="option"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    disabled={o.disabled}
                    className={styles.option}
                    {...rowData}
                    onMouseDown={(e) => {
                      if (!o.disabled) e.preventDefault();
                    }}
                    onMouseMove={() => !o.disabled && setHighlightedValue(o.value)}
                    onClick={() => !o.disabled && handleSelectFromList(o.value)}
                  >
                    {checkbox}
                    {chip}
                  </button>
                );
              })}
            </ScrollContainer>
          </DropdownLayerContext.Provider>
        </Portal>
      </ControlSizeProvider>
    </FieldFrame>
  );
}

TagSelectRoot.displayName = "TagSelect.Root";

export const TagSelect = {
  Root: TagSelectRoot,
};

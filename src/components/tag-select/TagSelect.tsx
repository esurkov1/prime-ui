import * as React from "react";
import { Badge, type BadgeColor } from "@/components/badge/Badge";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Typography } from "@/components/typography/Typography";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { usePosition } from "@/hooks/usePosition";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import { Portal } from "@/internal/Portal";
import { getScrollContainers } from "@/internal/scrollAncestors";
import type { SelectSize } from "@/internal/states";
import selectStyles from "../select/Select.module.css";
import { handleSelectListboxKeyDown, queryEnabledSelectOptions } from "../select/selectListbox";
import styles from "./TagSelect.module.css";

export type TagSelectOption = {
  value: string;
  label: string;
  color?: BadgeColor;
  disabled?: boolean;
};

const CREATE_VALUE = "__prime_tag_select_create__";

export type TagSelectRootProps = {
  /** Доступные теги (значение + подпись + цвет Badge `filled`). */
  options: TagSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (next: string[]) => void;
  /** Разрешить ввод нового значения, если его нет в списке. */
  creatable?: boolean;
  /** Только для creatable: значение добавлено через Create / Enter, не выбрано из `options` (сохранение в БД и т.п.). */
  onCreated?: (value: string) => void;
  /** Цвет чипа для созданных вручную значений (если нет в `options`). */
  defaultTagColor?: BadgeColor;
  /** Текст над списком. */
  hint?: React.ReactNode;
  /** Подпись действия создания (перед превью тега). */
  createActionLabel?: string;
  disabled?: boolean;
  placeholder?: string;
  hasError?: boolean;
  /** Как у `Select`: одна ось для поля (`data-size` на контроле) и панели списка; `Badge` без своего `size` берёт размер из этого контекста. */
  size?: SelectSize;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function normalizeList(
  selected: string[],
  options: TagSelectOption[],
  defaultTagColor: BadgeColor,
): { value: string; label: string; color: BadgeColor }[] {
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

/** Опции для выпадающего списка: без уже выбранных значений. */
function optionsForList(
  options: TagSelectOption[],
  query: string,
  selected: string[],
): TagSelectOption[] {
  return filterOptions(options, query).filter((o) => !selected.includes(o.value));
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

export function TagSelectRoot({
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  creatable = false,
  onCreated,
  defaultTagColor = "gray",
  hint = "Select an option or create one",
  createActionLabel = "Create",
  disabled = false,
  placeholder = "",
  hasError = false,
  size = "m",
  id: idProp,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: TagSelectRootProps) {
  const generatedId = React.useId();
  const rootId = idProp ?? generatedId;
  const listboxId = `${rootId}-listbox`;
  const inputId = `${rootId}-input`;

  const [selected, setSelected] = useControllableState<string[]>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const [inputValue, setInputValue] = React.useState("");
  const [inputFocused, setInputFocused] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [highlightedValue, setHighlightedValue] = React.useState<string | undefined>(undefined);

  const triggerRef = React.useRef<HTMLDivElement | null>(null);
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
  const filtered = React.useMemo(
    () => optionsForList(options, inputValue, selected),
    [options, inputValue, selected],
  );
  const showCreate = shouldShowCreate(creatable, inputTrim, selected, options);

  /** Панель только если есть опции в списке или строка создания (после ввода). */
  const hasPanelContent = filtered.length > 0 || showCreate;

  const flatOptionValues = React.useMemo(() => {
    const v: string[] = [];
    if (showCreate) v.push(CREATE_VALUE);
    for (const o of filtered) {
      if (!o.disabled) v.push(o.value);
    }
    return v;
  }, [filtered, showCreate]);

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
  }, [open, hasPanelContent]);

  useEscapeKey({ enabled: open, onEscape: () => setOpen(false) });
  useOutsideClick({
    refs: [triggerRef, listboxRef],
    enabled: open,
    onOutsideClick: () => setOpen(false),
  });

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
          onCreated?.(v);
          return [...prev, v];
        });
        setInputValue("");
        return;
      }
      toggleValue(rawValue);
      setInputValue("");
    },
    [inputTrim, onCreated, setSelected, toggleValue],
  );

  const getItems = React.useCallback(() => queryEnabledSelectOptions(listboxRef.current), []);

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
      setSelected((prev) => prev.slice(0, -1));
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
          if (filtered.length > 0 || showCreate) setOpen(true);
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
          const o = options.find((x) => x.value === hv);
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

  const chips = normalizeList(selected, options, defaultTagColor);
  /** Пустое поле (нет тегов и нет текста ввода) — нужна минимальная высота как у инпута; иначе высота по контенту, без «второй строки». */
  const isEmpty = selected.length === 0 && inputTrim.length === 0;
  /** Сворачивать инпут только если уже есть теги и фильтр пуст (пустое поле без тегов — инпут с плейсхолдером на всю ширину). */
  const inputCollapsed = !inputFocused && inputTrim.length === 0 && selected.length > 0;

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleInputBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget;
    if (next instanceof Node && triggerRef.current?.contains(next)) {
      return;
    }
    window.requestAnimationFrame(() => {
      if (triggerRef.current?.contains(document.activeElement)) {
        return;
      }
      setInputFocused(false);
      setInputValue("");
    });
  }, []);

  return (
    <ControlSizeProvider value={size}>
      {/* Составной контрол: единственная таб-остановка — input[role=combobox]; клик по полю ведёт к фокусу ввода. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: мультивыбор с внутренним combobox */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: клавиатура обрабатывается на input и listbox */}
      <div
        ref={triggerRef}
        className={cx(styles.control, className)}
        onClick={() => {
          if (!disabled) {
            focusInput();
            if (hasPanelContent) setOpen(true);
          }
        }}
        {...toDataAttributes({
          size,
          open,
          empty: isEmpty ? true : undefined,
          disabled: disabled ? true : undefined,
          "has-error": hasError ? true : undefined,
        })}
      >
        <div className={styles.chips}>
          {chips.map((c) => (
            <span key={c.value} className={styles.chip}>
              <Badge.Root color={c.color} variant="filled" className={styles.chipBadge}>
                <span className={styles.chipLabel}>{c.label}</span>
                <button
                  type="button"
                  className={styles.chipRemove}
                  aria-label={`Remove ${c.label}`}
                  disabled={disabled}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected((prev) => prev.filter((x) => x !== c.value));
                  }}
                >
                  <svg
                    className={styles.removeIcon}
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 2l8 8M10 2l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </Badge.Root>
            </span>
          ))}
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
            disabled={disabled}
            placeholder={selected.length === 0 ? placeholder : undefined}
            className={cx(styles.input, inputCollapsed && styles.inputCollapsed)}
            value={inputValue}
            onChange={(e) => {
              const next = e.target.value;
              setInputValue(next);
              const nextTrim = next.trim();
              const nextFiltered = optionsForList(options, next, selected);
              const nextShowCreate = shouldShowCreate(creatable, nextTrim, selected, options);
              if (nextFiltered.length > 0 || nextShowCreate) {
                setOpen(true);
              } else {
                setOpen(false);
              }
            }}
            onKeyDown={onInputKeyDown}
            onFocus={() => {
              setInputFocused(true);
              if (!disabled && hasPanelContent) setOpen(true);
            }}
            onBlur={handleInputBlur}
          />
        </div>

        <span className={styles.chevronSlot} aria-hidden>
          <span className={styles.chevron} />
        </span>
      </div>

      <Portal>
        <ScrollContainer
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-hidden={!open}
          tabIndex={-1}
          data-react-aria-top-layer="true"
          data-overlay-portal-layer={overlayPortalLayer}
          className={cx(selectStyles.content, styles.panelInner)}
          onKeyDown={onListboxKeyDown}
          style={{ display: open ? undefined : "none" }}
          {...toDataAttributes({ side: resolvedSide, size })}
        >
          {hint ? (
            <div className={styles.hint}>
              <Typography.Root as="div" variant="body-small" tone="muted">
                {hint}
              </Typography.Root>
            </div>
          ) : null}

          {showCreate ? (
            <button
              key={CREATE_VALUE}
              type="button"
              role="option"
              aria-selected={false}
              className={styles.createRow}
              {...toDataAttributes({
                value: CREATE_VALUE,
                label: inputTrim,
                highlighted: highlightedValue === CREATE_VALUE,
                disabled: false,
              })}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onMouseEnter={() => setHighlightedValue(CREATE_VALUE)}
              onClick={() => handleSelectFromList(CREATE_VALUE)}
            >
              <Typography.Root
                as="span"
                variant="body-small"
                tone="muted"
                className={styles.createLabel}
              >
                {createActionLabel}
              </Typography.Root>
              <Badge.Root color={defaultTagColor} variant="filled">
                {inputTrim}
              </Badge.Root>
            </button>
          ) : null}

          {filtered.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={false}
              disabled={o.disabled}
              className={styles.optionRow}
              {...toDataAttributes({
                value: o.value,
                label: o.label,
                highlighted: highlightedValue === o.value,
                selected: false,
                disabled: Boolean(o.disabled),
              })}
              onMouseDown={(e) => {
                if (!o.disabled) e.preventDefault();
              }}
              onMouseEnter={() => !o.disabled && setHighlightedValue(o.value)}
              onClick={() => !o.disabled && handleSelectFromList(o.value)}
            >
              <Badge.Root color={o.color ?? defaultTagColor} variant="filled">
                {o.label}
              </Badge.Root>
            </button>
          ))}
        </ScrollContainer>
      </Portal>
    </ControlSizeProvider>
  );
}

TagSelectRoot.displayName = "TagSelectRoot";

export const TagSelect = {
  Root: TagSelectRoot,
};

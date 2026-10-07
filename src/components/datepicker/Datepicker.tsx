import { addMonths, format, type Locale, startOfMonth, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Popover } from "@/components/popover/Popover";
import { useControllableState } from "@/hooks/useControllableState";
import { getViewportPadPx, type PositionAlign } from "@/hooks/usePosition";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
import { remToPx } from "@/internal/layoutPxFromPrimitives";
import type { ControlSize, PaletteColor } from "@/internal/states";
import { primitiveTokens } from "../../../tokens/primitives";

import styles from "./Datepicker.module.css";
import {
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  type DatepickerPreset,
  type DatepickerRange,
  formatDayShort,
  formatTime,
  matchPreset,
  minutesOf,
  monthGrid,
  monthTitle,
  parseTime,
  rowsNeeded,
  sameDay,
  toDay,
  type WeekStart,
  weekdayLabels,
  withMinutes,
  YEARLESS_YEAR,
} from "./datepickerModel";

export type {
  DatepickerPreset,
  DatepickerRange,
  WeekStart,
} from "./datepickerModel";
export {
  DEFAULT_DATEPICKER_PRESETS,
  datepickerPresets,
  YEARLESS_YEAR,
} from "./datepickerModel";

/** Клетка дня = `--prime-control-<tier>-item-height` (шаги сетки 4px). */
const CELL_STEPS = { xs: 6, s: 7, m: 8, l: 9, xl: 10 } as const satisfies Record<
  ControlSize,
  keyof typeof primitiveTokens.space
>;

/** Кнопки и поля нижней строки — на ступень ниже яруса панели. */
const STEP_DOWN: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "s",
  l: "m",
  xl: "l",
};

/** Раскладка: px из токенов (`space.*`), чтобы JS-решения совпадали с CSS. */
function panelMetrics(size: ControlSize, embedded: boolean) {
  const space = (n: keyof typeof primitiveTokens.space) => remToPx(primitiveTokens.space[n]);
  const cell = space(CELL_STEPS[size]);
  return {
    month: cell * 7,
    /** Зазор между месяцами (`--prime-space-6`). */
    monthsGap: space(6),
    /**
     * Поля `.main` слева и справа: в поповере `--prime-space-3` × 2, во встроенной панели —
     * поля карточки `--prime-card-padding-s` (= `space-4`) × 2.
     */
    chrome: (embedded ? space(4) : space(3)) * 2,
    /** Колонка периодов сбоку: 5 клеток + hairline. */
    presets: cell * 5 + 1,
  };
}

export type PanelLayoutInput = {
  size: ControlSize;
  /** Requested months (`months` prop). */
  months: 1 | 2;
  hasPresets: boolean;
  /** Embedded panel (`Datepicker.Panel`), not the popover of `Datepicker.Root`. */
  embedded: boolean;
  /** Available inline size in px; `null` — not measured yet (assume it fits). */
  available: number | null;
};

export type PanelLayout = { monthCount: 1 | 2; presetsAside: boolean; compact: boolean };

/**
 * 1 vs 2 months, presets aside vs stacked, compact cells — from the space AVAILABLE to the panel
 * (the parent's content box for an embedded panel, the viewport for the popover). The panel's own
 * width never feeds back into the decision, so there is no resize loop.
 */
export function resolvePanelLayout({
  size,
  months,
  hasPresets,
  embedded,
  available,
}: PanelLayoutInput): PanelLayout {
  const metrics = panelMetrics(size, embedded);
  const monthsWidth = (n: 1 | 2) => metrics.month * n + (n === 2 ? metrics.monthsGap : 0);
  const fits = (px: number) => available == null || available >= px;
  const monthCount: 1 | 2 = months === 2 && fits(monthsWidth(2) + metrics.chrome) ? 2 : 1;
  const presetsAside =
    hasPresets && fits(monthsWidth(monthCount) + metrics.chrome + metrics.presets);
  /* Встроенная панель уже одного месяца с полями — клетки сжимаются, поля меньше. */
  const compact = embedded && available != null && available < monthsWidth(1) + metrics.chrome;
  return { monthCount, presetsAside, compact };
}

/** Built-in strings; Russian by default. */
export type DatepickerLabels = {
  pickStart: string;
  pickEnd: string;
  pickDate: string;
  reset: string;
  apply: string;
  prevMonth: string;
  nextMonth: string;
  rangeStart: string;
  rangeEnd: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  time: string;
  /** Префикс диапазона без начала: «до 6 окт». */
  until: string;
  /** Подзаголовок колонки периодов. */
  presetsTitle: string;
  /** Muted marker after the field label when `optional`. */
  optional: string;
};

const DATEPICKER_LABELS: DatepickerLabels = {
  pickStart: "Выберите начальную дату",
  pickEnd: "Выберите конечную дату",
  pickDate: "Выберите дату",
  reset: "Сбросить",
  apply: "Применить",
  prevMonth: "Предыдущий месяц",
  nextMonth: "Следующий месяц",
  rangeStart: "Начало периода",
  rangeEnd: "Конец периода",
  date: "Дата",
  timeStart: "Время начала",
  timeEnd: "Время конца",
  time: "Время",
  until: "до",
  presetsTitle: "Период",
  optional: "необязательно",
};

type CalendarOptions = {
  /** Ярус: клетка дня = высота пункта меню яруса (`m` → 32px), текст — текст яруса. */
  size?: ControlSize;
  /** Сколько месяцев рядом; если места мало — один. */
  months?: 1 | 2;
  /** Колонка периодов слева (только `range`). */
  presets?: DatepickerPreset[] | false;
  /** Step prompt under the calendar: «Выберите начальную дату» / «… конечную дату». */
  prompt?: boolean;
  /** Нижняя строка: поля дат и кнопки «Сбросить» / «Применить». Без неё выбор применяется сразу. */
  footer?: boolean;
  /** Поля времени в нижней строке (по умолчанию 00:00 — 23:59). */
  withTime?: boolean;
  /** Недоступные дни (календарный день — Date на локальную полночь). */
  isDayDisabled?: (day: Date) => boolean;
  /** Будущие дни приглушены и недоступны. */
  disableFuture?: boolean;
  /** Ежегодная дата «день + месяц»: без года, листание по кругу в пределах YEARLESS_YEAR. */
  yearless?: boolean;
  /** «Сегодня» для подсветки, пресетов и disableFuture; по умолчанию — текущий день браузера. */
  today?: Date;
  locale?: Locale;
  weekStartsOn?: WeekStart;
  labels?: Partial<DatepickerLabels>;
};

type RangeModeProps = {
  mode: "range";
  /** Bounds in wall-clock time; `null` — the bound is not set. */
  value?: DatepickerRange;
  defaultValue?: DatepickerRange;
  onValueChange?: (value: DatepickerRange) => void;
  /** Value applied by «Сбросить»; an empty range by default. */
  resetValue?: DatepickerRange;
};

type SingleModeProps = {
  mode: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  /** Value applied by «Сбросить»; `null` by default. */
  resetValue?: Date | null;
};

export type DatepickerPanelProps = CalendarOptions &
  (RangeModeProps | SingleModeProps) & {
    className?: string;
  };

/** Resolved (controlled-or-internal) value the panel view works with. */
type ResolvedValue =
  | {
      mode: "range";
      value: DatepickerRange;
      onChange: (value: DatepickerRange) => void;
      resetValue?: DatepickerRange;
    }
  | {
      mode: "single";
      value: Date | null;
      onChange: (value: Date | null) => void;
      resetValue?: Date | null;
    };

type PanelViewProps = CalendarOptions &
  ResolvedValue & {
    /** After a value is applied (Root closes the popover). */
    onDone?: () => void;
    className?: string;
  };

const EMPTY_RANGE: DatepickerRange = { from: null, to: null };

function useResolvedValue(props: RangeModeProps | SingleModeProps): ResolvedValue {
  const [value, setValue] = useControllableState<DatepickerRange | Date | null>({
    value: props.value,
    defaultValue: props.defaultValue ?? (props.mode === "range" ? EMPTY_RANGE : null),
    onChange: props.onValueChange as ((value: DatepickerRange | Date | null) => void) | undefined,
  });
  if (props.mode === "range") {
    return {
      mode: "range",
      value: value as DatepickerRange,
      onChange: setValue,
      resetValue: props.resetValue,
    };
  }
  return {
    mode: "single",
    value: value as Date | null,
    onChange: setValue,
    resetValue: props.resetValue,
  };
}

/** Ширина окна (px) — для панели в поповере, которая не может мерить себя. */
function useViewportWidth(enabled: boolean): number | null {
  const [width, setWidth] = React.useState<number | null>(() =>
    typeof window === "undefined" ? null : window.innerWidth,
  );
  React.useEffect(() => {
    if (!enabled) return;
    const sync = () => setWidth(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [enabled]);
  return enabled ? width : null;
}

function valueDays(props: ResolvedValue): { a: Date | null; b: Date | null } {
  if (props.mode === "single") return { a: props.value ? toDay(props.value) : null, b: null };
  return {
    a: props.value.from ? toDay(props.value.from) : null,
    b: props.value.to ? toDay(props.value.to) : null,
  };
}

function clampYearless(month: Date): Date {
  return new Date(YEARLESS_YEAR, month.getMonth(), 1);
}

/** Панель внутри поповера Root: размер по содержимому; иначе — резиновая по контейнеру. */
const InPopoverContext = React.createContext(false);

/**
 * Доступная ширина встроенной панели: content box её РОДИТЕЛЯ (ResizeObserver), не собственная
 * ширина панели (она по содержимому) — иначе решение «1 или 2 месяца» зациклилось бы. null — ещё
 * не измерена.
 */
export function useAvailableWidth(node: HTMLElement | null): number | null {
  const [width, setWidth] = React.useState<number | null>(null);
  React.useEffect(() => {
    const parent = node?.parentElement;
    if (!parent || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(parent);
    return () => observer.disconnect();
  }, [node]);
  return width;
}

/** Может ли элемент сам прокрутиться в направлении колеса. */
function canScroll(el: HTMLElement, deltaY: number): boolean {
  const { overflowY } = getComputedStyle(el);
  if (overflowY !== "auto" && overflowY !== "scroll") return false;
  if (el.scrollHeight <= el.clientHeight) return false;
  return deltaY < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight;
}

/**
 * Колесо и тач над открытым календарём не прокручивают страницу под ним;
 * прокручиваемые области внутри (список периодов) работают как обычно.
 */
function useContainScroll(node: HTMLElement | null) {
  React.useEffect(() => {
    if (!node) return;
    /* Граница — весь поповер: он сам прокручивается, когда календарь выше вьюпорта. */
    const boundary = node.closest<HTMLElement>('[role="dialog"]') ?? node;
    const onWheel = (event: WheelEvent) => {
      for (let el = event.target as HTMLElement | null; el; el = el.parentElement) {
        if (canScroll(el, event.deltaY)) return;
        if (el === boundary) break;
      }
      event.preventDefault();
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [node]);
}

/** WAI-ARIA grid (date picker dialog): стрелки — день/неделя, PageUp/Down — месяц (+Shift — год), Home/End — неделя. */
const DAY_KEYS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

/** Calendar panel without a field: inline in a page or a card. */
function DatepickerPanel({
  mode,
  value,
  defaultValue,
  onValueChange,
  resetValue,
  ...options
}: DatepickerPanelProps) {
  const resolved = useResolvedValue({
    mode,
    value,
    defaultValue,
    onValueChange,
    resetValue,
  } as RangeModeProps | SingleModeProps);
  return <PanelView {...options} {...resolved} />;
}
DatepickerPanel.displayName = "Datepicker.Panel";

/** Панель: пресеты слева (или сверху на узком), 1–2 месяца, подсказка, нижняя строка. */
function PanelView(props: PanelViewProps) {
  const {
    size = "m",
    months: monthsProp = 1,
    presets = false,
    prompt = false,
    footer = false,
    withTime = false,
    isDayDisabled,
    disableFuture = false,
    yearless = false,
    locale = ru,
    weekStartsOn = 1,
    onDone,
    className,
  } = props;
  const labels = { ...DATEPICKER_LABELS, ...props.labels };
  const isRange = props.mode === "range";
  const inPopover = React.useContext(InPopoverContext);
  const [panelNode, setPanelNode] = React.useState<HTMLDivElement | null>(null);
  const parentWidth = useAvailableWidth(inPopover ? null : panelNode);
  const viewportWidth = useViewportWidth(inPopover);
  const hasPresets = Boolean(presets) && isRange;

  /*
   * Доступная ширина: во встроенной панели — content box родителя, в поповере — окно минус поля
   * до краёв. null — ещё не измерено: считаем, что места хватает.
   */
  const available = inPopover
    ? viewportWidth == null
      ? null
      : viewportWidth - getViewportPadPx() * 2
    : parentWidth;
  const { monthCount, presetsAside, compact } = resolvePanelLayout({
    size,
    months: monthsProp,
    hasPresets,
    embedded: !inPopover,
    available,
  });
  const today = toDay(props.today ?? new Date());

  const [dayA, setDayA] = React.useState<Date | null>(() => valueDays(props).a);
  const [dayB, setDayB] = React.useState<Date | null>(() => valueDays(props).b);
  const [hover, setHover] = React.useState<Date | null>(null);
  const [fromTime, setFromTime] = React.useState(() => {
    const v = props.mode === "single" ? props.value : props.value.from;
    return formatTime(v ? minutesOf(v) : DAY_START_MINUTES);
  });
  const [toTime, setToTime] = React.useState(() =>
    formatTime(
      props.mode === "range" && props.value.to ? minutesOf(props.value.to) : DAY_END_MINUTES,
    ),
  );
  const [focusDay, setFocusDay] = React.useState<Date>(() => {
    const days = valueDays(props);
    const anchor = (isRange ? (days.b ?? days.a) : days.a) ?? today;
    return yearless ? new Date(YEARLESS_YEAR, anchor.getMonth(), anchor.getDate()) : anchor;
  });
  const [month, setMonth] = React.useState(() => {
    const base = yearless ? clampYearless(focusDay) : startOfMonth(focusDay);
    return monthCount === 2 ? subMonths(base, 1) : base;
  });
  const gridRef = React.useRef<HTMLDivElement>(null);
  const focusPending = React.useRef(false);

  /* 2 → 1 месяц (стало тесно): остаёмся на месяце с фокус-днём, а не на левом из двух. */
  const prevMonthCount = React.useRef(monthCount);
  React.useEffect(() => {
    const was = prevMonthCount.current;
    prevMonthCount.current = monthCount;
    if (was !== 2 || monthCount !== 1) return;
    setMonth((current) => {
      const second = yearless ? clampYearless(addMonths(current, 1)) : addMonths(current, 1);
      return focusDay.getTime() >= second.getTime() ? second : current;
    });
  }, [monthCount, focusDay, yearless]);

  // Без нижней строки внешнее значение — источник правды (встроенный календарь).
  const valueKey =
    props.mode === "single"
      ? String(props.value?.getTime() ?? "")
      : `${props.value.from?.getTime() ?? ""}-${props.value.to?.getTime() ?? ""}`;
  // biome-ignore lint/correctness/useExhaustiveDependencies: синхронизация только по смене значения
  React.useEffect(() => {
    if (footer) return;
    const next = valueDays(props);
    setDayA(next.a);
    setDayB(next.b);
  }, [valueKey, footer]);

  // Перенос фокуса после листания стрелками (кнопка нового дня появляется после рендера).
  React.useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${focusDay.getTime()}"]`)
      ?.focus();
  });

  // В поповере фокус сразу на выбранный (или сегодняшний) день — как в WAI-ARIA date picker dialog.
  // Ловушка фокуса поповера ставит его на первый элемент в своём эффекте; кадр спустя — на день.
  React.useEffect(() => {
    if (!inPopover) return;
    const id = requestAnimationFrame(() => {
      gridRef.current?.querySelector<HTMLButtonElement>('[data-day][tabindex="0"]')?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [inPopover]);

  const visibleMonths = Array.from({ length: monthCount }, (_, i) => addMonths(month, i));
  const rows = Math.max(...visibleMonths.map((m) => rowsNeeded(m, weekStartsOn)));

  const shiftMonth = (delta: number) =>
    setMonth((current) => {
      const next = addMonths(current, delta);
      return yearless ? clampYearless(next) : next;
    });

  const dayDisabled = (day: Date) =>
    (disableFuture && day.getTime() > today.getTime()) || (isDayDisabled?.(day) ?? false);

  const fromMinutes = withTime ? parseTime(fromTime) : DAY_START_MINUTES;
  const toMinutes = withTime ? parseTime(toTime) : DAY_END_MINUTES;

  const commitRange = (from: Date | null, to: Date | null, fromMin: number, toMin: number) => {
    if (props.mode !== "range") return;
    props.onChange({
      from: from ? withMinutes(from, fromMin) : null,
      to: to ? withMinutes(to, toMin, true) : null,
    });
    onDone?.();
  };

  const commitSingle = (day: Date | null, minutes: number) => {
    if (props.mode !== "single") return;
    props.onChange(day ? withMinutes(day, minutes) : null);
    onDone?.();
  };

  const pickDay = (day: Date) => {
    if (dayDisabled(day)) return;
    setFocusDay(day);
    if (!isRange) {
      setDayA(day);
      if (!footer) commitSingle(day, DAY_START_MINUTES);
      return;
    }
    if (dayA == null || dayB != null) {
      setDayA(day);
      setDayB(null);
      setHover(day);
      return;
    }
    setDayB(day);
    if (!footer) {
      const [lo, hi] = dayA.getTime() <= day.getTime() ? [dayA, day] : [day, dayA];
      commitRange(lo, hi, DAY_START_MINUTES, DAY_END_MINUTES);
    }
  };

  const moveFocus = (next: Date) => {
    const target = yearless ? new Date(YEARLESS_YEAR, next.getMonth(), next.getDate()) : next;
    const first = month.getTime();
    const last = addMonths(month, monthCount).getTime();
    if (target.getTime() < first || target.getTime() >= last) {
      const base = yearless ? clampYearless(target) : startOfMonth(target);
      setMonth(target.getTime() < first ? base : subMonths(base, monthCount - 1));
    }
    focusPending.current = true;
    setFocusDay(target);
    if (isRange && dayA != null && dayB == null) setHover(target);
  };

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    const step = DAY_KEYS[event.key];
    const d = focusDay;
    if (step != null) {
      event.preventDefault();
      moveFocus(new Date(d.getFullYear(), d.getMonth(), d.getDate() + step));
    } else if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const sign = event.key === "PageUp" ? -1 : 1;
      /* Shift — на год (в yearless год не меняется: листаем месяц). */
      moveFocus(addMonths(d, sign * (event.shiftKey && !yearless ? 12 : 1)));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const col = (d.getDay() - weekStartsOn + 7) % 7;
      const delta = event.key === "Home" ? -col : 6 - col;
      moveFocus(new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta));
    }
  };

  const sorted: [Date, Date] | null =
    dayA && dayB ? (dayA.getTime() <= dayB.getTime() ? [dayA, dayB] : [dayB, dayA]) : null;
  const canApply = isRange
    ? sorted != null && fromMinutes != null && toMinutes != null
    : dayA != null && fromMinutes != null;

  const apply = () => {
    if (!canApply || fromMinutes == null || toMinutes == null) return;
    if (isRange && sorted) commitRange(sorted[0], sorted[1], fromMinutes, toMinutes);
    else commitSingle(dayA, fromMinutes);
  };

  const reset = () => {
    if (props.mode === "range") props.onChange(props.resetValue ?? { from: null, to: null });
    else props.onChange(props.resetValue ?? null);
    onDone?.();
  };

  // Лента: выбранный диапазон или предпросмотр, пока выбран только старт.
  const preview = isRange && dayA != null && dayB == null;
  const edgeB = isRange ? (preview ? (hover ?? dayA) : dayB) : dayA;
  const lo = dayA && edgeB ? (dayA.getTime() <= edgeB.getTime() ? dayA : edgeB) : null;
  const hi = dayA && edgeB ? (dayA.getTime() <= edgeB.getTime() ? edgeB : dayA) : null;

  const activePreset =
    presets && isRange && !preview ? matchPreset(presets, dayA, dayB, today) : null;
  const weekdays = weekdayLabels(locale, weekStartsOn);

  let promptText: string | null = null;
  if (prompt) {
    if (!isRange) promptText = dayA == null ? labels.pickDate : null;
    else if (dayA == null) promptText = labels.pickStart;
    else if (preview) promptText = labels.pickEnd;
  }

  const footerFrom = isRange ? (sorted?.[0] ?? dayA) : dayA;
  const footerTo = isRange ? (sorted?.[1] ?? null) : null;
  const footerFormat = yearless ? "dd.MM" : "dd.MM.yyyy";
  const controlSize = STEP_DOWN[size];
  /* Соседние месяцы приглушённо — только в одномесячном виде (в двух месяцах дни бы дублировались). */
  const showOutside = monthCount === 1;

  return (
    <div
      ref={setPanelNode}
      className={cx(styles.panel, className)}
      data-size={size}
      data-embedded={inPopover ? undefined : "true"}
      data-compact={compact ? "true" : undefined}
      data-layout={presetsAside || !hasPresets ? "aside" : "stacked"}
    >
      {presets && isRange ? (
        // biome-ignore lint/a11y/useSemanticElements: группа кнопок-пресетов, не поля формы
        <div className={styles.presets} role="group" aria-label={labels.presetsTitle}>
          <p className={styles.presetTitle} aria-hidden>
            {labels.presetsTitle}
          </p>
          {presets.map((preset) => (
            <button
              key={preset.key}
              type="button"
              className={styles.presetItem}
              aria-pressed={activePreset?.key === preset.key}
              onClick={() => {
                const r = preset.days(today);
                commitRange(r.from, r.to, DAY_START_MINUTES, DAY_END_MINUTES);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className={styles.main}>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: делегирование стрелок на сетку дней */}
        <div
          ref={gridRef}
          className={styles.months}
          onKeyDown={onGridKeyDown}
          onMouseLeave={() => preview && setHover(null)}
        >
          {visibleMonths.map((m, mi) => {
            const title = monthTitle(m, locale, yearless);
            return (
              <div key={m.getTime()} className={styles.month}>
                <div className={styles.monthHeader}>
                  {mi === 0 ? (
                    <button
                      type="button"
                      className={styles.nav}
                      aria-label={labels.prevMonth}
                      onClick={() => shiftMonth(-1)}
                    >
                      <ChevronLeft aria-hidden />
                    </button>
                  ) : (
                    <span className={styles.navSpacer} />
                  )}
                  <span className={styles.monthTitle} aria-live="polite">
                    {title}
                  </span>
                  {mi === visibleMonths.length - 1 ? (
                    <button
                      type="button"
                      className={styles.nav}
                      aria-label={labels.nextMonth}
                      onClick={() => shiftMonth(1)}
                    >
                      <ChevronRight aria-hidden />
                    </button>
                  ) : (
                    <span className={styles.navSpacer} />
                  )}
                </div>
                <table className={styles.table} aria-label={title}>
                  <thead className={styles.rowGroup}>
                    <tr className={styles.row}>
                      {weekdays.map((w, i) => {
                        const weekday = (weekStartsOn + i) % 7;
                        return (
                          <th
                            key={w}
                            scope="col"
                            className={styles.weekday}
                            data-weekend={weekday === 0 || weekday === 6 ? "true" : undefined}
                          >
                            {w}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className={styles.rowGroup}>
                    {monthGrid(m, rows, weekStartsOn).map((row) => (
                      <tr key={row.find((c) => c.day)?.day?.getTime()} className={styles.row}>
                        {row.map(({ day, col, outside }) => {
                          if (day == null) {
                            return (
                              <td key={col} className={styles.cell}>
                                {showOutside && outside ? (
                                  <span className={styles.outsideDay} aria-hidden>
                                    {outside.getDate()}
                                  </span>
                                ) : null}
                              </td>
                            );
                          }
                          const n = day.getDate();
                          const lastOfMonth =
                            n === new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
                          const inBand = lo != null && hi != null && day >= lo && day <= hi;
                          const disabled = dayDisabled(day);
                          const isToday = !yearless && sameDay(day, today);
                          return (
                            <td
                              key={col}
                              className={styles.cell}
                              data-band={inBand ? (preview ? "preview" : "selected") : undefined}
                              data-band-start={
                                inBand && (sameDay(day, lo) || col === 0 || n === 1)
                                  ? "true"
                                  : undefined
                              }
                              data-band-end={
                                inBand && (sameDay(day, hi) || col === 6 || lastOfMonth)
                                  ? "true"
                                  : undefined
                              }
                            >
                              <button
                                type="button"
                                className={styles.day}
                                data-day={day.getTime()}
                                disabled={disabled}
                                tabIndex={sameDay(day, focusDay) ? 0 : -1}
                                data-edge={
                                  inBand && !preview && (sameDay(day, lo) || sameDay(day, hi))
                                    ? "true"
                                    : undefined
                                }
                                data-today={isToday ? "true" : undefined}
                                aria-pressed={inBand && !preview}
                                aria-current={isToday ? "date" : undefined}
                                aria-label={format(day, yearless ? "d MMMM" : "d MMMM yyyy", {
                                  locale,
                                })}
                                onClick={() => pickDay(day)}
                                onFocus={() => setFocusDay(day)}
                                onMouseEnter={() => preview && !disabled && setHover(day)}
                              >
                                {n}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {promptText ? (
          <p className={styles.hint} aria-live="polite">
            {promptText}
          </p>
        ) : null}

        {footer ? (
          <div className={styles.footer}>
            <div className={styles.footerFields}>
              <FooterField
                label={isRange ? labels.rangeStart : labels.date}
                date={footerFrom ? format(footerFrom, footerFormat) : ""}
                time={withTime ? fromTime : null}
                timeLabel={isRange ? labels.timeStart : labels.time}
                invalid={fromMinutes == null}
                onTime={setFromTime}
              />
              {isRange ? (
                <>
                  <span className={styles.dash} aria-hidden>
                    —
                  </span>
                  <FooterField
                    label={labels.rangeEnd}
                    date={footerTo ? format(footerTo, footerFormat) : ""}
                    time={withTime ? toTime : null}
                    timeLabel={labels.timeEnd}
                    invalid={toMinutes == null}
                    onTime={setToTime}
                  />
                </>
              ) : null}
            </div>
            <div className={styles.footerActions}>
              <Button.Root
                variant="ghost"
                tone="neutral"
                type="button"
                size={controlSize}
                onClick={reset}
              >
                {labels.reset}
              </Button.Root>
              <Button.Root type="button" size={controlSize} disabled={!canApply} onClick={apply}>
                {labels.apply}
              </Button.Root>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FooterField({
  label,
  date,
  time,
  timeLabel,
  invalid,
  onTime,
}: {
  label: string;
  date: string;
  time: string | null;
  timeLabel: string;
  invalid: boolean;
  onTime: (value: string) => void;
}) {
  return (
    <fieldset className={styles.field} aria-label={label}>
      <span className={styles.fieldDate} data-empty={date ? undefined : "true"}>
        {date || "—"}
      </span>
      {time != null ? (
        <input
          aria-label={timeLabel}
          aria-invalid={invalid || undefined}
          className={styles.fieldTime}
          value={time}
          inputMode="numeric"
          maxLength={5}
          onChange={(e) => onTime(e.target.value)}
        />
      ) : null}
    </fieldset>
  );
}

/** Подпись значения: пресет, «6 окт — 3 нояб», со временем, если границы не по целым дням. */
function formatValue(props: CalendarOptions & ResolvedValue): string | null {
  const locale = props.locale ?? ru;
  const labels = { ...DATEPICKER_LABELS, ...props.labels };
  const today = toDay(props.today ?? new Date());
  if (props.mode === "single") {
    if (!props.value) return null;
    if (props.yearless) return format(props.value, "d MMMM", { locale });
    const time = props.withTime ? ` ${formatTime(minutesOf(props.value))}` : "";
    return `${formatDayShort(toDay(props.value), today, locale)}${time}`;
  }
  const { from, to } = props.value;
  if (!to) return null;
  const fromDay = from ? toDay(from) : null;
  const lastDay = toDay(to);
  const wholeDays =
    (from == null || minutesOf(from) === DAY_START_MINUTES) && minutesOf(to) === DAY_END_MINUTES;
  if (wholeDays && props.presets) {
    const preset = matchPreset(props.presets, fromDay, lastDay, today);
    if (preset) return preset.label;
  }
  const time = (d: Date) => (wholeDays ? "" : ` ${formatTime(minutesOf(d))}`);
  const toText = `${formatDayShort(lastDay, today, locale)}${time(to)}`;
  if (!from || !fromDay) return `${labels.until} ${toText}`;
  if (wholeDays && sameDay(fromDay, lastDay)) return formatDayShort(fromDay, today, locale);
  return `${formatDayShort(fromDay, today, locale)}${time(from)} — ${toText}`;
}

/** Text of a value as the field shows it (preset name, «6 окт — 3 нояб», time when needed). */
export function formatDatepickerValue(
  props: CalendarOptions &
    ({ mode: "range"; value: DatepickerRange } | { mode: "single"; value: Date | null }),
): string | null {
  return formatValue(
    props.mode === "range" ? { ...props, onChange: () => {} } : { ...props, onChange: () => {} },
  );
}

export type DatepickerBadgeProps = {
  /** Palette hue of the soft badge. Default `gray`. */
  color?: PaletteColor;
  children: React.ReactNode;
  className?: string;
};

/**
 * Status inside the field (child of `Datepicker.Root`): a soft Badge one tier below the field, at
 * the trailing edge before the chevron. The value truncates before it; the height is unchanged.
 */
function DatepickerBadge({ color = "gray", children, className }: DatepickerBadgeProps) {
  return (
    <Badge.Root color={color} variant="soft" className={className}>
      {children}
    </Badge.Root>
  );
}
DatepickerBadge.displayName = "Datepicker.Badge";

export type DatepickerRootProps = DatepickerPanelProps &
  FieldFrameProps & {
    size?: ControlSize;
    /** Field text without a value. Default «Выбрать дату». */
    placeholder?: string;
    /** Text before the value in the field, e.g. «С». */
    valuePrefix?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    /** Danger ring and `aria-invalid`; a non-empty `error` implies it. */
    invalid?: boolean;
    /** Field stretches to the container width; otherwise it fits the text. */
    fullWidth?: boolean;
    /** Popover alignment to the field. */
    align?: PositionAlign;
    /** Id of the field button; generated when omitted. */
    id?: string;
    /** Accessible name when there is no `label`; the current value is appended. */
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    /** Field adornments: `Datepicker.Badge` (rendered before the chevron, part of the name). */
    children?: React.ReactNode;
  };

/** Поле (система полей: заливка, высота яруса, кольца) со значением; по клику — панель в поповере. */
function DatepickerRoot({
  mode,
  value: valueProp,
  defaultValue,
  onValueChange,
  resetValue,
  size = "m",
  placeholder = "Выбрать дату",
  valuePrefix,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  invalid: invalidProp,
  focusRing = true,
  fullWidth = false,
  align = "start",
  id,
  label,
  required = false,
  optional,
  hint,
  error,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  children,
  ...options
}: DatepickerRootProps) {
  const resolved = useResolvedValue({
    mode,
    value: valueProp,
    defaultValue,
    onValueChange,
    resetValue,
  } as RangeModeProps | SingleModeProps);
  const labels = { ...DATEPICKER_LABELS, ...options.labels };
  const ids = useFieldFrame(id, { hint, error, invalid: invalidProp }, ariaDescribedBy);
  const textId = `${ids.controlId}-value`;
  const badgeId = `${ids.controlId}-badge`;
  const hasBadge = children != null && children !== false;
  const [openState, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const open = openState && !disabled;
  const [panelNode, setPanelNode] = React.useState<HTMLDivElement | null>(null);
  useContainScroll(panelNode);
  const value = formatValue({ ...options, size, ...resolved });
  const text = value ? `${valuePrefix ? `${valuePrefix} ` : ""}${value}` : placeholder;

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
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <button
            id={ids.controlId}
            type="button"
            disabled={disabled}
            aria-label={ariaLabel ? `${ariaLabel}: ${text}` : undefined}
            aria-labelledby={
              ariaLabel
                ? undefined
                : (ariaLabelledBy ??
                  (label != null && label !== false
                    ? cx(ids.labelId, textId, hasBadge && badgeId)
                    : undefined))
            }
            aria-describedby={ids.describedBy}
            aria-invalid={ids.invalid || undefined}
            className={styles.trigger}
            {...toDataAttributes({
              size,
              empty: value ? undefined : true,
              "full-width": fullWidth || undefined,
              invalid: ids.invalid || undefined,
              disabled: disabled || undefined,
              "focus-ring": focusRing ? undefined : false,
            })}
          >
            <Calendar className={styles.triggerIcon} aria-hidden />
            <span id={textId} className={styles.triggerLabel}>
              {text}
            </span>
            {hasBadge ? (
              <span id={badgeId} className={styles.triggerBadge}>
                <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
              </span>
            ) : null}
            <ChevronDown className={cx(styles.triggerIcon, styles.triggerChevron)} aria-hidden />
          </button>
        </Popover.Trigger>
        <Popover.Content
          align={align}
          side="bottom"
          size={size}
          trapFocus
          className={styles.popover}
        >
          <div ref={setPanelNode} className={styles.popoverBody}>
            <InPopoverContext.Provider value={true}>
              <PanelView {...options} size={size} {...resolved} onDone={() => setOpen(false)} />
            </InPopoverContext.Provider>
          </div>
        </Popover.Content>
      </Popover.Root>
    </FieldFrame>
  );
}
DatepickerRoot.displayName = "Datepicker.Root";

export const Datepicker = {
  Root: DatepickerRoot,
  Panel: DatepickerPanel,
  Badge: DatepickerBadge,
};

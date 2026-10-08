import { addMonths, format, type Locale, startOfDay, startOfMonth, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { getViewportPadPx } from "@/hooks/usePosition";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { mergeRefs } from "@/internal/mergeRefs";
import type { ControlSize } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./Datepicker.module.css";
import {
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  type DatepickerPreset,
  type DatepickerRange,
  formatTime,
  matchPreset,
  minutesOf,
  monthGrid,
  monthTitle,
  parseTime,
  rowsNeeded,
  type WeekStart,
  weekdayLabels,
  withMinutes,
  YEARLESS_YEAR,
} from "./datepickerModel";
import {
  readPanelMetrics,
  resolvePanelLayout,
  STEP_DOWN,
  useAvailableWidth,
  useContainScroll,
  useViewportWidth,
} from "./panelLayout";

/** System strings and default texts. */
export type DatepickerLabels = {
  /** Field text without a value. */
  placeholder: string;
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
  /** Prefix of a range without a start: «до 6 окт». */
  until: string;
  /** Heading of the presets column. */
  presetsTitle: string;
  /** Muted marker after the field label when `optional`. */
  optional: string;
};

export const DATEPICKER_LABELS: DatepickerLabels = {
  placeholder: "Выбрать дату",
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

export type CalendarOptions = {
  /** Tier: day cell = the tier's menu item height (`m` → 32 px), text = the tier's text. */
  size?: ControlSize;
  /** Months side by side; one when there is no room. */
  months?: 1 | 2;
  /** The presets column (`range` only). */
  presets?: DatepickerPreset[] | false;
  /** Step prompt under the calendar: «Выберите начальную дату» / «… конечную дату». */
  prompt?: boolean;
  /** Footer with date fields and Reset / Apply. Without it a pick applies at once. */
  footer?: boolean;
  /** Time fields in the footer (00:00 — 23:59 by default). */
  withTime?: boolean;
  /** Days that cannot be picked (a calendar day is a Date at local midnight). */
  isDayDisabled?: (day: Date) => boolean;
  /** Future days are muted and cannot be picked. */
  disableFuture?: boolean;
  /** An annual day + month: no year, months wrap around inside `YEARLESS_YEAR`. */
  yearless?: boolean;
  /** «Today» for highlighting, presets and `disableFuture`; the browser's day by default. */
  today?: Date;
  locale?: Locale;
  weekStartsOn?: WeekStart;
  labels?: Partial<DatepickerLabels>;
};

export type RangeModeProps = {
  mode: "range";
  /** Bounds in wall-clock time; `null` — the bound is not set. */
  value?: DatepickerRange;
  defaultValue?: DatepickerRange;
  onValueChange?: (value: DatepickerRange) => void;
  /** Value applied by «Сбросить»; an empty range by default. */
  resetValue?: DatepickerRange;
};

export type SingleModeProps = {
  mode: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  /** Value applied by «Сбросить»; `null` by default. */
  resetValue?: Date | null;
};

/** Native attributes and `ref` of the element a part renders (the panel card, the field frame). */
export type DatepickerDomProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "defaultChecked" | "onChange"
> & {
  ref?: React.Ref<HTMLDivElement>;
};

export type DatepickerPanelProps = CalendarOptions &
  (RangeModeProps | SingleModeProps) &
  DatepickerDomProps;

/** Separates the calendar options from the native attributes of a part. */
export function splitCalendarOptions<T extends CalendarOptions>({
  size,
  months,
  presets,
  prompt,
  footer,
  withTime,
  isDayDisabled,
  disableFuture,
  yearless,
  today,
  locale,
  weekStartsOn,
  labels,
  ...rest
}: T): { options: CalendarOptions; rest: Omit<T, keyof CalendarOptions> } {
  return {
    options: {
      size,
      months,
      presets,
      prompt,
      footer,
      withTime,
      isDayDisabled,
      disableFuture,
      yearless,
      today,
      locale,
      weekStartsOn,
      labels,
    },
    rest,
  };
}

/** The value a part works with: controlled or internal, with its setter. */
export type DatepickerValue =
  | {
      mode: "range";
      value: DatepickerRange;
      onChange: (value: DatepickerRange) => void;
      resetValue?: DatepickerRange | undefined;
    }
  | {
      mode: "single";
      value: Date | null;
      onChange: (value: Date | null) => void;
      resetValue?: Date | null | undefined;
    };

const EMPTY_RANGE: DatepickerRange = { from: null, to: null };

/** Controlled-or-internal value of either mode (a part never switches its mode). */
export function useDatepickerValue(props: RangeModeProps | SingleModeProps): DatepickerValue {
  const range = props.mode === "range" ? props : null;
  const single = props.mode === "single" ? props : null;
  const [rangeValue, setRange] = useControllableState<DatepickerRange>({
    value: range?.value,
    defaultValue: range?.defaultValue ?? EMPTY_RANGE,
    onChange: range?.onValueChange,
  });
  const [singleValue, setSingle] = useControllableState<Date | null>({
    value: single?.value,
    defaultValue: single?.defaultValue ?? null,
    onChange: single?.onValueChange,
  });
  if (range) {
    return { mode: "range", value: rangeValue, onChange: setRange, resetValue: range.resetValue };
  }
  return {
    mode: "single",
    value: singleValue,
    onChange: setSingle,
    resetValue: single?.resetValue,
  };
}

type Draft = {
  /** The value the draft was taken from: a new outside value starts a new draft. */
  key: string;
  a: Date | null;
  b: Date | null;
  fromTime: string;
  toTime: string;
};

function draftOf(value: DatepickerValue): Draft {
  const day = (d: Date | null) => (d ? startOfDay(d) : null);
  if (value.mode === "single") {
    return {
      key: String(value.value?.getTime() ?? ""),
      a: day(value.value),
      b: null,
      fromTime: formatTime(value.value ? minutesOf(value.value) : DAY_START_MINUTES),
      toTime: formatTime(DAY_END_MINUTES),
    };
  }
  const { from, to } = value.value;
  return {
    key: `${from?.getTime() ?? ""}-${to?.getTime() ?? ""}`,
    a: day(from),
    b: day(to),
    fromTime: formatTime(from ? minutesOf(from) : DAY_START_MINUTES),
    toTime: formatTime(to ? minutesOf(to) : DAY_END_MINUTES),
  };
}

const clampYearless = (month: Date) => new Date(YEARLESS_YEAR, month.getMonth(), 1);

/** WAI-ARIA date grid: arrows move by day / week, PageUp/Down by month (+Shift a year), Home/End to the week edge. */
const DAY_KEYS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

/** Calendar panel without a field: inline in a page or a card. */
export function DatepickerPanel(props: DatepickerPanelProps) {
  const value = useDatepickerValue(props);
  const { mode, value: _v, defaultValue, onValueChange, resetValue, ...other } = props;
  const {
    options,
    rest: { className, ...dom },
  } = splitCalendarOptions(other);
  return (
    <PanelView
      {...options}
      {...value}
      labels={{ ...DATEPICKER_LABELS, ...options.labels }}
      embedded
      className={className}
      dom={dom}
    />
  );
}
DatepickerPanel.displayName = "Datepicker.Panel";

type PanelViewProps = Omit<CalendarOptions, "labels"> &
  DatepickerValue & {
    labels: DatepickerLabels;
    /** `Datepicker.Panel`: the card follows its container; otherwise (the Root popover) it sizes to its content. */
    embedded: boolean;
    /** After a value is applied (Root closes the popover). */
    onDone?: () => void;
    className?: string;
    /** Native attributes and `ref` of the panel card (`Datepicker.Panel`). */
    dom?: Omit<DatepickerDomProps, "className">;
  };

/** Presets aside (or above when narrow), 1–2 months, the step prompt, the footer. */
export function PanelView(props: PanelViewProps) {
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
    labels,
    embedded,
    onDone,
    className,
    dom: { ref: domRef, ...dom } = {},
  } = props;
  const isRange = props.mode === "range";
  const [panelNode, setPanelNode] = React.useState<HTMLDivElement | null>(null);
  const panelRef = React.useMemo(() => mergeRefs(setPanelNode, domRef), [domRef]);
  const parentWidth = useAvailableWidth(embedded ? panelNode : null);
  const viewportWidth = useViewportWidth(!embedded);
  useContainScroll(embedded ? null : panelNode);
  const hasPresets = Boolean(presets) && isRange;

  // Embedded: the parent's content box; in the popover: the window minus the edge gaps.
  const available = embedded
    ? parentWidth
    : viewportWidth == null
      ? null
      : viewportWidth - getViewportPadPx() * 2;
  const { monthCount, presetsAside, compact } = resolvePanelLayout({
    months: monthsProp,
    hasPresets,
    embedded,
    available,
    metrics: readPanelMetrics(size, embedded),
  });
  const today = startOfDay(props.today ?? new Date());

  // The picked days and times: follow the outside value; with a footer they are a draft until
  // «Применить». A new outside value always starts a new draft.
  const [draftState, setDraft] = React.useState(() => draftOf(props));
  let draft = draftState;
  const valueDraft = draftOf(props);
  if (draftState.key !== valueDraft.key) {
    draft = valueDraft;
    setDraft(valueDraft);
  }
  const { a: dayA, b: dayB, fromTime, toTime } = draft;
  const [hover, setHover] = React.useState<Date | null>(null);
  const [focusDay, setFocusDay] = React.useState<Date>(() => {
    const anchor = (isRange ? (draft.b ?? draft.a) : draft.a) ?? today;
    return yearless ? new Date(YEARLESS_YEAR, anchor.getMonth(), anchor.getDate()) : anchor;
  });
  /** The day keyboard paging moved to: its button takes focus once it is rendered. */
  const [focusTarget, setFocusTarget] = React.useState<number | null>(null);
  const [month, setMonth] = React.useState(() => {
    const base = yearless ? clampYearless(focusDay) : startOfMonth(focusDay);
    return monthCount === 2 ? subMonths(base, 1) : base;
  });

  // 2 → 1 month (it got tight): stay on the month with the focused day, not the left one of two.
  const [shownCount, setShownCount] = React.useState(monthCount);
  if (shownCount !== monthCount) {
    setShownCount(monthCount);
    if (shownCount === 2 && monthCount === 1) {
      const second = yearless ? clampYearless(addMonths(month, 1)) : addMonths(month, 1);
      if (focusDay.getTime() >= second.getTime()) setMonth(second);
    }
  }

  const visibleMonths = Array.from({ length: monthCount }, (_, i) => addMonths(month, i));
  const rows = Math.max(...visibleMonths.map((m) => rowsNeeded(m, weekStartsOn)));
  const titles = visibleMonths.map((m) => monthTitle(m, locale, yearless));

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
      setDraft({ ...draft, a: day });
      if (!footer) commitSingle(day, DAY_START_MINUTES);
      return;
    }
    if (dayA == null || dayB != null) {
      setDraft({ ...draft, a: day, b: null });
      setHover(day);
      return;
    }
    setDraft({ ...draft, b: day });
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
    setFocusTarget(target.getTime());
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
      // Shift pages a year (a yearless calendar has no year: it pages a month).
      moveFocus(addMonths(d, sign * (event.shiftKey && !yearless ? 12 : 1)));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const col = (d.getDay() - weekStartsOn + 7) % 7;
      const delta = event.key === "Home" ? -col : 6 - col;
      moveFocus(new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta));
    }
  };

  // Day events reach the grids through stable callbacks: a memoized month re-renders only when
  // what it draws changes.
  const latest = React.useRef({ pickDay, preview: false });
  const preview = isRange && dayA != null && dayB == null;
  latest.current = { pickDay, preview };
  const dayEvents = React.useMemo<DayEvents>(
    () => ({
      pick: (day) => latest.current.pickDay(day),
      focus: (day) => {
        setFocusDay(day);
        setFocusTarget(null);
      },
      hover: (day) => {
        if (latest.current.preview) setHover(day);
      },
      focusNode: (node) => node?.focus(),
    }),
    [],
  );

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
    if (props.mode === "range") props.onChange(props.resetValue ?? EMPTY_RANGE);
    else props.onChange(props.resetValue ?? null);
    onDone?.();
  };

  // The band: the picked range, or a preview while only the start is picked.
  const edgeB = isRange ? (preview ? (hover ?? dayA) : dayB) : dayA;
  const lo = dayA && edgeB ? Math.min(dayA.getTime(), edgeB.getTime()) : null;
  const hi = dayA && edgeB ? Math.max(dayA.getTime(), edgeB.getTime()) : null;

  const activePreset =
    presets && isRange && !preview ? matchPreset(presets, dayA, dayB, today) : null;
  const weekdays = React.useMemo(() => weekdayLabels(locale, weekStartsOn), [locale, weekStartsOn]);

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
  const layout = presetsAside || !hasPresets ? "aside" : "stacked";

  return (
    <div
      {...dom}
      ref={panelRef}
      className={cx(styles.panel, className)}
      data-size={size}
      data-embedded={embedded ? "true" : undefined}
      data-compact={compact ? "true" : undefined}
      data-layout={layout}
    >
      {presets && isRange ? (
        // biome-ignore lint/a11y/useSemanticElements: a group of preset buttons, not form fields
        <div className={styles.presets} role="group" aria-label={labels.presetsTitle}>
          <p className={styles.presetTitle} aria-hidden>
            {labels.presetsTitle}
          </p>
          {presets.map((preset) => {
            const pressed = activePreset?.key === preset.key;
            return (
              <Button.Root
                key={preset.key}
                variant={pressed || layout === "stacked" ? "soft" : "ghost"}
                tone={pressed ? "accent" : "neutral"}
                size={controlSize}
                fullWidth={layout === "aside"}
                className={styles.presetItem}
                aria-pressed={pressed}
                onClick={() => {
                  const r = preset.days(today);
                  commitRange(r.from, r.to, DAY_START_MINUTES, DAY_END_MINUTES);
                }}
              >
                {preset.label}
              </Button.Root>
            );
          })}
        </div>
      ) : null}

      <div className={styles.main}>
        {/* One announcement for the visible months, not one live region per month. */}
        <VisuallyHidden aria-live="polite">{titles.join(" — ")}</VisuallyHidden>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: arrow keys are delegated to the day grid */}
        <div
          className={styles.months}
          onKeyDown={onGridKeyDown}
          onMouseLeave={() => preview && setHover(null)}
        >
          {visibleMonths.map((m, mi) => (
            <div key={m.getTime()} className={styles.month}>
              <div className={styles.monthHeader}>
                {mi === 0 ? (
                  <Button.Root
                    variant="ghost"
                    tone="neutral"
                    size={controlSize}
                    aria-label={labels.prevMonth}
                    onClick={() => shiftMonth(-1)}
                  >
                    <Button.Icon>
                      <Icon name="nav.chevronLeft" />
                    </Button.Icon>
                  </Button.Root>
                ) : (
                  <span className={styles.navSpacer} />
                )}
                <span className={styles.monthTitle}>{titles[mi]}</span>
                {mi === visibleMonths.length - 1 ? (
                  <Button.Root
                    variant="ghost"
                    tone="neutral"
                    size={controlSize}
                    aria-label={labels.nextMonth}
                    onClick={() => shiftMonth(1)}
                  >
                    <Button.Icon>
                      <Icon name="nav.chevronRight" />
                    </Button.Icon>
                  </Button.Root>
                ) : (
                  <span className={styles.navSpacer} />
                )}
              </div>
              <MonthGrid
                month={m.getTime()}
                title={titles[mi] ?? ""}
                rows={rows}
                weekdays={weekdays}
                weekStartsOn={weekStartsOn}
                locale={locale}
                yearless={yearless}
                // Days of the neighbouring months only in a one-month view (two would repeat them).
                showOutside={monthCount === 1}
                today={today.getTime()}
                disableFuture={disableFuture}
                isDayDisabled={isDayDisabled}
                focusDay={focusDay.getTime()}
                focusTarget={focusTarget}
                autoFocus={!embedded}
                lo={lo}
                hi={hi}
                preview={preview}
                events={dayEvents}
              />
            </div>
          ))}
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
                onTime={(text) => setDraft({ ...draft, fromTime: text })}
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
                    onTime={(text) => setDraft({ ...draft, toTime: text })}
                  />
                </>
              ) : null}
            </div>
            <div className={styles.footerActions}>
              <Button.Root variant="ghost" tone="neutral" size={controlSize} onClick={reset}>
                {labels.reset}
              </Button.Root>
              <Button.Root size={controlSize} disabled={!canApply} onClick={apply}>
                {labels.apply}
              </Button.Root>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type DayEvents = {
  pick: (day: Date) => void;
  focus: (day: Date) => void;
  hover: (day: Date) => void;
  /** Ref of the day keyboard paging moved to. */
  focusNode: (node: HTMLButtonElement | null) => void;
};

type MonthGridProps = {
  /** First day of the month (timestamp: a stable memo key). */
  month: number;
  title: string;
  rows: number;
  weekdays: string[];
  weekStartsOn: WeekStart;
  locale: Locale;
  yearless: boolean;
  showOutside: boolean;
  today: number;
  disableFuture: boolean;
  isDayDisabled: ((day: Date) => boolean) | undefined;
  focusDay: number;
  focusTarget: number | null;
  /** The roving day is where the popover's focus trap puts focus on open. */
  autoFocus: boolean;
  /** Band bounds (day timestamps), or null. */
  lo: number | null;
  hi: number | null;
  preview: boolean;
  events: DayEvents;
};

/**
 * One month: weekday heads and the day buttons. The cells and their names are computed once per
 * month and locale, so a hover that only moves the band formats nothing.
 */
const MonthGrid = React.memo(function MonthGrid({
  month,
  title,
  rows,
  weekdays,
  weekStartsOn,
  locale,
  yearless,
  showOutside,
  today,
  disableFuture,
  isDayDisabled,
  focusDay,
  focusTarget,
  autoFocus,
  lo,
  hi,
  preview,
  events,
}: MonthGridProps) {
  const grid = React.useMemo(
    () =>
      monthGrid(new Date(month), rows, weekStartsOn).map((row) =>
        row.map((cell) => ({
          ...cell,
          time: cell.date.getTime(),
          label: cell.inMonth
            ? format(cell.date, yearless ? "d MMMM" : "d MMMM yyyy", { locale })
            : "",
        })),
      ),
    [month, rows, weekStartsOn, locale, yearless],
  );
  const first = new Date(month);
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();

  return (
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
        {grid.map((row) => (
          <tr key={row[0]?.time} className={styles.row}>
            {row.map(({ date, inMonth, time, label }, col) => {
              if (!inMonth) {
                return (
                  <td key={time} className={styles.cell}>
                    {showOutside ? (
                      <span className={styles.outsideDay} aria-hidden>
                        {date.getDate()}
                      </span>
                    ) : null}
                  </td>
                );
              }
              const n = date.getDate();
              const inBand = lo != null && hi != null && time >= lo && time <= hi;
              const edge = inBand && !preview && (time === lo || time === hi);
              const disabled = (disableFuture && time > today) || (isDayDisabled?.(date) ?? false);
              const isToday = !yearless && time === today;
              const roving = time === focusDay;
              return (
                <td
                  key={time}
                  className={styles.cell}
                  data-band={inBand ? (preview ? "preview" : "selected") : undefined}
                  data-band-start={
                    inBand && (time === lo || col === 0 || n === 1) ? "true" : undefined
                  }
                  data-band-end={
                    inBand && (time === hi || col === 6 || n === lastDay) ? "true" : undefined
                  }
                >
                  <button
                    ref={time === focusTarget ? events.focusNode : undefined}
                    type="button"
                    className={styles.day}
                    data-day={time}
                    data-autofocus={autoFocus && roving ? "" : undefined}
                    disabled={disabled}
                    tabIndex={roving ? 0 : -1}
                    data-edge={edge ? "true" : undefined}
                    data-today={isToday ? "true" : undefined}
                    aria-pressed={inBand && !preview}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={label}
                    onClick={() => events.pick(date)}
                    onFocus={() => events.focus(date)}
                    onMouseEnter={() => !disabled && events.hover(date)}
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
  );
});

/**
 * A read-only date with an optional time input: one segmented pill. The kit has no two-segment
 * field (Input would need a date affix plus a time field), so the footer draws this small pair.
 */
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

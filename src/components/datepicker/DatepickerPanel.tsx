import { addMonths, format, type Locale, startOfMonth, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { getViewportPadPx } from "@/hooks/usePosition";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { mergeRefs } from "@/internal/mergeRefs";
import type { ControlSize } from "@/internal/states";

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
  sameDay,
  toDay,
  type WeekStart,
  weekdayLabels,
  withMinutes,
  YEARLESS_YEAR,
} from "./datepickerModel";
import { resolvePanelLayout, STEP_DOWN, useAvailableWidth, useViewportWidth } from "./panelLayout";

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

/** Resolved (controlled-or-internal) value the panel view works with. */
export type ResolvedValue =
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
    /** Native attributes and `ref` of the panel card (`Datepicker.Panel`). */
    dom?: Omit<DatepickerDomProps, "className">;
  };

const EMPTY_RANGE: DatepickerRange = { from: null, to: null };

export function useResolvedValue(props: RangeModeProps | SingleModeProps): ResolvedValue {
  const [value, setValue] = useControllableState<DatepickerRange | Date | null>({
    value: props.value,
    defaultValue: props.defaultValue ?? (props.mode === "range" ? EMPTY_RANGE : null),
    onChange: props.onValueChange as ((value: DatepickerRange | Date | null) => void) | undefined,
  });
  return props.mode === "range"
    ? {
        mode: "range",
        value: value as DatepickerRange,
        onChange: setValue,
        resetValue: props.resetValue,
      }
    : {
        mode: "single",
        value: value as Date | null,
        onChange: setValue,
        resetValue: props.resetValue,
      };
}

function valueDays(props: ResolvedValue): { a: Date | null; b: Date | null } {
  if (props.mode === "single") return { a: props.value ? toDay(props.value) : null, b: null };
  return {
    a: props.value.from ? toDay(props.value.from) : null,
    b: props.value.to ? toDay(props.value.to) : null,
  };
}

const clampYearless = (month: Date) => new Date(YEARLESS_YEAR, month.getMonth(), 1);

/** The panel inside the Root popover sizes to its content; embedded it follows its container. */
export const InPopoverContext = React.createContext(false);

/** WAI-ARIA date grid: arrows move by day / week, PageUp/Down by month (+Shift a year), Home/End to the week edge. */
const DAY_KEYS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

/** Calendar panel without a field: inline in a page or a card. */
export function DatepickerPanel({
  mode,
  value,
  defaultValue,
  onValueChange,
  resetValue,
  ...props
}: DatepickerPanelProps) {
  const resolved = useResolvedValue({
    mode,
    value,
    defaultValue,
    onValueChange,
    resetValue,
  } as RangeModeProps | SingleModeProps);
  const {
    options,
    rest: { className, ...dom },
  } = splitCalendarOptions(props);
  return <PanelView {...options} {...resolved} className={className} dom={dom} />;
}
DatepickerPanel.displayName = "Datepicker.Panel";

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
    onDone,
    className,
    dom: { ref: domRef, ...dom } = {},
  } = props;
  const labels = { ...DATEPICKER_LABELS, ...props.labels };
  const isRange = props.mode === "range";
  const inPopover = React.useContext(InPopoverContext);
  const [panelNode, setPanelNode] = React.useState<HTMLDivElement | null>(null);
  const panelRef = React.useMemo(() => mergeRefs(setPanelNode, domRef), [domRef]);
  const parentWidth = useAvailableWidth(inPopover ? null : panelNode);
  const viewportWidth = useViewportWidth(inPopover);
  const hasPresets = Boolean(presets) && isRange;

  // Embedded: the parent's content box; in the popover: the window minus the edge gaps.
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

  // 2 → 1 month (it got tight): stay on the month with the focused day, not the left one of two.
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

  // Without a footer the outer value is the source of truth (an embedded calendar).
  const valueKey =
    props.mode === "single"
      ? String(props.value?.getTime() ?? "")
      : `${props.value.from?.getTime() ?? ""}-${props.value.to?.getTime() ?? ""}`;
  // biome-ignore lint/correctness/useExhaustiveDependencies: syncs only when the value changes.
  React.useEffect(() => {
    if (footer) return;
    const next = valueDays(props);
    setDayA(next.a);
    setDayB(next.b);
  }, [valueKey, footer]);

  // Moves focus after arrow paging (the new day's button appears after the render).
  React.useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${focusDay.getTime()}"]`)
      ?.focus();
  });

  // In the popover focus goes to the picked (or today's) day, as in the WAI-ARIA date picker
  // dialog. The popover's focus trap focuses its first element in its own effect; a frame later —
  // the day.
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
      // Shift pages a year (a yearless calendar has no year: it pages a month).
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
    if (props.mode === "range") props.onChange(props.resetValue ?? EMPTY_RANGE);
    else props.onChange(props.resetValue ?? null);
    onDone?.();
  };

  // The band: the picked range, or a preview while only the start is picked.
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
  const layout = presetsAside || !hasPresets ? "aside" : "stacked";
  // Days of the neighbouring months only in a one-month view (two months would repeat them).
  const showOutside = monthCount === 1;

  return (
    <div
      {...dom}
      ref={panelRef}
      className={cx(styles.panel, className)}
      data-size={size}
      data-embedded={inPopover ? undefined : "true"}
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
        {/* biome-ignore lint/a11y/noStaticElementInteractions: arrow keys are delegated to the day grid */}
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
                  <span className={styles.monthTitle} aria-live="polite">
                    {title}
                  </span>
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

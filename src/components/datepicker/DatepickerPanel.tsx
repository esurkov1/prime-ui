import { addMonths, format, type Locale, startOfDay, startOfMonth, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";
import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { getViewportPadPx } from "@/hooks/usePosition";
import { Check } from "@/icons/glyphs/check";
import { ChevronLeft } from "@/icons/glyphs/chevron-left";
import { ChevronRight } from "@/icons/glyphs/chevron-right";

import { AUTOFILL_OFF } from "@/internal/autofill";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { NativeButton } from "@/internal/disabledContext";
import { fieldInputTextClass, fieldSurfaceClass, fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import listRowStyles from "@/internal/listRow.module.css";
import { menuRowProps, menuRowTier } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { RegionSwap } from "@/internal/RegionSwap";
import { type ControlSize, stepDown } from "@/internal/states";
import textRole from "@/internal/textRole.module.css";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

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
  useAvailableWidth,
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
  /** Field text of a range with both ends: `{from}`, `{to}`. */
  rangeValue: string;
  /** Accessible name of the presets group. */
  presetsGroup: string;
  /** Muted marker after the field label when `optional`. */
  optional: string;
  /** Read after the field name of a `required` field (its trigger is a button). */
  required: string;
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
  rangeValue: "{from} — {to}",
  presetsGroup: "Период",
  optional: "необязательно",
  required: "обязательное поле",
};

export type CalendarOptions = {
  size?: ControlSize;
  months?: 1 | 2;
  presets?: DatepickerPreset[] | false;
  prompt?: boolean;
  footer?: boolean;
  withTime?: boolean;
  isDayDisabled?: (day: Date) => boolean;
  disableFuture?: boolean;
  yearless?: boolean;
  today?: Date;
  locale?: Locale;
  weekStartsOn?: WeekStart;
  labels?: Partial<DatepickerLabels>;
};

export type RangeModeProps = {
  mode: "range";
  value?: DatepickerRange;
  defaultValue?: DatepickerRange;
  onValueChange?: (value: DatepickerRange) => void | Promise<void>;
  resetValue?: DatepickerRange;
};

export type SingleModeProps = {
  mode: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void | Promise<void>;
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

/**
 * The value a part works with: controlled or internal, with its setter. `saving` — a promise from
 * `onValueChange` is pending: the value it carries is shown, and a new commit waits for its answer.
 */
export type DatepickerValue =
  | {
      mode: "range";
      value: DatepickerRange;
      onChange: (value: DatepickerRange) => void;
      resetValue?: DatepickerRange | undefined;
      saving: boolean;
    }
  | {
      mode: "single";
      value: Date | null;
      onChange: (value: Date | null) => void;
      resetValue?: Date | null | undefined;
      saving: boolean;
    };

const EMPTY_RANGE: DatepickerRange = { from: null, to: null };

const takeNext = <T,>(_current: T, next: T) => next;

/**
 * One mode's value under the kit's async-event contract: the stored value with a pending change
 * drawn over it; `commit(next)` hands it to the owner — a plain answer stores it at once, a promise
 * holds it until it settles (resolve stores it, reject drops it and the stored value shows again).
 */
function usePendingDate<T>(
  value: T | undefined,
  defaultValue: T,
  onValueChange: ((value: T) => void | Promise<void>) | undefined,
) {
  const [stored, setStored] = useControllableState<T>({ value, defaultValue });
  const changes = usePendingChanges(stored, takeNext<T>);
  const saving = changes.pending.length > 0;
  const commit = (next: T) => {
    if (saving || Object.is(next, changes.shown)) return;
    const outcome = onValueChange?.(next);
    if (!isPromiseLike(outcome)) {
      setStored(next);
      return;
    }
    changes.track(next, outcome, { onResolve: () => setStored(next) });
  };
  return { value: changes.shown, saving, commit };
}

/** Controlled-or-internal value of either mode (a part never switches its mode). */
export function useDatepickerValue(props: RangeModeProps | SingleModeProps): DatepickerValue {
  const range = props.mode === "range" ? props : null;
  const single = props.mode === "single" ? props : null;
  const rangeValue = usePendingDate<DatepickerRange>(
    range?.value,
    range?.defaultValue ?? EMPTY_RANGE,
    range?.onValueChange,
  );
  const singleValue = usePendingDate<Date | null>(
    single?.value,
    single?.defaultValue ?? null,
    single?.onValueChange,
  );
  if (range) {
    return {
      mode: "range",
      value: rangeValue.value,
      onChange: rangeValue.commit,
      resetValue: range.resetValue,
      saving: rangeValue.saving,
    };
  }
  return {
    mode: "single",
    value: singleValue.value,
    onChange: singleValue.commit,
    resetValue: single?.resetValue,
    saving: singleValue.saving,
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
    options: { size: sizeProp, ...options },
    rest: { className, ...dom },
  } = splitCalendarOptions(other);
  const tier = useHostTier(sizeProp);
  const labels = useLabels(DATEPICKER_LABELS, options.labels);
  return tier.provide(
    <PanelView
      {...options}
      {...value}
      size={tier.size}
      labels={labels}
      embedded
      className={className}
      dom={dom}
    />,
  );
}
DatepickerPanel.displayName = "Datepicker.Panel";

type PanelViewProps = Omit<CalendarOptions, "labels" | "size"> &
  DatepickerValue & {
    /** The resolved tier (the Root's or the Panel's `useHostTier`). */
    size: ControlSize;
    labels: DatepickerLabels;
    /** `Datepicker.Panel`: host content that takes its container's width; otherwise (the Root popover) it sizes to its content. */
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
    size,
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
  const panelRef = useMergedRefs(setPanelNode, domRef);
  const parentWidth = useAvailableWidth(embedded ? panelNode : null);
  const viewportWidth = useViewportWidth(!embedded);
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
    metrics: readPanelMetrics(size, panelNode),
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
    // Only the day cells walk the grid: the month buttons keep their own keys.
    if (!(event.target instanceof HTMLElement) || !event.target.hasAttribute("data-day")) return;
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
  const controlSize = stepDown(size);
  const layout = presetsAside || !hasPresets ? "aside" : "stacked";

  return (
    <div
      {...dom}
      ref={panelRef}
      className={cx(fieldTierClass, menu.tier, styles.panel, className)}
      data-size={size}
      data-embedded={embedded ? "true" : undefined}
      aria-busy={props.saving || undefined}
      data-compact={compact ? "true" : undefined}
      data-layout={layout}
    >
      {presets && isRange ? (
        <ScrollContainer
          axis={layout === "stacked" ? "horizontal" : "vertical"}
          scrollbar={layout === "stacked" ? "hidden" : "thin"}
          className={styles.presets}
          role="group"
          aria-label={labels.presetsGroup}
        >
          {presets.map((preset) => {
            const pressed = activePreset?.key === preset.key;
            const apply = () => {
              const r = preset.days(today);
              commitRange(r.from, r.to, DAY_START_MINUTES, DAY_END_MINUTES);
            };
            // Narrow: a sideways row of soft Buttons above the months.
            if (layout === "stacked") {
              return (
                <Button.Root
                  key={preset.key}
                  variant="soft"
                  tone={pressed ? "accent" : "neutral"}
                  size={controlSize}
                  pressed={pressed}
                  onClick={apply}
                >
                  {preset.label}
                </Button.Root>
              );
            }
            // Aside: a column of list rows, the active one checked at the end (a choice of one).
            return (
              <NativeButton
                key={preset.key}
                aria-pressed={pressed}
                {...menuRowProps({ size: menuRowTier(size), className: styles.preset })}
                onClick={apply}
              >
                <span className={listRowStyles.body}>
                  <span className={listRowStyles.title}>{preset.label}</span>
                </span>
                <span className={cx(listRowStyles.check, styles.presetCheck)} aria-hidden="true">
                  <Check />
                </span>
              </NativeButton>
            );
          })}
        </ScrollContainer>
      ) : null}

      <div className={styles.main}>
        {/* One announcement for the visible months, not one live region per month. */}
        <VisuallyHidden live="polite">{titles.join(" — ")}</VisuallyHidden>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: arrow keys are delegated to the day grid */}
        <div
          className={styles.months}
          onKeyDown={onGridKeyDown}
          onMouseLeave={() => preview && setHover(null)}
        >
          {visibleMonths.map((m, mi) => (
            // Keyed by place: the header and its buttons stay while the grid swaps to the next month.
            // biome-ignore lint/suspicious/noArrayIndexKey: one or two month places, never reordered
            <div key={mi} className={styles.month}>
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
                      <ChevronLeft />
                    </Button.Icon>
                  </Button.Root>
                ) : (
                  <span className={styles.navSpacer} />
                )}
                <span className={cx(textRole.titleS, styles.monthTitle)}>{titles[mi]}</span>
                {mi === visibleMonths.length - 1 ? (
                  <Button.Root
                    variant="ghost"
                    tone="neutral"
                    size={controlSize}
                    aria-label={labels.nextMonth}
                    onClick={() => shiftMonth(1)}
                  >
                    <Button.Icon>
                      <ChevronRight />
                    </Button.Icon>
                  </Button.Root>
                ) : (
                  <span className={styles.navSpacer} />
                )}
              </div>
              {/* Another month cross-fades in (foundation §1 rule 7). */}
              <RegionSwap state={m.getTime()} hold={false}>
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
              </RegionSwap>
            </div>
          ))}
        </div>

        {promptText ? (
          <p className={cx(textRole.caption, styles.hint)} aria-live="polite">
            {promptText}
          </p>
        ) : null}

        {footer ? (
          <div className={styles.footer} data-time={withTime || undefined}>
            <div className={styles.footerFields}>
              <FooterField
                size={controlSize}
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
                    size={controlSize}
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
              <Button.Root variant="soft" tone="neutral" size={controlSize} onClick={reset}>
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
                className={cx(textRole.caption, styles.weekday)}
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
                  <NativeButton
                    ref={time === focusTarget ? events.focusNode : undefined}
                    className={styles.day}
                    data-day={time}
                    data-autofocus={autoFocus && roving ? "" : undefined}
                    disabled={disabled}
                    tabIndex={roving ? 0 : -1}
                    data-edge={edge ? "true" : undefined}
                    aria-pressed={inBand && !preview}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={label}
                    onClick={() => events.pick(date)}
                    onFocus={() => events.focus(date)}
                    onMouseEnter={() => !disabled && events.hover(date)}
                  >
                    {n}
                  </NativeButton>
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
 * A read-only date with an optional time input: one segmented pill on the field surface and tier.
 * The kit has no two-segment field (Input would need a date affix plus a time field), so the footer
 * draws this small pair.
 */
function FooterField({
  size,
  label,
  date,
  time,
  timeLabel,
  invalid,
  onTime,
}: {
  size: ControlSize;
  label: string;
  date: string;
  time: string | null;
  timeLabel: string;
  invalid: boolean;
  onTime: (value: string) => void;
}) {
  return (
    <fieldset
      className={cx(fieldTierClass, fieldSurfaceClass, styles.field)}
      data-size={size}
      aria-label={label}
    >
      <span className={styles.fieldDate} data-empty={date ? undefined : "true"}>
        {date || "—"}
      </span>
      {time != null ? (
        <input
          aria-label={timeLabel}
          aria-invalid={invalid || undefined}
          className={cx(fieldInputTextClass, styles.fieldTime)}
          value={time}
          inputMode="numeric"
          {...AUTOFILL_OFF}
          maxLength={5}
          onChange={(e) => onTime(e.target.value)}
        />
      ) : null}
    </fieldset>
  );
}

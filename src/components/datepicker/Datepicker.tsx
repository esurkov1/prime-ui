import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import {
  type ChevronProps,
  type DateRange,
  DayPicker,
  type DayPickerProps,
  getDefaultClassNames,
  useDayPicker,
} from "react-day-picker";

import { Button } from "@/components/button/Button";
import { ButtonGroup } from "@/components/button-group/ButtonGroup";
import { Input } from "@/components/input/Input";
import type { TypographyRootProps, TypographySize } from "@/components/typography/Typography";
import { Typography } from "@/components/typography/Typography";
import { type ResponsiveMonthsBreakpoints, useResponsiveMonths } from "@/hooks/useResponsiveMonths";
import { cx } from "@/internal/cx";
import type { InputSize } from "@/internal/states";

import "react-day-picker/style.css";

import styles from "./Datepicker.module.css";

export type { DateRange };

/**
 * Порог для переключения 1 → 2 месяца.
 * Layout не зависит от size: размер влияет только на типографику/отступы/кнопки.
 */
const DEFAULT_RESPONSIVE: ResponsiveMonthsBreakpoints = { twoColumns: 500 };

export type DatepickerSize = InputSize;

const DatepickerSizeContext = React.createContext<DatepickerSize | undefined>(undefined);
DatepickerSizeContext.displayName = "DatepickerSizeContext";

type DatepickerMonthContextValue = {
  requestedMonth: Date | undefined;
  requestMonth: (next: Date | undefined) => void;
};

const DatepickerMonthContext = React.createContext<DatepickerMonthContextValue | undefined>(
  undefined,
);
DatepickerMonthContext.displayName = "DatepickerMonthContext";

/**
 * Маппинг размера пикера → размер шрифта Typography для `Datepicker.Value`.
 * Используем шкалу support-text, чтобы подпись выглядела как caption.
 */
const VALUE_TYPOGRAPHY_SIZE_BY_PICKER_SIZE: Record<DatepickerSize, TypographySize> = {
  s: "2xs",
  m: "xs",
  l: "s",
  xl: "m",
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Значение для `<input type="time" />` в локальном времени */
export function formatTimeInputValue(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** Подставляет часы и минуты из строки `HH:mm` в дату */
export function mergeTimeIntoDate(date: Date, timeHHmm: string): Date {
  const [h, m] = timeHHmm.split(":").map((x) => Number.parseInt(x, 10));
  const next = new Date(date);
  next.setHours(Number.isFinite(h) ? h : 0, Number.isFinite(m) ? m : 0, 0, 0);
  return next;
}

function DatepickerChevron({ orientation, className, size = 17 }: ChevronProps) {
  if (orientation === "left") {
    return <ChevronLeft aria-hidden className={className} size={size} strokeWidth={1.75} />;
  }
  if (orientation === "right") {
    return <ChevronRight aria-hidden className={className} size={size} strokeWidth={1.75} />;
  }
  return (
    <ChevronDown
      aria-hidden
      className={className}
      size={size}
      strokeWidth={1.75}
      style={orientation === "up" ? { transform: "rotate(180deg)" } : undefined}
    />
  );
}

type DatepickerNavButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  direction: "prev" | "next";
  size: DatepickerSize;
};

function DatepickerNavButton({ className, direction, size, ...rest }: DatepickerNavButtonProps) {
  return (
    <Button.Root
      {...rest}
      className={cx(styles.navButton, className)}
      mode="lighter"
      size={size}
      variant="neutral"
    >
      <Button.Icon>
        {direction === "prev" ? (
          <ChevronLeft aria-hidden strokeWidth={1.75} />
        ) : (
          <ChevronRight aria-hidden strokeWidth={1.75} />
        )}
      </Button.Icon>
    </Button.Root>
  );
}

DatepickerNavButton.displayName = "DatepickerNavButton";

type DatepickerMonthCaptionProps = Parameters<
  NonNullable<NonNullable<DayPickerProps["components"]>["MonthCaption"]>
>[0];

function DatepickerMonthCaption({
  className,
  children,
  displayIndex,
  ...rest
}: DatepickerMonthCaptionProps) {
  const inheritedSize = React.useContext(DatepickerSizeContext);
  const size = inheritedSize ?? "m";
  const { dayPickerProps, goToMonth, previousMonth, nextMonth } = useDayPicker();

  const monthsCount = dayPickerProps.numberOfMonths ?? 1;
  const monthIndex = displayIndex ?? 0;
  const canGoPrev = monthIndex === 0 && previousMonth != null;
  const canGoNext = monthIndex === monthsCount - 1 && nextMonth != null;

  return (
    <div {...rest} className={cx(styles.monthCaption, className)}>
      {canGoPrev ? (
        <DatepickerNavButton
          aria-label="Go to the Previous Month"
          direction="prev"
          size={size}
          onClick={() => {
            if (previousMonth) {
              goToMonth(previousMonth);
            }
          }}
        />
      ) : (
        <span aria-hidden className={styles.monthCaptionSpacer} />
      )}
      <div className={styles.monthCaptionLabel}>{children}</div>
      {canGoNext ? (
        <DatepickerNavButton
          aria-label="Go to the Next Month"
          direction="next"
          size={size}
          onClick={() => {
            if (nextMonth) {
              goToMonth(nextMonth);
            }
          }}
        />
      ) : (
        <span aria-hidden className={styles.monthCaptionSpacer} />
      )}
    </div>
  );
}

DatepickerMonthCaption.displayName = "DatepickerMonthCaption";

export type DatepickerCalendarProps = DayPickerProps & {
  /**
   * Подстраивать `numberOfMonths` под ширину контейнера (1 / 2 колонки).
   * Если `true`, проп `numberOfMonths` игнорируется.
   */
  responsiveMonths?: boolean;
  /** Порог ширины для 2 колонок */
  responsiveBreakpoints?: ResponsiveMonthsBreakpoints;
  /** Размер календаря: влияет на кегль, ячейки и кнопки навигации */
  size?: DatepickerSize;
};

function Calendar({
  responsiveMonths,
  responsiveBreakpoints,
  numberOfMonths: numberOfMonthsProp,
  classNames: userClassNames,
  components: userComponents,
  style,
  weekStartsOn,
  navLayout,
  month: monthProp,
  onMonthChange,
  size: sizeProp,
  ...rest
}: DatepickerCalendarProps) {
  const inheritedSize = React.useContext(DatepickerSizeContext);
  const monthContext = React.useContext(DatepickerMonthContext);
  const size = sizeProp ?? inheritedSize ?? "m";
  const breakpoints = responsiveBreakpoints ?? DEFAULT_RESPONSIVE;

  /**
   * Callback-ref → state: гарантирует, что хук получит реальный DOM-элемент
   * сразу при монтировании, и ResizeObserver начнёт наблюдение корректно.
   * useRef + useEffect([containerRef]) не работал: ref-объект стабилен,
   * эффект не пересчитывался, clientWidth мог быть 0 до первого paint.
   */
  const [containerEl, setContainerEl] = React.useState<HTMLElement | null>(null);
  const callbackRef = React.useCallback((node: HTMLDivElement | null) => {
    setContainerEl(node);
  }, []);

  const responsiveN = useResponsiveMonths(breakpoints, containerEl);
  const numberOfMonths = responsiveMonths === true ? responsiveN : (numberOfMonthsProp ?? 1);

  const [localMonth, setLocalMonth] = React.useState<Date | undefined>(() => {
    return monthProp ?? monthContext?.requestedMonth;
  });

  React.useEffect(() => {
    if (monthProp === undefined && monthContext?.requestedMonth) {
      setLocalMonth(monthContext.requestedMonth);
    }
  }, [monthContext?.requestedMonth, monthProp]);

  const dfn = getDefaultClassNames();
  const classNames = {
    ...dfn,
    ...userClassNames,
    root: cx(dfn.root, styles.pickerRoot, userClassNames?.root),
    months: cx(dfn.months, styles.months, userClassNames?.months),
    month: cx(dfn.month, styles.month, userClassNames?.month),
    nav: cx(dfn.nav, styles.nav, userClassNames?.nav),
    month_caption: cx(dfn.month_caption, styles.monthCaption, userClassNames?.month_caption),
    weekday: cx(dfn.weekday, styles.weekday, userClassNames?.weekday),
  };

  const mergedStyle: React.CSSProperties = style && typeof style === "object" ? { ...style } : {};

  const resolvedMonth = monthProp ?? localMonth;

  const handleMonthChange = React.useCallback(
    (next: Date) => {
      if (monthProp === undefined) {
        setLocalMonth(next);
      }
      monthContext?.requestMonth(next);
      onMonthChange?.(next);
    },
    [monthContext, monthProp, onMonthChange],
  );

  return (
    <div ref={callbackRef} className={styles.calendarViewport}>
      <DayPicker
        {...rest}
        classNames={classNames}
        components={{
          Chevron: DatepickerChevron,
          MonthCaption: DatepickerMonthCaption,
          ...userComponents,
        }}
        data-size={size}
        navLayout={navLayout ?? "after"}
        month={resolvedMonth}
        numberOfMonths={numberOfMonths}
        onMonthChange={handleMonthChange}
        style={mergedStyle}
        weekStartsOn={weekStartsOn ?? 1}
      />
    </div>
  );
}

Calendar.displayName = "Datepicker.Calendar";

export type DatepickerShellProps = {
  children: React.ReactNode;
  className?: string;
  presets?: React.ReactNode;
  /** Размер всей оболочки датпикера */
  size?: DatepickerSize;
};

function Shell({ children, className, presets, size = "m" }: DatepickerShellProps) {
  const has = presets != null;
  const [requestedMonth, requestMonth] = React.useState<Date | undefined>();
  return (
    <DatepickerSizeContext.Provider value={size}>
      <DatepickerMonthContext.Provider value={{ requestedMonth, requestMonth }}>
        <div
          className={cx(styles.shell, className)}
          data-layout={has ? "with-presets" : undefined}
          data-size={size}
        >
          {children}
          {has && <div className={styles.presetsRow}>{presets}</div>}
        </div>
      </DatepickerMonthContext.Provider>
    </DatepickerSizeContext.Provider>
  );
}

Shell.displayName = "Datepicker.Shell";

export type DatepickerPresetSingle = { label: string; date: Date | undefined };
export type DatepickerPresetRange = { label: string; range: DateRange | undefined };

export type DatepickerPresetsProps = {
  className?: string;
  title?: string;
  size?: DatepickerSize;
} & (
  | {
      mode: "single";
      presets: DatepickerPresetSingle[];
      onSelect: (date: Date | undefined) => void;
    }
  | {
      mode: "range";
      presets: DatepickerPresetRange[];
      onSelect: (range: DateRange | undefined) => void;
    }
);

function Presets(props: DatepickerPresetsProps) {
  const inheritedSize = React.useContext(DatepickerSizeContext);
  const monthContext = React.useContext(DatepickerMonthContext);
  const { className, size: sizeProp } = props;
  const size = sizeProp ?? inheritedSize ?? "m";
  return (
    <div className={cx(styles.presetsBlock, className)} data-size={size}>
      <ButtonGroup.Root className={styles.presetsGroup} size={size}>
        {props.mode === "single"
          ? props.presets.map((p) => (
              <ButtonGroup.Item
                key={p.label}
                type="button"
                onClick={() => {
                  monthContext?.requestMonth(p.date);
                  props.onSelect(p.date);
                }}
              >
                {p.label}
              </ButtonGroup.Item>
            ))
          : props.presets.map((p) => (
              <ButtonGroup.Item
                key={p.label}
                type="button"
                onClick={() => {
                  monthContext?.requestMonth(p.range?.from);
                  props.onSelect(p.range);
                }}
              >
                {p.label}
              </ButtonGroup.Item>
            ))}
      </ButtonGroup.Root>
    </div>
  );
}

Presets.displayName = "Datepicker.Presets";

export type DatepickerTimeSingleProps = {
  mode?: "single";
  size?: DatepickerSize;
  value: Date | undefined;
  onChange: (next: Date) => void;
  labels?: { time?: string };
};

export type DatepickerTimeRangeProps = {
  mode: "range";
  size?: DatepickerSize;
  from: Date | undefined;
  to: Date | undefined;
  onFromChange: (next: Date) => void;
  onToChange: (next: Date) => void;
  labels?: { from?: string; to?: string };
};

export type DatepickerTimeProps = DatepickerTimeSingleProps | DatepickerTimeRangeProps;

function Time(props: DatepickerTimeProps) {
  const baseId = React.useId();
  const inheritedSize = React.useContext(DatepickerSizeContext);

  if (props.mode === "range") {
    const { from, to, onFromChange, onToChange, labels, size: sizeProp } = props;
    const size = sizeProp ?? inheritedSize ?? "m";
    const fromT = formatTimeInputValue(from);
    const toT = formatTimeInputValue(to);
    return (
      <div className={styles.timeSection} data-size={size}>
        <div className={styles.timeRow}>
          <div className={styles.timeField}>
            <Input.Root
              className={styles.timeInputRoot}
              id={`${baseId}-from`}
              label={labels?.from ?? "Начало"}
              size={size}
            >
              <Input.Wrapper>
                <Input.Field
                  className={styles.timeInputField}
                  disabled={!from}
                  type="time"
                  value={fromT}
                  onChange={(e) => {
                    if (from) {
                      onFromChange(mergeTimeIntoDate(from, e.target.value));
                    }
                  }}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <div className={styles.timeField}>
            <Input.Root
              className={styles.timeInputRoot}
              id={`${baseId}-to`}
              label={labels?.to ?? "Конец"}
              size={size}
            >
              <Input.Wrapper>
                <Input.Field
                  className={styles.timeInputField}
                  disabled={!to}
                  type="time"
                  value={toT}
                  onChange={(e) => {
                    if (to) {
                      onToChange(mergeTimeIntoDate(to, e.target.value));
                    }
                  }}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </div>
      </div>
    );
  }

  const { value, onChange, labels, size: sizeProp } = props;
  const size = sizeProp ?? inheritedSize ?? "m";
  const t = formatTimeInputValue(value);
  return (
    <div className={styles.timeSection} data-size={size}>
      <div className={styles.timeRow}>
        <div className={styles.timeField}>
          <Input.Root
            className={styles.timeInputRoot}
            id={`${baseId}-t`}
            label={labels?.time ?? "Время"}
            size={size}
          >
            <Input.Wrapper>
              <Input.Field
                className={styles.timeInputField}
                disabled={!value}
                type="time"
                value={t}
                onChange={(e) => {
                  if (value) {
                    onChange(mergeTimeIntoDate(value, e.target.value));
                  }
                }}
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>
    </div>
  );
}

Time.displayName = "Datepicker.Time";

export type DatepickerValueProps = Omit<TypographyRootProps, "size"> & {
  size?: DatepickerSize;
};

function Value({ className, size: sizeProp, tone = "muted", ...rest }: DatepickerValueProps) {
  const inheritedSize = React.useContext(DatepickerSizeContext);
  const size = sizeProp ?? inheritedSize ?? "m";
  return (
    <Typography.Root
      {...rest}
      className={cx(styles.valueText, className)}
      size={VALUE_TYPOGRAPHY_SIZE_BY_PICKER_SIZE[size]}
      tone={tone}
    />
  );
}

Value.displayName = "Datepicker.Value";

export const Datepicker = {
  Calendar,
  Shell,
  Presets,
  Time,
  Value,
};

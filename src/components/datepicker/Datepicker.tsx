import { format, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import type * as React from "react";
import { Popover } from "@/components/popover/Popover";
import { Spinner } from "@/components/spinner/Spinner";
import { DEFAULT_ALIGN, type PositionAlign } from "@/hooks/usePosition";
import { Calendar } from "@/icons/glyphs/calendar";
import { ChevronDown } from "@/icons/glyphs/chevron-down";

import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { NativeButton, useInheritedDisabled } from "@/internal/disabledContext";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
import { fieldTriggerClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { GlyphSwap } from "@/internal/glyphSwap";
import { useLabels } from "@/internal/labels";
import { useOpenState } from "@/internal/overlay/useOpenState";
import { splitParts } from "@/internal/parts";
import type { ControlSize } from "@/internal/states";

import styles from "./Datepicker.module.css";
import {
  type CalendarOptions,
  DATEPICKER_LABELS,
  DatepickerPanel,
  type DatepickerPanelProps,
  PanelView,
  splitCalendarOptions,
  useDatepickerValue,
} from "./DatepickerPanel";
import {
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  type DatepickerRange,
  formatDayShort,
  formatTime,
  matchPreset,
  minutesOf,
  sameDay,
} from "./datepickerModel";

export type { DatepickerLabels, DatepickerPanelProps } from "./DatepickerPanel";
export type { DatepickerPreset, DatepickerRange, WeekStart } from "./datepickerModel";
export {
  DEFAULT_DATEPICKER_PRESETS,
  datepickerPresets,
  YEARLESS_YEAR,
} from "./datepickerModel";

/** Text of a value as the field shows it (preset name, `labels.rangeValue`, time when needed). */
export function formatDatepickerValue(
  props: CalendarOptions &
    ({ mode: "range"; value: DatepickerRange } | { mode: "single"; value: Date | null }),
): string | null {
  const locale = props.locale ?? ru;
  const today = startOfDay(props.today ?? new Date());
  if (props.mode === "single") {
    if (!props.value) return null;
    if (props.yearless) return format(props.value, "d MMMM", { locale });
    const time = props.withTime ? ` ${formatTime(minutesOf(props.value))}` : "";
    return `${formatDayShort(startOfDay(props.value), today, locale)}${time}`;
  }
  const { from, to } = props.value;
  if (!to) return null;
  const fromDay = from ? startOfDay(from) : null;
  const lastDay = startOfDay(to);
  // Without `withTime` a range is whole days whatever clock time its dates carry.
  const wholeDays =
    !props.withTime ||
    ((from == null || minutesOf(from) === DAY_START_MINUTES) && minutesOf(to) === DAY_END_MINUTES);
  if (wholeDays && props.presets) {
    const preset = matchPreset(props.presets, fromDay, lastDay, today);
    if (preset) return preset.label;
  }
  const time = (d: Date) => (wholeDays ? "" : ` ${formatTime(minutesOf(d))}`);
  const toText = `${formatDayShort(lastDay, today, locale)}${time(to)}`;
  if (!from || !fromDay) return `${props.labels?.until ?? DATEPICKER_LABELS.until} ${toText}`;
  if (wholeDays && sameDay(fromDay, lastDay)) return formatDayShort(fromDay, today, locale);
  return formatLabel(props.labels?.rangeValue ?? DATEPICKER_LABELS.rangeValue, {
    from: `${formatDayShort(fromDay, today, locale)}${time(from)}`,
    to: toText,
  });
}

/**
 * A date as a form submits it, in local time: `yyyy-MM-dd`, with `withTime` `yyyy-MM-ddTHH:mm` —
 * never `toISOString()`, which shifts the day to UTC.
 */
export function formatDateValue(date: Date, { withTime = false }: { withTime?: boolean } = {}) {
  return format(date, withTime ? "yyyy-MM-dd'T'HH:mm" : "yyyy-MM-dd");
}

export type DatepickerRootProps = DatepickerPanelProps &
  FieldFrameProps & {
    size?: ControlSize;
    placeholder?: string;
    valuePrefix?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    fullWidth?: boolean;
    align?: PositionAlign;
    id?: string;
    name?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    children?: React.ReactNode;
  };

/** Form values of a `name`d field: one for a single date, `from` and `to` for a range. */
function formValues(
  value: { mode: "range"; value: DatepickerRange } | { mode: "single"; value: Date | null },
  withTime: boolean,
): string[] {
  const iso = (date: Date | null) => (date ? formatDateValue(date, { withTime }) : "");
  return value.mode === "range" ? [iso(value.value.from), iso(value.value.to)] : [iso(value.value)];
}

/** A field (field system: fill, tier height, rings) with the value; a click opens the panel in a popover. */
function DatepickerRoot(props: DatepickerRootProps) {
  const value = useDatepickerValue(props);
  const {
    mode,
    value: _value,
    defaultValue,
    onValueChange,
    resetValue,
    size: sizeProp,
    placeholder,
    valuePrefix,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    disabled: disabledProp = false,
    invalid: invalidProp,
    fullWidth = false,
    align = DEFAULT_ALIGN,
    id,
    name,
    label,
    required = false,
    optional,
    hint,
    hintTone,
    error,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    children,
    ...other
  } = props;
  // The trigger's leading glyph is a part: without `Datepicker.TriggerIcon` the field reads as a
  // select (value + chevron), as `Select.Trigger` without `Select.TriggerIcon`.
  const triggerIcon = splitParts(children, DatepickerTriggerIcon).parts[0] ?? null;
  const { options, rest } = splitCalendarOptions(other);
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(DATEPICKER_LABELS, options.labels);
  const ids = useFieldFrame(
    id,
    { label, hint, error, invalid: invalidProp, required },
    ariaDescribedBy,
  );
  const textId = `${ids.controlId}-value`;
  const [open, setOpen] = useOpenState({ open: openProp, defaultOpen, onOpenChange, disabled });
  const shown = formatDatepickerValue({ ...options, labels, ...value });
  const text = shown
    ? `${valuePrefix ? `${valuePrefix} ` : ""}${shown}`
    : (placeholder ?? labels.placeholder);
  const submitted = name ? formValues(value, Boolean(options.withTime)) : [];

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
      requiredLabel={labels.required}
      className={className}
    >
      <Popover.Root
        open={open}
        onOpenChange={setOpen}
        closeOnEscape={closeOnEscape}
        closeOnOutsideClick={closeOnOutsideClick}
        openOnArrow
      >
        <Popover.Trigger>
          <NativeButton
            id={ids.controlId}
            disabled={disabled}
            {...ids.controlAria({ role: "button", textId, text, ariaLabel, ariaLabelledBy })}
            aria-busy={value.saving || undefined}
            className={cx(fieldTriggerClass, styles.trigger)}
            {...toDataAttributes({
              size,
              empty: shown ? undefined : true,
              "full-width": fullWidth || undefined,
              invalid: ids.invalid || undefined,
              loading: value.saving || undefined,
              disabled: disabled || undefined,
            })}
          >
            {triggerIcon}
            <span id={textId} className={styles.triggerLabel}>
              {text}
            </span>
            {/* A value saving looks as in Select: a Spinner in place of the chevron. */}
            <span className={cx(styles.triggerIcon, styles.triggerChevron)} aria-hidden="true">
              <GlyphSwap>
                {value.saving ? <Spinner aria-hidden="true" /> : <ChevronDown />}
              </GlyphSwap>
            </span>
          </NativeButton>
        </Popover.Trigger>
        <Popover.Content align={align} size={size} width="content" trapFocus flush>
          <PanelView
            {...options}
            {...value}
            size={size}
            labels={labels}
            embedded={false}
            onDone={() => setOpen(false)}
          />
        </Popover.Content>
      </Popover.Root>
      {submitted.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a range always submits `from`, then `to`
        <input key={index} type="hidden" name={name} value={item} disabled={disabled} />
      ))}
    </FieldFrame>,
  );
}
DatepickerRoot.displayName = "Datepicker.Root";

export type DatepickerTriggerIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** A leading glyph in the field before the value (decorative): the calendar unless children give another. */
function DatepickerTriggerIcon({ className, children, ...rest }: DatepickerTriggerIconProps) {
  return (
    <span aria-hidden="true" {...rest} className={cx(styles.triggerIcon, className)}>
      {children ?? <Calendar />}
    </span>
  );
}
DatepickerTriggerIcon.displayName = "Datepicker.TriggerIcon";

export const Datepicker = {
  Root: DatepickerRoot,
  TriggerIcon: DatepickerTriggerIcon,
  Panel: DatepickerPanel,
};

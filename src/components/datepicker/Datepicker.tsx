import { format } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";

import { Popover } from "@/components/popover/Popover";
import { useControllableState } from "@/hooks/useControllableState";
import type { PositionAlign } from "@/hooks/usePosition";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { FieldFrame, type FieldFrameProps, useFieldFrame } from "@/internal/FieldFrame";
import type { ControlSize } from "@/internal/states";

import styles from "./Datepicker.module.css";
import {
  type CalendarOptions,
  DATEPICKER_LABELS,
  DatepickerPanel,
  type DatepickerPanelProps,
  InPopoverContext,
  PanelView,
  type RangeModeProps,
  type ResolvedValue,
  type SingleModeProps,
  useResolvedValue,
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
  toDay,
} from "./datepickerModel";
import { useContainScroll } from "./panelLayout";

export type { DatepickerLabels, DatepickerPanelProps } from "./DatepickerPanel";
export type { DatepickerPreset, DatepickerRange, WeekStart } from "./datepickerModel";
export {
  DEFAULT_DATEPICKER_PRESETS,
  datepickerPresets,
  YEARLESS_YEAR,
} from "./datepickerModel";

/** Field text of a value: a preset name, «6 окт — 3 нояб», with time when the bounds are not whole days. */
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
  return formatValue({ ...props, onChange: () => {} } as CalendarOptions & ResolvedValue);
}

export type DatepickerRootProps = DatepickerPanelProps &
  FieldFrameProps & {
    size?: ControlSize;
    /** Field text without a value; `labels.placeholder` by default. */
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
  };

/** A field (field system: fill, tier height, rings) with the value; a click opens the panel in a popover. */
function DatepickerRoot({
  mode,
  value: valueProp,
  defaultValue,
  onValueChange,
  resetValue,
  size = "m",
  placeholder,
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
  const [openState, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const open = openState && !disabled;
  const [panelNode, setPanelNode] = React.useState<HTMLDivElement | null>(null);
  useContainScroll(panelNode);
  const value = formatValue({ ...options, size, ...resolved });
  const text = value
    ? `${valuePrefix ? `${valuePrefix} ` : ""}${value}`
    : (placeholder ?? labels.placeholder);
  const hasLabel = label != null && label !== false;

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
                : (ariaLabelledBy ?? (hasLabel ? cx(ids.labelId, textId) : undefined))
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
            <Icon name="field.calendar" className={styles.triggerIcon} />
            <span id={textId} className={styles.triggerLabel}>
              {text}
            </span>
            <Icon
              name="nav.chevronDown"
              className={cx(styles.triggerIcon, styles.triggerChevron)}
            />
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
};

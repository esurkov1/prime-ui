import * as React from "react";
import { type Color, parseColor } from "react-aria-components";

import {
  COLOR_PICKER_LABELS,
  ColorPicker,
  type ColorPickerLabels,
} from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldTriggerClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { type ColorPreset, SwatchChip } from "@/internal/swatch";

import styles from "./ColorField.module.css";

export type ColorFieldLabels = ColorPickerLabels & {
  /** Muted marker after the label when `optional`. */
  optional: string;
  /** Accessible name of the preset swatches in the panel (`presets`). */
  presets: string;
};

export const COLOR_FIELD_LABELS: ColorFieldLabels = {
  ...COLOR_PICKER_LABELS,
  optional: "необязательно",
  presets: "Готовые цвета",
};

/** Black: the color shown when the value cannot be read and there is nothing earlier to keep. */
const FALLBACK_COLOR = "#000000";

export type ColorFieldProps = FieldRootDomProps &
  FieldFrameProps & {
    /** Controlled color: a CSS color string (hex, `rgb()`, `hsl()`). */
    value?: string;
    defaultValue?: string;
    /** Called with the new color as hex: `#RRGGBB`, or `#RRGGBBAA` when `alpha` lowers the opacity. */
    onValueChange?: (value: string) => void;
    /** Ready colors under the channels: `{ value, label }`, picked in one click. */
    presets?: readonly ColorPreset[];
    /** Adds the opacity slider; the value then carries alpha. */
    alpha?: boolean;
    /** Field tier; the panel uses the same tier. */
    size?: ControlSize;
    disabled?: boolean;
    /** Danger ring and `aria-invalid`; a non-empty `error` implies it. */
    invalid?: boolean;
    /** Form field name: a hidden input submits the hex value. */
    name?: string;
    /** Id of the field button; generated when omitted. */
    id?: string;
    /** Accessible name when there is no `label`; the current value is appended. */
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    labels?: Partial<ColorFieldLabels>;
  };

/** The color of a CSS string, or `fallback` when it cannot be read. */
function readColor(text: string, fallback: Color): Color {
  try {
    return parseColor(text);
  } catch {
    return fallback;
  }
}

/** Hex of a color: alpha only when the field takes it and the color is not opaque. */
function toHex(color: Color, alpha: boolean): string {
  return color.toString(alpha && color.getChannelValue("alpha") < 1 ? "hexa" : "hex");
}

/**
 * A color field: the field frame around a button with the color swatch and its hex; a click opens
 * the ColorPicker panel (area, hue, optional opacity, channels with the eyedropper, presets) in a
 * Popover.
 */
export function ColorField({
  value: valueProp,
  defaultValue = FALLBACK_COLOR,
  onValueChange,
  presets,
  alpha = false,
  size = "m",
  disabled: disabledProp = false,
  invalid: invalidProp,
  focusRing = true,
  name,
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
  labels: labelsProp,
  ...rest
}: ColorFieldProps) {
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(COLOR_FIELD_LABELS, labelsProp);
  const ids = useFieldFrame(id, { hint, error, invalid: invalidProp }, ariaDescribedBy);
  const textId = `${ids.controlId}-value`;
  const [open, setOpen] = React.useState(false);

  const [value, setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  // The picker edits a `Color` (it keeps the hue of a grey while dragging); the value is its hex.
  // A value from outside that is not the last one sent re-reads the color.
  const [color, setColor] = React.useState(() => readColor(value, parseColor(FALLBACK_COLOR)));
  const [synced, setSynced] = React.useState(value);
  if (value !== synced) {
    setSynced(value);
    setColor(readColor(value, color));
  }

  const changeColor = (next: Color) => {
    const hex = toHex(next, alpha);
    setColor(next);
    setSynced(hex);
    setValue(hex);
  };

  const text = toHex(color, alpha);
  const hasLabel = label != null && label !== false;

  return (
    <FieldFrame
      {...rest}
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
      <ColorPicker.Root
        value={color}
        onValueChange={changeColor}
        defaultFormat="hex"
        labels={labels}
      >
        <Popover.Root open={open && !disabled} onOpenChange={setOpen}>
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
              className={cx(fieldTriggerClass, styles.trigger)}
              {...toDataAttributes({
                size,
                invalid: ids.invalid || undefined,
                disabled: disabled || undefined,
                "focus-ring": focusRing ? undefined : false,
              })}
            >
              <SwatchChip value={color.toString("css")} className={styles.swatch} />
              <span id={textId} className={styles.value}>
                {text}
              </span>
              <Icon name="nav.chevronDown" className={styles.chevron} />
            </button>
          </Popover.Trigger>
          <Popover.Content size={size} trapFocus>
            <ColorPicker.Panel className={styles.panel}>
              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>
              <ColorPicker.Slider channel="hue" colorSpace="hsl" aria-label={labels.hue}>
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
              {alpha ? (
                <ColorPicker.Slider channel="alpha" aria-label={labels.alpha}>
                  <ColorPicker.SliderTrack>
                    <ColorPicker.Thumb />
                  </ColorPicker.SliderTrack>
                </ColorPicker.Slider>
              ) : null}
              <ColorPicker.ChannelStrip />
              {presets?.length ? (
                <ColorPicker.Swatches aria-label={labels.presets} presets={presets} />
              ) : null}
            </ColorPicker.Panel>
          </Popover.Content>
        </Popover.Root>
      </ColorPicker.Root>
      {name ? <input type="hidden" name={name} value={text} disabled={disabled} /> : null}
    </FieldFrame>
  );
}
ColorField.displayName = "ColorField";

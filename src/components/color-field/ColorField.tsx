import * as React from "react";
import type { Color } from "react-aria-components";

import {
  COLOR_PICKER_LABELS,
  ColorPicker,
  type ColorPickerLabels,
  parseHex,
  toHexText,
} from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import {
  type FieldFocusRingProps,
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { fieldTriggerClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import { useOpenState } from "@/internal/overlay/useOpenState";
import type { ControlSize } from "@/internal/states";
import type { ColorPreset } from "@/internal/swatch";

import styles from "./ColorField.module.css";

/** The picker strings the field's panel shows: the sliders and the channel strip. */
type PanelLabelKey =
  | "eyeDropper"
  | "hex"
  | "hue"
  | "saturation"
  | "lightness"
  | "alpha"
  | "red"
  | "green"
  | "blue";

export type ColorFieldLabels = Pick<ColorPickerLabels, PanelLabelKey> & {
  /** Muted marker after the label when `optional`. */
  optional: string;
  /** Read after the field name of a `required` field (its trigger is a button). */
  required: string;
  /** Accessible name of the preset swatches in the panel (`presets`). */
  presets: string;
};

export const COLOR_FIELD_LABELS: ColorFieldLabels = {
  eyeDropper: COLOR_PICKER_LABELS.eyeDropper,
  hex: COLOR_PICKER_LABELS.hex,
  hue: COLOR_PICKER_LABELS.hue,
  saturation: COLOR_PICKER_LABELS.saturation,
  lightness: COLOR_PICKER_LABELS.lightness,
  alpha: COLOR_PICKER_LABELS.alpha,
  red: COLOR_PICKER_LABELS.red,
  green: COLOR_PICKER_LABELS.green,
  blue: COLOR_PICKER_LABELS.blue,
  optional: "необязательно",
  required: "обязательное поле",
  presets: "Готовые цвета",
};

/** Black: the color shown when the value cannot be read and there is nothing earlier to keep. */
const FALLBACK_COLOR = "#000000";

export type ColorFieldProps = FieldRootDomProps &
  FieldFrameProps &
  FieldFocusRingProps & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    presets?: readonly ColorPreset[];
    alpha?: boolean;
    size?: ControlSize;
    disabled?: boolean;
    invalid?: boolean;
    name?: string;
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    labels?: Partial<ColorFieldLabels>;
  };

/** Hex of a color: alpha only when the field takes it and the color is not opaque. */
const toHex = (color: Color, alpha: boolean) =>
  toHexText(alpha ? color : color.withChannelValue("alpha", 1));

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
  size: sizeProp,
  disabled: disabledProp = false,
  invalid: invalidProp,
  focusRing,
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
  const tier = useHostTier(sizeProp);
  const { size } = tier;
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(COLOR_FIELD_LABELS, labelsProp);
  const ids = useFieldFrame(
    id,
    { label, hint, error, invalid: invalidProp, required },
    ariaDescribedBy,
  );
  const textId = `${ids.controlId}-value`;
  const [open, setOpen] = useOpenState({ disabled });

  const [value, setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  // The picker edits a `Color` (it keeps the hue of a grey while dragging); the value is its hex.
  // A value from outside that is not the last one sent re-reads the color.
  const [color, setColor] = React.useState(
    () => parseHex(value) ?? (parseHex(FALLBACK_COLOR) as Color),
  );
  const [synced, setSynced] = React.useState(value);
  if (value !== synced) {
    setSynced(value);
    setColor(parseHex(value) ?? color);
  }

  const changeColor = (next: Color) => {
    const hex = toHex(next, alpha);
    setColor(next);
    setSynced(hex);
    setValue(hex);
  };

  const text = toHex(color, alpha);

  return tier.provide(
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
      requiredLabel={labels.required}
      className={className}
    >
      <ColorPicker.Root
        value={color}
        onValueChange={changeColor}
        defaultFormat="hex"
        labels={labels}
      >
        <Popover.Root open={open} onOpenChange={setOpen} openOnArrow>
          <Popover.Trigger>
            <button
              id={ids.controlId}
              type="button"
              disabled={disabled}
              {...ids.controlAria({ role: "button", textId, text, ariaLabel, ariaLabelledBy })}
              className={cx(fieldTriggerClass, styles.trigger)}
              {...toDataAttributes({
                size,
                invalid: ids.invalid || undefined,
                disabled: disabled || undefined,
                "focus-ring": focusRing,
              })}
            >
              <ColorPicker.TriggerSwatch className={styles.swatch} />
              <span id={textId} className={styles.value}>
                {text}
              </span>
              <Icon name="nav.chevronDown" className={styles.chevron} />
            </button>
          </Popover.Trigger>
          <Popover.Content size={size} trapFocus>
            <ColorPicker.Panel className={styles.panel}>
              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.Thumb />
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
    </FieldFrame>,
  );
}
ColorField.displayName = "ColorField";

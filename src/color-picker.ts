/**
 * `prime-ui-kit/color-picker` — the full ColorPicker, the only part of the kit built on
 * `react-aria-components` (an optional peer). Kept out of the main entry so apps without a color
 * picker never load it. `ColorPresets` and `ColorSwatches` stay in the main entry.
 */
export type {
  ColorPickerAreaProps,
  ColorPickerChannelStripProps,
  ColorPickerColorValue,
  ColorPickerEyeDropperButtonProps,
  ColorPickerFormatSelectProps,
  ColorPickerHexInputProps,
  ColorPickerLabels,
  ColorPickerPanelProps,
  ColorPickerRootProps,
  ColorPickerSliderMetaProps,
  ColorPickerSliderProps,
  ColorPickerSliderTrackProps,
  ColorPickerSwatchesProps,
  ColorPickerThumbProps,
  ColorPickerTriggerSwatchProps,
  ColorValueFormat,
} from "./components/color-picker/ColorPicker";
export { ColorPicker, parseColor } from "./components/color-picker/ColorPicker";

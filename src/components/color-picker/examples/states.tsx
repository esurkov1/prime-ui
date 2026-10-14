/** A disabled area, hue slider and preset trigger keep showing the color but take no input — `disabled`. */
import { ColorPresets, Typography } from "prime-ui-kit";
import { ColorPicker } from "prime-ui-kit/color-picker";

export default function ColorPickerStatesExample() {
  return (
    <div>
      <div>
        <ColorPicker.Root defaultValue="#30a46c">
          <ColorPicker.Panel>
            <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness" disabled>
              <ColorPicker.Thumb />
            </ColorPicker.Area>
            <ColorPicker.Slider channel="hue" colorSpace="hsl" disabled>
              <ColorPicker.SliderMeta label="disabled" />
              <ColorPicker.SliderTrack>
                <ColorPicker.Thumb />
              </ColorPicker.SliderTrack>
            </ColorPicker.Slider>
          </ColorPicker.Panel>
        </ColorPicker.Root>
      </div>
      <div>
        <ColorPresets.Root disabled defaultValue="#22c55e" labels={{ trigger: "Цвет метки" }}>
          <ColorPresets.Trigger>
            <ColorPresets.SwatchButton />
          </ColorPresets.Trigger>
          <ColorPresets.Content />
        </ColorPresets.Root>
        <Typography as="span" variant="caption" tone="muted">
          disabled
        </Typography>
      </div>
    </div>
  );
}

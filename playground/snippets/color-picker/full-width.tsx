import { Pipette } from "lucide-react";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
import { cx } from "@/internal/cx";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

export default function ColorPickerFullWidthSnippet() {
  return (
    <ColorPicker.Root defaultValue="hsl(30, 85%, 52%)">
      <ColorPicker.FormatProvider>
        <ExampleSurface className={cx(preview.card, preview.fullWidthStretch)}>
          <div className={preview.formatRow}>
            <ColorPicker.FormatSelect />
          </div>
          <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
            <ColorPicker.AreaThumb />
          </ColorPicker.Area>
          <ColorPicker.Slider channel="hue" colorSpace="hsl">
            <ColorPicker.SliderTrack>
              <ColorPicker.Thumb />
            </ColorPicker.SliderTrack>
          </ColorPicker.Slider>
          <ColorPicker.ChannelStrip
            pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
          />
        </ExampleSurface>
      </ColorPicker.FormatProvider>
    </ColorPicker.Root>
  );
}

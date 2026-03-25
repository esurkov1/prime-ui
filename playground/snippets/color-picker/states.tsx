import { Pipette } from "lucide-react";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

const PRESETS = ["#ef4444", "#22c55e", "#3b82f6"];

export default function ColorPickerStatesSnippet() {
  return (
    <ExampleSurface className={preview.stateRow}>
      <div>
        <p className={preview.stateCaption}>Пресет с isDisabled</p>
        <ColorPicker.Root defaultValue="#22c55e">
          <ColorPicker.FormatProvider>
            <ColorPicker.SwatchPicker aria-label="Палитра с недоступным цветом">
              {PRESETS.map((c, i) => (
                <ColorPicker.SwatchPickerItem key={c} color={c} isDisabled={i === 0}>
                  <ColorPicker.Swatch />
                </ColorPicker.SwatchPickerItem>
              ))}
            </ColorPicker.SwatchPicker>
          </ColorPicker.FormatProvider>
        </ColorPicker.Root>
      </div>
      <div>
        <p className={preview.stateCaption}>Слайдер оттенка с isDisabled</p>
        <ColorPicker.Root defaultValue="hsl(200, 75%, 52%)">
          <ColorPicker.FormatProvider>
            <div className={preview.miniPicker}>
              <ColorPicker.Slider channel="hue" colorSpace="hsl" isDisabled>
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
              <ColorPicker.ChannelStrip
                pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
              />
            </div>
          </ColorPicker.FormatProvider>
        </ColorPicker.Root>
      </div>
    </ExampleSurface>
  );
}

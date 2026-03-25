import { Pipette } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

const PRESETS = ["#ef4444", "#22c55e", "#3b82f6"];

export default function ColorPickerStatesSnippet() {
  const [openSwatch, setOpenSwatch] = React.useState(false);
  const [openSlider, setOpenSlider] = React.useState(false);

  return (
    <ExampleSurface className={preview.stateRow}>
      <div>
        <p className={preview.stateCaption}>Пресет с isDisabled</p>
        <ColorPicker.Root defaultValue="#22c55e">
          <Popover.Root open={openSwatch} onOpenChange={setOpenSwatch}>
            <Popover.Trigger asChild>
              <Button.Root mode="stroke" size="m" variant="neutral">
                <ColorPicker.TriggerSwatch className={preview.popoverTriggerSwatch} />
                Палитра
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content align="start" side="bottom">
              <Popover.Inset padding="x2" gap="x3">
                <ColorPicker.FormatProvider>
                  <ColorPicker.SwatchPicker aria-label="Палитра с недоступным цветом">
                    {PRESETS.map((c, i) => (
                      <ColorPicker.SwatchPickerItem key={c} color={c} isDisabled={i === 0}>
                        <ColorPicker.Swatch />
                      </ColorPicker.SwatchPickerItem>
                    ))}
                  </ColorPicker.SwatchPicker>
                </ColorPicker.FormatProvider>
              </Popover.Inset>
            </Popover.Content>
          </Popover.Root>
        </ColorPicker.Root>
      </div>
      <div>
        <p className={preview.stateCaption}>Слайдер оттенка с isDisabled</p>
        <ColorPicker.Root defaultValue="hsl(200, 75%, 52%)">
          <Popover.Root open={openSlider} onOpenChange={setOpenSlider}>
            <Popover.Trigger asChild>
              <Button.Root mode="stroke" size="m" variant="neutral">
                <ColorPicker.TriggerSwatch className={preview.popoverTriggerSwatch} />
                Слайдер disabled
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content align="start" side="bottom">
              <Popover.Inset padding="x2" gap="x3">
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
              </Popover.Inset>
            </Popover.Content>
          </Popover.Root>
        </ColorPicker.Root>
      </div>
    </ExampleSurface>
  );
}

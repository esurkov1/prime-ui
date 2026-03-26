import { Pipette } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import {
  ColorPicker,
  type ColorPickerColorValue,
  parseColor,
} from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";

import preview from "./preview.module.css";

const PRESETS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#8b5cf6"];

export default function ColorPickerPopoverSnippet() {
  const [color, setColor] = React.useState<ColorPickerColorValue | undefined>(
    parseColor("#3b82f6"),
  );
  const [open, setOpen] = React.useState(false);

  const handleColorChange = (newColor: ColorPickerColorValue) => {
    setColor(newColor);
  };

  const colorString = color?.toString("css") ?? "#000000";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          <span
            className={preview.triggerColorReadoutSwatch}
            style={{ backgroundColor: colorString }}
          />
          {colorString}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
        <ColorPicker.Root value={color} onChange={handleColorChange}>
          <ColorPicker.FormatProvider>
            <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
              <ColorPicker.AreaThumb />
            </ColorPicker.Area>

            <ColorPicker.Slider channel="hue" colorSpace="hsl">
              <ColorPicker.SliderTrack>
                <ColorPicker.Thumb />
              </ColorPicker.SliderTrack>
            </ColorPicker.Slider>

            <ColorPicker.Slider channel="alpha">
              <ColorPicker.SliderTrack>
                <ColorPicker.Thumb />
              </ColorPicker.SliderTrack>
            </ColorPicker.Slider>

            <ColorPicker.ChannelStrip
              pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
            />

            <ColorPicker.SwatchPicker aria-label="Быстрые цвета">
              {PRESETS.map((c) => (
                <ColorPicker.SwatchPickerItem key={c} color={c}>
                  <ColorPicker.Swatch />
                </ColorPicker.SwatchPickerItem>
              ))}
            </ColorPicker.SwatchPicker>
          </ColorPicker.FormatProvider>
        </ColorPicker.Root>
      </Popover.Content>
    </Popover.Root>
  );
}

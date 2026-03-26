import { Pipette } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import { cx } from "@/internal/cx";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

export default function ColorPickerFullWidthSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <ColorPicker.Root defaultValue="hsl(30, 85%, 52%)">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            <ColorPicker.TriggerSwatch className={preview.popoverTriggerSwatch} />
            Панель на всю ширину
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content
          align="start"
          className="min-w-[min(100vw-2rem,28rem)]"
          insetGap="x3"
          insetPadding="x2"
          side="bottom"
        >
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
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

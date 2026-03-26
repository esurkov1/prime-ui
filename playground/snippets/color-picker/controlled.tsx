import { Pipette } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ColorPicker, parseColor } from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import { Typography } from "@/components/typography/Typography";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

export default function ColorPickerControlledSnippet() {
  const [color, setColor] = React.useState(() => parseColor("hsl(220, 90%, 56%)"));
  const [open, setOpen] = React.useState(false);

  return (
    <ExampleSurface className={preview.card}>
      <Typography.Root
        as="p"
        className={preview.controlledReadout}
        variant="body-small"
        tone="muted"
      >
        Текущее значение (CSS): <code className={preview.monoCode}>{color.toString("css")}</code>
      </Typography.Root>
      <ColorPicker.Root value={color} onChange={setColor}>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" size="m" variant="neutral">
              <ColorPicker.TriggerSwatch className={preview.popoverTriggerSwatch} />
              Изменить цвет
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom">
            <Popover.Inset padding="x2" gap="x3">
              <ColorPicker.FormatProvider>
                <div className={preview.formatRow}>
                  <ColorPicker.FormatSelect />
                </div>
                <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                  <ColorPicker.AreaThumb />
                </ColorPicker.Area>
                <ColorPicker.Slider channel="hue" colorSpace="hsl">
                  <ColorPicker.SliderMeta label="Оттенок" />
                  <ColorPicker.SliderTrack>
                    <ColorPicker.Thumb />
                  </ColorPicker.SliderTrack>
                </ColorPicker.Slider>
                <ColorPicker.ChannelStrip
                  pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
                />
              </ColorPicker.FormatProvider>
            </Popover.Inset>
          </Popover.Content>
        </Popover.Root>
      </ColorPicker.Root>
    </ExampleSurface>
  );
}

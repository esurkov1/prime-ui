import { Pipette } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import { Typography } from "@/components/typography/Typography";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export default function ColorPickerCompositionSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <ColorPicker.Root defaultValue="hsl(220, 90%, 56%)">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            <ColorPicker.TriggerSwatch className={preview.popoverTriggerSwatch} />
            Полная панель
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <Popover.Inset padding="x2" gap="x3">
            <ColorPicker.FormatProvider>
              <ExampleSurface className={preview.card}>
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

                <ColorPicker.Slider channel="alpha">
                  <ColorPicker.SliderMeta label="Непрозрачность" />
                  <ColorPicker.SliderTrack>
                    <ColorPicker.Thumb />
                  </ColorPicker.SliderTrack>
                </ColorPicker.Slider>

                <ColorPicker.ChannelStrip
                  pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
                />

                <hr className={preview.divider} />

                <Typography.Root
                  as="p"
                  className={preview.sectionLabel}
                  variant="body-small"
                  weight="medium"
                  tone="muted"
                >
                  Рекомендуемые цвета
                </Typography.Root>

                <ColorPicker.SwatchPicker aria-label="Палитра пресетов">
                  {PRESETS.map((c) => (
                    <ColorPicker.SwatchPickerItem key={c} color={c}>
                      <ColorPicker.Swatch />
                    </ColorPicker.SwatchPickerItem>
                  ))}
                </ColorPicker.SwatchPicker>
              </ExampleSurface>
            </ColorPicker.FormatProvider>
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

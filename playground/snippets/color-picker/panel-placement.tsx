import { Pipette } from "lucide-react";
import { Button } from "@/components/button/Button";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import { Typography } from "@/components/typography/Typography";

import preview from "./preview.module.css";

const PRESETS = ["#6366f1", "#a855f7", "#ec4899", "#f97316"];

function Panel() {
  return (
    <ColorPicker.FormatProvider>
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
      <Typography.Root
        as="p"
        className={preview.sectionLabel}
        variant="body-small"
        weight="medium"
        tone="muted"
      >
        Пресеты
      </Typography.Root>
      <ColorPicker.SwatchPicker aria-label="Быстрые цвета">
        {PRESETS.map((c) => (
          <ColorPicker.SwatchPickerItem key={c} color={c}>
            <ColorPicker.Swatch />
          </ColorPicker.SwatchPickerItem>
        ))}
      </ColorPicker.SwatchPicker>
    </ColorPicker.FormatProvider>
  );
}

export default function ColorPickerPanelPlacementSnippet() {
  return (
    <div className={preview.placementRow}>
      <ColorPicker.Root defaultValue="hsl(265, 80%, 55%)">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button.Root
              className={preview.popoverPickerTrigger}
              mode="stroke"
              size="m"
              variant="neutral"
            >
              <ColorPicker.TriggerSwatch className={preview.popoverTriggerSwatch} />
              Снизу
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content
            align="start"
            className={preview.popoverPickerContent}
            insetGap="x3"
            insetPadding="x2"
            side="bottom"
          >
            <Panel />
          </Popover.Content>
        </Popover.Root>
      </ColorPicker.Root>

      <ColorPicker.Root defaultValue="hsl(200, 70%, 48%)">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button.Root
              className={preview.popoverPickerTrigger}
              mode="stroke"
              size="m"
              variant="neutral"
            >
              <ColorPicker.TriggerSwatch className={preview.popoverTriggerSwatch} />
              Сверху
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content
            align="start"
            className={preview.popoverPickerContent}
            insetGap="x3"
            insetPadding="x2"
            side="top"
          >
            <Panel />
          </Popover.Content>
        </Popover.Root>
      </ColorPicker.Root>
    </div>
  );
}

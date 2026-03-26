import { Pipette } from "lucide-react";
import * as React from "react";
import { Input as RacInput } from "react-aria-components";

import { Button } from "@/components/button/Button";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import { Typography } from "@/components/typography/Typography";

import preview from "./preview.module.css";

export default function ColorPickerFeaturesSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <ColorPicker.Root defaultValue="hsl(340, 82%, 52%)">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            <ColorPicker.TriggerSwatch className={preview.popoverTriggerSwatch} />
            Field + пипетка
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
          <ColorPicker.FormatProvider>
            <div className={preview.fieldPopoverPanel}>
              <Typography.Root
                as="p"
                className={preview.sectionLabel}
                variant="body-small"
                weight="medium"
                tone="muted"
              >
                Поле цвета (ColorField и встроенный Input из react-aria-components): ввод hex
                вручную
              </Typography.Root>
              <div className={preview.fieldRow}>
                <ColorPicker.Field
                  aria-label="Шестнадцатеричный код цвета"
                  className={preview.fieldGrow}
                >
                  <RacInput />
                </ColorPicker.Field>
                <ColorPicker.EyeDropperButton aria-label="Пипетка">
                  <Button.Icon>
                    <Pipette aria-hidden size={18} strokeWidth={1.75} />
                  </Button.Icon>
                </ColorPicker.EyeDropperButton>
              </div>

              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>

              <ColorPicker.Slider channel="hue" colorSpace="hsl">
                <ColorPicker.SliderMeta label="Оттенок, °" />
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
            </div>
          </ColorPicker.FormatProvider>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

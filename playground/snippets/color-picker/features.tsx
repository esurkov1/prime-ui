import { Pipette } from "lucide-react";
import { Input as RacInput } from "react-aria-components";
import { Button } from "@/components/button/Button";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
import { Typography } from "@/components/typography/Typography";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

export default function ColorPickerFeaturesSnippet() {
  return (
    <ColorPicker.Root defaultValue="hsl(340, 82%, 52%)">
      <ColorPicker.FormatProvider>
        <ExampleSurface className={preview.card}>
          <Typography.Root
            as="p"
            className={preview.sectionLabel}
            size="s"
            weight="medium"
            tone="muted"
          >
            Поле цвета (ColorField и встроенный Input из react-aria-components): ввод hex вручную
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
        </ExampleSurface>
      </ColorPicker.FormatProvider>
    </ColorPicker.Root>
  );
}

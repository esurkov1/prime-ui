import { Pipette } from "lucide-react";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
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
  return (
    <ColorPicker.Root defaultValue="hsl(220, 90%, 56%)">
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
            size="s"
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
    </ColorPicker.Root>
  );
}

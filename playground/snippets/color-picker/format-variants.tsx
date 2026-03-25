import { Pipette } from "lucide-react";
import { ColorPicker, type ColorValueFormat } from "@/components/color-picker/ColorPicker";
import { Typography } from "@/components/typography/Typography";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

function FormatColumn({
  title,
  defaultFormat,
}: {
  title: string;
  defaultFormat: ColorValueFormat;
}) {
  return (
    <div className={preview.formatColumn}>
      <Typography.Root as="p" className={preview.formatColumnTitle} size="s" weight="medium">
        {title}
      </Typography.Root>
      <ColorPicker.Root defaultValue="hsl(200, 75%, 52%)">
        <ColorPicker.FormatProvider defaultFormat={defaultFormat}>
          <div className={preview.formatRow}>
            <ColorPicker.FormatSelect />
          </div>
          <ColorPicker.ChannelStrip
            pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
          />
        </ColorPicker.FormatProvider>
      </ColorPicker.Root>
    </div>
  );
}

export default function ColorPickerFormatVariantsSnippet() {
  return (
    <ExampleSurface className={preview.formatGrid}>
      <FormatColumn defaultFormat="hsl" title="HSL: оттенок, S, L, альфа" />
      <FormatColumn defaultFormat="rgb" title="RGB: R, G, B, альфа" />
      <FormatColumn defaultFormat="hex" title="Hex: одно поле #RRGGBB" />
    </ExampleSurface>
  );
}

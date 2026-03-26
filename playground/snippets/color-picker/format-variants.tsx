import { Pipette } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ColorPicker, type ColorValueFormat } from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import { Typography } from "@/components/typography/Typography";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

function FormatPopover({
  title,
  defaultFormat,
}: {
  title: string;
  defaultFormat: ColorValueFormat;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={preview.formatColumn}>
      <Typography.Root
        as="p"
        className={preview.formatColumnTitle}
        variant="body-small"
        weight="medium"
      >
        {title}
      </Typography.Root>
      <ColorPicker.Root defaultValue="hsl(200, 75%, 52%)">
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" size="m" variant="neutral">
              <ColorPicker.TriggerSwatch className={preview.popoverTriggerSwatch} />
              Открыть ({defaultFormat.toUpperCase()})
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
            <ColorPicker.FormatProvider defaultFormat={defaultFormat}>
              <div className={preview.formatRow}>
                <ColorPicker.FormatSelect />
              </div>
              <ColorPicker.ChannelStrip
                pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
              />
            </ColorPicker.FormatProvider>
          </Popover.Content>
        </Popover.Root>
      </ColorPicker.Root>
    </div>
  );
}

export default function ColorPickerFormatVariantsSnippet() {
  return (
    <ExampleSurface className={preview.formatGrid}>
      <FormatPopover defaultFormat="hsl" title="HSL: оттенок, S, L, альфа" />
      <FormatPopover defaultFormat="rgb" title="RGB: R, G, B, альфа" />
      <FormatPopover defaultFormat="hex" title="Hex: одно поле #RRGGBB" />
    </ExampleSurface>
  );
}

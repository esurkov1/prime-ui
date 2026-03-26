import { Button, ColorPicker, Popover } from "prime-ui-kit";
import * as React from "react";

const VARIANTS = [
  { id: "midnight", color: "#0c0a09" },
  { id: "clay", color: "#c2410c" },
  { id: "sage", color: "#4d7c0f" },
  { id: "mist", color: "#94a3b8" },
];

/** E-commerce variant color: fast swatch selection; optional fine tuning in the same root. */
export function ProductVariantSwatchExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <ColorPicker.Root defaultValue={VARIANTS[0]?.color ?? "#000000"}>
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            <ColorPicker.TriggerSwatch />
            Color
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
          <ColorPicker.FormatProvider defaultFormat="hex">
            <ColorPicker.SwatchPicker aria-label="Product color">
              {VARIANTS.map((v) => (
                <ColorPicker.SwatchPickerItem color={v.color} key={v.id}>
                  <ColorPicker.Swatch />
                </ColorPicker.SwatchPickerItem>
              ))}
            </ColorPicker.SwatchPicker>
            <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
              <ColorPicker.AreaThumb />
            </ColorPicker.Area>
            <ColorPicker.ChannelStrip pipetteIcon={<span aria-hidden />} />
          </ColorPicker.FormatProvider>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

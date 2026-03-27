import { Button, ColorPicker, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

const BRAND_PRESETS = ["#0f172a", "#1d4ed8", "#0369a1", "#15803d", "#b45309", "#be123c"];

/** Brand kit: fixed palette plus free adjustment — map presets to design tokens or CMS entries. */
export function BrandKitExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <ColorPicker.Root defaultValue="#1d4ed8">
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" variant="neutral">
            <ColorPicker.TriggerSwatch />
            Brand color
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <ColorPicker.FormatProvider>
            <ColorPicker.FormatSelect />
            <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
              <ColorPicker.AreaThumb />
            </ColorPicker.Area>
            <ColorPicker.Slider channel="hue" colorSpace="hsl">
              <ColorPicker.SliderMeta label="Hue" />
              <ColorPicker.SliderTrack>
                <ColorPicker.Thumb />
              </ColorPicker.SliderTrack>
            </ColorPicker.Slider>
            <ColorPicker.ChannelStrip pipetteIcon={<span aria-hidden />} />
            <Typography.Root as="p" tone="muted" variant="body-small" weight="medium">
              Brand presets
            </Typography.Root>
            <ColorPicker.SwatchPicker aria-label="Brand color presets">
              {BRAND_PRESETS.map((c) => (
                <ColorPicker.SwatchPickerItem color={c} key={c}>
                  <ColorPicker.Swatch />
                </ColorPicker.SwatchPickerItem>
              ))}
            </ColorPicker.SwatchPicker>
            <ColorPicker.HexInput label="Hex" />
          </ColorPicker.FormatProvider>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

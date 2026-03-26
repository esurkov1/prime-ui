import { Button, ColorPicker, Popover, parseColor, Typography } from "prime-ui-kit";
import * as React from "react";

/** Controlled accent: persist `color.toString("hex")` / `"css"` to your theme layer or API. */
export function ThemeAccentExample() {
  const [color, setColor] = React.useState(() => parseColor("hsl(220, 90%, 56%)"));
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Typography.Root as="p" variant="body-small" tone="muted">
        Accent (CSS): {color.toString("css")}
      </Typography.Root>
      <ColorPicker.Root value={color} onChange={setColor}>
        <Popover.Root onOpenChange={setOpen} open={open}>
          <Popover.Trigger asChild>
            <Button.Root
              aria-label="Choose theme accent color"
              mode="stroke"
              size="m"
              variant="neutral"
            >
              <ColorPicker.TriggerSwatch />
              Accent
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
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
            </ColorPicker.FormatProvider>
          </Popover.Content>
        </Popover.Root>
      </ColorPicker.Root>
    </div>
  );
}

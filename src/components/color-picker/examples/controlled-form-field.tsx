import { Button, ColorPicker, Label, Popover, parseColor } from "prime-ui-kit";
import * as React from "react";

/** Form-friendly: parent owns string/Color state; popover for visual pick, HexInput for exact entry. */
export function ControlledFormFieldExample() {
  const [color, setColor] = React.useState(() => parseColor("#3b82f6"));
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Label.Root htmlFor="product-color-trigger" size="m">
        Product color
      </Label.Root>
      <ColorPicker.Root onChange={setColor} value={color}>
        <Popover.Root onOpenChange={setOpen} open={open}>
          <Popover.Trigger asChild>
            <Button.Root id="product-color-trigger" mode="stroke" size="m" variant="neutral">
              <ColorPicker.TriggerSwatch />
              Pick
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
            <ColorPicker.FormatProvider>
              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>
              <ColorPicker.Slider channel="hue" colorSpace="hsl">
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
              <ColorPicker.ChannelStrip pipetteIcon={<span aria-hidden />} />
            </ColorPicker.FormatProvider>
          </Popover.Content>
        </Popover.Root>
        <ColorPicker.HexInput label="Hex value" size="m" />
      </ColorPicker.Root>
    </div>
  );
}

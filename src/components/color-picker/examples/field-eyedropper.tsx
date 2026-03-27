import { Pipette } from "lucide-react";
import { Button, ColorPicker, Popover, Typography } from "prime-ui-kit";
import * as React from "react";
import { Input as RacInput } from "react-aria-components";

/** RAC `ColorPicker.Field` + `EyeDropperButton`, area and hue slider (playground `features`). */
export function FieldEyedropperExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <ColorPicker.Root defaultValue="hsl(340, 82%, 52%)">
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" variant="neutral">
            <ColorPicker.TriggerSwatch />
            Field + eyedropper
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <div style={{ width: "19.5rem", maxWidth: "100%", minWidth: 0 }}>
            <ColorPicker.FormatProvider>
              <Typography.Root as="p" tone="muted" variant="body-small" weight="medium">
                Hex via ColorField + RAC Input; eyedropper uses Web API when available.
              </Typography.Root>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--prime-sys-spacing-x2, 0.5rem)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ColorPicker.Field aria-label="Hex color code">
                    <RacInput />
                  </ColorPicker.Field>
                </div>
                <ColorPicker.EyeDropperButton aria-label="Eyedropper">
                  <Button.Icon>
                    <Pipette aria-hidden size={18} strokeWidth={1.75} />
                  </Button.Icon>
                </ColorPicker.EyeDropperButton>
              </div>
              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>
              <ColorPicker.Slider channel="hue" colorSpace="hsl">
                <ColorPicker.SliderMeta label="Hue, °" />
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
            </ColorPicker.FormatProvider>
          </div>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

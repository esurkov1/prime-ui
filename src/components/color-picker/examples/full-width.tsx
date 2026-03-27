import { Pipette } from "lucide-react";
import { Button, ColorPicker, Popover } from "prime-ui-kit";
import * as React from "react";

/** Wide `Popover.Content` and inner surface stretched to full width (playground `full-width`). */
export function FullWidthPanelExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <ColorPicker.Root defaultValue="hsl(30, 85%, 52%)">
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            <ColorPicker.TriggerSwatch />
            Full-width panel
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
          <div style={{ minWidth: "min(100vw - 2rem, 28rem)" }}>
            <ColorPicker.FormatProvider>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  maxWidth: "min(28rem, 100%)",
                  flexDirection: "column",
                  gap: "var(--prime-sys-spacing-x3, 0.75rem)",
                }}
              >
                <ColorPicker.FormatSelect />
                <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                  <ColorPicker.AreaThumb />
                </ColorPicker.Area>
                <ColorPicker.Slider channel="hue" colorSpace="hsl">
                  <ColorPicker.SliderTrack>
                    <ColorPicker.Thumb />
                  </ColorPicker.SliderTrack>
                </ColorPicker.Slider>
                <ColorPicker.ChannelStrip
                  pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
                />
              </div>
            </ColorPicker.FormatProvider>
          </div>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

import { Pipette } from "lucide-react";
import { Button, ColorPicker, Popover } from "prime-ui-kit";
import * as React from "react";

const PRESETS = ["#ef4444", "#22c55e", "#3b82f6"];

/** Disabled `SwatchPickerItem` and disabled hue `Slider` (playground `states`). */
export function StatesExample() {
  const [openSwatch, setOpenSwatch] = React.useState(false);
  const [openSlider, setOpenSlider] = React.useState(false);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-start" }}>
      <div>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", opacity: 0.8 }}>
          Preset with isDisabled
        </p>
        <ColorPicker.Root defaultValue="#22c55e">
          <Popover.Root onOpenChange={setOpenSwatch} open={openSwatch}>
            <Popover.Trigger asChild>
              <Button.Root mode="stroke" size="m" variant="neutral">
                <ColorPicker.TriggerSwatch />
                Palette
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
              <ColorPicker.FormatProvider>
                <ColorPicker.SwatchPicker aria-label="Palette with one disabled swatch">
                  {PRESETS.map((c, i) => (
                    <ColorPicker.SwatchPickerItem key={c} color={c} isDisabled={i === 0}>
                      <ColorPicker.Swatch />
                    </ColorPicker.SwatchPickerItem>
                  ))}
                </ColorPicker.SwatchPicker>
              </ColorPicker.FormatProvider>
            </Popover.Content>
          </Popover.Root>
        </ColorPicker.Root>
      </div>
      <div>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", opacity: 0.8 }}>
          Hue slider with isDisabled
        </p>
        <ColorPicker.Root defaultValue="hsl(200, 75%, 52%)">
          <Popover.Root onOpenChange={setOpenSlider} open={openSlider}>
            <Popover.Trigger asChild>
              <Button.Root mode="stroke" size="m" variant="neutral">
                <ColorPicker.TriggerSwatch />
                Disabled slider
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
              <ColorPicker.FormatProvider>
                <div
                  style={{
                    display: "flex",
                    width: "12.5rem",
                    maxWidth: "100%",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <ColorPicker.Slider channel="hue" colorSpace="hsl" isDisabled>
                    <ColorPicker.SliderTrack>
                      <ColorPicker.Thumb />
                    </ColorPicker.SliderTrack>
                  </ColorPicker.Slider>
                  <ColorPicker.ChannelStrip
                    pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
                  />
                </div>
              </ColorPicker.FormatProvider>
            </Popover.Content>
          </Popover.Root>
        </ColorPicker.Root>
      </div>
    </div>
  );
}

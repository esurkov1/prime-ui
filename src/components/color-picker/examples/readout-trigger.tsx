import { Pipette } from "lucide-react";
import { Button, ColorPicker, type ColorPickerColorValue, Popover, parseColor } from "prime-ui-kit";
import * as React from "react";

const PRESETS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#8b5cf6"];

/**
 * Custom color square on the trigger (`style.backgroundColor`) instead of `TriggerSwatch`;
 * `ColorPicker.Root` lives inside `Popover.Content` (playground `popover`).
 */
export function ReadoutTriggerExample() {
  const [color, setColor] = React.useState<ColorPickerColorValue | undefined>(
    parseColor("#3b82f6"),
  );
  const [open, setOpen] = React.useState(false);

  const colorString = color?.toString("css") ?? "#000000";

  return (
    <Popover.Root onOpenChange={setOpen} open={open}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          <span
            aria-hidden
            style={{
              boxSizing: "border-box",
              display: "inline-block",
              flexShrink: 0,
              width: "1rem",
              height: "1rem",
              borderRadius: "var(--prime-sys-shape-radius-s, 0.25rem)",
              border: "1px solid var(--prime-sys-color-border-primary, currentColor)",
              backgroundColor: colorString,
            }}
          />
          {colorString}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
        <ColorPicker.Root onChange={setColor} value={color}>
          <ColorPicker.FormatProvider>
            <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
              <ColorPicker.AreaThumb />
            </ColorPicker.Area>
            <ColorPicker.Slider channel="hue" colorSpace="hsl">
              <ColorPicker.SliderTrack>
                <ColorPicker.Thumb />
              </ColorPicker.SliderTrack>
            </ColorPicker.Slider>
            <ColorPicker.Slider channel="alpha">
              <ColorPicker.SliderTrack>
                <ColorPicker.Thumb />
              </ColorPicker.SliderTrack>
            </ColorPicker.Slider>
            <ColorPicker.ChannelStrip
              pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
            />
            <ColorPicker.SwatchPicker aria-label="Quick colors">
              {PRESETS.map((c) => (
                <ColorPicker.SwatchPickerItem key={c} color={c}>
                  <ColorPicker.Swatch />
                </ColorPicker.SwatchPickerItem>
              ))}
            </ColorPicker.SwatchPicker>
          </ColorPicker.FormatProvider>
        </ColorPicker.Root>
      </Popover.Content>
    </Popover.Root>
  );
}

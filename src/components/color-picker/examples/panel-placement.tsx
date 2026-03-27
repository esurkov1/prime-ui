import { Pipette } from "lucide-react";
import { Button, ColorPicker, Popover, Typography } from "prime-ui-kit";

const PRESETS = ["#6366f1", "#a855f7", "#ec4899", "#f97316"];

function Panel() {
  return (
    <ColorPicker.FormatProvider>
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
      <Typography.Root as="p" tone="muted" variant="body-small" weight="medium">
        Presets
      </Typography.Root>
      <ColorPicker.SwatchPicker aria-label="Quick colors">
        {PRESETS.map((c) => (
          <ColorPicker.SwatchPickerItem key={c} color={c}>
            <ColorPicker.Swatch />
          </ColorPicker.SwatchPickerItem>
        ))}
      </ColorPicker.SwatchPicker>
    </ColorPicker.FormatProvider>
  );
}

/** Same panel with `Popover.Content` `side="bottom"` vs `side="top"` (playground `panel-placement`). */
export function PanelPlacementExample() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-start" }}>
      <ColorPicker.Root defaultValue="hsl(265, 80%, 55%)">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" size="m" variant="neutral">
              <ColorPicker.TriggerSwatch />
              Bottom
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
            <Panel />
          </Popover.Content>
        </Popover.Root>
      </ColorPicker.Root>

      <ColorPicker.Root defaultValue="hsl(200, 70%, 48%)">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" size="m" variant="neutral">
              <ColorPicker.TriggerSwatch />
              Top
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="top">
            <Panel />
          </Popover.Content>
        </Popover.Root>
      </ColorPicker.Root>
    </div>
  );
}

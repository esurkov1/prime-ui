import { Button, ColorPicker, Popover } from "prime-ui-kit";

/** Smallest valid popover field: matches the documented composition skeleton. */
export function MinimalPopoverExample() {
  return (
    <ColorPicker.Root defaultValue="#3b82f6">
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            <ColorPicker.TriggerSwatch />
            Color
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
          <ColorPicker.FormatProvider>
            <ColorPicker.FormatSelect />
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

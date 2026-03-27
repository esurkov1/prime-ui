import { Pipette } from "lucide-react";
import { Button, ColorPicker, type ColorValueFormat, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

function FormatPopover({
  title,
  defaultFormat,
}: {
  title: string;
  defaultFormat: ColorValueFormat;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "flex", minWidth: 0, flexDirection: "column", gap: "0.5rem" }}>
      <Typography.Root as="p" variant="body-small" weight="medium">
        {title}
      </Typography.Root>
      <ColorPicker.Root defaultValue="hsl(200, 75%, 52%)">
        <Popover.Root onOpenChange={setOpen} open={open}>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" variant="neutral">
              <ColorPicker.TriggerSwatch />
              Open ({defaultFormat.toUpperCase()})
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom">
            <ColorPicker.FormatProvider defaultFormat={defaultFormat}>
              <ColorPicker.FormatSelect />
              <ColorPicker.ChannelStrip
                pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
              />
            </ColorPicker.FormatProvider>
          </Popover.Content>
        </Popover.Root>
      </ColorPicker.Root>
    </div>
  );
}

/** Three `FormatProvider` defaults: HSL, RGB, hex channel strip (playground `format-variants`). */
export function FormatVariantsExample() {
  return (
    <div
      style={{
        display: "grid",
        width: "100%",
        maxWidth: "100%",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
      }}
    >
      <FormatPopover defaultFormat="hsl" title="HSL channels + alpha" />
      <FormatPopover defaultFormat="rgb" title="RGB channels + alpha" />
      <FormatPopover defaultFormat="hex" title="Hex #RRGGBB" />
    </div>
  );
}

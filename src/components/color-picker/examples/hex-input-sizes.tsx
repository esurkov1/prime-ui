import { Button, ColorPicker, Popover } from "prime-ui-kit";
import * as React from "react";

const SIZES = ["s", "m", "l", "xl"] as const;

function HexSizePopover({ size }: { size: (typeof SIZES)[number] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <ColorPicker.Root defaultValue="#3b82f6">
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            Hex ({size})
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
          <ColorPicker.HexInput label={`Hex (${size})`} size={size} />
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

/** HexInput `size` axis (`s`–`xl`); each control uses its own popover (playground `hex-input-sizes`). */
export function HexInputSizesExample() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "1rem" }}>
      {SIZES.map((size) => (
        <HexSizePopover key={size} size={size} />
      ))}
    </div>
  );
}

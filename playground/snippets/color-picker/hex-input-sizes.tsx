import * as React from "react";

import { Button } from "@/components/button/Button";
import { ColorPicker } from "@/components/color-picker/ColorPicker";
import { Popover } from "@/components/popover/Popover";
import ExampleSurface from "../../components/ExampleSurface";

import preview from "./preview.module.css";

const SIZES = ["s", "m", "l", "xl"] as const;

function HexSizePopover({ size }: { size: (typeof SIZES)[number] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <ColorPicker.Root defaultValue="#3b82f6">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            Hex ({size})
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <Popover.Inset padding="x2" gap="x3">
            <ColorPicker.HexInput label={`Hex (${size})`} size={size} />
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

export default function ColorPickerHexInputSizesSnippet() {
  return (
    <ExampleSurface className={preview.sizesRow}>
      {SIZES.map((size) => (
        <HexSizePopover key={size} size={size} />
      ))}
    </ExampleSurface>
  );
}

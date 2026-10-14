/** The parent opens the preset palette from its own button and keeps the chosen color — `open`, `onOpenChange`, `value`, `onValueChange`. */
import { Button, COLOR_PRESETS, ColorPresets, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PRESETS = COLOR_PRESETS.slice(0, 8);

export default function ColorPickerControlledOpenExample() {
  const [open, setOpen] = React.useState(false);
  const [color, setColor] = React.useState<string | null>("#ef4444");
  const name = PRESETS.find((preset) => preset.value === color)?.label ?? "без цвета";

  return (
    <div className={styles.inlineRow}>
      <ColorPresets.Root
        presets={PRESETS}
        value={color}
        onValueChange={setColor}
        open={open}
        onOpenChange={setOpen}
        labels={{ trigger: "Цвет метки «Срочно»" }}
      >
        <ColorPresets.Trigger>
          <ColorPresets.SwatchButton />
        </ColorPresets.Trigger>
        <ColorPresets.Content label="Цвет метки «Срочно»" />
      </ColorPresets.Root>
      <Typography as="span" variant="body-s" tone="secondary">
        Метка «Срочно»: {name}
      </Typography>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Сменить цвет
      </Button.Root>
    </div>
  );
}

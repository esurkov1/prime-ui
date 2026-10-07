/** A quick color from a fixed palette: a compact ColorPresets trigger next to a field (one row of 8 with «no color»), the full palette inline with ColorSwatches when the color is a field of its own, and a custom Button trigger via asChild. */
import { Button, COLOR_PRESETS, ColorPresets, ColorSwatches, Input, Label } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ColorPresetsQuickExample() {
  return (
    <div className={styles.stack}>
      {/* 8 presets + "no color": one row. */}
      <div className={styles.field}>
        <Label.Root htmlFor="preset-tag-name">Метка</Label.Root>
        <div className={styles.row}>
          <ColorPresets.Root presets={COLOR_PRESETS.slice(0, 8)} allowEmpty defaultValue="#5068f5">
            <ColorPresets.Trigger />
            <ColorPresets.Content />
          </ColorPresets.Root>
          <Input.Root id="preset-tag-name">
            <Input.Wrapper>
              <Input.Field defaultValue="Дизайн" />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>

      {/* The color is a field of its own: all 16 presets inline, no popover. */}
      <ColorSwatches.Root label="Цвет проекта" defaultValue="#a16207" />

      {/* Custom trigger: a Button with the current color as its icon. */}
      <div className={styles.inlineRow}>
        <ColorPresets.Root defaultValue="#22c55e">
          <ColorPresets.Trigger asChild>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <ColorPresets.Swatch />
              </Button.Icon>
              Цвет
            </Button.Root>
          </ColorPresets.Trigger>
          <ColorPresets.Content />
        </ColorPresets.Root>
      </div>
    </div>
  );
}

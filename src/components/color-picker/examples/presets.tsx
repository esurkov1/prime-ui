/** A quick color from the palette: a square trigger next to a field and a Button trigger; «no color» allowed — `ColorPresets`, `allowEmpty`, `asChild`. */
import { Button, COLOR_PRESETS, ColorPresets } from "prime-ui-kit";

import styles from "./examples.module.css";

const ONE_ROW = COLOR_PRESETS.slice(0, 8);

export default function ColorPickerPresetsExample() {
  return (
    <div className={styles.inlineRow}>
      <ColorPresets.Root
        presets={ONE_ROW}
        allowEmpty
        defaultValue="#5068f5"
        labels={{ trigger: "Цвет метки" }}
      >
        <ColorPresets.Trigger />
        <ColorPresets.Content />
      </ColorPresets.Root>
      <ColorPresets.Root defaultValue="#22c55e">
        <ColorPresets.Trigger asChild>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <ColorPresets.Swatch />
            </Button.Icon>
            Цвет проекта
          </Button.Root>
        </ColorPresets.Trigger>
        <ColorPresets.Content label="Цвет проекта" />
      </ColorPresets.Root>
    </div>
  );
}

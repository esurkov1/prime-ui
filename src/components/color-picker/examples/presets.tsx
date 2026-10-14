/** A quick color from the palette: a square trigger with «no color» and a Button trigger whose grid of four columns stays open after a pick — `ColorPresets`, `allowEmpty`, `ColorPresets.Trigger`, `columns`, `closeOnSelect`. */
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
        <ColorPresets.Trigger>
          <ColorPresets.SwatchButton />
        </ColorPresets.Trigger>
        <ColorPresets.Content />
      </ColorPresets.Root>
      <ColorPresets.Root presets={ONE_ROW} columns={4} closeOnSelect={false} defaultValue="#22c55e">
        <ColorPresets.Trigger>
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

/** ColorPresets as a quick color next to a field: one row of 8 with «no color», the default 8×2 grid with a heading, and a custom Button trigger via asChild. Use it when a fixed palette is enough. */
import { Button, COLOR_PRESETS, ColorPresets, Input, Label } from "prime-ui-kit";

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

      {/* 16 presets (default): 8 × 2, with a section label. */}
      <div className={styles.field}>
        <Label.Root htmlFor="preset-project-name">Проект</Label.Root>
        <div className={styles.row}>
          <ColorPresets.Root defaultValue="#a16207">
            <ColorPresets.Trigger />
            <ColorPresets.Content label="Цвет проекта" />
          </ColorPresets.Root>
          <Input.Root id="preset-project-name">
            <Input.Wrapper>
              <Input.Field defaultValue="Редизайн сайта" />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>

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

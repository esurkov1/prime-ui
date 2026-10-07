/** Controlled value with a «no color» swatch after one row of eight presets. Use it when the color is optional. */
import { COLOR_PRESETS, ColorSwatches, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const presets = COLOR_PRESETS.slice(0, 8);

export default function ColorSwatchesAllowEmptyExample() {
  const [color, setColor] = React.useState<string | null>(null);
  const name = presets.find((p) => p.value === color)?.label ?? "без цвета";

  return (
    <div className={styles.stack}>
      <ColorSwatches.Root
        label="Цвет метки"
        optional
        presets={presets}
        allowEmpty
        value={color}
        onValueChange={setColor}
      />
      <Typography.Root variant="body-s" tone="secondary">
        Выбрано: {name}
      </Typography.Root>
    </div>
  );
}

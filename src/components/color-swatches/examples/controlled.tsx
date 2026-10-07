/** The parent owns the color, «no color» included, and names it in the hint — `value`, `onValueChange`, `allowEmpty`. */
import { COLOR_PRESETS, ColorSwatches } from "prime-ui-kit";
import * as React from "react";

const PRESETS = COLOR_PRESETS.slice(0, 8);

export default function ColorSwatchesControlledExample() {
  const [color, setColor] = React.useState<string | null>(null);
  const name = PRESETS.find((preset) => preset.value === color)?.label ?? "без цвета";

  return (
    <ColorSwatches
      label="Цвет метки"
      optional
      presets={PRESETS}
      allowEmpty
      value={color}
      onValueChange={setColor}
      hint={`Выбрано: ${name}`}
    />
  );
}

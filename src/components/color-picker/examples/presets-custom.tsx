/** A spec's color on the site: the brand palette one click away and any hex typed under it — `ColorPresets`, `allowCustom`. */
import { ColorPresets } from "prime-ui-kit";
import * as React from "react";

const BRAND_COLORS = [
  { value: "#5b5bd6", label: "Индиго" },
  { value: "#0090ff", label: "Синий" },
  { value: "#12a594", label: "Бирюзовый" },
  { value: "#30a46c", label: "Зелёный" },
  { value: "#f76b15", label: "Оранжевый" },
  { value: "#e5484d", label: "Красный" },
];

export default function ColorPickerPresetsCustomExample() {
  const [color, setColor] = React.useState<string | null>("#8e4ec6");

  return (
    <ColorPresets.Root
      presets={BRAND_COLORS}
      allowCustom
      value={color}
      onValueChange={setColor}
      labels={{ trigger: "Цвет характеристики" }}
    >
      <ColorPresets.Trigger>
        <ColorPresets.SwatchButton />
      </ColorPresets.Trigger>
      <ColorPresets.Content label="Цвет характеристики" />
    </ColorPresets.Root>
  );
}

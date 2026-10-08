/** The parent owns the color: brand swatches and the hex field edit it, a button resets it — `value`, `onValueChange`. */
import { Button } from "prime-ui-kit";
import { ColorPicker, parseColor } from "prime-ui-kit/color-picker";
import * as React from "react";

import styles from "./examples.module.css";

const DEFAULT_COLOR = "#5b5bd6";
const BRAND_COLORS = [
  { value: "#5b5bd6", label: "Индиго" },
  { value: "#0090ff", label: "Синий" },
  { value: "#12a594", label: "Бирюзовый" },
  { value: "#f76b15", label: "Оранжевый" },
  { value: "#e5484d", label: "Красный" },
];

export default function ColorPickerControlledExample() {
  const [color, setColor] = React.useState(() => parseColor(DEFAULT_COLOR));

  return (
    <div className={styles.panel}>
      <ColorPicker.Root value={color} onValueChange={setColor}>
        <ColorPicker.HexInput label="Цвет витрины" hint={`Сейчас: ${color.toString("hex")}`} />
        <ColorPicker.Swatches aria-label="Цвета бренда" presets={BRAND_COLORS} />
      </ColorPicker.Root>
      <div>
        <Button.Root
          variant="soft"
          tone="neutral"
          onClick={() => setColor(parseColor(DEFAULT_COLOR))}
        >
          Сбросить
        </Button.Root>
      </div>
    </div>
  );
}

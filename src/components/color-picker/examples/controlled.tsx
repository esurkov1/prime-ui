/** The parent owns the color and its format: brand swatches and the channels edit it, the format stays as picked, a button resets both — `value`, `onValueChange`, `format`, `onFormatChange`. */
import { Button } from "prime-ui-kit";
import { ColorPicker, type ColorValueFormat, parseColor } from "prime-ui-kit/color-picker";
import * as React from "react";

import styles from "./examples.module.css";

const DEFAULT_COLOR = "#5b5bd6";
const DEFAULT_FORMAT: ColorValueFormat = "hex";
const BRAND_COLORS = [
  { value: "#5b5bd6", label: "Индиго" },
  { value: "#0090ff", label: "Синий" },
  { value: "#12a594", label: "Бирюзовый" },
  { value: "#f76b15", label: "Оранжевый" },
  { value: "#e5484d", label: "Красный" },
];

export default function ColorPickerControlledExample() {
  const [color, setColor] = React.useState(() => parseColor(DEFAULT_COLOR));
  const [format, setFormat] = React.useState<ColorValueFormat>(DEFAULT_FORMAT);

  return (
    <div className={styles.panel}>
      <ColorPicker.Root
        value={color}
        onValueChange={setColor}
        format={format}
        onFormatChange={setFormat}
      >
        <ColorPicker.FormatSelect />
        <ColorPicker.ChannelStrip />
        <ColorPicker.Swatches aria-label="Цвета бренда" presets={BRAND_COLORS} />
      </ColorPicker.Root>
      <div>
        <Button.Root
          variant="soft"
          tone="neutral"
          onClick={() => {
            setColor(parseColor(DEFAULT_COLOR));
            setFormat(DEFAULT_FORMAT);
          }}
        >
          Сбросить
        </Button.Root>
      </div>
    </div>
  );
}

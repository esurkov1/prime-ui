/** A button color checked live: a too light color shakes in an error that leaves once the color is darker; a hint under the other field, invalid text reverts on blur — `hint`, `error`. */
import { ColorPicker, parseColor } from "prime-ui-kit/color-picker";
import * as React from "react";

const MAX_LIGHTNESS = 80;

export default function ColorPickerValidationExample() {
  const [color, setColor] = React.useState(() => parseColor("#f5f5f5"));
  const tooLight = color.toFormat("hsl").getChannelValue("lightness") > MAX_LIGHTNESS;

  return (
    <>
      <ColorPicker.Root defaultValue="#0090ff">
        <ColorPicker.HexInput label="Цвет ссылок" hint="Формат #RRGGBB или #RRGGBBAA" />
      </ColorPicker.Root>
      <ColorPicker.Root value={color} onValueChange={setColor}>
        <ColorPicker.HexInput
          label="Цвет кнопок"
          error={tooLight ? "Слишком светлый: белый текст на нём не читается" : undefined}
        />
      </ColorPicker.Root>
    </>
  );
}

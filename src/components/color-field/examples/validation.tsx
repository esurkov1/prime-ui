/** A button color checked live: a too light color shakes in an error that leaves once the color is darker; a hint and an optional field — `required`, `optional`, `hint`, `error`. */
import { ColorField, parseColor } from "prime-ui-kit/color-picker";
import * as React from "react";

const MAX_LIGHTNESS = 80;

/** The error for a color white text cannot sit on, or nothing. */
function contrastError(value: string) {
  const lightness = parseColor(value).toFormat("hsl").getChannelValue("lightness");
  return lightness > MAX_LIGHTNESS ? "Слишком светлый: белый текст на нём не читается" : undefined;
}

export default function ColorFieldValidationExample() {
  const [buttonColor, setButtonColor] = React.useState("#F2F2F2");

  return (
    <>
      <ColorField
        label="Цвет кнопок"
        required
        hint="Под белый текст кнопки"
        value={buttonColor}
        onValueChange={setButtonColor}
        error={contrastError(buttonColor)}
      />
      <ColorField label="Цвет ссылок" optional defaultValue="#0090ff" />
    </>
  );
}

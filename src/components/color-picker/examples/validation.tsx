/** A hint under the hex field and an error that replaces it; invalid text reverts on blur — `hint`, `error`. */
import { ColorPicker } from "prime-ui-kit";

export default function ColorPickerValidationExample() {
  return (
    <>
      <ColorPicker.Root defaultValue="#0090ff">
        <ColorPicker.HexInput label="Цвет ссылок" hint="Формат #RRGGBB или #RRGGBBAA" />
      </ColorPicker.Root>
      <ColorPicker.Root defaultValue="#f5f5f5">
        <ColorPicker.HexInput
          label="Цвет кнопок"
          error="Слишком светлый: белый текст на нём не читается"
        />
      </ColorPicker.Root>
    </>
  );
}

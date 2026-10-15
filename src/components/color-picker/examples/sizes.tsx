/** Every tier of the picker: the hex field and its swatch segment take it from the root — `size`. */
import { ColorPicker } from "prime-ui-kit/color-picker";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ColorPickerSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <ColorPicker.Root defaultValue="#0090ff" size={size}>
            <ColorPicker.HexInput label={size}>
              <ColorPicker.SwatchButton />
            </ColorPicker.HexInput>
          </ColorPicker.Root>
        </div>
      ))}
    </div>
  );
}

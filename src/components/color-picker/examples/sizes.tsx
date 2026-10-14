/** Every tier of the picker: the hex field and a swatch button inside take it from the root — `size`. */
import { Button } from "prime-ui-kit";
import { ColorPicker } from "prime-ui-kit/color-picker";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ColorPickerSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <ColorPicker.Root defaultValue="#0090ff" size={size}>
            <ColorPicker.HexInput label={size} />
            <Button.Root variant="soft" tone="neutral" aria-label="Открыть палитру">
              <Button.Icon>
                <ColorPicker.TriggerSwatch />
              </Button.Icon>
            </Button.Root>
          </ColorPicker.Root>
        </div>
      ))}
    </div>
  );
}

/** Every tier of the picker: the hex field and a swatch button inside take it from the root — `size`. */
import { Button } from "prime-ui-kit";
import { ColorPicker } from "prime-ui-kit/color-picker";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ColorPickerSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <ColorPicker.Root key={size} defaultValue="#0090ff" size={size}>
          <div className={styles.fieldRow}>
            <ColorPicker.HexInput label={size} />
            <Button.Root variant="soft" tone="neutral" aria-label="Открыть палитру">
              <Button.Icon>
                <ColorPicker.TriggerSwatch />
              </Button.Icon>
            </Button.Root>
          </div>
        </ColorPicker.Root>
      ))}
    </>
  );
}

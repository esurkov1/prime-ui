/** Every size of the hex field with a swatch button of the same tier — `size`. */
import { Button } from "prime-ui-kit";
import { ColorPicker } from "prime-ui-kit/color-picker";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ColorPickerSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <ColorPicker.Root key={size} defaultValue="#0090ff">
          <div className={styles.fieldRow}>
            <ColorPicker.HexInput label={size} size={size} />
            <Button.Root variant="soft" tone="neutral" size={size} aria-label="Открыть палитру">
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

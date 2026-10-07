/** ColorPresets in every size tier next to an Input of the same size: the trigger is a square of the control height. Use it to line the swatch trigger up with fields. */
import { ColorPresets, Input, Label } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ColorPresetsSizesExample() {
  return (
    <div className={styles.stack}>
      {SIZES.map((size) => (
        <div key={size} className={styles.field}>
          <Label.Root size={size} htmlFor={`preset-size-${size}`}>
            Метка · {size}
          </Label.Root>
          <div className={styles.row}>
            <ColorPresets.Root size={size} defaultValue="#f97316">
              <ColorPresets.Trigger />
              <ColorPresets.Content />
            </ColorPresets.Root>
            <Input.Root size={size} id={`preset-size-${size}`}>
              <Input.Wrapper>
                <Input.Field defaultValue="Маркетинг" />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </div>
      ))}
    </div>
  );
}
